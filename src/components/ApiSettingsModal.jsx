import React, { useState } from 'react';
import { Key, Save, X, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ApiSettingsModal({ isOpen, onClose, apiKeys, onSaveKeys }) {
  if (!isOpen) return null;

  const [fireworksKey, setFireworksKey] = useState(apiKeys.fireworksKey || '');
  const [groqKey, setGroqKey] = useState(apiKeys.groqKey || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveKeys({ fireworksKey: fireworksKey.trim(), groqKey: groqKey.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">API Key Configuration</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Keys are stored locally in your browser session for direct API calls to Fireworks AI and Groq.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fireworks AI Key Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center justify-between">
              <span>Fireworks AI API Key (Paid Plan)</span>
              <span className="text-[10px] text-indigo-400 font-mono">Llama 3.3 70B Reasoning</span>
            </label>
            <input
              type="password"
              value={fireworksKey}
              onChange={(e) => setFireworksKey(e.target.value)}
              placeholder="fw_..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Groq API Key Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center justify-between">
              <span>Groq API Key</span>
              <span className="text-[10px] text-indigo-400 font-mono">Whisper STT</span>
            </label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
