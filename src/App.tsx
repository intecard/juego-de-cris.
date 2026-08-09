import React, { useState, useEffect } from 'react';
import { Dinosaur, LevelInfo, PlayerState, GameSettings } from './types/game';
import { sound } from './utils/audio';
import { createDinosaurFromSpecies } from './data/dinosaurs';

// IMPORTACIÓN DE LOS VERDADEROS COMPONENTES 3D Y DE INTERFAZ
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { WorldMapModal } from './components/WorldMapModal';
import { DinoDexModal } from './components/DinoDexModal';
import { InventoryCraftingModal } from './components/InventoryCraftingModal';
import { SettingsModal } from './components/SettingsModal';
import { BattleView } from './components/BattleView';
import { CinematicModal } from './components/CinematicModal';

// =====================================================================
// CATÁLOGO DE NIVELES Y DATOS DE GUARDADO
// =====================================================================
const LEVEL_CATALOG: LevelInfo[] = [
  { id: 1, recommendedLevel: 1, wildDinoSpecies: ['Velociraptor'], terrainColor: '#1b4332', weather: 'Sun', foliageDensity: 'Dense' },
  { id: 25, recommendedLevel: 25, wildDinoSpecies: ['T-Rex Rey'], isKingRexBoss: true, terrainColor: '#2b090a', weather: 'Ash', foliageDensity: 'Medium' }
];

const loadSaveData = (): PlayerState => ({
  currentLevelId: 1,
  unlockedLevelId: 1,
  exp: 0,
  coins: 100,
  capturedDinos: [],
  mountedDinoId: null,
  team: [],
  inventory: {
    trap_basic: 3,
    wood_branch: 10,
    amber_shard: 5
  },
  name: 'Leo',
  level: 1,
  hp: 100,
  maxHp: 100,
  stamina: 100,
  maxStamina: 100
});

const saveGameData = (data: any) => console.log('Juego guardado', data);
const loadSettings = (): GameSettings => ({ volume: 100, graphicsQuality: 'High', shadowsEnabled: true });
const saveSettings = (data: any) => console.log('Ajustes guardados', data);

// =====================================================================
// COMPONENTE PRINCIPAL APP
// =====================================================================
export default function App() {
  const [player, setPlayer] = useState<PlayerState>(() => loadSaveData());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [currentLevel, setCurrentLevel] = useState<LevelInfo>(
    LEVEL_CATALOG.find(l => l.id === player.currentLevelId) || LEVEL_CATALOG[0]
  );

  // Active Modals & Views
  const [activeModal, setActiveModal] = useState<
    'Map' | 'Dex' | 'Inventory' | 'Settings' | 'Battle' | 'Cinematic' | null
  >(null);

  const [battleWildDino, setBattleWildDino] = useState<Dinosaur | null>(null);
  const [cinematicType, setCinematicType] = useState<'EggPortal' | 'RaptorPack' | 'KingRexVictory'>('EggPortal');
  const [joystickInput, setJoystickInput] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Auto-save on state updates
  useEffect(() => {
    saveGameData(player);
  }, [player]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Start background jungle sounds
  const handleFirstInteraction = () => {
    sound.startJungleAmbiance();
  };

  const activeMountedDino = player.capturedDinos.find(d => d.id === player.mountedDinoId) || null;

  // --- HANDLERS PRINCIPALES ---
  const handleSelectLevel = (level: LevelInfo) => {
    sound.playSound('click');
    setCurrentLevel(level);
    setPlayer(prev => ({ ...prev, currentLevelId: level.id }));
    setActiveModal(null);

    if (level.isSpecialRaptorPack) {
      setCinematicType('RaptorPack');
      setActiveModal('Cinematic');
    }
  };

  const handleApproachWildDino = (wild: Dinosaur) => {
    if (activeModal === 'Battle') return;
    sound.playSound('roar');
    setBattleWildDino(wild);
    setActiveModal('Battle');
  };

  const handleClimbCeremonialRock = () => {
    if (activeModal === 'Cinematic') return;
    setCinematicType('EggPortal');
    setActiveModal('Cinematic');
  };

  // SISTEMA DE COLOCAR TRAMPAS EN EL MAPA 3D
  const handlePlaceTrap = () => {
    sound.playSound('click');
    const currentTraps = player.inventory['trap_basic'] || 0;
    
    if (currentTraps > 0) {
      setPlayer(prev => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          trap_basic: Math.max(0, (prev.inventory['trap_basic'] || 0) - 1),
        },
      }));

      // Atraer a un dinosaurio salvaje a la trampa
      const wild = createDinosaurFromSpecies(
        currentLevel.wildDinoSpecies[0] || 'Velociraptor',
        currentLevel.recommendedLevel
      );
      handleApproachWildDino(wild);
    } else {
      // Abrir inventario para craftear más trampas
      setActiveModal('Inventory');
    }
  };

  const handleBattleEnd = (isVictory: boolean, capturedDino?: Dinosaur) => {
    setActiveModal(null);
    setBattleWildDino(null);

    if (isVictory) {
      setPlayer(prev => {
        const nextDinos = capturedDino ? [...prev.capturedDinos, capturedDino] : prev.capturedDinos;
        return {
          ...prev,
          exp: prev.exp + 150,
          coins: prev.coins + 100,
          capturedDinos: nextDinos,
        };
      });

      // Special check for Level 25 Victory
      if (currentLevel.isKingRexBoss) {
        setCinematicType('KingRexVictory');
        setActiveModal('Cinematic');
      }
    }
  };

  const handleCinematicComplete = () => {
    setActiveModal(null);

    if (cinematicType === 'EggPortal') {
      // Unlock next level up to 25
      const nextLvlId = Math.min(25, currentLevel.id + 1);
      const nextLvl = LEVEL_CATALOG.find(l => l.id === nextLvlId) || currentLevel;

      setPlayer(prev => ({
        ...prev,
        currentLevelId: nextLvlId,
        unlockedLevelId: Math.max(prev.unlockedLevelId, nextLvlId),
      }));
      setCurrentLevel(nextLvl);
    }
  };

  const handleToggleMount = (dinoId?: string) => {
    sound.playSound('mount');
    if (dinoId) {
      setPlayer(prev => ({
        ...prev,
        mountedDinoId: prev.mountedDinoId === dinoId ? null : dinoId,
      }));
    } else {
      // Toggle first captured dino or clear
      setPlayer(prev => ({
        ...prev,
        mountedDinoId: prev.mountedDinoId ? null : (prev.capturedDinos[0]?.id || null),
      }));
    }
  };

  const handleToggleTeam = (dinoId: string) => {
    setPlayer(prev => {
      const inTeam = prev.team.includes(dinoId);
      const nextTeam = inTeam ? prev.team.filter(id => id !== dinoId) : [...prev.team, dinoId].slice(0, 3);
      return { ...prev, team: nextTeam };
    });
  };

  const handleCraftItem = (recipeId: string) => {
    setPlayer(prev => {
      const inv = { ...prev.inventory };
      if (recipeId === 'recipe_trap_basic') {
        inv['wood_branch'] = (inv['wood_branch'] || 0) - 2;
        inv['amber_shard'] = (inv['amber_shard'] || 0) - 1;
        inv['trap_basic'] = (inv['trap_basic'] || 0) + 2;
      }
      return { ...prev, inventory: inv };
    });
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none"
      onClick={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
    >
      {/* 3D WebGL Canvas */}
      <GameCanvas
        currentLevel={currentLevel}
        settings={settings}
        mountedDino={activeMountedDino}
        joystickInput={joystickInput}
        onApproachWildDino={handleApproachWildDino}
        onClimbCeremonialRock={handleClimbCeremonialRock}
      />

      {/* Vector HUD Overlay */}
      <HUD
        player={player}
        currentLevel={currentLevel}
        activeDino={activeMountedDino}
        onOpenMap={() => setActiveModal('Map')}
        onOpenDex={() => setActiveModal('Dex')}
        onOpenInventory={() => setActiveModal('Inventory')}
        onOpenSettings={() => setActiveModal('Settings')}
        onToggleMount={() => handleToggleMount()}
        onPlaceTrap={handlePlaceTrap}
        onThrowCapture={() => {
          const wild = createDinosaurFromSpecies(
            currentLevel.wildDinoSpecies[0] || 'Velociraptor',
            currentLevel.recommendedLevel
          );
          handleApproachWildDino(wild);
        }}
        onTriggerBattle={() => {
          const wild = createDinosaurFromSpecies(
            currentLevel.wildDinoSpecies[0] || 'Velociraptor',
            currentLevel.recommendedLevel
          );
          handleApproachWildDino(wild);
        }}
        onMoveJoystick={(dx: number, dy: number) => setJoystickInput({ dx, dy })}
      />

      {/* Modals & Views */}
      {activeModal === 'Map' && (
        <WorldMapModal
          unlockedLevelId={player.unlockedLevelId}
          currentLevelId={player.currentLevelId}
          onSelectLevel={handleSelectLevel}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'Dex' && (
        <DinoDexModal
          capturedDinos={player.capturedDinos}
          mountedDinoId={player.mountedDinoId}
          activeTeam={player.team}
          onToggleMount={handleToggleMount}
          onToggleTeam={handleToggleTeam}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'Inventory' && (
        <InventoryCraftingModal
          inventory={player.inventory}
          onCraftItem={handleCraftItem}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'Settings' && (
        <SettingsModal
          settings={settings}
          playerState={player}
          onUpdateSettings={(newS: any) => setSettings(prev => ({ ...prev, ...newS }))}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'Battle' && battleWildDino && (
        <BattleView
          playerTeam={player.capturedDinos.filter(d => player.team.includes(d.id))}
          wildDino={battleWildDino}
          onBattleEnd={handleBattleEnd}
        />
      )}

      {activeModal === 'Cinematic' && (
        <CinematicModal
          type={cinematicType}
          level={currentLevel}
          onComplete={handleCinematicComplete}
        />
      )}
    </div>
  );
}