import React from 'react';
import { Receipt, Trash2, Calendar, Tag, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export function LedgerView({ ledger, onDeleteEntry, catalogItems }) {
  // Calculate total NGN & USD spend
  const totals = ledger.reduce(
    (acc, item) => {
      const curr = item.currency || 'NGN';
      acc[curr] = (acc[curr] || 0) + (item.totalPrice || 0);
      return acc;
    },
    { NGN: 0, USD: 0 }
  );

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl mb-6">
      
      {/* Top Header & Totals */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Session Transaction Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {ledger.length} logged transaction{ledger.length === 1 ? '' : 's'} in current session memory
          </p>
        </div>

        {/* Totals Pill Badges */}
        <div className="flex items-center gap-2">
          {totals.NGN > 0 && (
            <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Total NGN</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                ₦{totals.NGN.toLocaleString()}
              </span>
            </div>
          )}
          {totals.USD > 0 && (
            <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Total USD</span>
              <span className="text-sm font-extrabold text-indigo-400 font-mono">
                ${totals.USD.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ledger Entries List */}
      {ledger.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
          <p className="text-xs font-semibold text-slate-400">No transactions logged yet</p>
          <p className="text-[11px] text-slate-500 mt-1">Speak a transaction using the mic or click a test clip above.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {ledger.map((item) => {
            const isFlagged = item.status === 'PRICE_DRIFT_FLAGGED' || item.status === 'NEW_ITEM_FLAGGED';
            const isBaseline = item.mode === 'BASELINE';

            return (
              <div
                key={item.id}
                className="glass-card rounded-xl p-3.5 border flex items-center justify-between transition-all hover:bg-slate-800/80"
              >
                <div className="flex items-center gap-3">
                  {/* Status Indicator Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isBaseline
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : isFlagged
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {isBaseline ? 'B' : isFlagged ? '!' : '✓'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        Qty: {item.quantity}
                      </span>
                      {item.isConsolidated && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          RAG Match
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span>Unit: {item.currency} {item.unitPrice}</span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Price & Delete Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-xs font-extrabold text-emerald-400 block">
                      {item.currency === 'USD' ? '$' : '₦'}{item.totalPrice}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">
                      {isBaseline ? 'Baseline' : 'Scalar Agent'}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteEntry(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-900"
                    title="Remove entry"
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
