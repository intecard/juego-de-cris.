export type ElementType = 'Fire' | 'Water' | 'Nature' | 'Earth' | 'Lightning' | 'Shadow';
export type DinoRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type DinoPersonality = 'Brave' | 'Aggressive' | 'Timid' | 'Loyal' | 'Playful' | 'Cunning';
export type DinoActionState = 'Wandering' | 'Grazing' | 'Sleeping' | 'Drinking' | 'Hunting' | 'Fleeing' | 'Battle' | 'Mounted';

export interface DinoSkill {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  element: ElementType;
  damage: number;
  cooldown: number; // in seconds
  energyCost: number;
  type: 'Attack' | 'Defense' | 'Heal' | 'Buff' | 'Debuff';
  icon: string;
}

export interface Dinosaur {
  id: string;
  speciesId: string;
  name: string;
  nickname?: string;
  rarity: DinoRarity;
  element: ElementType;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  affinity: number; // 0 to 100%
  personality: DinoPersonality;
  skills: DinoSkill[];
  isCaptured: boolean;
  canMount: boolean;
  mountType: 'Land' | 'Air' | 'Water' | 'Climber';
  modelType: string; // key for 3D model builder
  colorHex: string;
  secondaryColorHex: string;
  scale: number;
  heightMeter: number;
  weightKg: number;
  wildLocation: string;
}

export interface PlayerState {
  name: string;
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  coins: number;
  amberCrystals: number;
  currentLevelId: number;
  unlockedLevelId: number;
  mountedDinoId: string | null;
  team: string[]; // IDs of dinos in active battle team (max 3)
  capturedDinos: Dinosaur[];
  inventory: Record<string, number>;
  equippedSaddle?: string;
  equippedArmor?: string;
}

export interface Item {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  category: 'Capture' | 'Consumable' | 'Material' | 'Gear' | 'Saddle';
  icon: string;
  rarity: DinoRarity;
  value: number;
  effect?: {
    type: 'Heal' | 'Stamina' | 'CaptureBoost' | 'AffinityBoost' | 'Buff';
    amount: number;
  };
}

export interface CraftingRecipe {
  id: string;
  resultItemId: string;
  resultAmount: number;
  ingredients: { itemId: string; amount: number }[];
  category: 'Capture' | 'Potions' | 'Saddles' | 'Traps';
}

export interface LevelInfo {
  id: number;
  name: string;
  nameEs: string;
  biome: string;
  description: string;
  difficulty: number; // 1 to 5
  recommendedLevel: number;
  primaryElement: ElementType;
  weather: 'Sunny' | 'Rain' | 'Storm' | 'Fog' | 'Snow' | 'Ash' | 'Night';
  terrainColor: string;
  foliageDensity: 'Sparse' | 'Medium' | 'Dense';
  wildDinoSpecies: string[];
  bossSpecies?: string;
  isSpecialRaptorPack?: boolean;
  isKingRexBoss?: boolean;
}

export interface WeatherState {
  type: 'Sunny' | 'Rain' | 'Storm' | 'Fog' | 'Snow' | 'Ash' | 'Night';
  intensity: number; // 0 to 1
  timeOfDay: number; // 0 to 24 hours
  windSpeed: number;
}

export interface GameSettings {
  targetFps: 60 | 90 | 120;
  graphicsQuality: 'Low' | 'Medium' | 'High' | 'Ultra';
  shadowsEnabled: boolean;
  bloomEnabled: boolean;
  soundVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  touchControls: boolean;
  language: 'es' | 'en';
}

export interface BattleState {
  isActive: boolean;
  playerActiveDinoIndex: number;
  enemyDinos: Dinosaur[];
  enemyActiveIndex: number;
  turn: 'Player' | 'Enemy';
  log: string[];
  isCaptureMode: boolean;
  captureChance: number;
  isVictory?: boolean;
  isDefeat?: boolean;
}
