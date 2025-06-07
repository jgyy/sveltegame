// src/lib/data/items.ts
import type { Item } from '../types.js';

export const items: Record<string, Item> = {
	ironKey: { id: 'ironKey', name: 'Iron Key', description: 'A heavy iron key with strange symbols' },
	ancientSword: { id: 'ancientSword', name: 'Ancient Sword', description: 'A magical sword that glows with power' },
	healingPotion: { id: 'healingPotion', name: 'Healing Potion', description: 'Restores 50 health', usable: true },
	magicPotion: { id: 'magicPotion', name: 'Magic Potion', description: 'Restores 30 magic', usable: true },
	spellbook: { id: 'spellbook', name: 'Spellbook of Elements', description: 'Contains powerful fire and ice spells' },
	treasureMap: { id: 'treasureMap', name: 'Treasure Map', description: 'Shows the location of hidden treasure' },
	goldCoin: { id: 'goldCoin', name: 'Gold Coins', description: 'Shiny gold coins', value: 1 },
	dragonScale: { id: 'dragonScale', name: 'Dragon Scale', description: 'A scale from the ancient dragon' },
	wizardStaff: { id: 'wizardStaff', name: 'Wizard Staff', description: 'Increases magical power' }
};
