// src/lib/data/scenes/villageScenes.ts
import type { Scene } from '../../core/types.js';
import { SceneFactory } from '../../core/sceneFactory.js';
import { createStateUpdate, stateUpdates } from '../stateUpdates.js';

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
    stateUpdates.villageInteraction()
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
    stateUpdates.villageInteraction()
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

  askAboutTower: SceneFactory.conversation(
    'askAboutTower',
    'Learning About the Tower',
    'The villagers speak in hushed tones about the dragon\'s tower and the curse that binds the creature within.',
    [
      { text: 'Ask how to break the curse', nextScene: 'learnCurseBreaking' },
      { text: 'Request guidance for approaching the tower', nextScene: 'getTowerGuidance' },
      { text: 'Offer to face the dragon', nextScene: 'acceptQuest' }
    ],
    { experience: 20, diplomacy: 1, flags: { curseKnowledge: true } }
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
      onEnter: createStateUpdate(stateUpdates.villageInteraction())
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

  villageMarket: SceneFactory.exploration(
    'villageMarket',
    'The Village Market',
    'You explore the market, learning about local trade and the curse\'s impact.',
    [
      { name: 'buy supplies', sceneId: 'buySupplies' },
      { name: 'talk to merchants', sceneId: 'merchantChat' },
      { name: 'investigate empty stalls', sceneId: 'emptyStalls' }
    ],
    stateUpdates.villageInteraction()
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

  buySupplies: SceneFactory.interaction(
    'buySupplies',
    'Village Market - Buying Supplies',
    'You browse the market stalls, looking for useful items for your quest.',
    [
      { text: 'Buy healing potions (50 gold)', nextScene: 'buyPotions' },
      { text: 'Purchase camping gear (30 gold)', nextScene: 'buyCampingGear' },
      { text: 'Look for magical items', nextScene: 'browseMagicItems' },
      { text: 'Just browse and leave', nextScene: 'villageMarket' }
    ]
  ),

  merchantChat: SceneFactory.conversation(
    'merchantChat',
    'Chatting with Merchants',
    'You speak with various merchants about trade, the dragon, and life in the village.',
    [
      { text: 'Ask about rare items they\'ve seen', nextScene: 'hearRareItems' },
      { text: 'Inquire about trade routes', nextScene: 'learnTradeRoutes' },
      { text: 'Share tales of your adventures', nextScene: 'shareTales' }
    ],
    { experience: 15, diplomacy: 1, gold: 10 }
  ),

  restAtInn: SceneFactory.scene(
    'restAtInn',
    'Resting at the Inn',
    'You rest at the village inn, recovering your strength and hearing local gossip.',
    [
      SceneFactory.basic('Listen to more stories', 'travelerTales'),
      SceneFactory.basic('Ask the innkeeper about the tower', 'askAboutTower'),
      SceneFactory.basic('Rest and prepare for tomorrow', 'start')
    ],
    {
      onEnter: createStateUpdate({ 
        health: 30, 
        magic: 20, 
        experience: 15,
        flags: { wellRested: true }
      })
    }
  )
};
