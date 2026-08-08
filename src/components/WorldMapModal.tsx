import React from 'react';
import { LEVEL_CATALOG } from '../data/levels';
import { LevelInfo } from '../types/game';
import { MapPin, Lock, Star, Shield, ArrowRight, X } from 'lucide-react';

interface WorldMapModalProps {
  unlockedLevelId: number;
  currentLevelId: number;
  onSelectLevel: (level: LevelInfo) => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  unlockedLevelId,
  currentLevelId,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div>
            <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-400" />
              Mapa del Continente Prehistórico (25 Niveles)
            </h2>
            <p className="text-xs text-slate-400">Selecciona un nivel desbloqueado para explorar sus tierras y dinosaurios.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Selector Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {LEVEL_CATALOG.map(lvl => {
            const isUnlocked = lvl.id <= unlockedLevelId;
            const isCurrent = lvl.id === currentLevelId;

            return (
              <div
                key={lvl.id}
                onClick={() => isUnlocked && onSelectLevel(lvl)}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/50'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-700 hover:border-amber-400/60 hover:bg-slate-800 cursor-pointer'
                    : 'bg-slate-900/50 border-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Level Badge Header */}
                <div className="flex justify-between items-start mb-2">
                  <span className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center font-black text-xs text-amber-400 border border-slate-700">
                    {lvl.id}
                  </span>

                  {isCurrent ? (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      ACTUAL
                    </span>
                  ) : !isUnlocked ? (
                    <Lock className="w-4 h-4 text-slate-500" />
                  ) : (
                    <div className="flex items-center text-amber-400 text-[10px]">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                    </div>
                  )}
                </div>

                {/* Level Title & Biome */}
                <div>
                  <h3 className="font-extrabold text-sm text-white">{lvl.nameEs}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{lvl.description}</p>
                </div>

                {/* Footer Info */}
                <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center text-[10px] text-slate-300 font-bold">
                  <span className="bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-emerald-400">
                    {lvl.biome}
                  </span>
                  {isUnlocked && (
                    <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                      Viajar <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
