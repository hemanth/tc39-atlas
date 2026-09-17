import type { Connect } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const TYPESAFE_API_URL = 'https://api.typesafe.ai/v1/systemone';

function getApiKey(): string {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/TYPESAFE_API_KEY=([^\r\n]+)/);
      if (match && match[1]?.trim()) {
        process.env.TYPESAFE_API_KEY = match[1].trim();
        return match[1].trim();
      } else {
        process.env.TYPESAFE_API_KEY = '';
        return '';
      }
    }
  } catch {}
  return process.env.TYPESAFE_API_KEY?.trim() || '';
}

function maskKey(key: string): string | null {
  if (!key) return null;
  if (key.length <= 8) return '****' + key.slice(-2);
  return key.slice(0, 4) + '...' + key.slice(-4);
}

export const typesafeMiddleware: Connect.NextHandleFunction = async (req, res, next) => {
  const url = req.url || '';

  if (!url.startsWith('/api/typesafe/')) {
    return next();
  }

  // Parse JSON body helper
  const readBody = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });
  };

  const sendJson = (status: number, data: any) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  try {
    // 1. GET /api/typesafe/status
    if (req.method === 'GET' && url === '/api/typesafe/status') {
      const key = getApiKey();
      return sendJson(200, {
        hasKey: Boolean(key),
        maskedKey: maskKey(key),
      });
    }

    // 2. POST /api/typesafe/set-key
    if (req.method === 'POST' && url === '/api/typesafe/set-key') {
      const { key } = await readBody();
      if (!key || typeof key !== 'string') {
        return sendJson(400, { error: 'Invalid API key provided' });
      }

      const trimmed = key.trim();
      process.env.TYPESAFE_API_KEY = trimmed;

      // Persist to .env
      const envPath = path.resolve(process.cwd(), '.env');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      if (/TYPESAFE_API_KEY=/.test(envContent)) {
        envContent = envContent.replace(/TYPESAFE_API_KEY=.*(\r?\n|$)/, `TYPESAFE_API_KEY=${trimmed}\n`);
      } else {
        envContent += `\nTYPESAFE_API_KEY=${trimmed}\n`;
      }

      fs.writeFileSync(envPath, envContent, 'utf8');

      return sendJson(200, {
        ok: true,
        hasKey: true,
        maskedKey: maskKey(trimmed),
      });
    }

    // 3. POST /api/typesafe/evaluate
    if (req.method === 'POST' && url === '/api/typesafe/evaluate') {
      const apiKey = getApiKey();
      if (!apiKey) {
        return sendJson(401, {
          error: 'No TypeSafe API key configured. Add TYPESAFE_API_KEY to .env or via the web UI.',
        });
      }

      const payload = await readBody();
      if (!payload.state || !payload.questions) {
        return sendJson(400, { error: 'Missing state or questions in request body' });
      }

      const requestBody = {
        model: payload.model || 'jev-latest',
        state: payload.state,
        questions: payload.questions,
      };

      const response = await fetch(TYPESAFE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        return sendJson(response.status, {
          error: data.error || data.message || 'Error from TypeSafe API',
          status: response.status,
          details: data,
        });
      }

      return sendJson(200, data);
    }

    // 4. POST /api/typesafe/classify-proposal
    // Single-call helper to classify a proposal into domain, complexity, and beneficiary
    if (req.method === 'POST' && url === '/api/typesafe/classify-proposal') {
      const apiKey = getApiKey();
      if (!apiKey) {
        return sendJson(401, { error: 'No TypeSafe API key configured.' });
      }

      const { proposal } = await readBody();
      if (!proposal) {
        return sendJson(400, { error: 'Missing proposal object' });
      }

      const requestBody = {
        model: 'jev-latest',
        state: {
          name: proposal.name,
          description: proposal.description,
          stage: proposal.stage,
          tags: proposal.tags,
          authors: proposal.authors,
        },
        questions: {
          domain: {
            type: 'choice',
            instructions: 'What technical domain of JavaScript does this proposal primarily affect?',
            criteria: {
              syntax_sugar: 'New operators, expressions, and ergonomic syntax',
              standard_library: 'Built-in objects, prototype methods, and globals',
              async_concurrency: 'Promises, AsyncContext, cancellation, streams',
              scoping_security: 'Private state, realms, compartments, modules',
              types_annotations: 'Type annotations, decorators, reflection',
              memory_performance: 'Structs, buffers, SIMD, WebAssembly, atomics',
            },
          },
          complexity: {
            type: 'score',
            instructions: 'Assess how disruptive or complex this proposal is to the JavaScript runtime.',
            criteria: [
              'Trivial additive helper method with minimal impact',
              'Ergonomic syntax sugar desugaring to existing behavior',
              'New lexical scoping boundaries, grammar changes, or parser semantics',
              'Deep runtime shift altering memory model, engine primitives, or realm isolation',
            ],
          },
          beneficiary: {
            type: 'choice',
            instructions: 'Who is the primary beneficiary of this feature?',
            criteria: {
              application_developers: 'Everyday app developers building products',
              library_authors: 'Framework, tool, and utility authors',
              engine_implementers: 'JavaScript engine implementers and VM writers',
            },
          },
          adoption: {
            type: 'choice',
            instructions: 'What is the primary adoption pathway for developers to use this feature today?',
            criteria: {
              userland_polyfillable: 'Can be polyfilled in userland or standard library without compiler changes',
              build_transpilable: 'Requires a build-time transpiler like Babel, SWC, or TypeScript to desugar',
              native_engine_required: 'Cannot be polyfilled cleanly; requires native JS engine runtime support',
            },
          },
          cognitiveOverhead: {
            type: 'score',
            instructions: 'Rate the cognitive overhead and mental model shift required for an everyday JavaScript developer to understand and use this feature.',
            criteria: [
              'Zero overhead: drop-in function or utility method',
              'Low overhead: intuitive idiom or small syntactic convenience',
              'Moderate overhead: introduces a new language construct or workflow pattern',
              'High overhead: major paradigm shift, deep new mental model or execution semantics',
            ],
          },
          motivation: {
            type: 'choice',
            instructions: 'What is the primary architectural driver or motivation behind this proposal?',
            criteria: {
              ergonomics_brevity: 'Reducing boilerplate, cleaner syntax, and concise expressions',
              defensive_safety: 'Immutability, sandboxing, isolation, or preventing runtime mutation bugs',
              performance_throughput: 'Memory efficiency, fast-path execution, zero-copy buffers, or raw speed',
              modernizing_legacy: 'Fixing legacy JavaScript quirks or modernizing obsolete standard APIs',
              concurrency_control: 'Async task coordination, cancellation, streaming, or scheduling',
            },
          },
          webCompatRisk: {
            type: 'score',
            instructions: 'Rate the risk of this proposal causing web-compatibility breaks with existing websites and legacy libraries.',
            criteria: [
              'Negligible risk: brand new syntax or isolated global namespace',
              'Low risk: additive prototype method with uncommon name',
              'Moderate risk: common identifier name that could conflict with legacy libraries like MooTools',
              'High risk: redefines existing runtime semantics, parser grammar, or global scope rules',
            ],
          },
          isSandboxingSecurity: {
            type: 'noul',
            instructions: 'Does this proposal primarily provide security boundaries, realm isolation, or defensive sandboxing?',
          },
          requiresTypeScriptChanges: {
            type: 'noul',
            instructions: 'Does this proposal require additions to type-system semantics or TypeScript syntax grammar?',
          },
          affectsMemoryModel: {
            type: 'noul',
            instructions: 'Does this proposal introduce new value types, raw memory allocations, or garbage-collection semantics?',
          },
          intent: {
            type: 'choice',
            instructions: 'What was the foundational real-world intent that prompted champions to create this proposal?',
            criteria: {
              expressive_composition: 'Making code more expressive, declarative, and pipeline-friendly with less boilerplate',
              cross_language_parity: 'Importing proven constructs from modern languages like Rust, Python, Ruby, or C#',
              hardening_integrity: 'Preventing prototype pollution, supply-chain exploits, realm leaks, or sandboxing security',
              standardizing_de_facto: 'Standardizing de-facto patterns already widely used in npm, Node.js, or browser libraries',
              runtime_vitality: 'Unlocking raw binary data, WASM interop, multi-threading, or high-throughput performance',
              correcting_historical_regrets: 'Replacing, repairing, or modernizing broken historical legacy JS APIs and design warts',
              framework_enablement: 'Empowering modern web frameworks, meta-frameworks, and tools with first-class primitives',
            },
          },
        },
      };

      const response = await fetch(TYPESAFE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        return sendJson(response.status, {
          error: data.error || data.message || 'Failed to classify with Jev',
          status: response.status,
          details: data,
        });
      }

      return sendJson(200, data);
    }

    return sendJson(404, { error: 'Not found' });
  } catch (err: any) {
    console.error('TypeSafe API proxy error:', err);
    return sendJson(500, { error: err.message || 'Internal server error' });
  }
};
