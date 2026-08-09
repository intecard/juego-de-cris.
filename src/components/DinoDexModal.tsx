import React from 'react';
import { Dinosaur } from '../types/game';
import { BookOpen, Compass, Shield, Heart, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface DinoDexModalProps {
  capturedDinos: Dinosaur[];
  mountedDinoId: string | null;
  activeTeam: string[];
  onToggleMount: (dinoId?: string) => void;
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
  const mountedDino = capturedDinos.find(d => d.id === mountedDinoId);

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fadeIn font-sans">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* --- ENCABEZADO AAA --- */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">
                DinoDex Jurásica
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Tu Colección Voxel de Bestias y Monturas ({capturedDinos.length} capturados)
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

        {/* --- BARRA DE ESTADO DE EQUIPO Y MONTURA --- */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-300">Equipo Activo:</span>
            <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {activeTeam.length} / 3 Bestias
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-300">Montura Actual:</span>
            {mountedDino ? (
              <span className="text-xs font-black bg-amber-500/20 text-amber-400 px-3 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                🦖 {mountedDino.name}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-800/80 px-3 py-0.5 rounded-full">
                Ninguna (Camino a pie)
              </span>
            )}
          </div>
        </div>

        {/* --- CONTENIDO SCROLLEABLE: TARJETAS DE DINOSAURIOS --- */}
        <div className="p-6 overflow-y-auto flex-1">
          {capturedDinos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capturedDinos.map((dino, idx) => {
                const isMounted = mountedDinoId === dino.id;
                const isInTeam = activeTeam.includes(dino.id);

                return (
                  <div
                    key={dino.id || idx}
                    className={`bg-slate-950/70 border-2 rounded-2xl p-4 flex flex-col justify-between gap-4 transition shadow-lg ${
                      isMounted
                        ? 'border-amber-500/80 shadow-amber-500/10'
                        : isInTeam
                        ? 'border-emerald-500/60 shadow-emerald-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* CABECERA DE LA TARJETA */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          🦖
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white leading-tight">
                            {dino.name}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                            Especie Voxel Jurásica
                          </span>
                        </div>
                      </div>

                      {/* INSIGNIAS DE ESTADO */}
                      <div className="flex flex-col items-end gap-1">
                        {isMounted && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Montura
                          </span>
                        )}
                        {isInTeam && (
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Equipo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ESTADÍSTICAS BÁSICAS */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-2.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                        <span>100 HP Base</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Blindaje Voxel</span>
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN RÁPIDA */}
                    <div className="flex items-center gap-2 pt-1">
                      {/* BOTÓN MONTAR / DESMONTAR */}
                      <button
                        onClick={() => {
                          sound.playSound('mount');
                          onToggleMount(dino.id);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isMounted
                            ? 'bg-amber-500 text-slate-950 hover:brightness-110 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
                        }`}
                      >
                        <Compass className="w-4 h-4" />
                        {isMounted ? 'Desmontar' : 'Montar'}
                      </button>

                      {/* BOTÓN EQUIPO DE BATALLA */}
                      <button
                        onClick={() => {
                          sound.playSound('click');
                          onToggleTeam(dino.id);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isInTeam
                            ? 'bg-emerald-500 text-slate-950 hover:brightness-110 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        {isInTeam ? 'En Equipo' : 'Al Equipo'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* --- ESTADO VACÍO: AÚN NO HAY DINOSAURIOS --- */
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-slate-950/40 border-2 border-dashed border-slate-800 rounded-3xl">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-4 shadow-inner">
                🌿
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                Aún no has capturado ningún dinosaurio
              </h3>
              <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Explora la selva en 3D, acércate a los dinosaurios salvajes o coloca trampas en el sendero para debilitarlos y sumarlos a tu DinoDex.
              </p>
            </div>
          )}
        </div>

        {/* --- PIE DE PÁGINA --- */}
        <div className="bg-slate-950/90 border-t border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: Tu montura te permite correr más rápido por la selva tropical.</span>
          <button
            onClick={() => {
              sound.playSound('click');
              onClose();
            }}
            className="text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Volver a la Selva
          </button>
        </div>

      </div>
    </div>
  );
};