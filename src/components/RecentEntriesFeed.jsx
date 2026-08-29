import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../services/catalogStore';

export function RecentEntriesFeed({ ledger, onDeleteEntry }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm mb-5">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-800">
        <div>
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Recent Spoken Logs Feed
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Relative timestamps prevent accidental duplicate logging
          </p>
        </div>
        <span className="text-[11px] font-mono font-medium text-zinc-300 bg-black px-2 py-0.5 rounded border border-zinc-800">
          {ledger.length} log{ledger.length === 1 ? '' : 's'}
        </span>
      </div>

      {ledger.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-xs">
          No transactions logged in this session yet. Speak a sale above!
        </div>
      ) : (
        <div className="space-y-2">
          {ledger.map((item) => {
            const isFlagged = item.status === 'PRICE_DRIFT_FLAGGED' || item.status === 'NEW_ITEM_FLAGGED';

            return (
              <div
                key={item.id}
                className="bg-black border border-zinc-800/90 rounded-xl p-3 flex items-center justify-between hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      item.mode === 'BASELINE'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : isFlagged
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {item.mode === 'BASELINE' ? 'B' : isFlagged ? '!' : '✓'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                      <span>${item.unitPrice} / unit</span>
                      <span>•</span>
                      <span className="text-blue-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 inline" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-emerald-400 block">
                      ${item.totalPrice?.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-sans">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteEntry(item.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors rounded hover:bg-zinc-900"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
