import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  AlertTriangle,
  Activity,
  Brain,
  Layers,
  Target,
  FileCode,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { IntentIcon } from './IntentIcon';
import {
  stageColors,
  complexityLabels,
  adoptionLabels,
  cognitiveOverheadLabels,
  webCompatRiskLabels,
  intentLabels,
} from '../lib/theme';
import { IntentArchetype, StageType } from '../types';

interface FieldGuideProps {
  onBackToExplorer: () => void;
}

export const FieldGuide: React.FC<FieldGuideProps> = ({
  onBackToExplorer,
}) => {
  return (
    <div className="min-h-screen bg-surface-canvas text-stone-900 pb-24">
      {/* Top Banner */}
      <div className="border-b border-surface-border bg-white sticky top-0 z-20 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBackToExplorer}
            className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Atlas Explorer</span>
          </button>

          <span className="text-xs font-mono text-stone-400">
            Field Guide & Visual Legends
          </span>

          <button
            onClick={onBackToExplorer}
            className="text-xs px-3 py-1.5 rounded-lg bg-stone-900 text-stone-100 font-semibold hover:bg-stone-800 transition-all flex items-center gap-1"
          >
            <span>Launch Atlas</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Title Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-lavender/60 text-pastel-lavenderDeep text-xs font-mono font-medium border border-purple-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Analytical Architecture & Methodology</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Metrics & Visual Legends
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            This guide details every measurement gauge, color token, risk scale, and classification archetype used across the Atlas to decode the JavaScript standardization process.
          </p>
        </div>

        {/* Section 1: TC39 Stages & Palette */}
        <section className="space-y-4">
          <div className="border-b border-surface-border pb-2">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pastel-mintDeep" />
              1. TC39 Process Stages & Color Legend
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              How features progress through formal committee review from idea to global specification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                stage: 4 as StageType,
                name: 'Stage 4: Finished',
                token: 'Pastel Mint',
                desc: 'Passed all tests (Test262), implemented in 2+ independent browser engines, merged into the official standard.',
                theme: stageColors['4'],
              },
              {
                stage: 3 as StageType,
                name: 'Stage 3: Candidate',
                token: 'Pastel Sky',
                desc: 'Specification text complete and signed off. Browser engines begin shipping experimental implementations.',
                theme: stageColors['3'],
              },
              {
                stage: 2.7 as StageType,
                name: 'Stage 2.7: Spec Complete',
                token: 'Pastel Periwinkle',
                desc: 'Full specification text written and reviewed, pending Test262 test suites before Stage 3 advancement.',
                theme: stageColors['2.7'],
              },
              {
                stage: 2 as StageType,
                name: 'Stage 2: Draft',
                token: 'Pastel Peach',
                desc: 'Precise description of syntax and semantics. Committee expects this feature to be developed and eventually included.',
                theme: stageColors['2'],
              },
              {
                stage: 1 as StageType,
                name: 'Stage 1: Proposal',
                token: 'Pastel Buttercream',
                desc: 'Formal case made for the problem. Explores API shape, cross-cutting concerns, and potential implementation hazards.',
                theme: stageColors['1'],
              },
              {
                stage: 0 as StageType,
                name: 'Stage 0: Strawman',
                token: 'Pastel Rose',
                desc: 'Free-form input for ideas. Any proposal presented at a TC39 meeting or authored by a committee member.',
                theme: stageColors['0'],
              },
            ].map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl bg-white border border-surface-border shadow-soft space-y-2 hover:border-stone-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${item.theme.bg} ${item.theme.text} ${item.theme.border}`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">{item.token}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Web-Compat Risk Deep Dive */}
        <section className="space-y-4">
          <div className="border-b border-surface-border pb-2">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              2. Web-Compatibility Risk (Compat Risk)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              The likelihood of causing breakage on existing live websites when shipped in browser engines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>The Cardinal Rule: "Don't Break the Web"</span>
            </div>
            <p className="leading-relaxed">
              Browsers must guarantee that websites built in 2005 or 2015 continue running without breaking.
              For decades, web developers and popular libraries (like <strong>MooTools</strong>, <strong>Prototype.js</strong>, and <strong>ExtJS</strong>) 
              extended native built-in prototypes with custom methods.
            </p>
            <div className="p-3 bg-white/90 rounded-lg border border-amber-200 font-mono text-[11px] text-stone-800 space-y-1">
              <span className="text-stone-400 block">// MooTools (circa 2007) added this to thousands of websites:</span>
              <span>Array.prototype.flatten = function() &#123; ... &#125;;</span>
            </div>
            <p className="leading-relaxed">
              If the committee standardizes a native <code className="font-mono font-semibold bg-amber-100/80 px-1 py-0.5 rounded">Array.prototype.flatten</code> with slightly different enumerability or arguments, 
              thousands of legacy banking, enterprise, and institutional web applications crash immediately. This famous incident in 2018 (dubbed <strong>"SmooshGate"</strong>) 
              forced TC39 to rename the proposal to <code className="font-mono font-semibold bg-amber-100/80 px-1 py-0.5 rounded">Array.prototype.flat()</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {(Object.keys(webCompatRiskLabels) as Array<keyof typeof webCompatRiskLabels>).map((key) => {
              const info = webCompatRiskLabels[key];
              return (
                <div key={key} className="p-4 rounded-xl bg-white border border-surface-border shadow-soft space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${info.barColor}`} />
                      {info.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-medium ${info.bg} ${info.text}`}
                    >
                      {key.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{info.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Ecosystem Disruption & Cognitive Overhead */}
        <section className="space-y-4">
          <div className="border-b border-surface-border pb-2">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              3. Complexity & Cognitive Burden Scales
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Measuring architectural shock to engines versus mental friction on software engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disruption */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Ecosystem Disruption (`Score` 1.0 – 4.0)</span>
              </h3>
              <div className="space-y-2.5">
                {(Object.keys(complexityLabels) as Array<keyof typeof complexityLabels>).map((lvl) => {
                  const info = complexityLabels[lvl];
                  return (
                    <div key={lvl} className="p-3 bg-white rounded-xl border border-surface-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800">{info.name}</span>
                        <span className="font-mono text-[11px] text-stone-400">{info.scoreRange}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${info.barColor}`} style={{ width: '100%' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cognitive Overhead */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-sky-600" />
                <span>Cognitive Overhead (`Score` 1.0 – 4.0)</span>
              </h3>
              <div className="space-y-2.5">
                {(Object.keys(cognitiveOverheadLabels) as Array<keyof typeof cognitiveOverheadLabels>).map((cog) => {
                  const info = cognitiveOverheadLabels[cog];
                  return (
                    <div key={cog} className="p-3 bg-white rounded-xl border border-surface-border space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800">{info.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">Mental Burden</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug">{info.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: The 7 Foundational Intent Archetypes */}
        <section className="space-y-4">
          <div className="border-b border-surface-border pb-2">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              4. The 7 Foundational Intent Archetypes
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Why proposals were created and how different motivations correlate with committee survival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {(Object.keys(intentLabels) as IntentArchetype[]).map((arch) => {
              const info = intentLabels[arch];
              return (
                <div
                  key={arch}
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${info.bg} ${info.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                      <IntentIcon archetype={arch} className="w-4 h-4" />
                      <span>{info.name}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.barColor }} />
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {info.thesis}
                  </p>

                  <p className="text-[11px] text-stone-500 leading-normal pt-1 border-t border-black/5">
                    {info.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Adoption Path & Architectural Signals */}
        <section className="space-y-4">
          <div className="border-b border-surface-border pb-2">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              5. Adoption Path & Architectural Signals
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              How features can be adopted by teams today and their fundamental runtime footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adoption Path */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                Adoption Path ("Can I use it today?")
              </span>
              {(Object.keys(adoptionLabels) as Array<keyof typeof adoptionLabels>).map((adp) => {
                const info = adoptionLabels[adp];
                return (
                  <div key={adp} className="p-3.5 rounded-xl bg-white border border-surface-border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800 text-xs">{info.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${info.bg} ${info.text} ${info.border}`}>
                        {info.short}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">{info.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Architectural Signals */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                Architectural Signal Vectors
              </span>
              <div className="p-3.5 rounded-xl bg-white border border-surface-border space-y-1">
                <div className="flex items-center gap-2 font-semibold text-stone-800 text-xs">
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sandboxing & Realm Isolation</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Evaluates whether a proposal creates boundary isolation, defensive compartments, or alters prototype security invariants.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-surface-border space-y-1">
                <div className="flex items-center gap-2 font-semibold text-stone-800 text-xs">
                  <FileCode className="w-3.5 h-3.5 text-blue-500" />
                  <span>TypeScript Compiler Changes</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Measures whether the proposal requires changes to TypeScript type checking algorithms, type inference, or syntax parsers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-surface-border space-y-1">
                <div className="flex items-center gap-2 font-semibold text-stone-800 text-xs">
                  <Cpu className="w-3.5 h-3.5 text-teal-500" />
                  <span>Memory Model & Buffer Allocation</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Flags features dealing with shared memory, WebAssembly zero-copy buffers, Atomics, or garbage collection lifecycle hooks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Navigation CTA */}
        <div className="pt-8 border-t border-surface-border text-center space-y-4">
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Now that you know the metrics, explore how all 324 proposals map across these analytical dimensions.
          </p>
          <button
            onClick={onBackToExplorer}
            className="px-6 py-3 rounded-xl bg-stone-900 text-stone-100 font-semibold text-xs hover:bg-stone-800 transition-all inline-flex items-center gap-2 shadow-sm active:scale-95"
          >
            <span>Open Interactive Atlas Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
