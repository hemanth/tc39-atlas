export type StageType = -1 | 0 | 1 | 2 | 2.7 | 3 | 4;

export type TypeSafeDomain =
  | 'syntax_sugar'
  | 'standard_library'
  | 'async_concurrency'
  | 'scoping_security'
  | 'types_annotations'
  | 'memory_performance';

export type ComplexityLevel =
  | 'trivial_additive'
  | 'ergonomic_sugar'
  | 'new_lexical_semantics'
  | 'deep_runtime_primitive';

export type BeneficiaryType =
  | 'application_developers'
  | 'library_authors'
  | 'engine_implementers';

// Metric 1: Adoption Path (Choice)
export type AdoptionPath =
  | 'userland_polyfillable'
  | 'build_transpilable'
  | 'native_engine_required';

// Metric 2: Cognitive Overhead (Score)
export type CognitiveOverheadLevel =
  | 'minimal'
  | 'low'
  | 'moderate'
  | 'paradigm_shift';

// Metric 3: Primary Motivation (Choice)
export type MotivationType =
  | 'ergonomics_brevity'
  | 'defensive_safety'
  | 'performance_throughput'
  | 'modernizing_legacy'
  | 'concurrency_control';

// Metric 4: Web Compatibility Risk (Score)
export type WebCompatRiskLevel =
  | 'negligible'
  | 'low'
  | 'moderate'
  | 'high';

// Real Intent Archetype (Choice) - Foundations & Historical Origins
export type IntentArchetype =
  | 'expressive_composition'
  | 'cross_language_parity'
  | 'hardening_integrity'
  | 'standardizing_de_facto'
  | 'runtime_vitality'
  | 'correcting_historical_regrets'
  | 'framework_enablement';

export interface ProposalNote {
  date: string;
  url: string;
}

export interface ProposalSemantic {
  domain: TypeSafeDomain;
  domainConfidence: number;
  domainDist: Record<TypeSafeDomain, number>;
  complexity: {
    level: ComplexityLevel;
    score: number;
    rationale: string;
  };
  beneficiary: BeneficiaryType;
  beneficiaryConfidence: number;
  tags: string[];

  // Real Intent Archetype
  intent?: {
    archetype: IntentArchetype;
    confidence: number;
    probabilities: Record<IntentArchetype, number>;
  };

  // 5 Multidimensional Metrics
  adoption?: {
    choice: AdoptionPath;
    confidence: number;
    probabilities: Record<AdoptionPath, number>;
  };
  cognitiveOverhead?: {
    score: number;
    level: CognitiveOverheadLevel;
    confidence: number;
  };
  motivation?: {
    choice: MotivationType;
    confidence: number;
    probabilities: Record<MotivationType, number>;
  };
  webCompatRisk?: {
    score: number;
    level: WebCompatRiskLevel;
    confidence: number;
  };
  signals?: {
    sandboxingSecurity: number;
    requiresTypeScript: number;
    affectsMemoryModel: number;
  };

  liveClassified?: boolean;
  classifiedAt?: string;
}

export interface Proposal {
  tags?: string[];
  stage: StageType;
  name: string;
  id: string;
  description: string;
  url: string;
  notes?: ProposalNote[];
  'has-specification'?: boolean;
  authors?: string[];
  champions?: string[];
  pushed_at?: string;
  semantic: ProposalSemantic;
}

// TypeSafe AI Primitives
export interface NoulResult {
  tag: 'Noul';
  probability: number; // [0.0, 1.0]
  isMatch: boolean;
}

export interface ChoiceResult<T extends string = string> {
  tag: 'Choice';
  selection: T;
  distribution: Record<T, number>;
  confidence: number;
}

export interface ScoreResult<T extends string = string> {
  tag: 'Score';
  score: number; // continuous
  level: T;
  distribution: Record<T, number>;
}

export interface FilterOptions {
  search: string;
  semanticQuery: string;
  semanticMinProb: number;
  stages: Set<StageType>;
  domains: Set<TypeSafeDomain>;
  complexities: Set<ComplexityLevel>;
  beneficiaries: Set<BeneficiaryType>;
  adoptions: Set<AdoptionPath>;
  motivations: Set<MotivationType>;
  intents: Set<IntentArchetype>;
  cognitiveOverheads: Set<CognitiveOverheadLevel>;
  webCompatRisks: Set<WebCompatRiskLevel>;
  hasSpecOnly: boolean;
  sortBy:
    | 'stage-desc'
    | 'stage-asc'
    | 'complexity-desc'
    | 'complexity-asc'
    | 'cognitive-desc'
    | 'cognitive-asc'
    | 'webcompat-desc'
    | 'name'
    | 'recent';
}
