import React from 'react';
import { Cpu, Terminal, ArrowRight, CheckCircle, ShieldAlert, FastForward, Play } from 'lucide-react';

export function TrajectoryInspector({ lastRunResult, mode }) {
  if (!lastRunResult) return null;

  const { transcript, parsed, decision, trajectory, durationMs } = lastRunResult;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Agent Trajectory & Tool Execution Inspector
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Execution Time: <strong className="text-indigo-400">{durationMs || 0}ms</strong>
        </span>
      </div>

      {/* Trajectory Timeline Steps */}
      <div className="space-y-3 font-mono text-xs">
        {mode === 'BASELINE' ? (
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
            <span className="text-[10px] text-amber-400 font-bold block uppercase">Memoryless Baseline Flow</span>
            <div className="text-slate-300">
              Direct Prompt LLM $\rightarrow$ No Catalog RAG Search $\rightarrow$ No Price Verification Guardrail.
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-400 text-[11px]">
              Extracted Raw: {JSON.stringify(parsed)}
            </div>
          </div>
        ) : (
          trajectory && trajectory.map((step, idx) => (
            <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 relative pl-4">
              {/* Step indicator bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl" />
              
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  Step {idx + 1}: {step.tool || step.step}
                </span>
                <span className="text-[10px] text-slate-500">{step.action}</span>
              </div>

              <div className="text-slate-200 text-[11px] font-sans">
                {step.output}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Decision Summary Footer */}
      {decision && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Final Agent Status:</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
            decision.status === 'CONFIRMED'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            {decision.status}
          </span>
        </div>
      )}
    </div>
  );
}
