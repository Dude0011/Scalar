import React from 'react';
import { DollarSign, ShoppingBag, Award } from 'lucide-react';

export function TallyTab({ ledger, catalogItems }) {
  const totalRevenue = ledger.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const totalItemsSold = ledger.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const salesMap = {};
  ledger.forEach((item) => {
    const name = item.name;
    salesMap[name] = (salesMap[name] || 0) + (item.quantity || 0);
  });

  const sortedSellers = Object.entries(salesMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      {/* Revenue & Volume Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Sales</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-white font-mono block">
            ${totalRevenue.toFixed(2)}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">End of Day Tally</span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Units Sold</span>
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl font-black text-white font-mono block">
            {totalItemsSold}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5 block">{ledger.length} Spoken Logs</span>
        </div>
      </div>

      {/* Fast Selling Products Insight Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Top Fast-Selling Products Insight
            </h3>
          </div>
          <span className="text-[10px] text-blue-400 font-mono">Velocity</span>
        </div>

        {sortedSellers.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-4">No sales logged in current session to calculate velocity.</p>
        ) : (
          <div className="space-y-2.5">
            {sortedSellers.map(([name, count], rank) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] ${
                    rank === 0 ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400'
                  }`}>
                    #{rank + 1}
                  </span>
                  <span className="font-bold text-white">{name}</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">
                  {count} unit{count === 1 ? '' : 's'} sold
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
