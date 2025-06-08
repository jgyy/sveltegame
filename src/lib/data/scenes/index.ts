// src/lib/data/scenes/index.ts
import { coreScenes } from './coreScenes.js';
import { towerScenes } from './towerScenes.js';
import { villageScenes, additionalVillageScenes } from './villageScenes.js';
import { dragonScenes, additionalDragonScenes } from './dragonScenes.js';
import { explorationScenes, additionalExplorationScenes } from './explorationScenes.js';
import { supportingScenes } from './supportingScenes.js'; 
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
  },

  peacefulEnding: {
    id: 'peacefulEnding',
    title: 'A Peaceful Resolution',
    description: 'Through wisdom and compassion, you have achieved a peaceful resolution that benefits everyone involved.',
    choices: [
      { text: 'Reflect on your journey', nextScene: 'reflectJourney' },
      { text: 'Plan future adventures', nextScene: 'planFuture' },
      { text: 'Return to help others', nextScene: 'start' }
    ],
    category: 'victory',
    onEnter: createStateUpdate({ experience: 200, diplomacy: 5, magic_skill: 3 })
  },

  reflectJourney: {
    id: 'reflectJourney',
    title: 'Reflecting on the Journey',
    description: 'You take time to reflect on all you\'ve learned and how you\'ve grown during this adventure.',
    choices: [{ text: 'Begin a new chapter', nextScene: 'start' }],
    category: 'victory',
    onEnter: createStateUpdate({ experience: 100, level: 1 })
  }
};

export const allScenes: Record<string, Scene> = {
  ...coreScenes,
  
  ...towerScenes,
  ...villageScenes,
  ...dragonScenes,
  ...explorationScenes,
  
  ...additionalVillageScenes,
  ...additionalDragonScenes,
  ...additionalExplorationScenes,
  ...supportingScenes,
  
  ...generatedScenes,
  
  ...utilityScenes
};

const sceneIds = Object.keys(allScenes);
const duplicateIds = sceneIds.filter((id, index) => sceneIds.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  console.warn('Duplicate scene IDs found:', duplicateIds);
}

export const scenesByCategory = {
  core: coreScenes,
  tower: towerScenes,
  village: { ...villageScenes, ...additionalVillageScenes },
  dragon: { ...dragonScenes, ...additionalDragonScenes },
  exploration: { ...explorationScenes, ...additionalExplorationScenes },
  supporting: supportingScenes,
  utility: utilityScenes
};

export const sceneStatistics = {
  totalScenes: Object.keys(allScenes).length,
  categoryCounts: {
    exploration: Object.values(allScenes).filter(s => s.category === 'exploration').length,
    dialogue: Object.values(allScenes).filter(s => s.category === 'dialogue').length,
    interaction: Object.values(allScenes).filter(s => s.category === 'interaction').length,
    victory: Object.values(allScenes).filter(s => s.category === 'victory').length,
    training: Object.values(allScenes).filter(s => s.category === 'training').length,
    combat: Object.values(allScenes).filter(s => s.category === 'combat').length
  }
};

export { 
  coreScenes, 
  towerScenes, 
  villageScenes, 
  dragonScenes, 
  explorationScenes,
  additionalVillageScenes,
  additionalDragonScenes,
  additionalExplorationScenes,
  supportingScenes
};
