import React from 'react';
import {
  ExternalLink,
  Users,
  Calendar,
  Activity,
  ChevronRight,
  Sparkles,
  Brain,
  Shield,
  FileCode,
  Cpu,
  Layers,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { Proposal } from '../types';
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
import { IntentIcon } from './IntentIcon';

interface ProposalCardProps {
  proposal: Proposal;
  isSelected: boolean;
  onSelect: (proposal: Proposal) => void;
  semanticMatchProb?: number;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  isSelected,
  onSelect,
  semanticMatchProb,
}) => {
  const stageTheme = getStageTheme(proposal.stage);
  const domainInfo = domainLabels[proposal.semantic.domain] || domainLabels.standard_library;
  const complexityInfo = complexityLabels[proposal.semantic.complexity.level] || complexityLabels.ergonomic_sugar;
  const beneficiaryInfo = beneficiaryLabels[proposal.semantic.beneficiary] || beneficiaryLabels.application_developers;

  const adoptionInfo = proposal.semantic.adoption
    ? adoptionLabels[proposal.semantic.adoption.choice]
    : null;
  const cognitiveInfo = proposal.semantic.cognitiveOverhead
    ? cognitiveOverheadLabels[proposal.semantic.cognitiveOverhead.level]
    : null;
  const motivationInfo = proposal.semantic.motivation
    ? motivationLabels[proposal.semantic.motivation.choice]
    : null;
  const intentInfo = proposal.semantic.intent
    ? intentLabels[proposal.semantic.intent.archetype]
    : null;

  const webCompatInfo = proposal.semantic.webCompatRisk
    ? webCompatRiskLabels[proposal.semantic.webCompatRisk.level]
    : null;

  // Format date
  const lastUpdated = proposal.pushed_at
    ? new Date(proposal.pushed_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <div
      onClick={() => onSelect(proposal)}
      className={`group relative text-left bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-soft hover:shadow-soft-hover ${
        isSelected
          ? 'border-stone-900 ring-2 ring-stone-900/10 -translate-y-[1px]'
          : 'border-surface-border hover:border-stone-300 hover:-translate-y-[1px]'
      }`}
    >
      {/* Top Tag Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Stage Badge */}
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${stageTheme.bg} ${stageTheme.text} ${stageTheme.border}`}
          >
            {proposal.stage === -1 ? 'Inactive' : `Stage ${proposal.stage}`}
          </span>

          {/* Intent Archetype Badge */}
          {intentInfo && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium border flex items-center gap-1.5 ${intentInfo.bg} ${intentInfo.text} ${intentInfo.border}`}
              title={intentInfo.thesis}
            >
              <IntentIcon archetype={proposal.semantic.intent!.archetype} className="w-3 h-3" />
              <span>{intentInfo.name}</span>
            </span>
          )}

          {/* Domain Badge */}
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${domainInfo.bg} ${domainInfo.text} ${domainInfo.border}`}
          >
            {domainInfo.name}
          </span>

          {/* Beneficiary Badge */}
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-normal border border-stone-200/80 ${beneficiaryInfo.bg} ${beneficiaryInfo.text}`}
          >
            {beneficiaryInfo.name}
          </span>
        </div>

        {/* Semantic Noul match pill if query is active */}
        {semanticMatchProb !== undefined && (
          <div className="flex items-center gap-1 bg-pastel-lavender/60 text-pastel-lavenderDeep px-2 py-0.5 rounded-full text-xs font-mono font-medium border border-purple-200">
            <Sparkles className="w-3 h-3" />
            <span>P(yes): {(semanticMatchProb * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Title & ID */}
      <div className="mb-2">
        <h3 className="text-base md:text-lg font-semibold text-stone-900 tracking-tight group-hover:text-stone-800 flex items-center justify-between">
          <span>{proposal.name}</span>
          <ChevronRight
            className={`w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-transform ${
              isSelected ? 'translate-x-1 text-stone-900' : ''
            }`}
          />
        </h3>
        <p className="text-xs font-mono text-stone-400 truncate mt-0.5">{proposal.id}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed mb-3">
        {proposal.description || 'No formal description provided in TC39 catalog.'}
      </p>

      {/* All 5 Multi-Dimensional Metrics */}
      <div className="space-y-2.5 mb-3">
        {/* Metric Gauges: Disruption, Cognitive Overhead, Web-Compat Risk */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-muted rounded-xl p-3 border border-surface-borderSoft">
          {/* Gauge 1: Ecosystem Disruption */}
          <div title="Ecosystem Disruption: Depth of change from simple additive helper (1.0) to deep runtime shift (4.0)">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-500 font-medium flex items-center gap-1 text-[11px]">
                <Activity className="w-3 h-3 text-stone-400" />
                <span>Disruption</span>
              </span>
              <span className="font-mono font-semibold text-stone-800 text-xs">
                {proposal.semantic.complexity.score.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${complexityInfo.barColor}`}
                style={{ width: `${(proposal.semantic.complexity.score / 4.0) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400 truncate block mt-1">{complexityInfo.name}</span>
          </div>

          {/* Gauge 2: Cognitive Overhead */}
          <div title="Cognitive Overhead: Mental burden and learning curve on developers (1.0 minimal to 4.0 paradigm shift)">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-500 font-medium flex items-center gap-1 text-[11px]">
                <Brain className="w-3 h-3 text-stone-400" />
                <span>Cognitive</span>
              </span>
              <span className="font-mono font-semibold text-stone-800 text-xs">
                {proposal.semantic.cognitiveOverhead ? proposal.semantic.cognitiveOverhead.score.toFixed(1) : '1.5'}
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${cognitiveInfo?.barColor || 'bg-sky-400'}`}
                style={{
                  width: `${
                    proposal.semantic.cognitiveOverhead
                      ? (proposal.semantic.cognitiveOverhead.score / 4.0) * 100
                      : 35
                  }%`,
                }}
              />
            </div>
            <span className="text-[10px] text-stone-400 truncate block mt-1">
              {cognitiveInfo?.name || 'Low (Intuitive)'}
            </span>
          </div>

          {/* Gauge 3: Web-Compat Risk */}
          <div title="Web Compatibility Risk: Likelihood of breaking existing websites or colliding with legacy libraries like MooTools (1.0 negligible to 4.0 severe)">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-500 font-medium flex items-center gap-1 text-[11px]">
                <AlertTriangle className="w-3 h-3 text-stone-400" />
                <span>Compat Risk</span>
              </span>
              <span className="font-mono font-semibold text-stone-800 text-xs">
                {proposal.semantic.webCompatRisk ? proposal.semantic.webCompatRisk.score.toFixed(1) : '1.0'}
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${webCompatInfo?.barColor || 'bg-emerald-400'}`}
                style={{
                  width: `${
                    proposal.semantic.webCompatRisk
                      ? (proposal.semantic.webCompatRisk.score / 4.0) * 100
                      : 25
                  }%`,
                }}
              />
            </div>
            <span className="text-[10px] text-stone-400 truncate block mt-1">
              {webCompatInfo?.name || 'Negligible'}
            </span>
          </div>
        </div>

        {/* Categorical Metrics: Adoption Path & Primary Motivation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Adoption Path */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-canvas border border-surface-border">
            <Layers className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-400 text-[11px]">Adoption:</span>
            <span className="font-medium text-stone-800 truncate text-[11px]">
              {adoptionInfo?.name || 'Userland Polyfillable'}
            </span>
          </div>

          {/* Primary Motivation */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-canvas border border-surface-border">
            <Target className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-400 text-[11px]">Motivation:</span>
            <span className="font-medium text-stone-800 truncate text-[11px]">
              {motivationInfo?.name || 'Developer Ergonomics'}
            </span>
          </div>
        </div>

        {/* Metric 5: Architectural Signals */}
        {proposal.semantic.signals && (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="text-[10px] font-mono text-stone-400 mr-0.5">Signals:</span>
            <span
              className={`px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                proposal.semantic.signals.sandboxingSecurity >= 0.5
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-stone-50 text-stone-400 border-stone-200/60'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Sandbox {(proposal.semantic.signals.sandboxingSecurity * 100).toFixed(0)}%</span>
            </span>

            <span
              className={`px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                proposal.semantic.signals.requiresTypeScript >= 0.5
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-stone-50 text-stone-400 border-stone-200/60'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>TypeScript {(proposal.semantic.signals.requiresTypeScript * 100).toFixed(0)}%</span>
            </span>

            <span
              className={`px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                proposal.semantic.signals.affectsMemoryModel >= 0.5
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-stone-50 text-stone-400 border-stone-200/60'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Memory {(proposal.semantic.signals.affectsMemoryModel * 100).toFixed(0)}%</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & External Links */}
      <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-surface-borderSoft">
        <div className="flex items-center gap-3">
          {proposal.authors && proposal.authors.length > 0 && (
            <span className="flex items-center gap-1 truncate max-w-[140px]" title={proposal.authors.join(', ')}>
              <Users className="w-3 h-3" />
              <span>
                {proposal.authors[0]}
                {proposal.authors.length > 1 ? ` +${proposal.authors.length - 1}` : ''}
              </span>
            </span>
          )}
          {lastUpdated && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{lastUpdated}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {proposal['has-specification'] && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
              Spec
            </span>
          )}
          <a
            href={proposal.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-stone-400 hover:text-stone-900 rounded hover:bg-stone-100 transition-colors"
            title="Open Repository"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
