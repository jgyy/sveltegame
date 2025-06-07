// src/lib/data/completeMissingScenes.ts
import type { Scene } from '../core/types.js';
import { SceneFactory } from '../core/sceneFactory.js';

const createStateUpdate = (update: any) => () => {
	const { applyStateUpdate } = require('../gameState.js');
	applyStateUpdate(update);
};

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

	pickLock: SceneFactory.scene(
		'pickLock',
		'Lockpicking Attempt',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('../gameState.js');
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
			const { gameStore } = require('../gameState.js');
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
	)
};

export const villageScenes: Record<string, Scene> = {
	getTowerGuidance: SceneFactory.conversation(
		'getTowerGuidance',
		'Seeking Tower Guidance',
		'The villagers share what they know about approaching the dragon\'s tower safely.',
		[
			{ text: 'Ask about the tower\'s defenses', nextScene: 'learnTowerDefenses' },
			{ text: 'Request supplies for the journey', nextScene: 'getSupplies' },
			{ text: 'Thank them and prepare to leave', nextScene: 'start' }
		],
		{ experience: 20, diplomacy: 1, flags: { villageVisited: true } }
	),

	learnTowerDefenses: SceneFactory.scene(
		'learnTowerDefenses',
		'Tower Knowledge',
		'The villagers tell you about magical wards and the dragon\'s keen senses. This knowledge will help you approach more safely.',
		[SceneFactory.basic('Use this knowledge wisely', 'start')],
		{
			onEnter: createStateUpdate({ experience: 30, stealth: 1, flags: { towerKnowledge: true } })
		}
	),

	offerToHelp: SceneFactory.conversation(
		'offerToHelp',
		'Offering Assistance',
		'You offer to help the village with their problems caused by the dragon\'s curse.',
		[
			{ text: 'Help repair damaged buildings', nextScene: 'repairBuildings' },
			{ text: 'Assist with farming and food', nextScene: 'helpFarming' },
			{ text: 'Offer to face the dragon', nextScene: 'acceptQuest' }
		],
		{ experience: 15, diplomacy: 1 }
	),

	repairBuildings: SceneFactory.scene(
		'repairBuildings',
		'Village Repairs',
		'You spend time helping repair buildings damaged by the dragon\'s occasional rampages. The villagers are grateful for your assistance.',
		[SceneFactory.basic('Continue helping the village', 'start')],
		{
			onEnter: createStateUpdate({ 
				experience: 25, 
				gold: 20, 
				diplomacy: 2, 
				flags: { villageHelper: true } 
			})
		}
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

	buyPotions: SceneFactory.scene(
		'buyPotions',
		'Purchasing Healing Potions',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('../gameState.js');
			const state = get(gameStore);
			if (state.gold >= 50) {
				return 'You purchase several healing potions from the village healer. These will be invaluable on your quest.';
			} else {
				return 'You don\'t have enough gold for the healing potions. The merchant suggests you come back when you have 50 gold.';
			}
		},
		[
			SceneFactory.gold('Buy the potions', 'potionsPurchased', 50),
			SceneFactory.basic('Look at other items', 'buySupplies'),
			SceneFactory.basic('Leave the market', 'villageMarket')
		]
	),

	potionsPurchased: SceneFactory.scene(
		'potionsPurchased',
		'Potions Acquired',
		'You successfully purchase the healing potions. The merchant throws in an extra magic potion for good luck.',
		[SceneFactory.basic('Return to browsing', 'buySupplies')],
		{
			onEnter: createStateUpdate({ 
				items: ['healingPotion', 'healingPotion', 'magicPotion'],
				gold: -50,
				experience: 10
			})
		}
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

	emptyStalls: SceneFactory.exploration(
		'emptyStalls',
		'Abandoned Market Stalls',
		'You investigate the empty stalls, remnants of merchants who fled when the dragon\'s curse intensified.',
		[
			{ name: 'search for left-behind items', sceneId: 'searchStalls' },
			{ name: 'examine the damage', sceneId: 'examineDamage' },
			{ name: 'ask villagers about the merchants', sceneId: 'askAboutMerchants' }
		]
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
	),

	travelerTales: SceneFactory.conversation(
		'travelerTales',
		'Tales from Travelers',
		'You listen to stories from travelers who have passed through the region.',
		[
			{ text: 'Ask about other dragons they\'ve encountered', nextScene: 'dragonTales' },
			{ text: 'Inquire about magical artifacts', nextScene: 'artifactTales' },
			{ text: 'Share your own story', nextScene: 'shareYourStory' }
		],
		{ experience: 20, diplomacy: 1 }
	)
};

export const dragonInteractionScenes: Record<string, Scene> = {
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
	)
};

export const explorationScenes: Record<string, Scene> = {
	ancientGrove: SceneFactory.exploration(
		'ancientGrove',
		'The Ancient Grove',
		'You discover a grove of impossibly old trees, their branches intertwining to form natural arches. Mystical energy pulses through the air.',
		[
			{ name: 'the heartwood shrine', sceneId: 'heartwoodShrine' },
			{ name: 'the singing springs', sceneId: 'singingsprings' },
			{ name: 'the elder tree', sceneId: 'elderTree' }
		],
		{ experience: 25, magic_skill: 1 }
	),

	heartwoodShrine: SceneFactory.scene(
		'heartwoodShrine',
		'The Heartwood Shrine',
		'At the center of the grove stands a shrine carved from living wood. Ancient spirits seem to whisper blessings.',
		[SceneFactory.basic('Pray at the shrine', 'prayAtShrine')],
		{
			onEnter: createStateUpdate({ magic: 25, magic_skill: 2, experience: 30 })
		}
	),

	hiddenClearing: SceneFactory.exploration(
		'hiddenClearing',
		'Hidden Clearing',
		'You push through thick undergrowth to find a secret clearing where magical herbs grow wild.',
		[
			{ name: 'rare magical herbs', sceneId: 'gatherHerbs' },
			{ name: 'a mysterious circle of stones', sceneId: 'stoneCircle' },
			{ name: 'tracks of magical creatures', sceneId: 'followTracks' }
		]
	),

	bridgeOtherSide: SceneFactory.exploration(
		'bridgeOtherSide',
		'Beyond the Bridge',
		'Having crossed the ancient bridge, you find yourself in unfamiliar territory with new opportunities for adventure.',
		[
			{ name: 'a mountain path', sceneId: 'mountainPath' },
			{ name: 'a crystal cave', sceneId: 'crystalCave' },
			{ name: 'an abandoned watchtower', sceneId: 'watchtower' }
		]
	),

	examineRunes: SceneFactory.scene(
		'examineRunes',
		'Ancient Bridge Runes',
		'The runes tell of safe passage and protection. Understanding them grants you mystical knowledge.',
		[SceneFactory.basic('Cross the bridge with confidence', 'bridgeOtherSide')],
		{
			onEnter: createStateUpdate({ 
				magic_skill: 2, 
				experience: 30, 
				flags: { runeKnowledge: true } 
			})
		}
	),

	riverBank: SceneFactory.exploration(
		'riverBank',
		'The River Bank',
		'You explore along the rushing river, finding interesting items washed up by the current.',
		[
			{ name: 'driftwood and debris', sceneId: 'searchDebris' },
			{ name: 'a small fishing spot', sceneId: 'tryFishing' },
			{ name: 'upstream along the bank', sceneId: 'followRiver' }
		]
	),

	wagonTracks: SceneFactory.scene(
		'wagonTracks',
		'Following the Wagon Tracks',
		'The old wagon tracks lead you to an abandoned campsite with useful supplies left behind.',
		[SceneFactory.basic('Search the campsite', 'searchCampsite')],
		{
			onEnter: createStateUpdate({ 
				items: ['healingPotion', 'goldCoin'], 
				experience: 20 
			})
		}
	),

	readSigns: SceneFactory.scene(
		'readSigns',
		'Reading the Signposts',
		'The worn signposts provide valuable information about distances and dangers in each direction.',
		[SceneFactory.basic('Use this knowledge for your journey', 'start')],
		{
			onEnter: createStateUpdate({ 
				experience: 15, 
				flags: { hasDirections: true } 
			})
		}
	)
};

export const villageInteractionScenes: Record<string, Scene> = {
	talkVillagers: SceneFactory.conversation(
		'talkVillagers',
		'Speaking with Villagers',
		'You engage in conversations with the local villagers, learning about their daily struggles and hopes.',
		[
			{ text: 'Ask about their families', nextScene: 'learnFamilies' },
			{ text: 'Inquire about village history', nextScene: 'villageHistory' },
			{ text: 'Offer encouragement and hope', nextScene: 'offerHope' }
		],
		{ experience: 20, diplomacy: 2 }
	),

	helpVillage: SceneFactory.interaction(
		'helpVillage',
		'Helping the Village',
		'You offer your assistance with various village tasks that have been affected by the dragon\'s presence.',
		[
			{ text: 'Help with farming and livestock', nextScene: 'helpFarming' },
			{ text: 'Assist with repairs and construction', nextScene: 'repairBuildings' },
			{ text: 'Help organize village defenses', nextScene: 'organizeDefenses' }
		]
	),

	helpFarming: SceneFactory.scene(
		'helpFarming',
		'Agricultural Assistance',
		'You help the villagers tend their crops and care for their animals, bringing normalcy back to their lives.',
		[SceneFactory.basic('Continue helping the community', 'start')],
		{
			onEnter: createStateUpdate({ 
				experience: 25, 
				gold: 15, 
				diplomacy: 2,
				flags: { farmHelper: true }
			})
		}
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
	)
};

export const wizardTowerScenes: Record<string, Scene> = {
	wizardStudy: SceneFactory.exploration(
		'wizardStudy',
		'The Wizard\'s Study',
		'You enter a study filled with bubbling potions, floating books, and mystical apparatus.',
		[
			{ name: 'ancient spellbooks', sceneId: 'studySpellbooks' },
			{ name: 'alchemical equipment', sceneId: 'examineAlchemy' },
			{ name: 'the wizard\'s desk', sceneId: 'wizardDesk' }
		],
		{ experience: 25, magic_skill: 1 }
	),

	studySpellbooks: SceneFactory.scene(
		'studySpellbooks',
		'Ancient Spellbooks',
		'You study the wizard\'s collection of spellbooks, learning powerful magical techniques.',
		[SceneFactory.basic('Continue your magical education', 'wizardStudy')],
		{
			onEnter: createStateUpdate({ 
				magic_skill: 2, 
				magic: 20, 
				experience: 35,
				items: ['spellbook']
			})
		}
	),

	magicalLibrary: SceneFactory.exploration(
		'magicalLibrary',
		'The Magical Library',
		'Towering shelves of books stretch impossibly high, filled with knowledge from across the realms.',
		[
			{ name: 'dragon lore section', sceneId: 'dragonLore' },
			{ name: 'curse-breaking texts', sceneId: 'curseTexts' },
			{ name: 'historical chronicles', sceneId: 'historicalTexts' }
		]
	),

	dragonLore: SceneFactory.scene(
		'dragonLore',
		'Dragon Lore Studies',
		'You immerse yourself in ancient texts about dragons, learning about their nature and the curses that can bind them.',
		[SceneFactory.basic('Apply this knowledge', 'magicalLibrary')],
		{
			onEnter: createStateUpdate({ 
				experience: 40, 
				magic_skill: 2, 
				flags: { dragonLoreKnowledge: true, curseKnowledge: true }
			})
		}
	),

	enchantedGarden: SceneFactory.exploration(
		'enchantedGarden',
		'The Enchanted Garden',
		'A beautiful garden where magical plants grow in impossible combinations, tended by unseen forces.',
		[
			{ name: 'healing herbs', sceneId: 'gatherHealingHerbs' },
			{ name: 'magical fruit trees', sceneId: 'magicalFruits' },
			{ name: 'the garden\'s heart', sceneId: 'gardenHeart' }
		]
	),

	gatherHealingHerbs: SceneFactory.scene(
		'gatherHealingHerbs',
		'Gathering Healing Herbs',
		'You carefully gather rare healing herbs that could be useful for your quest.',
		[SceneFactory.basic('Continue exploring the garden', 'enchantedGarden')],
		{
			onEnter: createStateUpdate({ 
				items: ['healingPotion', 'magicPotion'], 
				experience: 20,
				magic: 15
			})
		}
	)
};

export const expansionScenes: Record<string, Scene> = {
	seekAncientWisdom: SceneFactory.exploration(
		'seekAncientWisdom',
		'Seeking Ancient Wisdom',
		'You embark on a quest to find ancient wisdom that might help in dealing with the dragon\'s curse.',
		[
			{ name: 'the oracle of the mountains', sceneId: 'mountainOracle' },
			{ name: 'the library of the ancients', sceneId: 'ancientLibrary' },
			{ name: 'the sage hermit', sceneId: 'sageHermit' }
		]
	),

	mountainOracle: SceneFactory.conversation(
		'mountainOracle',
		'The Mountain Oracle',
		'High in the mountains, you find an ancient oracle who speaks in riddles about the nature of curses and redemption.',
		[
			{ text: 'Ask about breaking curses through compassion', nextScene: 'compassionWisdom' },
			{ text: 'Inquire about the Blade of Transformation', nextScene: 'bladeWisdom' },
			{ text: 'Request a vision of the future', nextScene: 'oracleVision' }
		],
		{ experience: 50, magic_skill: 3, flags: { oracleBlessing: true } }
	),

	secretCave: SceneFactory.exploration(
		'secretCave',
		'The Secret Cave',
		'Behind a waterfall, you discover a hidden cave filled with ancient treasures and mysterious artifacts.',
		[
			{ name: 'ancient treasure chest', sceneId: 'treasureChest' },
			{ name: 'mysterious altar', sceneId: 'mysteriousAltar' },
			{ name: 'cave paintings', sceneId: 'cavePaintings' }
		]
	),

	innerReflection: SceneFactory.conversation(
		'innerReflection',
		'Inner Reflection',
		'You take time for deep reflection on your journey, your motivations, and what you\'ve learned.',
		[
			{ text: 'Contemplate the meaning of heroism', nextScene: 'heroismReflection' },
			{ text: 'Think about compassion vs. violence', nextScene: 'compassionReflection' },
			{ text: 'Consider your growth as a person', nextScene: 'growthReflection' }
		],
		{ experience: 30, diplomacy: 2, magic_skill: 1 }
	),

	peacefulResolution: SceneFactory.victory(
		'peacefulResolution',
		'The Path of Peace',
		'Through wisdom, compassion, and understanding, you find a way to resolve the dragon\'s curse without violence.',
		'ultimate'
	),

	findCompanion: SceneFactory.conversation(
		'findCompanion',
		'Finding a Companion',
		'You encounter a potential companion who could aid you on your quest.',
		[
			{ text: 'Invite them to join your quest', nextScene: 'gainCompanion' },
			{ text: 'Share information and part ways', nextScene: 'shareInfo' },
			{ text: 'Test their skills first', nextScene: 'testCompanion' }
		]
	)
};

export const allMissingScenes: Record<string, Scene> = {
	...towerScenes,
	...villageScenes,
	...dragonInteractionScenes,
	...explorationScenes,
	...villageInteractionScenes,
	...wizardTowerScenes,
	...expansionScenes
};
