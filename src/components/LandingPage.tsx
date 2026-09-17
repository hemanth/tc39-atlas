import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Shield,
  AlertTriangle,
  Palette,
  ArrowRightLeft,
  Sparkles,
  Activity,
  Brain,
  Target,
  Cpu,
} from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onOpenGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onOpenGuide,
}) => {
  return (
    <div className="min-h-screen bg-surface-canvas text-stone-900 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-surface-border bg-gradient-to-b from-white to-surface-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-lavender/60 text-pastel-lavenderDeep text-xs font-mono font-medium border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>324 Proposals Classified · 28 Years of Evolution</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15]">
            The Multi-Dimensional Map of <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-sky-600">
              JavaScript's Evolution
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 leading-relaxed">
            Every feature in modern ECMAScript originated from human intention, technical friction, and consensus debates. 
            The Atlas moves beyond simple stage numbers to analyze the cognitive burden, web-compatibility hazards, 
            and real-world motivations behind every proposal.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 text-stone-100 font-semibold text-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 group"
            >
              <span>Explore All 324 Proposals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenGuide}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-stone-700 font-semibold text-sm border border-surface-border hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-stone-500" />
              <span>Read Metrics & Field Guide</span>
            </button>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white border border-surface-border shadow-soft">
              <span className="text-xs text-stone-400 font-mono block">Proposals Indexed</span>
              <span className="text-xl font-bold text-stone-900">324 Total</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Stage 0 through Stage 4</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-surface-border shadow-soft">
              <span className="text-xs text-stone-400 font-mono block">Intent Archetypes</span>
              <span className="text-xl font-bold text-stone-900">7 Patterns</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">From Fluency to Hardening</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-surface-border shadow-soft">
              <span className="text-xs text-stone-400 font-mono block">Evaluated Dimensions</span>
              <span className="text-xl font-bold text-stone-900">5 Metrics</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Risk, Overhead, & Signals</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-surface-border shadow-soft">
              <span className="text-xs text-stone-400 font-mono block">History Span</span>
              <span className="text-xl font-bold text-stone-900">1997–2026</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Full TC39 archive depth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Historical Insights Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Patterns Uncovered Across TC39 History
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Multi-dimensional classification reveals why certain ideas sail through the committee while others stall for years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: The Security Paradox */}
          <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-soft space-y-3 hover:border-stone-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                <Shield className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                0.0% Stage 4 Rate
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900">The Security Hardening Paradox</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Proposals aimed at defensive sandboxing, realm isolation, and prototype freezing (like <em>ShadowRealm</em> and <em>SES</em>) face near-insurmountable friction. JavaScript's dynamic mutability makes locking down prototypes prone to breaking legacy web assumptions.
            </p>
          </div>

          {/* Card 2: Web-Compat Risk & SmooshGate */}
          <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-soft space-y-3 hover:border-stone-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Don't Break the Web
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900">Web-Compat Hazard & "SmooshGate"</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              If a proposal breaks 0.05% of websites, browser engines refuse to ship it. When <em>Array.prototype.flatten</em> collided with 2007 MooTools polyfills on active banking portals, the committee was forced to rename it to <em>flat</em>. The Atlas quantifies this risk before code reaches engines.
            </p>
          </div>

          {/* Card 3: Expressive Fluency */}
          <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-soft space-y-3 hover:border-stone-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                <Palette className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                44.1% of All Proposals
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900">The Primary Engine: Expressive Fluency</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Nearly half of all proposals ever created exist to eliminate boilerplate and enable declarative chaining (<em>Pipeline Operator</em>, <em>Records & Tuples</em>, <em>Promise.any</em>). Developer ergonomics remains the single greatest evolutionary gravity in ECMAScript.
            </p>
          </div>

          {/* Card 4: Cross-Language Parity */}
          <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-soft space-y-3 hover:border-stone-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-200">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                36.4% Completion Rate
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900">Proven Semantics Travel Fastest</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Proposals importing battle-tested idioms from Rust, Python, and C# (<em>Pattern Matching</em>, <em>BigInt</em>, <em>Atomic Groups</em>) enjoy significantly higher survival rates. Because their mathematical and type semantics are already proven, committee consensus forms with less friction.
            </p>
          </div>
        </div>
      </section>

      {/* The 5 Metrics Architecture Summary */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-surface-border">
        <div className="bg-white rounded-3xl border border-surface-border p-8 md:p-10 shadow-soft space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              The 5 Multi-Dimensional Primitives
            </h2>
            <p className="text-sm text-stone-600">
              Every proposal in the Atlas is systematically scored across five analytical dimensions:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-canvas border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>1. Ecosystem Disruption</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Continuous 1.0–4.0 scale measuring architectural depth: from additive utility helpers to deep runtime engine changes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-canvas border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <Brain className="w-4 h-4 text-sky-600" />
                <span>2. Cognitive Overhead</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                The mental model burden imposed on developers learning, debugging, and reading code utilizing this feature.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-canvas border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>3. Web-Compat Risk</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                The likelihood of breaking billions of legacy web pages or colliding with historic global monkey-patches.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-canvas border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>4. Adoption Path</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Can developers polyfill it today in userland, does it require build-time transpilation, or does it mandate native browser engines?
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-canvas border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <Target className="w-4 h-4 text-rose-600" />
                <span>5. Primary Motivation</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                The core architectural impetus: Ergonomics & Brevity, Defensive Safety, Performance & Speed, or Modernizing Legacy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-canvas border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Architectural Signals</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Calibrated probability vectors tracking Realm Sandboxing boundaries, TypeScript compiler changes, and Memory allocation primitives.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              Want to see detailed code examples, risk scales, and color legends?
            </span>
            <button
              onClick={onOpenGuide}
              className="text-xs font-semibold text-stone-900 hover:text-stone-700 underline underline-offset-4 flex items-center gap-1.5"
            >
              <span>Read Full Metrics Field Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Final Launch CTA */}
      <section className="max-w-3xl mx-auto px-4 text-center py-12 space-y-5">
        <h2 className="text-3xl font-bold tracking-tight text-stone-900">
          Ready to explore the dataset?
        </h2>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Filter by stage, domain, intent archetype, disruption level, or run semantic natural language conditions across all 324 proposals.
        </p>
        <button
          onClick={onExplore}
          className="px-8 py-4 rounded-2xl bg-stone-900 text-stone-100 font-semibold text-sm hover:bg-stone-800 transition-all inline-flex items-center gap-2 shadow-soft hover:shadow-soft-hover active:scale-95"
        >
          <span>Launch Proposal Atlas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
