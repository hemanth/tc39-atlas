import {
  StageType,
  TypeSafeDomain,
  ComplexityLevel,
  BeneficiaryType,
  AdoptionPath,
  CognitiveOverheadLevel,
  MotivationType,
  WebCompatRiskLevel,
  IntentArchetype,
} from '../types';

export const stageColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
  '4': { bg: 'bg-pastel-mint', text: 'text-pastel-mintDeep', border: 'border-emerald-200', label: 'Stage 4: Finished' },
  '3': { bg: 'bg-pastel-sky', text: 'text-pastel-skyDeep', border: 'border-blue-200', label: 'Stage 3: Candidate' },
  '2.7': { bg: 'bg-pastel-periwinkle', text: 'text-pastel-periwinkleDeep', border: 'border-indigo-200', label: 'Stage 2.7: Spec Complete' },
  '2': { bg: 'bg-pastel-peach', text: 'text-pastel-peachDeep', border: 'border-amber-200', label: 'Stage 2: Draft' },
  '1': { bg: 'bg-pastel-butter', text: 'text-pastel-butterDeep', border: 'border-yellow-200', label: 'Stage 1: Proposal' },
  '0': { bg: 'bg-pastel-rose', text: 'text-pastel-roseDeep', border: 'border-rose-200', label: 'Stage 0: Strawman' },
  '-1': { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-200', label: 'Inactive / Withdrawn' },
};

export const getStageTheme = (stage: StageType) => {
  const key = String(stage);
  return stageColors[key] || stageColors['-1'];
};

export const domainLabels: Record<TypeSafeDomain, { name: string; desc: string; bg: string; text: string; border: string }> = {
  syntax_sugar: {
    name: 'Syntax & Grammar',
    desc: 'New operators, expressions, and ergonomic syntax',
    bg: 'bg-pastel-lavender',
    text: 'text-pastel-lavenderDeep',
    border: 'border-purple-200',
  },
  standard_library: {
    name: 'Standard Library',
    desc: 'Built-in objects, prototype methods, and globals',
    bg: 'bg-pastel-mint',
    text: 'text-pastel-mintDeep',
    border: 'border-emerald-200',
  },
  async_concurrency: {
    name: 'Async & Concurrency',
    desc: 'Promises, AsyncContext, cancellation, streams',
    bg: 'bg-pastel-peach',
    text: 'text-pastel-peachDeep',
    border: 'border-orange-200',
  },
  scoping_security: {
    name: 'Scoping & Security',
    desc: 'Private state, realms, compartments, modules',
    bg: 'bg-pastel-rose',
    text: 'text-pastel-roseDeep',
    border: 'border-pink-200',
  },
  types_annotations: {
    name: 'Types & Metadata',
    desc: 'Type annotations, decorators, reflection',
    bg: 'bg-pastel-butter',
    text: 'text-pastel-butterDeep',
    border: 'border-yellow-200',
  },
  memory_performance: {
    name: 'Memory & Runtime',
    desc: 'Structs, buffers, SIMD, WebAssembly, atomics',
    bg: 'bg-pastel-sage',
    text: 'text-pastel-sageDeep',
    border: 'border-teal-200',
  },
};

export const complexityLabels: Record<ComplexityLevel, { name: string; scoreRange: string; bg: string; text: string; barColor: string }> = {
  trivial_additive: {
    name: 'Trivial Additive',
    scoreRange: '1.0 – 1.6',
    bg: 'bg-pastel-mint',
    text: 'text-pastel-mintDeep',
    barColor: 'bg-emerald-400',
  },
  ergonomic_sugar: {
    name: 'Ergonomic Sugar',
    scoreRange: '1.7 – 2.5',
    bg: 'bg-pastel-sky',
    text: 'text-pastel-skyDeep',
    barColor: 'bg-blue-400',
  },
  new_lexical_semantics: {
    name: 'New Lexical Scope',
    scoreRange: '2.6 – 3.4',
    bg: 'bg-pastel-peach',
    text: 'text-pastel-peachDeep',
    barColor: 'bg-amber-400',
  },
  deep_runtime_primitive: {
    name: 'Deep Runtime Shift',
    scoreRange: '3.5 – 4.0',
    bg: 'bg-pastel-rose',
    text: 'text-pastel-roseDeep',
    barColor: 'bg-rose-400',
  },
};

export const beneficiaryLabels: Record<BeneficiaryType, { name: string; bg: string; text: string }> = {
  application_developers: {
    name: 'App Developers',
    bg: 'bg-pastel-sky',
    text: 'text-pastel-skyDeep',
  },
  library_authors: {
    name: 'Library Authors',
    bg: 'bg-pastel-lavender',
    text: 'text-pastel-lavenderDeep',
  },
  engine_implementers: {
    name: 'Engine Implementers',
    bg: 'bg-pastel-rose',
    text: 'text-pastel-roseDeep',
  },
};

// Metric 1: Adoption Path
export const adoptionLabels: Record<
  AdoptionPath,
  { name: string; short: string; desc: string; bg: string; text: string; border: string }
> = {
  userland_polyfillable: {
    name: 'Userland Polyfillable',
    short: 'Polyfillable',
    desc: 'Can be polyfilled in userland or standard library without compiler changes',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  build_transpilable: {
    name: 'Build Transpiler Required',
    short: 'Transpilable',
    desc: 'Requires Babel, SWC, or TypeScript transform step',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  native_engine_required: {
    name: 'Native Engine Required',
    short: 'Engine Native',
    desc: 'Strictly requires native runtime support in V8/JSC/SpiderMonkey',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
};

// Metric 2: Cognitive Overhead
export const cognitiveOverheadLabels: Record<
  CognitiveOverheadLevel,
  { name: string; desc: string; bg: string; text: string; barColor: string }
> = {
  minimal: {
    name: 'Zero / Minimal',
    desc: 'Drop-in utility with virtually zero learning curve',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    barColor: 'bg-emerald-400',
  },
  low: {
    name: 'Low (Intuitive)',
    desc: 'Intuitive idiom or small syntactic convenience',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    barColor: 'bg-sky-400',
  },
  moderate: {
    name: 'Moderate (New Idiom)',
    desc: 'Introduces a new language construct or workflow pattern',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    barColor: 'bg-amber-400',
  },
  paradigm_shift: {
    name: 'High (Paradigm Shift)',
    desc: 'Major mental model shift or new execution semantics',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    barColor: 'bg-rose-400',
  },
};

// Metric 3: Primary Motivation
export const motivationLabels: Record<
  MotivationType,
  { name: string; desc: string; bg: string; text: string; border: string }
> = {
  ergonomics_brevity: {
    name: 'Ergonomics & Brevity',
    desc: 'Reducing boilerplate and writing cleaner code',
    bg: 'bg-pastel-lavender',
    text: 'text-pastel-lavenderDeep',
    border: 'border-purple-200',
  },
  defensive_safety: {
    name: 'Defensive Safety',
    desc: 'Immutability, sandboxing, isolation, and safety',
    bg: 'bg-pastel-rose',
    text: 'text-pastel-roseDeep',
    border: 'border-pink-200',
  },
  performance_throughput: {
    name: 'Performance & Speed',
    desc: 'Memory efficiency, fast-path execution, zero-copy',
    bg: 'bg-pastel-sage',
    text: 'text-pastel-sageDeep',
    border: 'border-teal-200',
  },
  modernizing_legacy: {
    name: 'Modernizing Legacy',
    desc: 'Fixing historical JavaScript quirks and obsolete APIs',
    bg: 'bg-pastel-peach',
    text: 'text-pastel-peachDeep',
    border: 'border-amber-200',
  },
  concurrency_control: {
    name: 'Concurrency Control',
    desc: 'Task coordination, cancellation, streaming, and context',
    bg: 'bg-pastel-sky',
    text: 'text-pastel-skyDeep',
    border: 'border-blue-200',
  },
};

// Metric 4: Web Compatibility Risk
export const webCompatRiskLabels: Record<
  WebCompatRiskLevel,
  { name: string; desc: string; bg: string; text: string; barColor: string }
> = {
  negligible: {
    name: 'Negligible Risk',
    desc: 'Novel syntax or isolated namespace, zero collision risk',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    barColor: 'bg-emerald-400',
  },
  low: {
    name: 'Low Risk',
    desc: 'Additive prototype method with uncommon identifier',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    barColor: 'bg-sky-400',
  },
  moderate: {
    name: 'Moderate (MooTools Risk)',
    desc: 'Common identifier that could clash with legacy web frameworks',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    barColor: 'bg-amber-400',
  },
  high: {
    name: 'High Risk',
    desc: 'Redefines existing semantics, parser grammar, or global scope',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    barColor: 'bg-rose-400',
  },
};

// Real Intent Archetype
export const intentLabels: Record<
  IntentArchetype,
  {
    name: string;
    desc: string;
    thesis: string;
    bg: string;
    text: string;
    border: string;
    barColor: string;
  }
> = {
  expressive_composition: {
    name: 'Expressive Composition',
    desc: 'Syntactic fluency, pipelining, and declarative flow',
    thesis: 'Created to make JavaScript code cleaner, more functional, and less nested.',
    bg: 'bg-pastel-lavender',
    text: 'text-pastel-lavenderDeep',
    border: 'border-purple-200',
    barColor: 'bg-purple-400',
  },
  cross_language_parity: {
    name: 'Cross-Language Parity',
    desc: 'Adopting proven idioms from Rust, Python, Ruby, and C#',
    thesis: 'Created to bring beloved modern language patterns into ECMAScript standards.',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    barColor: 'bg-orange-400',
  },
  hardening_integrity: {
    name: 'Hardening & Integrity',
    desc: 'Defensive compartments, supply-chain safety, and realm isolation',
    thesis: 'Created to defend the web runtime against prototype pollution and untrusted code.',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    barColor: 'bg-rose-400',
  },
  standardizing_de_facto: {
    name: 'Standardizing De Facto',
    desc: 'Codifying battle-tested ecosystem conventions from npm & browsers',
    thesis: 'Created because developers and tools already established the pattern in userland.',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    barColor: 'bg-emerald-400',
  },
  runtime_vitality: {
    name: 'Next-Gen Performance',
    desc: 'Raw memory, zero-copy buffers, SIMD, and WASM interop',
    thesis: 'Created to keep JavaScript competitive for gaming, AI, native interop, and hardware speed.',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    barColor: 'bg-teal-400',
  },
  correcting_historical_regrets: {
    name: 'Repairing Legacy Quirks',
    desc: 'Replacing or modernizing broken 1995 APIs and architectural warts',
    thesis: 'Created to fix well-known design flaws and hazardous legacy edge cases (e.g. Date).',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    barColor: 'bg-amber-400',
  },
  framework_enablement: {
    name: 'Framework Enablement',
    desc: 'First-class runtime hooks for modern meta-frameworks and tooling',
    thesis: 'Created to empower React, Vue, Vite, and observability tools with robust runtime primitives.',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    barColor: 'bg-sky-400',
  },
};

