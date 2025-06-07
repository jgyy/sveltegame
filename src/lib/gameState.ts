// src/lib/gameState.ts
import { writable, derived, get } from 'svelte/store';
import type { GameState, Choice, Scene, Item, Skills } from './core/types.js';
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

interface StateUpdate {
	health?: number;
	magic?: number;
	gold?: number;
	experience?: number;
	level?: number;
	combat?: number;
	magic_skill?: number;
	diplomacy?: number;
	stealth?: number;
	flags?: Record<string, boolean>;
	items?: string[];
}

function updateGameStore(updater: (state: GameState) => GameState) {
	gameStore.update(createSafeWrapper(updater, 'game store update'));
}

export const applyStateUpdate = createSafeWrapper((update: StateUpdate): void => {
	updateGameStore(state => {
		const newState = { ...state };
		
		if (update.health !== undefined) newState.health = Math.max(0, Math.min(100, newState.health + update.health));
		if (update.magic !== undefined) newState.magic = Math.max(0, Math.min(100, newState.magic + update.magic));
		if (update.gold !== undefined) newState.gold = Math.max(0, newState.gold + update.gold);
		if (update.experience !== undefined) newState.experience = Math.max(0, newState.experience + update.experience);
		if (update.level !== undefined) newState.level = Math.max(1, newState.level + update.level);
		
		if (update.combat !== undefined) newState.combat = Math.max(1, newState.combat + update.combat);
		if (update.magic_skill !== undefined) newState.magic_skill = Math.max(1, newState.magic_skill + update.magic_skill);
		if (update.diplomacy !== undefined) newState.diplomacy = Math.max(1, newState.diplomacy + update.diplomacy);
		if (update.stealth !== undefined) newState.stealth = Math.max(1, newState.stealth + update.stealth);
		
		if (update.flags) {
			Object.assign(newState, update.flags);
		}
		
		if (update.items) {
			const newItems = update.items
				.map(itemId => items[itemId])
				.filter(item => item && !newState.inventory.some(inv => inv.id === item.id));
			newState.inventory = [...newState.inventory, ...newItems];
		}
		
		return newState;
	});
}, 'applyStateUpdate');

const internalUpdates = {
	basicExploration: (): StateUpdate => ({ experience: 15 }),
	
	skillTraining: (skill: keyof Skills, amount = 1): StateUpdate => ({ 
		experience: 20, 
		[skill]: amount 
	}),
	
	villageInteraction: (): StateUpdate => ({ 
		experience: 15, 
		diplomacy: 1, 
		flags: { villageVisited: true } 
	}),
	
	dragonInteraction: (): StateUpdate => ({ 
		experience: 25, 
		diplomacy: 2, 
		flags: { curseKnowledge: true } 
	}),
	
	magicalDiscovery: (): StateUpdate => ({ 
		experience: 30, 
		magic_skill: 2, 
		magic: 25 
	}),
	
	combatTraining: (): StateUpdate => ({ 
		experience: 20, 
		combat: 1, 
		health: 10 
	}),
	
	restAndRecovery: (): StateUpdate => ({ 
		health: 25, 
		magic: 15, 
		experience: 10 
	}),
	
	treasureFound: (goldAmount = 50): StateUpdate => ({ 
		gold: goldAmount, 
		experience: 20 
	}),
	
	levelUpBonus: (): StateUpdate => ({ 
		level: 1, 
		health: 10, 
		magic: 10, 
		experience: 100 
	}),
	
	victoryReward: (type: 'minor' | 'major' | 'ultimate' = 'minor'): StateUpdate => {
		const rewards = {
			minor: { experience: 50, gold: 100, diplomacy: 1 },
			major: { experience: 150, gold: 300, diplomacy: 3, level: 1 },
			ultimate: { experience: 500, gold: 1000, diplomacy: 5, level: 3, flags: { dragonDefeated: true } }
		};
		return rewards[type];
	}
};

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
			applyStateUpdate(internalUpdates.levelUpBonus());
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
