// src/lib/core/stateManager.ts
import { writable, derived, get } from 'svelte/store';
import type { GameState, StateUpdate, Skills } from './types.js';
import { createSafeWrapper, GameError } from '../utils/errorHandler.js';

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

export class StateManager {
  public gameStore = writable<GameState>(initialState);
  
  public currentScene = derived(this.gameStore, ($gameStore) => $gameStore.currentSceneId);
  public inventory = derived(this.gameStore, ($gameStore) => $gameStore.inventory);
  public stats = derived(this.gameStore, ($gameStore) => ({
    health: $gameStore.health,
    magic: $gameStore.magic,
    gold: $gameStore.gold,
    experience: $gameStore.experience,
    level: $gameStore.level
  }));
  public skills = derived(this.gameStore, ($gameStore) => ({
    combat: $gameStore.combat,
    magic_skill: $gameStore.magic_skill,
    diplomacy: $gameStore.diplomacy,
    stealth: $gameStore.stealth
  }));

  private updateGameStore(updater: (state: GameState) => GameState) {
    this.gameStore.update(createSafeWrapper(updater, 'game store update'));
  }

  public applyStateUpdate = createSafeWrapper((update: StateUpdate): void => {
    this.updateGameStore(state => {
      const newState = { ...state };
      
      if (update.health !== undefined) {
        newState.health = Math.max(0, Math.min(100, newState.health + update.health));
      }
      if (update.magic !== undefined) {
        newState.magic = Math.max(0, Math.min(100, newState.magic + update.magic));
      }
      if (update.gold !== undefined) {
        newState.gold = Math.max(0, newState.gold + update.gold);
      }
      if (update.experience !== undefined) {
        newState.experience = Math.max(0, newState.experience + update.experience);
      }
      if (update.level !== undefined) {
        newState.level = Math.max(1, newState.level + update.level);
      }
      
      (['combat', 'magic_skill', 'diplomacy', 'stealth'] as const).forEach(skill => {
        if (update[skill] !== undefined) {
          newState[skill] = Math.max(1, newState[skill] + update[skill]);
        }
      });
      
      if (update.flags) {
        Object.assign(newState, update.flags);
      }
      
      if (update.items) {
        const { items } = require('../data/items.js');
        const newItems = update.items
          .map(itemId => items[itemId])
          .filter(item => item && !newState.inventory.some(inv => inv.id === item.id));
        newState.inventory = [...newState.inventory, ...newItems];
      }
      
      return newState;
    });
  }, 'applyStateUpdate');

  public hasItem = createSafeWrapper((itemId: string): boolean => {
    const state = get(this.gameStore);
    return state.inventory.some(item => item.id === itemId);
  }, 'hasItem check', false);

  public useItem = createSafeWrapper((itemId: string): void => {
    this.updateGameStore(state => {
      const itemIndex = state.inventory.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const item = state.inventory[itemIndex];
        switch (item.id) {
          case 'healingPotion':
            state.health = Math.min(100, state.health + 50);
            state.inventory.splice(itemIndex, 1);
            break;
          case 'magicPotion':
            state.magic = Math.min(100, state.magic + 30);
            state.inventory.splice(itemIndex, 1);
            break;
        }
      }
      return state;
    });
  }, 'useItem');

  public resetGame = createSafeWrapper((): void => {
    this.gameStore.set({ ...initialState });
  }, 'resetGame');

  public initializeAutoSave = createSafeWrapper((): void => {
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem('textAdventureState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          this.gameStore.set({ ...initialState, ...parsedState });
        } catch (e) {
          console.warn('Failed to load saved game state:', e);
        }
      }
      
      this.gameStore.subscribe(state => {
        try {
          localStorage.setItem('textAdventureState', JSON.stringify(state));
        } catch (e) {
          console.warn('Failed to save game state:', e);
        }
      });
    }
  }, 'initializeAutoSave');
}

export const stateManager = new StateManager();

export const {
  gameStore,
  applyStateUpdate,
  hasItem,
  useItem,
  resetGame,
  initializeAutoSave,
  currentScene,
  inventory,
  stats,
  skills
} = stateManager;
