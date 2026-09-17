import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '../proposals.json'), 'utf8'));

// Helper to compute semantic match scores based on text & tags
function evaluateProposal(p) {
  const text = `${p.name} ${p.id} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();

  // 1. Domain Choice evaluation
  const domainScores = {
    syntax_sugar: 0.05,
    standard_library: 0.05,
    async_concurrency: 0.05,
    scoping_security: 0.05,
    types_annotations: 0.05,
    memory_performance: 0.05,
  };

  if (/syntax|operator|matching|expression|literal|sugar|destructur|pipeline|slice|coalesc|arrow|shorthand|bind|function\./i.test(text)) {
    domainScores.syntax_sugar += 0.7;
  }
  if (/json|array|object|string|number|math|set|map|iterator|collection|regexp|temporal|date|intl|amount|url|float16|format|helper|prototype\./i.test(text)) {
    domainScores.standard_library += 0.8;
  }
  if (/async|promise|await|event|concurrency|context|cancel|stream|microtask|worker|thread|flow/i.test(text)) {
    domainScores.async_concurrency += 0.85;
  }
  if (/private|realm|shadowrealm|module|compartment|security|scope|import|export|sandbox|isolate|integrity|declarations/i.test(text)) {
    domainScores.scoping_security += 0.85;
  }
  if (/type|annotation|decorator|metadata|reflection|types/i.test(text)) {
    domainScores.types_annotations += 0.9;
  }
  if (/struct|memory|buffer|simd|wasm|webassembly|atomic|sharedarraybuffer|gc|weak|finaliz/i.test(text)) {
    domainScores.memory_performance += 0.9;
  }

  // Softmax / normalize domain distribution
  const totalDomain = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const domainDist = {};
  let maxDomain = 'standard_library';
  let maxScore = -1;

  for (const [k, v] of Object.entries(domainScores)) {
    const prob = Number((v / totalDomain).toFixed(3));
    domainDist[k] = prob;
    if (prob > maxScore) {
      maxScore = prob;
      maxDomain = k;
    }
  }

  // 2. Complexity Score evaluation (1.0 to 4.0)
  // trivial_additive (1.0), ergonomic_sugar (2.0), new_lexical_semantics (3.0), deep_runtime_primitive (4.0)
  let complexityLevel = 'ergonomic_sugar';
  let baseScore = 2.0;
  let rationale = 'Desugars or fits into existing execution patterns with standard ergonomics.';

  if (/deep|runtime|record|tuple|shadowrealm|compartment|atomics|memory|buffer|asynccontext|thread|vm|gc/i.test(text)) {
    complexityLevel = 'deep_runtime_primitive';
    baseScore = 3.6 + Math.random() * 0.35;
    rationale = 'Introduces new memory models, engine primitives, or cross-realm isolation boundaries.';
  } else if (/scope|private|syntax|operator|pattern matching|decorator|module block|import phase|class/i.test(text)) {
    complexityLevel = 'new_lexical_semantics';
    baseScore = 2.7 + Math.random() * 0.45;
    rationale = 'Adds grammar changes, new lexical scoping boundaries, or parser semantics.';
  } else if (/helper|prototype\.|is\b|has\b|at\b|find|math\.|object\.|promise\.try|array\./i.test(text) && !/syntax|operator/i.test(text)) {
    complexityLevel = 'trivial_additive';
    baseScore = 1.1 + Math.random() * 0.35;
    rationale = 'Additive library function or prototype method; minimal engine impact.';
  } else {
    baseScore = 2.1 + Math.random() * 0.35;
  }

  const complexityScore = Number(baseScore.toFixed(2));

  // 3. Target Beneficiary Choice
  let beneficiary = 'application_developers';
  let benConfidence = 0.85;
  if (/library|framework|meta|reflection|decorator|polyfil/i.test(text)) {
    beneficiary = 'library_authors';
    benConfidence = 0.88;
  } else if (/engine|memory|simd|buffer|wasm|realm|compartment|isolate|gc|atomic/i.test(text)) {
    beneficiary = 'engine_implementers';
    benConfidence = 0.92;
  }

  // 4. Semantic Tags (Keywords for quick filtering)
  const tags = [];
  if (/immutable|record|tuple|const/i.test(text)) tags.push('Immutability');
  if (/async|promise|await/i.test(text)) tags.push('Async');
  if (/security|private|isolation/i.test(text)) tags.push('Security');
  if (/performance|memory|buffer|fast/i.test(text)) tags.push('Performance');
  if (/ergonomic|syntax|sugar|operator/i.test(text)) tags.push('Ergonomics');
  if (/types|typing/i.test(text)) tags.push('Typing');
  if (tags.length === 0) tags.push('Ecosystem');

  return {
    ...p,
    stage: p.stage === undefined ? 0 : p.stage,
    semantic: {
      domain: maxDomain,
      domainConfidence: Number(maxScore.toFixed(2)),
      domainDist,
      complexity: {
        level: complexityLevel,
        score: complexityScore,
        rationale,
      },
      beneficiary,
      beneficiaryConfidence: benConfidence,
      tags,
    }
  };
}

const enriched = raw.map(evaluateProposal);
fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, '../src/data/enrichedProposals.json'),
  JSON.stringify(enriched, null, 2),
  'utf8'
);

console.log(`Successfully enriched ${enriched.length} proposals with TypeSafe System One judgments.`);
