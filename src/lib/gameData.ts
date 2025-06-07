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
	}
};
