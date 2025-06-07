// src/lib/data/scenes/towerScenes.ts
import type { Scene } from '../../core/types.js';
import { SceneFactory } from '../../core/sceneFactory.js';
import { createStateUpdate, stateUpdates } from '../stateUpdates.js';

export const towerScenes: Record<string, Scene> = {
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

  meditateBeforeClimb: SceneFactory.scene(
    'meditateBeforeClimb',
    'Meditative Focus',
    'Your meditation fills you with inner calm and magical energy. You feel more prepared for the challenges ahead.',
    [SceneFactory.basic('Ascend the tower with renewed focus', 'climbTower')],
    {
      onEnter: createStateUpdate({ magic: 20, magic_skill: 1, experience: 25 })
    }
  ),

  trainBeforeClimb: SceneFactory.scene(
    'trainBeforeClimb',
    'Combat Preparation',
    'You practice your sword work and combat techniques. Your movements become more fluid and confident.',
    [SceneFactory.basic('Climb the tower, ready for battle', 'climbTower')],
    {
      onEnter: createStateUpdate({ combat: 1, health: 10, experience: 25 })
    }
  ),

  towerEntrance: SceneFactory.exploration(
    'towerEntrance',
    'The Tower Entrance',
    'You stand before the imposing entrance to the dragon\'s tower. Ancient stones are weathered by time, and you can feel powerful magic emanating from within.',
    [
      { name: 'the massive door', sceneId: 'unlockTower' },
      { name: 'carvings on the walls', sceneId: 'examineSymbols' },
      { name: 'the base of the tower', sceneId: 'towerBase' }
    ]
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
          const { gameStore } = require('../../../gameState.js');
          return get(gameStore).hasKey;
        }
      },
      { text: 'Pick the lock', nextScene: 'pickLock' },
      { text: 'Try to force the door', nextScene: 'forceDoor' },
      { text: 'Look for another way in', nextScene: 'towerBase' }
    ]
  ),

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

  pickLock: SceneFactory.scene(
    'pickLock',
    'Lockpicking Attempt',
    () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../../../gameState.js');
      const state = get(gameStore);
      if (state.stealth >= 3) {
        return 'With expert skill, you carefully work the ancient lock. Your nimble fingers find the right pressure points and the lock clicks open.';
      } else if (state.stealth >= 2) {
        return 'You work carefully at the lock. After several tense minutes, you manage to open it, though not without some difficulty.';
      } else {
        return 'You attempt to pick the lock but your skills are insufficient. The ancient mechanism remains stubbornly closed.';
      }
    },
    [
      SceneFactory.skill('Successfully pick the lock', 'openWithKey', 'stealth', 2),
      SceneFactory.basic('Try a different approach', 'unlockTower'),
      SceneFactory.basic('Look for another way in', 'towerBase')
    ]
  ),

  forceDoor: SceneFactory.scene(
    'forceDoor',
    'Forcing the Door',
    () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../../../gameState.js');
      const state = get(gameStore);
      if (state.combat >= 3) {
        return 'With tremendous strength and skill, you strike the door at its weakest points. The ancient wood splinters and gives way.';
      } else {
        return 'You throw your weight against the door repeatedly, but it holds firm. The effort leaves you bruised and exhausted.';
      }
    },
    [
      SceneFactory.skill('Break down the door with strength', 'openWithKey', 'combat', 3),
      SceneFactory.basic('Try a different approach', 'unlockTower'),
      SceneFactory.basic('Rest and recover', 'towerBase')
    ],
    {
      onEnter: createStateUpdate({ health: -10, experience: 15 })
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
  )
};
