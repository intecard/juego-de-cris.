import React from 'react';
import { Backpack, Hammer, Shield, Sparkles, X, CheckCircle2, AlertCircle, Box } from 'lucide-react';
import { sound } from '../utils/audio';

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
  // Cantidades actuales en el inventario del jugador
  const woodCount = inventory['wood_branch'] || 0;
  const amberCount = inventory['amber_shard'] || 0;
  const trapCount = inventory['trap_basic'] || 0;

  // Requisitos para fabricar 2 trampas básicas: 2 ramas + 1 ámbar
  const canCraftTrap = woodCount >= 2 && amberCount >= 1;

  const handleCraft = (recipeId: string) => {
    if (!canCraftTrap) {
      sound.playSound('click');
      return;
    }
    sound.playSound('craft');
    onCraftItem(recipeId);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* ENCABEZADO AAA */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Backpack className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                Mochila y Taller
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Fabrica trampas y administra tus recursos selváticos
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSound('click');
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition active:scale-95"
            title="Cerrar ventana"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* SECCIÓN 1: TALLER DE CRAFTEO */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hammer className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Recetas de Fabricación
              </h3>
            </div>

            {/* TARJETA DE RECETA: TRAMPA JURÁSICA */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Trampa Jurásica Básica (x2)
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold">
                      Esencial
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Se planta en el suelo para capturar dinosaurios salvajes en la selva.
                  </p>

                  {/* REQUISITOS EN TIEMPO REAL */}
                  <div className="flex items-center gap-4 mt-2">
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        woodCount >= 2 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {woodCount >= 2 ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      Ramas: {woodCount} / 2
                    </span>

                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        amberCount >= 1 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {amberCount >= 1 ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      Ámbar: {amberCount} / 1
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTÓN DE CRAFTEO */}
              <button
                onClick={() => handleCraft('recipe_trap_basic')}
                disabled={!canCraftTrap}
                className={`w-full md:w-auto px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0 ${
                  canCraftTrap
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-lg active:scale-95 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {canCraftTrap ? 'Fabricar x2' : 'Faltan Materiales'}
              </button>
            </div>
          </div>

          {/* SECCIÓN 2: MOCHILA / INVENTARIO GENERAL */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Box className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Tu Mochila de Recursos
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* ÍTEM 1: TRAMPAS */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                    🛡️
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Trampas</span>
                    <span className="text-[10px] text-slate-400 font-medium">Captura</span>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  x{trapCount}
                </span>
              </div>

              {/* ÍTEM 2: RAMAS DE MADERA */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                    🪵
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Ramas</span>
                    <span className="text-[10px] text-slate-400 font-medium">Material</span>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  x{woodCount}
                </span>
              </div>

              {/* ÍTEM 3: FRAGMENTOS DE ÁMBAR */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-lg">
                    💎
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Ámbar</span>
                    <span className="text-[10px] text-slate-400 font-medium">Especial</span>
                  </div>
                </div>
                <span className="text-sm font-black text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20">
                  x{amberCount}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* PIE DE PÁGINA */}
        <div className="bg-slate-950/90 border-t border-slate-800/80 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: Explora la selva para encontrar más ámbar brillante.</span>
          <button
            onClick={() => {
              sound.playSound('click');
              onClose();
            }}
            className="text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Volver al Juego
          </button>
        </div>

      </div>
    </div>
  );
};