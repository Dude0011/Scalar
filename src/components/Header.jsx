import React from 'react';
import { Mic, BarChart2, Package, Terminal, Settings, RotateCcw } from 'lucide-react';

export function Header({ activeTab, setActiveTab, mode, setMode, onOpenSettings, onResetCatalog, hasApiKeys }) {
  return (
    <header className="sticky top-0 z-40 bg-black border-b border-zinc-800 px-4 py-3 sm:px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-3">
        
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                Scalar
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  PWA • USD
                </span>
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium">
                Scalar keeps your business numbers straight.
              </p>
            </div>
          </div>

          {/* Controls & Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode(mode === 'AGENT' ? 'BASELINE' : 'AGENT')}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                mode === 'AGENT'
                  ? 'bg-zinc-900 border-blue-500/40 text-blue-400 font-semibold'
                  : 'bg-zinc-900 border-amber-500/40 text-amber-400'
              }`}
              title="Toggle between Scalar Agent (RAG) and Memoryless Baseline"
            >
              {mode === 'AGENT' ? 'Agent (RAG)' : 'Baseline'}
            </button>

            <button
              onClick={onResetCatalog}
              title="Reset memory & ledger"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              className={`p-1.5 rounded-lg border text-xs font-medium ${
                hasApiKeys ? 'bg-zinc-900 border-emerald-500/30 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
              title="Vercel serverless keys handles API backend. Optional custom key config."
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimalist Mobile Navigation Tabs */}
        <nav className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('LOG')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'LOG' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Log</span>
          </button>

          <button
            onClick={() => setActiveTab('TALLY')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'TALLY' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Tally</span>
          </button>

          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'INVENTORY' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('TRAJECTORY')}
            className={`py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors ${
              activeTab === 'TRAJECTORY' ? 'bg-zinc-800 text-blue-400 font-bold border border-zinc-700' : 'hover:text-white'
            }`}
            title="Judge Trajectory Inspector"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
