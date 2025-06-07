// src/lib/data/scenes/explorationScenes.ts
import type { Scene } from '../../core/types.js';
import { SceneFactory } from '../../core/sceneFactory.js';
import { createStateUpdate, stateUpdates } from '../stateUpdates.js';

export const explorationScenes: Record<string, Scene> = {
  mysteriousForest: SceneFactory.exploration(
    'mysteriousForest', 
    'The Mysterious Forest',
    'You enter a dark forest where ancient trees whisper secrets. Shafts of moonlight pierce through the canopy, revealing a path deeper into the woods.',
    [
      { name: 'the ancient grove', sceneId: 'ancientGrove' },
      { name: 'the wizard\'s tower', sceneId: 'wizardTower' },
      { name: 'a hidden clearing', sceneId: 'hiddenClearing' }
    ]
  ),

  ancientGrove: SceneFactory.exploration(
    'ancientGrove',
    'The Ancient Grove',
    'You discover a grove of impossibly old trees, their branches intertwining to form natural arches. Mystical energy pulses through the air.',
    [
      { name: 'the heartwood shrine', sceneId: 'heartwoodShrine' },
      { name: 'the singing springs', sceneId: 'singingsprings' },
      { name: 'the elder tree', sceneId: 'elderTree' }
    ],
    stateUpdates.magicalDiscovery()
  ),

  hiddenClearing: SceneFactory.exploration(
    'hiddenClearing',
    'Hidden Clearing',
    'You push through thick undergrowth to find a secret clearing where magical herbs grow wild.',
    [
      { name: 'rare magical herbs', sceneId: 'gatherHerbs' },
      { name: 'a mysterious circle of stones', sceneId: 'stoneCircle' },
      { name: 'tracks of magical creatures', sceneId: 'followTracks' }
    ]
  ),

  stoneBridge: SceneFactory.exploration(
    'stoneBridge',
    'The Ancient Stone Bridge', 
    'You approach an old stone bridge spanning a turbulent river. The bridge looks sturdy but ancient, with mysterious runes carved into its pillars.',
    [
      { name: 'cross to the other side', sceneId: 'bridgeOtherSide' },
      { name: 'examine the runes', sceneId: 'examineRunes' },
      { name: 'explore the river bank', sceneId: 'riverBank' }
    ]
  ),

  bridgeOtherSide: SceneFactory.exploration(
    'bridgeOtherSide',
    'Beyond the Bridge',
    'Having crossed the ancient bridge, you find yourself in unfamiliar territory with new opportunities for adventure.',
    [
      { name: 'a mountain path', sceneId: 'mountainPath' },
      { name: 'a crystal cave', sceneId: 'crystalCave' },
      { name: 'an abandoned watchtower', sceneId: 'watchtower' }
    ]
  ),

  examineArea: SceneFactory.interaction(
    'examineArea',
    'Careful Examination',
    'You carefully examine the crossroads, noticing details you missed before. There are old wagon tracks, worn signposts, and what appears to be a hidden cache.',
    [
      { text: 'Search the hidden cache', nextScene: 'findCache' },
      { text: 'Follow the wagon tracks', nextScene: 'wagonTracks' },
      { text: 'Read the worn signposts', nextScene: 'readSigns' }
    ],
    { experience: 20, stealth: 1 }
  ),

  findCache: SceneFactory.scene(
    'findCache',
    'Hidden Cache',
    'You discover a hidden cache containing useful items.',
    [SceneFactory.basic('Take the items and continue', 'start')],
    { 
      category: 'exploration',
      onEnter: createStateUpdate({ 
        items: ['healingPotion', 'goldCoin'], 
        experience: 20 
      })
    }
  ),

  examineRunes: SceneFactory.scene(
    'examineRunes',
    'Ancient Bridge Runes',
    'The runes tell of safe passage and protection. Understanding them grants you mystical knowledge.',
    [SceneFactory.basic('Cross the bridge with confidence', 'bridgeOtherSide')],
    {
      onEnter: createStateUpdate({ 
        magic_skill: 2, 
        experience: 30, 
        flags: { runeKnowledge: true } 
      })
    }
  ),

  riverBank: SceneFactory.exploration(
    'riverBank',
    'The River Bank',
    'You explore along the rushing river, finding interesting items washed up by the current.',
    [
      { name: 'driftwood and debris', sceneId: 'searchDebris' },
      { name: 'a small fishing spot', sceneId: 'tryFishing' },
      { name: 'upstream along the bank', sceneId: 'followRiver' }
    ]
  ),

  singingsprings: SceneFactory.scene(
    'singingsprings',
    'The Singing Springs',
    'You discover springs that sing with magical resonance, their waters having healing properties.',
    [SceneFactory.basic('Drink from the springs', 'drinkSprings')],
    {
      onEnter: createStateUpdate({ health: 20, magic: 15, experience: 20 })
    }
  ),

  elderTree: SceneFactory.conversation(
    'elderTree',
    'The Elder Tree',
    'The ancient tree speaks to you with wisdom accumulated over centuries.',
    [
      { text: 'Ask about the dragon\'s curse', nextScene: 'treeWisdomDragon' },
      { text: 'Request guidance for your quest', nextScene: 'treeGuidance' },
      { text: 'Seek nature\'s blessing', nextScene: 'seekNatureBlessing' }
    ],
    { experience: 30, magic_skill: 2, flags: { elderTreeWisdom: true } }
  )
};
