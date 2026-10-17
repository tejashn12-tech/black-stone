import React, { useState } from 'react';
import { ShoppingListItem } from '../../types/diet';
import {
  ShoppingCart,
  CheckCircle2,
  Circle,
  Coins,
  Copy,
  Printer,
  X,
  Sparkles,
  Share2
} from 'lucide-react';

interface GroceryShoppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingListItem[];
}

export const GroceryShoppingModal: React.FC<GroceryShoppingModalProps> = ({
  isOpen,
  onClose,
  items: initialItems
}) => {
  const [items, setItems] = useState<ShoppingListItem[]>(initialItems);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const togglePurchased = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isPurchased: !item.isPurchased } : item))
    );
  };

  const totalCost = items.reduce((acc, i) => acc + i.estimatedCostInr, 0);
  const purchasedCount = items.filter(i => i.isPurchased).length;

  const categories: { key: ShoppingListItem['category']; label: string }[] = [
    { key: 'produce', label: 'Fresh Produce (Vegetables & Fruits)' },
    { key: 'protein', label: 'Proteins & Pulses (Chicken, Fish, Eggs, Dal, Soya)' },
    { key: 'dairy', label: 'Dairy (Paneer, Curd, Greek Yogurt, Milk)' },
    { key: 'grains', label: 'Whole Grains (Brown Rice, Oats, Ragi, Quinoa, Atta)' },
    { key: 'fats', label: 'Healthy Fats & Nuts (Almonds, Olive Oil, Ghee, Seeds)' },
    { key: 'spices_pantry', label: 'Spices & Pantry Herbs' }
  ];

  const handleCopyList = () => {
    const text = items
      .map(i => `[${i.isPurchased ? 'X' : ' '}] ${i.name} - ${i.totalQuantity} (~₹${i.estimatedCostInr})`)
      .join('\n');
    navigator.clipboard.writeText(`*Black Stone Fitness — 7-Day Grocery List*\n\n${text}\n\n*Total Estimated Budget: ₹${totalCost}*`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wide text-white">
                Categorized 7-Day Grocery List
              </h2>
              <p className="text-xs text-zinc-400">
                {purchasedCount} of {items.length} items collected · Estimated Total: <span className="font-mono text-orange-400 font-bold">₹{totalCost}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyList}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
              title="Copy checklist to WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
              title="Print shopping list"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {copied && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full grocery list copied to clipboard! Share directly to WhatsApp or notes.</span>
            </div>
          )}

          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat.key);
            if (catItems.length === 0) return null;

            return (
              <div key={cat.key} className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 border-b border-zinc-800/80 pb-1">
                  {cat.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => togglePurchased(item.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between select-none ${
                        item.isPurchased
                          ? 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500 line-through'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.isPurchased ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-bold leading-tight">{item.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{item.totalQuantity}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-zinc-400 font-bold ml-2">
                        ₹{item.estimatedCostInr}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            *Pricing calibrated to Mysuru / Karnataka fresh produce market rates.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition"
          >
            Done Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
