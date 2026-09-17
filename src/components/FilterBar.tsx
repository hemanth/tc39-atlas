import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  StageType,
  TypeSafeDomain,
  ComplexityLevel,
  BeneficiaryType,
  AdoptionPath,
  MotivationType,
  CognitiveOverheadLevel,
  WebCompatRiskLevel,
  FilterOptions,
} from '../types';
import {
  stageColors,
  domainLabels,
  complexityLabels,
  beneficiaryLabels,
  adoptionLabels,
  motivationLabels,
  cognitiveOverheadLabels,
  webCompatRiskLabels,
} from '../lib/theme';

interface FilterBarProps {
  filters: FilterOptions;
  onChange: (updated: Partial<FilterOptions>) => void;
}

const SEMANTIC_PRESETS = [
  'Immutability and data safety',
  'Ergonomic syntax for chaining or pipeline',
  'Microtask, async coordination or cancellation',
  'Sandbox, private state, or security isolation',
  'High-performance memory buffers or typed arrays',
  'TypeScript or static typing annotations',
];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleStage = (s: StageType) => {
    const next = new Set(filters.stages);
    if (next.has(s)) {
      next.delete(s);
    } else {
      next.add(s);
    }
    onChange({ stages: next });
  };

  const toggleDomain = (d: TypeSafeDomain) => {
    const next = new Set(filters.domains);
    if (next.has(d)) {
      next.delete(d);
    } else {
      next.add(d);
    }
    onChange({ domains: next });
  };

  const toggleComplexity = (c: ComplexityLevel) => {
    const next = new Set(filters.complexities);
    if (next.has(c)) {
      next.delete(c);
    } else {
      next.add(c);
    }
    onChange({ complexities: next });
  };

  const toggleBeneficiary = (b: BeneficiaryType) => {
    const next = new Set(filters.beneficiaries);
    if (next.has(b)) {
      next.delete(b);
    } else {
      next.add(b);
    }
    onChange({ beneficiaries: next });
  };

  const toggleAdoption = (a: AdoptionPath) => {
    const next = new Set(filters.adoptions || []);
    if (next.has(a)) {
      next.delete(a);
    } else {
      next.add(a);
    }
    onChange({ adoptions: next });
  };

  const toggleMotivation = (m: MotivationType) => {
    const next = new Set(filters.motivations || []);
    if (next.has(m)) {
      next.delete(m);
    } else {
      next.add(m);
    }
    onChange({ motivations: next });
  };

  const toggleCognitiveOverhead = (c: CognitiveOverheadLevel) => {
    const next = new Set(filters.cognitiveOverheads || []);
    if (next.has(c)) {
      next.delete(c);
    } else {
      next.add(c);
    }
    onChange({ cognitiveOverheads: next });
  };

  const toggleWebCompatRisk = (w: WebCompatRiskLevel) => {
    const next = new Set(filters.webCompatRisks || []);
    if (next.has(w)) {
      next.delete(w);
    } else {
      next.add(w);
    }
    onChange({ webCompatRisks: next });
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-4 md:p-5 shadow-soft space-y-4">
      {/* Search & Semantic Query Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Text Keyword Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search proposals by name, author, or keyword..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-muted border border-surface-border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
          />
        </div>

        {/* Semantic Noul Filter Input */}
        <div className="relative">
          <Sparkles className="w-4 h-4 text-pastel-lavenderDeep absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Semantic Noul query (e.g. 'helps prevent mutation')..."
            value={filters.semanticQuery}
            onChange={(e) => onChange({ semanticQuery: e.target.value })}
            className="w-full pl-9 pr-16 py-2 text-sm bg-pastel-lavender/30 border border-purple-200/80 rounded-xl text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-purple-300/40 focus:border-purple-300 transition-all font-sans"
          />
          {filters.semanticQuery && (
            <button
              onClick={() => onChange({ semanticQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-white/80 px-1.5 py-0.5 rounded border border-stone-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Semantic Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-stone-400 text-[11px] whitespace-nowrap font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pastel-lavenderDeep" />
          Noul Prompts:
        </span>
        {SEMANTIC_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange({ semanticQuery: preset })}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-xs border ${
              filters.semanticQuery === preset
                ? 'bg-pastel-lavender text-pastel-lavenderDeep border-purple-300 font-medium'
                : 'bg-surface-canvas hover:bg-stone-100 text-stone-600 border-surface-border'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Stages Row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            TC39 Stages
          </span>
          <span className="text-xs text-stone-400 font-mono">
            {filters.stages.size === 0 ? 'All Stages' : `${filters.stages.size} selected`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {([4, 3, 2.7, 2, 1, 0, -1] as StageType[]).map((stage) => {
            const isSelected = filters.stages.has(stage);
            const theme = stageColors[String(stage)];
            return (
              <button
                key={stage}
                onClick={() => toggleStage(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? `${theme.bg} ${theme.text} ${theme.border} shadow-sm ring-1 ring-stone-900/10`
                    : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {stage === -1 ? 'Inactive' : `Stage ${stage}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle Advanced Filters */}
      <div className="pt-1 border-t border-surface-borderSoft flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1.5 py-1"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
          <span>TypeSafe AI Categorization Filters</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="bg-surface-muted border border-surface-border rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none"
          >
            <option value="stage-desc">Stage (High → Low)</option>
            <option value="stage-asc">Stage (Low → High)</option>
            <option value="complexity-desc">Complexity (High → Low)</option>
            <option value="complexity-asc">Complexity (Low → High)</option>
            <option value="cognitive-desc">Cognitive Overhead (High → Low)</option>
            <option value="cognitive-asc">Cognitive Overhead (Low → High)</option>
            <option value="webcompat-desc">Web-Compat Risk (High → Low)</option>
            <option value="name">Name (A → Z)</option>
            <option value="recent">Recently Pushed</option>
          </select>
        </div>
      </div>

      {/* Advanced Filter Collapsible */}
      {showAdvanced && (
        <div className="pt-3 border-t border-surface-border space-y-4 text-xs">
          {/* Domain Filter */}
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-600 block">
              TypeSafe Technical Domains (`Choice` primitive)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(domainLabels) as TypeSafeDomain[]).map((dom) => {
                const isSelected = filters.domains.has(dom);
                const info = domainLabels[dom];
                return (
                  <button
                    key={dom}
                    onClick={() => toggleDomain(dom)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? `${info.bg} ${info.text} ${info.border} ring-1 ring-stone-900/10 shadow-sm`
                        : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Complexity Filter */}
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-600 block">
              Ecosystem Disruption (`Score` primitive)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(complexityLabels) as ComplexityLevel[]).map((lvl) => {
                const isSelected = filters.complexities.has(lvl);
                const info = complexityLabels[lvl];
                return (
                  <button
                    key={lvl}
                    onClick={() => toggleComplexity(lvl)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? `${info.bg} ${info.text} border-stone-300 ring-1 ring-stone-900/10 shadow-sm`
                        : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{info.name}</span>
                    <span className="opacity-70 font-mono text-[10px]">({info.scoreRange})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Beneficiary Filter */}
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-600 block">
              Primary Beneficiary (`Choice` primitive)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(beneficiaryLabels) as BeneficiaryType[]).map((ben) => {
                const isSelected = filters.beneficiaries.has(ben);
                const info = beneficiaryLabels[ben];
                return (
                  <button
                    key={ben}
                    onClick={() => toggleBeneficiary(ben)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? `${info.bg} ${info.text} border-stone-300 ring-1 ring-stone-900/10 shadow-sm`
                        : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adoption Path Filter (Metric 1) */}
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-600 block">
              Adoption Path ("Can I use it today?")
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(adoptionLabels) as AdoptionPath[]).map((adp) => {
                const isSelected = filters.adoptions?.has(adp);
                const info = adoptionLabels[adp];
                return (
                  <button
                    key={adp}
                    onClick={() => toggleAdoption(adp)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? `${info.bg} ${info.text} ${info.border} ring-1 ring-stone-900/10 shadow-sm`
                        : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Motivation Filter (Metric 3) */}
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-600 block">
              Primary Architectural Motivation
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(motivationLabels) as MotivationType[]).map((mot) => {
                const isSelected = filters.motivations?.has(mot);
                const info = motivationLabels[mot];
                return (
                  <button
                    key={mot}
                    onClick={() => toggleMotivation(mot)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? `${info.bg} ${info.text} ${info.border} ring-1 ring-stone-900/10 shadow-sm`
                        : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cognitive Overhead Filter (Metric 2) */}
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-600 block">
              Cognitive Overhead (Mental Model Burden)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(cognitiveOverheadLabels) as CognitiveOverheadLevel[]).map((cog) => {
                const isSelected = filters.cognitiveOverheads?.has(cog);
                const info = cognitiveOverheadLabels[cog];
                return (
                  <button
                    key={cog}
                    onClick={() => toggleCognitiveOverhead(cog)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? `${info.bg} ${info.text} border-stone-300 ring-1 ring-stone-900/10 shadow-sm`
                        : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Web-Compat Risk Filter (Metric 4) */}
          <div className="space-y-1.5">
            <span className="font-semibold text-stone-600 block">
              Web-Compatibility Risk (Legacy Web Hazard)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(webCompatRiskLabels) as WebCompatRiskLevel[]).map((risk) => {
                const isSelected = filters.webCompatRisks?.has(risk);
                const info = webCompatRiskLabels[risk];
                return (
                  <button
                    key={risk}
                    onClick={() => toggleWebCompatRisk(risk)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? `${info.bg} ${info.text} border-stone-300 ring-1 ring-stone-900/10 shadow-sm`
                        : 'bg-white text-stone-600 border-surface-border hover:bg-stone-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specification Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="specOnly"
              checked={filters.hasSpecOnly}
              onChange={(e) => onChange({ hasSpecOnly: e.target.checked })}
              className="rounded border-surface-border text-stone-900 focus:ring-0"
            />
            <label htmlFor="specOnly" className="text-stone-700 cursor-pointer select-none">
              Show only proposals with formal ECMAScript specifications (`has-specification: true`)
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
