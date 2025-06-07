// src/lib/data/additionalMissingScenes.ts
import type { Scene } from '../core/types.js';
import { SceneFactory } from '../core/sceneFactory.js';

const createStateUpdate = (update: any) => () => {
  const { applyStateUpdate } = require('../gameState.js');
  applyStateUpdate(update);
};

export const additionalMissingScenes: Record<string, Scene> = {
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

  hardFought: SceneFactory.scene(
    'hardFought',
    'A Hard-Fought Battle',
    'Though the battle is difficult, your determination sees you through. The dragon is impressed by your courage.',
    [SceneFactory.basic('Continue the confrontation', 'talkDragon')],
    {
      onEnter: createStateUpdate({ experience: 30, combat: 1, health: -20 })
    }
  ),

  acceptQuest: SceneFactory.scene(
    'acceptQuest',
    'Accepting the Quest',
    'You formally accept the quest to deal with the dragon. The villagers give you their blessing and what supplies they can spare.',
    [SceneFactory.basic('Begin your quest', 'start')],
    {
      onEnter: createStateUpdate({ 
        experience: 25, 
        items: ['healingPotion', 'ironKey'], 
        flags: { questAccepted: true } 
      })
    }
  ),

  learnCurseBreaking: SceneFactory.scene(
    'learnCurseBreaking',
    'Learning About Curse Breaking',
    'You learn about the ancient methods of breaking powerful curses through compassion and understanding.',
    [SceneFactory.basic('Apply this knowledge', 'start')],
    {
      onEnter: createStateUpdate({ 
        experience: 35, 
        magic_skill: 2, 
        flags: { curseKnowledge: true, masterCurseBreaker: true }
      })
    }
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

  drinkSprings: SceneFactory.scene(
    'drinkSprings',
    'Drinking from the Springs',
    'The magical waters refresh both your body and spirit, granting you enhanced vitality.',
    [SceneFactory.basic('Return to the grove', 'ancientGrove')],
    {
      onEnter: createStateUpdate({ health: 25, magic: 20, experience: 15 })
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
  ),

  treeWisdomDragon: SceneFactory.scene(
    'treeWisdomDragon',
    'Tree Wisdom About Dragons',
    'The elder tree shares ancient knowledge about dragons and the nature of their curses.',
    [SceneFactory.basic('Thank the tree for its wisdom', 'elderTree')],
    {
      onEnter: createStateUpdate({ 
        experience: 35, 
        magic_skill: 2, 
        flags: { dragonLoreKnowledge: true, curseKnowledge: true } 
      })
    }
  ),

  wizardTower: SceneFactory.exploration(
    'wizardTower',
    'The Wizard\'s Tower',
    'A tall, spiraling tower covered in mystical symbols. You sense great magical knowledge within.',
    [
      { name: 'the wizard\'s study', sceneId: 'wizardStudy' },
      { name: 'the magical library', sceneId: 'magicalLibrary' },
      { name: 'the enchanted garden', sceneId: 'enchantedGarden' }
    ]
  ),

  villageElder: SceneFactory.conversation(
    'villageElder',
    'The Village Elder',
    'You speak with the wise elder who knows the village\'s history.',
    [
      { text: 'Ask about the dragon\'s curse', nextScene: 'askDragon' },
      { text: 'Request help for your quest', nextScene: 'getSupplies' },
      { text: 'Offer your services', nextScene: 'offerHelp' }
    ],
    { experience: 20, diplomacy: 1, flags: { villageVisited: true } }
  ),

  askDragon: SceneFactory.conversation(
    'askDragon',
    'Learning About the Dragon',
    'The elder\'s eyes grow distant as they speak of the dragon\'s curse.',
    [
      { text: 'Ask about breaking the curse', nextScene: 'learnCurseBreaking' },
      { text: 'Request guidance for your quest', nextScene: 'getGuidance' },
      { text: 'Offer to help the village', nextScene: 'offerHelp' }
    ],
    { experience: 25, diplomacy: 2, flags: { curseKnowledge: true } }
  ),

  getSupplies: SceneFactory.scene(
    'getSupplies',
    'Getting Supplies', 
    'The elder provides you with essential supplies for your quest.',
    [SceneFactory.basic('Thank them and continue', 'start')],
    {
      onEnter: createStateUpdate({ 
        items: ['healingPotion', 'ironKey'], 
        experience: 15,
        diplomacy: 1
      })
    }
  ),

  offerHelp: SceneFactory.scene(
    'offerHelp',
    'Offering Help',
    'You offer your services to help the village. They are grateful for your assistance.',
    [SceneFactory.basic('Continue your quest', 'start')],
    {
      onEnter: createStateUpdate({ experience: 15, diplomacy: 1, flags: { villageVisited: true } })
    }
  ),

  villageMarket: SceneFactory.exploration(
    'villageMarket',
    'The Village Market',
    'You explore the market, learning about local trade and the curse\'s impact.',
    [
      { name: 'buy supplies', sceneId: 'buySupplies' },
      { name: 'talk to merchants', sceneId: 'merchantChat' },
      { name: 'investigate empty stalls', sceneId: 'emptyStalls' }
    ],
    { experience: 15, diplomacy: 1, flags: { villageVisited: true } }
  ),

  villageInn: SceneFactory.exploration(
    'villageInn',
    'The Village Inn',
    'The inn provides rest and gossip from travelers.',
    [
      { name: 'rest and recover', sceneId: 'restAtInn' },
      { name: 'listen to traveler stories', sceneId: 'travelerTales' },
      { name: 'ask about the tower', sceneId: 'askAboutTower' }
    ],
    { experience: 15, health: 20, flags: { villageVisited: true } }
  ),

  getGuidance: SceneFactory.conversation(
    'getGuidance',
    'Seeking Village Guidance',
    'You ask the villagers for guidance on your quest to deal with the dragon.',
    [
      { text: 'Ask about the dragon\'s behavior patterns', nextScene: 'learnDragonBehavior' },
      { text: 'Request information about the tower', nextScene: 'getTowerGuidance' },
      { text: 'Inquire about previous heroes\' attempts', nextScene: 'learnPreviousAttempts' }
    ],
    { experience: 20, diplomacy: 1 }
  ),

  friendship: SceneFactory.victory(
    'friendship',
    'A Bond of Friendship',
    'You have formed a lasting friendship with the dragon, bringing peace through understanding.',
    'ultimate'
  ),

  continue: SceneFactory.scene(
    'continue',
    'Continuing the Journey',
    'You continue on your journey with new knowledge and experience.',
    [SceneFactory.basic('Return to the crossroads', 'start')],
    {
      onEnter: createStateUpdate({ experience: 10 })
    }
  )
};
