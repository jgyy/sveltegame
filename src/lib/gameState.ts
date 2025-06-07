// src/lib/gameState.ts
import { writable, derived, get } from 'svelte/store';
import type { GameState, Choice, Scene, Item, Skills } from './types.js';
import { items, scenes } from './gameData.js';
import { createSafeWrapper, GameError } from './utils/errorHandler.js';
import { processScene } from './utils/sceneProcessor.js';

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

function updateGameStore(updater: (state: GameState) => GameState) {
	gameStore.update(createSafeWrapper(updater, 'game store update'));
}

export const currentScene = derived(gameStore, ($gameStore) => {
	try {
		const scene = scenes[$gameStore.currentSceneId];
		if (!scene) {
			const errorMsg = `Scene '${$gameStore.currentSceneId}' not found in scenes definition. Available scenes: ${Object.keys(scenes).join(', ')}`;
			console.error(errorMsg);
			return {
				id: 'error',
				title: 'Scene Not Found Error',
				description: `Could not find scene: "${$gameStore.currentSceneId}". This scene may not be implemented yet. Please try resetting the game or report this bug.`,
				choices: [
					{ text: 'Reset Game', nextScene: 'start' },
					{ text: 'Go to Start Scene', nextScene: 'start' }
				]
			};
		}
		
		return processScene(scene);
	} catch (err) {
		console.error('Error in currentScene derived store:', err);
		return {
			id: 'error',
			title: 'Scene Processing Error',
			description: `An error occurred while processing scene "${$gameStore.currentSceneId}": ${(err as Error).message}`,
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

export const hasItem = createSafeWrapper((itemId: string): boolean => {
	const state = get(gameStore);
	return state.inventory.some(item => item.id === itemId);
}, 'hasItem check', false);

export const useItem = createSafeWrapper((itemId: string): void => {
	updateGameStore(state => {
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
}, 'useItem');

export const makeChoice = createSafeWrapper((choice: Choice): void => {
	updateGameStore(state => {
		const currentSceneTitle = scenes[state.currentSceneId]?.title || 'Unknown Scene';
		state.gameHistory.push(`${currentSceneTitle}: ${choice.text}`);
		
		let nextSceneId: string;
		if (typeof choice.nextScene === 'function') {
			try {
				nextSceneId = choice.nextScene();
			} catch (err) {
				console.error('Error executing choice function:', err);
				nextSceneId = 'start'; 
			}
		} else {
			nextSceneId = choice.nextScene;
		}
		
		if (!scenes[nextSceneId]) {
			console.error(`Warning: Transitioning to non-existent scene '${nextSceneId}'. Falling back to start.`);
			nextSceneId = 'start';
		}
		
		state.currentSceneId = nextSceneId;
		return state;
	});
	
	const newSceneId = get(gameStore).currentSceneId;
	const newScene = scenes[newSceneId];
	if (newScene?.onEnter) {
		createSafeWrapper(newScene.onEnter, 'scene onEnter')();
	}
	
	updateGameStore(state => {
		if (state.experience >= state.level * 100) {
			state.level += 1;
			state.health = Math.min(100, state.health + 10);
			state.magic = Math.min(100, state.magic + 10);
		}
		return state;
	});
}, 'makeChoice');

export const canMakeChoice = createSafeWrapper((choice: Choice): boolean => {
	const state = get(gameStore);
	
	if (choice.condition && !choice.condition()) return false;
	
	if (choice.skillRequirement) {
		const skillValue = state[choice.skillRequirement.skill];
		return skillValue >= choice.skillRequirement.level;
	}
	
	return true;
}, 'canMakeChoice', false);

export const resetGame = createSafeWrapper((): void => {
	gameStore.set({ ...initialState });
}, 'resetGame');

export const initializeAutoSave = createSafeWrapper((): void => {
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
}, 'initializeAutoSave');
