// src/lib/data/items.ts
import type { Item } from '../core/types.js';

export const items: Record<string, Item> = {
  ironKey: { id: 'ironKey', name: 'Iron Key', description: 'A heavy iron key with strange symbols', type: 'key' },
  ancientSword: { id: 'ancientSword', name: 'Ancient Sword', description: 'A magical sword that glows with power', type: 'weapon' },
  healingPotion: { id: 'healingPotion', name: 'Healing Potion', description: 'Restores 50 health', usable: true, type: 'potion' },
  magicPotion: { id: 'magicPotion', name: 'Magic Potion', description: 'Restores 30 magic', usable: true, type: 'potion' },
  spellbook: { id: 'spellbook', name: 'Spellbook of Elements', description: 'Contains powerful fire and ice spells', type: 'artifact' },
  treasureMap: { id: 'treasureMap', name: 'Treasure Map', description: 'Shows the location of hidden treasure', type: 'artifact' },
  goldCoin: { id: 'goldCoin', name: 'Gold Coins', description: 'Shiny gold coins', value: 1, type: 'treasure' },
  dragonScale: { id: 'dragonScale', name: 'Dragon Scale', description: 'A scale from the ancient dragon', type: 'artifact' },
  wizardStaff: { id: 'wizardStaff', name: 'Wizard Staff', description: 'Increases magical power', type: 'artifact' },

  magicHerbs: { 
    id: 'magicHerbs', 
    name: 'Magical Herbs', 
    description: 'Rare herbs with mystical properties that can enhance magical abilities',
    usable: true,
    type: 'potion',
    value: 25
  },

  campingGear: {
    id: 'campingGear',
    name: 'Camping Gear',
    description: 'Quality camping equipment for resting during adventures',
    type: 'artifact',
    value: 30
  },

  glowingAmulet: {
    id: 'glowingAmulet',
    name: 'Glowing Amulet',
    description: 'An amulet that glows with protective magical energy',
    type: 'artifact',
    value: 75
  },

  ancientScrolls: {
    id: 'ancientScrolls',
    name: 'Ancient Scrolls',
    description: 'Scrolls containing forgotten magical knowledge',
    type: 'artifact',
    value: 100
  },

  unicornBlessing: {
    id: 'unicornBlessing',
    name: 'Unicorn\'s Blessing',
    description: 'A magical blessing that provides protection and purification',
    type: 'artifact',
    value: 200
  },

  crystalShard: {
    id: 'crystalShard',
    name: 'Crystal Shard',
    description: 'A shard from the magical crystal cave that resonates with power',
    usable: true,
    type: 'artifact',
    value: 50
  },

  springWater: {
    id: 'springWater',
    name: 'Spring Water',
    description: 'Magical water from the singing springs that heals and restores',
    usable: true,
    type: 'potion',
    value: 40
  },

  elderBark: {
    id: 'elderBark',
    name: 'Elder Tree Bark',
    description: 'Bark from the ancient elder tree, infused with centuries of wisdom',
    type: 'artifact',
    value: 60
  },

  riverStone: {
    id: 'riverStone',
    name: 'Smooth River Stone',
    description: 'A perfectly smooth stone from the ancient river, warm to the touch',
    type: 'artifact',
    value: 15
  },

  moonflower: {
    id: 'moonflower',
    name: 'Moonflower Petals',
    description: 'Petals that glow softly with moonlight and have healing properties',
    usable: true,
    type: 'potion',
    value: 35
  },

  stargrass: {
    id: 'stargrass',
    name: 'Stargrass',
    description: 'Grass that sparkles like stars and restores magical energy',
    usable: true,
    type: 'potion',
    value: 30
  },

  wisdomSage: {
    id: 'wisdomSage',
    name: 'Wisdom Sage',
    description: 'A herb that enhances mental clarity and understanding',
    usable: true,
    type: 'potion',
    value: 45
  },

  bladeOfTransformation: {
    id: 'bladeOfTransformation',
    name: 'Blade of Transformation',
    description: 'A legendary sword that can heal rather than harm when wielded with pure intent',
    type: 'weapon',
    value: 500
  },

  wizardRobe: {
    id: 'wizardRobe',
    name: 'Wizard\'s Robe',
    description: 'A robe imbued with protective magical enchantments',
    type: 'artifact',
    value: 150
  },

  natureTalisman: {
    id: 'natureTalisman',
    name: 'Nature\'s Talisman',
    description: 'A talisman blessed by the forces of nature itself',
    type: 'artifact',
    value: 120
  },

  dragonTear: {
    id: 'dragonTear',
    name: 'Dragon\'s Tear',
    description: 'A crystallized tear of the dragon, containing immense emotional power',
    type: 'artifact',
    value: 300
  },

  compassionCrystal: {
    id: 'compassionCrystal',
    name: 'Crystal of Compassion',
    description: 'A crystal that amplifies empathy and understanding',
    type: 'artifact',
    value: 250
  },

  peacePipe: {
    id: 'peacePipe',
    name: 'Pipe of Peace',
    description: 'A ceremonial pipe that promotes peaceful resolution of conflicts',
    type: 'artifact',
    value: 100
  },

  healingCrystal: {
    id: 'healingCrystal',
    name: 'Healing Crystal',
    description: 'A crystal that promotes physical and spiritual healing',
    usable: true,
    type: 'artifact',
    value: 80
  },

  strengthCrystal: {
    id: 'strengthCrystal',
    name: 'Crystal of Strength',
    description: 'A crystal that enhances physical and inner strength',
    usable: true,
    type: 'artifact',
    value: 80
  },

  wisdomCrystal: {
    id: 'wisdomCrystal',
    name: 'Crystal of Wisdom',
    description: 'A crystal that enhances understanding and magical knowledge',
    usable: true,
    type: 'artifact',
    value: 80
  },

  villageToken: {
    id: 'villageToken',
    name: 'Village Token of Friendship',
    description: 'A token showing you are a friend and protector of the village',
    type: 'artifact',
    value: 50
  },

  merchantSeal: {
    id: 'merchantSeal',
    name: 'Merchant\'s Seal',
    description: 'A seal granting you favorable treatment with merchants',
    type: 'artifact',
    value: 75
  },

  travelersJournal: {
    id: 'travelersJournal',
    name: 'Traveler\'s Journal',
    description: 'A journal containing maps and notes from experienced travelers',
    type: 'artifact',
    value: 60
  }
};

export function getItemsByType(type: Item['type']): Item[] {
  return Object.values(items).filter(item => item.type === type);
}

export function getUsableItems(): Item[] {
  return Object.values(items).filter(item => item.usable);
}

export function getItemsByValueRange(min: number, max: number): Item[] {
  return Object.values(items).filter(item => 
    item.value !== undefined && item.value >= min && item.value <= max
  );
}

export const itemCategories = {
  weapons: getItemsByType('weapon'),
  potions: getItemsByType('potion'),
  artifacts: getItemsByType('artifact'),
  treasures: getItemsByType('treasure'),
  keys: getItemsByType('key'),
  usable: getUsableItems()
};

export const itemRarity = {
  common: getItemsByValueRange(0, 50),
  uncommon: getItemsByValueRange(51, 100),
  rare: getItemsByValueRange(101, 200),
  legendary: getItemsByValueRange(201, Infinity)
};
