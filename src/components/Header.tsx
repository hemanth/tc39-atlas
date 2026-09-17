import React from 'react';
import { Layers, RefreshCw, BookOpen, Key, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
  hasKey: boolean;
  maskedKey: string | null;
  onOpenKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  filteredCount,
  onResetFilters,
  isFiltered,
  hasKey,
  maskedKey,
  onOpenKeyModal,
}) => {
  return (
    <header className="border-b border-surface-border bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-pastel-lavender flex items-center justify-center text-pastel-lavenderDeep shadow-sm border border-purple-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-stone-900">
                  TC39 Proposal Atlas
                </h1>
                <button
                  onClick={onOpenKeyModal}
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium border flex items-center gap-1 transition-all active:scale-95 ${
                    hasKey
                      ? 'bg-pastel-mint text-pastel-mintDeep border-emerald-300'
                      : 'bg-pastel-butter text-pastel-butterDeep border-amber-300 hover:bg-pastel-butter/80'
                  }`}
                  title="Click to configure live TypeSafe API key"
                >
                  {hasKey ? (
                    <>
                      <ShieldCheck className="w-3 h-3" />
                      <span>Jev Live ({maskedKey})</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3 h-3" />
                      <span>Connect API Key</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                <span>Multi-dimensional semantic classification with Jev primitives</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-surface-muted px-3 py-1.5 rounded-lg border border-surface-border text-xs font-mono">
              <span className="text-stone-500">Showing</span>
              <span className="font-semibold text-stone-900">{filteredCount}</span>
              <span className="text-stone-400">/</span>
              <span className="text-stone-600">{totalCount}</span>
            </div>

            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-surface-border text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-all flex items-center gap-1 shadow-sm active:scale-95"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            )}

            <button
              onClick={onOpenKeyModal}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium active:scale-95 ${
                hasKey
                  ? 'bg-surface-muted text-stone-700 border-surface-border hover:bg-stone-100'
                  : 'bg-pastel-butter text-pastel-butterDeep border-amber-300 font-semibold shadow-sm'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{hasKey ? 'API Key Settings' : 'Set API Key'}</span>
            </button>

            <a
              href="https://github.com/tc39/proposals"
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-sm font-medium active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              TC39 GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
