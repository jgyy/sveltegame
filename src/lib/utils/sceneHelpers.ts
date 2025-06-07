// src/lib/utils/sceneHelpers.ts
import type { Scene, Choice } from '../types.js';
import { items } from '../data/items.js';

export const basicChoice = (text: string, nextScene: string): Choice => ({ text, nextScene });

export const conditionalChoice = (text: string, nextScene: string, condition: () => boolean): Choice => ({ 
	text, 
	nextScene, 
	condition 
});

export const skillChoice = (text: string, nextScene: string, skill: string, level: number): Choice => ({ 
	text, 
	nextScene, 
	skillRequirement: { skill, level } 
});

export const goldChoice = (text: string, nextScene: string, cost: number): Choice => 
	conditionalChoice(text, nextScene, () => {
		const { get } = require('svelte/store');
		const { gameStore } = require('../gameState.js');
		return get(gameStore).gold >= cost;
	});

export const createScene = (
	id: string, 
	title: string, 
	description: string | (() => string), 
	choices: Choice[], 
	onEnter?: () => void
): Scene => ({
	id, 
	title, 
	description, 
	choices, 
	...(onEnter && { onEnter })
});

export const createExplorationScene = (
	id: string, 
	title: string, 
	description: string, 
	destinations: string[]
): Scene => 
	createScene(id, title, description, [
		...destinations.map(dest => basicChoice(`Go to ${dest}`, dest.toLowerCase().replace(/\s+/g, ''))),
		basicChoice('Return to crossroads', 'start')
	]);

export const createVictoryScene = (
	id: string, 
	title: string, 
	description: string, 
	exp: number, 
	levelUp = 0
): Scene =>
	createScene(id, title, description, [
		basicChoice('Celebrate with Aethonaris', 'celebrateWithDragon'),
		basicChoice('Return as hero', 'ultimateHeroReturn'),
		basicChoice('Learn from experience', 'dragonMentor')
	], () => {
		const { get } = require('svelte/store');
		const { gameStore } = require('../gameState.js');
		const currentState = get(gameStore);
		gameStore.update((state: any) => ({ 
			...state, 
			dragonDefeated: true, 
			experience: state.experience + exp, 
			level: state.level + levelUp 
		}));
	});

export const updateStats = (updates: any) => () => {
	const { gameStore } = require('../gameState.js');
	gameStore.update((state: any) => ({ ...state, ...updates }));
};

export const addItems = (...itemIds: string[]) => () => {
	const { gameStore } = require('../gameState.js');
	gameStore.update((state: any) => ({
		...state, 
		inventory: [...state.inventory, ...itemIds.map(id => items[id])]
	}));
};

export const combineUpdates = (...updates: (() => void)[]) => () => 
	updates.forEach(update => update());
