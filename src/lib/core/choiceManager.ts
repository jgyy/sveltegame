// src/lib/core/choiceManager.ts
import { get } from 'svelte/store';
import type { Choice, Scene } from './types.js';
import { stateManager } from './stateManager.js';
import { createSafeWrapper } from '../utils/errorHandler.js';

export class ChoiceManager {
  public canMakeChoice = createSafeWrapper((choice: Choice): boolean => {
    const state = get(stateManager.gameStore);
    
    if (choice.condition && !choice.condition()) return false;
    
    if (choice.skillRequirement) {
      const skillValue = state[choice.skillRequirement.skill];
      return skillValue >= choice.skillRequirement.level;
    }
    
    if (choice.goldCost && state.gold < choice.goldCost) return false;
    
    if (choice.itemRequired && !stateManager.hasItem(choice.itemRequired)) return false;
    
    if (choice.flagRequired && !state[choice.flagRequired]) return false;
    
    return true;
  }, 'canMakeChoice', false);

  public makeChoice = createSafeWrapper((choice: Choice): void => {
    stateManager.gameStore.update(state => {
      const { scenes } = require('../gameData.js');
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
    
    this.executeSceneEntry();
    
    this.checkLevelUp();
  }, 'makeChoice');

  private executeSceneEntry() {
    const newSceneId = get(stateManager.gameStore).currentSceneId;
    const { scenes } = require('../gameData.js');
    const newScene = scenes[newSceneId];
    
    if (newScene?.onEnter) {
      createSafeWrapper(newScene.onEnter, 'scene onEnter')();
    }
  }

  private checkLevelUp() {
    const state = get(stateManager.gameStore);
    if (state.experience >= state.level * 100) {
      stateManager.applyStateUpdate({
        level: 1,
        health: 10,
        magic: 10,
        experience: 100
      });
    }
  }
}

export const choiceManager = new ChoiceManager();

export const { canMakeChoice, makeChoice } = choiceManager;
