import React from 'react';
import { LevelInfo } from '../types/game';
import { sound } from '../utils/audio';
import { Sparkles, Sun, Award, ArrowRight } from 'lucide-react';

interface CinematicModalProps {
  type: 'EggPortal' | 'RaptorPack' | 'KingRexVictory';
  level: LevelInfo;
  onComplete: () => void;
}

export const CinematicModal: React.FC<CinematicModalProps> = ({ type, level, onComplete }) => {
  React.useEffect(() => {
    if (type === 'EggPortal') {
      sound.playSound('eggCracking');
      setTimeout(() => sound.playSound('portal'), 1200);
    } else if (type === 'KingRexVictory') {
      sound.playSound('victory');
    }
  }, [type]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center select-none font-sans">
      {type === 'EggPortal' && (
        <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/50 rounded-3xl p-8 flex flex-col items-center shadow-2xl animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <Sparkles className="w-12 h-12 text-slate-950 animate-spin" />
          </div>

          <span className="text-amber-400 font-black text-xs uppercase tracking-widest mb-1">
            Ceremonia de Nivel
          </span>
          <h2 className="text-2xl font-black text-white mb-2">
            ¡El Huevo Legendario ha Eclosionado!
          </h2>
          <p className="text-slate-300 text-xs mb-8 leading-relaxed">
            Una columna de energía brillante emerge de la roca ceremonial abriendo un portal dimensional al siguiente territorio.
          </p>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
          >
            Cruzar Portal Dimensional <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {type === 'RaptorPack' && (
        <div className="max-w-md w-full bg-slate-900/90 border border-red-500/50 rounded-3xl p-8 flex flex-col items-center shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-4xl mb-4">
            🦖
          </div>
          <span className="text-red-400 font-black text-xs uppercase tracking-widest mb-1">
            Nivel 24: Emboscada
          </span>
          <h2 className="text-2xl font-black text-white mb-2">
            Territorio Velociraptor
          </h2>
          <p className="text-slate-300 text-xs mb-6">
            ¡Una manada entera de Velociraptors hiperagresivos ha acorralado el camino! Debes defenderte en grupo.
          </p>
          <button
            onClick={onComplete}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl shadow-xl transition active:scale-95"
          >
            ¡Enfrentar a la Manada!
          </button>
        </div>
      )}

      {type === 'KingRexVictory' && (
        <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/50 rounded-3xl p-8 flex flex-col items-center shadow-2xl">
          <Award className="w-20 h-20 text-amber-400 mb-4 animate-bounce" />
          <span className="text-amber-400 font-black text-xs uppercase tracking-widest mb-1">
            Gran Final de la Historia
          </span>
          <h2 className="text-3xl font-black text-white mb-3">
            ¡HAS RESTAURADO EL EQUILIBRIO PREHISTÓRICO!
          </h2>
          <p className="text-slate-300 text-xs mb-8 leading-relaxed">
            El Rey Tyrannosaurus Rex ha recuperado su cordura. Todos los dinosaurios de las 25 regiones viven en perfecta armonía gracias al joven explorador Leo y su rana de la suerte.
          </p>
          <button
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition active:scale-95"
          >
            Modo Exploración Libre
          </button>
        </div>
      )}
    </div>
  );
};
