// src/lib/gameState.ts
import { writable, derived, get } from 'svelte/store';
import type { GameState, Choice, Scene, Item } from './types.js';
import { items, scenes } from './gameData.js';

const initialState: GameState = {
	currentSceneId: 'start',
	inventory: [],
	health: 100,
	magic: 50,
	gold: 0,
	experience: 0,
	level: 1,
	
	hasKey: false,
	hasSword: false,
	hasMap: false,
	hasPotion: false,
	hasSpellbook: false,
	dragonDefeated: false,
	wizardMet: false,
	villageVisited: false,
	bridgeRepaired: false,
	merchantFriend: false,
	curseKnowledge: false,
	
	combat: 1,
	magic_skill: 1,
	diplomacy: 1,
	stealth: 1,
	
	gameHistory: []
};

export const gameStore = writable<GameState>(initialState);

export const currentScene = derived(gameStore, ($gameStore) => {
	const scene = scenes[$gameStore.currentSceneId];
	
	if (typeof scene.description === 'function') {
		return {
			...scene,
			description: scene.description()
		};
	}
	
	if (typeof scene.choices === 'function') {
		return {
			...scene,
			choices: scene.choices()
		};
	}
	
	return scene;
});

export const inventory = derived(gameStore, ($gameStore) => $gameStore.inventory);
export const stats = derived(gameStore, ($gameStore) => ({
	health: $gameStore.health,
	magic: $gameStore.magic,
	gold: $gameStore.gold,
	experience: $gameStore.experience,
	level: $gameStore.level
}));

export const skills = derived(gameStore, ($gameStore) => ({
	combat: $gameStore.combat,
	magic_skill: $gameStore.magic_skill,
	diplomacy: $gameStore.diplomacy,
	stealth: $gameStore.stealth
}));

export function hasItem(itemId: string): boolean {
	const state = get(gameStore);
	return state.inventory.some(item => item.id === itemId);
}

export function useItem(itemId: string): void {
	gameStore.update(state => {
		const itemIndex = state.inventory.findIndex(item => item.id === itemId);
		if (itemIndex !== -1) {
			const item = state.inventory[itemIndex];
			if (item.id === 'healingPotion') {
				state.health = Math.min(100, state.health + 50);
				state.inventory.splice(itemIndex, 1);
			} else if (item.id === 'magicPotion') {
				state.magic = Math.min(100, state.magic + 30);
				state.inventory.splice(itemIndex, 1);
			}
		}
		return state;
	});
}

export function makeChoice(choice: Choice): void {
	gameStore.update(state => {
		const currentSceneTitle = scenes[state.currentSceneId].title;
		state.gameHistory.push(`${currentSceneTitle}: ${choice.text}`);
		
		state.currentSceneId = choice.nextScene;
		
		return state;
	});
	
	const newScene = scenes[get(gameStore).currentSceneId];
	if (newScene.onEnter) {
		newScene.onEnter();
	}
	
	gameStore.update(state => {
		if (state.experience >= state.level * 100) {
			state.level += 1;
			state.health = Math.min(100, state.health + 10);
			state.magic = Math.min(100, state.magic + 10);
		}
		return state;
	});
}

export function canMakeChoice(choice: Choice): boolean {
	const state = get(gameStore);
	
	if (choice.condition && !choice.condition()) return false;
	
	if (choice.skillRequirement) {
		const skillValue = choice.skillRequirement.skill === 'combat' ? state.combat :
						  choice.skillRequirement.skill === 'magic_skill' ? state.magic_skill :
						  choice.skillRequirement.skill === 'diplomacy' ? state.diplomacy :
						  choice.skillRequirement.skill === 'stealth' ? state.stealth : 0;
		return skillValue >= choice.skillRequirement.level;
	}
	
	return true;
}

export function resetGame(): void {
	gameStore.set({ ...initialState });
}

export function initializeAutoSave(): void {
	if (typeof localStorage !== 'undefined') {
		const savedState = localStorage.getItem('textAdventureState');
		if (savedState) {
			try {
				const parsedState = JSON.parse(savedState);
				gameStore.set({ ...initialState, ...parsedState });
			} catch (e) {
				console.warn('Failed to load saved game state:', e);
			}
		}
		
		gameStore.subscribe(state => {
			localStorage.setItem('textAdventureState', JSON.stringify(state));
		});
	}
}
