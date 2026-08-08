import { Item, CraftingRecipe } from '../types/game';

export const ITEMS_CATALOG: Item[] = [
  {
    id: 'trap_basic',
    name: 'Basic Capsule',
    nameEs: 'Cápsula Básica',
    description: 'Cápsula de captura estándar de energía limpia.',
    category: 'Capture',
    icon: 'CircleDot',
    rarity: 'Common',
    value: 50,
    effect: { type: 'CaptureBoost', amount: 1.2 }
  },
  {
    id: 'trap_super',
    name: 'Super Capsule',
    nameEs: 'Cápsula Súper',
    description: 'Cápsula reforzada para dinosaurios raros y fuertes.',
    category: 'Capture',
    icon: 'Disc',
    rarity: 'Rare',
    value: 150,
    effect: { type: 'CaptureBoost', amount: 1.8 }
  },
  {
    id: 'trap_ultra',
    name: 'Ultra Capsule',
    nameEs: 'Cápsula Ultra',
    description: 'Tecnología prehistórica avanzada para capturas épicas.',
    category: 'Capture',
    icon: 'Zap',
    rarity: 'Epic',
    value: 400,
    effect: { type: 'CaptureBoost', amount: 2.5 }
  },
  {
    id: 'trap_master',
    name: 'Master Energy Orb',
    nameEs: 'Orbe Maestro Legendario',
    description: 'Captura garantizada para dinosaurios legendarios.',
    category: 'Capture',
    icon: 'Sun',
    rarity: 'Mythic',
    value: 1200,
    effect: { type: 'CaptureBoost', amount: 5.0 }
  },
  {
    id: 'potion_hp',
    name: 'Jungle Tonic',
    nameEs: 'Tónico Selvático',
    description: 'Restaura 100 HP a tu dinosaurio activo.',
    category: 'Consumable',
    icon: 'Heart',
    rarity: 'Common',
    value: 30,
    effect: { type: 'Heal', amount: 100 }
  },
  {
    id: 'potion_mega',
    name: 'Mega Elixir',
    nameEs: 'Elíxir de Ámbar',
    description: 'Restaura 300 HP y elimina estados alterados.',
    category: 'Consumable',
    icon: 'Sparkles',
    rarity: 'Rare',
    value: 100,
    effect: { type: 'Heal', amount: 300 }
  },
  {
    id: 'wood_branch',
    name: 'Wood Branch',
    nameEs: 'Rama de Secoya',
    description: 'Madera resistente para fabricar trampas y monturas.',
    category: 'Material',
    icon: 'TreeDeciduous',
    rarity: 'Common',
    value: 10,
  },
  {
    id: 'amber_shard',
    name: 'Amber Crystal',
    nameEs: 'Cristal de Ámbar',
    description: 'Gema fosilizada con energía vital condensada.',
    category: 'Material',
    icon: 'Gem',
    rarity: 'Rare',
    value: 50,
  },
  {
    id: 'meat_berry',
    name: 'Prehistoric Meat',
    nameEs: 'Carne Fresca / Bayas',
    description: 'Alimento nutritivo para calmar e incrementar afinidad.',
    category: 'Consumable',
    icon: 'Apple',
    rarity: 'Common',
    value: 20,
    effect: { type: 'AffinityBoost', amount: 15 }
  },
  {
    id: 'saddle_basic',
    name: 'Explorer Saddle',
    nameEs: 'Montura de Explorador',
    description: 'Silla de montar universal para dinosaurios terrestres.',
    category: 'Saddle',
    icon: 'Compass',
    rarity: 'Common',
    value: 200,
  },
  {
    id: 'saddle_flying',
    name: 'Sky Harness',
    nameEs: 'Arnés de Vuelo',
    description: 'Silla ultraligera diseñada para Pteranodones y Quetzalcoatlus.',
    category: 'Saddle',
    icon: 'Feather',
    rarity: 'Epic',
    value: 600,
  }
];

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'recipe_trap_basic',
    resultItemId: 'trap_basic',
    resultAmount: 2,
    ingredients: [
      { itemId: 'wood_branch', amount: 2 },
      { itemId: 'amber_shard', amount: 1 }
    ],
    category: 'Capture',
  },
  {
    id: 'recipe_trap_super',
    resultItemId: 'trap_super',
    resultAmount: 1,
    ingredients: [
      { itemId: 'trap_basic', amount: 2 },
      { itemId: 'amber_shard', amount: 2 }
    ],
    category: 'Capture',
  },
  {
    id: 'recipe_potion_hp',
    resultItemId: 'potion_hp',
    resultAmount: 2,
    ingredients: [
      { itemId: 'meat_berry', amount: 3 },
      { itemId: 'wood_branch', amount: 1 }
    ],
    category: 'Potions',
  },
  {
    id: 'recipe_saddle_basic',
    resultItemId: 'saddle_basic',
    resultAmount: 1,
    ingredients: [
      { itemId: 'wood_branch', amount: 5 },
      { itemId: 'amber_shard', amount: 3 }
    ],
    category: 'Saddles',
  }
];
