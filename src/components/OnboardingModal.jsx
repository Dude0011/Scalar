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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-white flex flex-col gap-6 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-all"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: SPACIOUS WELCOME SCREEN */}
        {step === 1 ? (
          <div className="flex flex-col items-center text-center py-2 space-y-6">
            
            {/* Store Icon Badge */}
            <div className="w-18 h-18 p-4 rounded-3xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-600/10">
              <Store className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Welcome to Scalar
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto font-medium">
                Scalar keeps your business numbers straight. Built with persistent RAG memory, stock tracking, and real-time transaction auditing.
              </p>
            </div>

            {/* Clean Spaced Feature Highlights */}
            <div className="w-full space-y-3.5 text-left bg-black/60 p-4 sm:p-5 rounded-2xl border border-zinc-800/90">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5 shrink-0 border border-blue-500/20">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Instant Voice-to-Ledger</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-normal">
                    Speak your sales naturally in English (e.g. *"Sold 2 croissants for $9"*). Everything gets logged immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0 border border-emerald-500/20">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Stateful RAG Inventory</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-normal">
                    Real-time stock level depletion, price history tracking, and expiry date monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5 shrink-0 border border-amber-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white tracking-wide">Confidence Badges & In-Feed Audits</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-normal">
                    Every entry gets logged instantly with a confidence score. Tap any logged sale anytime to audit or adjust.
                  </p>
                </div>
              </div>
            </div>

            {/* Prominent Action Button */}
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20 tracking-wider uppercase"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* STEP 2: INVENTORY SETUP & POPULATION */
          <div className="space-y-5">
            <div className="text-center pr-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-2.5">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">Setup Store Inventory</h2>
              <p className="text-xs text-zinc-400 mt-1 font-medium leading-normal">
                Populate with demo shop items or add your own custom products:
              </p>
            </div>

            {/* Option A: Demo Mock Data */}
            <div className="bg-black/80 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Option A: Populate Demo Shop</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md">
                  Recommended
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Instantly loads 4 US Coffee Shop products (*Artisan Croissant, Oat Latte, Espresso Beans, Avocado Toast*) with prices & stock.
              </p>

              <button
                onClick={() => {
                  onPopulateMock();
                  onFinish();
                }}
                className="w-full mt-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Zap className="w-4 h-4" />
                <span>Populate Demo Data & Launch</span>
              </button>
            </div>

            {/* Option B: Manual Custom Add */}
            <div className="bg-black/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-zinc-400" />
                Option B: Add Custom Product
              </span>

              <form onSubmit={handleAdd} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name (e.g. Matcha)"
                    className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price USD ($)"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Stock Qty"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Supplier (Optional)"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!name.trim() || !price}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product to Catalog</span>
                </button>
              </form>

              {/* Added Items Pill List */}
              {addedItems.length > 0 && (
                <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                  <span className="text-[10px] text-zinc-400 font-mono block">Added in setup:</span>
                  {addedItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] font-mono text-emerald-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
                      <span>{item.name}</span>
                      <span>${item.currentPrice?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Store Button */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-2xl text-xs font-semibold transition-colors"
              >
                Back
              </button>
              <button
                onClick={onFinish}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Launch Store ({itemCount > 0 ? `${itemCount} Items` : 'Ready'})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
