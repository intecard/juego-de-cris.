import React, { useState } from 'react';
import { Dinosaur } from '../types/game';
import { Shield, Flame, Sparkles, LogOut, Heart, Swords, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface BattleViewProps {
  playerTeam: Dinosaur[];
  wildDino: Dinosaur;
  onBattleEnd: (isVictory: boolean, capturedDino?: Dinosaur) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  playerTeam,
  wildDino,
  onBattleEnd,
}) => {
  // Estado local para simular la vida del dinosaurio salvaje en combate
  const [wildHp, setWildHp] = useState<number>(100);
  const maxWildHp = 100;
  const isBoss = wildDino.name.toLowerCase().includes('rey') || wildDino.name.toLowerCase().includes('king');

  // Acción 1: Atacar al dinosaurio salvaje
  const handleAttack = () => {
    sound.playSound('roar');
    const damage = Math.floor(Math.random() * 30) + 25; // Daño entre 25 y 55
    const nextHp = Math.max(0, wildHp - damage);
    setWildHp(nextHp);

    // Si la vida llega a 0, victoria automática
    if (nextHp === 0) {
      setTimeout(() => {
        sound.playSound('victory');
        onBattleEnd(true, wildDino);
      }, 600);
    }
  };

  // Acción 2: Usar Trampa Táctica
  const handleTrapTactics = () => {
    sound.playSound('click');
    const trapDamage = 40;
    const nextHp = Math.max(0, wildHp - trapDamage);
    setWildHp(nextHp);

    if (nextHp === 0) {
      setTimeout(() => {
        sound.playSound('victory');
        onBattleEnd(true, wildDino);
      }, 600);
    }
  };

  // Acción 3: Intentar Capturar
  const handleCapture = () => {
    sound.playSound('craft');
    // Mayor probabilidad de captura si el dinosaurio tiene poca vida
    if (wildHp <= 50 || Math.random() > 0.3) {
      sound.playSound('victory');
      onBattleEnd(true, wildDino);
    } else {
      sound.playSound('click');
      // Si falla la captura, el dinosaurio salvaje resiste
      setWildHp(prev => Math.max(10, prev - 15));
    }
  };

  // Acción 4: Huir del combate
  const handleFlee = () => {
    sound.playSound('click');
    onBattleEnd(false);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col justify-between p-6 select-none animate-fadeIn font-sans">
      
      {/* --- PANEL SUPERIOR: OPONENTE SALVAJE --- */}
      <div className="w-full flex justify-center">
        <div className={`w-full max-w-lg bg-slate-900/90 border-2 rounded-3xl p-5 shadow-2xl ${
          isBoss ? 'border-red-500/80 shadow-red-500/20' : 'border-amber-500/50 shadow-amber-500/10'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦖</span>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  {wildDino.name}
                  {isBoss && (
                    <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> JEFE COLOSAL
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 font-semibold">
                  Dinosaurio Salvaje en la Selva
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-emerald-400">
                {wildHp} / {maxWildHp} HP
              </span>
            </div>
          </div>

          {/* BARRA DE VIDA SALVAJE */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                wildHp > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : wildHp > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-500'
              }`}
              style={{ width: `${(wildHp / maxWildHp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* --- CENTRO: INSIGNIA VS --- */}
      <div className="flex items-center justify-center my-auto pointer-events-none">
        <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-2xl">
          <Swords className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      {/* --- PANEL INFERIOR: EQUIPO DE CRIS Y BOTONES DE ACCIÓN --- */}
      <div className="w-full max-w-4xl mx-auto space-y-4">
        
        {/* TARJETAS DEL EQUIPO DE CRIS */}
        <div className="flex items-center justify-center gap-3">
          {playerTeam.length > 0 ? (
            playerTeam.map((dino, idx) => (
              <div
                key={dino.id || idx}
                className="bg-slate-900/80 border border-slate-700 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-lg"
              >
                <span className="text-lg">🦎</span>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    {dino.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5 fill-current" /> Listo para luchar
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl px-4 py-2 text-xs text-slate-400 font-medium">
              🐸 Cris en combate directo
            </div>
          )}
        </div>

        {/* BOTONES DE ACCIÓN TÁCTICA */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* BOTÓN 1: ATACAR */}
          <button
            onClick={handleAttack}
            className="bg-gradient-to-tr from-red-600 to-amber-600 hover:brightness-110 border-2 border-red-300 rounded-2xl p-4 flex flex-col items-center justify-center text-white font-extrabold shadow-xl transition active:scale-95 cursor-pointer"
          >
            <Flame className="w-7 h-7 mb-1" />
            <span className="text-xs uppercase tracking-wider">Atacar</span>
            <span className="text-[10px] text-red-100 font-normal mt-0.5">Daño Directo</span>
          </button>

          {/* BOTÓN 2: TRAMPA TÁCTICA */}
          <button
            onClick={handleTrapTactics}
            className="bg-gradient-to-tr from-amber-600 to-orange-500 hover:brightness-110 border-2 border-amber-300 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-950 font-extrabold shadow-xl transition active:scale-95 cursor-pointer"
          >
            <Shield className="w-7 h-7 mb-1" />
            <span className="text-xs uppercase tracking-wider">Lanzar Trampa</span>
            <span className="text-[10px] text-slate-900 font-normal mt-0.5">Debilitar Bestia</span>
          </button>

          {/* BOTÓN 3: CAPTURAR */}
          <button
            onClick={handleCapture}
            className="bg-gradient-to-tr from-emerald-600 to-green-500 hover:brightness-110 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-950 font-extrabold shadow-xl transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-7 h-7 mb-1" />
            <span className="text-xs uppercase tracking-wider">Capturar</span>
            <span className="text-[10px] text-slate-900 font-normal mt-0.5">Sumar a Colección</span>
          </button>

          {/* BOTÓN 4: HUIR */}
          <button
            onClick={handleFlee}
            className="bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-300 font-extrabold shadow-xl transition active:scale-95 cursor-pointer"
          >
            <LogOut className="w-7 h-7 mb-1 text-slate-400" />
            <span className="text-xs uppercase tracking-wider">Huir</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">Volver a Selva</span>
          </button>
        </div>

      </div>
    </div>
  );
};