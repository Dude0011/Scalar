import React from 'react';
import { Terminal } from 'lucide-react';

export function TrajectoryTab({ lastRunResult, mode }) {
  if (!lastRunResult) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500 text-xs">
        No execution trajectory captured yet. Speak or process a transaction on the Voice Log tab!
      </div>
    );
  }

  const { parsed, decision, trajectory, durationMs } = lastRunResult;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Hackathon Agent Trajectory & Tool Execution Log
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          Vercel Backend Runtime: <strong className="text-blue-400">{durationMs || 0}ms</strong>
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {mode === 'BASELINE' ? (
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Memoryless Baseline Execution</span>
            <p className="text-zinc-300 text-xs font-sans">
              1-Shot Prompt LLM $\rightarrow$ No catalog memory $\rightarrow$ No price drift guardrails.
            </p>
          </div>
        ) : (
          trajectory && trajectory.map((step, idx) => (
            <div key={idx} className="bg-black p-3 rounded-xl border border-zinc-800 relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-xl" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase">
                  Step {idx + 1}: {step.tool || step.step}
                </span>
                <span className="text-[10px] text-zinc-500">{step.action}</span>
              </div>
              <p className="text-zinc-300 text-xs font-sans">{step.output}</p>
            </div>
          ))
        )}
      </div>

      {decision && (
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Final Decision Status:</span>
          <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-black text-blue-400 border border-blue-500/30">
            {decision.status}
          </span>
        </div>
      )}
    </div>
  );
}
