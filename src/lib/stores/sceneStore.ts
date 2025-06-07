// src/lib/stores/sceneStore.ts
import { derived } from 'svelte/store';
import { gameStore } from '../core/stateManager.js';
import type { Scene } from '../core/types.js';

export const currentSceneObject = derived(gameStore, ($gameStore) => {
  try {
    const { scenes } = require('../gameData.js');
    const scene = scenes[$gameStore.currentSceneId];
    
    if (!scene) {
      console.warn(`Scene not found: ${$gameStore.currentSceneId}`);
      return {
        id: 'error',
        title: 'Scene Not Found',
        description: `The scene "${$gameStore.currentSceneId}" could not be found.`,
        choices: [{ text: 'Return to start', nextScene: 'start' }]
      } as Scene;
    }
    
    return scene;
  } catch (error) {
    console.error('Error loading scene:', error);
    return {
      id: 'error',
      title: 'Loading Error',
      description: 'There was an error loading the scene.',
      choices: [{ text: 'Reset Game', nextScene: 'start' }]
    } as Scene;
  }
});
