// src/lib/data/missingScenes.ts
import type { Scene } from '../core/types.js';
import { SceneFactory } from '../core/sceneFactory.js';

const inlineUpdates = {
	villageInteraction: () => ({ 
		experience: 15, 
		diplomacy: 1, 
		flags: { villageVisited: true } 
	}),
	basicExploration: () => ({ experience: 15 }),
	dragonInteraction: () => ({ 
		experience: 25, 
		diplomacy: 2, 
		flags: { curseKnowledge: true } 
	})
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
		inlineUpdates.villageInteraction()
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
		inlineUpdates.dragonInteraction()
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
	)
};

export const towerScenes: Record<string, Scene> = {
	tower: SceneFactory.exploration(
		'tower',
		'The Dragon\'s Tower',
		'Before you looms the ancient tower, its dark stones reaching toward the sky. You can sense powerful magic within.',
		[
			{ name: 'the tower entrance', sceneId: 'towerEntrance' },
			{ name: 'around the tower base', sceneId: 'towerBase' },
			{ name: 'the locked door', sceneId: 'unlockTower' }
		]
	),

	unlockTower: SceneFactory.interaction(
		'unlockTower',
		'The Tower Door',
		'You examine the massive door blocking entrance to the tower. It requires a key or great skill to open.',
		[
			{ text: 'Use the iron key', nextScene: 'openWithKey', 
			  requirement: () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('../gameState.js');
				return get(gameStore).hasKey;
			  }},
			{ text: 'Pick the lock', nextScene: 'pickLock' },
			{ text: 'Try to force the door', nextScene: 'forceDoor' },
			{ text: 'Climb the tower exterior', nextScene: 'climbTower' }
		]
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
	)
};

export const endingScenes: Record<string, Scene> = {
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

export const missingScenes: Record<string, Scene> = {
	...explorationScenes,
	...villageScenes,
	...dragonScenes,
	...towerScenes,
	...endingScenes,

	findCache: SceneFactory.scene(
		'findCache',
		'Hidden Cache',
		'You discover a hidden cache containing useful items.',
		[SceneFactory.basic('Take the items and continue', 'start')],
		{ 
			category: 'exploration',
			onEnter: () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate({ 
					items: ['healingPotion', 'goldCoin'], 
					experience: 20 
				});
			}
		}
	),

	getSupplies: SceneFactory.scene(
		'getSupplies',
		'Getting Supplies', 
		'The elder provides you with essential supplies for your quest.',
		[SceneFactory.basic('Thank them and continue', 'start')],
		{
			onEnter: () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate({ 
					items: ['healingPotion', 'ironKey'], 
					experience: 15,
					diplomacy: 1
				});
			}
		}
	),

	offerHelp: SceneFactory.scene(
		'offerHelp',
		'Offering Help',
		'You offer your services to help the village. They are grateful for your assistance.',
		[SceneFactory.basic('Continue your quest', 'start')],
		{
			onEnter: () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate(inlineUpdates.villageInteraction());
			}
		}
	)
};
