import { PlayerState, GameSettings } from '../types/game';

const SAVE_KEY = 'dino_quest_save_v1';
const SETTINGS_KEY = 'dino_quest_settings_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  targetFps: 60,
  graphicsQuality: 'High',
  shadowsEnabled: true,
  bloomEnabled: true,
  soundVolume: 0.8,
  musicVolume: 0.5,
  touchControls: true,
  language: 'es',
};

export const DEFAULT_PLAYER_STATE: PlayerState = {
  name: 'Leo Explorador',
  level: 1,
  exp: 0,
  hp: 100,
  maxHp: 100,
  stamina: 100,
  maxStamina: 100,
  coins: 500,
  amberCrystals: 15,
  currentLevelId: 1,
  unlockedLevelId: 1,
  mountedDinoId: null,
  team: [],
  capturedDinos: [],
  inventory: {
    'trap_basic': 5,
    'trap_ultra': 1,
    'potion_hp': 3,
    'meat_berry': 10,
    'wood_branch': 12,
    'amber_shard': 4,
  },
};

export function loadSaveData(): PlayerState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PLAYER_STATE, ...parsed };
    }
  } catch (err) {
    console.error('Error loading save data:', err);
  }
  return DEFAULT_PLAYER_STATE;
}

export function saveGameData(state: PlayerState): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Error saving game data:', err);
    return false;
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): boolean {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Error saving settings:', err);
    return false;
  }
}

export function exportSaveToFile(state: PlayerState) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `DinoWorld_Save_Lvl${state.currentLevelId}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
