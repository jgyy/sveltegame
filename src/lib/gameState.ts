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
	try {
		const scene = scenes[$gameStore.currentSceneId];
		if (!scene) {
			console.error(`Scene not found: ${$gameStore.currentSceneId}`);
			return {
				id: 'error',
				title: 'Error',
				description: 'Scene not found. Please reset the game.',
				choices: [{ text: 'Reset Game', nextScene: 'start' }]
			};
		}
		
		let processedScene = { ...scene };
		
		if (typeof scene.description === 'function') {
			try {
				processedScene.description = scene.description();
			} catch (err) {
				console.error('Error calling scene description function:', err);
				processedScene.description = 'Error loading scene description.';
			}
		}
		
		if (typeof scene.choices === 'function') {
			try {
				processedScene.choices = scene.choices();
			} catch (err) {
				console.error('Error calling scene choices function:', err);
				processedScene.choices = [{ text: 'Reset Game', nextScene: 'start' }];
			}
		}
		
		return processedScene;
	} catch (err) {
		console.error('Error in currentScene derived store:', err);
		return {
			id: 'error',
			title: 'Error',
			description: 'An error occurred loading the scene.',
			choices: [{ text: 'Reset Game', nextScene: 'start' }]
		};
	}
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
	try {
		const state = get(gameStore);
		return state.inventory.some(item => item.id === itemId);
	} catch (err) {
		console.error('Error in hasItem:', err);
		return false;
	}
}

export function useItem(itemId: string): void {
	try {
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
	} catch (err) {
		console.error('Error in useItem:', err);
		throw err;
	}
}

export function makeChoice(choice: Choice): void {
	try {
		gameStore.update(state => {
			const currentSceneTitle = scenes[state.currentSceneId]?.title || 'Unknown Scene';
			state.gameHistory.push(`${currentSceneTitle}: ${choice.text}`);
			
			let nextSceneId: string;
			if (typeof choice.nextScene === 'function') {
				nextSceneId = choice.nextScene();
			} else {
				nextSceneId = choice.nextScene;
			}
			
			state.currentSceneId = nextSceneId;
			
			return state;
		});
		
		const newSceneId = get(gameStore).currentSceneId;
		const newScene = scenes[newSceneId];
		if (newScene?.onEnter) {
			try {
				newScene.onEnter();
			} catch (err) {
				console.error('Error in scene onEnter function:', err);
			}
		}
		
		gameStore.update(state => {
			if (state.experience >= state.level * 100) {
				state.level += 1;
				state.health = Math.min(100, state.health + 10);
				state.magic = Math.min(100, state.magic + 10);
			}
			return state;
		});
	} catch (err) {
		console.error('Error in makeChoice:', err);
		throw err;
	}
}

export function canMakeChoice(choice: Choice): boolean {
	try {
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
	} catch (err) {
		console.error('Error in canMakeChoice:', err);
		return false;
	}
}

export function resetGame(): void {
	try {
		gameStore.set({ ...initialState });
	} catch (err) {
		console.error('Error in resetGame:', err);
		throw err;
	}
}

export function initializeAutoSave(): void {
	try {
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
				try {
					localStorage.setItem('textAdventureState', JSON.stringify(state));
				} catch (e) {
					console.warn('Failed to save game state:', e);
				}
			});
		}
	} catch (err) {
		console.error('Error in initializeAutoSave:', err);
		throw err;
	}
}
