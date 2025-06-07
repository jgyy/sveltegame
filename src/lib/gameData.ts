// src/lib/gameData.ts
import type { Scene } from './core/types.js';
import { SceneTemplates } from './core/sceneTemplates.js';
import { items } from './data/items.js';
import { 
  coreScenes, 
  towerScenes, 
  villageScenes, 
  dragonScenes, 
  explorationScenes, 
  additionalScenes 
} from './data/sceneCollections.js';

const basicMissingScenes: Record<string, Scene> = {
  meditateBeforeClimb: {
    id: 'meditateBeforeClimb',
    title: 'Meditative Focus',
    description: 'Your meditation fills you with inner calm and magical energy. You feel more prepared for the challenges ahead.',
    choices: [{ text: 'Ascend the tower with renewed focus', nextScene: 'climbTower' }],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ magic: 20, magic_skill: 1, experience: 25 });
    }
  },

  trainBeforeClimb: {
    id: 'trainBeforeClimb',
    title: 'Combat Preparation',
    description: 'You practice your sword work and combat techniques. Your movements become more fluid and confident.',
    choices: [{ text: 'Climb the tower, ready for battle', nextScene: 'climbTower' }],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ combat: 1, health: 10, experience: 25 });
    }
  },

  askAboutPain: {
    id: 'askAboutPain',
    title: 'Understanding Suffering',
    description: 'You ask Aethonaris about the pain of the curse.',
    choices: [
      { text: 'Offer comfort and understanding', nextScene: 'comfortDragon' },
      { text: 'Promise to find a way to help', nextScene: 'promiseHelp' },
      { text: 'Ask about the curse\'s origin', nextScene: 'cursOrigin' }
    ],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ diplomacy: 2, experience: 25, flags: { curseKnowledge: true } });
    }
  },

  comfortDragon: {
    id: 'comfortDragon',
    title: 'Offering Comfort',
    description: 'Your words of comfort reach the dragon\'s heart. You see hope flicker in his ancient eyes.',
    choices: [
      { text: 'Promise to find a way to break the curse', nextScene: 'promiseHelp' },
      { text: 'Ask how the curse can be broken', nextScene: 'askHowToHeal' },
      { text: 'Share your own struggles', nextScene: 'shareWisdom' }
    ],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ experience: 30, diplomacy: 3, flags: { curseKnowledge: true } });
    }
  },

  askHowToHeal: {
    id: 'askHowToHeal',
    title: 'The Path to Healing',
    description: 'You ask Aethonaris how the curse might be broken. He speaks of ancient rituals and the power of genuine compassion.',
    choices: [
      { text: 'Offer to perform the healing ritual', nextScene: 'performHealingRitual' },
      { text: 'Ask about the Blade of Transformation', nextScene: 'askAboutBlade' },
      { text: 'Request time to prepare', nextScene: 'prepareForRitual' }
    ],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ experience: 30, magic_skill: 1, flags: { knowsHealing: true } });
    }
  },

  shareWisdom: {
    id: 'shareWisdom',
    title: 'Sharing Ancient Wisdom',
    description: 'You share wisdom about redemption, forgiveness, and the power of transformation.',
    choices: [
      { text: 'Speak of forgiveness', nextScene: 'discussForgiveness' },
      { text: 'Talk about second chances', nextScene: 'discussRedemption' },
      { text: 'Offer philosophical comfort', nextScene: 'offerPhilosophy' }
    ],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ experience: 35, diplomacy: 2, magic_skill: 1 });
    }
  },

  hardFought: {
    id: 'hardFought',
    title: 'A Hard-Fought Battle',
    description: 'Though the battle is difficult, your determination sees you through. The dragon is impressed by your courage.',
    choices: [{ text: 'Continue the confrontation', nextScene: 'talkDragon' }],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ experience: 30, combat: 1, health: -20 });
    }
  },

  promiseHelp: {
    id: 'promiseHelp',
    title: 'A Sacred Promise',
    description: 'You make a solemn promise to help break the dragon\'s curse. Aethonaris is moved by your commitment.',
    choices: [
      { text: 'Ask what you need to do', nextScene: 'askHowToHeal' },
      { text: 'Continue speaking with the dragon', nextScene: 'talkDragon' }
    ],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ experience: 35, diplomacy: 3, flags: { promisedHelp: true } });
    }
  },

  cursOrigin: {
    id: 'cursOrigin',
    title: 'The Curse\'s Dark Origin',
    description: 'Aethonaris reveals the tragic story of how he came to be cursed.',
    choices: [
      { text: 'Express sorrow for his suffering', nextScene: 'comfortDragon' },
      { text: 'Offer to find a way to reverse it', nextScene: 'promiseHelp' }
    ],
    onEnter: () => {
      const { applyStateUpdate } = require('./gameState.js');
      applyStateUpdate({ experience: 40, magic_skill: 2, flags: { knowsCurseOrigin: true } });
    }
  }
};

const generatedScenes = SceneTemplates.generateScenes(SceneTemplates.getAllTemplates());

export const scenes: Record<string, Scene> = {
  ...coreScenes,
  ...towerScenes,
  ...villageScenes,
  ...dragonScenes,
  ...explorationScenes,
  ...additionalScenes,
  ...basicMissingScenes,
  ...generatedScenes
};

export { items };
