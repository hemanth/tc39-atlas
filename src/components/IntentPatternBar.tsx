import React, { useState } from 'react';
import { Proposal, IntentArchetype } from '../types';
import { intentLabels } from '../lib/theme';
import { Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { IntentIcon } from './IntentIcon';

interface IntentPatternBarProps {
  proposals: Proposal[];
  selectedIntents: Set<IntentArchetype>;
  onToggleIntent: (intent: IntentArchetype) => void;
  onClearIntents: () => void;
}

export const IntentPatternBar: React.FC<IntentPatternBarProps> = ({
  proposals,
  selectedIntents,
  onToggleIntent,
  onClearIntents,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Compute live intent patterns across all proposals
  const stats = React.useMemo(() => {
    const counts: Record<string, { total: number; stage4: number; active: number }> = {};
    const archetypes = Object.keys(intentLabels) as IntentArchetype[];

    for (const arch of archetypes) {
      counts[arch] = { total: 0, stage4: 0, active: 0 };
    }

    let classifiedTotal = 0;
    for (const p of proposals) {
      const arch = p.semantic?.intent?.archetype;
      if (arch && counts[arch]) {
        classifiedTotal++;
        counts[arch].total++;
        if (p.stage === 4) counts[arch].stage4++;
        if (p.stage >= 1 && p.stage < 4) counts[arch].active++;
      }
    }

    return { counts, classifiedTotal };
  }, [proposals]);

  const archetypes = Object.keys(intentLabels) as IntentArchetype[];

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-soft mb-6 transition-all">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pastel-lavender/60 flex items-center justify-center text-pastel-lavenderDeep border border-purple-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 tracking-tight">
                Foundational Intent Archetypes
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-muted text-stone-600 font-mono border border-surface-border">
                Pattern Matrix
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Why proposals were originally created & their survival patterns across TC39 history.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIntents.size > 0 && (
            <button
              onClick={onClearIntents}
              className="text-xs text-stone-500 hover:text-stone-900 underline font-medium px-2 py-1 rounded"
            >
              Clear Intent Filters ({selectedIntents.size})
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-surface-canvas hover:bg-stone-100 text-stone-700 font-medium border border-surface-border flex items-center gap-1 transition-all active:scale-95"
          >
            <span>{isOpen ? 'Hide Breakdown' : 'View Pattern Distribution'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visual Proportional Distribution Ribbon */}
      <div className="mt-3">
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-stone-100">
          {archetypes.map((arch) => {
            const count = stats.counts[arch]?.total || 0;
            const pct = stats.classifiedTotal > 0 ? (count / stats.classifiedTotal) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={arch}
                className={`${intentLabels[arch].barColor} h-full transition-all`}
                style={{ width: `${pct}%` }}
                title={`${intentLabels[arch].name}: ${count} proposals (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Quick-Pills Row */}
      <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-1">
        {archetypes.map((arch) => {
          const info = intentLabels[arch];
          const count = stats.counts[arch]?.total || 0;
          const isSelected = selectedIntents.has(arch);
          const stage4Rate = count > 0 ? ((stats.counts[arch].stage4 / count) * 100).toFixed(0) : '0';

          return (
            <button
              key={arch}
              onClick={() => onToggleIntent(arch)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? `${info.bg} ${info.text} ${info.border} ring-2 ring-stone-900/10 shadow-sm`
                  : 'bg-surface-canvas hover:bg-stone-50 text-stone-700 border-surface-border'
              }`}
              title={`${info.thesis} — ${stage4Rate}% reached Stage 4`}
            >
              <IntentIcon archetype={arch} className="w-3.5 h-3.5" />
              <span>{info.name}</span>
              <span className="font-mono text-[10px] opacity-70 bg-black/5 px-1.5 py-0.2 rounded-full">
                {count}
              </span>
              {isSelected && <Check className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Deep Expandable Archetype Insights */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-surface-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {archetypes.map((arch) => {
            const info = intentLabels[arch];
            const data = stats.counts[arch] || { total: 0, stage4: 0, active: 0 };
            const pctOfTotal = stats.classifiedTotal > 0 ? ((data.total / stats.classifiedTotal) * 100).toFixed(1) : '0';
            const stage4Rate = data.total > 0 ? ((data.stage4 / data.total) * 100).toFixed(0) : '0';
            const isSelected = selectedIntents.has(arch);

            return (
              <div
                key={arch}
                onClick={() => onToggleIntent(arch)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? `${info.bg} ${info.border} ring-2 ring-stone-900/10`
                    : 'bg-surface-canvas hover:bg-stone-50 border-surface-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <IntentIcon archetype={arch} className="w-3.5 h-3.5" />
                    <span>{info.name}</span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                    {data.total} ({pctOfTotal}%)
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed mb-2">
                  {info.thesis}
                </p>

                <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pt-2 border-t border-stone-200/60">
                  <span>Stage 4 Finished: <strong className="text-stone-800">{data.stage4}</strong> ({stage4Rate}%)</span>
                  <span>Active pipeline: <strong className="text-stone-800">{data.active}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
