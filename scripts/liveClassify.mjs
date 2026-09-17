import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawProposalsPath = path.join(__dirname, '../proposals.json');
const outputPath = path.join(__dirname, '../src/data/enrichedProposals.json');

const apiKey = process.env.TYPESAFE_API_KEY?.trim();

if (!apiKey) {
  console.error('\x1b[31mError: TYPESAFE_API_KEY is not set.\x1b[0m');
  console.error('Please set TYPESAFE_API_KEY in .env or run with:');
  console.error('  TYPESAFE_API_KEY="your_key" npm run enrich:api');
  process.exit(1);
}

const rawRaw = JSON.parse(fs.readFileSync(rawProposalsPath, 'utf8'));

// Generate unique, stable IDs for every proposal
function getProposalKey(p, idx) {
  if (p.id) return p.id;
  const slug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `item-${idx}`;
  return `proposal-${slug}`;
}

const seenIds = new Set();
const raw = rawRaw.map((p, idx) => {
  let id = p.id || getProposalKey(p, idx);
  if (seenIds.has(id)) {
    id = `${id}-stage-${p.stage ?? 'x'}`;
  }
  if (seenIds.has(id)) {
    id = `${id}-${idx}`;
  }
  seenIds.add(id);
  return {
    ...p,
    id,
    stage: p.stage ?? 0,
  };
});

const existing = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  : [];

// Build existing map by id and by name fallback
const enrichedMap = new Map();
for (const p of existing) {
  if (p.id) enrichedMap.set(p.id, p);
  if (p.name) enrichedMap.set(`name::${p.name}::${p.stage}`, p);
}

// Parse CLI arguments
const args = process.argv.slice(2);
let limit = Infinity;
let targetId = null;
let concurrency = 4;
let force = false;
let activeOnly = false;

for (const arg of args) {
  if (arg.startsWith('--limit=')) {
    limit = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--id=')) {
    targetId = arg.split('=')[1];
  } else if (arg.startsWith('--concurrency=')) {
    concurrency = Math.max(1, parseInt(arg.split('=')[1], 10));
  } else if (arg === '--force') {
    force = true;
  } else if (arg === '--active-only') {
    activeOnly = true;
  }
}

// Filter targets
let candidates = raw;
if (targetId) {
  candidates = candidates.filter((p) => p.id === targetId);
} else if (activeOnly) {
  candidates = candidates.filter((p) => p.stage !== undefined && p.stage >= 0);
}

// Check which candidates still need classification (or missing intent / metrics)
const targets = [];
for (const p of candidates) {
  const curr = enrichedMap.get(p.id) || enrichedMap.get(`name::${p.name}::${p.stage}`);
  if (force || !curr?.semantic?.liveClassified || !curr?.semantic?.intent) {
    targets.push(p);
  }
}

const queue = targets.slice(0, limit);

console.log(`\x1b[36m========================================================\x1b[0m`);
console.log(`\x1b[36mTypeSafe AI (Jev) Multi-Metric TC39 Enrichment Pipeline\x1b[0m`);
console.log(`\x1b[36m========================================================\x1b[0m`);
console.log(`Total proposals in dataset: ${raw.length}`);
console.log(`Proposals to process:      ${queue.length}`);
console.log(`Concurrency:               ${concurrency}`);
console.log(`Force re-classify:         ${force ? 'YES' : 'NO'}`);
console.log(`--------------------------------------------------------\n`);

if (queue.length === 0) {
  console.log(`\x1b[32mAll proposals are already classified with all 5 metrics!\x1b[0m`);
  console.log(`Use --force to re-classify everything.`);
  saveDataset();
  process.exit(0);
}

async function classifyProposalWithJev(proposal, retries = 3) {
  const requestBody = {
    model: 'jev-latest',
    state: {
      name: proposal.name,
      description: proposal.description || 'No description provided.',
      stage: proposal.stage ?? 0,
      tags: proposal.tags || [],
      authors: proposal.authors || [],
      champions: proposal.champions || [],
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
        instructions: 'Who is the primary beneficiary of this feature in the ecosystem?',
        criteria: {
          application_developers: 'Everyday app developers building products',
          library_authors: 'Framework, tool, and utility authors',
          engine_implementers: 'JavaScript engine implementers and VM writers',
        },
      },
      // 1. Adoption Path
      adoption: {
        type: 'choice',
        instructions: 'What is the primary adoption pathway for developers to use this feature today?',
        criteria: {
          userland_polyfillable: 'Can be polyfilled in userland or standard library without compiler changes',
          build_transpilable: 'Requires a build-time transpiler like Babel, SWC, or TypeScript to desugar',
          native_engine_required: 'Cannot be polyfilled cleanly; requires native JS engine runtime support',
        },
      },
      // 2. Cognitive Overhead
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
      // 3. Primary Motivation
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
      // 4. Web Compatibility Risk
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
      // 5. Signals (Noul Primitives)
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

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.typesafe.ai/v1/systemone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 429) {
        const waitMs = attempt * 1500;
        console.warn(`[429 Rate Limit] Backing off ${waitMs}ms before retry ${attempt}/${retries}...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TypeSafe API error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      const { answers } = result;

      // Complexity Level mapping
      const complexityScore = answers.complexity.score;
      let complexityLevel = 'ergonomic_sugar';
      if (complexityScore >= 3.5) complexityLevel = 'deep_runtime_primitive';
      else if (complexityScore >= 2.6) complexityLevel = 'new_lexical_semantics';
      else if (complexityScore <= 1.6) complexityLevel = 'trivial_additive';

      // Cognitive Overhead Level mapping
      const cogScore = answers.cognitiveOverhead?.score ?? 1.5;
      let cognitiveLevel = 'low';
      if (cogScore >= 2.8) cognitiveLevel = 'paradigm_shift';
      else if (cogScore >= 1.9) cognitiveLevel = 'moderate';
      else if (cogScore >= 1.0) cognitiveLevel = 'low';
      else cognitiveLevel = 'minimal';

      // Web Compat Risk Level mapping
      const compatScore = answers.webCompatRisk?.score ?? 0.8;
      let webCompatLevel = 'low';
      if (compatScore >= 2.8) webCompatLevel = 'high';
      else if (compatScore >= 1.9) webCompatLevel = 'moderate';
      else if (compatScore >= 1.0) webCompatLevel = 'low';
      else webCompatLevel = 'negligible';

      // Extract tags
      const tags = [answers.domain.choice];
      const desc = (proposal.description || '').toLowerCase();
      if (/immutable|record|tuple/.test(desc)) tags.push('Immutability');
      if (/async|promise|await/.test(desc)) tags.push('Async');
      if (/security|private|isolation/.test(desc)) tags.push('Security');
      if (/performance|memory|buffer/.test(desc)) tags.push('Performance');

      return {
        ...proposal,
        stage: proposal.stage ?? 0,
        semantic: {
          domain: answers.domain.choice,
          domainConfidence: answers.domain.confidence,
          domainDist: answers.domain.probabilities,
          complexity: {
            level: complexityLevel,
            score: complexityScore,
            rationale: `Evaluated by Jev (${answers.complexity.confidence ? `confidence ${(answers.complexity.confidence * 100).toFixed(0)}%` : 'calibrated'}).`,
          },
          beneficiary: answers.beneficiary.choice,
          beneficiaryConfidence: answers.beneficiary.confidence,

          // 5 Multidimensional Metrics
          adoption: {
            choice: answers.adoption?.choice || 'userland_polyfillable',
            confidence: answers.adoption?.confidence || 0.8,
            probabilities: answers.adoption?.probabilities || {},
          },
          cognitiveOverhead: {
            score: Number(cogScore.toFixed(2)),
            level: cognitiveLevel,
            confidence: answers.cognitiveOverhead?.confidence || 0.8,
          },
          motivation: {
            choice: answers.motivation?.choice || 'ergonomics_brevity',
            confidence: answers.motivation?.confidence || 0.8,
            probabilities: answers.motivation?.probabilities || {},
          },
          webCompatRisk: {
            score: Number(compatScore.toFixed(2)),
            level: webCompatLevel,
            confidence: answers.webCompatRisk?.confidence || 0.8,
          },
          signals: {
            sandboxingSecurity: Number((answers.isSandboxingSecurity?.noul ?? 0).toFixed(2)),
            requiresTypeScript: Number((answers.requiresTypeScriptChanges?.noul ?? 0).toFixed(2)),
            affectsMemoryModel: Number((answers.affectsMemoryModel?.noul ?? 0).toFixed(2)),
          },
          intent: {
            archetype: answers.intent?.choice || 'standardizing_de_facto',
            confidence: answers.intent?.confidence || 0.8,
            probabilities: answers.intent?.probabilities || {},
          },

          tags: [...new Set(tags)],
          liveClassified: true,
          classifiedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
}

function saveDataset() {
  const updatedList = raw.map((p) => {
    const enriched = enrichedMap.get(p.id) || enrichedMap.get(`name::${p.name}::${p.stage}`);
    if (enriched && enriched.semantic) {
      return {
        ...p,
        semantic: enriched.semantic,
      };
    }
    return p;
  });
  fs.writeFileSync(outputPath, JSON.stringify(updatedList, null, 2), 'utf8');
}

async function run() {
  const startTime = Date.now();
  let completed = 0;
  let successCount = 0;
  let failCount = 0;

  let index = 0;

  async function worker() {
    while (index < queue.length) {
      const currIndex = index++;
      const target = queue[currIndex];

      try {
        const enriched = await classifyProposalWithJev(target);
        enrichedMap.set(target.id, enriched);
        enrichedMap.set(`name::${target.name}::${target.stage}`, enriched);
        successCount++;
        completed++;
        console.log(
          `[\x1b[32m${completed}/${queue.length}\x1b[0m] \x1b[1m${target.name}\x1b[0m -> [${enriched.semantic.intent?.archetype}] | [${enriched.semantic.adoption.choice}]`
        );
      } catch (err) {
        failCount++;
        completed++;
        console.log(
          `[\x1b[31m${completed}/${queue.length}\x1b[0m] \x1b[31mFAILED\x1b[0m ${target.name}: ${err.message}`
        );
      }

      if (completed % 10 === 0) {
        saveDataset();
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, () => worker());
  await Promise.all(workers);

  saveDataset();

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalLive = Array.from(raw).filter((p) => {
    const e = enrichedMap.get(p.id) || enrichedMap.get(`name::${p.name}::${p.stage}`);
    return e?.semantic?.adoption;
  }).length;

  console.log(`\n\x1b[32m========================================================\x1b[0m`);
  console.log(`\x1b[32mBatch Multi-Metric Enrichment Complete in ${totalTimeSec}s!\x1b[0m`);
  console.log(`Successfully classified this run: ${successCount}`);
  console.log(`Failed this run:                 ${failCount}`);
  console.log(`Total 5-metric proposals:        ${totalLive} / ${raw.length}`);
  console.log(`Saved enriched proposals to:     ${outputPath}`);
  console.log(`\x1b[32m========================================================\x1b[0m`);
}

run().catch((err) => {
  console.error('Fatal error running batch classification:', err);
  process.exit(1);
});
