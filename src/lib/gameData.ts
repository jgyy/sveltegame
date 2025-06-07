// src/lib/gameData.ts
import type { Item, Scene } from './types.js';
import { items } from './data/items.js';
import { version2Scenes } from './version2Scenes.js';
import { 
	basicChoice, 
	conditionalChoice, 
	skillChoice, 
	goldChoice,
	itemRequiredChoice,
	flagRequiredChoice,
	multiRequirementChoice,
	createScene, 
	createExplorationScene, 
	createInteractionScene,
	createVictoryScene,
	createConversationScene,
	createTrainingScene,
	createSceneSet
} from './utils/sceneHelpers.js';
import { commonUpdates, applyStateUpdate } from './gameState.js';

const coreScenes: Record<string, Scene> = {
	start: createExplorationScene('start', 'The Crossroads of Destiny',
		'You stand at a crossroads where three paths diverge. To the north lies a mysterious forest shrouded in mist. To the east, you can see smoke rising from what appears to be a small village. To the west, an ancient stone bridge spans a rushing river, leading to unknown lands.',
		[
			{ name: 'the mysterious forest', sceneId: 'mysteriousForest' },
			{ name: 'the village', sceneId: 'approachVillage' },
			{ name: 'the stone bridge', sceneId: 'stoneBridge' },
			{ name: 'examine the area more carefully', sceneId: 'examineArea' }
		]
	),

	climbTower: createConversationScene('climbTower', 'The Dragon\'s Lair',
		'You reach the top of the tower and behold Aethonaris - the great dragon whose scales shimmer between gold and deep sorrow.',
		[
			{ 
				text: 'Offer to break the curse and restore his true form', 
				nextScene: 'breakCurse',
				requirement: () => {
					const { get } = require('svelte/store');
					const { gameStore } = require('./gameState.js');
					const state = get(gameStore);
					return state.hasSword && state.curseKnowledge;
				}
			},
			{ 
				text: 'Fight the dragon to end his suffering', 
				nextScene: 'fightDragon',
				requirement: () => {
					const { get } = require('svelte/store');
					const { gameStore } = require('./gameState.js');
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
		]
	),

	cottage: createInteractionScene('cottage', 'The Hermit\'s Cottage',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).hasKey ? 
				'The cottage is old and weathered, with ivy covering most of its stone walls. You\'ve already explored inside and taken what you needed.' :
				'The cottage is old and weathered, with ivy covering most of its stone walls. The wooden door hangs slightly ajar, creaking softly in the breeze.';
		},
		[
			{ text: 'Enter the cottage', nextScene: 'insideCottage' },
			{ text: 'Look around the outside', nextScene: 'cottageSide' },
			{ text: 'Return to the forest', nextScene: 'mysteriousForest' }
		]
	),

	breakCurse: createVictoryScene('breakCurse', 'The Ritual of Redemption',
		'With the Blade of Transformation and your knowledge of the curse\'s true nature, you work together with Aethonaris to perform an ancient ritual. The sword glows with transformative light as you channel magic not to destroy, but to heal.',
		'ultimate'
	)
};

const generatedScenes = createSceneSet([
	{
		id: 'approachVillage',
		title: 'The Troubled Village',
		description: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).villageVisited ? 
				'You return to the village. The people still look worried, but some recognize you now.' :
				'As you approach the village, you notice something is wrong. The crops in the fields are withered, people move listlessly through the streets, and an air of despair hangs over everything.';
		},
		type: 'interaction',
		config: {
			interactions: [
				{ text: 'Talk to the village elder', nextScene: 'villageElder' },
				{ text: 'Visit the village market', nextScene: 'villageMarket' },
				{ text: 'Investigate the withered crops', nextScene: 'witheredCrops' },
				{ text: 'Look for the village inn', nextScene: 'villageInn' }
			],
			reward: commonUpdates.villageInteraction()
		}
	},

	{
		id: 'stoneBridge',
		title: 'The Ancient Stone Bridge',
		description: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).bridgeRepaired ? 
				'The bridge stands strong once again, its stones properly aligned and secure. You can safely cross to the wizard\'s domain.' :
				'The ancient stone bridge spans a rushing river, but you can see that several stones have fallen into the water below.';
		},
		type: 'interaction',
		config: {
			interactions: [
				{ text: 'Cross the bridge to the wizard\'s tower', nextScene: 'wizardTower' },
				{ text: 'Attempt to repair the bridge', nextScene: 'repairBridge' },
				{ text: 'Try to cross the damaged bridge anyway', nextScene: 'crossDamaged' },
				{ text: 'Look for another way across', nextScene: 'findCrossing' }
			],
			reward: commonUpdates.basicExploration()
		}
	},

	{
		id: 'mysteriousForest',
		title: 'Edge of the Mysterious Forest',
		description: 'The forest looms before you, ancient and mysterious. Tall trees create a natural cathedral, and you can hear the sound of flowing water somewhere in the distance.',
		type: 'exploration',
		config: {
			destinations: [
				{ name: 'deeper into the forest', sceneId: 'deepForest' },
				{ name: 'the hermit\'s cottage', sceneId: 'cottage' },
				{ name: 'investigate the sound of water', sceneId: 'waterfall' }
			]
		}
	},

	{
		id: 'practiceSkills',
		title: 'Honing Your Abilities',
		description: 'You take time to practice your skills, honing your abilities through careful training and meditation.',
		type: 'training',
		config: {
			skill: 'combat',
			nextScenes: ['tower', 'approachVillage', 'mysteriousForest']
		}
	},

	{
		id: 'talkDragon',
		title: 'Attempting Communication',
		description: 'You attempt to speak with the dragon, sensing there\'s more to this creature than meets the eye.',
		type: 'conversation',
		config: {
			responses: [
				{ text: 'Ask about the pain you sense', nextScene: 'askAboutPain' },
				{ text: 'Offer to help break the curse', nextScene: 'offerHelp' },
				{ text: 'Try to understand their true nature', nextScene: 'askTrueNature' },
				{ text: 'Show compassion for their suffering', nextScene: 'showCompassion' }
			],
			reward: commonUpdates.dragonInteraction()
		}
	}
]);

const sequenceScenes = {
	trueVictory: createVictoryScene('trueVictory', 'The Hero\'s True Victory',
		'The ritual is complete. Where once stood a cursed dragon, now stands Aethonaris in his true form - a wise guardian spirit of the land.',
		'major'
	),

	perfectVictory: createVictoryScene('perfectVictory', 'The Perfect Redemption', 
		'The curse is completely broken. Where once stood a tormented dragon, now stands Aethonaris in his true form - a magnificent golden dragon whose very presence radiates peace and wisdom.',
		'ultimate'
	),

	dragonMentor: createTrainingScene('dragonMentor', 'Wisdom of the Ages',
		'Aethonaris becomes your mentor, teaching you ancient secrets of magic, wisdom, and the delicate balance between all living things.',
		'magic_skill',
		['advancedLearning', 'guardianTraining', 'transformationMagic']
	),

	findSword: createScene('findSword', 'The Blade of Transformation',
		'Deep within the sacred cave, you discover an ancient sword embedded in a crystal formation. As your hand touches the hilt, the blade begins to glow with a soft, transformative light.',
		[
			basicChoice('Take the sword and feel its power', 'claimSword'),
			basicChoice('Study the sword\'s magical properties', 'studySword'),
			basicChoice('Meditate on its purpose before claiming it', 'swordMeditation')
		],
		() => applyStateUpdate({
			flags: { hasSword: true },
			items: ['ancientSword'],
			experience: 50,
			combat: 2,
			magic_skill: 2
		})
	)
};

export { items };
export const scenes: Record<string, Scene> = {
    ...coreScenes,
    ...generatedScenes,
    ...sequenceScenes,
    ...version2Scenes
};
