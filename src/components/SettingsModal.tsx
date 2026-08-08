import React from 'react';
import { GameSettings, PlayerState } from '../types/game';
import { exportSaveToFile } from '../utils/saveSystem';
import { Settings, Volume2, Shield, Download, Smartphone, X } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  playerState: PlayerState;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  playerState,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Ajustes & Optimización Móvil</h2>
              <p className="text-xs text-slate-400">Rendimiento, FPS, Sonido y exportación APK Android.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target FPS Selector */}
          <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl">
            <h3 className="font-extrabold text-sm text-white mb-1">Tasa de Refresco (FPS)</h3>
            <p className="text-xs text-slate-400 mb-3">Soporte para pantallas de alta tasa de refresco (60, 90 y 120 Hz).</p>

            <div className="grid grid-cols-3 gap-3">
              {[60, 90, 120].map(fps => (
                <button
                  key={fps}
                  onClick={() => onUpdateSettings({ targetFps: fps as 60 | 90 | 120 })}
                  className={`py-2.5 rounded-xl font-black text-xs transition border ${
                    settings.targetFps === fps
                      ? 'bg-amber-500 border-yellow-300 text-slate-950 shadow-lg'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
          </div>

          {/* Graphics Quality */}
          <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl">
            <h3 className="font-extrabold text-sm text-white mb-1">Calidad Gráfica</h3>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {['Low', 'Medium', 'High', 'Ultra'].map(q => (
                <button
                  key={q}
                  onClick={() => onUpdateSettings({ graphicsQuality: q as 'Low' | 'Medium' | 'High' | 'Ultra' })}
                  className={`py-2 rounded-xl font-extrabold text-xs transition border ${
                    settings.graphicsQuality === q
                      ? 'bg-emerald-500 border-green-300 text-slate-950 shadow-lg'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Save Data & Android APK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-white mb-1">Exportar Partida Guardada</h4>
                <p className="text-[10px] text-slate-400">Guarda una copia JSON de tu avance en los 25 niveles.</p>
              </div>
              <button
                onClick={() => exportSaveToFile(playerState)}
                className="mt-3 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Exportar Guardado
              </button>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-white mb-1">Guía APK Google Play Store</h4>
                <p className="text-[10px] text-slate-400">Listo para empaquetar con Capacitor / Unity / WebGL.</p>
              </div>
              <div className="mt-3 py-2 px-3 rounded-xl bg-emerald-950/60 text-emerald-400 font-bold text-[10px] border border-emerald-800/60 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Android Ready (60-120 FPS)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
