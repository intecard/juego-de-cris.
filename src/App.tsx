import React, { useState, useEffect } from 'react';
import { PlayerState, GameSettings, LevelInfo, Dinosaur } from './types/game';
import { LEVEL_CATALOG } from './data/levels';
import { loadSaveData, saveGameData, loadSettings, saveSettings } from './utils/saveSystem';
import { createDinosaurFromSpecies } from './data/dinosaurs';
import { sound } from './utils/audio';

import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { BattleView } from './components/BattleView';
import { WorldMapModal } from './components/WorldMapModal';
import { DinoDexModal } from './components/DinoDexModal';
import { InventoryCraftingModal } from './components/InventoryCraftingModal';
import { SettingsModal } from './components/SettingsModal';
import { CinematicModal } from './components/CinematicModal';

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

  // Handlers
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
        onThrowCapture={() => {
          const wild = createDinosaurFromSpecies(
            currentLevel.wildDinoSpecies[0],
            currentLevel.recommendedLevel
          );
          handleApproachWildDino(wild);
        }}
        onTriggerBattle={() => {
          const wild = createDinosaurFromSpecies(
            currentLevel.wildDinoSpecies[0],
            currentLevel.recommendedLevel
          );
          handleApproachWildDino(wild);
        }}
        onMoveJoystick={(dx, dy) => setJoystickInput({ dx, dy })}
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
          onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
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
