import React, { useState } from 'react';
import { Dinosaur, DinoSkill, BattleState } from '../types/game';
import { sound } from '../utils/audio';
import { Flame, Droplets, Zap, Shield, Heart, Sparkles, Volume2, Award, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleViewProps {
  playerTeam: Dinosaur[];
  wildDino: Dinosaur;
  onBattleEnd: (isVictory: boolean, capturedDino?: Dinosaur) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({ playerTeam, wildDino, onBattleEnd }) => {
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [playerDinos, setPlayerDinos] = useState<Dinosaur[]>(
    playerTeam.length > 0
      ? playerTeam
      : [
          {
            id: 'starter_dino',
            speciesId: 'triceratops',
            name: 'Triceratops Aliado',
            rarity: 'Rare',
            element: 'Earth',
            level: 5,
            exp: 100,
            maxExp: 500,
            hp: 240,
            maxHp: 240,
            attack: 50,
            defense: 60,
            speed: 45,
            affinity: 80,
            personality: 'Brave',
            skills: [
              { id: 'horn_charge', name: 'Carga de Cuerno', nameEs: 'Carga de Cuerno', description: 'Ataca con ímpetu.', element: 'Earth', damage: 45, cooldown: 0, energyCost: 20, type: 'Attack', icon: 'Shield' },
              { id: 'earth_smash', name: 'Sismo Terrestre', nameEs: 'Sismo Terrestre', description: 'Impacta el terreno.', element: 'Earth', damage: 70, cooldown: 2, energyCost: 35, type: 'Attack', icon: 'Zap' }
            ],
            isCaptured: true,
            canMount: true,
            mountType: 'Land',
            modelType: 'triceratops',
            colorHex: '#2a9d8f',
            secondaryColorHex: '#e9c46a',
            scale: 1.8,
            heightMeter: 3,
            weightKg: 6000,
            wildLocation: 'Selva',
          }
        ]
  );

  const [enemyDino, setEnemyDino] = useState<Dinosaur>({ ...wildDino });
  const [battleLog, setBattleLog] = useState<string[]>([
    `¡Un ${wildDino.name} salvaje de Nivel ${wildDino.level} ha aparecido!`
  ]);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isDefeat, setIsDefeat] = useState<boolean>(false);

  const activeDino = playerDinos[activePlayerIndex];

  const handleUseSkill = (skill: DinoSkill) => {
    if (isVictory || isDefeat || isCapturing) return;

    sound.playSound('attack');

    // Calculate player damage
    const elemBonus = activeDino.element === wildDino.element ? 1.0 : 1.3;
    const dmg = Math.floor((skill.damage + activeDino.attack * 0.5) * elemBonus);

    const newEnemyHp = Math.max(0, enemyDino.hp - dmg);
    setEnemyDino(prev => ({ ...prev, hp: newEnemyHp }));

    setBattleLog(prev => [
      `¡${activeDino.name} usó ${skill.nameEs} e infligió ${dmg} de daño a ${enemyDino.name}!`,
      ...prev
    ]);

    if (newEnemyHp <= 0) {
      sound.playSound('victory');
      setIsVictory(true);
      setBattleLog(prev => [`¡Has derrotado al ${enemyDino.name}!`, ...prev]);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#EF4444']
      });
      return;
    }

    // Enemy Turn Counter Attack
    setTimeout(() => {
      if (newEnemyHp <= 0) return;

      sound.playSound('roar');
      const enemyDmg = Math.max(10, Math.floor(enemyDino.attack * 0.6));
      const newPlayerHp = Math.max(0, activeDino.hp - enemyDmg);

      setPlayerDinos(prev => {
        const next = [...prev];
        next[activePlayerIndex] = { ...next[activePlayerIndex], hp: newPlayerHp };
        return next;
      });

      setBattleLog(prev => [
        `¡${enemyDino.name} contraatacó infligiendo ${enemyDmg} de daño!`,
        ...prev
      ]);

      if (newPlayerHp <= 0) {
        setIsDefeat(true);
      }
    }, 1000);
  };

  const handleAttemptCapture = () => {
    if (isVictory || isDefeat || isCapturing) return;

    setIsCapturing(true);
    sound.playSound('capture');

    setBattleLog(prev => [`¡Lanzando Cápsula de Captura sobre ${enemyDino.name}...`, ...prev]);

    setTimeout(() => {
      // Success rate formula based on HP loss
      const hpPercent = enemyDino.hp / enemyDino.maxHp;
      const successChance = Math.max(0.2, (1 - hpPercent) * 0.95);

      if (Math.random() < successChance) {
        sound.playSound('victory');
        setIsVictory(true);
        setIsCapturing(false);
        const captured = { ...enemyDino, isCaptured: true };
        setBattleLog(prev => [`¡ÉXITO! ¡Has capturado al ${enemyDino.name}!`, ...prev]);
        
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#3B82F6', '#8B5CF6', '#FCD34D']
        });

        setTimeout(() => onBattleEnd(true, captured), 2000);
      } else {
        setIsCapturing(false);
        setBattleLog(prev => [`¡El ${enemyDino.name} rompió la cápsula y escapó de la trampa!`, ...prev]);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 text-white select-none">
      {/* Top Bar */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <button
          onClick={() => onBattleEnd(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Huir
        </button>
        <div className="text-center">
          <span className="text-amber-400 font-extrabold text-sm uppercase tracking-wider block">
            Combate Táctico de Dinosaurios
          </span>
          <span className="text-slate-400 text-[10px]">Turno Táctico en Vivo</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Battle Arena Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto max-w-5xl mx-auto w-full">
        {/* Enemy Dino Card */}
        <div className="bg-slate-900/80 border border-red-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-red-500/20 text-red-400 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                {enemyDino.rarity} • {enemyDino.element}
              </span>
              <h2 className="text-xl font-black text-white mt-1">{enemyDino.name}</h2>
              <span className="text-slate-400 text-xs">Nivel {enemyDino.level}</span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-700 flex items-center justify-center text-2xl shadow-lg border border-red-400">
              🦖
            </div>
          </div>

          {/* Enemy HP */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>HP Enemigo</span>
              <span>{enemyDino.hp} / {enemyDino.maxHp}</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-300"
                style={{ width: `${(enemyDino.hp / enemyDino.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Player Active Dino Card */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-2xl shadow-lg border border-emerald-400">
              🦕
            </div>

            <div className="text-right">
              <span className="bg-emerald-500/20 text-emerald-400 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                Aliado • {activeDino.element}
              </span>
              <h2 className="text-xl font-black text-white mt-1">{activeDino.name}</h2>
              <span className="text-slate-400 text-xs">Nivel {activeDino.level}</span>
            </div>
          </div>

          {/* Player HP */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>HP Aliado</span>
              <span>{activeDino.hp} / {activeDino.maxHp}</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                style={{ width: `${(activeDino.hp / activeDino.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Battle Log Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 max-w-5xl mx-auto w-full h-20 overflow-y-auto my-2 text-xs text-slate-300 flex flex-col gap-1 font-mono">
        {battleLog.map((log, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-amber-400">›</span> {log}
          </div>
        ))}
      </div>

      {/* Action Controls & Skill Buttons */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-3">
        {activeDino.skills.map(skill => (
          <button
            key={skill.id}
            onClick={() => handleUseSkill(skill)}
            disabled={isVictory || isDefeat || isCapturing}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-50 text-slate-950 p-3.5 rounded-2xl font-black text-xs flex items-center justify-between shadow-lg transition active:scale-95 border border-yellow-300"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-slate-950" />
              <span>{skill.nameEs}</span>
            </div>
            <span className="bg-slate-950/20 px-2 py-0.5 rounded-lg text-[10px]">Daño: {skill.damage}</span>
          </button>
        ))}

        <button
          onClick={handleAttemptCapture}
          disabled={isVictory || isDefeat || isCapturing}
          className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-50 text-slate-950 p-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 border border-emerald-200"
        >
          <Sparkles className="w-5 h-5" />
          <span>{isCapturing ? 'Lanzando Cápsula...' : 'Lanzar Cápsula de Captura'}</span>
        </button>
      </div>

      {/* Victory / Defeat Modal overlay */}
      {(isVictory || isDefeat) && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-20">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <Award className="w-16 h-16 text-amber-400 mb-3 animate-bounce" />
            <h3 className="text-2xl font-black text-white mb-2">
              {isVictory ? '¡VICTORIA EN COMBATE!' : '¡TU DINOSAURIO SE HA AGOTADO!'}
            </h3>
            <p className="text-slate-300 text-xs mb-6">
              {isVictory
                ? 'Has ganado experiencia, monedas prehistóricas y cristales de ámbar.'
                : 'Regresa al campamento para recuperar la energía de tus dinosaurios.'}
            </p>
            <button
              onClick={() => onBattleEnd(isVictory)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-2xl shadow-xl transition active:scale-95"
            >
              Continuar la Aventura
            </button>
          </div>
        </div>
      )}
    </div>
  );
};