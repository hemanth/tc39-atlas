import React, { useState, useMemo, useEffect } from 'react';
import {
  Proposal,
  FilterOptions,
  StageType,
  TypeSafeDomain,
  ComplexityLevel,
  BeneficiaryType,
  AdoptionPath,
  MotivationType,
  IntentArchetype,
  CognitiveOverheadLevel,
  WebCompatRiskLevel,
} from './types';
import enrichedData from './data/enrichedProposals.json';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { IntentPatternBar } from './components/IntentPatternBar';
import { ProposalCard } from './components/ProposalCard';
import { StateInspector } from './components/StateInspector';
import { ApiKeyModal } from './components/ApiKeyModal';
import { evaluateNoul } from './lib/typesafeEngine';
import { Sparkles, FilterX, Heart } from 'lucide-react';

const initialFilters: FilterOptions = {
  search: '',
  semanticQuery: '',
  semanticMinProb: 0.55,
  stages: new Set<StageType>(), // Show all 324 proposals by default
  domains: new Set<TypeSafeDomain>(),
  complexities: new Set<ComplexityLevel>(),
  beneficiaries: new Set<BeneficiaryType>(),
  adoptions: new Set<AdoptionPath>(),
  motivations: new Set<MotivationType>(),
  intents: new Set<IntentArchetype>(),
  cognitiveOverheads: new Set<CognitiveOverheadLevel>(),
  webCompatRisks: new Set<WebCompatRiskLevel>(),
  hasSpecOnly: false,
  sortBy: 'stage-desc',
};

export const App: React.FC = () => {
  const [proposalsList, setProposalsList] = useState<Proposal[]>(enrichedData as Proposal[]);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(proposalsList[0] || null);

  // TypeSafe API Key status
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // Check API key status on load
  useEffect(() => {
    fetch('/api/typesafe/status')
      .then((res) => res.json())
      .then((data) => {
        setHasKey(Boolean(data.hasKey));
        setMaskedKey(data.maskedKey || null);
      })
      .catch((err) => console.warn('Could not check TypeSafe status:', err));
  }, []);

  const handleSaveKey = async (key: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/typesafe/set-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setHasKey(true);
        setMaskedKey(data.maskedKey || null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleUpdateFilters = (updated: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      ...initialFilters,
      stages: new Set<StageType>(),
      intents: new Set<IntentArchetype>(),
      cognitiveOverheads: new Set<CognitiveOverheadLevel>(),
      webCompatRisks: new Set<WebCompatRiskLevel>(),
    });
  };

  const handleToggleIntent = (intent: IntentArchetype) => {
    setFilters((prev) => {
      const next = new Set(prev.intents || []);
      if (next.has(intent)) {
        next.delete(intent);
      } else {
        next.add(intent);
      }
      return { ...prev, intents: next };
    });
  };

  const handleClearIntents = () => {
    setFilters((prev) => ({ ...prev, intents: new Set<IntentArchetype>() }));
  };

  const handleProposalUpdated = (updated: Proposal) => {
    setProposalsList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProposal(updated);
  };

  // Compute filtered proposals and optional semantic scores
  const { filteredProposals, semanticScores } = useMemo(() => {
    const scores = new Map<string, number>();

    // If semantic query is active, compute Noul P(yes) for each proposal
    if (filters.semanticQuery.trim()) {
      for (const p of proposalsList) {
        const result = evaluateNoul(p, filters.semanticQuery);
        scores.set(p.id, result.probability);
      }
    }

    const filtered = proposalsList.filter((p) => {
      // 1. Text keyword search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesId = p.id ? p.id.toLowerCase().includes(query) : false;
        const matchesDesc = (p.description || '').toLowerCase().includes(query);
        const matchesAuthors = (p.authors || []).some((a) => a.toLowerCase().includes(query));
        const matchesChampions = (p.champions || []).some((c) => c.toLowerCase().includes(query));

        if (!matchesName && !matchesId && !matchesDesc && !matchesAuthors && !matchesChampions) {
          return false;
        }
      }

      // 2. Stages
      if (filters.stages.size > 0 && !filters.stages.has(p.stage)) {
        return false;
      }

      // 3. Domains
      if (filters.domains.size > 0 && !filters.domains.has(p.semantic.domain)) {
        return false;
      }

      // 4. Complexities
      if (filters.complexities.size > 0 && !filters.complexities.has(p.semantic.complexity.level)) {
        return false;
      }

      // 5. Beneficiaries
      if (filters.beneficiaries.size > 0 && !filters.beneficiaries.has(p.semantic.beneficiary)) {
        return false;
      }

      // 6. Adoption Path
      if (filters.adoptions && filters.adoptions.size > 0) {
        if (!p.semantic.adoption || !filters.adoptions.has(p.semantic.adoption.choice)) {
          return false;
        }
      }

      // 7. Motivation
      if (filters.motivations && filters.motivations.size > 0) {
        if (!p.semantic.motivation || !filters.motivations.has(p.semantic.motivation.choice)) {
          return false;
        }
      }

      // 8. Intent Archetype
      if (filters.intents && filters.intents.size > 0) {
        if (!p.semantic.intent || !filters.intents.has(p.semantic.intent.archetype)) {
          return false;
        }
      }

      // 9. Cognitive Overhead
      if (filters.cognitiveOverheads && filters.cognitiveOverheads.size > 0) {
        if (!p.semantic.cognitiveOverhead || !filters.cognitiveOverheads.has(p.semantic.cognitiveOverhead.level)) {
          return false;
        }
      }

      // 10. Web-Compat Risk
      if (filters.webCompatRisks && filters.webCompatRisks.size > 0) {
        if (!p.semantic.webCompatRisk || !filters.webCompatRisks.has(p.semantic.webCompatRisk.level)) {
          return false;
        }
      }

      // 11. Has spec
      if (filters.hasSpecOnly && !p['has-specification']) {
        return false;
      }

      // 9. Semantic Query Minimum Probability
      if (filters.semanticQuery.trim()) {
        const prob = scores.get(p.id) ?? 0;
        if (prob < filters.semanticMinProb) {
          return false;
        }
      }

      return true;
    });

    // Sort proposals
    filtered.sort((a, b) => {
      // If semantic query is present, rank by semantic match first
      if (filters.semanticQuery.trim()) {
        const scoreA = scores.get(a.id) ?? 0;
        const scoreB = scores.get(b.id) ?? 0;
        if (Math.abs(scoreA - scoreB) > 0.08) {
          return scoreB - scoreA;
        }
      }

      switch (filters.sortBy) {
        case 'stage-desc':
          return (b.stage ?? -1) - (a.stage ?? -1);
        case 'stage-asc':
          return (a.stage ?? -1) - (b.stage ?? -1);
        case 'complexity-desc':
          return b.semantic.complexity.score - a.semantic.complexity.score;
        case 'complexity-asc':
          return a.semantic.complexity.score - b.semantic.complexity.score;
        case 'cognitive-desc':
          return (b.semantic.cognitiveOverhead?.score ?? 0) - (a.semantic.cognitiveOverhead?.score ?? 0);
        case 'cognitive-asc':
          return (a.semantic.cognitiveOverhead?.score ?? 0) - (b.semantic.cognitiveOverhead?.score ?? 0);
        case 'webcompat-desc':
          return (b.semantic.webCompatRisk?.score ?? 0) - (a.semantic.webCompatRisk?.score ?? 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent': {
          const timeA = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
          const timeB = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
          return timeB - timeA;
        }
        default:
          return 0;
      }
    });

    return { filteredProposals: filtered, semanticScores: scores };
  }, [filters, proposalsList]);

  const isFiltered =
    Boolean(filters.search) ||
    Boolean(filters.semanticQuery) ||
    filters.stages.size > 0 ||
    filters.domains.size > 0 ||
    filters.complexities.size > 0 ||
    filters.beneficiaries.size > 0 ||
    filters.hasSpecOnly;

  return (
    <div className="min-h-[100dvh] bg-surface-canvas text-stone-900 flex flex-col">
      {/* Top Navigation */}
      <Header
        totalCount={proposalsList.length}
        filteredCount={filteredProposals.length}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
        hasKey={hasKey}
        maskedKey={maskedKey}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Anti-Center Hero / Context Banner */}
        <div className="mb-6 bg-gradient-to-r from-pastel-lavender/40 via-pastel-mint/30 to-pastel-peach/30 rounded-2xl p-5 md:p-6 border border-surface-border text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-stone-200 text-xs font-semibold text-stone-800 mb-2.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pastel-lavenderDeep" />
              <span>TypeSafe AI × TC39 Proposals Dataset</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 leading-tight">
              Semantic Architecture for the JavaScript Roadmap
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mt-2">
              Transforming raw TC39 records into typed, calibrated judgments. Filter proposals by
              domain, ecosystem disruption score, and natural language criteria using Jev System One primitives.
            </p>
          </div>
        </div>

        {/* Intent Archetypes & Pattern Matrix Bar */}
        <IntentPatternBar
          proposals={proposalsList}
          selectedIntents={filters.intents || new Set()}
          onToggleIntent={handleToggleIntent}
          onClearIntents={handleClearIntents}
        />

        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Feed & Filter): 7 cols on LG */}
          <div className="lg:col-span-7 space-y-5">
            {/* Filter Ribbon */}
            <FilterBar filters={filters} onChange={handleUpdateFilters} />

            {/* Proposals Count & Status */}
            <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-mono">
              <span>
                {filteredProposals.length} matching {filteredProposals.length === 1 ? 'proposal' : 'proposals'}
              </span>
              {filters.semanticQuery && (
                <span className="text-pastel-lavenderDeep font-medium">
                  Ranked by Noul Probability
                </span>
              )}
            </div>

            {/* Empty State */}
            {filteredProposals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-surface-border p-10 text-center space-y-3 shadow-soft">
                <FilterX className="w-8 h-8 text-stone-300 mx-auto" />
                <h3 className="text-sm font-semibold text-stone-800">No proposals match current filters</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing the semantic query or expanding the selected stages to see more proposals.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-all shadow-sm active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Proposal Cards Grid */
              <div className="grid grid-cols-1 gap-4">
                {filteredProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    isSelected={selectedProposal?.id === proposal.id}
                    onSelect={(p) => setSelectedProposal(p)}
                    semanticMatchProb={
                      filters.semanticQuery.trim() ? semanticScores.get(proposal.id) : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column (Sticky State Inspector): 5 cols on LG */}
          <div className="lg:col-span-5 sticky top-20 h-[calc(100dvh-6rem)]">
            <StateInspector
              proposal={selectedProposal}
              onClose={() => setSelectedProposal(null)}
              hasKey={hasKey}
              onOpenKeyModal={() => setIsKeyModalOpen(true)}
              onProposalUpdated={handleProposalUpdated}
            />
          </div>
        </div>
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        hasKey={hasKey}
        maskedKey={maskedKey}
        onSaveKey={handleSaveKey}
      />

      {/* Footer */}
      <footer className="border-t border-surface-border bg-white py-8 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-stone-600">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block" />
              <span>by</span>
              <a
                href="https://h3manth.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-stone-900 hover:text-stone-700 underline underline-offset-2 transition-colors"
              >
                Hemanth HM
              </a>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-stone-400">
              <span>324 Proposals Indexed</span>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-border/60 text-center sm:text-left text-[11px] text-stone-400">
            <span>
              Disclaimer: This is an independent project and not an official TC39 repository.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
