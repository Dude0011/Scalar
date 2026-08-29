import React, { useState } from 'react';
import { Sparkles, Package, Plus, CheckCircle, Store, Zap, X, ArrowRight, Mic, ShieldCheck, Database } from 'lucide-react';

export function OnboardingModal({ isOpen, onClose, onPopulateMock, onAddCustomItem, onFinish, itemCount }) {
  const [step, setStep] = useState(1); // 1 = Welcome Screen, 2 = Inventory Setup Screen
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('30');
  const [supplier, setSupplier] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-10-15');
  const [addedItems, setAddedItems] = useState([]);

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    const newItem = onAddCustomItem({
      name: name.trim(),
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 20,
      supplier: supplier.trim() || 'Direct Supplier',
      expiryDate: expiryDate.trim() || '2026-10-15'
    });
    setAddedItems((prev) => [...prev, newItem || { name: name.trim(), currentPrice: parseFloat(price) || 0 }]);
    setName('');
    setPrice('');
    setSupplier('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white flex flex-col gap-5 max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: WELCOME SCREEN */}
        {step === 1 ? (
          <div className="flex flex-col items-center text-center py-2 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-inner">
              <Store className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Voice-First Stateful Commerce Engine
              </span>
              <h2 className="text-xl font-black tracking-tight text-white mt-2">Welcome to Scalar</h2>
              <p className="text-xs text-zinc-400 mt-1 font-medium max-w-xs mx-auto">
                Scalar keeps your business numbers straight. Built with RAG-based item memory and automated audit guardrails.
              </p>
            </div>

            {/* Core Features */}
            <div className="w-full space-y-2.5 text-left text-xs bg-black p-3.5 rounded-2xl border border-zinc-800/80">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Voice-First Transaction Logging</h4>
                  <p className="text-[11px] text-zinc-400">Speak sales in natural English. Auto-converts to ledger records.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Stateful RAG Inventory</h4>
                  <p className="text-[11px] text-zinc-400">Real-time stock deduction, price history tracking, and expiry alerts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Automated Audit Guardrails</h4>
                  <p className="text-[11px] text-zinc-400">Flags price drift anomalies before committing transactions.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-600/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* STEP 2: INVENTORY SETUP & POPULATION */
          <div className="space-y-4">
            <div className="text-center pr-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-base font-black tracking-tight text-white">Setup Store Inventory</h2>
              <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                Populate with demo shop items or enter custom products:
              </p>
            </div>

            {/* Option A: Demo Mock Data */}
            <div className="bg-black border border-blue-500/30 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Option A: Populate Demo Shop</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                  Recommended
                </span>
              </div>

              <p className="text-[11px] text-zinc-400">
                Instantly adds 4 US Coffee Shop items (*Artisan Croissant, Oat Latte, Espresso Beans, Avocado Toast*) with inventory stock & prices.
              </p>

              <button
                onClick={() => {
                  onPopulateMock();
                  onFinish();
                }}
                className="w-full mt-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Populate with Demo Data & Launch</span>
              </button>
            </div>

            {/* Option B: Manual Custom Add */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-zinc-400" />
                Option B: Add Custom Product
              </span>

              <form onSubmit={handleAdd} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name (e.g. Matcha)"
                    className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price USD ($)"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Stock Qty"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Supplier (Optional)"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || !price}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product to Catalog</span>
                </button>
              </form>

              {/* Added Items Pill List */}
              {addedItems.length > 0 && (
                <div className="pt-2 border-t border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 font-mono block">Added in setup:</span>
                  {addedItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] font-mono text-emerald-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                      <span>{item.name}</span>
                      <span>${item.currentPrice?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Store Button */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-2xl text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={onFinish}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Launch Store & Start Logging ({itemCount > 0 ? `${itemCount} Items` : 'Ready'})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
