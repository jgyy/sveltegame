// src/lib/data/sceneCollections.ts
import type { Scene } from '../core/types.js';
import { SceneFactory } from '../core/sceneFactory.js';
import { createStateUpdate, commonUpdates } from './stateUpdates.js';

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
          const { gameStore } = require('../../gameState.js');
          const state = get(gameStore);
          return state.hasSword && state.curseKnowledge;
        }
      },
      { 
        text: 'Fight the dragon to end his suffering', 
        nextScene: 'fightDragon',
        requirement: () => {
          const { get } = require('svelte/store');
          const { gameStore } = require('../../gameState.js');
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
    {
      experience: 25,
      diplomacy: 2,
      flags: { curseKnowledge: true }
    }
  ),

  breakCurse: SceneFactory.victory('breakCurse', 'The Ritual of Redemption',
    'With the Blade of Transformation and your knowledge of the curse\'s true nature, you work together with Aethonaris to perform an ancient ritual. The sword glows with transformative light as you channel magic not to destroy, but to heal.',
    'ultimate'
  )
};

export const towerScenes: Record<string, Scene> = {
  openWithKey: SceneFactory.scene(
    'openWithKey',
    'Unlocking the Tower',
    'Your iron key fits perfectly into the ancient lock. The massive door creaks open, revealing a spiraling staircase leading upward.',
    [
      SceneFactory.basic('Climb the stairs to face the dragon', 'climbTower'),
      SceneFactory.basic('Explore the tower base first', 'towerBase'),
      SceneFactory.basic('Prepare yourself before ascending', 'towerPrepare')
    ],
    {
      onEnter: createStateUpdate({ experience: 20 })
    }
  ),

  towerBase: SceneFactory.exploration(
    'towerBase',
    'The Tower Base',
    'You explore the base of the dragon\'s tower. Ancient stones are carved with mystical symbols, and you sense powerful magic all around.',
    [
      { name: 'the mysterious symbols', sceneId: 'examineSymbols' },
      { name: 'a hidden chamber', sceneId: 'hiddenChamber' },
      { name: 'the spiral staircase', sceneId: 'climbTower' }
    ]
  ),

  towerPrepare: SceneFactory.interaction(
    'towerPrepare',
    'Preparing for the Tower',
    'You take a moment to prepare yourself before climbing the tower. You check your equipment, center your mind, and steel yourself for what lies ahead.',
    [
      { text: 'Meditate to focus your magical energy', nextScene: 'meditateBeforeClimb' },
      { text: 'Practice combat moves to ready yourself', nextScene: 'trainBeforeClimb' },
      { text: 'Climb the tower immediately', nextScene: 'climbTower' },
      { text: 'Explore the tower base more', nextScene: 'towerBase' }
    ],
    { experience: 15, magic: 10, health: 5 }
  ),

  unlockTower: SceneFactory.interaction(
    'unlockTower',
    'The Tower Door',
    'You examine the massive door blocking entrance to the tower. It requires a key or great skill to open.',
    [
      { 
        text: 'Use the iron key', 
        nextScene: 'openWithKey', 
        requirement: () => {
          const { get } = require('svelte/store');
          const { gameStore } = require('../../gameState.js');
          return get(gameStore).hasKey;
        }
      },
      { text: 'Pick the lock', nextScene: 'pickLock' },
      { text: 'Try to force the door', nextScene: 'forceDoor' },
      { text: 'Look for another way in', nextScene: 'towerBase' }
    ]
  )
};

export const villageScenes: Record<string, Scene> = {
  approachVillage: SceneFactory.exploration(
    'approachVillage',
    'Approaching the Village',
    'As you near the village, you see smoke rising from chimneys and hear the sounds of daily life. The villagers seem wary but not hostile.',
    [
      { name: 'the village center', sceneId: 'villageCenter' },
      { name: 'the village elder\'s home', sceneId: 'villageElder' },
      { name: 'the market square', sceneId: 'villageMarket' },
      { name: 'the village inn', sceneId: 'villageInn' }
    ]
  ),

  villageCenter: SceneFactory.interaction(
    'villageCenter',
    'Village Center',
    'The heart of the village bustles with activity. Children play while adults go about their daily tasks, though you notice worried glances toward the distant tower.',
    [
      { text: 'Talk to the villagers', nextScene: 'talkVillagers' },
      { text: 'Help with village tasks', nextScene: 'helpVillage' },
      { text: 'Ask about the tower', nextScene: 'askAboutTower' }
    ],
    commonUpdates.villageInteraction()
  ),

  askAboutTower: SceneFactory.conversation(
    'askAboutTower',
    'Learning About the Tower',
    'The villagers speak in hushed tones about the dragon\'s tower and the curse that binds the creature within.',
    [
      { text: 'Ask how to break the curse', nextScene: 'learnCurseBreaking' },
      { text: 'Request guidance for approaching the tower', nextScene: 'getTowerGuidance' },
      { text: 'Offer to face the dragon', nextScene: 'offerToHelp' }
    ],
    { experience: 20, diplomacy: 1, flags: { curseKnowledge: true } }
  )
};

export const dragonScenes: Record<string, Scene> = {
  talkDragon: SceneFactory.conversation(
    'talkDragon',
    'Speaking with the Dragon',
    'You speak calmly to the great dragon. Aethonaris regards you with ancient, sorrowful eyes.',
    [
      { text: 'Ask about the curse\'s pain', nextScene: 'askAboutPain' },
      { text: 'Show compassion for his suffering', nextScene: 'showCompassion' },
      { text: 'Offer friendship', nextScene: 'offerFriendship' }
    ],
    commonUpdates.dragonInteraction()
  ),

  fightDragon: SceneFactory.scene(
    'fightDragon',
    'The Dragon Battle',
    'You draw your sword and face the mighty dragon in combat. This is a battle that will test all your skills.',
    [
      SceneFactory.skill('Use superior combat technique', 'combatVictory', 'combat', 3),
      SceneFactory.skill('Cast a powerful spell', 'magicVictory', 'magic_skill', 3),
      SceneFactory.basic('Fight with determination', 'hardFought')
    ],
    { category: 'combat' }
  ),

  showCompassion: SceneFactory.conversation(
    'showCompassion',
    'True Understanding',
    'Your compassion touches the dragon deeply.',
    [
      { 
        text: 'Offer to perform the redemption ritual', 
        nextScene: 'breakCurse', 
        requirement: () => {
          const { get } = require('svelte/store');
          const { gameStore } = require('../../gameState.js');
          const state = get(gameStore);
          return state.hasSword && state.curseKnowledge;
        }
      },
      { text: 'Ask how you can help heal', nextScene: 'askHowToHeal' },
      { text: 'Share wisdom about redemption', nextScene: 'shareWisdom' }
    ],
    { diplomacy: 4, experience: 40, flags: { curseKnowledge: true } }
  )
};

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

  stoneBridge: SceneFactory.exploration(
    'stoneBridge',
    'The Ancient Stone Bridge', 
    'You approach an old stone bridge spanning a turbulent river. The bridge looks sturdy but ancient, with mysterious runes carved into its pillars.',
    [
      { name: 'the other side', sceneId: 'bridgeOtherSide' },
      { name: 'examine the runes', sceneId: 'examineRunes' },
      { name: 'the river bank', sceneId: 'riverBank' }
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
  )
};

export const additionalScenes: Record<string, Scene> = {
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

  examineSymbols: SceneFactory.scene(
    'examineSymbols',
    'Ancient Symbols',
    'The symbols tell the story of a great curse and hint at its possible resolution through compassion rather than violence.',
    [SceneFactory.basic('Continue exploring', 'towerBase')],
    {
      onEnter: createStateUpdate({ 
        experience: 25, 
        magic_skill: 1, 
        flags: { curseKnowledge: true } 
      })
    }
  ),

  hiddenChamber: SceneFactory.scene(
    'hiddenChamber',
    'Hidden Chamber',
    'You discover a hidden chamber containing ancient treasures and a magical sword that pulses with transformative energy.',
    [SceneFactory.basic('Take the sword and continue', 'towerBase')],
    {
      onEnter: createStateUpdate({ 
        items: ['ancientSword'],
        experience: 30,
        flags: { hasSword: true }
      })
    }
  ),

  combatVictory: SceneFactory.victory(
    'combatVictory',
    'Victory Through Strength',
    'Through superior combat skill, you defeat the dragon in honorable battle. The curse breaks as the dragon finds peace.',
    'major'
  ),

  magicVictory: SceneFactory.victory(
    'magicVictory',
    'Victory Through Magic',
    'Your powerful magic overcomes the dragon\'s defenses. As your spell completes, the curse dissolves and the dragon is freed.',
    'major'
  ),

  celebrate: SceneFactory.victory(
    'celebrate',
    'Victory Celebration',
    'You celebrate your great achievement. The curse is broken, and peace returns to the land.',
    'major'
  ),

  heroReturn: SceneFactory.victory(
    'heroReturn',
    'Return of the Hero',
    'You return to the village as a hero. The people celebrate your victory over the dragon\'s curse.',
    'major'
  )
};
