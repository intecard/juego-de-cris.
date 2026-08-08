import React, { useState } from 'react';
import { Dinosaur } from '../types/game';
import { DINO_SPECIES_CATALOG } from '../data/dinosaurs';
import { BookOpen, Shield, Zap, Heart, Compass, CheckCircle2, Star, X } from 'lucide-react';

interface DinoDexModalProps {
  capturedDinos: Dinosaur[];
  mountedDinoId: string | null;
  activeTeam: string[];
  onToggleMount: (dinoId: string) => void;
  onToggleTeam: (dinoId: string) => void;
  onClose: () => void;
}

export const DinoDexModal: React.FC<DinoDexModalProps> = ({
  capturedDinos,
  mountedDinoId,
  activeTeam,
  onToggleMount,
  onToggleTeam,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'Captured' | 'Catalog'>('Captured');
  const [selectedDino, setSelectedDino] = useState<Dinosaur | null>(
    capturedDinos.length > 0 ? capturedDinos[0] : null
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Enciclopedia DinoDex</h2>
              <p className="text-xs text-slate-400">
                Capturados: {capturedDinos.length} / {DINO_SPECIES_CATALOG.length} Especies conocidas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('Captured')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'Captured' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Mis Dinosaurios ({capturedDinos.length})
              </button>
              <button
                onClick={() => setActiveTab('Catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'Catalog' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Catálogo Global
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
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left List */}
          <div className="w-full md:w-1/2 p-4 border-r border-slate-800 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeTab === 'Captured' ? (
              capturedDinos.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
                  Aún no has capturado ningún dinosaurio. ¡Explora la selva con tus cápsulas!
                </div>
              ) : (
                capturedDinos.map(dino => {
                  const isMounted = mountedDinoId === dino.id;
                  const isInTeam = activeTeam.includes(dino.id);

                  return (
                    <div
                      key={dino.id}
                      onClick={() => setSelectedDino(dino)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                        selectedDino?.id === dino.id
                          ? 'bg-emerald-500/20 border-emerald-400'
                          : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-xl border border-slate-700">
                        🦕
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-xs text-white truncate">{dino.name}</h4>
                          <span className="text-[10px] text-amber-400 font-bold">Niv. {dino.level}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-emerald-400 font-bold">
                            {dino.element}
                          </span>
                          {isMounted && (
                            <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                              MONTADO
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              DINO_SPECIES_CATALOG.map(sp => (
                <div key={sp.speciesId} className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-xl border border-slate-800 text-slate-600">
                    🦖
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-300">{sp.nameEs}</h4>
                    <span className="text-[9px] text-amber-400">{sp.defaultRarity} • {sp.primaryElement}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Detail Pane */}
          <div className="w-full md:w-1/2 p-6 bg-slate-950/40 overflow-y-auto flex flex-col justify-between">
            {selectedDino ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                      {selectedDino.rarity} • {selectedDino.element}
                    </span>
                    <h3 className="text-2xl font-black text-white">{selectedDino.name}</h3>
                    <span className="text-slate-400 text-xs">Afinidad: {selectedDino.affinity}% • {selectedDino.personality}</span>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-3xl shadow-xl">
                    🦕
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Vida Máxima</span>
                      <span className="font-black text-xs text-white">{selectedDino.hp} / {selectedDino.maxHp}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Ataque</span>
                      <span className="font-black text-xs text-white">{selectedDino.attack}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Defensa</span>
                      <span className="font-black text-xs text-white">{selectedDino.defense}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <Compass className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Velocidad</span>
                      <span className="font-black text-xs text-white">{selectedDino.speed}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onToggleMount(selectedDino.id)}
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition"
                  >
                    {mountedDinoId === selectedDino.id ? 'Desmontar Dinosaurio' : 'Montar Dinosaurio'}
                  </button>
                  <button
                    onClick={() => onToggleTeam(selectedDino.id)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition"
                  >
                    {activeTeam.includes(selectedDino.id) ? 'Quitar del Equipo' : 'Añadir al Equipo'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="m-auto text-center text-slate-500 text-xs">
                Selecciona un dinosaurio para ver sus estadísticas completas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
