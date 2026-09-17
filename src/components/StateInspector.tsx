import React, { useState } from 'react';
import {
  X,
  Code2,
  Sparkles,
  Layers,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Calendar,
  Send,
  Sliders,
  RefreshCw,
  AlertCircle,
  Shield,
  FileCode,
  Cpu,
} from 'lucide-react';
import { Proposal, NoulResult, TypeSafeDomain, AdoptionPath, IntentArchetype } from '../types';
import { IntentIcon } from './IntentIcon';
import {
  getStageTheme,
  domainLabels,
  complexityLabels,
  beneficiaryLabels,
  adoptionLabels,
  cognitiveOverheadLabels,
  motivationLabels,
  webCompatRiskLabels,
  intentLabels,
} from '../lib/theme';
import { evaluateNoul } from '../lib/typesafeEngine';

interface StateInspectorProps {
  proposal: Proposal | null;
  onClose: () => void;
  hasKey: boolean;
  onOpenKeyModal: () => void;
  onProposalUpdated?: (updated: Proposal) => void;
}

export const StateInspector: React.FC<StateInspectorProps> = ({
  proposal,
  onClose,
  hasKey,
  onOpenKeyModal,
  onProposalUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'judgments' | 'playground' | 'raw' | 'notes'>('judgments');
  const [copied, setCopied] = useState(false);

  // Playground state
  const [customQuery, setCustomQuery] = useState('Does this proposal introduce new syntax grammar?');
  const [playgroundNoul, setPlaygroundNoul] = useState<NoulResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLiveResult, setIsLiveResult] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<{ input_tokens: number; output_tokens: number } | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Live Re-classify state
  const [isReclassifying, setIsReclassifying] = useState(false);
  const [reclassifySuccess, setReclassifySuccess] = useState(false);

  if (!proposal) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400 bg-white rounded-2xl border border-surface-border">
        <Layers className="w-10 h-10 text-stone-300 mb-3" />
        <p className="text-sm font-medium text-stone-600">No proposal selected</p>
        <p className="text-xs text-stone-400 max-w-[240px] mt-1">
          Click on any proposal card to inspect its TypeSafe state and run semantic evaluations.
        </p>
      </div>
    );
  }

  const stageTheme = getStageTheme(proposal.stage);
  const domainInfo = domainLabels[proposal.semantic.domain] || domainLabels.standard_library;
  const complexityInfo = complexityLabels[proposal.semantic.complexity.level] || complexityLabels.ergonomic_sugar;

  // The exact immutable state passed to TypeSafe System One
  const typesafeState = {
    name: proposal.name,
    id: proposal.id,
    stage: proposal.stage,
    description: proposal.description,
    tags: proposal.tags,
    hasSpecification: proposal['has-specification'],
    authors: proposal.authors,
    champions: proposal.champions,
    notesCount: proposal.notes?.length || 0,
    pushedAt: proposal.pushed_at,
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(typesafeState, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runPlaygroundQuery = async () => {
    if (!customQuery.trim()) return;
    setIsEvaluating(true);
    setEvalError(null);
    setTokenUsage(null);

    // If live key is configured, use live Jev API
    if (hasKey) {
      try {
        const response = await fetch('/api/typesafe/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'jev-latest',
            state: typesafeState,
            questions: {
              condition: {
                type: 'noul',
                instructions: customQuery,
              },
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to evaluate with Jev');
        }

        const prob = data.answers.condition.noul;
        setPlaygroundNoul({
          tag: 'Noul',
          probability: Number(prob.toFixed(3)),
          isMatch: prob >= 0.65,
        });
        setIsLiveResult(true);
        if (data.usage) {
          setTokenUsage(data.usage);
        }
      } catch (err: any) {
        console.warn('Live API failed, falling back to local emulator:', err);
        setEvalError(err.message);
        // Fallback to emulator
        const fallback = evaluateNoul(proposal, customQuery);
        setPlaygroundNoul(fallback);
        setIsLiveResult(false);
      } finally {
        setIsEvaluating(false);
      }
    } else {
      // Local emulator
      setTimeout(() => {
        const result = evaluateNoul(proposal, customQuery);
        setPlaygroundNoul(result);
        setIsLiveResult(false);
        setIsEvaluating(false);
      }, 150);
    }
  };

  const handleReclassifyWithJev = async () => {
    if (!hasKey) {
      onOpenKeyModal();
      return;
    }

    setIsReclassifying(true);
    setReclassifySuccess(false);

    try {
      const response = await fetch('/api/typesafe/classify-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to re-classify proposal');
      }

      const { answers } = data;
      const scoreVal = answers.complexity.score;
      let level: any = 'ergonomic_sugar';
      if (scoreVal >= 3.5) level = 'deep_runtime_primitive';
      else if (scoreVal >= 2.6) level = 'new_lexical_semantics';
      else if (scoreVal <= 1.6) level = 'trivial_additive';

      const cogScore = answers.cognitiveOverhead?.score ?? 1.5;
      let cognitiveLevel: any = 'low';
      if (cogScore >= 2.8) cognitiveLevel = 'paradigm_shift';
      else if (cogScore >= 1.9) cognitiveLevel = 'moderate';
      else if (cogScore >= 1.0) cognitiveLevel = 'low';
      else cognitiveLevel = 'minimal';

      const compatScore = answers.webCompatRisk?.score ?? 0.8;
      let webCompatLevel: any = 'low';
      if (compatScore >= 2.8) webCompatLevel = 'high';
      else if (compatScore >= 1.9) webCompatLevel = 'moderate';
      else if (compatScore >= 1.0) webCompatLevel = 'low';
      else webCompatLevel = 'negligible';

      const updatedProposal: Proposal = {
        ...proposal,
        semantic: {
          ...proposal.semantic,
          domain: answers.domain.choice,
          domainConfidence: answers.domain.confidence,
          domainDist: answers.domain.probabilities,
          complexity: {
            level,
            score: scoreVal,
            rationale: `Classified live by Jev (${answers.complexity.confidence ? `confidence ${(answers.complexity.confidence * 100).toFixed(0)}%` : 'calibrated'}).`,
          },
          beneficiary: answers.beneficiary.choice,
          beneficiaryConfidence: answers.beneficiary.confidence,

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
        },
      };

      onProposalUpdated?.(updatedProposal);
      setReclassifySuccess(true);
      setTimeout(() => setReclassifySuccess(false), 2500);
    } catch (err: any) {
      alert(`Error classifying with Jev: ${err.message}`);
    } finally {
      setIsReclassifying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-soft flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-surface-border bg-surface-canvas/60 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${stageTheme.bg} ${stageTheme.text} ${stageTheme.border}`}
            >
              {proposal.stage === -1 ? 'Inactive' : `Stage ${proposal.stage}`}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${domainInfo.bg} ${domainInfo.text} ${domainInfo.border}`}
            >
              {domainInfo.name}
            </span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">{proposal.name}</h2>
          <p className="text-xs font-mono text-stone-400 mt-0.5">{proposal.id}</p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 border-b border-surface-border bg-white text-xs gap-1">
        <button
          onClick={() => setActiveTab('judgments')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'judgments'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pastel-lavenderDeep" />
          Semantic Judgments
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'playground'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-pastel-peachDeep" />
          Evaluator Playground
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'raw'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Raw State JSON
        </button>
        {proposal.notes && proposal.notes.length > 0 && (
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Notes ({proposal.notes.length})
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* TAB 1: SEMANTIC JUDGMENTS */}
        {activeTab === 'judgments' && (
          <div className="space-y-5 text-xs">
            {/* Live Re-classify Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-canvas border border-surface-border">
              <div>
                <span className="font-semibold text-stone-800 block text-xs">
                  Model Engine: Jev System One
                </span>
                <span className="text-stone-500 text-[11px]">
                  {hasKey ? 'Live API Connected' : 'Local Emulator active'}
                </span>
              </div>
              <button
                onClick={handleReclassifyWithJev}
                disabled={isReclassifying}
                className="px-2.5 py-1.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all flex items-center gap-1 text-xs active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isReclassifying ? 'animate-spin' : ''}`} />
                <span>{isReclassifying ? 'Evaluating...' : 'Re-classify with Jev'}</span>
              </button>
            </div>

            {reclassifySuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5 text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Updated proposal with live Jev answers!</span>
              </div>
            )}

            {/* Primitive 1: Choice (Domain Distribution) */}
            <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-pastel-lavenderDeep" />
                  Primitive 1: Choice (Domain Classification)
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                  Confidence: {(proposal.semantic.domainConfidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-stone-500 text-xs">
                Question: <span className="text-stone-700 italic">"What technical domain of JavaScript does this proposal primarily affect?"</span>
              </p>

              {/* Distribution Bars */}
              <div className="space-y-1.5 pt-1">
                {Object.entries(proposal.semantic.domainDist).map(([key, prob]) => {
                  const label = domainLabels[key as TypeSafeDomain]?.name || key;
                  const isWinning = key === proposal.semantic.domain;
                  return (
                    <div key={key} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className={isWinning ? 'font-semibold text-stone-900' : 'text-stone-500'}>
                          {label}
                        </span>
                        <span className="font-mono text-stone-600">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isWinning ? 'bg-pastel-lavenderDeep' : 'bg-stone-300'
                          }`}
                          style={{ width: `${prob * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primitive 2: Score (Ecosystem Disruption) */}
            <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-pastel-peachDeep" />
                  Primitive 2: Score (Architectural Complexity)
                </span>
                <span className="font-mono text-xs font-bold text-stone-800">
                  {proposal.semantic.complexity.score.toFixed(2)} / 4.0
                </span>
              </div>
              <p className="text-stone-500 text-xs">
                Question: <span className="text-stone-700 italic">"Assess how disruptive or complex this proposal is to the JavaScript runtime."</span>
              </p>

              <div className="p-3 bg-white rounded-lg border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">{complexityInfo.name}</span>
                  <span className="text-stone-400 font-mono text-[11px]">{complexityInfo.scoreRange}</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${complexityInfo.barColor}`}
                    style={{ width: `${(proposal.semantic.complexity.score / 4.0) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {proposal.semantic.complexity.rationale}
                </p>
              </div>
            </div>

            {/* Primitive 3: Choice (Primary Beneficiary) */}
            <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-2">
              <span className="font-semibold text-stone-800 block text-xs">
                Primitive 3: Choice (Target Beneficiary)
              </span>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-surface-border">
                <div>
                  <span className="font-semibold text-stone-900 block">
                    {beneficiaryLabels[proposal.semantic.beneficiary]?.name}
                  </span>
                  <span className="text-stone-400 text-[11px]">Primary ecosystem target</span>
                </div>
                <span className="font-mono text-xs text-stone-600 bg-stone-50 px-2 py-1 rounded border border-stone-200">
                  Confidence: {(proposal.semantic.beneficiaryConfidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Metric 1: Adoption Path (Choice) */}
            {proposal.semantic.adoption && (
              <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-pastel-mintDeep" />
                    Metric 1: Choice (Adoption Path)
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                    Confidence: {(proposal.semantic.adoption.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-stone-500 text-xs">
                  Question: <span className="text-stone-700 italic">"What is the primary adoption pathway for developers to use this feature today?"</span>
                </p>

                <div className="p-3 bg-white rounded-lg border border-surface-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      {adoptionLabels[proposal.semantic.adoption.choice]?.name || proposal.semantic.adoption.choice}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                        adoptionLabels[proposal.semantic.adoption.choice]?.bg || 'bg-stone-50'
                      } ${adoptionLabels[proposal.semantic.adoption.choice]?.text || 'text-stone-700'} ${
                        adoptionLabels[proposal.semantic.adoption.choice]?.border || 'border-stone-200'
                      }`}
                    >
                      {adoptionLabels[proposal.semantic.adoption.choice]?.short || 'Path'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {adoptionLabels[proposal.semantic.adoption.choice]?.desc}
                  </p>

                  {/* Distribution */}
                  {proposal.semantic.adoption.probabilities && (
                    <div className="space-y-1 pt-2 border-t border-stone-100">
                      {Object.entries(proposal.semantic.adoption.probabilities).map(([k, p]) => (
                        <div key={k} className="flex items-center justify-between text-[11px]">
                          <span className={k === proposal.semantic.adoption?.choice ? 'font-semibold text-stone-800' : 'text-stone-400'}>
                            {adoptionLabels[k as AdoptionPath]?.short || k}
                          </span>
                          <span className="font-mono text-stone-500">{(p * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metric 2: Cognitive Overhead (Score) */}
            {proposal.semantic.cognitiveOverhead && (
              <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-pastel-skyDeep" />
                    Metric 2: Score (Cognitive Overhead)
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-800">
                    {proposal.semantic.cognitiveOverhead.score.toFixed(1)} / 4.0
                  </span>
                </div>
                <p className="text-stone-500 text-xs">
                  Question: <span className="text-stone-700 italic">"Rate the cognitive overhead and mental model shift required for everyday developers."</span>
                </p>

                <div className="p-3 bg-white rounded-lg border border-surface-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      {cognitiveOverheadLabels[proposal.semantic.cognitiveOverhead.level]?.name}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {(proposal.semantic.cognitiveOverhead.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cognitiveOverheadLabels[proposal.semantic.cognitiveOverhead.level]?.barColor || 'bg-stone-500'}`}
                      style={{ width: `${(proposal.semantic.cognitiveOverhead.score / 4.0) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-500">
                    {cognitiveOverheadLabels[proposal.semantic.cognitiveOverhead.level]?.desc}
                  </p>
                </div>
              </div>
            )}

            {/* Metric 3: Primary Motivation (Choice) */}
            {proposal.semantic.motivation && (
              <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-pastel-butterDeep" />
                    Metric 3: Choice (Primary Motivation)
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                    Confidence: {(proposal.semantic.motivation.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-stone-500 text-xs">
                  Question: <span className="text-stone-700 italic">"What is the primary architectural driver or motivation behind this proposal?"</span>
                </p>

                <div className="p-3 bg-white rounded-lg border border-surface-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      {motivationLabels[proposal.semantic.motivation.choice]?.name || proposal.semantic.motivation.choice}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                        motivationLabels[proposal.semantic.motivation.choice]?.bg || 'bg-stone-50'
                      } ${motivationLabels[proposal.semantic.motivation.choice]?.text || 'text-stone-700'} ${
                        motivationLabels[proposal.semantic.motivation.choice]?.border || 'border-stone-200'
                      }`}
                    >
                      Motivation
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {motivationLabels[proposal.semantic.motivation.choice]?.desc}
                  </p>
                </div>
              </div>
            )}

            {/* Metric 4: Web Compatibility Risk (Score) */}
            {proposal.semantic.webCompatRisk && (
              <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-pastel-roseDeep" />
                    Metric 4: Score (Web-Compatibility Risk)
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-800">
                    {proposal.semantic.webCompatRisk.score.toFixed(1)} / 4.0
                  </span>
                </div>
                <p className="text-stone-500 text-xs">
                  Question: <span className="text-stone-700 italic">"Rate the risk of this proposal causing web-compatibility breaks with legacy websites."</span>
                </p>

                <div className="p-3 bg-white rounded-lg border border-surface-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">
                      {webCompatRiskLabels[proposal.semantic.webCompatRisk.level]?.name}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {(proposal.semantic.webCompatRisk.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${webCompatRiskLabels[proposal.semantic.webCompatRisk.level]?.barColor || 'bg-stone-500'}`}
                      style={{ width: `${(proposal.semantic.webCompatRisk.score / 4.0) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-500">
                    {webCompatRiskLabels[proposal.semantic.webCompatRisk.level]?.desc}
                  </p>
                </div>
              </div>
            )}

            {/* Metric 5: Architectural Signals (Multi-Noul) */}
            {proposal.semantic.signals && (
              <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-pastel-periwinkleDeep" />
                    Metric 5: Noul (Architectural Signal Probabilities)
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">P(yes) ∈ [0, 1]</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="p-2.5 bg-white rounded-lg border border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-500 shrink-0" />
                      <div>
                        <span className="font-medium text-stone-800 block">Sandboxing & Realm Isolation</span>
                        <span className="text-[10px] text-stone-400">Security boundary or defensive compartment</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-stone-700 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                      {(proposal.semantic.signals.sandboxingSecurity * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="font-medium text-stone-800 block">TypeScript Compiler Impact</span>
                        <span className="text-[10px] text-stone-400">Requires type grammar or checker changes</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-stone-700 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                      {(proposal.semantic.signals.requiresTypeScript * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-teal-500 shrink-0" />
                      <div>
                        <span className="font-medium text-stone-800 block">Memory Model & Allocation</span>
                        <span className="text-[10px] text-stone-400">Value types, GC hooks, or raw buffer shifts</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-stone-700 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                      {(proposal.semantic.signals.affectsMemoryModel * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Foundational Intent Archetype */}
            {proposal.semantic.intent && (
              <div className="bg-surface-canvas rounded-xl p-4 border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-pastel-lavenderDeep" />
                    Foundational Intent Archetype
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                    Confidence: {(proposal.semantic.intent.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-stone-500 text-xs">
                  Question: <span className="text-stone-700 italic">"What was the foundational real-world intent that prompted champions to create this proposal?"</span>
                </p>

                <div className="p-3 bg-white rounded-lg border border-surface-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <IntentIcon archetype={proposal.semantic.intent.archetype} className="w-4 h-4 text-stone-700" />
                      <span>{intentLabels[proposal.semantic.intent.archetype]?.name}</span>
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                        intentLabels[proposal.semantic.intent.archetype]?.bg || 'bg-stone-50'
                      } ${intentLabels[proposal.semantic.intent.archetype]?.text || 'text-stone-700'} ${
                        intentLabels[proposal.semantic.intent.archetype]?.border || 'border-stone-200'
                      }`}
                    >
                      Real Intent
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    {intentLabels[proposal.semantic.intent.archetype]?.thesis}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {intentLabels[proposal.semantic.intent.archetype]?.desc}
                  </p>

                  {/* Intent distribution */}
                  {proposal.semantic.intent.probabilities && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      {Object.entries(proposal.semantic.intent.probabilities).map(([k, p]) => {
                        const isWinning = k === proposal.semantic.intent?.archetype;
                        const label = intentLabels[k as IntentArchetype];
                        if (!label || p < 0.01) return null;
                        return (
                          <div key={k} className="flex items-center justify-between text-[11px]">
                            <span className={`flex items-center gap-1.5 ${isWinning ? 'font-semibold text-stone-900' : 'text-stone-500'}`}>
                              <IntentIcon archetype={k as IntentArchetype} className="w-3 h-3" />
                              <span>{label.name}</span>
                            </span>
                            <span className="font-mono text-stone-500">{(p * 100).toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EVALUATOR PLAYGROUND */}
        {activeTab === 'playground' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-pastel-lavender/30 rounded-xl border border-purple-200 text-stone-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pastel-lavenderDeep" />
                  Live TypeSafe Evaluator
                </span>
                {hasKey ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium font-mono">
                    Jev Live API
                  </span>
                ) : (
                  <button
                    onClick={onOpenKeyModal}
                    className="text-[10px] px-2 py-0.5 rounded bg-pastel-butter text-pastel-butterDeep border border-amber-300 font-medium hover:underline"
                  >
                    Connect Key for Live Jev
                  </button>
                )}
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Ask any question against this proposal's immutable state. Evaluates calibrated probabilities with zero hallucination.
              </p>
            </div>

            {/* Query Input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block">
                Condition to Test (`Noul` primitive)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g. Does this proposal help prevent data mutation bugs?"
                  className="flex-1 px-3 py-2 text-xs bg-surface-muted border border-surface-border rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400/20"
                />
                <button
                  onClick={runPlaygroundQuery}
                  disabled={isEvaluating}
                  className="px-3 py-2 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
                >
                  <Send className={`w-3 h-3 ${isEvaluating ? 'animate-pulse' : ''}`} />
                  <span>{isEvaluating ? 'Evaluating...' : 'Run'}</span>
                </button>
              </div>
            </div>

            {/* Presets to try */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 block font-medium">Quick Prompts:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  'Does this proposal introduce new syntax grammar?',
                  'Will this benefit frontend web applications?',
                  'Is this designed for high-performance memory?',
                  'Does this improve developer ergonomics?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setCustomQuery(prompt);
                    }}
                    className="text-[11px] px-2 py-1 rounded-lg bg-surface-canvas hover:bg-stone-100 text-stone-600 border border-surface-border text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {evalError && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1.5 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Notice: {evalError} (ran with local emulator fallback).</span>
              </div>
            )}

            {/* Playground Result */}
            {playgroundNoul && (
              <div className="p-4 bg-white rounded-xl border border-surface-border space-y-3 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pastel-mintDeep" />
                    <span className="font-semibold text-stone-900">
                      Judgment Outcome (Noul)
                    </span>
                    {isLiveResult && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                        Live Jev
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                      playgroundNoul.probability >= 0.65
                        ? 'bg-pastel-mint text-pastel-mintDeep'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    P(yes): {(playgroundNoul.probability * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-stone-900 transition-all duration-300"
                    style={{ width: `${playgroundNoul.probability * 100}%` }}
                  />
                </div>

                {tokenUsage && (
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1">
                    <span>Model: jev-latest</span>
                    <span>Tokens: {tokenUsage.input_tokens} in / {tokenUsage.output_tokens} out</span>
                  </div>
                )}

                <div className="text-[11px] text-stone-600 bg-surface-muted p-2.5 rounded-lg font-mono">
                  <code>{`// Deterministic code routing\nif (result.probability >= 0.65) {\n  applyCategory("${customQuery.slice(0, 24)}...");\n}`}</code>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RAW STATE JSON */}
        {activeTab === 'raw' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500 font-medium">Immutable State Record</span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-stone-600 hover:text-stone-900 text-xs px-2 py-1 rounded bg-surface-muted border border-surface-border active:scale-95"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-stone-800 max-h-[400px]">
              {JSON.stringify(typesafeState, null, 2)}
            </pre>
          </div>
        )}

        {/* TAB 4: NOTES */}
        {activeTab === 'notes' && proposal.notes && (
          <div className="space-y-2 text-xs">
            <span className="text-stone-500 font-medium block">
              Meeting Notes ({proposal.notes.length} records)
            </span>
            <div className="divide-y divide-surface-border border border-surface-border rounded-xl overflow-hidden">
              {proposal.notes.map((note, idx) => (
                <a
                  key={idx}
                  href={note.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white hover:bg-stone-50 transition-colors flex items-center justify-between text-stone-700 group block"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-mono text-xs">
                      {new Date(note.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer link to GitHub */}
      <div className="p-4 border-t border-surface-border bg-surface-canvas flex items-center justify-between text-xs">
        <span className="text-stone-400 font-mono">
          Last pushed: {proposal.pushed_at ? new Date(proposal.pushed_at).toLocaleDateString() : 'N/A'}
        </span>
        <a
          href={proposal.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-stone-800 hover:text-stone-950 font-medium"
        >
          <span>Repository</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
