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

export const additionalVillageScenes: Record<string, Scene> = {
  talkVillagers: SceneFactory.conversation(
    'talkVillagers',
    'Speaking with the Villagers',
    'You approach a group of villagers who seem willing to share their concerns and local knowledge.',
    [
      { text: 'Ask about their daily struggles', nextScene: 'learnStruggles' },
      { text: 'Inquire about the dragon\'s impact', nextScene: 'dragonImpact' },
      { text: 'Offer encouragement and hope', nextScene: 'offerHope' },
      { text: 'Ask if you can help with anything', nextScene: 'helpVillage' }
    ],
    { experience: 20, diplomacy: 2, flags: { talkedToVillagers: true } }
  ),

  helpVillage: SceneFactory.interaction(
    'helpVillage',
    'Helping the Village',
    'You offer your assistance to the villagers, who are grateful for any help they can get.',
    [
      { text: 'Help repair damaged buildings', nextScene: 'repairBuildings' },
      { text: 'Assist with farming tasks', nextScene: 'helpFarming' },
      { text: 'Provide protection from bandits', nextScene: 'protectVillage' },
      { text: 'Share your knowledge and skills', nextScene: 'teachSkills' }
    ],
    { experience: 25, diplomacy: 2, gold: 20, flags: { helpedVillage: true } }
  ),

  learnCurseBreaking: SceneFactory.conversation(
    'learnCurseBreaking',
    'Learning to Break Curses',
    'The elder shares ancient knowledge about breaking powerful curses through understanding and compassion.',
    [
      { text: 'Ask about the ritual requirements', nextScene: 'ritualRequirements' },
      { text: 'Learn about the curse\'s weaknesses', nextScene: 'curseWeaknesses' },
      { text: 'Request training in curse-breaking', nextScene: 'curseTraining' }
    ],
    { experience: 35, magic_skill: 2, flags: { knowsCurseBreaking: true } }
  ),

  getGuidance: SceneFactory.conversation(
    'getGuidance',
    'Seeking Guidance',
    'The elder provides wise counsel for your dangerous quest ahead.',
    [
      { text: 'Ask about approaching the dragon safely', nextScene: 'dragonApproachAdvice' },
      { text: 'Learn about the tower\'s dangers', nextScene: 'towerDangers' },
      { text: 'Request a blessing for protection', nextScene: 'receiveBlessing' }
    ],
    { experience: 25, diplomacy: 1, magic: 15, flags: { receivedGuidance: true } }
  ),

  getTowerGuidance: SceneFactory.conversation(
    'getTowerGuidance',
    'Tower Guidance',
    'The villagers share what they know about safely approaching and entering the dragon\'s tower.',
    [
      { text: 'Learn about the tower\'s defenses', nextScene: 'towerDefenses' },
      { text: 'Ask about previous adventurers', nextScene: 'previousAdventurers' },
      { text: 'Get advice on timing your approach', nextScene: 'approachTiming' }
    ],
    { experience: 20, stealth: 1, flags: { towerKnowledge: true } }
  ),

  emptyStalls: SceneFactory.interaction(
    'emptyStalls',
    'Investigating Empty Stalls',
    'You examine the abandoned market stalls, finding clues about the village\'s economic struggles.',
    [
      { text: 'Search for abandoned goods', nextScene: 'findAbandonedGoods' },
      { text: 'Look for signs of what happened', nextScene: 'investigateDisappearance' },
      { text: 'Ask nearby merchants', nextScene: 'askAboutEmptyStalls' }
    ],
    { experience: 15, stealth: 1, flags: { investigatedStalls: true } }
  ),

  travelerTales: SceneFactory.conversation(
    'travelerTales',
    'Tales from Travelers',
    'You listen to fascinating stories from travelers who have journeyed from distant lands.',
    [
      { text: 'Hear tales of other dragons', nextScene: 'otherDragonTales' },
      { text: 'Learn about magical artifacts', nextScene: 'artifactTales' },
      { text: 'Share your own adventures', nextScene: 'shareYourTales' },
      { text: 'Ask about safe travel routes', nextScene: 'travelRoutes' }
    ],
    { experience: 30, diplomacy: 2, magic_skill: 1, flags: { heardTravelerTales: true } }
  ),

  buyPotions: SceneFactory.scene(
    'buyPotions',
    'Purchasing Healing Potions',
    () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../../../gameState.js');
      const state = get(gameStore);
      if (state.gold >= 50) {
        return 'You purchase high-quality healing potions from the merchant. These will serve you well on your quest.';
      } else {
        return 'You don\'t have enough gold for the healing potions. The merchant sympathetically offers you a smaller, basic potion for free.';
      }
    },
    [
      SceneFactory.gold('Buy premium potions (50 gold)', 'buyPremiumPotions', 50),
      SceneFactory.basic('Take the free basic potion', 'acceptFreePotion'),
      SceneFactory.basic('Thank them and look elsewhere', 'villageMarket')
    ]
  ),

  buyCampingGear: SceneFactory.scene(
    'buyCampingGear',
    'Purchasing Camping Gear',
    () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../../../gameState.js');
      const state = get(gameStore);
      if (state.gold >= 30) {
        return 'You buy excellent camping gear that will help you rest better during your journey.';
      } else {
        return 'You lack the gold for proper camping gear, but the merchant offers some basic supplies at a discount.';
      }
    },
    [
      SceneFactory.gold('Buy quality gear (30 gold)', 'buyQualityGear', 30),
      SceneFactory.basic('Accept discounted basic gear', 'acceptBasicGear'),
      SceneFactory.basic('Browse other items', 'villageMarket')
    ]
  ),

  browseMagicItems: SceneFactory.interaction(
    'browseMagicItems',
    'Magical Items Shop',
    'You browse the merchant\'s collection of magical items, some of which pulse with mysterious energy.',
    [
      { text: 'Examine a glowing amulet', nextScene: 'examineAmulet' },
      { text: 'Look at ancient scrolls', nextScene: 'examineScrolls' },
      { text: 'Ask about powerful artifacts', nextScene: 'askArtifacts' },
      { text: 'Inquire about prices', nextScene: 'magicItemPrices' }
    ],
    { experience: 20, magic_skill: 1 }
  ),

  hearRareItems: SceneFactory.conversation(
    'hearRareItems',
    'Tales of Rare Items',
    'The merchants tell you about legendary items they\'ve heard of or glimpsed in their travels.',
    [
      { text: 'Ask about the Blade of Transformation', nextScene: 'bladeOfTransformation' },
      { text: 'Inquire about healing artifacts', nextScene: 'healingArtifacts' },
      { text: 'Learn about protective charms', nextScene: 'protectiveCharms' }
    ],
    { experience: 25, magic_skill: 1, flags: { knowsRareItems: true } }
  ),

  learnTradeRoutes: SceneFactory.conversation(
    'learnTradeRoutes',
    'Understanding Trade Routes',
    'You learn about the various trade routes and how the dragon\'s presence has affected commerce.',
    [
      { text: 'Ask about safe passages', nextScene: 'safePaths' },
      { text: 'Learn about abandoned routes', nextScene: 'abandonedRoutes' },
      { text: 'Inquire about trade opportunities', nextScene: 'tradeOpportunities' }
    ],
    { experience: 20, diplomacy: 1, gold: 15, flags: { knowsTradeRoutes: true } }
  ),

  shareTales: SceneFactory.conversation(
    'shareTales',
    'Sharing Your Adventures',
    'You regale the merchants with tales of your adventures, earning their respect and friendship.',
    [
      { text: 'Tell of your bravest moment', nextScene: 'braveryTale' },
      { text: 'Share wisdom you\'ve gained', nextScene: 'shareWisdom' },
      { text: 'Describe the strangest thing you\'ve seen', nextScene: 'strangeTale' }
    ],
    { experience: 30, diplomacy: 3, gold: 25, flags: { sharedTales: true } }
  )
};
