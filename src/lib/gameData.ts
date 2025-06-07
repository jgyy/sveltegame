// src/lib/gameData.ts
import type { Item, Scene } from './types.js';
import { gameStore } from './gameState.js';
import { get } from 'svelte/store';

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

export const scenes: Record<string, Scene> = {
	start: {
		id: 'start',
		title: 'The Crossroads of Destiny',
		description: 'You stand at a crossroads where three paths diverge. To the north lies a mysterious forest shrouded in mist. To the east, you can see smoke rising from what appears to be a small village. To the west, an ancient stone bridge spans a rushing river, leading to unknown lands.',
		choices: [
			{ text: 'Take the northern path into the mysterious forest', nextScene: 'mysteriousForest' },
			{ text: 'Head east toward the village', nextScene: 'approachVillage' },
			{ text: 'Cross the stone bridge to the west', nextScene: 'stoneBridge' },
			{ text: 'Rest and examine your surroundings more carefully', nextScene: 'examineArea' }
		]
	},

	examineArea: {
		id: 'examineArea',
		title: 'Careful Observation',
		description: 'Taking time to observe your surroundings, you notice several things: ancient runes carved into a nearby standing stone, tracks leading in various directions, and what appears to be a small shrine hidden among some bushes.',
		choices: [
			{ text: 'Examine the ancient runes', nextScene: 'ancientRunes' },
			{ text: 'Follow the tracks', nextScene: 'followTracks' },
			{ text: 'Investigate the hidden shrine', nextScene: 'hiddenShrine' },
			{ text: 'Continue to one of the main paths', nextScene: 'start' }
		]
	},

	followTracks: {
		id: 'followTracks',
		title: 'Following the Trail',
		description: 'You follow the tracks carefully. They appear to be from various travelers - some heading to the village, others toward the forest. You also notice fresher tracks that seem to belong to woodland creatures. Following them leads you to a small clearing where you find some useful supplies left behind.',
		onEnter: () => {
			gameStore.update(state => {
				state.gold += 15;
				state.stealth += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Continue tracking deeper into the wilderness', nextScene: 'mysteriousForest' },
			{ text: 'Return to examine the runes', nextScene: 'ancientRunes' },
			{ text: 'Head back to the crossroads', nextScene: 'start' }
		]
	},

	ancientRunes: {
		id: 'ancientRunes',
		title: 'The Ancient Prophecy',
		description: 'The runes are old beyond measure, but somehow you can understand their meaning: "When the dragon stirs and darkness grows, three paths shall the hero choose. Fire and ice, sword and spell, only courage breaks the fell." You feel your magical understanding deepen.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Head to the mysterious forest with this knowledge', nextScene: 'mysteriousForest' },
			{ text: 'Visit the village to share what you\'ve learned', nextScene: 'approachVillage' },
			{ text: 'Investigate the hidden shrine', nextScene: 'hiddenShrine' }
		]
	},

	hiddenShrine: {
		id: 'hiddenShrine',
		title: 'The Wayside Shrine',
		description: 'The small shrine is dedicated to Aethon, the god of travelers. A small offering bowl sits before a weathered statue. There\'s also a rolled parchment tucked behind the statue.',
		choices: [
			{ text: 'Make an offering (costs 5 gold)', nextScene: 'shrineOffering', condition: () => get(gameStore).gold >= 5 },
			{ text: 'Read the parchment', nextScene: 'shrineParchment' },
			{ text: 'Pray at the shrine', nextScene: 'shrinePrayer' },
			{ text: 'Leave the shrine untouched', nextScene: 'start' }
		]
	},

	shrinePrayer: {
		id: 'shrinePrayer',
		title: 'A Moment of Reflection',
		description: 'You kneel before the shrine and offer a sincere prayer to Aethon. You feel a sense of peace wash over you, and your confidence grows. The god of travelers seems to smile upon your journey.',
		onEnter: () => {
			gameStore.update(state => {
				state.health += 10;
				state.diplomacy += 1;
				state.experience += 5;
				return state;
			});
		},
		choices: [
			{ text: 'Read the parchment', nextScene: 'shrineParchment' },
			{ text: 'Make an offering as well', nextScene: 'shrineOffering', condition: () => get(gameStore).gold >= 5 },
			{ text: 'Continue your journey', nextScene: 'start' }
		]
	},

	shrineOffering: {
		id: 'shrineOffering',
		title: 'Divine Blessing',
		description: 'You place 5 gold coins in the offering bowl. The statue\'s eyes briefly glow with a warm light, and you feel blessed by divine protection.',
		onEnter: () => {
			gameStore.update(state => {
				state.gold -= 5;
				state.health += 20;
				state.magic += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Read the parchment', nextScene: 'shrineParchment' },
			{ text: 'Continue on your journey', nextScene: 'start' }
		]
	},

	shrineParchment: {
		id: 'shrineParchment',
		title: 'Traveler\'s Warning',
		description: 'The parchment contains a warning from a previous traveler: "Beware the dragon\'s curse spreads beyond its tower. The village suffers, the bridge weakens, and the forest grows dark. Only by understanding the true source can the curse be broken."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Head to the village to investigate the curse', nextScene: 'approachVillage' },
			{ text: 'Enter the forest with this knowledge', nextScene: 'mysteriousForest' },
			{ text: 'Check the bridge for signs of weakening', nextScene: 'stoneBridge' }
		]
	},

	mysteriousForest: {
		id: 'mysteriousForest',
		title: 'Edge of the Mysterious Forest',
		description: 'The forest looms before you, its ancient trees twisted and gnarled. Mist drifts between the trunks, and you can hear strange sounds echoing from within. You notice an old cottage to one side and a worn path leading deeper into the woods.',
		choices: [
			{ text: 'Follow the main path deeper into the forest', nextScene: 'deepForest' },
			{ text: 'Investigate the old cottage', nextScene: 'cottage' },
			{ text: 'Use stealth to scout the area', nextScene: 'stealthScout', skillRequirement: { skill: 'stealth', level: 2 } },
			{ text: 'Return to the crossroads', nextScene: 'start' }
		]
	},

	stealthScout: {
		id: 'stealthScout',
		title: 'Silent Observation',
		description: 'Moving carefully and quietly, you scout the forest edge. You discover a hidden cache containing supplies left by previous adventurers, and notice that some of the strange sounds are coming from creatures that seem friendly rather than threatening.',
		onEnter: () => {
			gameStore.update(state => {
				state.inventory.push(items.healingPotion);
				state.gold += 10;
				state.stealth += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Approach the friendly creatures', nextScene: 'forestCreatures' },
			{ text: 'Continue to the cottage', nextScene: 'cottage' },
			{ text: 'Head deeper into the forest', nextScene: 'deepForest' }
		]
	},

	forestCreatures: {
		id: 'forestCreatures',
		title: 'The Forest Sprites',
		description: 'You encounter a group of small, luminescent forest sprites. They seem curious about you and chatter in their musical language. One of them approaches and offers you a glowing crystal.',
		choices: [
			{ text: 'Accept the crystal gift', nextScene: 'acceptCrystal' },
			{ text: 'Try to communicate with them', nextScene: 'communicateSprites', skillRequirement: { skill: 'diplomacy', level: 2 } },
			{ text: 'Observe them respectfully but keep your distance', nextScene: 'observeSprites' },
			{ text: 'Leave quietly', nextScene: 'mysteriousForest' }
		]
	},

	communicateSprites: {
		id: 'communicateSprites',
		title: 'Speaking with the Sprites',
		description: 'Using gestures and gentle tones, you manage to communicate with the forest sprites. They tell you through mime and musical sounds about safe paths through the forest and warn you of darker areas to avoid. They also share knowledge about the magical balance of the forest.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Accept their gift of the crystal', nextScene: 'acceptCrystal' },
			{ text: 'Ask about the cottage', nextScene: 'cottage' },
			{ text: 'Follow their directions deeper into the forest', nextScene: 'deepForest' }
		]
	},

	observeSprites: {
		id: 'observeSprites',
		title: 'Watching the Forest Folk',
		description: 'You watch the sprites with respectful distance. They seem to appreciate your restraint and go about their activities, tending to wounded forest animals and nurturing magical plants. You learn much about forest lore just by observing.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.stealth += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Slowly approach to show friendship', nextScene: 'acceptCrystal' },
			{ text: 'Continue to the cottage', nextScene: 'cottage' },
			{ text: 'Head deeper into the forest', nextScene: 'deepForest' }
		]
	},

	acceptCrystal: {
		id: 'acceptCrystal',
		title: 'The Light Crystal',
		description: 'The sprite places a small glowing crystal in your hand. It pulses with warm light and you feel it will help guide you through dark places. The sprites chitter happily and fade back into the forest.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic += 15;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Continue to the cottage', nextScene: 'cottage' },
			{ text: 'Head deeper into the forest', nextScene: 'deepForest' },
			{ text: 'Return to explore other paths', nextScene: 'start' }
		]
	},

	cottage: {
		id: 'cottage',
		title: 'The Hermit\'s Cottage',
		description: () => get(gameStore).hasKey ? 
			'The cottage is old and weathered, with ivy covering most of its stone walls. You\'ve already explored inside and taken what you needed.' :
			'The cottage is old and weathered, with ivy covering most of its stone walls. The wooden door hangs slightly ajar, creaking softly in the breeze. Through the dirty windows, you can see the dim outline of furniture covered in dust sheets.',
		choices: () => get(gameStore).hasKey ? [
			{ text: 'Search around the outside more thoroughly', nextScene: 'cottageSide' },
			{ text: 'Head deeper into the forest', nextScene: 'deepForest' },
			{ text: 'Return to the crossroads', nextScene: 'start' }
		] : [
			{ text: 'Enter the cottage', nextScene: 'insideCottage' },
			{ text: 'Look around the outside of the cottage', nextScene: 'cottageSide' },
			{ text: 'Return to the forest edge', nextScene: 'mysteriousForest' }
		]
	},

	cottageSide: {
		id: 'cottageSide',
		title: 'Around the Cottage',
		description: 'Walking around the cottage, you find an overgrown garden with useful herbs and a small well. There\'s also a woodshed containing some basic supplies and what appears to be a hidden compartment.',
		onEnter: () => {
			gameStore.update(state => {
				state.inventory.push(items.magicPotion);
				state.gold += 10;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the cottage if you haven\'t already', nextScene: () => get(gameStore).hasKey ? 'deepForest' : 'insideCottage' },
			{ text: 'Gather herbs and supplies', nextScene: 'mysteriousForest' },
			{ text: 'Head deeper into the forest', nextScene: 'deepForest' }
		]
	},

	insideCottage: {
		id: 'insideCottage',
		title: 'Inside the Hermit\'s Cottage',
		description: 'The interior is dusty but surprisingly well-preserved. A stone fireplace dominates one wall, and an old wooden table sits in the center of the room. On the table, you notice a rusty iron key, an old journal, and a small bottle containing a red liquid.',
		choices: [
			{ text: 'Take the key', nextScene: 'takeKey' },
			{ text: 'Read the journal', nextScene: 'journal' },
			{ text: 'Examine the red bottle', nextScene: 'redBottle' },
			{ text: 'Search the rest of the cottage thoroughly', nextScene: 'searchCottage' },
			{ text: 'Leave the cottage', nextScene: 'cottage' }
		]
	},

	takeKey: {
		id: 'takeKey',
		title: 'The Iron Key',
		description: 'You pick up the iron key. It\'s heavy and old, but still seems functional. There are strange symbols etched into its surface that seem to pulse with a faint magical energy.',
		onEnter: () => {
			gameStore.update(state => {
				state.hasKey = true;
				state.inventory.push(items.ironKey);
				state.experience += 5;
				return state;
			});
		},
		choices: [
			{ text: 'Read the journal on the table', nextScene: 'journal' },
			{ text: 'Examine the red bottle', nextScene: 'redBottle' },
			{ text: 'Search the rest of the cottage', nextScene: 'searchCottage' },
			{ text: 'Leave the cottage', nextScene: 'cottage' }
		]
	},

	redBottle: {
		id: 'redBottle',
		title: 'The Healing Potion',
		description: 'The bottle contains a healing potion, skillfully brewed and still potent. A small label reads: "For the brave soul who will face the darkness."',
		onEnter: () => {
			gameStore.update(state => {
				state.hasPotion = true;
				state.inventory.push(items.healingPotion);
				return state;
			});
		},
		choices: [
			{ text: 'Take the key if you haven\'t already', nextScene: () => get(gameStore).hasKey ? 'journal' : 'takeKey' },
			{ text: 'Read the journal', nextScene: 'journal' },
			{ text: 'Search the rest of the cottage', nextScene: 'searchCottage' }
		]
	},

	journal: {
		id: 'journal',
		title: 'The Hermit\'s Journal',
		description: () => get(gameStore).curseKnowledge ? 
			'The journal confirms what you learned from the shrine parchment. The hermit writes: "The dragon\'s curse spreads like poison through the land. The village withers, the bridge crumbles, and the forest grows dark. I have found the ancient sword and the key to the tower, but I am too old and weak. The curse can only be broken by one pure of heart and strong of will."' :
			'The journal is written in an elegant hand. The last entry reads: "The dragon in the old tower has been terrorizing our land for months. I\'ve discovered that the ancient sword hidden in the cave behind the waterfall is the only weapon that can defeat it. The key I\'ve left here will unlock the tower door. May whoever finds this have the courage I lacked."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Take the key if you haven\'t already', nextScene: () => get(gameStore).hasKey ? 'searchCottage' : 'takeKey' },
			{ text: 'Take the potion if you haven\'t already', nextScene: () => get(gameStore).hasPotion ? 'searchCottage' : 'redBottle' },
			{ text: 'Search the rest of the cottage', nextScene: 'searchCottage' },
			{ text: 'Leave and head to the deep forest', nextScene: 'deepForest' }
		]
	},

	searchCottage: {
		id: 'searchCottage',
		title: 'Thorough Search',
		description: 'Searching thoroughly, you find a hidden compartment containing a small bag of gold coins and an old map showing the locations of the waterfall, tower, village, and bridge. You also discover a spellbook hidden under the floorboards.',
		onEnter: () => {
			gameStore.update(state => {
				state.gold += 25;
				state.hasMap = true;
				state.hasSpellbook = true;
				state.inventory.push(items.treasureMap, items.spellbook, items.goldCoin);
				state.magic_skill += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Study the spellbook before leaving', nextScene: 'studySpellbook' },
			{ text: 'Head to the deep forest with your new knowledge', nextScene: 'deepForest' },
			{ text: 'Visit the village marked on the map', nextScene: 'approachVillage' },
			{ text: 'Go to the bridge area', nextScene: 'stoneBridge' }
		]
	},

	studySpellbook: {
		id: 'studySpellbook',
		title: 'Arcane Knowledge',
		description: 'The spellbook contains powerful fire and ice spells. As you study it, you feel your magical abilities growing stronger. You learn the "Frost Bolt" and "Fire Shield" spells.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.magic += 20;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Head to the deep forest', nextScene: 'deepForest' },
			{ text: 'Visit the village', nextScene: 'approachVillage' },
			{ text: 'Explore the western bridge', nextScene: 'stoneBridge' }
		]
	},

	approachVillage: {
		id: 'approachVillage',
		title: 'The Troubled Village',
		description: () => get(gameStore).villageVisited ? 
			'You return to the village. The people still look worried, but some recognize you now.' :
			'As you approach the village, you notice something is wrong. The crops in the fields are withered, people move listlessly through the streets, and an air of despair hangs over everything. A few villagers look at you with a mixture of hope and skepticism.',
		choices: [
			{ text: 'Talk to the village elder', nextScene: 'villageElder' },
			{ text: 'Visit the village market', nextScene: 'villageMarket' },
			{ text: 'Investigate the withered crops', nextScene: 'witheredCrops' },
			{ text: 'Look for the village inn', nextScene: 'villageInn' },
			{ text: 'Leave the village', nextScene: 'start' }
		]
	},

	villageMarket: {
		id: 'villageMarket',
		title: 'The Struggling Market',
		description: 'The village market is barely functioning. Most stalls are empty, and the few merchants present look desperate. However, you do find a kind trader willing to share information and sell some basic supplies.',
		onEnter: () => {
			gameStore.update(state => {
				state.villageVisited = true;
				return state;
			});
		},
		choices: [
			{ text: 'Buy supplies (costs 10 gold)', nextScene: 'buySupplies', condition: () => get(gameStore).gold >= 10 },
			{ text: 'Ask about the village\'s troubles', nextScene: 'marketGossip' },
			{ text: 'Offer to help with their problems', nextScene: 'offerHelp' },
			{ text: 'Visit other parts of the village', nextScene: 'approachVillage' }
		]
	},

	buySupplies: {
		id: 'buySupplies',
		title: 'Market Purchase',
		description: 'You purchase some basic supplies from the grateful merchant. The trader gives you extra potions, saying "For someone who might help us, anything I can spare."',
		onEnter: () => {
			gameStore.update(state => {
				state.gold -= 10;
				state.inventory.push(items.healingPotion, items.magicPotion);
				state.merchantFriend = true;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about the village\'s troubles', nextScene: 'marketGossip' },
			{ text: 'Offer to help', nextScene: 'offerHelp' },
			{ text: 'Continue exploring the village', nextScene: 'approachVillage' }
		]
	},

	marketGossip: {
		id: 'marketGossip',
		title: 'Village News',
		description: 'The merchant tells you more about the village\'s plight. "The curse started three moons ago. Our crops began failing, people fell sick, and strange nightmares plague our sleep. Some say it\'s the dragon in the old tower, but others think it\'s something else entirely."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Ask specifically about the dragon', nextScene: 'askDragon' },
			{ text: 'Inquire about the nightmares', nextScene: 'villageNeeds' },
			{ text: 'Offer to investigate', nextScene: 'offerHelp' },
			{ text: 'Visit the village elder', nextScene: 'villageElder' }
		]
	},

	witheredCrops: {
		id: 'witheredCrops',
		title: 'The Cursed Fields',
		description: 'The fields are a heartbreaking sight. Once-healthy crops now stand withered and blackened. The soil itself seems drained of life. You sense a magical corruption spreading through the land.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Use magic to analyze the corruption', nextScene: 'analyzeCurse', skillRequirement: { skill: 'magic_skill', level: 2 } },
			{ text: 'Search for clues in the fields', nextScene: 'searchFields' },
			{ text: 'Talk to farmers about when this started', nextScene: 'talkFarmers' },
			{ text: 'Return to the village center', nextScene: 'approachVillage' }
		]
	},

	analyzeCurse: {
		id: 'analyzeCurse',
		title: 'Magical Investigation',
		description: 'Using your magical abilities, you sense the source of the corruption. It\'s not just random blight - there\'s a deliberate curse at work, emanating from the direction of the old tower. The magic feels ancient and deeply sad.',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.magic_skill += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Share your findings with the village elder', nextScene: 'villageElder' },
			{ text: 'Head immediately to the tower', nextScene: 'deepForest' },
			{ text: 'Investigate more of the village first', nextScene: 'approachVillage' }
		]
	},

	searchFields: {
		id: 'searchFields',
		title: 'Field Investigation',
		description: 'Searching the fields carefully, you find strange symbols burned into the earth at regular intervals. They seem to form a pattern pointing toward the forest and the tower beyond.',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Follow the pattern toward the forest', nextScene: 'mysteriousForest' },
			{ text: 'Report your findings to the villagers', nextScene: 'villageElder' },
			{ text: 'Continue investigating the village', nextScene: 'approachVillage' }
		]
	},

	talkFarmers: {
		id: 'talkFarmers',
		title: 'Farmers\' Tales',
		description: 'The farmers tell you the blight began exactly three months ago, starting from the fields closest to the forest. "It was like watching death spread across the land," one elderly farmer says. "And the nightmares... we all have the same dreams of a great beast in terrible pain."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about the nightmares', nextScene: 'villageNeeds' },
			{ text: 'Offer to help end the curse', nextScene: 'offerHelp' },
			{ text: 'Head toward the forest to investigate', nextScene: 'mysteriousForest' },
			{ text: 'Visit the village elder', nextScene: 'villageElder' }
		]
	},

	villageInn: {
		id: 'villageInn',
		title: 'The Weary Traveler Inn',
		description: 'The village inn is nearly empty. The innkeeper, a stout woman with worried eyes, greets you hopefully. "A new face! It\'s been so long since we\'ve had travelers. Most avoid our cursed village now."',
		onEnter: () => {
			gameStore.update(state => {
				state.villageVisited = true;
				return state;
			});
		},
		choices: [
			{ text: 'Rest and recover (costs 5 gold)', nextScene: 'restInn', condition: () => get(gameStore).gold >= 5 },
			{ text: 'Ask about the curse and recent events', nextScene: 'innGossip' },
			{ text: 'Offer to help the village', nextScene: 'offerHelp' },
			{ text: 'Leave the inn', nextScene: 'approachVillage' }
		]
	},

	restInn: {
		id: 'restInn',
		title: 'A Good Night\'s Rest',
		description: 'You rest at the inn and recover your strength. The innkeeper refuses to charge you full price, saying "Anyone brave enough to help our village deserves our hospitality." You wake refreshed and ready for adventure.',
		onEnter: () => {
			gameStore.update(state => {
				state.gold -= 3;
				state.health = 100;
				state.magic = Math.min(100, state.magic + 20);
				state.experience += 5;
				return state;
			});
		},
		choices: [
			{ text: 'Ask the innkeeper about local news', nextScene: 'innGossip' },
			{ text: 'Head out to explore', nextScene: 'approachVillage' },
			{ text: 'Prepare for your quest', nextScene: 'start' }
		]
	},

	innGossip: {
		id: 'innGossip',
		title: 'Tales from the Inn',
		description: 'The innkeeper shares what she knows: "The trouble started when strange roars began echoing from the old tower. But there\'s something odd - the roars sound more like... weeping. And the dreams we all share show not a monster, but a creature in great pain."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about the tower\'s history', nextScene: 'towerHistory' },
			{ text: 'Inquire about ways to reach the tower', nextScene: 'pathAdvice' },
			{ text: 'Offer to investigate', nextScene: 'offerHelp' },
			{ text: 'Thank her and leave', nextScene: 'approachVillage' }
		]
	},

	towerHistory: {
		id: 'towerHistory',
		title: 'The Tower\'s Past',
		description: 'The innkeeper\'s eyes grow distant. "The tower is ancient, built by a powerful wizard centuries ago. Legend says a great guardian lived there, protecting the land. But something went wrong, and now... well, you can see what\'s happening to us."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about the guardian', nextScene: 'guardianLore' },
			{ text: 'Inquire about the wizard', nextScene: 'wizardLore' },
			{ text: 'Promise to investigate', nextScene: 'offerHelp' },
			{ text: 'Continue exploring the village', nextScene: 'approachVillage' }
		]
	},

	guardianLore: {
		id: 'guardianLore',
		title: 'The Lost Guardian',
		description: 'The innkeeper whispers: "They say the guardian was a noble dragon, Aethonaris, sworn to protect this land. But a terrible curse was placed upon him, twisting his noble heart. Perhaps... perhaps he needs salvation, not destruction."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about breaking curses', nextScene: 'curseBreaking' },
			{ text: 'Promise to try to save the dragon', nextScene: 'offerHelp' },
			{ text: 'Head to the forest to find the tower', nextScene: 'mysteriousForest' }
		]
	},

	curseBreaking: {
		id: 'curseBreaking',
		title: 'Ancient Knowledge',
		description: 'The innkeeper recalls old stories: "The bards used to sing of how only a weapon forged in compassion, not hatred, could break such curses. And they say understanding the true nature of the curse is as important as any blade."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Thank her and set out on your quest', nextScene: 'offerHelp' },
			{ text: 'Ask if she knows of such a weapon', nextScene: 'weaponLore' },
			{ text: 'Head to the forest', nextScene: 'mysteriousForest' }
		]
	},

	weaponLore: {
		id: 'weaponLore',
		title: 'The Blade of Transformation',
		description: 'The innkeeper\'s eyes light up: "Yes! The old hermit who used to live in the forest spoke of such a blade. He called it the Blade of Transformation - not meant to destroy, but to heal and restore. He said it was hidden behind the waterfall."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Head to the forest to find this blade', nextScene: 'mysteriousForest' },
			{ text: 'Ask about the hermit', nextScene: 'hermitLore' },
			{ text: 'Promise to find the blade and save the dragon', nextScene: 'offerHelp' }
		]
	},

	hermitLore: {
		id: 'hermitLore',
		title: 'The Wise Hermit',
		description: 'The innkeeper smiles sadly: "He was a kind soul, always helping travelers. He said he had prepared everything needed to break the curse but was too old to complete the quest himself. His cottage is in the forest - perhaps he left something to help you."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Set out for the hermit\'s cottage', nextScene: 'mysteriousForest' },
			{ text: 'Ask more about the dragon\'s curse', nextScene: 'curseBreaking' },
			{ text: 'Promise to complete the hermit\'s work', nextScene: 'offerHelp' }
		]
	},

	pathAdvice: {
		id: 'pathAdvice',
		title: 'Directions to the Tower',
		description: 'The innkeeper provides helpful directions: "Go through the forest to the north. The hermit\'s cottage is on the way - he might have left something useful. Beyond that, you\'ll find a waterfall and deeper still, the ancient tower. Be careful, and may the gods watch over you."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 5;
				return state;
			});
		},
		choices: [
			{ text: 'Thank her and head to the forest', nextScene: 'mysteriousForest' },
			{ text: 'Ask about the hermit', nextScene: 'hermitLore' },
			{ text: 'Continue exploring the village first', nextScene: 'approachVillage' }
		]
	},

	wizardLore: {
		id: 'wizardLore',
		title: 'The Ancient Wizard',
		description: 'The innkeeper nods thoughtfully: "The wizard who built the tower was said to be incredibly wise and powerful. Some say he bound the guardian dragon to protect the land, but others believe he tried to save the dragon from an even worse fate. His magic still lingers in these lands."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about accessing the wizard\'s magic', nextScene: 'wizardMagic' },
			{ text: 'Inquire more about the guardian', nextScene: 'guardianLore' },
			{ text: 'Head out to investigate', nextScene: 'offerHelp' }
		]
	},

	wizardMagic: {
		id: 'wizardMagic',
		title: 'Traces of Ancient Power',
		description: 'The innkeeper lowers her voice: "They say the wizard left his knowledge scattered throughout the land - in the hermit\'s cottage, behind the waterfall, even in the bridge to the west. If you could gather his wisdom, you might understand how to break the curse properly."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Plan to visit all these locations', nextScene: 'offerHelp' },
			{ text: 'Start with the hermit\'s cottage', nextScene: 'mysteriousForest' },
			{ text: 'Check out the western bridge first', nextScene: 'stoneBridge' }
		]
	},

	villageElder: {
		id: 'villageElder',
		title: 'The Wise Elder',
		description: () => get(gameStore).curseKnowledge ? 
			'The elder, a woman with silver hair and kind eyes, listens as you share what you\'ve learned about the curse. "Yes," she nods sadly, "the dragon\'s malice spreads like a plague. Our young people grow sick, our crops fail, and hope fades each day. You may be our last chance."' :
			'The village elder, a woman with silver hair and kind eyes, greets you wearily. "Stranger, I hope you bring good news, for we have little left. A curse has fallen upon our land. Our crops wither, our people grow weak, and strange dreams plague our sleep. Some say it\'s the work of an ancient dragon."',
		onEnter: () => {
			gameStore.update(state => {
				state.villageVisited = true;
				state.diplomacy += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Offer to help break the curse', nextScene: 'offerHelp' },
			{ text: 'Ask about the dragon', nextScene: 'askDragon' },
			{ text: 'Inquire about the village\'s needs', nextScene: 'villageNeeds' },
			{ text: 'Visit other parts of the village', nextScene: 'approachVillage' }
		]
	},

	offerHelp: {
		id: 'offerHelp',
		title: 'A Hero\'s Promise',
		description: () => get(gameStore).curseKnowledge ? 
			'The elder\'s eyes fill with tears of hope. "You understand the true nature of the curse! Yes, please, try to save Aethonaris. If you can break the curse and restore him, our land will heal. Take this blessing of our people with you."' :
			'The elder\'s eyes light up with the first hope you\'ve seen in the village. "Truly? You would help us? The task is dangerous - you must face the dragon in the ancient tower. But if you succeed, you will be our greatest hero. Take this blessing of our people."',
		onEnter: () => {
			gameStore.update(state => {
				state.health += 15;
				state.magic += 15;
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Head immediately to the forest and tower', nextScene: 'mysteriousForest' },
			{ text: 'Ask for more information first', nextScene: 'askDragon' },
			{ text: 'Prepare more thoroughly', nextScene: 'approachVillage' },
			{ text: 'Visit the western bridge first', nextScene: 'stoneBridge' }
		]
	},

	askDragon: {
		id: 'askDragon',
		title: 'Tales of the Dragon',
		description: () => get(gameStore).curseKnowledge ? 
			'The elder speaks with sorrow: "Aethonaris was once our protector, a noble guardian dragon. But an ancient curse twisted his nature, filling him with rage and despair. He suffers as much as we do. The roars from the tower... they sound like weeping."' :
			'The elder\'s expression grows grave. "The dragon came three months ago, taking residence in the old tower. But something\'s strange - the destruction seems... reluctant. As if the beast is fighting against its own nature. Our shared dreams suggest it\'s suffering terribly."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 15;
				if (!state.curseKnowledge) {
					state.curseKnowledge = true;
				}
				return state;
			});
		},
		choices: [
			{ text: 'Promise to try to save the dragon', nextScene: 'offerHelp' },
			{ text: 'Ask about the tower\'s location', nextScene: 'towerDirections' },
			{ text: 'Inquire about weapons or help', nextScene: 'villageNeeds' },
			{ text: 'Leave to investigate immediately', nextScene: 'mysteriousForest' }
		]
	},

	towerDirections: {
		id: 'towerDirections',
		title: 'The Path to the Tower',
		description: 'The elder points toward the forest: "Go north through the mysterious forest. You\'ll find an old hermit\'s cottage along the way - he might have left something useful. Beyond that is a waterfall, and deeper still, the ancient tower. The path is dangerous, but you seem capable."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 5;
				return state;
			});
		},
		choices: [
			{ text: 'Head to the forest immediately', nextScene: 'mysteriousForest' },
			{ text: 'Ask about the hermit', nextScene: 'hermitInfo' },
			{ text: 'Inquire about other preparations', nextScene: 'villageNeeds' },
			{ text: 'Thank her and explore more', nextScene: 'approachVillage' }
		]
	},

	hermitInfo: {
		id: 'hermitInfo',
		title: 'The Hermit\'s Legacy',
		description: 'The elder nods knowingly: "The hermit was a wise man who spent years researching the dragon\'s curse. He claimed to have found a way to break it, but he was too old and frail to attempt the quest himself. His cottage should contain everything you need."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to complete the hermit\'s work', nextScene: 'offerHelp' },
			{ text: 'Head to the cottage immediately', nextScene: 'mysteriousForest' },
			{ text: 'Ask about other resources', nextScene: 'villageNeeds' }
		]
	},

	villageNeeds: {
		id: 'villageNeeds',
		title: 'The Village\'s Plight',
		description: 'The elder explains the full extent of their suffering: "The nightmares are the worst part. We all dream of the same thing - a magnificent dragon crying out in pain and rage, trapped by invisible chains. It\'s as if the creature\'s anguish flows into our very souls."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to end their suffering', nextScene: 'offerHelp' },
			{ text: 'Ask about resources for your quest', nextScene: 'questResources' },
			{ text: 'Inquire about the nature of curses', nextScene: 'curseWisdom' },
			{ text: 'Head out to face the dragon', nextScene: 'mysteriousForest' }
		]
	},

	questResources: {
		id: 'questResources',
		title: 'Village Support',
		description: 'The elder considers carefully: "We have little to spare, but what we have, we share gladly. The blacksmith can strengthen your weapons, the healer has some potions, and our librarian knows the old legends that might help you understand what you face."',
		choices: [
			{ text: 'Visit the blacksmith', nextScene: 'villageBlacksmith' },
			{ text: 'See the healer', nextScene: 'villageHealer' },
			{ text: 'Talk to the librarian', nextScene: 'villageLibrarian' },
			{ text: 'Politely decline and begin your quest', nextScene: 'mysteriousForest' }
		]
	},

	villageBlacksmith: {
		id: 'villageBlacksmith',
		title: 'The Village Forge',
		description: 'The blacksmith, despite the village\'s troubles, works diligently at his forge. "I can\'t give you much, but I can sharpen your weapons and give you some basic equipment. It\'s the least I can do for someone brave enough to help us."',
		onEnter: () => {
			gameStore.update(state => {
				state.combat += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Thank him and continue preparing', nextScene: 'questResources' },
			{ text: 'Ask about dragon-fighting techniques', nextScene: 'combatAdvice' },
			{ text: 'Head out on your quest', nextScene: 'mysteriousForest' }
		]
	},

	combatAdvice: {
		id: 'combatAdvice',
		title: 'Warrior\'s Wisdom',
		description: 'The blacksmith shares his knowledge: "Dragons are powerful, but they\'re not invincible. Aim for the heart, but remember - sometimes the greatest victory comes not from strength, but from understanding your opponent\'s true nature."',
		onEnter: () => {
			gameStore.update(state => {
				state.combat += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Continue gathering resources', nextScene: 'questResources' },
			{ text: 'Begin your quest', nextScene: 'mysteriousForest' }
		]
	},

	villageHealer: {
		id: 'villageHealer',
		title: 'The Village Healer',
		description: 'The healer, an elderly man with gentle hands, provides you with what healing supplies he can spare. "These potions will help, but remember - sometimes the greatest healing comes from compassion, not just medicine."',
		onEnter: () => {
			gameStore.update(state => {
				state.inventory.push(items.healingPotion, items.magicPotion);
				state.health += 10;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about healing curses', nextScene: 'healingWisdom' },
			{ text: 'Continue gathering resources', nextScene: 'questResources' },
			{ text: 'Thank him and begin your quest', nextScene: 'mysteriousForest' }
		]
	},

	healingWisdom: {
		id: 'healingWisdom',
		title: 'The Art of Healing',
		description: 'The healer speaks thoughtfully: "True healing addresses not just the body, but the spirit. A curse is a wound of the soul. To heal it, you must understand not just what it does, but why it exists. Compassion can be more powerful than any blade."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Ask more about curse-breaking', nextScene: 'curseWisdom' },
			{ text: 'Continue preparing', nextScene: 'questResources' },
			{ text: 'Set out with this wisdom', nextScene: 'mysteriousForest' }
		]
	},

	villageLibrarian: {
		id: 'villageLibrarian',
		title: 'The Keeper of Lore',
		description: 'The librarian, surrounded by ancient books despite the village\'s troubles, shares the old legends: "The stories speak of Aethonaris, the noble guardian. He was cursed by a jealous sorcerer who envied his pure heart. The curse can only be broken by one who sees past the monster to the suffering soul within."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about the specific curse-breaking ritual', nextScene: 'curseWisdom' },
			{ text: 'Inquire about the jealous sorcerer', nextScene: 'sorcererLore' },
			{ text: 'Thank her and begin your quest', nextScene: 'mysteriousForest' },
			{ text: 'Continue gathering resources', nextScene: 'questResources' }
		]
	},

	curseWisdom: {
		id: 'curseWisdom',
		title: 'Ancient Knowledge',
		description: 'The wise villager explains: "Curses are bonds forged in pain and malice. To break them, one must understand their source and approach with genuine compassion. The Blade of Transformation, hidden behind the waterfall, was forged specifically for this purpose - not to destroy, but to heal."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to find the Blade of Transformation', nextScene: 'offerHelp' },
			{ text: 'Head to the waterfall immediately', nextScene: 'mysteriousForest' },
			{ text: 'Ask about approaching the dragon safely', nextScene: 'dragonApproach' }
		]
	},

	sorcererLore: {
		id: 'sorcererLore',
		title: 'The Source of Evil',
		description: 'The librarian\'s expression darkens: "The sorcerer Malachar was consumed by envy and hatred. He cast the curse knowing it would cause endless suffering. But curses have a way of consuming their creators - Malachar vanished long ago, destroyed by his own malice."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Focus on breaking the curse', nextScene: 'curseWisdom' },
			{ text: 'Ask about Aethonaris\' original nature', nextScene: 'dragonNature' },
			{ text: 'Begin your quest with this knowledge', nextScene: 'mysteriousForest' }
		]
	},

	dragonNature: {
		id: 'dragonNature',
		title: 'The True Dragon',
		description: 'The librarian smiles sadly: "Aethonaris was known for his wisdom and kindness. He would heal injured animals, protect travelers, and ensure good harvests. The creature terrorizing us now is a twisted shadow of his true self. Perhaps... perhaps he can be restored."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to restore the true Aethonaris', nextScene: 'offerHelp' },
			{ text: 'Ask about the restoration process', nextScene: 'curseWisdom' },
			{ text: 'Set out immediately to save him', nextScene: 'mysteriousForest' }
		]
	},

	dragonApproach: {
		id: 'dragonApproach',
		title: 'Approaching the Dragon',
		description: 'The wise villager offers crucial advice: "When you face Aethonaris, remember that beneath the rage is profound pain. Speak to his true nature, not the curse. If you can reach the noble soul within, the battle may become a healing instead of a destruction."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to try peaceful resolution first', nextScene: 'offerHelp' },
			{ text: 'Ask about specific words or actions', nextScene: 'peacefulApproach' },
			{ text: 'Begin your quest with this wisdom', nextScene: 'mysteriousForest' }
		]
	},

	peacefulApproach: {
		id: 'peacefulApproach',
		title: 'Words of Power',
		description: 'The villager whispers ancient words: "Speak his true name with respect. Acknowledge his pain without fear. Show him that you see the guardian he was meant to be, not the monster he\'s become. These actions have power beyond any weapon."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Commit these words to memory and begin your quest', nextScene: 'mysteriousForest' },
			{ text: 'Ask about the Blade of Transformation', nextScene: 'curseWisdom' },
			{ text: 'Promise to save Aethonaris', nextScene: 'offerHelp' }
		]
	},

	deepForest: {
		id: 'deepForest',
		title: 'Deep in the Ancient Forest',
		description: 'The path leads you deeper into the forest where the trees grow so dense that little sunlight reaches the ground. The air is thick with magic and mystery. You hear the sound of rushing water ahead and notice two paths: one leading toward the sound of water, and another that winds upward toward what looks like an old stone tower.',
		choices: [
			{ text: 'Follow the sound of water', nextScene: 'waterfall' },
			{ text: 'Head toward the stone tower', nextScene: 'tower' },
			{ text: 'Use magic to sense hidden paths', nextScene: 'magicSense', skillRequirement: { skill: 'magic_skill', level: 2 } },
			{ text: 'Return to the forest edge', nextScene: 'mysteriousForest' }
		]
	},

	magicSense: {
		id: 'magicSense',
		title: 'Magical Perception',
		description: 'Using your magical abilities, you sense several hidden paths and magical auras throughout the forest. You detect ancient magic near the waterfall, a powerful curse emanating from the tower, and traces of the old hermit\'s protective spells throughout the area.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Follow the strongest magical aura to the waterfall', nextScene: 'waterfall' },
			{ text: 'Investigate the curse at the tower', nextScene: 'tower' },
			{ text: 'Follow the hermit\'s protective magic', nextScene: 'hiddenPath' },
			{ text: 'Return to make a more informed choice', nextScene: 'deepForest' }
		]
	},

	hiddenPath: {
		id: 'hiddenPath',
		title: 'The Hermit\'s Secret Path',
		description: 'Following the traces of protective magic, you discover a hidden path that the hermit used to move safely through the forest. It leads to a secret grove where you find additional supplies and a note with crucial information about the dragon\'s true nature.',
		onEnter: () => {
			gameStore.update(state => {
				state.inventory.push(items.healingPotion, items.magicPotion);
				state.curseKnowledge = true;
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Continue to the waterfall', nextScene: 'waterfall' },
			{ text: 'Head directly to the tower', nextScene: 'tower' },
			{ text: 'Return to the cottage to look for more clues', nextScene: 'cottage' }
		]
	},

	waterfall: {
		id: 'waterfall',
		title: 'The Mystical Waterfall',
		description: 'You discover a magnificent waterfall cascading down rocky cliffs into a crystal-clear pool. The mist creates dancing rainbows in the filtered sunlight, and the air itself seems charged with magic. Behind the waterfall, you can make out the entrance to a cave.',
		choices: [
			{ text: 'Go behind the waterfall to the cave', nextScene: 'cave' },
			{ text: 'Rest and restore yourself by the pool', nextScene: 'restWaterfall' },
			{ text: 'Use magic to commune with the water spirits', nextScene: 'waterSpirits', skillRequirement: { skill: 'magic_skill', level: 3 } },
			{ text: 'Return to the deep forest', nextScene: 'deepForest' }
		]
	},

	restWaterfall: {
		id: 'restWaterfall',
		title: 'Restorative Waters',
		description: 'You rest by the magical pool, letting the spray from the waterfall refresh you. The water has healing properties, and you feel your strength and magic renewed. The peaceful environment also calms your mind and prepares you for the challenges ahead.',
		onEnter: () => {
			gameStore.update(state => {
				state.health = Math.min(100, state.health + 25);
				state.magic = Math.min(100, state.magic + 25);
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the cave behind the waterfall', nextScene: 'cave' },
			{ text: 'Try to commune with water spirits', nextScene: 'waterSpirits', skillRequirement: { skill: 'magic_skill', level: 3 } },
			{ text: 'Continue to the tower', nextScene: 'tower' },
			{ text: 'Return to explore other areas', nextScene: 'deepForest' }
		]
	},

	waterSpirits: {
		id: 'waterSpirits',
		title: 'Communion with Water Spirits',
		description: 'Your advanced magical abilities allow you to commune with the ancient water spirits that dwell in the waterfall. They share visions of the dragon\'s past - showing you Aethonaris in his noble form, protecting the land and its people before the curse took hold.',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.magic_skill += 2;
				state.magic += 30;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Ask the spirits about breaking the curse', nextScene: 'spiritWisdom' },
			{ text: 'Request their blessing for your quest', nextScene: 'spiritBlessing' },
			{ text: 'Enter the cave with their guidance', nextScene: 'cave' },
			{ text: 'Thank them and continue your quest', nextScene: 'tower' }
		]
	},

	spiritWisdom: {
		id: 'spiritWisdom',
		title: 'Ancient Wisdom',
		description: 'The water spirits share their ancient knowledge: "The curse binds not just the dragon\'s form, but his memories of who he truly is. The Blade of Transformation in the cave can cut through these bonds, but only if wielded with pure intention - to heal, not to harm."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to use the blade wisely', nextScene: 'spiritBlessing' },
			{ text: 'Enter the cave to claim the blade', nextScene: 'cave' },
			{ text: 'Ask about approaching the dragon', nextScene: 'spiritGuidance' }
		]
	},

	spiritBlessing: {
		id: 'spiritBlessing',
		title: 'Blessing of the Waters',
		description: 'The water spirits bestow their blessing upon you, surrounding you with protective magic that will guard you against the dragon\'s curse and enhance your ability to see through illusions to the truth beneath.',
		onEnter: () => {
			gameStore.update(state => {
				state.health += 20;
				state.magic += 20;
				state.magic_skill += 1;
				state.diplomacy += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the cave to retrieve the sword', nextScene: 'cave' },
			{ text: 'Head directly to the tower', nextScene: 'tower' },
			{ text: 'Ask for guidance on the ritual', nextScene: 'spiritGuidance' }
		]
	},

	spiritGuidance: {
		id: 'spiritGuidance',
		title: 'Guidance for the Quest',
		description: 'The spirits offer final guidance: "When you face Aethonaris, speak his true name with love, not fear. Show him the blade not as a weapon, but as a key to his freedom. Remember - the greatest magic is compassion, and the strongest weapon is understanding."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Thank them and enter the cave', nextScene: 'cave' },
			{ text: 'Head to the tower with their wisdom', nextScene: 'tower' },
			{ text: 'Meditate on their words', nextScene: 'spiritMeditation' }
		]
	},

	spiritMeditation: {
		id: 'spiritMeditation',
		title: 'Spiritual Preparation',
		description: 'You spend time in deep meditation by the waterfall, internalizing the spirits\' wisdom and preparing your mind and soul for the task ahead. You feel a profound sense of purpose and clarity.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.diplomacy += 1;
				state.magic = 100;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the cave with perfect clarity', nextScene: 'cave' },
			{ text: 'Proceed to the tower', nextScene: 'tower' },
			{ text: 'Return to help the village first', nextScene: 'approachVillage' }
		]
	},

	cave: {
		id: 'cave',
		title: 'The Sacred Cave',
		description: () => get(gameStore).hasSword ? 
			'The cave behind the waterfall has been transformed by your presence. Where once the ancient sword lay, now pulses of magical energy emanate from the stone pedestal.' :
			'The cave is cool and damp, filled with ancient magic. As your eyes adjust, you see detailed murals depicting the history of the dragon - once a noble guardian, transformed by a terrible curse. At the far end of the cave, an ancient sword rests in a stone pedestal, glowing with inner light.',
		choices: () => get(gameStore).hasSword ? [
			{ text: 'Study the murals more carefully', nextScene: 'caveDrawings' },
			{ text: 'Meditate at the magical nexus', nextScene: 'caveMeditation' },
			{ text: 'Leave the cave', nextScene: 'waterfall' }
		] : [
			{ text: 'Take the ancient sword', nextScene: 'findSword' },
			{ text: 'Examine the murals depicting the dragon\'s history', nextScene: 'caveDrawings' },
			{ text: 'Study the magical energies in the cave', nextScene: 'studyCave' },
			{ text: 'Leave the cave', nextScene: 'waterfall' }
		]
	},

	caveDrawings: {
		id: 'caveDrawings',
		title: 'The Dragon\'s True History',
		description: () => get(gameStore).hasSword ? 
			'With the Blade of Transformation in hand, the murals seem to come alive, showing you visions of Aethonaris\' past. You see him healing wounded creatures, protecting villages, and bringing prosperity to the land. The contrast with his current state fills you with determination to restore him.' :
			'The murals tell a tragic story in exquisite detail. They show Aethonaris as a magnificent golden dragon, beloved by all. Then comes the sorcerer Malachar, twisted by jealousy. The curse is depicted as dark chains wrapping around the dragon\'s heart, transforming his noble nature into rage and despair.',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Study the details of the curse', nextScene: 'curseDetails' },
			{ text: 'Look for information about breaking it', nextScene: 'cureDetails' },
			{ text: 'Take the sword if you haven\'t', nextScene: () => get(gameStore).hasSword ? 'studyCave' : 'findSword' },
			{ text: 'Leave to confront the dragon', nextScene: 'tower' }
		]
	},

	curseDetails: {
		id: 'curseDetails',
		title: 'Understanding the Curse',
		description: 'The murals reveal the curse\'s exact nature: it doesn\'t just change the dragon\'s form, but inverts his emotions. Love becomes rage, protectiveness becomes destruction, joy becomes despair. Understanding this gives you insight into how to reach Aethonaris\' true self.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Study the cure information', nextScene: 'cureDetails' },
			{ text: 'Meditate on this knowledge', nextScene: 'caveMeditation' },
			{ text: 'Head to the tower with this understanding', nextScene: 'tower' }
		]
	},

	cureDetails: {
		id: 'cureDetails',
		title: 'The Path to Redemption',
		description: 'The final murals show the cure: the Blade of Transformation must be used not to strike, but to cut the ethereal chains of the curse. This requires seeing past the dragon\'s monstrous exterior to his suffering soul within, and approaching with genuine compassion.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Practice the visualization technique', nextScene: 'caveMeditation' },
			{ text: 'Take the sword and begin the quest', nextScene: () => get(gameStore).hasSword ? 'tower' : 'findSword' },
			{ text: 'Study more about the curse', nextScene: 'curseDetails' }
		]
	},

	studyCave: {
		id: 'studyCave',
		title: 'Magical Research',
		description: 'You study the magical energies flowing through the cave. This place is a nexus of transformative magic, designed specifically to forge weapons of healing rather than harm. The knowledge you gain here will help you use any magical items more effectively.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.magic += 20;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Examine the murals', nextScene: 'caveDrawings' },
			{ text: 'Take the sword', nextScene: () => get(gameStore).hasSword ? 'caveMeditation' : 'findSword' },
			{ text: 'Meditate in the magical nexus', nextScene: 'caveMeditation' },
			{ text: 'Leave with your new knowledge', nextScene: 'waterfall' }
		]
	},

	caveMeditation: {
		id: 'caveMeditation',
		title: 'Deep Meditation',
		description: () => get(gameStore).hasSword ? 
			'With the Blade of Transformation beside you, you meditate deeply in the magical nexus. You feel your connection to the transformative powers growing stronger, and gain perfect clarity about your mission to heal rather than harm.' :
			'You meditate in the cave\'s magical nexus, feeling the transformative energies flow through you. Your understanding of magic and compassion deepens, preparing you spiritually for the challenges ahead.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.diplomacy += 1;
				state.magic = 100;
				state.health = Math.min(100, state.health + 20);
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Take the sword if you haven\'t already', nextScene: () => get(gameStore).hasSword ? 'tower' : 'findSword' },
			{ text: 'Head to the tower with perfect preparation', nextScene: 'tower' },
			{ text: 'Study the murals one more time', nextScene: 'caveDrawings' },
			{ text: 'Return to the waterfall', nextScene: 'waterfall' }
		]
	},

	findSword: {
		id: 'findSword',
		title: 'The Blade of Transformation',
		description: () => get(gameStore).curseKnowledge ? 
			'You grasp the ancient sword, and with your knowledge of the curse\'s true nature, you feel it resonate with transformative power. This blade can indeed defeat the dragon, but more importantly, it can break the curse that binds the noble creature.' :
			'You discover an ancient sword embedded in a stone pedestal. The blade gleams with an otherworldly light, and strange runes are etched along its length. As you grasp the hilt, you feel a surge of power coursing through you.',
		onEnter: () => {
			gameStore.update(state => {
				state.hasSword = true;
				state.inventory.push(items.ancientSword);
				state.combat += 2;
				state.magic += 15;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Study the murals with sword in hand', nextScene: 'caveDrawings' },
			{ text: 'Leave the cave and head directly to the tower', nextScene: 'tower' },
			{ text: 'Return to the waterfall to prepare', nextScene: 'waterfall' }
		]
	},

	tower: {
		id: 'tower',
		title: 'The Dragon\'s Tower',
		description: () => get(gameStore).hasKey ? 
			'You stand before the imposing stone tower that reaches high into the cloudy sky. The massive wooden door bears the same symbols as your iron key. Powerful magical energies emanate from within, and you can hear the deep, mournful sounds of the cursed dragon.' :
			'You stand before an imposing stone tower that reaches high into the sky. The massive wooden door is locked with an intricate iron mechanism that pulses with magical energy. Deep, sorrowful roars echo from within - the sound of a once-noble creature trapped by an ancient curse.',
		choices: () => get(gameStore).hasKey ? [
			{ text: 'Use the iron key to unlock the door', nextScene: 'unlockTower' },
			{ text: 'Prepare yourself before entering', nextScene: 'prepareTower' },
			{ text: 'Return to gather more allies or knowledge', nextScene: 'deepForest' }
		] : [
			{ text: 'Try to force open the door', nextScene: 'forceDoor' },
			{ text: 'Use magic to attempt to unlock it', nextScene: 'magicUnlock', skillRequirement: { skill: 'magic_skill', level: 3 } },
			{ text: 'Look for another way in', nextScene: 'searchTower' },
			{ text: 'Return to find the key', nextScene: 'deepForest' }
		]
	},

	prepareTower: {
		id: 'prepareTower',
		title: 'Final Preparations',
		description: () => get(gameStore).curseKnowledge ? 
			'You take time to prepare yourself mentally and spiritually for the encounter ahead. Knowing the dragon\'s true nature, you focus on cultivating compassion and understanding rather than just courage for battle.' :
			'You take a moment to prepare yourself before entering the tower. You check your equipment, steel your resolve, and prepare for what may be the most challenging encounter of your life.',
		onEnter: () => {
			gameStore.update(state => {
				state.health = Math.min(100, state.health + 15);
				state.magic = Math.min(100, state.magic + 15);
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the tower', nextScene: 'unlockTower' },
			{ text: 'Practice your approach strategy', nextScene: 'practiceApproach' },
			{ text: 'Meditate to center yourself', nextScene: 'towerMeditation' },
			{ text: 'Return to gather more resources', nextScene: 'deepForest' }
		]
	},

	practiceApproach: {
		id: 'practiceApproach',
		title: 'Strategic Planning',
		description: () => get(gameStore).curseKnowledge ? 
			'You practice speaking Aethonaris\' name with respect and love, rehearse words of compassion, and visualize seeing past his monstrous form to the noble soul beneath. This preparation strengthens your resolve and diplomatic abilities.' :
			'You practice your combat techniques and plan your strategy for facing the dragon. You consider different approaches and prepare yourself mentally for the battle ahead.',
		onEnter: () => {
			gameStore.update(state => {
				if (state.curseKnowledge) {
					state.diplomacy += 2;
				} else {
					state.combat += 1;
				}
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the tower', nextScene: 'unlockTower' },
			{ text: 'Continue preparation', nextScene: 'prepareTower' },
			{ text: 'Meditate before the final approach', nextScene: 'towerMeditation' }
		]
	},

	towerMeditation: {
		id: 'towerMeditation',
		title: 'Moment of Clarity',
		description: 'You meditate in the shadow of the tower, finding inner peace and clarity. The mournful sounds from above no longer fill you with dread but with compassion for the suffering creature within.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.diplomacy += 1;
				state.health = 100;
				state.magic = 100;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the tower with perfect clarity', nextScene: 'unlockTower' },
			{ text: 'Practice your approach one more time', nextScene: 'practiceApproach' },
			{ text: 'Begin your ascent', nextScene: 'unlockTower' }
		]
	},

	forceDoor: {
		id: 'forceDoor',
		title: 'Brute Force Attempt',
		description: 'You attempt to force open the massive door, but it\'s protected by powerful magic. Your efforts only result in exhaustion and minor injury. It becomes clear that brute force alone won\'t work here.',
		onEnter: () => {
			gameStore.update(state => {
				state.health -= 10;
				state.experience += 5;
				return state;
			});
		},
		choices: [
			{ text: 'Try a magical approach', nextScene: 'magicUnlock', skillRequirement: { skill: 'magic_skill', level: 3 } },
			{ text: 'Look for another way in', nextScene: 'searchTower' },
			{ text: 'Return to find the proper key', nextScene: 'deepForest' },
			{ text: 'Rest and try a different approach', nextScene: 'prepareTower' }
		]
	},

	magicUnlock: {
		id: 'magicUnlock',
		title: 'Magical Breakthrough',
		description: 'Using your advanced magical abilities, you manage to bypass the tower\'s magical locks. The door swings open with a deep resonance, but you feel the effort has drained some of your magical energy.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic -= 20;
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Enter the tower immediately', nextScene: 'unlockTower' },
			{ text: 'Rest and recover your magic first', nextScene: 'prepareTower' },
			{ text: 'Prepare yourself mentally before entering', nextScene: 'towerMeditation' }
		]
	},

	searchTower: {
		id: 'searchTower',
		title: 'Alternative Entrance',
		description: 'Searching around the tower, you find ancient handholds carved into the stone walls. You could potentially climb to a window higher up, though it would be dangerous and require significant skill.',
		choices: [
			{ text: 'Attempt to climb the tower walls', nextScene: 'climbTower', skillRequirement: { skill: 'stealth', level: 2 } },
			{ text: 'Look for a different approach', nextScene: 'secretEntrance' },
			{ text: 'Return to find the key', nextScene: 'deepForest' },
			{ text: 'Try to force the door after all', nextScene: 'forceDoor' }
		]
	},

	secretEntrance: {
		id: 'secretEntrance',
		title: 'Hidden Passage',
		description: 'Your thorough search reveals a hidden passage concealed by illusion magic. It appears to lead into the tower\'s lower levels. This path looks safer than climbing but may lead you into unknown dangers.',
		onEnter: () => {
			gameStore.update(state => {
				state.stealth += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Enter through the secret passage', nextScene: 'secretPath' },
			{ text: 'Mark the location and try the main entrance', nextScene: 'tower' },
			{ text: 'Use magic to analyze the passage first', nextScene: 'analyzePassage', skillRequirement: { skill: 'magic_skill', level: 2 } }
		]
	},

	secretPath: {
		id: 'secretPath',
		title: 'The Hidden Way',
		description: 'The secret passage leads you through ancient corridors lined with protective runes. You emerge inside the tower, having bypassed the main entrance. You can hear the dragon\'s sounds more clearly now, and they definitely sound more like weeping than roaring.',
		onEnter: () => {
			gameStore.update(state => {
				state.stealth += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Climb the stairs to face the dragon', nextScene: 'climbTower' },
			{ text: 'Listen carefully to understand the sounds', nextScene: 'listenDragon' },
			{ text: 'Call out gently to announce your presence', nextScene: 'callOut', condition: () => get(gameStore).curseKnowledge }
		]
	},

	analyzePassage: {
		id: 'analyzePassage',
		title: 'Magical Analysis',
		description: 'Your magical analysis reveals that the passage is protected by benevolent magic - likely placed by the wizard who originally built the tower. It\'s designed to allow those with pure intentions to enter safely.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Enter through the passage', nextScene: 'secretPath' },
			{ text: 'Use the main entrance instead', nextScene: 'tower' },
			{ text: 'Prepare more thoroughly first', nextScene: 'prepareTower' }
		]
	},

	listenDragon: {
		id: 'listenDragon',
		title: 'The Dragon\'s Lament',
		description: 'Listening carefully, you can distinguish words in the dragon\'s sounds. He\'s speaking in the ancient tongue, repeating: "Free me... restore me... I cannot... control..." Your heart fills with compassion for his suffering.',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Call out in response with words of comfort', nextScene: 'callOut' },
			{ text: 'Climb the stairs to offer help directly', nextScene: 'climbTower' },
			{ text: 'Prepare yourself with this knowledge', nextScene: 'prepareTower' }
		]
	},

	unlockTower: {
		id: 'unlockTower',
		title: 'Inside the Ancient Tower',
		description: 'The key turns smoothly in the lock, and the heavy door swings open with a deep, resonant tone. Inside, you see a spiral staircase carved from black stone, leading upward into darkness. The air is thick with ancient magic and the weight of centuries of sorrow.',
		choices: [
			{ text: 'Climb the stairs to face your destiny', nextScene: 'climbTower' },
			{ text: 'Call out to announce your peaceful intentions', nextScene: 'callOut', condition: () => get(gameStore).curseKnowledge },
			{ text: 'Use magic to sense what lies above', nextScene: 'senseTower', skillRequirement: { skill: 'magic_skill', level: 2 } },
			{ text: 'Retreat to reconsider your approach', nextScene: 'tower' }
		]
	},

	callOut: {
		id: 'callOut',
		title: 'Words of Peace',
		description: 'You call out in a clear, respectful voice: "Aethonaris, noble guardian! I come not as an enemy, but as one who would help heal your pain!" Your words echo up the tower, and for a moment, the sorrowful sounds pause. Then you hear a voice, ancient and pained: "You... know my true name?"',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Climb the stairs with this peaceful contact established', nextScene: 'climbTowerPeaceful' },
			{ text: 'Continue the conversation from here', nextScene: 'towerConversation' },
			{ text: 'Explain your mission to break the curse', nextScene: 'explainMission' }
		]
	},

	climbTowerPeaceful: {
		id: 'climbTowerPeaceful',
		title: 'Peaceful Ascent',
		description: 'You climb the stairs with the dragon already aware of your peaceful intentions. When you reach the top, Aethonaris is waiting, his great form still magnificent despite the curse. His eyes hold a mixture of hope and wariness.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Approach with the Blade of Transformation visible', nextScene: 'showBlade', condition: () => get(gameStore).hasSword },
			{ text: 'Speak about breaking his curse', nextScene: 'discussCurse' },
			{ text: 'Offer comfort for his suffering', nextScene: 'comfortDragon' },
			{ text: 'Ask how you can help him', nextScene: 'offerDragonHelp' }
		]
	},

	showBlade: {
		id: 'showBlade',
		title: 'The Blade of Hope',
		description: 'You reveal the Blade of Transformation, but hold it as a symbol of healing, not a weapon. Aethonaris\'s eyes widen with recognition and hope. "The Blade of Transformation... I had thought it lost forever. You truly understand my plight."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Offer to perform the ritual of transformation', nextScene: 'breakCurse' },
			{ text: 'Ask him to guide you in using it properly', nextScene: 'dragonGuidance' },
			{ text: 'Explain what you\'ve learned about the curse', nextScene: 'shareKnowledge' }
		]
	},

	dragonGuidance: {
		id: 'dragonGuidance',
		title: 'The Dragon\'s Wisdom',
		description: 'Aethonaris guides you: "The blade must cut not my flesh, but the ethereal chains that bind my soul. You must see past this cursed form to who I truly am beneath. Only then can the transformation begin. But know that this requires great courage and purity of heart."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.diplomacy += 1;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the ritual with his guidance', nextScene: 'guidedRitual' },
			{ text: 'Ask about what you\'ll see when looking at his true form', nextScene: 'trueFormVision' },
			{ text: 'Request his help in overcoming any fear', nextScene: 'dragonCourage' }
		]
	},

	guidedRitual: {
		id: 'guidedRitual',
		title: 'The Ritual of Liberation',
		description: 'With Aethonaris guiding you, you begin the sacred ritual. As you look upon him with eyes of compassion rather than fear, you begin to see the ethereal chains of the curse wrapped around his spirit. The Blade of Transformation glows with pure light as you prepare to cut them.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Cut the chains with perfect precision', nextScene: 'perfectRitual' },
			{ text: 'Channel all your compassion into the blade', nextScene: 'compassionateRitual' },
			{ text: 'Speak words of healing as you work', nextScene: 'healingWords' }
		]
	},

	perfectRitual: {
		id: 'perfectRitual',
		title: 'Flawless Execution',
		description: 'Your movements are perfect, guided by both skill and compassion. Each cut of the blade severs another chain of the curse. Light fills the tower as Aethonaris begins his transformation back to his true, noble form.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 100;
				state.level += 2;
				return state;
			});
		},
		choices: [
			{ text: 'Witness the complete transformation', nextScene: 'perfectVictory' },
			{ text: 'Offer final words of restoration', nextScene: 'restorationWords' }
		]
	},

	perfectVictory: {
		id: 'perfectVictory',
		title: 'The Perfect Redemption',
		description: 'The curse is completely broken. Where once stood a tormented dragon, now stands Aethonaris in his true form - a magnificent golden dragon whose very presence radiates peace and wisdom. The land around you already begins to heal, and you feel the village\'s suffering ending.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 1;
				state.experience += 200;
				return state;
			});
		},
		choices: [
			{ text: 'Celebrate with Aethonaris', nextScene: 'celebrateWithDragon' },
			{ text: 'Return to the village as the greatest hero', nextScene: 'ultimateHeroReturn' },
			{ text: 'Ask Aethonaris to teach you', nextScene: 'dragonMentor' }
		]
	},

	celebrateWithDragon: {
		id: 'celebrateWithDragon',
		title: 'Joy Restored',
		description: 'Aethonaris\'s joy is infectious. For the first time in centuries, he can express his true nature. He tells you of his gratitude and offers to be your eternal ally. The land itself seems to celebrate, with flowers blooming and the air growing sweet.',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 50;
				return state;
			});
		},
		choices: [
			{ text: 'Return to share the good news', nextScene: 'ultimateHeroReturn' },
			{ text: 'Ask to learn from him', nextScene: 'dragonMentor' },
			{ text: 'Plan how to help restore the land', nextScene: 'landRestoration' }
		]
	},

	dragonMentor: {
		id: 'dragonMentor',
		title: 'The Dragon\'s Student',
		description: 'Aethonaris offers to teach you the ancient ways of magic and wisdom. Under his tutelage, you could become one of the most powerful and wise magic users in the land. This would be an incredible honor and opportunity.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 5;
				state.diplomacy += 3;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'Accept and begin your studies', nextScene: 'magicalEducation' },
			{ text: 'Return to help the village first', nextScene: 'ultimateHeroReturn' },
			{ text: 'Ask to help restore the entire region', nextScene: 'landRestoration' }
		]
	},

	landRestoration: {
		id: 'landRestoration',
		title: 'Healing the Land',
		description: 'Together with Aethonaris, you work to restore the damage caused by the curse. Villages flourish, crops grow abundantly, and the people prosper under the protection of their restored guardian. You become known as the Hero of Restoration.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 2;
				state.experience += 150;
				return state;
			});
		},
		choices: [
			{ text: 'Settle down as a permanent protector', nextScene: 'becomeGuardian' },
			{ text: 'Travel to help other lands', nextScene: 'wanderingHero' },
			{ text: 'Study magic with Aethonaris', nextScene: 'magicalEducation' }
		]
	},

	magicalEducation: {
		id: 'magicalEducation',
		title: 'Master of Magic',
		description: 'Under Aethonaris\'s guidance, you become a master of transformative magic. You learn not just to fight evil, but to heal it at its source. Your reputation as a wise and powerful ally spreads throughout the land.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 10;
				state.level += 3;
				state.experience += 200;
				return state;
			});
		},
		choices: [
			{ text: 'Begin a new adventure with your new powers', nextScene: 'start' },
			{ text: 'Establish a school of transformation magic', nextScene: 'magicSchool' },
			{ text: 'Seek out other cursed beings to help', nextScene: 'curseBreakerQuest' }
		]
	},

	towerConversation: {
		id: 'towerConversation',
		title: 'Speaking with the Dragon',
		description: 'You continue your conversation with Aethonaris from the base of the tower. His voice carries down, filled with pain but also growing hope. "No one has spoken my name with kindness for so long. What brings you here, brave soul?"',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Explain your mission to break the curse', nextScene: 'explainMission' },
			{ text: 'Ask about his suffering', nextScene: 'askSuffering' },
			{ text: 'Offer to come up and help directly', nextScene: 'offerDirectHelp' },
			{ text: 'Share what you\'ve learned about his true nature', nextScene: 'shareKnowledge' }
		]
	},

	explainMission: {
		id: 'explainMission',
		title: 'Mission of Mercy',
		description: 'You explain your mission to break the curse and restore him to his true nature. Aethonaris\'s voice trembles with emotion: "You would... help me? Not destroy me? I had given up hope that anyone would see past this monstrous form to who I once was."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Climb up to perform the healing ritual', nextScene: 'climbTowerPeaceful' },
			{ text: 'Ask him to guide you in breaking the curse', nextScene: 'askGuidance' },
			{ text: 'Reassure him of your intentions', nextScene: 'reassureDragon' }
		]
	},

	askSuffering: {
		id: 'askSuffering',
		title: 'Understanding Pain',
		description: 'Aethonaris speaks of his torment: "The curse doesn\'t just change my form - it inverts my very nature. Every impulse to protect becomes an urge to destroy. Every feeling of love becomes rage. I am trapped in a nightmare of my own actions, unable to stop myself."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to end his suffering', nextScene: 'promiseHealing' },
			{ text: 'Ask how the curse can be broken', nextScene: 'askCureMethod' },
			{ text: 'Offer immediate comfort', nextScene: 'offerComfort' }
		]
	},

	askGuidance: {
		id: 'askGuidance',
		title: 'Seeking Wisdom',
		description: 'Aethonaris shares his knowledge: "The Blade of Transformation can cut the ethereal chains that bind me, but it requires one who can see my true nature beneath this cursed form. You must look upon me with compassion, not fear, and strike at the curse itself, not my flesh."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Confirm you have the Blade of Transformation', nextScene: 'confirmBlade', condition: () => get(gameStore).hasSword },
			{ text: 'Promise to find the blade first', nextScene: 'promiseBlade', condition: () => !get(gameStore).hasSword },
			{ text: 'Ask about preparing yourself mentally', nextScene: 'mentalPreparation' }
		]
	},

	confirmBlade: {
		id: 'confirmBlade',
		title: 'The Key to Freedom',
		description: 'When you confirm you possess the Blade of Transformation, Aethonaris\'s voice fills with hope: "Then there is truly hope for my redemption! Come, brave hero, and let us end this curse together. I will guide you through the ritual."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Climb to meet him and begin the ritual', nextScene: 'climbTowerPeaceful' },
			{ text: 'Ask for specific instructions first', nextScene: 'askInstructions' },
			{ text: 'Request his blessing before beginning', nextScene: 'requestBlessing' }
		]
	},

	promiseBlade: {
		id: 'promiseBlade',
		title: 'A Vow to Return',
		description: 'You promise to find the Blade of Transformation and return to free him. Aethonaris responds with deep gratitude: "Your compassion gives me strength to endure a little longer. Find the blade behind the waterfall, and return to break these cursed chains."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Leave immediately to find the blade', nextScene: 'waterfall' },
			{ text: 'Ask for more guidance about the ritual', nextScene: 'askInstructions' },
			{ text: 'Promise to return quickly', nextScene: 'promiseReturn' }
		]
	},

	promiseReturn: {
		id: 'promiseReturn',
		title: 'Vow of Return',
		description: 'You make a solemn vow to return with the means to free him. This promise seems to ease some of Aethonaris\'s suffering, and you feel strengthened by your commitment to help him.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Head to the waterfall to find the blade', nextScene: 'waterfall' },
			{ text: 'Return to the village to share hope', nextScene: 'shareHope' },
			{ text: 'Gather more resources first', nextScene: 'deepForest' }
		]
	},

	shareHope: {
		id: 'shareHope',
		title: 'Bringing Hope',
		description: 'You return to the village with the incredible news that the dragon can be saved rather than slain. The villagers are amazed and hopeful, and many offer additional help for your return journey to complete the rescue.',
		onEnter: () => {
			gameStore.update(state => {
				state.health = 100;
				state.magic = 100;
				state.gold += 50;
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Return to find the Blade of Transformation', nextScene: 'waterfall' },
			{ text: 'Gather a party to witness the dragon\'s redemption', nextScene: 'gatherWitnesses' },
			{ text: 'Prepare more thoroughly for the ritual', nextScene: 'prepareRitual' }
		]
	},

	senseTower: {
		id: 'senseTower',
		title: 'Magical Perception',
		description: 'Using your magical senses, you perceive the true nature of what awaits above. The magical signature is not that of an evil beast, but of a noble creature wrapped in layers of cursed magic. The suffering you sense is immense, but so is the inherent goodness beneath.',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Climb the stairs with this understanding', nextScene: 'climbTowerKnowing' },
			{ text: 'Call out with compassion first', nextScene: 'callOut' },
			{ text: 'Prepare yourself mentally for what you\'ll face', nextScene: 'mentalPreparation' }
		]
	},

	climbTowerKnowing: {
		id: 'climbTowerKnowing',
		title: 'Ascent with Understanding',
		description: 'You climb the tower stairs with full knowledge of what awaits - not a monster to be slain, but a noble soul to be saved. This understanding gives you confidence and helps you approach with the right mindset.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Reach the top and greet Aethonaris with respect', nextScene: 'respectfulGreeting' },
			{ text: 'Announce your peaceful intentions as you climb', nextScene: 'peaceAnnouncement' },
			{ text: 'Prepare to show the Blade of Transformation', nextScene: () => get(gameStore).hasSword ? 'showBlade' : 'climbTower' }
		]
	},

	respectfulGreeting: {
		id: 'respectfulGreeting',
		title: 'Honor and Respect',
		description: 'You greet Aethonaris with the respect due to his true nature: "Noble Aethonaris, guardian of the land, I have come to offer aid, not harm." His eyes widen with surprise and the first hope he\'s felt in centuries.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Explain your mission to break his curse', nextScene: 'explainCurseBreaking' },
			{ text: 'Show the Blade of Transformation', nextScene: 'showBlade', condition: () => get(gameStore).hasSword },
			{ text: 'Ask how you can help restore him', nextScene: 'askRestoration' }
		]
	},

	explainCurseBreaking: {
		id: 'explainCurseBreaking',
		title: 'Mission of Restoration',
		description: 'You explain your understanding of his curse and your mission to break it. Aethonaris listens with growing amazement: "You truly understand! Yes, I am trapped by Malachar\'s curse, forced to act against my nature. If you can indeed break these chains..."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Show him the Blade of Transformation', nextScene: 'showBlade', condition: () => get(gameStore).hasSword },
			{ text: 'Ask him to guide the ritual', nextScene: 'requestGuidance' },
			{ text: 'Promise to complete the restoration', nextScene: 'promiseRestoration' }
		]
	},

	requestGuidance: {
		id: 'requestGuidance',
		title: 'Seeking the Dragon\'s Help',
		description: 'You ask Aethonaris to guide you in the curse-breaking ritual. His response is filled with gratitude: "That you would trust me to guide my own salvation shows the purity of your heart. Yes, I will help you understand what must be done."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the guided ritual', nextScene: () => get(gameStore).hasSword ? 'guidedRitual' : 'needBladeFirst' },
			{ text: 'Ask about the specific steps involved', nextScene: 'ritualSteps' },
			{ text: 'Request his blessing before beginning', nextScene: 'dragonBlessing' }
		]
	},

	needBladeFirst: {
		id: 'needBladeFirst',
		title: 'Missing Component',
		description: 'Aethonaris notices you lack the crucial component: "I sense great power within you, but you do not yet carry the Blade of Transformation. You must retrieve it from the sacred cave behind the waterfall before we can proceed."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to return with the blade', nextScene: 'promiseBlade' },
			{ text: 'Ask for guidance while you\'re gone', nextScene: 'askAdvice' },
			{ text: 'Leave immediately to retrieve it', nextScene: 'waterfall' }
		]
	},

	askAdvice: {
		id: 'askAdvice',
		title: 'The Dragon\'s Counsel',
		description: 'Aethonaris offers wise counsel: "When you retrieve the blade, remember that it responds to intention. Hold thoughts of healing, not harm. See me as I truly am, not as this curse makes me appear. Only then can you cut the chains that bind my soul."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.magic_skill += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Thank him and retrieve the blade', nextScene: 'waterfall' },
			{ text: 'Ask about what to expect during the ritual', nextScene: 'ritualExpectations' },
			{ text: 'Promise to return soon', nextScene: 'promiseReturn' }
		]
	},

	ritualExpectations: {
		id: 'ritualExpectations',
		title: 'Understanding the Process',
		description: 'Aethonaris explains what to expect: "The ritual may show you visions of my past, the moment of my cursing, and glimpses of my true nature. Do not let the curse\'s illusions fool you. Trust in your compassion and the blade\'s power to transform."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Express confidence in your preparation', nextScene: 'expressConfidence' },
			{ text: 'Go retrieve the blade now', nextScene: 'waterfall' },
			{ text: 'Ask for his blessing', nextScene: 'dragonBlessing' }
		]
	},

	expressConfidence: {
		id: 'expressConfidence',
		title: 'Confidence and Determination',
		description: 'You express your confidence in your ability to see past the curse to his true nature. Aethonaris is moved by your certainty: "Your faith gives me strength. I believe you truly can succeed where others might fail."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Go retrieve the Blade of Transformation', nextScene: 'waterfall' },
			{ text: 'Request his blessing before leaving', nextScene: 'dragonBlessing' },
			{ text: 'Promise to return and complete his salvation', nextScene: 'promiseReturn' }
		]
	},

	climbTower: {
		id: 'climbTower',
		title: 'The Dragon\'s Lair',
		description: () => {
			const state = get(gameStore);
			if (state.curseKnowledge && state.hasSword) {
				return 'You reach the top of the tower and behold Aethonaris - the great dragon whose scales shimmer between gold and deep sorrow. His ancient eyes meet yours with a mixture of hope and despair. "You carry the Blade of Transformation," he says. "Do you come to end my suffering, or to grant me redemption?"';
			} else if (state.hasSword) {
				return 'You reach the top of the tower and find yourself face to face with a massive dragon. His scales are magnificent but his eyes burn with anguish. He sees the ancient sword in your hand and speaks: "Another hero comes to slay the monster. Very well. Let us end this."';
			} else if (state.curseKnowledge) {
				return 'You reach the top and see the great dragon Aethonaris. Without a proper weapon, you feel vulnerable, but your knowledge of his true nature gives you confidence. "You know my story," he says wonderingly. "Few have understood the truth."';
			} else {
				return 'You reach the top of the tower and find yourself face to face with a massive red dragon. His eyes burn like embers and smoke billows from his nostrils. Without preparation, you feel completely overwhelmed by this magnificent and terrifying creature.';
			}
		},
		choices: () => {
			const state = get(gameStore);
			let choices = [];
			if (state.hasSword && state.curseKnowledge) {
				choices.push(
					{ text: 'Offer to break the curse and restore his true form', nextScene: 'breakCurse' },
					{ text: 'Fight the dragon to end his suffering', nextScene: 'fightDragon' },
					{ text: 'Try to find a middle path', nextScene: 'findBalance' }
				);
			} else if (state.hasSword) {
				choices.push(
					{ text: 'Attack the dragon with the ancient sword', nextScene: 'fightDragon' },
					{ text: 'Try to communicate before fighting', nextScene: 'talkDragon' }
				);
			} else if (state.curseKnowledge) {
				choices.push(
					{ text: 'Speak about breaking the curse', nextScene: 'discussCurse' },
					{ text: 'Try to comfort the dragon', nextScene: 'comfortDragon' }
				);
			} else {
				choices.push(
					{ text: 'Try to communicate with the dragon', nextScene: 'talkDragonNoSword' },
					{ text: 'Run back down the stairs immediately', nextScene: 'unlockTower' }
				);
			}
			choices.push({ text: 'Retreat to the stairs', nextScene: 'unlockTower' });
			return choices;
		}
	},

	findBalance: {
		id: 'findBalance',
		title: 'The Middle Path',
		description: 'You seek a balance between combat and compassion, showing the blade but speaking of healing. Aethonaris responds thoughtfully: "You understand both my power and my pain. Perhaps there is indeed a way to break this curse without either of us having to die."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Propose the transformation ritual', nextScene: 'proposeRitual' },
			{ text: 'Ask him to trust you completely', nextScene: 'askTrust' },
			{ text: 'Show him the blade as a tool of healing', nextScene: 'showHealing' }
		]
	},

	proposeRitual: {
		id: 'proposeRitual',
		title: 'The Proposal',
		description: 'You propose the transformation ritual, explaining how the blade can cut the cursed chains rather than his flesh. Aethonaris listens with growing hope: "Yes... yes, I remember now. The ritual of transformation. If you truly have the courage to attempt it..."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the ritual immediately', nextScene: 'breakCurse' },
			{ text: 'Ask for his guidance in the process', nextScene: 'dragonGuidance' },
			{ text: 'Request his permission to proceed', nextScene: 'askPermission' }
		]
	},

	askPermission: {
		id: 'askPermission',
		title: 'Respect and Consent',
		description: 'You respectfully ask Aethonaris for permission to attempt the ritual. His eyes fill with tears of gratitude: "That you would ask my consent... no one has treated me with such respect since the curse began. Yes, brave soul, I give you my full permission and blessing."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the ritual with his blessing', nextScene: 'blessedRitual' },
			{ text: 'Thank him for his trust', nextScene: 'thankDragon' },
			{ text: 'Promise to be worthy of his faith', nextScene: 'promiseWorthy' }
		]
	},

	blessedRitual: {
		id: 'blessedRitual',
		title: 'Ritual of Sacred Transformation',
		description: 'With Aethonaris\'s full blessing and cooperation, you begin the most perfect version of the transformation ritual. His willing participation makes the magic flow smoothly, and you can see the cursed chains clearly as you prepare to cut them.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 150;
				state.magic_skill += 3;
				state.diplomacy += 3;
				return state;
			});
		},
		choices: [
			{ text: 'Complete the perfect transformation', nextScene: 'perfectVictory' },
			{ text: 'Channel pure love and compassion', nextScene: 'loveTransformation' }
		]
	},

	loveTransformation: {
		id: 'loveTransformation',
		title: 'Transformation Through Love',
		description: 'You channel pure love and compassion through the blade, creating the most powerful form of transformative magic. The curse doesn\'t just break - it transforms into a blessing, making Aethonaris even more magnificent than he was before.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 3;
				state.experience += 300;
				state.diplomacy += 5;
				state.magic_skill += 5;
				return state;
			});
		},
		choices: [
			{ text: 'Witness the ultimate transformation', nextScene: 'ultimateVictory' },
			{ text: 'Celebrate the power of love over hatred', nextScene: 'celebrateLove' }
		]
	},

	ultimateVictory: {
		id: 'ultimateVictory',
		title: 'The Ultimate Triumph',
		description: 'You have achieved the most perfect victory possible. Aethonaris is not just restored but elevated, becoming a being of pure light and love. The entire region is transformed, becoming a paradise. You are remembered as the greatest hero who ever lived.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 5;
				state.experience += 500;
				return state;
			});
		},
		choices: [
			{ text: 'Become the eternal protector of this paradise', nextScene: 'eternalGuardian' },
			{ text: 'Travel to spread this transformation to other lands', nextScene: 'transformationMissionary' },
			{ text: 'Begin a new adventure in this perfect world', nextScene: 'start' }
		]
	},

	talkDragon: {
		id: 'talkDragon',
		title: 'Attempting Communication',
		description: 'You lower your sword slightly and attempt to speak with the dragon. Aethonaris pauses, surprised: "You would speak before striking? How... unusual. Most heroes simply attack." There\'s a hint of curiosity in his ancient voice.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about his pain and suffering', nextScene: 'askAboutPain' },
			{ text: 'Explain that you might be able to help him', nextScene: 'offerHelp' },
			{ text: 'Question him about the curse', nextScene: 'questionCurse' },
			{ text: 'Challenge him to honorable combat', nextScene: 'honorableCombat' }
		]
	},

	askAboutPain: {
		id: 'askAboutPain',
		title: 'Understanding Suffering',
		description: 'You ask Aethonaris about his pain. The dragon\'s expression shifts, showing vulnerability: "You... you see my suffering? Most see only the monster. Yes, I am in constant agony, forced to act against my true nature. But why would you care?"',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Explain that you want to help break his curse', nextScene: 'offerCureHelp' },
			{ text: 'Express genuine compassion for his situation', nextScene: 'showCompassion' },
			{ text: 'Ask if there\'s a way to end his suffering', nextScene: 'askCureSolution' }
		]
	},

	offerCureHelp: {
		id: 'offerCureHelp',
		title: 'Offering Salvation',
		description: 'You explain that you want to help break his curse rather than simply slay him. Aethonaris stares in amazement: "You would... save me? Not destroy me? I had not dared to hope... But yes, this blade you carry might indeed be able to cut the cursed chains that bind me."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the transformation ritual', nextScene: 'breakCurse' },
			{ text: 'Ask him to guide you through the process', nextScene: 'dragonGuidance' },
			{ text: 'Request his trust before proceeding', nextScene: 'askTrust' }
		]
	},

	showCompassion: {
		id: 'showCompassion',
		title: 'Genuine Empathy',
		description: 'You express genuine compassion for Aethonaris\'s suffering. Tears form in the dragon\'s ancient eyes: "Compassion... I had forgotten such existed. You remind me of who I once was, before this curse consumed me. Perhaps... perhaps there is hope yet."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Offer to help restore who he once was', nextScene: 'offerRestoration' },
			{ text: 'Ask about his life before the curse', nextScene: 'askPastLife' },
			{ text: 'Propose using the blade to heal rather than harm', nextScene: 'proposeHealing' }
		]
	},

	askPastLife: {
		id: 'askPastLife',
		title: 'Memories of Glory',
		description: 'Aethonaris speaks of his past with growing clarity: "I was the guardian of this land, protector of its people. I healed the sick, ensured good harvests, and brought peace. The curse has turned all of that into its opposite. But speaking of it... I remember more clearly now."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to help him become that guardian again', nextScene: 'promiseRestoration' },
			{ text: 'Use the blade to cut away the curse', nextScene: 'breakCurse' },
			{ text: 'Ask him to remember even more of who he was', nextScene: 'encourageMemory' }
		]
	},

	encourageMemory: {
		id: 'encourageMemory',
		title: 'Awakening Memory',
		description: 'You encourage Aethonaris to remember more of his true self. As he speaks of his past noble deeds, you can see the curse\'s hold weakening. His form seems to shimmer between the cursed dragon and glimpses of his true, golden self.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.magic_skill += 1;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Strike now while the curse is weakened', nextScene: 'breakCurse' },
			{ text: 'Continue helping him remember', nextScene: 'deepMemory' },
			{ text: 'Ask him to help guide the transformation', nextScene: 'dragonGuidance' }
		]
	},

	deepMemory: {
		id: 'deepMemory',
		title: 'Reclaiming Identity',
		description: 'As Aethonaris remembers more of his true nature, the tower itself begins to change. The oppressive atmosphere lifts, and you can see his true golden scales beginning to show through the cursed exterior. "I remember... I remember who I am," he whispers with wonder.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Help him complete the self-transformation', nextScene: 'selfTransformation' },
			{ text: 'Use the blade to finalize his freedom', nextScene: 'breakCurse' },
			{ text: 'Celebrate his return to awareness', nextScene: 'celebrateAwakening' }
		]
	},

	selfTransformation: {
		id: 'selfTransformation',
		title: 'Transformation Through Self-Realization',
		description: 'Through your encouragement and his own recovered memories, Aethonaris begins to transform himself. This is the most beautiful form of breaking the curse - not through force, but through rediscovering his true identity. The transformation is gentle and filled with light.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 200;
				state.diplomacy += 5;
				state.level += 2;
				return state;
			});
		},
		choices: [
			{ text: 'Witness his complete restoration', nextScene: 'perfectVictory' },
			{ text: 'Join in celebrating his freedom', nextScene: 'celebrateWithDragon' },
			{ text: 'Ask to learn from his wisdom', nextScene: 'dragonMentor' }
		]
	},

	celebrateAwakening: {
		id: 'celebrateAwakening',
		title: 'Joy of Recognition',
		description: 'You celebrate Aethonaris\'s awakening to his true self. The joy is infectious, and for the first time in centuries, genuine laughter echoes through the tower. The curse\'s power continues to weaken with each moment of authentic joy.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Complete the transformation with the blade', nextScene: 'breakCurse' },
			{ text: 'Let him continue the self-transformation', nextScene: 'selfTransformation' },
			{ text: 'Ask how you can help finalize his freedom', nextScene: 'askHowToHelp' }
		]
	},

	askHowToHelp: {
		id: 'askHowToHelp',
		title: 'Seeking Direction',
		description: 'You ask Aethonaris how you can best help complete his transformation. He considers thoughtfully: "Your compassion has already done so much. Now, if you could use that blade to cut the final bonds... but do it with love, not violence."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Use the blade with perfect love and compassion', nextScene: 'loveTransformation' },
			{ text: 'Begin the guided ritual', nextScene: 'guidedRitual' },
			{ text: 'Ask for his continued guidance', nextScene: 'dragonGuidance' }
		]
	},

	proposeHealing: {
		id: 'proposeHealing',
		title: 'The Path of Healing',
		description: 'You propose using the blade to heal rather than harm. Aethonaris\'s eyes widen with hope: "Yes... the Blade of Transformation. I had heard legends but never dared hope someone would use it for healing rather than destruction. You truly are different from other heroes."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the healing ritual', nextScene: 'breakCurse' },
			{ text: 'Ask for his guidance in the process', nextScene: 'dragonGuidance' },
			{ text: 'Express your commitment to healing over violence', nextScene: 'commitToHealing' }
		]
	},

	commitToHealing: {
		id: 'commitToHealing',
		title: 'Vow of Compassion',
		description: 'You make a solemn vow to use your power for healing rather than destruction. Aethonaris is deeply moved: "Your oath gives me strength. I believe that together, we can break this curse and restore what was lost."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.magic_skill += 1;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the transformation ritual', nextScene: 'breakCurse' },
			{ text: 'Ask him to share his wisdom', nextScene: 'requestWisdom' },
			{ text: 'Seal your vow with the ritual', nextScene: 'vowRitual' }
		]
	},

	vowRitual: {
		id: 'vowRitual',
		title: 'Sacred Oath',
		description: 'You combine your vow of compassion with the transformation ritual, creating a sacred ceremony. The blade glows with pure, healing light as you and Aethonaris work together to break the curse through the power of your shared commitment to healing.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 150;
				state.diplomacy += 4;
				state.magic_skill += 3;
				return state;
			});
		},
		choices: [
			{ text: 'Complete the sacred transformation', nextScene: 'perfectVictory' },
			{ text: 'Witness the power of compassion over cursing', nextScene: 'compassionVictory' }
		]
	},

	compassionVictory: {
		id: 'compassionVictory',
		title: 'Victory Through Compassion',
		description: 'Your victory through pure compassion creates a transformation beyond what anyone thought possible. Not only is Aethonaris restored, but the very nature of the tower and surrounding land is elevated. This becomes a sacred place of healing.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 2;
				state.experience += 200;
				return state;
			});
		},
		choices: [
			{ text: 'Establish this as a sanctuary of healing', nextScene: 'healingSanctuary' },
			{ text: 'Return to share this victory with the world', nextScene: 'ultimateHeroReturn' },
			{ text: 'Learn from Aethonaris to become a healer yourself', nextScene: 'dragonMentor' }
		]
	},

	healingSanctuary: {
		id: 'healingSanctuary',
		title: 'The Sacred Sanctuary',
		description: 'You and Aethonaris establish the tower as a sanctuary of healing, where others can come to learn the power of compassion over violence. Your legend spreads as the hero who chose healing over conquest.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 3;
				state.experience += 250;
				return state;
			});
		},
		choices: [
			{ text: 'Become the sanctuary\'s guardian', nextScene: 'sanctuaryGuardian' },
			{ text: 'Travel to establish more sanctuaries', nextScene: 'healingMissionary' },
			{ text: 'Train others in the art of compassionate healing', nextScene: 'healingTeacher' }
		]
	},

	questionCurse: {
		id: 'questionCurse',
		title: 'Investigating the Curse',
		description: 'You question Aethonaris about the curse affecting him. He responds with surprise at your interest: "You want to understand rather than simply destroy? The curse was placed by the sorcerer Malachar, twisting my protective nature into destructive rage. Few have cared to learn the truth."',
		onEnter: () => {
			gameStore.update(state => {
				state.curseKnowledge = true;
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about breaking the curse', nextScene: 'askCureMethod' },
			{ text: 'Express sympathy for his situation', nextScene: 'showCompassion' },
			{ text: 'Offer to help end his suffering', nextScene: 'offerCureHelp' },
			{ text: 'Challenge him to combat anyway', nextScene: 'honorableCombat' }
		]
	},

	askCureMethod: {
		id: 'askCureMethod',
		title: 'Seeking Solutions',
		description: 'You ask Aethonaris about methods to break the curse. His voice carries newfound hope: "The Blade of Transformation that you carry... it could cut the ethereal chains that bind me. But it requires one who sees my true nature, not just the monster the curse makes me appear."',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Assure him you see his true nature', nextScene: 'reassureNature' },
			{ text: 'Begin the transformation ritual', nextScene: 'breakCurse' },
			{ text: 'Ask for his guidance in the process', nextScene: 'dragonGuidance' }
		]
	},

	reassureNature: {
		id: 'reassureNature',
		title: 'Recognition of Truth',
		description: 'You assure Aethonaris that you see his true, noble nature beneath the curse. Tears of joy stream down his scaled face: "Yes... yes, I believe you do see me. Not the monster, but the guardian I was meant to be. Please, help me reclaim that identity."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the ritual of restoration', nextScene: 'breakCurse' },
			{ text: 'Help him remember more of his true self', nextScene: 'encourageMemory' },
			{ text: 'Express your honor at meeting the true Aethonaris', nextScene: 'honorMeeting' }
		]
	},

	honorMeeting: {
		id: 'honorMeeting',
		title: 'Honoring the Guardian',
		description: 'You express your honor at meeting the true Aethonaris, guardian of the land. His response is filled with emotion: "To be honored rather than feared... I had forgotten such was possible. Your respect gives me strength to remember who I truly am."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Perform the ritual to restore his honor', nextScene: 'honorRestoration' },
			{ text: 'Ask to learn from his wisdom', nextScene: 'requestWisdom' },
			{ text: 'Begin the transformation with perfect respect', nextScene: 'respectfulTransformation' }
		]
	},

	honorRestoration: {
		id: 'honorRestoration',
		title: 'Restoring Honor',
		description: 'You perform the transformation ritual not just to break the curse, but to restore Aethonaris\'s honor and dignity. This approach creates the most profound form of healing, restoring not just his form but his sense of self-worth.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 200;
				state.diplomacy += 5;
				state.level += 2;
				return state;
			});
		},
		choices: [
			{ text: 'Witness his complete restoration', nextScene: 'perfectVictory' },
			{ text: 'Celebrate the return of the noble guardian', nextScene: 'guardianReturn' }
		]
	},

	guardianReturn: {
		id: 'guardianReturn',
		title: 'The Guardian\'s Return',
		description: 'Aethonaris stands restored not just in form but in purpose. The land immediately begins to flourish under his renewed protection. You have not just broken a curse, but restored a legendary guardian to his rightful place.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 1;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'Work with him to heal the land', nextScene: 'landRestoration' },
			{ text: 'Return to share the miraculous news', nextScene: 'ultimateHeroReturn' },
			{ text: 'Ask to serve as his companion', nextScene: 'guardianCompanion' }
		]
	},

	guardianCompanion: {
		id: 'guardianCompanion',
		title: 'Companion to the Guardian',
		description: 'You ask to serve as Aethonaris\'s companion in protecting the land. He gladly accepts: "To have a friend who saw past the curse to my true nature... there could be no greater honor. Together, we shall protect all who dwell in these lands."',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 2;
				state.experience += 150;
				return state;
			});
		},
		choices: [
			{ text: 'Begin your new life as a guardian', nextScene: 'newGuardianLife' },
			{ text: 'Help establish peace throughout the region', nextScene: 'establishPeace' },
			{ text: 'Learn the ancient ways of protection', nextScene: 'learnProtection' }
		]
	},

	respectfulTransformation: {
		id: 'respectfulTransformation',
		title: 'Transformation with Honor',
		description: 'You begin the transformation ritual with perfect respect and honor for Aethonaris. This approach creates a ceremony of dignity and grace, making the curse-breaking not just a healing, but a celebration of his true nature.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 175;
				state.diplomacy += 4;
				state.magic_skill += 2;
				return state;
			});
		},
		choices: [
			{ text: 'Complete the honorable transformation', nextScene: 'perfectVictory' },
			{ text: 'Celebrate his restored dignity', nextScene: 'dignityRestored' }
		]
	},

	dignityRestored: {
		id: 'dignityRestored',
		title: 'Dignity and Honor Renewed',
		description: 'The transformation restores not just Aethonaris\'s form but his dignity and honor. He stands proud and noble once again, and his gratitude knows no bounds. The respect you showed him has made this victory even more meaningful.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 1;
				state.experience += 75;
				return state;
			});
		},
		choices: [
			{ text: 'Accept his eternal friendship', nextScene: 'eternalFriendship' },
			{ text: 'Return to spread word of his restoration', nextScene: 'ultimateHeroReturn' },
			{ text: 'Ask to learn from his renewed wisdom', nextScene: 'dragonMentor' }
		]
	},

	eternalFriendship: {
		id: 'eternalFriendship',
		title: 'Bond of Eternal Friendship',
		description: 'You and Aethonaris form a bond of eternal friendship based on mutual respect and the shared experience of his transformation. This friendship becomes legendary, inspiring stories of cooperation between different beings.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 5;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'Adventure together across the lands', nextScene: 'friendshipAdventures' },
			{ text: 'Establish a new order of guardians', nextScene: 'guardianOrder' },
			{ text: 'Return to help others with your combined wisdom', nextScene: 'combinedWisdom' }
		]
	},

	honorableCombat: {
		id: 'honorableCombat',
		title: 'Challenge Accepted',
		description: 'You challenge Aethonaris to honorable combat. He appreciates the respect in your approach: "At least you offer me the dignity of a warrior\'s death rather than simple execution. Very well, let us fight with honor, and may the best warrior prevail."',
		onEnter: () => {
			gameStore.update(state => {
				state.combat += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Fight with honor and respect', nextScene: 'honorableVictory' },
			{ text: 'Try to show mercy during combat', nextScene: 'mercifulCombat' },
			{ text: 'Fight to win decisively', nextScene: 'fightDragon' }
		]
	},

	honorableVictory: {
		id: 'honorableVictory',
		title: 'Victory with Honor',
		description: 'You fight with honor and respect, and your approach impacts even the cursed dragon. As you strike the final blow, Aethonaris speaks: "You fought... with honor. Perhaps... there is hope for redemption even in death." He falls peacefully.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.combat += 2;
				state.diplomacy += 1;
				state.experience += 75;
				return state;
			});
		},
		choices: [
			{ text: 'Honor the fallen warrior', nextScene: 'honorDragon' },
			{ text: 'Speak words of respect over him', nextScene: 'respectfulFarewell' },
			{ text: 'Leave the tower with heavy heart', nextScene: 'melancholyVictory' }
		]
	},

	respectfulFarewell: {
		id: 'respectfulFarewell',
		title: 'Words of Respect',
		description: 'You speak respectful words over the fallen dragon, acknowledging his noble nature beneath the curse. As you do, a miracle occurs - your respect and recognition begin to break the curse even in death, and Aethonaris stirs.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 50;
				return state;
			});
		},
		choices: [
			{ text: 'Continue the farewell ritual', nextScene: 'miracleRevival' },
			{ text: 'Offer help if he\'s still alive', nextScene: 'offerFinalHelp' },
			{ text: 'Complete the respect ceremony', nextScene: 'respectCeremony' }
		]
	},

	miracleRevival: {
		id: 'miracleRevival',
		title: 'Miracle of Respect',
		description: 'Your genuine respect for Aethonaris\'s true nature performs a miracle - it breaks the curse even as he lay dying. He revives, transformed back to his noble form. "Your respect... even in my defeat... it freed me," he marvels.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 200;
				state.diplomacy += 5;
				state.level += 2;
				return state;
			});
		},
		choices: [
			{ text: 'Celebrate the miraculous transformation', nextScene: 'miracleCelebration' },
			{ text: 'Help him fully recover', nextScene: 'helpRecovery' },
			{ text: 'Marvel at the power of respect', nextScene: 'respectPower' }
		]
	},

	miracleCelebration: {
		id: 'miracleCelebration',
		title: 'Celebrating the Miracle',
		description: 'You and Aethonaris celebrate the incredible miracle of transformation through respect. This becomes one of the greatest legends ever told - how a hero\'s respect for his enemy broke a curse that weapons could not.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 1;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'Return to share this miraculous story', nextScene: 'ultimateHeroReturn' },
			{ text: 'Ask Aethonaris to teach you about miracles', nextScene: 'learnMiracles' },
			{ text: 'Work together to heal the land', nextScene: 'landRestoration' }
		]
	},

	learnMiracles: {
		id: 'learnMiracles',
		title: 'Student of Miracles',
		description: 'Aethonaris teaches you about the power of respect and compassion to work miracles. Under his guidance, you learn that the greatest magic comes not from force, but from genuine love and respect for all beings.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 5;
				state.diplomacy += 3;
				state.experience += 150;
				return state;
			});
		},
		choices: [
			{ text: 'Use this knowledge to help others', nextScene: 'miracleHealer' },
			{ text: 'Spread the teaching of respectful magic', nextScene: 'respectTeacher' },
			{ text: 'Continue learning from Aethonaris', nextScene: 'dragonMentor' }
		]
	},

	mercifulCombat: {
		id: 'mercifulCombat',
		title: 'Combat with Mercy',
		description: 'You fight but show mercy during combat, holding back from killing blows and trying to subdue rather than destroy. Aethonaris notices: "You... you fight with restraint. You seek to defeat, not to destroy. Why show mercy to a monster?"',
		onEnter: () => {
			gameStore.update(state => {
				state.combat += 1;
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Explain that you see his noble nature', nextScene: 'explainNature' },
			{ text: 'Offer to help break his curse instead', nextScene: 'offerCureHelp' },
			{ text: 'Ask if he wants to stop fighting', nextScene: 'askStopFighting' }
		]
	},

	explainNature: {
		id: 'explainNature',
		title: 'Seeing True Nature',
		description: 'You explain that you see his noble nature beneath the curse. Aethonaris stops fighting entirely: "You... you truly see me? Not the monster, but... who I really am? I had given up hope that anyone ever would again."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Offer to help restore his true form', nextScene: 'offerRestoration' },
			{ text: 'Put down your weapon as a gesture of trust', nextScene: 'showTrust' },
			{ text: 'Ask him to help you break the curse', nextScene: 'askCooperation' }
		]
	},

	showTrust: {
		id: 'showTrust',
		title: 'Gesture of Trust',
		description: 'You put down your weapon as a gesture of trust in Aethonaris\'s true nature. The dragon is overwhelmed by this display of faith: "You... you trust me? Even in this cursed form? Your faith in my true nature moves me beyond words."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 4;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Ask him to trust you in return', nextScene: 'mutualTrust' },
			{ text: 'Explain your mission to help him', nextScene: 'explainHelpMission' },
			{ text: 'Offer to perform the transformation ritual', nextScene: 'offerTransformation' }
		]
	},

	mutualTrust: {
		id: 'mutualTrust',
		title: 'Bond of Mutual Trust',
		description: 'You and Aethonaris establish a bond of mutual trust that transcends the curse. This trust becomes the foundation for the most perfect transformation possible, built on genuine understanding and respect.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 4;
				state.experience += 45;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the trust-based transformation', nextScene: 'trustTransformation' },
			{ text: 'Ask him to guide you in helping him', nextScene: 'guidanceRequest' },
			{ text: 'Work together to understand the curse', nextScene: 'collaborativeUnderstanding' }
		]
	},

	trustTransformation: {
		id: 'trustTransformation',
		title: 'Transformation Through Trust',
		description: 'The transformation ritual performed through mutual trust creates the most beautiful and complete healing possible. The curse doesn\'t just break - it transforms into a blessing, making both of you stronger and wiser.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 250;
				state.diplomacy += 6;
				state.magic_skill += 4;
				state.level += 3;
				return state;
			});
		},
		choices: [
			{ text: 'Celebrate the perfect transformation', nextScene: 'perfectVictory' },
			{ text: 'Marvel at the power of trust', nextScene: 'trustPower' },
			{ text: 'Plan a future built on this trust', nextScene: 'trustFuture' }
		]
	},

	trustPower: {
		id: 'trustPower',
		title: 'The Power of Trust',
		description: 'You witness firsthand the incredible power of trust to overcome even the darkest magic. This experience transforms your understanding of how to face challenges - not with force alone, but with genuine connection and faith.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.magic_skill += 2;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'Share this wisdom with the world', nextScene: 'shareWisdom' },
			{ text: 'Learn more from Aethonaris', nextScene: 'dragonMentor' },
			{ text: 'Use this power to help others', nextScene: 'helpOthers' }
		]
	},

	shareWisdom: {
		id: 'shareWisdom',
		title: 'Sharing the Wisdom of Trust',
		description: 'You dedicate your life to sharing the wisdom of trust and transformation. Your teachings spread across the land, showing others how to overcome conflict through understanding rather than force.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 2;
				state.diplomacy += 5;
				state.experience += 200;
				return state;
			});
		},
		choices: [
			{ text: 'Establish a school of peaceful resolution', nextScene: 'peaceSchool' },
			{ text: 'Travel as a teacher and healer', nextScene: 'wanderingTeacher' },
			{ text: 'Work with Aethonaris to spread wisdom', nextScene: 'wisdomPartnership' }
		]
	},

	askStopFighting: {
		id: 'askStopFighting',
		title: 'Proposing Peace',
		description: 'You ask Aethonaris if he wants to stop fighting. He pauses, confused: "Stop fighting? But... that\'s not how these encounters go. Heroes come to slay the monster. Yet you... you offer peace? I don\'t understand, but... yes, I would prefer peace."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Explain that you\'re different from other heroes', nextScene: 'explainDifference' },
			{ text: 'Propose working together instead', nextScene: 'proposeCooperation' },
			{ text: 'Ask about his true desires', nextScene: 'askTrueDesires' }
		]
	},

	explainDifference: {
		id: 'explainDifference',
		title: 'A Different Kind of Hero',
		description: 'You explain that you\'re a different kind of hero - one who seeks to heal rather than destroy. Aethonaris listens with growing wonder: "A hero who heals... I had not thought such possible. But yes, I can see it in you. You offer hope where others offer only death."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Offer to heal his curse', nextScene: 'offerCureHelp' },
			{ text: 'Ask to learn about his suffering', nextScene: 'askAboutPain' },
			{ text: 'Propose becoming allies', nextScene: 'proposeAlliance' }
		]
	},

	proposeAlliance: {
		id: 'proposeAlliance',
		title: 'Proposal of Alliance',
		description: 'You propose forming an alliance with Aethonaris. He\'s amazed by the concept: "An alliance? Between hero and dragon? Such things exist only in the oldest legends... but those legends speak of the greatest achievements. Yes, I would be honored to ally with you."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 4;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Seal the alliance by breaking his curse', nextScene: 'allianceTransformation' },
			{ text: 'Work together to understand the curse', nextScene: 'collaborativeUnderstanding' },
			{ text: 'Plan how to help the land together', nextScene: 'planCooperation' }
		]
	},

	allianceTransformation: {
		id: 'allianceTransformation',
		title: 'Transformation of Alliance',
		description: 'You seal your alliance by helping Aethonaris break free from his curse. This creates one of the most powerful partnerships in history - a hero and a dragon working together for the good of all.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 200;
				state.diplomacy += 5;
				state.level += 2;
				return state;
			});
		},
		choices: [
			{ text: 'Begin your legendary partnership', nextScene: 'legendaryPartnership' },
			{ text: 'Celebrate the formation of your alliance', nextScene: 'allianceCelebration' },
			{ text: 'Plan your first joint mission', nextScene: 'firstMission' }
		]
	},

	legendaryPartnership: {
		id: 'legendaryPartnership',
		title: 'The Legendary Partnership',
		description: 'Your partnership with Aethonaris becomes the stuff of legends. Together, you accomplish feats that neither could achieve alone, becoming symbols of cooperation and mutual respect across the land.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 2;
				state.experience += 250;
				return state;
			});
		},
		choices: [
			{ text: 'Continue your adventures together', nextScene: 'partnershipAdventures' },
			{ text: 'Establish a new order based on cooperation', nextScene: 'cooperationOrder' },
			{ text: 'Teach others about partnership', nextScene: 'partnershipTeacher' }
		]
	},

	discussCurse: {
		id: 'discussCurse',
		title: 'Understanding the Curse',
		description: 'You speak knowledgeably about the curse affecting Aethonaris. He\'s surprised and hopeful: "You understand my plight? Yes, this curse has bound me for so long, forcing me to act against my true nature. But if you know of it, perhaps you also know how it might be broken?"',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Explain that you can help break it', nextScene: 'explainBreaking' },
			{ text: 'Ask him to describe his experience with it', nextScene: 'askCurseExperience' },
			{ text: 'Offer comfort for his suffering', nextScene: 'comfortDragon' },
			{ text: 'Request his cooperation in breaking it', nextScene: 'requestCooperation' }
		]
	},

	explainBreaking: {
		id: 'explainBreaking',
		title: 'The Path to Freedom',
		description: 'You explain how the curse can be broken through the Blade of Transformation and genuine understanding. Aethonaris\'s hope grows: "You truly know the way? And you would help me rather than simply ending my life? Your compassion gives me more hope than I\'ve felt in centuries."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the transformation ritual', nextScene: () => get(gameStore).hasSword ? 'breakCurse' : 'needSwordForRitual' },
			{ text: 'Ask for his guidance in the process', nextScene: 'requestGuidance' },
			{ text: 'Assure him of your commitment to helping', nextScene: 'assureCommitment' }
		]
	},

	needSwordForRitual: {
		id: 'needSwordForRitual',
		title: 'Missing the Key Component',
		description: 'You realize you need the Blade of Transformation to complete the ritual. Aethonaris understands: "The blade behind the waterfall - yes, you must retrieve it first. I will wait here. For the first time in ages, I have hope that my torment might end."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to return with the blade', nextScene: 'promiseReturn' },
			{ text: 'Ask him to wait and stay strong', nextScene: 'encouragePatience' },
			{ text: 'Leave immediately to get the blade', nextScene: 'waterfall' }
		]
	},

	encouragePatience: {
		id: 'encouragePatience',
		title: 'Words of Encouragement',
		description: 'You encourage Aethonaris to stay strong and patient while you retrieve the blade. Your words give him strength: "Your kindness sustains me. I will endure a little longer, knowing that freedom is finally within reach."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to return quickly', nextScene: 'promiseReturn' },
			{ text: 'Leave to get the blade immediately', nextScene: 'waterfall' },
			{ text: 'Give him a token of your promise', nextScene: 'giveToken' }
		]
	},

	giveToken: {
		id: 'giveToken',
		title: 'Token of Promise',
		description: 'You give Aethonaris a token of your promise to return - perhaps a small item or simply your word given with great solemnity. He treasures this gesture deeply, and it gives him strength to endure.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Leave to retrieve the blade', nextScene: 'waterfall' },
			{ text: 'Make a formal vow to return', nextScene: 'formalVow' },
			{ text: 'Ask for his blessing on your quest', nextScene: 'requestBlessing' }
		]
	},

	formalVow: {
		id: 'formalVow',
		title: 'Sacred Vow',
		description: 'You make a formal, sacred vow to return and free Aethonaris from his curse. The solemnity and sincerity of your vow moves him deeply and creates a powerful magical bond between you.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.magic_skill += 1;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Depart to fulfill your vow', nextScene: 'waterfall' },
			{ text: 'Ask for his blessing', nextScene: 'requestBlessing' },
			{ text: 'Seal the vow with a magical oath', nextScene: 'magicalOath' }
		]
	},

	magicalOath: {
		id: 'magicalOath',
		title: 'Magical Oath of Liberation',
		description: 'You seal your vow with a magical oath that binds your fates together until the curse is broken. This creates a powerful connection that will strengthen you both and ensure your return to complete the liberation.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.diplomacy += 2;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Leave empowered by the oath', nextScene: 'waterfall' },
			{ text: 'Feel the magical connection strengthen you', nextScene: 'magicalStrength' }
		]
	},

	magicalStrength: {
		id: 'magicalStrength',
		title: 'Strength Through Connection',
		description: 'The magical connection with Aethonaris strengthens both of you. You feel his hope flowing into you, while your determination flows to him. This bond will make the eventual transformation even more powerful.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic += 30;
				state.health += 20;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Go retrieve the Blade of Transformation', nextScene: 'waterfall' },
			{ text: 'Return to the village to share hope', nextScene: 'shareHope' },
			{ text: 'Use this strength to prepare thoroughly', nextScene: 'thoroughPreparation' }
		]
	},

	thoroughPreparation: {
		id: 'thoroughPreparation',
		title: 'Complete Preparation',
		description: 'Empowered by your connection with Aethonaris, you take time to prepare thoroughly for the transformation ritual. You gather knowledge, strengthen your resolve, and ensure you\'re ready for this crucial moment.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.diplomacy += 1;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Now retrieve the Blade of Transformation', nextScene: 'waterfall' },
			{ text: 'Gather allies to witness the transformation', nextScene: 'gatherWitnesses' },
			{ text: 'Return to Aethonaris fully prepared', nextScene: 'returnPrepared' }
		]
	},

	returnPrepared: {
		id: 'returnPrepared',
		title: 'Return of the Prepared Hero',
		description: 'You return to Aethonaris fully prepared for the transformation ritual. He senses your readiness and preparation: "I can feel your determination and wisdom. You are truly ready to attempt what few would dare."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the ritual with perfect preparation', nextScene: () => get(gameStore).hasSword ? 'perfectRitual' : 'waterfall' },
			{ text: 'Share what you\'ve learned', nextScene: 'sharePreparation' },
			{ text: 'Ask for his final guidance', nextScene: 'requestFinalGuidance' }
		]
	},

	comfortDragon: {
		id: 'comfortDragon',
		title: 'Offering Comfort',
		description: 'You offer words of comfort to the suffering Aethonaris. Your compassion touches him deeply: "Comfort... I had forgotten such existed. Your kind words ease the pain more than you know. Perhaps there is hope for redemption after all."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to help end his suffering', nextScene: 'promiseHelp' },
			{ text: 'Ask how you can help him heal', nextScene: 'askHowToHeal' },
			{ text: 'Offer to stay and provide company', nextScene: 'offerCompanionship' },
			{ text: 'Share your understanding of his pain', nextScene: 'shareUnderstanding' }
		]
	},

	promiseHelp: {
		id: 'promiseHelp',
		title: 'Promise of Aid',
		description: 'You promise to help end Aethonaris\'s suffering through healing rather than death. His response is filled with emotion: "You would heal rather than harm? Such compassion... it reminds me of who I once was. Yes, please, help me if you can."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Begin the healing process', nextScene: () => get(gameStore).hasSword ? 'breakCurse' : 'needSwordForRitual' },
			{ text: 'Ask what he remembers of his true self', nextScene: 'askTrueMemories' },
			{ text: 'Explain the transformation ritual', nextScene: 'explainRitual' }
		]
	},

	askTrueMemories: {
		id: 'askTrueMemories',
		title: 'Recovering True Memories',
		description: 'You ask Aethonaris about his memories of his true self. As he speaks of his past as a guardian and protector, you can see the curse\'s hold weakening: "Yes... I remember now. I was a protector, not a destroyer. Your questions help me remember who I truly am."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Help him remember more', nextScene: 'encourageMemory' },
			{ text: 'Use these memories to weaken the curse', nextScene: 'memoryHealing' },
			{ text: 'Begin the transformation while he remembers', nextScene: () => get(gameStore).hasSword ? 'memoryTransformation' : 'needSwordForMemory' }
		]
	},

	memoryHealing: {
		id: 'memoryHealing',
		title: 'Healing Through Memory',
		description: 'You use Aethonaris\'s recovered memories to help weaken the curse. This psychological approach proves incredibly effective, as remembering his true nature begins to restore his true form even before any ritual.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.magic_skill += 1;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Complete the healing with the transformation ritual', nextScene: () => get(gameStore).hasSword ? 'breakCurse' : 'needSwordForRitual' },
			{ text: 'Continue the memory recovery process', nextScene: 'deepMemory' },
			{ text: 'Let him transform himself through memory', nextScene: 'selfHealing' }
		]
	},

	selfHealing: {
		id: 'selfHealing',
		title: 'Self-Directed Healing',
		description: 'Through recovered memories and your support, Aethonaris begins to heal himself. This form of transformation, driven by his own rediscovered identity, proves to be the most natural and complete healing possible.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 200;
				state.diplomacy += 5;
				state.level += 2;
				return state;
			});
		},
		choices: [
			{ text: 'Witness his complete self-restoration', nextScene: 'perfectVictory' },
			{ text: 'Support him through the final transformation', nextScene: 'supportTransformation' },
			{ text: 'Celebrate his return to true self', nextScene: 'celebrateReturn' }
		]
	},

	supportTransformation: {
		id: 'supportTransformation',
		title: 'Supporting the Transformation',
		description: 'You provide emotional and spiritual support as Aethonaris completes his self-directed transformation. Your presence and encouragement help ensure the process is smooth and complete.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 50;
				return state;
			});
		},
		choices: [
			{ text: 'Celebrate the successful transformation', nextScene: 'perfectVictory' },
			{ text: 'Thank him for trusting you', nextScene: 'thankForTrust' },
			{ text: 'Ask to learn from his experience', nextScene: 'learnFromExperience' }
		]
	},

	thankForTrust: {
		id: 'thankForTrust',
		title: 'Gratitude for Trust',
		description: 'You thank Aethonaris for trusting you to help him through his transformation. He responds with deep emotion: "No, it is I who should thank you. You saw my true nature when I had forgotten it myself. Your faith restored me."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Share in the joy of his restoration', nextScene: 'sharedJoy' },
			{ text: 'Ask to learn from his wisdom', nextScene: 'dragonMentor' },
			{ text: 'Plan how to help the land together', nextScene: 'landRestoration' }
		]
	},

	sharedJoy: {
		id: 'sharedJoy',
		title: 'Joy Shared',
		description: 'You and Aethonaris share in the pure joy of his restoration and the successful breaking of the curse. This moment of shared happiness creates a lasting bond between you and brings hope to the entire land.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Return to share the joyful news', nextScene: 'ultimateHeroReturn' },
			{ text: 'Work together to restore the region', nextScene: 'landRestoration' },
			{ text: 'Begin a lasting friendship', nextScene: 'eternalFriendship' }
		]
	},

	talkDragonNoSword: {
		id: 'talkDragonNoSword',
		title: 'Attempting Communication',
		description: 'Without a weapon, you attempt to communicate with the massive dragon. Aethonaris is surprised: "You come before me unarmed? Either you are very brave or very foolish. Speak quickly, before the curse compels me to act against my will."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Explain that you want to help him', nextScene: 'explainHelpIntent' },
			{ text: 'Ask about the curse affecting him', nextScene: 'askAboutCurse' },
			{ text: 'Express that you see his suffering', nextScene: 'expressSympathy' },
			{ text: 'Retreat quickly before he loses control', nextScene: 'quickRetreat' }
		]
	},

	explainHelpIntent: {
		id: 'explainHelpIntent',
		title: 'Declaring Intent to Help',
		description: 'You explain that you came not to fight but to help. Aethonaris struggles with the concept: "Help? No one helps the monster... but I sense sincerity in your words. The curse fights your kindness, but... I want to believe you."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to find a way to break his curse', nextScene: 'promiseCureSearch' },
			{ text: 'Ask what you can do to help him', nextScene: 'askHowToHelp' },
			{ text: 'Offer to stay and provide companionship', nextScene: 'offerCompanionship' }
		]
	},

	promiseCureSearch: {
		id: 'promiseCureSearch',
		title: 'Promise to Find a Cure',
		description: 'You promise to find a way to break Aethonaris\'s curse. Hope flickers in his ancient eyes: "You would... search for a cure? The hermit once spoke of such a possibility... a blade behind the waterfall. But I dare not hope too much."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to find the blade and return', nextScene: 'promiseReturn' },
			{ text: 'Ask for more details about the hermit\'s words', nextScene: 'askHermitDetails' },
			{ text: 'Leave immediately to search for the cure', nextScene: 'waterfall' }
		]
	},

	askHermitDetails: {
		id: 'askHermitDetails',
		title: 'Learning from the Past',
		description: 'Aethonaris shares what he remembers of the hermit\'s words: "He spoke of a Blade of Transformation, forged not to destroy but to heal. He said it could cut the chains of the curse if wielded by one pure of heart. You... you might be such a one."',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to prove worthy of the blade', nextScene: 'promiseWorthiness' },
			{ text: 'Ask for his blessing on your quest', nextScene: 'requestBlessing' },
			{ text: 'Leave to find the blade immediately', nextScene: 'waterfall' }
		]
	},

	promiseWorthiness: {
		id: 'promiseWorthiness',
		title: 'Vow of Worthiness',
		description: 'You promise to prove yourself worthy of wielding the Blade of Transformation. Aethonaris is moved by your determination: "Your very presence here, unarmed yet unafraid, already speaks to your worthiness. I believe you can succeed where others have failed."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Thank him for his faith in you', nextScene: 'thankForFaith' },
			{ text: 'Promise to return with the means to help him', nextScene: 'promiseReturn' },
			{ text: 'Ask for his guidance on being worthy', nextScene: 'askWorthyGuidance' }
		]
	},

	thankForFaith: {
		id: 'thankForFaith',
		title: 'Gratitude for Faith',
		description: 'You thank Aethonaris for his faith in you. He responds warmly: "Your courage gives me strength to endure. Knowing that someone believes in healing rather than destruction... it helps me remember who I once was."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Leave to find the blade with his blessing', nextScene: 'waterfall' },
			{ text: 'Ask him to hold onto hope while you\'re gone', nextScene: 'askForHope' },
			{ text: 'Make a formal vow to return', nextScene: 'formalVow' }
		]
	},

	askForHope: {
		id: 'askForHope',
		title: 'Request for Hope',
		description: 'You ask Aethonaris to hold onto hope while you search for the cure. He nods solemnly: "Hope... yes, I will hold onto hope. Your belief in the possibility of my redemption gives me reason to continue fighting the curse\'s influence."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Leave with his hope sustaining you', nextScene: 'waterfall' },
			{ text: 'Promise to return as quickly as possible', nextScene: 'promiseSpeed' },
			{ text: 'Give him something to remember you by', nextScene: 'giveToken' }
		]
	},

	promiseSpeed: {
		id: 'promiseSpeed',
		title: 'Promise of Swift Return',
		description: 'You promise to return as quickly as possible with the means to break his curse. Aethonaris appreciates your urgency: "Your haste gives me comfort. Each moment of the curse is agony, but knowing relief may come soon makes it bearable."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Rush to the waterfall immediately', nextScene: 'waterfall' },
			{ text: 'Ask for his final guidance', nextScene: 'requestFinalGuidance' },
			{ text: 'Assure him of your determination', nextScene: 'assureDetermination' }
		]
	},

	assureDetermination: {
		id: 'assureDetermination',
		title: 'Assurance of Determination',
		description: 'You assure Aethonaris of your absolute determination to save him. Your conviction strengthens both of you: "Your determination is like a beacon of light in my darkness. I will hold fast to it while you are gone."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Depart with renewed purpose', nextScene: 'waterfall' },
			{ text: 'Seal your determination with an oath', nextScene: 'magicalOath' },
			{ text: 'Ask him to strengthen your resolve', nextScene: 'requestStrength' }
		]
	},

	requestStrength: {
		id: 'requestStrength',
		title: 'Request for Strength',
		description: 'You ask Aethonaris to lend you strength for your quest. Despite his cursed state, he manages to bestow a blessing upon you: "Take what strength I can give. Though cursed, my desire to see you succeed is pure and powerful."',
		onEnter: () => {
			gameStore.update(state => {
				state.health += 20;
				state.magic += 20;
				state.diplomacy += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Thank him and depart strengthened', nextScene: 'waterfall' },
			{ text: 'Promise to use this strength wisely', nextScene: 'promiseWiseUse' },
			{ text: 'Feel the bond between you strengthen', nextScene: 'strengtheningBond' }
		]
	},

	promiseWiseUse: {
		id: 'promiseWiseUse',
		title: 'Promise of Wise Use',
		description: 'You promise to use Aethonaris\'s gift of strength wisely in your quest to save him. This creates a sacred bond that will help ensure your success in the trials ahead.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Depart to fulfill your sacred mission', nextScene: 'waterfall' },
			{ text: 'Ask for his final blessing', nextScene: 'requestBlessing' }
		]
	},

	strengtheningBond: {
		id: 'strengtheningBond',
		title: 'Bond of Mutual Support',
		description: 'You feel the bond between you and Aethonaris strengthen. This connection will help sustain both of you - you in your quest, and him in his struggle against the curse.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Use this bond to guide you to the blade', nextScene: 'waterfall' },
			{ text: 'Promise to return strengthened by this connection', nextScene: 'promiseConnection' }
		]
	},

	promiseConnection: {
		id: 'promiseConnection',
		title: 'Promise of Lasting Connection',
		description: 'You promise that the connection between you will endure and grow stronger, helping to break his curse. This promise creates a magical resonance that will aid in the transformation.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 2;
				state.diplomacy += 1;
				state.experience += 30;
				return state;
			});
		},
		choices: [
			{ text: 'Depart with this powerful connection', nextScene: 'waterfall' },
			{ text: 'Feel the magic of true friendship', nextScene: 'friendshipMagic' }
		]
	},

	friendshipMagic: {
		id: 'friendshipMagic',
		title: 'The Magic of Friendship',
		description: 'You discover that the connection between you and Aethonaris has created a powerful form of magic based on genuine friendship and mutual support. This magic will be crucial in breaking the curse.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 3;
				state.magic += 30;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Use this friendship magic to guide your quest', nextScene: 'waterfall' },
			{ text: 'Marvel at the power of genuine connection', nextScene: 'connectionPower' }
		]
	},

	connectionPower: {
		id: 'connectionPower',
		title: 'The Power of Connection',
		description: 'You marvel at how a genuine connection can create such powerful magic. This understanding will forever change how you approach challenges and relationships.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.magic_skill += 2;
				state.experience += 35;
				return state;
			});
		},
		choices: [
			{ text: 'Carry this wisdom to complete your quest', nextScene: 'waterfall' },
			{ text: 'Return to help others discover this power', nextScene: 'shareConnectionWisdom' }
		]
	},

	shareConnectionWisdom: {
		id: 'shareConnectionWisdom',
		title: 'Sharing the Wisdom of Connection',
		description: 'You decide to share your discovery about the power of genuine connection with others. This becomes part of your legacy - teaching that the strongest magic comes from authentic relationships.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 5;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'First complete Aethonaris\'s rescue', nextScene: 'waterfall' },
			{ text: 'Establish a school of connection magic', nextScene: 'connectionSchool' },
			{ text: 'Become a traveling teacher of friendship', nextScene: 'friendshipTeacher' }
		]
	},

	breakCurse: {
		id: 'breakCurse',
		title: 'The Ritual of Redemption',
		description: 'With the Blade of Transformation and your knowledge of the curse\'s true nature, you work together with Aethonaris to perform an ancient ritual. The sword glows with transformative light as you channel magic not to destroy, but to heal. The curse begins to unravel, and the dragon\'s form starts to shift.',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.experience += 100;
				state.magic_skill += 3;
				state.diplomacy += 3;
				return state;
			});
		},
		choices: [
			{ text: 'Complete the transformation ritual', nextScene: 'trueVictory' },
			{ text: 'Witness the dragon\'s redemption', nextScene: 'dragonRedeemed' }
		]
	},

	dragonRedeemed: {
		id: 'dragonRedeemed',
		title: 'The Dragon\'s Redemption',
		description: 'You witness Aethonaris\'s complete redemption as the curse is broken and he returns to his true, noble form. The transformation is beautiful and profound, filling the tower with golden light as his cursed scales become brilliant gold once more.',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 75;
				state.level += 1;
				return state;
			});
		},
		choices: [
			{ text: 'Celebrate with the redeemed dragon', nextScene: 'celebrateWithDragon' },
			{ text: 'Share in his joy and relief', nextScene: 'sharedJoy' },
			{ text: 'Ask to learn from his wisdom', nextScene: 'dragonMentor' }
		]
	},

	trueVictory: {
		id: 'trueVictory',
		title: 'The Hero\'s True Victory',
		description: 'The ritual is complete. Where once stood a cursed dragon, now stands Aethonaris in his true form - a wise guardian spirit of the land. The curse that plagued the region lifts like morning mist. The village\'s crops will grow again, the bridge stands strong, and the forest returns to its natural beauty. You have achieved the greatest victory of all - redemption through understanding.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 2;
				state.experience += 150;
				return state;
			});
		},
		choices: [
			{ text: 'Return to the village as a true hero', nextScene: 'heroReturn' },
			{ text: 'Stay to learn from Aethonaris', nextScene: 'learnFromGuardian' },
			{ text: 'Begin a new adventure', nextScene: 'start' }
		]
	},

	learnFromGuardian: {
		id: 'learnFromGuardian',
		title: 'Learning from the Guardian',
		description: 'You choose to stay and learn from Aethonaris, now restored to his role as guardian of the land. His ancient wisdom and deep understanding of magic, nature, and compassion provide you with invaluable knowledge.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 4;
				state.diplomacy += 3;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'Become his apprentice in guardianship', nextScene: 'guardianApprentice' },
			{ text: 'Learn the deepest secrets of transformation magic', nextScene: 'transformationMaster' },
			{ text: 'Study the balance between all living things', nextScene: 'balanceStudent' }
		]
	},

	guardianApprentice: {
		id: 'guardianApprentice',
		title: 'Apprentice Guardian',
		description: 'Under Aethonaris\'s guidance, you begin training as a guardian of the land. You learn to sense the needs of all living things and to use your power to protect and nurture rather than simply to fight.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 3;
				state.diplomacy += 2;
				state.level += 1;
				state.experience += 150;
				return state;
			});
		},
		choices: [
			{ text: 'Complete your guardian training', nextScene: 'fullGuardian' },
			{ text: 'Take your knowledge to help other regions', nextScene: 'regionHelper' },
			{ text: 'Establish a network of guardians', nextScene: 'guardianNetwork' }
		]
	},

	fullGuardian: {
		id: 'fullGuardian',
		title: 'True Guardian',
		description: 'You complete your training and become a true guardian alongside Aethonaris. Together, you protect and nurture the land, ensuring peace and prosperity for all who dwell there. Your partnership becomes legendary.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 3;
				state.experience += 300;
				return state;
			});
		},
		choices: [
			{ text: 'Continue your guardianship for years to come', nextScene: 'lifelongGuardian' },
			{ text: 'Train new guardians to expand protection', nextScene: 'guardianTrainer' },
			{ text: 'Begin a new adventure as a master guardian', nextScene: 'start' }
		]
	},

	fightDragon: {
		id: 'fightDragon',
		title: 'Epic Battle',
		description: () => get(gameStore).curseKnowledge ? 
			'Despite knowing the dragon\'s true nature, you choose to fight. The battle is fierce but swift. Your sword, guided by compassion even in combat, strikes true. As Aethonaris falls, he whispers: "Thank you... for ending my torment. Perhaps... in death... I find peace."' :
			'You raise the ancient sword, and it blazes with magical light. The dragon attacks with fire and claw, but the enchanted blade cuts through his defenses. After an epic battle, you strike the final blow. The dragon falls, and with his last breath, he speaks: "The curse... is broken... Thank you, warrior."',
		onEnter: () => {
			gameStore.update(state => {
				state.dragonDefeated = true;
				state.combat += 2;
				state.experience += 60;
				state.health -= 20;
				return state;
			});
		},
		choices: [
			{ text: 'Honor the fallen dragon', nextScene: 'honorDragon' },
			{ text: 'Explore the dragon\'s treasure hoard', nextScene: 'treasure' },
			{ text: 'Leave the tower victorious', nextScene: 'victory' }
		]
	},

	honorDragon: {
		id: 'honorDragon',
		title: 'Honoring the Fallen',
		description: () => get(gameStore).curseKnowledge ? 
			'You honor Aethonaris, knowing he was a noble soul trapped by a curse. As you speak words of respect and understanding, something miraculous happens - his body begins to glow with golden light, and his true form is revealed even in death.' :
			'You honor the fallen dragon, recognizing the warrior\'s spirit within the beast. Your respectful gesture seems to bring peace to the tower, and you sense that you have done more than simply win a battle.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Take a momento to remember him by', nextScene: 'dragonMemento' },
			{ text: 'Speak a prayer for his soul', nextScene: 'dragonPrayer' },
			{ text: 'Leave the tower with respect', nextScene: 'respectfulDeparture' }
		]
	},

	dragonMemento: {
		id: 'dragonMemento',
		title: 'A Token of Remembrance',
		description: 'You carefully take a single, beautiful scale as a momento of Aethonaris. As you do, the scale glows with warm light - a sign that his noble spirit approves of your respect.',
		onEnter: () => {
			gameStore.update(state => {
				state.inventory.push(items.dragonScale);
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Promise to tell his true story', nextScene: 'promiseStory' },
			{ text: 'Leave to share news of your victory', nextScene: 'victory' },
			{ text: 'Explore the rest of the tower', nextScene: 'exploreTower' }
		]
	},

	promiseStory: {
		id: 'promiseStory',
		title: 'Promise of Truth',
		description: 'You promise to tell Aethonaris\'s true story - not just of the monster he was forced to become, but of the noble guardian he truly was. This promise feels sacred and important.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 2;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Return to the village to tell his story', nextScene: 'tellTrueStory' },
			{ text: 'Record his story in the tower', nextScene: 'recordStory' },
			{ text: 'Carry his memory with you always', nextScene: 'carryMemory' }
		]
	},

	tellTrueStory: {
		id: 'tellTrueStory',
		title: 'Telling the True Story',
		description: 'You return to the village and tell the true story of Aethonaris - how he was a noble guardian cursed by a jealous sorcerer, and how he fought against his own cursed nature. The villagers are moved by the truth.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 50;
				return state;
			});
		},
		choices: [
			{ text: 'Help the village build a memorial to him', nextScene: 'buildMemorial' },
			{ text: 'Continue your adventures as a truth-telling hero', nextScene: 'truthHero' },
			{ text: 'Stay to help the village heal', nextScene: 'helpVillageHeal' }
		]
	},

	buildMemorial: {
		id: 'buildMemorial',
		title: 'Memorial to a Guardian',
		description: 'You help the village build a memorial to Aethonaris, honoring his true nature as a guardian rather than remembering him as a monster. This act of remembrance helps heal the land and the people.',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 3;
				state.experience += 75;
				state.level += 1;
				return state;
			});
		},
		choices: [
			{ text: 'Dedicate your life to honoring fallen heroes', nextScene: 'heroHonorer' },
			{ text: 'Continue adventuring with this wisdom', nextScene: 'wiseAdventurer' },
			{ text: 'Begin a new quest', nextScene: 'start' }
		]
	},

	treasure: {
		id: 'treasure',
		title: 'The Dragon\'s Hoard',
		description: 'You explore the dragon\'s treasure chamber and find not just gold and jewels, but also ancient books, magical artifacts, and personal items that reveal Aethonaris\'s true nature as a collector and protector of knowledge.',
		onEnter: () => {
			gameStore.update(state => {
				state.gold += 100;
				state.inventory.push(items.wizardStaff);
				state.magic_skill += 2;
				state.experience += 50;
				return state;
			});
		},
		choices: [
			{ text: 'Study the ancient knowledge', nextScene: 'studyKnowledge' },
			{ text: 'Take what you need and leave the rest', nextScene: 'respectfulTaking' },
			{ text: 'Preserve the collection for future scholars', nextScene: 'preserveCollection' }
		]
	},

	studyKnowledge: {
		id: 'studyKnowledge',
		title: 'Ancient Wisdom',
		description: 'You study the ancient books and artifacts, gaining deep knowledge about magic, history, and the true nature of dragons. This knowledge will serve you well in future adventures.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 3;
				state.experience += 75;
				return state;
			});
		},
		choices: [
			{ text: 'Become a scholar-adventurer', nextScene: 'scholarAdventurer' },
			{ text: 'Use this knowledge to help others', nextScene: 'knowledgeHelper' },
			{ text: 'Continue your adventures with new wisdom', nextScene: 'victory' }
		]
	},

	victory: {
		id: 'victory',
		title: 'Victory Through Strength',
		description: 'You emerge from the tower victorious through battle. The curse is broken, the land begins to heal, and you are remembered as a mighty warrior who faced the dragon and won. Your adventure ends in triumph, though you sometimes wonder if there might have been another way.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 1;
				return state;
			});
		},
		choices: [
			{ text: 'Return to help rebuild the region', nextScene: 'heroReturn' },
			{ text: 'Begin a new adventure', nextScene: 'start' }
		]
	},

	heroReturn: {
		id: 'heroReturn',
		title: 'The Hero\'s Return',
		description: 'You return to find the village transformed. Crops are growing again, people are smiling, and the air itself feels cleaner and more hopeful. The villagers celebrate your victory and the breaking of the curse. You are honored as the greatest hero the land has ever known.',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 50;
				state.level += 1;
				return state;
			});
		},
		choices: [
			{ text: 'Settle down in the village as a protector', nextScene: 'settleDown' },
			{ text: 'Begin a new adventure', nextScene: 'start' },
			{ text: 'Travel to other lands that need help', nextScene: 'newLands' }
		]
	},

	settleDown: {
		id: 'settleDown',
		title: 'The Peaceful Life',
		description: 'You decide to settle down in the village as its protector and guardian. Your days are filled with helping the villagers, protecting travelers, and maintaining the peace you fought so hard to achieve.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 1;
				state.experience += 100;
				return state;
			});
		},
		choices: [
			{ text: 'Live happily as the village guardian', nextScene: 'villageGuardian' },
			{ text: 'Train young heroes to continue your work', nextScene: 'heroTrainer' },
			{ text: 'Eventually seek new adventures', nextScene: 'newLands' }
		]
	},

	newLands: {
		id: 'newLands',
		title: 'New Horizons',
		description: 'You set out for new lands that need help, carrying the experience and wisdom gained from your adventure. Your reputation precedes you, and you find that your legend has inspired others to seek peaceful solutions to their problems.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 1;
				state.experience += 75;
				return state;
			});
		},
		choices: [
			{ text: 'Continue helping those in need', nextScene: 'helpingHero' },
			{ text: 'Seek out the greatest challenges', nextScene: 'challengeSeeker' },
			{ text: 'Begin an entirely new adventure', nextScene: 'start' }
		]
	},

	stoneBridge: {
		id: 'stoneBridge',
		title: 'The Ancient Stone Bridge',
		description: () => get(gameStore).bridgeRepaired ? 
			'The bridge stands strong once again, its stones properly aligned and secure. You can safely cross to the wizard\'s domain.' :
			'The ancient stone bridge spans a rushing river, but you can see that several stones have fallen into the water below. The remaining structure looks unstable and dangerous to cross. There are loose stones scattered on this side of the river.',
		choices: () => get(gameStore).bridgeRepaired ? [
			{ text: 'Cross the bridge to the wizard\'s tower', nextScene: 'wizardTower' },
			{ text: 'Return to explore other areas', nextScene: 'start' }
		] : [
			{ text: 'Attempt to repair the bridge', nextScene: 'repairBridge' },
			{ text: 'Try to cross the damaged bridge anyway', nextScene: 'crossDamaged' },
			{ text: 'Look for another way across', nextScene: 'findCrossing' },
			{ text: 'Return to the crossroads', nextScene: 'start' }
		]
	},

	repairBridge: {
		id: 'repairBridge',
		title: 'Bridge Repairs',
		description: 'Using your skills and the loose stones, you carefully repair the bridge. It\'s hard work, but eventually you manage to make it safe to cross. Your efforts have also strengthened your resolve.',
		onEnter: () => {
			gameStore.update(state => {
				state.bridgeRepaired = true;
				state.experience += 30;
				state.health += 10;
				state.combat += 1;
				return state;
			});
		},
		choices: [
			{ text: 'Cross the repaired bridge', nextScene: 'wizardTower' },
			{ text: 'Return to tell the villagers about the bridge', nextScene: 'approachVillage' },
			{ text: 'Rest before continuing', nextScene: 'restBridge' }
		]
	},

	restBridge: {
		id: 'restBridge',
		title: 'Rest by the River',
		description: 'You rest by the peaceful river, enjoying the satisfaction of a job well done. The sound of flowing water is soothing, and you feel refreshed and ready for whatever lies ahead.',
		onEnter: () => {
			gameStore.update(state => {
				state.health = Math.min(100, state.health + 15);
				state.magic = Math.min(100, state.magic + 15);
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Cross the bridge to explore the western lands', nextScene: 'wizardTower' },
			{ text: 'Return to the village with news of the repair', nextScene: 'approachVillage' },
			{ text: 'Head back to the crossroads', nextScene: 'start' }
		]
	},

	crossDamaged: {
		id: 'crossDamaged',
		title: 'Dangerous Crossing',
		description: 'You attempt to cross the damaged bridge. The stones shift dangerously under your weight, and you nearly fall into the rushing river below. You manage to make it across, but you\'re shaken and bruised.',
		onEnter: () => {
			gameStore.update(state => {
				state.health -= 15;
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Continue to the wizard\'s tower despite your injuries', nextScene: 'wizardTower' },
			{ text: 'Rest and recover before proceeding', nextScene: 'recoverFromCrossing' },
			{ text: 'Go back and repair the bridge properly', nextScene: 'repairBridge' }
		]
	},

	recoverFromCrossing: {
		id: 'recoverFromCrossing',
		title: 'Recovery and Reflection',
		description: 'You take time to recover from the dangerous crossing, tending to your bruises and reflecting on the importance of taking time to do things properly rather than rushing into danger.',
		onEnter: () => {
			gameStore.update(state => {
				state.health = Math.min(100, state.health + 10);
				state.experience += 10;
				return state;
			});
		},
		choices: [
			{ text: 'Continue to the wizard\'s tower', nextScene: 'wizardTower' },
			{ text: 'Return to repair the bridge for future travelers', nextScene: 'repairForOthers' },
			{ text: 'Explore the western lands carefully', nextScene: 'exploreWest' }
		]
	},

	repairForOthers: {
		id: 'repairForOthers',
		title: 'Helping Future Travelers',
		description: 'Despite having already crossed, you return to repair the bridge properly so that future travelers won\'t face the same danger you did. This selfless act strengthens your character.',
		onEnter: () => {
			gameStore.update(state => {
				state.bridgeRepaired = true;
				state.diplomacy += 2;
				state.experience += 40;
				return state;
			});
		},
		choices: [
			{ text: 'Now cross the safely repaired bridge', nextScene: 'wizardTower' },
			{ text: 'Return to the village to share news of the repair', nextScene: 'approachVillage' },
			{ text: 'Continue exploring with this good deed done', nextScene: 'exploreWest' }
		]
	},

	findCrossing: {
		id: 'findCrossing',
		title: 'Alternative Route',
		description: 'You search along the riverbank and discover a narrow ford upstream where the water is shallow enough to cross safely. This route is longer but much safer than the damaged bridge.',
		onEnter: () => {
			gameStore.update(state => {
				state.stealth += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Cross at the ford', nextScene: 'fordCrossing' },
			{ text: 'Mark the location and repair the bridge anyway', nextScene: 'repairBridge' },
			{ text: 'Return to share knowledge of the ford', nextScene: 'shareFordKnowledge' }
		]
	},

	fordCrossing: {
		id: 'fordCrossing',
		title: 'Safe Passage',
		description: 'You cross at the ford safely, though your boots get wet. The journey is peaceful, and you enjoy watching the river life as you make your way across. You feel good about finding a safe alternative.',
		onEnter: () => {
			gameStore.update(state => {
				state.experience += 15;
				return state;
			});
		},
		choices: [
			{ text: 'Continue to the wizard\'s tower', nextScene: 'wizardTower' },
			{ text: 'Explore the western riverbank', nextScene: 'exploreRiverbank' },
			{ text: 'Return to tell others about the safe crossing', nextScene: 'shareFordKnowledge' }
		]
	},

	exploreRiverbank: {
		id: 'exploreRiverbank',
		title: 'Riverside Discoveries',
		description: 'Exploring the western riverbank, you discover several useful herbs growing by the water\'s edge and a small cache left by previous travelers. The peaceful environment also restores your spirits.',
		onEnter: () => {
			gameStore.update(state => {
				state.inventory.push(items.healingPotion);
				state.gold += 10;
				state.health += 10;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Continue to the wizard\'s tower', nextScene: 'wizardTower' },
			{ text: 'Spend more time gathering resources', nextScene: 'gatherResources' },
			{ text: 'Return to share your discoveries', nextScene: 'shareDiscoveries' }
		]
	},

	gatherResources: {
		id: 'gatherResources',
		title: 'Resource Gathering',
		description: 'You spend time carefully gathering herbs, edible plants, and other useful materials from the riverbank. Your thorough approach yields excellent results and improves your survival skills.',
		onEnter: () => {
			gameStore.update(state => {
				state.inventory.push(items.magicPotion);
				state.gold += 15;
				state.stealth += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Head to the wizard\'s tower well-supplied', nextScene: 'wizardTower' },
			{ text: 'Return to the village with valuable resources', nextScene: 'approachVillage' },
			{ text: 'Continue exploring the western lands', nextScene: 'exploreWest' }
		]
	},

	exploreWest: {
		id: 'exploreWest',
		title: 'Western Exploration',
		description: 'You explore the western lands beyond the river, finding rolling hills dotted with ancient ruins and mysterious stone circles. The area feels thick with old magic and forgotten history.',
		onEnter: () => {
			gameStore.update(state => {
				state.magic_skill += 1;
				state.experience += 25;
				return state;
			});
		},
		choices: [
			{ text: 'Investigate the ancient ruins', nextScene: 'ancientRuins' },
			{ text: 'Study the mysterious stone circles', nextScene: 'stoneCircles' },
			{ text: 'Continue to the wizard\'s tower', nextScene: 'wizardTower' },
			{ text: 'Return to share your discoveries', nextScene: 'shareDiscoveries' }
		]
	},

	wizardTower: {
		id: 'wizardTower',
		title: 'The Wizard\'s Tower',
		description: 'You approach a tall, spiraling tower that seems to defy conventional architecture. Stairs wind around the outside, and the structure pulses with magical energy. A friendly-looking elderly wizard waves to you from a high window.',
		onEnter: () => {
			gameStore.update(state => {
				state.wizardMet = true;
				return state;
			});
		},
		choices: [
			{ text: 'Climb the external stairs to meet the wizard', nextScene: 'meetWizard' },
			{ text: 'Call up to the wizard from below', nextScene: 'callToWizard' },
			{ text: 'Investigate the base of the tower', nextScene: 'towerBase' },
			{ text: 'Return to explore other areas first', nextScene: 'stoneBridge' }
		]
	},

	meetWizard: {
		id: 'meetWizard',
		title: 'The Wise Wizard',
		description: 'You climb to meet the wizard, an elderly man with twinkling eyes and a warm smile. "Welcome, young adventurer! I am Magister Eldrin. I\'ve been watching your progress with great interest. You show wisdom beyond your years in how you approach challenges."',
		onEnter: () => {
			gameStore.update(state => {
				state.diplomacy += 1;
				state.experience += 20;
				return state;
			});
		},
		choices: [
			{ text: 'Ask about the curse affecting the land', nextScene: 'wizardCurseKnowledge' },
			{ text: 'Request magical training', nextScene: 'magicalTraining' },
			{ text: 'Ask for advice on your quest', nextScene: 'wizardAdvice' },
			{ text: 'Inquire about the tower\'s magic', nextScene: 'towerMagic' }
		]
	},

	ultimateHeroReturn: {
		id: 'ultimateHeroReturn',
		title: 'The Ultimate Hero\'s Return',
		description: 'You return to the village not just as a hero who defeated a monster, but as one who saved a noble soul and restored balance to the land. Your story becomes the greatest legend ever told in these parts.',
		onEnter: () => {
			gameStore.update(state => {
				state.level += 3;
				state.experience += 300;
				return state;
			});
		},
		choices: [
			{ text: 'Become the legendary protector of the region', nextScene: 'legendaryProtector' },
			{ text: 'Travel the world sharing your story', nextScene: 'legendaryTraveler' },
			{ text: 'Establish a school for future heroes', nextScene: 'heroSchool' }
		]
	}
};
