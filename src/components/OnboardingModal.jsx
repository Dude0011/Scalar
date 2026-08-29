import React, { useState } from 'react';
import { Sparkles, Package, Plus, CheckCircle, Store, Zap } from 'lucide-react';

export function OnboardingModal({ isOpen, onPopulateMock, onAddCustomItem, onFinish, itemCount }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('30');
  const [supplier, setSupplier] = useState('');
  const [addedItems, setAddedItems] = useState([]);

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    const newItem = onAddCustomItem({
      name: name.trim(),
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 20,
      supplier: supplier.trim() || 'Direct Supplier'
    });
    setAddedItems((prev) => [...prev, newItem || { name: name.trim(), currentPrice: parseFloat(price) || 0 }]);
    setName('');
    setPrice('');
    setSupplier('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        
        {/* Banner Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white">Welcome to Scalar</h2>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            Scalar keeps your business numbers straight. Set up your store inventory below to get started.
          </p>
        </div>

        {/* 1-Click Mock Data Option */}
        <div className="bg-black border border-blue-500/30 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Option A: Quick Demo Setup</span>
            </div>
            <span className="text-[10px] font-mono bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
              Recommended
            </span>
          </div>

          <p className="text-[11px] text-zinc-400">
            Populates 4 US Coffee Shop items (*Artisan Croissant, Oat Latte, Espresso Beans, Avocado Toast*) with inventory stock & prices.
          </p>

          <button
            onClick={onPopulateMock}
            className="w-full mt-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Populate with Demo Shop Data</span>
          </button>
        </div>

        {/* Manual Custom Add Section */}
        <div className="bg-black border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-zinc-400" />
              Option B: Add Custom Product
            </span>
          </div>

          <form onSubmit={handleAdd} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name (e.g. Matcha Powder)"
                className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price in USD ($)"
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Initial Stock Qty"
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Supplier (Optional)"
                className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !price}
              className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product to Catalog</span>
            </button>
          </form>

          {/* List of Custom Added Items in this Session */}
          {addedItems.length > 0 && (
            <div className="pt-2 border-t border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-400 font-mono block">Added in setup:</span>
              {addedItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] font-mono text-emerald-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                  <span>{item.name}</span>
                  <span>${item.currentPrice?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action / Finish Button */}
        <button
          onClick={onFinish}
          disabled={itemCount === 0 && addedItems.length === 0}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Launch Store ({itemCount > 0 ? `${itemCount} Items` : 'Ready'})</span>
        </button>
      </div>
    </div>
  );
}
