// src/lib/data/scenes/dragonScenes.ts
import type { Scene } from '../../core/types.js';
import { SceneFactory } from '../../core/sceneFactory.js';
import { createStateUpdate, stateUpdates } from '../stateUpdates.js';

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
    stateUpdates.dragonInteraction()
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
          const { gameStore } = require('../../../gameState.js');
          const state = get(gameStore);
          return state.hasSword && state.curseKnowledge;
        }
      },
      { text: 'Ask how you can help heal', nextScene: 'askHowToHeal' },
      { text: 'Share wisdom about redemption', nextScene: 'shareWisdom' }
    ],
    { diplomacy: 4, experience: 40, flags: { curseKnowledge: true } }
  ),

  askAboutPain: SceneFactory.conversation(
    'askAboutPain',
    'Understanding Suffering',
    'You ask Aethonaris about the pain of the curse.',
    [
      { text: 'Offer comfort and understanding', nextScene: 'comfortDragon' },
      { text: 'Promise to find a way to help', nextScene: 'promiseHelp' },
      { text: 'Ask about the curse\'s origin', nextScene: 'cursOrigin' }
    ],
    { diplomacy: 2, experience: 25, flags: { curseKnowledge: true } }
  ),

  comfortDragon: SceneFactory.conversation(
    'comfortDragon',
    'Offering Comfort',
    'Your words of comfort reach the dragon\'s heart. You see hope flicker in his ancient eyes.',
    [
      { text: 'Promise to find a way to break the curse', nextScene: 'promiseHelp' },
      { text: 'Ask how the curse can be broken', nextScene: 'askHowToHeal' },
      { text: 'Share your own struggles', nextScene: 'shareWisdom' }
    ],
    { experience: 30, diplomacy: 3, flags: { curseKnowledge: true } }
  ),

  askHowToHeal: SceneFactory.conversation(
    'askHowToHeal',
    'The Path to Healing',
    'You ask Aethonaris how the curse might be broken. He speaks of ancient rituals and the power of genuine compassion.',
    [
      { text: 'Offer to perform the healing ritual', nextScene: 'performHealingRitual' },
      { text: 'Ask about the Blade of Transformation', nextScene: 'askAboutBlade' },
      { text: 'Request time to prepare', nextScene: 'prepareForRitual' }
    ],
    { experience: 30, magic_skill: 1, flags: { knowsHealing: true } }
  ),

  shareWisdom: SceneFactory.conversation(
    'shareWisdom',
    'Sharing Ancient Wisdom',
    'You share wisdom about redemption, forgiveness, and the power of transformation.',
    [
      { text: 'Speak of forgiveness', nextScene: 'discussForgiveness' },
      { text: 'Talk about second chances', nextScene: 'discussRedemption' },
      { text: 'Offer philosophical comfort', nextScene: 'offerPhilosophy' }
    ],
    { experience: 35, diplomacy: 2, magic_skill: 1 }
  ),

  promiseHelp: SceneFactory.conversation(
    'promiseHelp',
    'A Sacred Promise',
    'You make a solemn promise to help break the dragon\'s curse. Aethonaris is moved by your commitment.',
    [
      { text: 'Ask what you need to do', nextScene: 'askHowToHeal' },
      { text: 'Offer your sword as a tool of healing', nextScene: 'offerSwordHealing' },
      { text: 'Suggest working together on the solution', nextScene: 'workTogether' }
    ],
    { experience: 35, diplomacy: 3, flags: { promisedHelp: true } }
  ),

  cursOrigin: SceneFactory.conversation(
    'cursOrigin',
    'The Curse\'s Dark Origin',
    'Aethonaris reveals the tragic story of how he came to be cursed, and the dark magic that binds him.',
    [
      { text: 'Express sorrow for his suffering', nextScene: 'expressCompassion' },
      { text: 'Ask about the original caster', nextScene: 'learnCaster' },
      { text: 'Offer to find a way to reverse it', nextScene: 'promiseHelp' }
    ],
    { experience: 40, magic_skill: 2, flags: { knowsCurseOrigin: true } }
  ),

  offerFriendship: SceneFactory.conversation(
    'offerFriendship',
    'An Offer of Friendship',
    'You extend the hand of friendship to the lonely dragon. This simple gesture means more than any weapon or spell.',
    [
      { text: 'Promise to visit regularly', nextScene: 'promiseVisits' },
      { text: 'Suggest traveling together', nextScene: 'suggestPartnership' },
      { text: 'Offer to help him reconnect with the world', nextScene: 'helpReconnect' }
    ],
    { experience: 40, diplomacy: 3, flags: { dragonFriend: true } }
  ),

  friendship: SceneFactory.victory(
    'friendship',
    'A Bond of Friendship',
    'You have formed a lasting friendship with the dragon, bringing peace through understanding.',
    'ultimate'
  ),

  hardFought: SceneFactory.scene(
    'hardFought',
    'A Hard-Fought Battle',
    'Though the battle is difficult, your determination sees you through. The dragon is impressed by your courage.',
    [SceneFactory.basic('Continue the confrontation', 'talkDragon')],
    {
      onEnter: createStateUpdate({ experience: 30, combat: 1, health: -20 })
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
  )
};
