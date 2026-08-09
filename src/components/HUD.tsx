import React from 'react';
import { PlayerState, LevelInfo, Dinosaur } from '../types/game';
import { Shield, Zap, Compass, Map, Backpack, Settings, BookOpen, Heart, Flame, Sparkles } from 'lucide-react';

interface HUDProps {
  player: PlayerState;
  currentLevel: LevelInfo;
  activeDino: Dinosaur | null;
  onOpenMap: () => void;
  onOpenDex: () => void;
  onOpenInventory: () => void;
  onOpenSettings: () => void;
  onToggleMount: () => void;
  onThrowCapture: () => void;
  onTriggerBattle: () => void;
  onMoveJoystick: (dx: number, dy: number) => void;
  onPlaceTrap?: () => void; // MEJORA: Prop opcional para colocar trampas en el sendero
}

export const HUD: React.FC<HUDProps> = ({
  player,
  currentLevel,
  activeDino,
  onOpenMap,
  onOpenDex,
  onOpenInventory,
  onOpenSettings,
  onToggleMount,
  onThrowCapture,
  onTriggerBattle,
  onMoveJoystick,
  onPlaceTrap,
}) => {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);

  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setTouchStart({ x: clientX, y: clientY });
  };

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = (clientX - touchStart.x) / 50;
    const dy = (clientY - touchStart.y) / 50;

    const len = Math.hypot(dx, dy);
    const clampedDx = len > 1 ? dx / len : dx;
    const clampedDy = len > 1 ? dy / len : dy;

    onMoveJoystick(clampedDx, clampedDy);
  };

  const handleJoystickEnd = () => {
    setTouchStart(null);
    onMoveJoystick(0, 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 z-10 font-sans text-white">
      {/* Top Vector Header */}
      <div className="flex justify-between items-start w-full">
        {/* Player & Active Dino Status */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 flex items-center gap-3 shadow-2xl pointer-events-auto">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center font-bold text-slate-950 border-2 border-yellow-300 shadow-md">
              Lvl {player.level}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold text-slate-950">
              🐸 Leo
            </div>
          </div>

          <div className="flex flex-col gap-1 min-w-[140px]">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-amber-300">{player.name}</span>
              <span className="text-emerald-400">{player.hp} / {player.maxHp} HP</span>
            </div>
            {/* Health Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              />
            </div>

            {/* Stamina Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
              />
            </div>
          </div>

          {/* Mounted Dino Badge */}
          {activeDino && (
            <div className="pl-2 border-l border-slate-700 flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold">Montura</span>
              <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                🦖 {activeDino.name}
              </span>
            </div>
          )}
        </div>

        {/* Level & Weather Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl px-4 py-2 flex flex-col items-end shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">
                Nivel {currentLevel.id}: {currentLevel.nameEs}
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {currentLevel.weather}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Objetivo: Tocar Huevo en Montaña (Z=35)
            </span>
          </div>

          {/* Top Vector Action Buttons */}
          <button
            onClick={onOpenMap}
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 transition shadow-lg active:scale-95"
            title="Mapa Mundial"
          >
            <Map className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenDex}
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 transition shadow-lg active:scale-95"
            title="DinoDex"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenInventory}
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-yellow-400 transition shadow-lg active:scale-95"
            title="Mochila / Crafting"
          >
            <Backpack className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 transition shadow-lg active:scale-95"
            title="Ajustes"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex justify-between items-end w-full pb-2">
        {/* On-screen Vector Touch Joystick */}
        <div
          className="w-32 h-32 rounded-full bg-slate-900/50 backdrop-blur-md border-2 border-slate-600/50 flex items-center justify-center relative pointer-events-auto touch-none shadow-2xl"
          onMouseDown={handleJoystickStart}
          onMouseMove={handleJoystickMove}
          onMouseUp={handleJoystickEnd}
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-inner border border-yellow-200 opacity-90" />
          <span className="absolute text-[10px] text-slate-400 font-bold bottom-1">Mover</span>
        </div>

        {/* Action Vector Buttons */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Mount Dino Button */}
          <button
            onClick={onToggleMount}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs shadow-xl transition active:scale-90 border-2 ${
              player.mountedDinoId
                ? 'bg-amber-500 border-yellow-300 text-slate-950 animate-pulse'
                : 'bg-slate-900/80 border-slate-700 text-amber-400 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-6 h-6 mb-0.5" />
            <span className="text-[10px]">{player.mountedDinoId ? 'Desmontar' : 'Montar'}</span>
          </button>

          {/* Place Trap Button (MEJORA AVENTURA) */}
          {onPlaceTrap && (
            <button
              onClick={onPlaceTrap}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 border-2 border-amber-300 text-slate-950 flex flex-col items-center justify-center font-bold shadow-xl transition active:scale-90"
              title="Colocar Trampa en el suelo"
            >
              <Shield className="w-6 h-6 mb-0.5" />
              <span className="text-[10px] uppercase font-black">Trampa</span>
            </button>
          )}

          {/* Capture Capsule Button */}
          <button
            onClick={onThrowCapture}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 border-2 border-emerald-200 text-slate-950 flex flex-col items-center justify-center font-bold shadow-2xl transition active:scale-90"
          >
            <Sparkles className="w-7 h-7 mb-0.5" />
            <span className="text-[10px] uppercase font-black">Capturar</span>
          </button>

          {/* Battle Trigger Button */}
          <button
            onClick={onTriggerBattle}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 border-2 border-orange-200 text-white flex flex-col items-center justify-center font-bold shadow-2xl transition active:scale-90"
          >
            <Flame className="w-7 h-7 mb-0.5" />
            <span className="text-[10px] uppercase font-black">Batalla</span>
          </button>
        </div>
      </div>
    </div>
  );
};