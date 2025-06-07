// src/lib/data/scenes/coreScenes.ts
import type { Scene } from '../../core/types.js';
import { SceneFactory } from '../../core/sceneFactory.js';
import { createStateUpdate, stateUpdates } from '../stateUpdates.js';

export const coreScenes: Record<string, Scene> = {
  start: SceneFactory.exploration('start', 'The Crossroads of Destiny',
    'You stand at a crossroads where three paths diverge. To the north lies a mysterious forest shrouded in mist. To the east, you can see smoke rising from what appears to be a small village. To the west, an ancient stone bridge spans a rushing river, leading to unknown lands.',
    [
      { name: 'the mysterious forest', sceneId: 'mysteriousForest' },
      { name: 'the village', sceneId: 'approachVillage' },
      { name: 'the stone bridge', sceneId: 'stoneBridge' },
      { name: 'examine the area more carefully', sceneId: 'examineArea' }
    ]
  ),

  climbTower: SceneFactory.conversation('climbTower', 'The Dragon\'s Lair',
    'You reach the top of the tower and behold Aethonaris - the great dragon whose scales shimmer between gold and deep sorrow.',
    [
      { 
        text: 'Offer to break the curse and restore his true form', 
        nextScene: 'breakCurse',
        requirement: () => {
          const { get } = require('svelte/store');
          const { gameStore } = require('../../../gameState.js');
          const state = get(gameStore);
          return state.hasSword && state.curseKnowledge;
        }
      },
      { 
        text: 'Fight the dragon to end his suffering', 
        nextScene: 'fightDragon',
        requirement: () => {
          const { get } = require('svelte/store');
          const { gameStore } = require('../../../gameState.js');
          return get(gameStore).hasSword;
        }
      },
      { 
        text: 'Try to communicate with the dragon', 
        nextScene: 'talkDragon'
      },
      { 
        text: 'Run back down the stairs immediately', 
        nextScene: 'unlockTower'
      }
    ],
    stateUpdates.dragonInteraction()
  ),

  breakCurse: SceneFactory.victory('breakCurse', 'The Ritual of Redemption',
    'With the Blade of Transformation and your knowledge of the curse\'s true nature, you work together with Aethonaris to perform an ancient ritual. The sword glows with transformative light as you channel magic not to destroy, but to heal.',
    'ultimate'
  )
};
