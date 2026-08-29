import React from 'react';
import { Package, AlertTriangle, PhoneCall, Calendar } from 'lucide-react';

export function InventoryTab({ catalogItems }) {
  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            Live Inventory & Depletion Tracking
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Voice logs automatically reduce stock count in real-time
          </p>
        </div>
        <span className="text-[11px] font-mono text-zinc-300 bg-black px-2 py-1 rounded border border-zinc-800">
          {catalogItems.length} Products
        </span>
      </div>

      <div className="space-y-3">
        {catalogItems.map((item) => {
          const isLowStock = item.currentStock <= item.minStockThreshold;
          const percentRemaining = Math.min(100, Math.max(0, (item.currentStock / item.maxStock) * 100));

          return (
            <div
              key={item.id}
              className={`bg-zinc-950 border rounded-2xl p-4 transition-all ${
                isLowStock ? 'border-amber-500/40 bg-amber-500/5' : 'border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    {isLowStock && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock Alert
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Supplier: {item.supplier || 'Direct Wholesaler'}
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-black text-white block">
                    {item.currentStock} / {item.maxStock} units
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    ${item.currentPrice} / unit
                  </span>
                </div>
              </div>

              {/* Depletion Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                  <span>Stock Level</span>
                  <span>{percentRemaining.toFixed(0)}% remaining</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLowStock ? 'bg-amber-500' : percentRemaining < 40 ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentRemaining}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-800/80">
                <span className="text-zinc-400 flex items-center gap-1 font-mono text-[10px]">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  Exp: {item.expiryDate || 'N/A'}
                </span>

                {isLowStock && (
                  <button
                    onClick={() => alert(`[AI Agent Future Action]: Placing automated order call to ${item.supplier} for 30 units of ${item.name}...`)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Auto-Reorder Supplier</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
