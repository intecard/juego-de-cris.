import React, { useState } from 'react';
import { ITEMS_CATALOG, CRAFTING_RECIPES } from '../data/items';
import { sound } from '../utils/audio';
import { Backpack, Hammer, Sparkles, X, Plus } from 'lucide-react';

interface InventoryCraftingModalProps {
  inventory: Record<string, number>;
  onCraftItem: (recipeId: string) => void;
  onClose: () => void;
}

export const InventoryCraftingModal: React.FC<InventoryCraftingModalProps> = ({
  inventory,
  onCraftItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'Inventory' | 'Crafting'>('Inventory');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              {activeTab === 'Inventory' ? <Backpack className="w-6 h-6" /> : <Hammer className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {activeTab === 'Inventory' ? 'Mochila de Explorador' : 'Mesa de Fabricación (Crafting)'}
              </h2>
              <p className="text-xs text-slate-400">Gestiona objetos, cápsulas de captura y crea equipamiento.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('Inventory')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'Inventory' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Mochila
              </button>
              <button
                onClick={() => setActiveTab('Crafting')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'Crafting' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Fabricar (Craft)
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'Inventory' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ITEMS_CATALOG.map(item => {
                const count = inventory[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3 relative"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-xl border border-slate-700 text-amber-400">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-white truncate">{item.nameEs}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                      <span className="text-[10px] text-amber-400 font-bold mt-1 block">
                        Cantidad: {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CRAFTING_RECIPES.map(recipe => {
                const resultItem = ITEMS_CATALOG.find(i => i.id === recipe.resultItemId);
                if (!resultItem) return null;

                const canCraft = recipe.ingredients.every(ing => (inventory[ing.itemId] || 0) >= ing.amount);

                return (
                  <div
                    key={recipe.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{resultItem.nameEs}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{resultItem.description}</p>
                      </div>
                      <span className="bg-amber-500/20 text-amber-400 font-black text-xs px-2 py-0.5 rounded-lg">
                        x{recipe.resultAmount}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-300">
                      <span className="text-slate-500 font-bold block mb-1">Ingredientes requeridos:</span>
                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.map(ing => {
                          const ingItem = ITEMS_CATALOG.find(i => i.id === ing.itemId);
                          const have = inventory[ing.itemId] || 0;
                          return (
                            <span
                              key={ing.itemId}
                              className={`px-2 py-0.5 rounded border ${
                                have >= ing.amount
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                  : 'bg-red-500/20 border-red-500/40 text-red-300'
                              }`}
                            >
                              {ingItem?.nameEs}: {have}/{ing.amount}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      disabled={!canCraft}
                      onClick={() => {
                        sound.playSound('craft');
                        onCraftItem(recipe.id);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 font-black text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" /> Fabricar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
