// src/lib/gameData.ts
import type { Item, Scene } from './types.js';
import { version2Scenes } from './version2Scenes.js';

export const items: Record<string, Item> = {
	ironKey: { id: 'ironKey', name: 'Iron Key', description: 'A heavy iron key with strange symbols' },
	ancientSword: { id: 'ancientSword', name: 'Ancient Sword', description: 'A magical sword that glows with power' },
	healingPotion: { id: 'healingPotion', name: 'Healing Potion', description: 'Restores 50 health', usable: true },
	magicPotion: { id: 'magicPotion', name: 'Magic Potion', description: 'Restores 30 magic', usable: true },
	spellbook: { id: 'spellbook', name: 'Spellbook of Elements', description: 'Contains powerful fire and ice spells' },
	treasureMap: { id: 'treasureMap', name: 'Treasure Map', description: 'Shows the location of hidden treasure' },
	goldCoin: { id: 'goldCoin', name: 'Gold Coins', description: 'Shiny gold coins', value: 1 },
	dragonScale: { id: 'dragonScale', name: 'Dragon Scale', description: 'A scale from the ancient dragon' },
	wizardStaff: { id: 'wizardStaff', name: 'Wizard Staff', description: 'Increases magical power' }
};

const updateStats = (updates: any) => () => {
	const { gameStore } = require('./gameState.js');
	gameStore.update((state: any) => ({ ...state, ...updates }));
};

const addItems = (...itemIds: string[]) => () => {
	const { gameStore } = require('./gameState.js');
	gameStore.update((state: any) => ({
		...state, inventory: [...state.inventory, ...itemIds.map(id => items[id])]
	}));
};

const combineUpdates = (...updates: (() => void)[]) => () => updates.forEach(update => update());

const basicChoice = (text: string, nextScene: string) => ({ text, nextScene });
const conditionalChoice = (text: string, nextScene: string, condition: () => boolean) => ({ text, nextScene, condition });
const skillChoice = (text: string, nextScene: string, skill: string, level: number) => ({ text, nextScene, skillRequirement: { skill, level } });

const goldChoice = (text: string, nextScene: string, cost: number) => conditionalChoice(text, nextScene, () => {
	const { get } = require('svelte/store');
	const { gameStore } = require('./gameState.js');
	return get(gameStore).gold >= cost;
});

const createScene = (id: string, title: string, description: string | (() => string), choices: any[], onEnter?: () => void) => ({
	id, title, description, choices, ...(onEnter && { onEnter })
});

const createExplorationScene = (id: string, title: string, description: string, destinations: string[]) => 
	createScene(id, title, description, [
		...destinations.map(dest => basicChoice(`Go to ${dest}`, dest.toLowerCase().replace(/\s+/g, ''))),
		basicChoice('Return to crossroads', 'start')
	]);

const createVictoryScene = (id: string, title: string, description: string, exp: number, levelUp = 0) =>
	createScene(id, title, description, [
		basicChoice('Celebrate with Aethonaris', 'celebrateWithDragon'),
		basicChoice('Return as hero', 'ultimateHeroReturn'),
		basicChoice('Learn from experience', 'dragonMentor')
	], () => {
		const { get } = require('svelte/store');
		const { gameStore } = require('./gameState.js');
		const currentState = get(gameStore);
		gameStore.update((state: any) => ({ 
			...state, 
			dragonDefeated: true, 
			experience: state.experience + exp, 
			level: state.level + levelUp 
		}));
	});

const coreScenes: Record<string, Scene> = {
	start: createScene('start', 'The Crossroads of Destiny',
		'You stand at a crossroads where three paths diverge. To the north lies a mysterious forest shrouded in mist. To the east, you can see smoke rising from what appears to be a small village. To the west, an ancient stone bridge spans a rushing river, leading to unknown lands.',
		[
			basicChoice('Take the northern path into the mysterious forest', 'mysteriousForest'),
			basicChoice('Head east toward the village', 'approachVillage'),
			basicChoice('Cross the stone bridge to the west', 'stoneBridge'),
			basicChoice('Rest and examine your surroundings more carefully', 'examineArea')
		]
	),

	climbTower: {
		id: 'climbTower', title: 'The Dragon\'s Lair',
		description: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.curseKnowledge && state.hasSword) return 'You reach the top of the tower and behold Aethonaris - the great dragon whose scales shimmer between gold and deep sorrow. His ancient eyes meet yours with a mixture of hope and despair. "You carry the Blade of Transformation," he says. "Do you come to end my suffering, or to grant me redemption?"';
			if (state.hasSword) return 'You reach the top of the tower and find yourself face to face with a massive dragon. His scales are magnificent but his eyes burn with anguish. He sees the ancient sword in your hand and speaks: "Another hero comes to slay the monster. Very well. Let us end this."';
			if (state.curseKnowledge) return 'You reach the top and see the great dragon Aethonaris. Without a proper weapon, you feel vulnerable, but your knowledge of his true nature gives you confidence. "You know my story," he says wonderingly. "Few have understood the truth."';
			return 'You reach the top of the tower and find yourself face to face with a massive red dragon. His eyes burn like embers and smoke billows from his nostrils. Without preparation, you feel completely overwhelmed by this magnificent and terrifying creature.';
		},
		choices: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.hasSword && state.curseKnowledge) return [
				basicChoice('Offer to break the curse and restore his true form', 'breakCurse'),
				basicChoice('Fight the dragon to end his suffering', 'fightDragon'),
				basicChoice('Try to find a middle path', 'findBalance')
			];
			if (state.hasSword) return [
				basicChoice('Attack the dragon with the ancient sword', 'fightDragon'),
				basicChoice('Try to communicate before fighting', 'talkDragon')
			];
			if (state.curseKnowledge) return [
				basicChoice('Speak about breaking the curse', 'discussCurse'),
				basicChoice('Try to comfort the dragon', 'comfortDragon')
			];
			return [
				basicChoice('Try to communicate with the dragon', 'talkDragonNoSword'),
				basicChoice('Run back down the stairs immediately', 'unlockTower')
			];
		}
	},

	cottage: {
		id: 'cottage', title: 'The Hermit\'s Cottage',
		description: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).hasKey ? 
				'The cottage is old and weathered, with ivy covering most of its stone walls. You\'ve already explored inside and taken what you needed.' :
				'The cottage is old and weathered, with ivy covering most of its stone walls. The wooden door hangs slightly ajar, creaking softly in the breeze.';
		},
		choices: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).hasKey ? [
				basicChoice('Search around the outside more thoroughly', 'cottageSide'),
				basicChoice('Head deeper into the forest', 'deepForest'),
				basicChoice('Return to the crossroads', 'start')
			] : [
				basicChoice('Enter the cottage', 'insideCottage'),
				basicChoice('Look around the outside of the cottage', 'cottageSide'),
				basicChoice('Return to the forest edge', 'mysteriousForest')
			];
		}
	},

	approachVillage: {
		id: 'approachVillage', title: 'The Troubled Village',
		description: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).villageVisited ? 
				'You return to the village. The people still look worried, but some recognize you now.' :
				'As you approach the village, you notice something is wrong. The crops in the fields are withered, people move listlessly through the streets, and an air of despair hangs over everything.';
		},
		choices: [
			basicChoice('Talk to the village elder', 'villageElder'),
			basicChoice('Visit the village market', 'villageMarket'),
			basicChoice('Investigate the withered crops', 'witheredCrops'),
			basicChoice('Look for the village inn', 'villageInn'),
			basicChoice('Leave the village', 'start')
		]
	},

	stoneBridge: {
		id: 'stoneBridge', title: 'The Ancient Stone Bridge',
		description: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).bridgeRepaired ? 
				'The bridge stands strong once again, its stones properly aligned and secure. You can safely cross to the wizard\'s domain.' :
				'The ancient stone bridge spans a rushing river, but you can see that several stones have fallen into the water below.';
		},
		choices: () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			return get(gameStore).bridgeRepaired ? [
				basicChoice('Cross the bridge to the wizard\'s tower', 'wizardTower'),
				basicChoice('Return to explore other areas', 'start')
			] : [
				basicChoice('Attempt to repair the bridge', 'repairBridge'),
				basicChoice('Try to cross the damaged bridge anyway', 'crossDamaged'),
				basicChoice('Look for another way across', 'findCrossing'),
				basicChoice('Return to the crossroads', 'start')
			];
		}
	},

	breakCurse: createScene('breakCurse', 'The Ritual of Redemption',
		'With the Blade of Transformation and your knowledge of the curse\'s true nature, you work together with Aethonaris to perform an ancient ritual. The sword glows with transformative light as you channel magic not to destroy, but to heal.',
		[
			basicChoice('Complete the transformation ritual', 'trueVictory'),
			basicChoice('Witness the dragon\'s redemption', 'dragonRedeemed')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({ 
				...state, 
				dragonDefeated: true, 
				experience: state.experience + 100, 
				magic_skill: state.magic_skill + 3, 
				diplomacy: state.diplomacy + 3 
			}));
		}
	),

	trueVictory: createVictoryScene('trueVictory', 'The Hero\'s True Victory',
		'The ritual is complete. Where once stood a cursed dragon, now stands Aethonaris in his true form - a wise guardian spirit of the land.',
		150, 2
	),

	perfectVictory: createVictoryScene('perfectVictory', 'The Perfect Redemption', 
		'The curse is completely broken. Where once stood a tormented dragon, now stands Aethonaris in his true form - a magnificent golden dragon whose very presence radiates peace and wisdom.',
		200, 1
	),

	ultimateVictory: createVictoryScene('ultimateVictory', 'The Ultimate Triumph',
		'You have achieved the most perfect victory possible. Aethonaris is not just restored but elevated, becoming a being of pure light and love.',
		500, 5
	)
};

const generateSequence = (prefix: string, sequences: { id: string, title: string, desc: string, nextScenes: string[] }[]) =>
	Object.fromEntries(sequences.map(seq => [
		seq.id,
		createScene(seq.id, seq.title, seq.desc, [
			...seq.nextScenes.map(next => basicChoice(`Continue to ${next}`, next)),
			basicChoice('Return to start', 'start')
		], () => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({ ...state, experience: state.experience + 15 }));
		})
	]));

const generatedScenes = {
	...generateSequence('shrine', [
		{ id: 'hiddenShrine', title: 'The Wayside Shrine', desc: 'The small shrine is dedicated to Aethon, the god of travelers.', nextScenes: ['shrinePrayer', 'shrineParchment'] },
		{ id: 'shrinePrayer', title: 'A Moment of Reflection', desc: 'You kneel before the shrine and offer a sincere prayer.', nextScenes: ['shrineOffering', 'shrineParchment'] },
		{ id: 'shrineOffering', title: 'Divine Blessing', desc: 'You place gold coins in the offering bowl.', nextScenes: ['shrineParchment'] },
		{ id: 'shrineParchment', title: 'Traveler\'s Warning', desc: 'The parchment contains a warning about the dragon\'s curse.', nextScenes: ['approachVillage', 'mysteriousForest'] }
	]),

	...generateSequence('forest', [
		{ id: 'mysteriousForest', title: 'Edge of the Mysterious Forest', desc: 'The forest looms before you, ancient and mysterious.', nextScenes: ['deepForest', 'cottage'] },
		{ id: 'deepForest', title: 'Deep in the Ancient Forest', desc: 'The path leads deeper where trees grow dense.', nextScenes: ['waterfall', 'tower'] },
		{ id: 'waterfall', title: 'The Mystical Waterfall', desc: 'A magnificent waterfall cascades down rocky cliffs.', nextScenes: ['cave'] },
		{ id: 'cave', title: 'The Sacred Cave', desc: 'Behind the waterfall lies a cave filled with ancient magic.', nextScenes: ['findSword', 'caveDrawings'] }
	]),

	...generateSequence('village', [
		{ id: 'villageElder', title: 'The Wise Elder', desc: 'The village elder greets you with weary hope.', nextScenes: ['offerHelp', 'askDragon'] },
		{ id: 'villageMarket', title: 'The Struggling Market', desc: 'The village market is barely functioning.', nextScenes: ['buySupplies', 'marketGossip'] },
		{ id: 'villageInn', title: 'The Weary Traveler Inn', desc: 'The village inn is nearly empty but welcoming.', nextScenes: ['restInn', 'innGossip'] }
	]),

	...generateSequence('dragon', [
		{ id: 'talkDragon', title: 'Attempting Communication', desc: 'You attempt to speak with the dragon before fighting.', nextScenes: ['askAboutPain', 'offerHelp'] },
		{ id: 'comfortDragon', title: 'Offering Comfort', desc: 'You offer words of comfort to the suffering dragon.', nextScenes: ['promiseHelp', 'askHowToHeal'] },
		{ id: 'discussCurse', title: 'Understanding the Curse', desc: 'You speak knowledgeably about the curse affecting Aethonaris.', nextScenes: ['askCureMethod', 'showCompassion'] }
	])
};

import { addGeneratedScenes } from './sceneGenerators.js';

export const scenes: Record<string, Scene> = {
    ...coreScenes,
    ...generatedScenes,
    ...version2Scenes
};
