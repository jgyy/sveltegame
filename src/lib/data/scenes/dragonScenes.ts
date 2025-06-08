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

export const additionalDragonScenes: Record<string, Scene> = {
  performHealingRitual: SceneFactory.scene(
    'performHealingRitual',
    'The Healing Ritual',
    'You and Aethonaris work together to perform the ancient healing ritual. The air crackles with transformative magic as you channel compassion and understanding.',
    [
      SceneFactory.skill('Channel your magical energy into the ritual', 'ritualSuccess', 'magic_skill', 3),
      SceneFactory.basic('Focus on your compassion and intent', 'compassionateRitual'),
      SceneFactory.multi('Combine sword, magic, and wisdom', 'perfectRitual', {
        skills: [{ skill: 'magic_skill', level: 2 }, { skill: 'diplomacy', level: 3 }],
        flags: ['hasSword', 'curseKnowledge']
      })
    ],
    {
      category: 'dialogue',
      onEnter: createStateUpdate({ experience: 40, magic_skill: 2, diplomacy: 1 })
    }
  ),

  askAboutBlade: SceneFactory.conversation(
    'askAboutBlade',
    'The Blade of Transformation',
    'Aethonaris tells you about the legendary Blade of Transformation, a weapon that can heal rather than harm when wielded with pure intent.',
    [
      { text: 'Ask where to find the blade', nextScene: 'locateBlade' },
      { text: 'Learn how to use it properly', nextScene: 'bladeUsage' },
      { text: 'Inquire about its history', nextScene: 'bladeHistory' },
      { text: 'Ask if you already possess it', nextScene: 'checkForBlade' }
    ],
    { experience: 30, magic_skill: 1, flags: { knowsBlade: true } }
  ),

  prepareForRitual: SceneFactory.interaction(
    'prepareForRitual',
    'Preparing for the Ritual',
    'You take time to prepare yourself mentally and spiritually for the challenging task of breaking an ancient curse.',
    [
      { text: 'Meditate to center your energy', nextScene: 'meditateForRitual' },
      { text: 'Study the curse\'s nature more deeply', nextScene: 'studyCurse' },
      { text: 'Gather necessary materials', nextScene: 'gatherMaterials' },
      { text: 'Begin the ritual immediately', nextScene: 'performHealingRitual' }
    ],
    { experience: 25, magic: 20, magic_skill: 1 }
  ),

  discussForgiveness: SceneFactory.conversation(
    'discussForgiveness',
    'The Nature of Forgiveness',
    'You speak with Aethonaris about forgiveness - both forgiving others and learning to forgive oneself.',
    [
      { text: 'Help him forgive his past actions', nextScene: 'helpSelfForgiveness' },
      { text: 'Share your own struggles with forgiveness', nextScene: 'shareForgivenessStruggles' },
      { text: 'Discuss the power of redemption', nextScene: 'discussRedemption' },
      { text: 'Offer to help him find peace', nextScene: 'offerPeace' }
    ],
    { experience: 35, diplomacy: 3, magic_skill: 1, flags: { discussedForgiveness: true } }
  ),

  discussRedemption: SceneFactory.conversation(
    'discussRedemption',
    'The Path of Redemption',
    'You and Aethonaris discuss the possibility of redemption and second chances, even for those who have done great wrong.',
    [
      { text: 'Emphasize that everyone deserves a second chance', nextScene: 'secondChances' },
      { text: 'Discuss making amends for past wrongs', nextScene: 'makingAmends' },
      { text: 'Talk about learning from mistakes', nextScene: 'learningFromMistakes' },
      { text: 'Offer to help him find his path forward', nextScene: 'offerGuidance' }
    ],
    { experience: 40, diplomacy: 4, flags: { discussedRedemption: true } }
  ),

  offerPhilosophy: SceneFactory.conversation(
    'offerPhilosophy',
    'Philosophical Comfort',
    'You share deep philosophical insights about the nature of existence, suffering, and transformation.',
    [
      { text: 'Discuss the meaning of suffering', nextScene: 'meaningSuffering' },
      { text: 'Talk about personal growth through adversity', nextScene: 'growthAdversity' },
      { text: 'Share thoughts on the impermanence of pain', nextScene: 'impermanencePain' },
      { text: 'Explore the concept of inner peace', nextScene: 'innerPeace' }
    ],
    { experience: 45, diplomacy: 2, magic_skill: 2, flags: { sharedPhilosophy: true } }
  ),

  offerSwordHealing: SceneFactory.scene(
    'offerSwordHealing',
    'Offering the Sword for Healing',
    () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../../../gameState.js');
      const state = get(gameStore);
      if (state.hasSword) {
        return 'You offer your magical sword as a tool of healing rather than destruction. Aethonaris is moved by your trust and willingness to use a weapon for good.';
      } else {
        return 'You speak of your intent to find a magical sword that could be used for healing. Aethonaris appreciates your peaceful intentions.';
      }
    },
    [
      SceneFactory.conditional('Perform the healing ritual with the sword', 'swordHealingRitual', () => {
        const { get } = require('svelte/store');
        const { gameStore } = require('../../../gameState.js');
        return get(gameStore).hasSword;
      }),
      SceneFactory.basic('Promise to return with a proper healing tool', 'promiseReturn'),
      SceneFactory.basic('Continue discussing other options', 'askHowToHeal')
    ],
    {
      category: 'dialogue',
      onEnter: createStateUpdate({ experience: 30, diplomacy: 2 })
    }
  ),

  workTogether: SceneFactory.conversation(
    'workTogether',
    'Working Together',
    'You propose working together with Aethonaris to find a solution that benefits both him and the surrounding lands.',
    [
      { text: 'Plan a joint effort to break the curse', nextScene: 'planJointEffort' },
      { text: 'Discuss how he can help others after healing', nextScene: 'futureService' },
      { text: 'Suggest a partnership for good', nextScene: 'suggestPartnership' },
      { text: 'Propose learning from each other', nextScene: 'mutualLearning' }
    ],
    { experience: 35, diplomacy: 4, flags: { proposedPartnership: true } }
  ),

  expressCompassion: SceneFactory.conversation(
    'expressCompassion',
    'Expressing Deep Compassion',
    'You express heartfelt compassion for Aethonaris\'s suffering, acknowledging the pain he has endured.',
    [
      { text: 'Promise to help end his suffering', nextScene: 'promiseEndSuffering' },
      { text: 'Offer emotional support', nextScene: 'offerSupport' },
      { text: 'Share your own experiences with pain', nextScene: 'shareExperiences' },
      { text: 'Suggest ways to find peace despite the curse', nextScene: 'findPeaceDespiteCurse' }
    ],
    { experience: 40, diplomacy: 5, flags: { expressedCompassion: true } }
  ),

  learnCaster: SceneFactory.conversation(
    'learnCaster',
    'Learning About the Caster',
    'Aethonaris reveals details about the powerful sorcerer who originally cast the curse and their motivations.',
    [
      { text: 'Ask if the caster is still alive', nextScene: 'casterStillAlive' },
      { text: 'Learn about the caster\'s weaknesses', nextScene: 'casterWeaknesses' },
      { text: 'Inquire about confronting the caster', nextScene: 'confrontCaster' },
      { text: 'Focus on breaking the curse instead', nextScene: 'focusOnCurse' }
    ],
    { experience: 35, magic_skill: 2, flags: { knowsCaster: true } }
  ),

  promiseVisits: SceneFactory.conversation(
    'promiseVisits',
    'Promising Regular Visits',
    'You promise to visit Aethonaris regularly, providing companionship and friendship to ease his loneliness.',
    [
      { text: 'Establish a schedule for visits', nextScene: 'scheduleVisits' },
      { text: 'Bring others to meet him', nextScene: 'introduceOthers' },
      { text: 'Create activities to do together', nextScene: 'planActivities' },
      { text: 'Start building a deeper friendship now', nextScene: 'deepenFriendship' }
    ],
    { experience: 30, diplomacy: 3, flags: { promisedVisits: true } }
  ),

  suggestPartnership: SceneFactory.conversation(
    'suggestPartnership',
    'Suggesting a Partnership',
    'You propose a formal partnership where you and Aethonaris work together to help others and protect the realm.',
    [
      { text: 'Discuss protecting travelers together', nextScene: 'protectTravelers' },
      { text: 'Plan to help other cursed beings', nextScene: 'helpOtherCursed' },
      { text: 'Suggest teaching others about compassion', nextScene: 'teachCompassion' },
      { text: 'Propose building a sanctuary', nextScene: 'buildSanctuary' }
    ],
    { experience: 45, diplomacy: 4, flags: { offeredPartnership: true } }
  ),

  helpReconnect: SceneFactory.conversation(
    'helpReconnect',
    'Helping Reconnect with the World',
    'You offer to help Aethonaris reconnect with the world beyond his tower, bridging the gap between dragon and human.',
    [
      { text: 'Arrange meetings with village leaders', nextScene: 'arrangeMeetings' },
      { text: 'Help him understand modern human culture', nextScene: 'modernCulture' },
      { text: 'Facilitate gradual integration', nextScene: 'gradualIntegration' },
      { text: 'Start with small acts of kindness', nextScene: 'smallKindnesses' }
    ],
    { experience: 40, diplomacy: 4, flags: { helpingReconnect: true } }
  )
};
