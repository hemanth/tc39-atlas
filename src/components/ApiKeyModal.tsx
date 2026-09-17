import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasKey: boolean;
  maskedKey: string | null;
  onSaveKey: (key: string) => Promise<boolean>;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  hasKey,
  maskedKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError('Please enter your TypeSafe API key.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const ok = await onSaveKey(inputKey.trim());
      if (ok) {
        setSuccess(true);
        setInputKey('');
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      } else {
        setError('Failed to save API key. Please verify the key.');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving API key');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-canvas">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pastel-lavender flex items-center justify-center text-pastel-lavenderDeep border border-purple-200">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">TypeSafe API Configuration</h3>
              <p className="text-[11px] text-stone-500">Connect to the live Jev System One engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Current Status */}
          <div className="p-3 rounded-xl border flex items-center justify-between bg-surface-muted border-surface-border">
            <span className="text-stone-600">Current Status:</span>
            {hasKey ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-medium">
                <ShieldCheck className="w-3 h-3" />
                Active ({maskedKey})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                Local Emulator (No key)
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="apiKey" className="font-semibold text-stone-700 block">
              Enter TypeSafe API Key
            </label>
            <input
              id="apiKey"
              type="password"
              placeholder="ts_..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-surface-canvas border border-surface-border rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
            />
            <p className="text-[11px] text-stone-400">
              Saved securely server-side in your project's local <code className="font-mono text-stone-600">.env</code> file.
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-1.5 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5 text-[11px]">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>API key updated! Live Jev connection active.</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://typesafe.ai"
              target="_blank"
              rel="noreferrer"
              className="text-stone-500 hover:text-stone-800 text-[11px] inline-flex items-center gap-1 underline underline-offset-2"
            >
              Get a key at typesafe.ai <ExternalLink className="w-2.5 h-2.5" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-surface-border text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Connecting...' : 'Save & Connect'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
