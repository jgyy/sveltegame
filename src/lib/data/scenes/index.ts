// src/lib/data/scenes/index.ts
import { coreScenes } from './coreScenes.js';
import { towerScenes } from './towerScenes.js';
import { villageScenes } from './villageScenes.js';
import { dragonScenes } from './dragonScenes.js';
import { explorationScenes } from './explorationScenes.js';
import { SceneTemplates } from '../../core/sceneTemplates.js';
import { createStateUpdate } from '../stateUpdates.js';
import type { Scene } from '../../core/types.js';

const generatedScenes = SceneTemplates.generateScenes(SceneTemplates.getAllTemplates());

const utilityScenes: Record<string, Scene> = {
  continue: {
    id: 'continue',
    title: 'Continuing the Journey',
    description: 'You continue on your journey with new knowledge and experience.',
    choices: [{ text: 'Return to the crossroads', nextScene: 'start' }],
    onEnter: createStateUpdate({ experience: 10 })
  },

  celebrate: {
    id: 'celebrate',
    title: 'Victory Celebration',
    description: 'You celebrate your great achievement. The curse is broken, and peace returns to the land.',
    choices: [
      { text: 'Return as a hero', nextScene: 'heroReturn' },
      { text: 'Continue your journey', nextScene: 'start' }
    ],
    category: 'victory',
    onEnter: createStateUpdate({ experience: 150, gold: 300, diplomacy: 3, level: 1 })
  },

  heroReturn: {
    id: 'heroReturn',
    title: 'Return of the Hero',
    description: 'You return to the village as a hero. The people celebrate your victory over the dragon\'s curse.',
    choices: [{ text: 'Begin a new adventure', nextScene: 'start' }],
    category: 'victory',
    onEnter: createStateUpdate({ experience: 200, gold: 500, diplomacy: 5 })
  }
};

export const allScenes: Record<string, Scene> = {
  ...coreScenes,
  
  ...towerScenes,
  ...villageScenes,
  ...dragonScenes,
  ...explorationScenes,
  
  ...generatedScenes,
  
  ...utilityScenes
};

const sceneIds = Object.keys(allScenes);
const duplicateIds = sceneIds.filter((id, index) => sceneIds.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  console.warn('Duplicate scene IDs found:', duplicateIds);
}

export { coreScenes, towerScenes, villageScenes, dragonScenes, explorationScenes };
