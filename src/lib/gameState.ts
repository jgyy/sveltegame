// src/lib/gameState.ts
export {
  gameStore,
  currentScene,
  inventory,
  stats,
  skills,
  applyStateUpdate,
  hasItem,
  useItem,
  resetGame,
  initializeAutoSave
} from './core/stateManager.js';
export {
  makeChoice,
  canMakeChoice
} from './core/choiceManager.js';
