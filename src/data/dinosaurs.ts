import { Dinosaur, DinoRarity, ElementType, DinoPersonality, DinoSkill } from '../types/game';

export interface DinoSpeciesTemplate {
  speciesId: string;
  name: string;
  nameEs: string;
  defaultRarity: DinoRarity;
  primaryElement: ElementType;
  mountType: 'Land' | 'Air' | 'Water' | 'Climber';
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  scale: number;
  heightMeter: number;
  weightKg: number;
  colorHex: string;
  secondaryColorHex: string;
  description: string;
  skills: DinoSkill[];
}

export const DINO_SPECIES_CATALOG: DinoSpeciesTemplate[] = [
  {
    speciesId: 'velociraptor',
    name: 'Velociraptor',
    nameEs: 'Velociraptor',
    defaultRarity: 'Rare',
    primaryElement: 'Lightning',
    mountType: 'Land',
    baseHp: 180,
    baseAttack: 55,
    baseDefense: 30,
    baseSpeed: 90,
    scale: 1.1,
    heightMeter: 1.8,
    weightKg: 45,
    colorHex: '#e76f51',
    secondaryColorHex: '#f4a261',
    description: 'Depredador ágil, hiperveloz y letal. Caza en manadas coordinadas utilizando garras en hoz.',
    skills: [
      { id: 'raptor_pounce', name: 'Raptor Pounce', nameEs: 'Salto Depredador', description: 'Ataca con garras a máxima velocidad.', element: 'Lightning', damage: 45, cooldown: 3, energyCost: 20, type: 'Attack', icon: 'Zap' },
      { id: 'pack_frenzy', name: 'Pack Frenzy', nameEs: 'Frenesí de Manada', description: 'Aumenta el ataque y la velocidad en un 30%.', element: 'Lightning', damage: 0, cooldown: 10, energyCost: 35, type: 'Buff', icon: 'TrendingUp' }
    ]
  },
  {
    speciesId: 'trex',
    name: 'Tyrannosaurus Rex',
    nameEs: 'Tiranosaurio Rex',
    defaultRarity: 'Legendary',
    primaryElement: 'Fire',
    mountType: 'Land',
    baseHp: 480,
    baseAttack: 110,
    baseDefense: 75,
    baseSpeed: 50,
    scale: 2.5,
    heightMeter: 4.2,
    weightKg: 8000,
    colorHex: '#800020',
    secondaryColorHex: '#d4af37',
    description: 'El rey de los dinosaurios. Su mordida aplastante y rugido aterrador dominan toda la jungla.',
    skills: [
      { id: 'tyrant_bite', name: 'Tyrant Bite', nameEs: 'Mordida Tirana', description: 'Mordisco devastador que ignora la armadura.', element: 'Fire', damage: 95, cooldown: 5, energyCost: 40, type: 'Attack', icon: 'Flame' },
      { id: 'apex_roar', name: 'Apex Roar', nameEs: 'Rugido del Ápex', description: 'Intimida al enemigo reduciendo su ataque.', element: 'Fire', damage: 20, cooldown: 12, energyCost: 30, type: 'Debuff', icon: 'Volume2' }
    ]
  },
  {
    speciesId: 'triceratops',
    name: 'Triceratops',
    nameEs: 'Triceratops',
    defaultRarity: 'Common',
    primaryElement: 'Earth',
    mountType: 'Land',
    baseHp: 320,
    baseAttack: 48,
    baseDefense: 85,
    baseSpeed: 40,
    scale: 1.8,
    heightMeter: 3.0,
    weightKg: 6000,
    colorHex: '#2a9d8f',
    secondaryColorHex: '#e9c46a',
    description: 'Posee tres cuernos afilados y un gran gola ósea. Implacable en la carga defensiva.',
    skills: [
      { id: 'horn_charge', name: 'Horn Charge', nameEs: 'Carga de Cuerno', description: 'Embiste con cuernos frontales.', element: 'Earth', damage: 50, cooldown: 4, energyCost: 25, type: 'Attack', icon: 'Shield' },
      { id: 'iron_frill', name: 'Iron Frill', nameEs: 'Gola de Hierro', description: 'Endurece su piel aumentando la defensa en 50%.', element: 'Earth', damage: 0, cooldown: 8, energyCost: 20, type: 'Buff', icon: 'ShieldAlert' }
    ]
  },
  {
    speciesId: 'stegosaurus',
    name: 'Stegosaurus',
    nameEs: 'Esteposauro',
    defaultRarity: 'Common',
    primaryElement: 'Nature',
    mountType: 'Land',
    baseHp: 300,
    baseAttack: 52,
    baseDefense: 70,
    baseSpeed: 35,
    scale: 1.9,
    heightMeter: 2.8,
    weightKg: 5000,
    colorHex: '#38b000',
    secondaryColorHex: '#70e000',
    description: 'Herbívoro con pacas dorsales vivas y una cola articulada llena de púas defensivas.',
    skills: [
      { id: 'tail_spike', name: 'Tail Spike Smash', nameEs: 'Golpe de Púas', description: 'Azota con la cola infligiendo daño múltiple.', element: 'Nature', damage: 60, cooldown: 4, energyCost: 25, type: 'Attack', icon: 'Activity' }
    ]
  },
  {
    speciesId: 'brachiosaurus',
    name: 'Brachiosaurus',
    nameEs: 'Braquiosauro',
    defaultRarity: 'Epic',
    primaryElement: 'Earth',
    mountType: 'Land',
    baseHp: 650,
    baseAttack: 40,
    baseDefense: 95,
    baseSpeed: 25,
    scale: 3.2,
    heightMeter: 12.0,
    weightKg: 40000,
    colorHex: '#6c5ce7',
    secondaryColorHex: '#a29bfe',
    description: 'Gigante pacífico cuyo largo cuello alcanza la copa de las secoyas prehistóricas.',
    skills: [
      { id: 'earthquake_stomp', name: 'Titan Stomp', nameEs: 'Pisada Titánica', description: 'Pisa el suelo causando ondas de choque.', element: 'Earth', damage: 70, cooldown: 6, energyCost: 35, type: 'Attack', icon: 'Radio' }
    ]
  },
  {
    speciesId: 'spinosaurus',
    name: 'Spinosaurus',
    nameEs: 'Espinosaurio',
    defaultRarity: 'Legendary',
    primaryElement: 'Water',
    mountType: 'Water',
    baseHp: 460,
    baseAttack: 105,
    baseDefense: 65,
    baseSpeed: 60,
    scale: 2.6,
    heightMeter: 5.0,
    weightKg: 9000,
    colorHex: '#0077b6',
    secondaryColorHex: '#90e0ef',
    description: 'Depredador semiacuático con una espectacular vela dorsal y hocico largo adaptado para cazar.',
    skills: [
      { id: 'hydro_slash', name: 'Hydro Slash', nameEs: 'Zarpazo Acuático', description: 'Ataca impregnando garras con torrente de agua.', element: 'Water', damage: 85, cooldown: 4, energyCost: 30, type: 'Attack', icon: 'Droplets' }
    ]
  },
  {
    speciesId: 'ankylosaurus',
    name: 'Ankylosaurus',
    nameEs: 'Anquilosaurio',
    defaultRarity: 'Rare',
    primaryElement: 'Earth',
    mountType: 'Climber',
    baseHp: 380,
    baseAttack: 60,
    baseDefense: 110,
    baseSpeed: 30,
    scale: 1.7,
    heightMeter: 2.2,
    weightKg: 6000,
    colorHex: '#7f5539',
    secondaryColorHex: '#b08968',
    description: 'Tanque viviente cubierto de placas blindadas y una maza de hueso en la cola.',
    skills: [
      { id: 'club_smash', name: 'Mace Smash', nameEs: 'Maza Blindada', description: 'Golpea violentamente con la maza de la cola.', element: 'Earth', damage: 75, cooldown: 5, energyCost: 30, type: 'Attack', icon: 'Shield' }
    ]
  },
  {
    speciesId: 'carnotaurus',
    name: 'Carnotaurus',
    nameEs: 'Carnotauro',
    defaultRarity: 'Rare',
    primaryElement: 'Fire',
    mountType: 'Land',
    baseHp: 260,
    baseAttack: 75,
    baseDefense: 45,
    baseSpeed: 80,
    scale: 1.8,
    heightMeter: 3.0,
    weightKg: 2000,
    colorHex: '#d62828',
    secondaryColorHex: '#f77f00',
    description: 'Carnívoro rápido con cuernos supraorbitales característicos e increíble velocidad de esprint.',
    skills: [
      { id: 'bull_ram', name: 'Bull Ram', nameEs: 'Cornada del Toro', description: 'Embiste a alta velocidad aturdiendo al objetivo.', element: 'Fire', damage: 65, cooldown: 4, energyCost: 25, type: 'Attack', icon: 'Zap' }
    ]
  },
  {
    speciesId: 'pteranodon',
    name: 'Pteranodon',
    nameEs: 'Pteranodón',
    defaultRarity: 'Epic',
    primaryElement: 'Lightning',
    mountType: 'Air',
    baseHp: 190,
    baseAttack: 50,
    baseDefense: 35,
    baseSpeed: 100,
    scale: 1.6,
    heightMeter: 1.8,
    weightKg: 35,
    colorHex: '#48cae4',
    secondaryColorHex: '#caf0f8',
    description: 'Reptil volador maestral con crestas elegantes. Permite surcar los cielos de la isla prehistórica.',
    skills: [
      { id: 'aerial_dive', name: 'Aerial Dive', nameEs: 'Picado Aéreo', description: 'Desciende en picado cortando el aire.', element: 'Lightning', damage: 55, cooldown: 3, energyCost: 20, type: 'Attack', icon: 'Wind' }
    ]
  },
  {
    speciesId: 'quetzalcoatlus',
    name: 'Quetzalcoatlus',
    nameEs: 'Quetzalcoatlus',
    defaultRarity: 'Mythic',
    primaryElement: 'Lightning',
    mountType: 'Air',
    baseHp: 310,
    baseAttack: 85,
    baseDefense: 50,
    baseSpeed: 95,
    scale: 2.8,
    heightMeter: 5.5,
    weightKg: 250,
    colorHex: '#9b5de5',
    secondaryColorHex: '#f15bb5',
    description: 'La mayor criatura voladora jamás conocida. Del tamaño de una pequeña avioneta.',
    skills: [
      { id: 'tempest_gale', name: 'Tempest Gale', nameEs: 'Vendaval Volcánico', description: 'Crea una ráfaga que aturde y daña enemigos.', element: 'Lightning', damage: 80, cooldown: 5, energyCost: 35, type: 'Attack', icon: 'Wind' }
    ]
  },
  {
    speciesId: 'dilophosaurus',
    name: 'Dilophosaurus',
    nameEs: 'Dilofosaurio',
    defaultRarity: 'Common',
    primaryElement: 'Shadow',
    mountType: 'Land',
    baseHp: 170,
    baseAttack: 45,
    baseDefense: 28,
    baseSpeed: 75,
    scale: 1.2,
    heightMeter: 1.5,
    weightKg: 300,
    colorHex: '#00b4d8',
    secondaryColorHex: '#ffb703',
    description: 'Despliega una gola venosa multicolor y escupe veneno cegador para inmovilizar presas.',
    skills: [
      { id: 'venom_spit', name: 'Toxic Spit', nameEs: 'Escupitajo Tóxico', description: 'Escupe veneno paralizante.', element: 'Shadow', damage: 40, cooldown: 3, energyCost: 15, type: 'Attack', icon: 'Droplet' }
    ]
  },
  {
    speciesId: 'parasaurolophus',
    name: 'Parasaurolophus',
    nameEs: 'Parasaurolofus',
    defaultRarity: 'Common',
    primaryElement: 'Nature',
    mountType: 'Land',
    baseHp: 250,
    baseAttack: 35,
    baseDefense: 50,
    baseSpeed: 65,
    scale: 1.6,
    heightMeter: 2.8,
    weightKg: 2500,
    colorHex: '#52b788',
    secondaryColorHex: '#74c69d',
    description: 'Utiliza su larga cresta tubular como instrumento de resonancia para curar y llamar a sus aliados.',
    skills: [
      { id: 'sonic_heal', name: 'Sonic Echo', nameEs: 'Eco Sónico Curativo', description: 'Restaura vida del equipo emitiendo ondas.', element: 'Nature', damage: -35, cooldown: 8, energyCost: 25, type: 'Heal', icon: 'Heart' }
    ]
  },
  {
    speciesId: 'mosasaurus',
    name: 'Mosasaurus',
    nameEs: 'Mosasaurio',
    defaultRarity: 'Mythic',
    primaryElement: 'Water',
    mountType: 'Water',
    baseHp: 550,
    baseAttack: 120,
    baseDefense: 80,
    baseSpeed: 85,
    scale: 3.5,
    heightMeter: 4.0,
    weightKg: 15000,
    colorHex: '#03045e',
    secondaryColorHex: '#0077b6',
    description: 'Terror oceánico prehistórico. Capaz de cruzar abismos marinos y aplastar presas acuáticas.',
    skills: [
      { id: 'abyssal_bite', name: 'Abyssal Crunch', nameEs: 'Mordisco Abisal', description: 'Engulle con la boca titánica de agua.', element: 'Water', damage: 110, cooldown: 6, energyCost: 45, type: 'Attack', icon: 'Shield' }
    ]
  },
  {
    speciesId: 'king_trex',
    name: 'King Tyrannosaurus',
    nameEs: 'Rey Tiranosaurio Rex',
    defaultRarity: 'Mythic',
    primaryElement: 'Shadow',
    mountType: 'Land',
    baseHp: 1200,
    baseAttack: 160,
    baseDefense: 100,
    baseSpeed: 65,
    scale: 4.2,
    heightMeter: 8.0,
    weightKg: 20000,
    colorHex: '#1d3557',
    secondaryColorHex: '#e63946',
    description: 'El soberano supremo corrupto por la fuerza oscura. El desafío final en la cúspide del mundo prehistórico.',
    skills: [
      { id: 'dark_apocalypse', name: 'Cataclysm Wave', nameEs: 'Onda de Cataclismo', description: 'Desata meteoros y lava oscura.', element: 'Shadow', damage: 150, cooldown: 8, energyCost: 50, type: 'Attack', icon: 'Flame' },
      { id: 'infernal_shield', name: 'Infernal Armor', nameEs: 'Armadura Infernal', description: 'Crea un escudo de magma de 300 HP.', element: 'Fire', damage: 0, cooldown: 15, energyCost: 40, type: 'Buff', icon: 'Shield' }
    ]
  }
];

export function createDinosaurFromSpecies(speciesId: string, customLevel: number = 1): Dinosaur {
  const template = DINO_SPECIES_CATALOG.find(s => s.speciesId === speciesId) || DINO_SPECIES_CATALOG[0];
  const level = Math.max(1, customLevel);

  const statMultiplier = 1 + (level - 1) * 0.12;

  const hp = Math.floor(template.baseHp * statMultiplier);
  const attack = Math.floor(template.baseAttack * statMultiplier);
  const defense = Math.floor(template.baseDefense * statMultiplier);
  const speed = Math.floor(template.baseSpeed * statMultiplier);

  const personalities: DinoPersonality[] = ['Brave', 'Aggressive', 'Timid', 'Loyal', 'Playful', 'Cunning'];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];

  return {
    id: `dino_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    speciesId: template.speciesId,
    name: template.nameEs,
    rarity: template.defaultRarity,
    element: template.primaryElement,
    level: level,
    exp: 0,
    maxExp: level * 100,
    hp: hp,
    maxHp: hp,
    attack: attack,
    defense: defense,
    speed: speed,
    affinity: Math.floor(40 + Math.random() * 50),
    personality: personality,
    skills: JSON.parse(JSON.stringify(template.skills)),
    isCaptured: false,
    canMount: true,
    mountType: template.mountType,
    modelType: template.speciesId,
    colorHex: template.colorHex,
    secondaryColorHex: template.secondaryColorHex,
    scale: template.scale,
    heightMeter: template.heightMeter,
    weightKg: template.weightKg,
    wildLocation: 'Selva Prehistórica',
  };
}
