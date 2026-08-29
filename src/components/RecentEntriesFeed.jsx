import React, { useState } from 'react';
import { Clock, Trash2, Edit3, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, X, Check } from 'lucide-react';
import { formatRelativeTime } from '../services/catalogStore';

export function RecentEntriesFeed({ ledger, onDeleteEntry, onUpdateEntry }) {
  const [editingEntry, setEditingEntry] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState(1);
  const [editPrice, setEditPrice] = useState('');

  const handleOpenEdit = (item) => {
    setEditingEntry(item);
    setEditName(item.name);
    setEditQty(item.quantity || 1);
    setEditPrice(item.unitPrice || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingEntry || !onUpdateEntry) return;

    onUpdateEntry(editingEntry.id, {
      name: editName,
      quantity: editQty,
      unitPrice: editPrice
    });

    setEditingEntry(null);
  };

  const renderConfidenceBadge = (item) => {
    const confidence = item.confidence || (item.status === 'CONFIRMED' ? 98 : 65);
    const label = item.confidenceLabel || (item.status === 'CONFIRMED' ? 'HIGH' : 'MEDIUM');

    if (label === 'AUDITED' || item.status === 'AUDITED') {
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          100% • Audited
        </span>
      );
    }

    if (confidence >= 90) {
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {confidence}% • Sure
        </span>
      );
    }

    if (confidence >= 60) {
      const isPriceDrift = item.status === 'PRICE_DRIFT_FLAGGED';
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {confidence}% • {isPriceDrift ? 'Price Drift' : 'Medium'}
        </span>
      );
    }

    return (
      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
        <HelpCircle className="w-3 h-3" />
        {confidence}% • Unsure
      </span>
    );
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 shadow-sm mb-5 relative">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Recent Spoken Logs Feed
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
            Spoken transactions log immediately with confidence scores. Tap any row to audit or adjust.
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold text-zinc-300 bg-black px-2.5 py-1 rounded-lg border border-zinc-800">
          {ledger.length} log{ledger.length === 1 ? '' : 's'}
        </span>
      </div>

      {ledger.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 text-xs font-medium">
          No transactions logged in this session yet. Speak a sale above!
        </div>
      ) : (
        <div className="space-y-2.5">
          {ledger.map((item) => (
            <div
              key={item.id}
              className="bg-black border border-zinc-800/90 hover:border-zinc-700/80 rounded-2xl p-3.5 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    item.confidenceLabel === 'AUDITED'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : item.confidence >= 90
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : item.confidence >= 60
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {item.confidenceLabel === 'AUDITED' ? 'A' : item.confidence >= 90 ? '✓' : '!'}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white truncate">{item.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      Qty: {item.quantity}
                    </span>
                    {renderConfidenceBadge(item)}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    <span>${item.unitPrice?.toFixed(2)} / unit</span>
                    <span>•</span>
                    <span className="text-blue-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 inline" />
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-emerald-400 block">
                    ${item.totalPrice?.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-sans">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                    title="Audit / Adjust transaction"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteEntry(item.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INLINE AUDIT MODAL */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-white space-y-4 relative">
            <button
              onClick={() => setEditingEntry(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                Audit Transaction Log
              </div>
              <p className="text-xs text-zinc-400">
                Adjust details to override AI confidence score to 100% Audited.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-black rounded-xl border border-zinc-800/80 flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium">New Total:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${((parseInt(editQty) || 1) * (parseFloat(editPrice) || 0)).toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Audit Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
