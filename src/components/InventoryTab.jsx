import React, { useState } from 'react';
import { Package, Plus, Mic, Square, Edit3, Trash2, Check, X, AlertTriangle, PhoneCall, Calendar, RefreshCw, Zap, Sparkles } from 'lucide-react';

export function InventoryTab({ catalogItems, onAddItem, onEditItem, onDeleteItem, onPopulateMock, isProcessing, onProcessTranscript }) {
  // New Item State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('20');
  const [supplier, setSupplier] = useState('');
  const [addMode, setAddMode] = useState('FORM'); // 'FORM' | 'VOICE'

  // Voice recording state for stock add
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editSupplier, setEditSupplier] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onAddItem({
      name: name.trim(),
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 20,
      supplier: supplier.trim() || 'Direct Wholesaler'
    });
    setName('');
    setPrice('');
    setSupplier('');
  };

  const startVoiceStockAdd = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onProcessTranscript(null, audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied.');
    }
  };

  const stopVoiceStockAdd = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(item.currentPrice.toString());
    setEditStock(item.currentStock.toString());
    setEditSupplier(item.supplier || '');
  };

  const saveEdit = () => {
    if (!editingItem) return;
    onEditItem(editingItem.id, {
      name: editName,
      currentPrice: parseFloat(editPrice),
      currentStock: parseInt(editStock),
      supplier: editSupplier
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Header & Quick Action */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            Inventory & Stock Manager
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Add products via voice/text, edit prices, or adjust stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPopulateMock}
            title="Reset catalog to Demo Mock Data"
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-blue-400 rounded-lg font-mono flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Mock Set</span>
          </button>
          <span className="text-[11px] font-mono text-zinc-300 bg-black px-2 py-1 rounded border border-zinc-800">
            {catalogItems.length} Products
          </span>
        </div>
      </div>

      {/* Add New Product / Stock Section (Voice or Form) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            Add Stock or New Product
          </span>

          <div className="bg-black p-0.5 rounded-lg border border-zinc-800 flex text-[11px]">
            <button
              onClick={() => setAddMode('FORM')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                addMode === 'FORM' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'
              }`}
            >
              Text Form
            </button>
            <button
              onClick={() => setAddMode('VOICE')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                addMode === 'VOICE' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400'
              }`}
            >
              <Mic className="w-3 h-3 text-white" />
              <span>Voice Entry</span>
            </button>
          </div>
        </div>

        {addMode === 'FORM' ? (
          <form onSubmit={handleCreateSubmit} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name (e.g. Organic Matcha)"
                className="col-span-2 bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price USD ($)"
                className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock Quantity"
                className="bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Supplier Name (Optional)"
                className="col-span-2 bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !price}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save to Inventory</span>
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-5 bg-black rounded-xl border border-zinc-800/80">
            <button
              onClick={isRecording ? stopVoiceStockAdd : startVoiceStockAdd}
              disabled={isProcessing}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-rose-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isRecording ? <Square className="w-6 h-6 text-white" /> : <Mic className="w-7 h-7 text-white" />}
            </button>
            <p className="text-xs font-bold text-white mt-3">
              {isRecording ? 'Listening...' : isProcessing ? 'Parsing Voice Item...' : 'Tap Mic & Speak Product details'}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              e.g. "Add 50 boxes of Matcha Powder at 12 dollars"
            </p>
          </div>
        )}
      </div>

      {/* Catalog Items List with CRUD Actions */}
      <div className="space-y-3">
        {catalogItems.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500 text-xs">
            No items in inventory yet. Use the add form above or tap "Mock Set" to populate demo data!
          </div>
        ) : (
          catalogItems.map((item) => {
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-black hover:bg-zinc-900 border border-zinc-800 transition-colors"
                      title="Edit Item details & price"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${item.name} from inventory?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 bg-black hover:bg-zinc-900 border border-zinc-800 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stock Level & Price Summary */}
                <div className="flex justify-between items-center my-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Stock:</span>
                    <button
                      onClick={() => onEditItem(item.id, { currentStock: Math.max(0, item.currentStock - 1) })}
                      className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold"
                      title="Quick Subtract Stock"
                    >
                      -1
                    </button>
                    <span className="font-black text-white px-1">{item.currentStock} / {item.maxStock}</span>
                    <button
                      onClick={() => onEditItem(item.id, { currentStock: item.currentStock + 5 })}
                      className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 font-bold"
                      title="Quick Add +5 Stock"
                    >
                      +5
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-xs">
                      ${item.currentPrice?.toFixed(2)} / unit
                    </span>
                  </div>
                </div>

                {/* Depletion Bar */}
                <div className="mb-3">
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
                      onClick={() => alert(`[Supplier Order Call]: Placing order to ${item.supplier} for 30 units of ${item.name}...`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Auto-Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-5 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Edit Product Details</h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Stock Level</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Supplier Name</label>
                <input
                  type="text"
                  value={editSupplier}
                  onChange={(e) => setEditSupplier(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
