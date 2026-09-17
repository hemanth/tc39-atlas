import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Flame,
  GitBranch,
  Layers,
  Cpu,
  Compass,
  ArrowUpRight,
  Search,
  Zap,
} from 'lucide-react';
import { FilterOptions, StageType, IntentArchetype, WebCompatRiskLevel, ComplexityLevel } from '../types';

interface LandingPageProps {
  onExplore: () => void;
  onOpenGuide: () => void;
  onSelectProposal?: (proposalId: string) => void;
  onApplyPreset?: (filters: Partial<FilterOptions>) => void;
}

interface ShowcaseProposal {
  id: string;
  name: string;
  stage: number;
  stageLabel: string;
  stageColor: string;
  intent: string;
  disruption: number;
  cognitiveOverhead: string;
  webCompatRisk: string;
  adoption: string;
  motivation: string;
  summary: string;
  signals: string[];
}

const SHOWCASE_ITEMS: ShowcaseProposal[] = [
  {
    id: 'proposal-array-flat',
    name: 'Array.prototype.flat / flatMap',
    stage: 4,
    stageLabel: 'Stage 4 · Standard',
    stageColor: 'bg-pastel-mint text-pastel-mintDeep border-emerald-300',
    intent: 'Expressive Fluency & Boilerplate Elimination',
    disruption: 1.8,
    cognitiveOverhead: 'Low',
    webCompatRisk: 'High Hazard',
    adoption: 'Polyfillable',
    motivation: 'Ergonomics & Brevity',
    summary:
      'Originally championed as Array.prototype.flatten. Broke live banking portals using MooTools 2007 (SmooshGate), forcing TC39 to rename the standard to flat.',
    signals: ['Web-Compat Collision', 'Userland Polyfillable', 'Global Prototype Touch'],
  },
  {
    id: 'proposal-shadowrealm',
    name: 'ShadowRealm API',
    stage: 2,
    stageLabel: 'Stage 2 · Draft Spec',
    stageColor: 'bg-pastel-peach text-pastel-peachDeep border-orange-300',
    intent: 'Defensive Sandboxing & Integrity Hardening',
    disruption: 3.7,
    cognitiveOverhead: 'High',
    webCompatRisk: 'Negligible',
    adoption: 'Engine Dependent',
    motivation: 'Defensive Safety & Isolation',
    summary:
      'Provides a distinct execution context with its own global environment and built-in intrinsics. Encounters severe friction due to cross-realm membrane serialization boundaries.',
    signals: ['Realm Sandboxing', 'Engine Native Mandate', 'Isolation Boundary'],
  },
  {
    id: 'proposal-record-tuple',
    name: 'Records & Tuples',
    stage: 2,
    stageLabel: 'Stage 2 · Draft Spec',
    stageColor: 'bg-pastel-peach text-pastel-peachDeep border-orange-300',
    intent: 'Expressive Fluency & Boilerplate Elimination',
    disruption: 3.9,
    cognitiveOverhead: 'Moderate',
    webCompatRisk: 'Negligible',
    adoption: 'Polyfillable (Transpile)',
    motivation: 'Expressive Power & Immutability',
    summary:
      'Deeply immutable compound primitives (#{} and #[]) compared by value rather than identity. Introduces fundamental new primitive types to the runtime memory model.',
    signals: ['Compound Primitives', 'Value Equality', 'Compiler Syntax Shift'],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onOpenGuide,
  onSelectProposal,
  onApplyPreset,
}) => {
  const [selectedShowcaseIndex, setSelectedShowcaseIndex] = useState<number>(0);

  const activeShowcase = SHOWCASE_ITEMS[selectedShowcaseIndex];

  const handleInspectShowcase = () => {
    if (onSelectProposal) {
      onSelectProposal(activeShowcase.id);
    } else {
      onExplore();
    }
  };

  const handleLaunchCompatHazards = () => {
    if (onApplyPreset) {
      onApplyPreset({
        webCompatRisks: new Set<WebCompatRiskLevel>(['high', 'moderate']),
      });
    } else {
      onExplore();
    }
  };

  const handleLaunchHighDisruption = () => {
    if (onApplyPreset) {
      onApplyPreset({
        complexities: new Set<ComplexityLevel>(['new_lexical_semantics', 'deep_runtime_primitive']),
      });
    } else {
      onExplore();
    }
  };

  const handleLaunchStage3 = () => {
    if (onApplyPreset) {
      onApplyPreset({
        stages: new Set<StageType>([3]),
      });
    } else {
      onExplore();
    }
  };

  const handleLaunchDefensiveHardening = () => {
    if (onApplyPreset) {
      onApplyPreset({
        intents: new Set<IntentArchetype>(['hardening_integrity']),
      });
    } else {
      onExplore();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f4f2] text-[#0a0a0a] selection:bg-[#ff6b00]/20 selection:text-[#0a0a0a]">
      {/* Top Subtle Grain / Radial Ambience */}
      <div className="relative overflow-hidden border-b border-neutral-300/70 bg-gradient-to-b from-[#f8f7f5] via-[#f5f4f2] to-[#eeece8]">
        {/* Glow Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#ff6b00]/[0.04] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-500/[0.03] blur-3xl"
        />

        {/* HERO SECTION: Asymmetric 2-Column Split */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* LEFT COLUMN: Editorial Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Pulsating Release Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6b00]/30 bg-[#ff6b00]/[0.07] px-3.5 py-1.5 text-xs font-medium tracking-tight text-[#cc5400] transition-all duration-300 hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/[0.11]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#ff6b00]/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff6b00]" />
                </span>
                <span className="font-mono font-medium">324 Proposals Indexed · 28-Year Archive</span>
              </div>

              {/* Title & Editorial Tagline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#0a0a0a] leading-[1.04]">
                  TC39 Proposal Atlas
                </h1>
                <p className="text-2xl sm:text-3xl text-neutral-800 font-normal leading-snug tracking-tight font-display italic">
                  The Multi-Dimensional Map of JavaScript's Evolution
                </p>
                <p className="text-base sm:text-lg font-medium text-[#ff6b00] tracking-tight">
                  Less conjecture, actual committee telemetry.
                </p>
              </div>

              {/* Narrative Lead */}
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
                Every feature in modern ECMAScript originated from human intention, technical friction, 
                and consensus debates. Beyond simple stage numbers, the Atlas quantifies the cognitive burden, 
                web-compatibility hazards, and real-world motivations behind all 324 proposals.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 max-w-xl">
                <button
                  onClick={onExplore}
                  className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-[#0a0a0a] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-black/30 transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(255,107,0,0.35)] hover:bg-[#141414] active:scale-[0.98]"
                >
                  <span>Explore All 324 Proposals</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onOpenGuide}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300/90 bg-white px-6 py-3.5 text-sm font-medium text-neutral-900 shadow-[0_3px_10px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 text-neutral-500 group-hover:text-neutral-800 transition-colors" />
                  <span>Metrics & Field Guide</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Live Spec Telemetry Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-neutral-300/80 bg-white/95 p-6 sm:p-7 shadow-[0_20px_50px_-15px_rgba(15,15,15,0.15)] backdrop-blur-md space-y-5 transition-all">
                {/* Card Header & Proposal Switcher Tabs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-neutral-200/80">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-600">
                      <Activity className="w-3.5 h-3.5 text-[#ff6b00]" />
                      <span>Live Proposal Telemetry</span>
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">Sample 1 of 324</span>
                  </div>

                  {/* Switcher Pills */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 text-[11px] font-mono">
                    {SHOWCASE_ITEMS.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedShowcaseIndex(idx)}
                        className={`px-2 py-1.5 rounded-lg text-center truncate transition-all ${
                          selectedShowcaseIndex === idx
                            ? 'bg-white text-neutral-900 font-bold shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        {item.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Proposal Title & Stage */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${activeShowcase.stageColor}`}>
                      {activeShowcase.stageLabel}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      ID: {activeShowcase.id}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                    {activeShowcase.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    Intent: <span className="text-neutral-800 font-semibold">{activeShowcase.intent}</span>
                  </p>
                </div>

                {/* The 5 Metrics Visual Ribbon */}
                <div className="space-y-3 rounded-2xl bg-[#f8f7f5] border border-neutral-200 p-4 text-xs">
                  {/* Metric 1: Disruption */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-neutral-700">
                      <span className="font-medium flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#ff6b00]" />
                        <span>Ecosystem Disruption</span>
                      </span>
                      <span className="font-mono font-bold text-neutral-900">{activeShowcase.disruption} / 4.0</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-[#ff6b00] rounded-full transition-all duration-500"
                        style={{ width: `${(activeShowcase.disruption / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 2 & 3: Cognitive Overhead & Web-Compat Hazard */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200/60 font-mono text-[11px]">
                    <div className="p-2 rounded-xl bg-white border border-neutral-200/80 space-y-0.5">
                      <span className="text-neutral-400 block text-[10px] uppercase">Cognitive Overhead</span>
                      <span className="font-bold text-neutral-800">{activeShowcase.cognitiveOverhead}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-neutral-200/80 space-y-0.5">
                      <span className="text-neutral-400 block text-[10px] uppercase">Web-Compat Hazard</span>
                      <span className={`font-bold ${activeShowcase.webCompatRisk === 'High Hazard' ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {activeShowcase.webCompatRisk}
                      </span>
                    </div>
                  </div>

                  {/* Metric 4 & 5: Adoption & Motivation */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2 rounded-xl bg-white border border-neutral-200/80 space-y-0.5">
                      <span className="text-neutral-400 block text-[10px] uppercase">Adoption Path</span>
                      <span className="font-medium text-neutral-800 truncate block">{activeShowcase.adoption}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-neutral-200/80 space-y-0.5">
                      <span className="text-neutral-400 block text-[10px] uppercase">Primary Motivation</span>
                      <span className="font-medium text-neutral-800 truncate block">{activeShowcase.motivation}</span>
                    </div>
                  </div>
                </div>

                {/* Context Incident Snippet */}
                <p className="text-xs text-neutral-600 leading-relaxed italic border-l-2 border-[#ff6b00] pl-3 py-0.5">
                  "{activeShowcase.summary}"
                </p>

                {/* Signals Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeShowcase.signals.map((sig) => (
                    <span
                      key={sig}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-mono"
                    >
                      #{sig}
                    </span>
                  ))}
                </div>

                {/* Inspect in Explorer button */}
                <button
                  onClick={handleInspectShowcase}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Inspect this proposal in Explorer</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#ff6b00]" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* STATS RIBBON: Tactile Anti-Slop Numbers */}
      <section className="border-b border-neutral-300/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#f8f7f5] border border-neutral-200/90 shadow-sm space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">Indexed Proposals</span>
              <span className="text-3xl font-bold text-neutral-900 tabular-nums">324</span>
              <span className="text-[11px] text-neutral-500 block">Stage 0 through Stage 4</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#f8f7f5] border border-neutral-200/90 shadow-sm space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">Intent Archetypes</span>
              <span className="text-3xl font-bold text-neutral-900 tabular-nums">7</span>
              <span className="text-[11px] text-neutral-500 block">From Ergonomics to Sandboxing</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#f8f7f5] border border-neutral-200/90 shadow-sm space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">Evaluated Primitives</span>
              <span className="text-3xl font-bold text-neutral-900 tabular-nums">5</span>
              <span className="text-[11px] text-neutral-500 block">Disruption, Risk, Mindshare, Signals</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#f8f7f5] border border-neutral-200/90 shadow-sm space-y-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">Archive Horizon</span>
              <span className="text-3xl font-bold text-neutral-900 tabular-nums">1997–2026</span>
              <span className="text-[11px] text-neutral-500 block">28 years of committee consensus</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED EDITORIAL DOSSIERS: Deep Substance, Zero Generic Slop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mb-12 space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#ff6b00]">
            <Compass className="w-3.5 h-3.5" />
            <span>Committee Dynamics & Historical Friction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
            Four Patterns Uncovered in the TC39 Archive
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Multi-dimensional scoring uncovers structural invariants in how JavaScript evolves: why certain proposals sail smoothly to completion while others stall for decades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dossier 1: The Security Hardening Paradox */}
          <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all space-y-4 text-left group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Defensive Isolation</span>
              </div>
              <span className="text-2xl font-bold font-mono text-rose-600">0.0%</span>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors">
              The Security Hardening Paradox
            </h3>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Every proposal dedicated strictly to defensive sandboxing, object freezing, and realm isolation (such as <em>ShadowRealm</em> and <em>SES</em>) has historically struggled to reach Stage 4. Because JavaScript is architecturally grounded in dynamic prototype mutation, locking down globals risks breaking assumptions across millions of legacy userland scripts.
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Friction Axis: Prototype Rigidity</span>
              <span className="text-rose-600 font-medium">Stage 2 Ceiling</span>
            </div>
          </div>

          {/* Dossier 2: Web-Compat Hazards & SmooshGate */}
          <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all space-y-4 text-left group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Web-Compat Hazard</span>
              </div>
              <span className="text-2xl font-bold font-mono text-amber-600">0.05%</span>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors">
              Web-Compat Hazard & "SmooshGate"
            </h3>

            <p className="text-sm text-neutral-600 leading-relaxed">
              If an ECMAScript feature breaks even 0.05% of the live web, browser engines will refuse to ship it. When <em>Array.prototype.flatten</em> collided with 2007 MooTools library polyfills on major banking websites, the committee was forced into an emergency rename to <em>flat</em>. The Atlas tracks Web-Compat Risk explicitly to expose collisions before spec code reaches engines.
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Friction Axis: Global Monkey-Patching</span>
              <span className="text-amber-600 font-medium">Forced Rename</span>
            </div>
          </div>

          {/* Dossier 3: Expressive Fluency Gravity */}
          <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all space-y-4 text-left group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Consensus Engine</span>
              </div>
              <span className="text-2xl font-bold font-mono text-purple-600">44.1%</span>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors">
              The Primary Engine: Expressive Fluency
            </h3>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Nearly half of all proposals ever introduced exist to reduce cognitive overhead, eliminate defensive null-checking boilerplate, or enable functional data pipelines (<em>Pipeline Operator |&gt;</em>, <em>Records &amp; Tuples</em>, <em>Optional Chaining ?.</em>). Developer ergonomics remains the single strongest gravitational force pulling features through the committee pipeline.
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Dominant Velocity: Ergonomics</span>
              <span className="text-purple-600 font-medium">143 Proposals</span>
            </div>
          </div>

          {/* Dossier 4: Cross-Language Parity Survival */}
          <div className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all space-y-4 text-left group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <GitBranch className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Consensus Parity</span>
              </div>
              <span className="text-2xl font-bold font-mono text-emerald-600">2.3×</span>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors">
              Proven Semantics Travel 2.3× Faster
            </h3>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Proposals adopting mathematical semantics already battle-tested in Rust, Python, or C# (<em>Pattern Matching</em>, <em>BigInt</em>, <em>Temporal Date/Time</em>, <em>Atomic Groups</em>) achieve committee consensus with significantly less resistance. When formal type theory and boundary invariants are already established in peer languages, specification churn drops dramatically.
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Velocity Multiplier: Prior Art</span>
              <span className="text-emerald-600 font-medium">36.4% Completion</span>
            </div>
          </div>
        </div>
      </section>

      {/* THE 5 MULTI-DIMENSIONAL PRIMITIVES */}
      <section className="border-t border-neutral-300/80 bg-[#eeece8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#ff6b00]">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Dimensional Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              The 5 Evaluated Primitives
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Stage numbers only tell you where a proposal sits in the bureaucratic pipeline. The Atlas systematically scores every proposal across five technical dimensions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Primitive 1 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-300/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ff6b00]">DIMENSION 01</span>
                <span className="text-xs font-mono text-neutral-400">Scale: 1.0–4.0</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">Ecosystem Disruption</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Measures the depth of architectural change: from non-breaking additive helper methods to fundamental shifts in runtime memory models and parsing semantics.
              </p>
            </div>

            {/* Primitive 2 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-300/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ff6b00]">DIMENSION 02</span>
                <span className="text-xs font-mono text-neutral-400">Low → Extreme</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">Cognitive Overhead</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The mental model burden imposed on developers writing, reading, and debugging code. Evaluates whether a feature simplifies reasoning or introduces subtle state hazards.
              </p>
            </div>

            {/* Primitive 3 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-300/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ff6b00]">DIMENSION 03</span>
                <span className="text-xs font-mono text-neutral-400">Negligible → Hazard</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">Web-Compatibility Risk</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The probability of colliding with global namespace monkey-patches or breaking legacy intranet sites. Tracks historical collision hazards like SmooshGate.
              </p>
            </div>

            {/* Primitive 4 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-300/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ff6b00]">DIMENSION 04</span>
                <span className="text-xs font-mono text-neutral-400">Polyfill → Engine</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">Adoption Path</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Can developers polyfill this feature today in pure userland, does it require build-time transpilation (Babel/TypeScript), or does it mandate native V8/SpiderMonkey engine changes?
              </p>
            </div>

            {/* Primitive 5 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-300/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ff6b00]">DIMENSION 05</span>
                <span className="text-xs font-mono text-neutral-400">Core Impetus</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900">Primary Motivation</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Identifies the driving catalyst: Ergonomics &amp; Brevity, Defensive Safety &amp; Sandboxing, High-Throughput Performance, or Modernizing Legacy Primitives.
              </p>
            </div>

            {/* Architectural Signals */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-300/80 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ff6b00]">VECTORS</span>
                <Cpu className="w-4 h-4 text-neutral-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Architectural Signals</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Calibrated probability vectors tracking Realm Sandboxing boundaries, TypeScript compiler changes, and Memory allocation primitives across all proposals.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-300/80">
            <span className="text-xs text-neutral-600 font-mono">
              Want full definitions, risk thresholds, and concrete code comparisons?
            </span>
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-[#cc5400] underline underline-offset-4 transition-colors"
            >
              <span>Explore Metrics Field Guide &amp; Legends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* CURATED QUICK-LAUNCH PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mb-10 text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#ff6b00]">
            <Search className="w-3.5 h-3.5" />
            <span>Direct Jump Pathways</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
            Quick Exploration Presets
          </h2>
          <p className="text-sm text-neutral-600">
            Jump directly into pre-filtered views of the 324-proposal corpus:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <button
            onClick={handleLaunchCompatHazards}
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-[#ff6b00]/60 hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Web-Compat Hazards
              </span>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#cc5400] transition-colors">
                SmooshGate Candidates
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Filter proposals that collide with legacy global properties or monkey-patched prototype methods.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-700 group-hover:text-neutral-900">
              <span>View Hazards</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          <button
            onClick={handleLaunchHighDisruption}
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-[#ff6b00]/60 hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Score &gt;= 3.5
              </span>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#cc5400] transition-colors">
                Deep Paradigm Shifts
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Explore proposals that mandate native engine architectural rewrites and compound value semantics.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-700 group-hover:text-neutral-900">
              <span>View Shifts</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          <button
            onClick={handleLaunchStage3}
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-[#ff6b00]/60 hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Implementation Gate
              </span>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#cc5400] transition-colors">
                Stage 3 Candidates
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Proposals with signed-off specifications currently undergoing active browser engine implementations.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-700 group-hover:text-neutral-900">
              <span>View Stage 3</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          <button
            onClick={handleLaunchDefensiveHardening}
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm hover:border-[#ff6b00]/60 hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Security Archetype
              </span>
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#cc5400] transition-colors">
                Defensive Hardening
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Proposals navigating the friction of realm isolation, object freezing, and integrity boundaries.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-700 group-hover:text-neutral-900">
              <span>View Hardening</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* BOTTOM ACTION CARD */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] p-8 sm:p-12 text-center text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 space-y-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-[#ff6b00]/20 blur-3xl"
          />

          <div className="relative z-10 space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Ready to explore the JavaScript roadmap?
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Filter by stage, intent archetype, disruption level, or run semantic natural language queries across all 324 proposals.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onExplore}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6b00] hover:bg-[#e05e00] px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-95"
            >
              <span>Launch Proposal Atlas</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onOpenGuide}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-6 py-3.5 text-sm font-medium text-neutral-300 hover:text-white transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-neutral-400" />
              <span>Read Field Guide</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
