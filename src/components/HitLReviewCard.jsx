import React, { useState } from 'react';
import { AlertTriangle, Check, X, Edit3, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export function HitLReviewCard({ reviewData, onResolveHitL }) {
  if (!reviewData) return null;

  const { decision, transcript } = reviewData;
  const [overridePrice, setOverridePrice] = useState(decision.unitPrice);
  const [overrideQty, setOverrideQty] = useState(decision.quantity);
  const [overrideName, setOverrideName] = useState(decision.finalItemName);
  const [isEditing, setIsEditing] = useState(false);

  const handleApprove = () => {
    onResolveHitL({
      action: 'APPROVE',
      item: {
        name: overrideName,
        quantity: Number(overrideQty),
        unitPrice: Number(overridePrice),
        totalPrice: Number(overrideQty) * Number(overridePrice),
        currency: decision.currency,
        catalogItem: decision.catalogItem,
        status: decision.status
      }
    });
  };

  const handleReject = () => {
    onResolveHitL({ action: 'REJECT' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-amber-500/40 p-5 sm:p-6 shadow-2xl shadow-amber-500/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Human-in-the-Loop Review Required
              </h3>
              <span className="text-[11px] text-amber-400 font-medium">
                {decision.status === 'PRICE_DRIFT_FLAGGED' ? 'Price Contradiction Guardrail' : 'New Item / Ambiguity Guardrail'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            FLAGGED
          </span>
        </div>

        {/* Spoken Transcript Context */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 mb-4">
          <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Spoken Input</span>
          <p className="text-xs text-slate-200 italic font-mono">"{transcript}"</p>
        </div>

        {/* Flag Explanation */}
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90 mb-5 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-amber-300 mb-0.5">Reason for Flag:</p>
            <p className="text-amber-200/80">{decision.flagReason}</p>
          </div>
        </div>

        {/* Dynamic Comparison Box (Historical vs Spoken) */}
        {decision.lastKnownPrice !== null && (
          <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Catalog Memory Price</span>
              <span className="text-sm font-bold text-slate-300 font-mono">
                {decision.currency} {decision.lastKnownPrice}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-semibold block uppercase">Spoken New Price</span>
              <span className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1">
                {decision.currency} {decision.unitPrice}
                <span className="text-[10px] text-amber-400 font-mono">
                  (+{decision.priceChangePercent?.toFixed(0)}%)
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Editable Details Form */}
        <div className="space-y-3 mb-6 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ledger Entry Preview</span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditing ? 'Done Editing' : 'Adjust Values'}</span>
            </button>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={overrideName}
                  onChange={(e) => setOverrideName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={overrideQty}
                  onChange={(e) => setOverrideQty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Unit Price</label>
                <input
                  type="number"
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs pt-1 font-mono">
              <span className="font-semibold text-white">{overrideName}</span>
              <span className="text-slate-400">
                {overrideQty} × {decision.currency} {overridePrice} = <strong className="text-emerald-400">{decision.currency} {overrideQty * overridePrice}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span>Discard Entry</span>
          </button>
          <button
            onClick={handleApprove}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve & Update Memory</span>
          </button>
        </div>
      </div>
    </div>
  );
}
