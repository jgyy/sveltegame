// src/lib/version2Scenes.ts
import type { Scene } from './types.js';
import { 
	basicChoice, 
	conditionalChoice, 
	createScene 
} from './utils/sceneHelpers.js';
import { items } from './data/items.js';

const missingScenes: Record<string, Scene> = {
	examineArea: createScene('examineArea', 'Careful Observation',
		'You take time to carefully examine your surroundings. The crossroads appears to be ancient, with worn stone markers indicating directions. You notice fresh footprints leading toward the village, old campfire ashes near the forest path, and strange magical residue around the bridge area.',
		[
			basicChoice('Investigate the footprints toward the village', 'approachVillage'),
			basicChoice('Examine the old campfire by the forest', 'mysteriousForest'),
			basicChoice('Study the magical residue at the bridge', 'stoneBridge'),
			basicChoice('Look for any hidden paths or secrets', 'hiddenShrine'),
			basicChoice('Continue to explore the main paths', 'start')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				experience: state.experience + 10,
				stealth: state.stealth + 1
			}));
		}
	),

	witheredCrops: createScene('witheredCrops', 'The Cursed Fields',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.curseKnowledge) {
				return 'You examine the withered crops with understanding. The curse affecting the dragon has spread its influence across the land, draining life from everything it touches. You see patterns in the decay that suggest the source comes from the ancient tower to the north.';
			}
			return 'The crops are brown and brittle, as if drained of all life force. The soil itself seems tainted with something unnatural. Farmers work listlessly in the fields, their faces filled with despair. This blight has clearly been affecting the village for some time.';
		},
		[
			basicChoice('Talk to the farmers about the blight', 'villageElder'),
			basicChoice('Examine the soil more closely', 'magicsense'),
			basicChoice('Offer to help find the source', 'offerHelp'),
			basicChoice('Head toward the suspected source', 'tower'),
			basicChoice('Return to the village center', 'approachVillage')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				experience: state.experience + 15,
				curseKnowledge: true
			}));
		}
	),

	tower: createScene('tower', 'The Ancient Tower',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.hasKey) {
				return 'The ancient stone tower looms before you, its dark windows like hollow eyes. With the iron key in hand, you can see the heavy wooden door that has kept this place sealed. Ancient runes carved into the stone seem to pulse with a faint, ominous energy.';
			}
			return 'A massive stone tower rises from the forest floor, its architecture ancient beyond measure. The heavy wooden door is locked tight, and you can feel powerful magic radiating from within. This is clearly the source of the land\'s troubles.';
		},
		[
			conditionalChoice('Unlock the door with the iron key', 'unlockTower', () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				return get(gameStore).hasKey;
			}),
			basicChoice('Search around the tower base', 'towerBase'),
			basicChoice('Try to find another way in', 'towerSide'),
			basicChoice('Study the magical emanations', 'studyMagic'),
			basicChoice('Return to prepare better', 'deepForest')
		]
	),

	unlockTower: createScene('unlockTower', 'The Tower Door Opens',
		'The iron key fits perfectly into the ancient lock. With a deep, resonant click, the door swings open on well-oiled hinges, releasing a wave of warm air that carries the scent of old magic and something else... something alive. A spiral staircase winds upward into darkness.',
		[
			basicChoice('Climb the stairs to face whatever awaits', 'climbTower'),
			basicChoice('Call out to announce your presence', 'announceArrival'),
			basicChoice('Proceed cautiously, step by step', 'cautiousAscent'),
			basicChoice('Light a torch before entering', 'lightTorch')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				experience: state.experience + 25
			}));
		}
	),

	findSword: createScene('findSword', 'The Blade of Transformation',
		'Deep within the sacred cave, you discover an ancient sword embedded in a crystal formation. As your hand touches the hilt, the blade begins to glow with a soft, transformative light. This is no ordinary weapon - it pulses with magic meant not to destroy, but to change and redeem.',
		[
			basicChoice('Take the sword and feel its power', 'claimSword'),
			basicChoice('Study the sword\'s magical properties', 'studySword'),
			basicChoice('Meditate on its purpose before claiming it', 'swordMeditation'),
			basicChoice('Read any inscriptions on the blade', 'swordInscription')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				hasSword: true,
				combat: state.combat + 2,
				magic_skill: state.magic_skill + 2,
				experience: state.experience + 50,
				inventory: [...state.inventory, items.ancientSword]
			}));
		}
	),

	claimSword: createScene('claimSword', 'Wielding Ancient Power',
		'As you grasp the Blade of Transformation, knowledge flows into your mind. This weapon was forged not for conquest, but for redemption. You understand now that some battles are won not by destroying your enemy, but by helping them find their true self.',
		[
			basicChoice('Head directly to confront the dragon', 'tower'),
			basicChoice('Practice with the blade first', 'practiceSkills'),
			basicChoice('Seek more knowledge about its power', 'studySword'),
			basicChoice('Return to help others with this power', 'helpVillage')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				curseKnowledge: true,
				diplomacy: state.diplomacy + 2
			}));
		}
	),

	askDragon: createScene('askDragon', 'Learning of the Dragon',
		'The villagers\' eyes fill with a mixture of fear and sorrow as you ask about the dragon. "Aethonaris was not always a destroyer," the elder explains. "Long ago, he was a guardian of this land. But something changed him - cursed him. Now his very presence drains life from everything around."',
		[
			basicChoice('Ask how the curse began', 'cursOrigin'),
			basicChoice('Inquire about breaking the curse', 'askCureMethod'),
			basicChoice('Offer to confront the dragon', 'offerHelp'),
			basicChoice('Ask about the dragon\'s original nature', 'dragonNature'),
			basicChoice('Request directions to the tower', 'getDirections')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				curseKnowledge: true,
				experience: state.experience + 20,
				diplomacy: state.diplomacy + 1
			}));
		}
	),

	offerHelp: createScene('offerHelp', 'A Hero\'s Promise',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.hasSword) {
				return 'You place your hand on the Blade of Transformation and make a solemn vow to help end the curse plaguing this land. The villagers\' faces light up with the first hope they\'ve felt in years. "You carry a weapon of legend," they whisper. "Perhaps the prophecies were true."';
			}
			return 'You promise to help the villagers and find a way to end their suffering. Though you lack powerful weapons or magic, your determination alone gives them hope. They provide you with supplies and directions to the ancient tower where the dragon dwells.';
		},
		[
			basicChoice('Ask for supplies and information', 'getSupplies'),
			basicChoice('Request guidance to the tower', 'getDirections'),
			basicChoice('Learn about the dragon\'s curse', 'askDragon'),
			basicChoice('Seek a blessing for your quest', 'villageBlessing'),
			basicChoice('Set out immediately for the tower', 'tower')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				experience: state.experience + 30,
				diplomacy: state.diplomacy + 2,
				gold: state.gold + 25,
				villageVisited: true
			}));
		}
	),

	dragonRedeemed: createScene('dragonRedeemed', 'Aethonaris Restored',
		'The ritual is complete, and where once stood a cursed dragon, now stands Aethonaris in his true form - a magnificent guardian spirit whose very presence begins to heal the land. Golden light emanates from his being, and you can feel the curse lifting from the entire region.',
		[
			basicChoice('Witness the land\'s restoration', 'landHealing'),
			basicChoice('Speak with Aethonaris about the future', 'futureGuardian'),
			basicChoice('Return to share the good news', 'victoryReturn'),
			basicChoice('Ask to learn from him', 'dragonMentor')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				dragonDefeated: true,
				experience: state.experience + 200,
				level: state.level + 3,
				magic_skill: state.magic_skill + 5,
				diplomacy: state.diplomacy + 5
			}));
		}
	),

	celebrateWithDragon: createScene('celebrateWithDragon', 'A New Friendship',
		'Aethonaris, now free from his curse, celebrates with you as the land around you blooms back to life. "You have given me the greatest gift," he says, his voice now warm and melodious. "Not just freedom from the curse, but the chance to be who I was meant to be again."',
		[
			basicChoice('Ask him to teach you ancient wisdom', 'dragonMentor'),
			basicChoice('Invite him to help restore the village', 'dragonVillage'),
			basicChoice('Plan future adventures together', 'futureQuests'),
			basicChoice('Simply enjoy this moment of peace', 'peacefulMoment')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				experience: state.experience + 100,
				diplomacy: state.diplomacy + 3
			}));
		}
	),

	ultimateHeroReturn: createScene('ultimateHeroReturn', 'The Hero\'s Triumphant Return',
		'You return to the village as a true hero, bringing news of the dragon\'s redemption and the curse\'s end. The people rush to greet you, their faces bright with joy and relief. Children who had never seen green crops now point in wonder at the fields already beginning to sprout new life.',
		[
			basicChoice('Share the story of Aethonaris\'s redemption', 'shareStory'),
			basicChoice('Help organize the village\'s rebuilding', 'rebuildVillage'),
			basicChoice('Establish yourself as a local guardian', 'becomeGuardian'),
			basicChoice('Prepare for new adventures', 'newAdventures')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				experience: state.experience + 150,
				gold: state.gold + 500,
				diplomacy: state.diplomacy + 4
			}));
		}
	),

	dragonMentor: createScene('dragonMentor', 'Wisdom of the Ages',
		'Aethonaris becomes your mentor, teaching you ancient secrets of magic, wisdom, and the delicate balance between all living things. Under his guidance, you learn not just to be a warrior or mage, but a true guardian of the natural world.',
		[
			basicChoice('Learn advanced magical techniques', 'advancedLearning'),
			basicChoice('Study the ancient guardianship', 'guardianTraining'),
			basicChoice('Practice transformation magic', 'transformationMagic'),
			basicChoice('Explore other cursed lands to help', 'newQuests')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				magic_skill: state.magic_skill + 5,
				diplomacy: state.diplomacy + 3,
				experience: state.experience + 200,
				level: state.level + 2
			}));
		}
	),

	askAboutPain: createScene('askAboutPain', 'Understanding Suffering',
		'Aethonaris\'s great eyes dim with ancient sorrow. "The pain is beyond words, little one. To be trapped between what I was and what I have become... to feel my very presence poison the land I once protected... it is a torment that gnaws at my soul day and night."',
		[
			basicChoice('Offer comfort and understanding', 'comfortDragon'),
			basicChoice('Promise to find a way to help', 'promiseHelp'),
			basicChoice('Ask about the curse\'s origin', 'cursOrigin'),
			basicChoice('Share your determination to help', 'showResolve')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				diplomacy: state.diplomacy + 2,
				experience: state.experience + 25,
				curseKnowledge: true
			}));
		}
	),

	promiseHelp: createScene('promiseHelp', 'A Sacred Vow',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.hasSword) {
				return 'You raise the Blade of Transformation and make a sacred vow to help Aethonaris break free from his curse. The sword glows brighter in response to your oath, and hope kindles in the dragon\'s ancient eyes. "That blade... I had thought it lost forever. Perhaps there is a way..."';
			}
			return 'You make a heartfelt promise to find a way to help Aethonaris, even though you\'re not sure how. Your sincerity touches something deep within the cursed dragon. "Your kindness gives me hope, brave one. But words alone cannot break ancient magic."';
		},
		[
			basicChoice('Ask what you need to break the curse', 'askCureMethod'),
			basicChoice('Offer to search for the needed items', 'searchForCure'),
			conditionalChoice('Begin the ritual with the transformation blade', 'breakCurse', () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				return get(gameStore).hasSword;
			}),
			basicChoice('Seek guidance on how to proceed', 'askHowToHeal')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				diplomacy: state.diplomacy + 3,
				experience: state.experience + 30
			}));
		}
	),

	askHowToHeal: createScene('askHowToHeal', 'The Path to Healing',
		'Aethonaris considers your question carefully. "The curse binds me through ancient magic, but it is not unbreakable. There exists a blade forged specifically for transformation - not destruction, but change. Combined with a pure heart and understanding of my true nature, it could free me."',
		[
			basicChoice('Ask where to find this blade', 'searchForSword'),
			conditionalChoice('Reveal that you have the blade', 'revealSword', () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				return get(gameStore).hasSword;
			}),
			basicChoice('Ask about understanding his true nature', 'askTrueNature'),
			basicChoice('Inquire about the purity of heart requirement', 'askPureHeart')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				curseKnowledge: true,
				experience: state.experience + 25
			}));
		}
	),

	askCureMethod: createScene('askCureMethod', 'The Cure\'s Requirements',
		'The dragon\'s voice grows thoughtful. "To break this curse requires three things: the Blade of Transformation, knowledge of my true nature as a guardian rather than destroyer, and most importantly - the genuine desire to heal rather than simply defeat. Many heroes have come with swords, but none understood what I truly needed."',
		[
			conditionalChoice('Show him the Blade of Transformation', 'showBlade', () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				return get(gameStore).hasSword;
			}),
			basicChoice('Affirm your desire to heal, not defeat', 'showCompassion'),
			basicChoice('Ask about his true nature as a guardian', 'askTrueNature'),
			basicChoice('Promise to find what is needed', 'searchForCure')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				curseKnowledge: true,
				diplomacy: state.diplomacy + 2,
				experience: state.experience + 30
			}));
		}
	),

	showCompassion: createScene('showCompassion', 'True Understanding',
		'Your words of genuine compassion and understanding touch Aethonaris deeply. For the first time in centuries, he sees hope in someone\'s eyes - not the desire for glory or treasure, but true empathy for his suffering. "You truly understand," he whispers. "You see not a monster to be slain, but a soul to be saved."',
		[
			conditionalChoice('Offer to perform the redemption ritual', 'breakCurse', () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				return get(gameStore).hasSword && get(gameStore).curseKnowledge;
			}),
			basicChoice('Ask how you can help him heal', 'askHowToHeal'),
			basicChoice('Share your own struggles and growth', 'shareWisdom'),
			basicChoice('Comfort him with gentle words', 'gentleWords')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				diplomacy: state.diplomacy + 4,
				experience: state.experience + 40,
				curseKnowledge: true
			}));
		}
	),

	towerConversation: createScene('towerConversation', 'Deep Dialogue',
		'Your conversation with Aethonaris deepens, touching on themes of redemption, the nature of curses, and the power of understanding. Through your words, both of you come to understand that this meeting was destined - not for battle, but for healing.',
		[
			basicChoice('Discuss the nature of transformation', 'discussTransformation'),
			basicChoice('Share stories of redemption', 'shareRedemption'),
			basicChoice('Talk about the land\'s healing', 'discussHealing'),
			conditionalChoice('Begin the cure ritual', 'breakCurse', () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				return get(gameStore).hasSword;
			})
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				diplomacy: state.diplomacy + 3,
				experience: state.experience + 35
			}));
		}
	),

	peacefulApproach: createScene('peacefulApproach', 'The Way of Peace',
		'You choose the path of peace, setting aside thoughts of conflict in favor of understanding and healing. This approach resonates deeply with Aethonaris, who has longed for someone to see past his cursed exterior to the guardian spirit within.',
		[
			basicChoice('Meditate together on healing', 'healingMeditation'),
			basicChoice('Work together to break the curse', 'collaborativeCure'),
			basicChoice('Learn from each other\'s wisdom', 'mutualLearning'),
			basicChoice('Plan the land\'s restoration', 'planRestoration')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				diplomacy: state.diplomacy + 4,
				magic_skill: state.magic_skill + 2,
				experience: state.experience + 50
			}));
		}
	),

	wizardTower: createScene('wizardTower', 'The Wizard\'s Sanctum',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.wizardMet) {
				return 'You return to the wizard\'s tower. The ancient sage greets you warmly, eager to hear of your progress and offer further guidance.';
			}
			return 'Across the repaired bridge stands an imposing wizard\'s tower, its walls covered in mystical symbols that seem to shift and change as you watch. The heavy oak door bears a brass knocker shaped like a wise owl.';
		},
		[
			basicChoice('Knock on the door', 'meetWizard'),
			basicChoice('Study the magical symbols', 'studySymbols'),
			basicChoice('Circle the tower looking for other entrances', 'towerExplore'),
			conditionalChoice('Call out to the wizard', 'callWizard', () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				return get(gameStore).wizardMet;
			})
		]
	),

	meetWizard: createScene('meetWizard', 'The Ancient Sage',
		'The door opens to reveal an ancient wizard with kind, twinkling eyes. "Ah, a visitor! I sensed your approach. You carry the weight of a great quest, don\'t you? Come, let me help you understand the true nature of what you face."',
		[
			basicChoice('Ask about the dragon\'s curse', 'wizardCurse'),
			basicChoice('Request magical guidance', 'wizardGuidance'),
			basicChoice('Ask for magical items or spells', 'wizardItems'),
			basicChoice('Inquire about the land\'s history', 'wizardHistory')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				wizardMet: true,
				magic_skill: state.magic_skill + 2,
				experience: state.experience + 30
			}));
		}
	),

	advancedLearning: createScene('advancedLearning', 'Master\'s Teachings',
		'Under expert guidance, you delve deep into advanced magical arts, ancient wisdom, and the subtle complexities of transformation magic. Your understanding grows exponentially as you master techniques that few mortals ever learn.',
		[
			basicChoice('Focus on transformation magic mastery', 'transformationMaster'),
			basicChoice('Study guardian magic and protection', 'guardianMagic'),
			basicChoice('Learn the art of curse-breaking', 'curseBreaking'),
			basicChoice('Graduate to teaching others', 'becomeTeacher')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				magic_skill: state.magic_skill + 4,
				diplomacy: state.diplomacy + 2,
				experience: state.experience + 100,
				level: state.level + 1
			}));
		}
	),

	practiceSkills: createScene('practiceSkills', 'Honing Your Abilities',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.hasSword) {
				return 'You practice with the Blade of Transformation, learning to channel its power not for destruction but for change and healing. Each swing fills you with greater understanding of its true purpose.';
			}
			return 'You take time to practice your skills, honing your abilities through careful training and meditation. Your dedication to improvement serves you well.';
		},
		[
			basicChoice('Practice combat techniques', 'combatTraining'),
			basicChoice('Meditate to improve magical abilities', 'magicTraining'),
			basicChoice('Work on diplomatic and social skills', 'diplomaticTraining'),
			basicChoice('Focus on stealth and observation', 'stealthTraining'),
			basicChoice('Test your abilities in the field', 'fieldTest')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				combat: state.combat + 2,
				magic_skill: state.magic_skill + 2,
				diplomacy: state.diplomacy + 1,
				stealth: state.stealth + 1,
				experience: state.experience + 40
			}));
		}
	),

	becomeTeacher: createScene('becomeTeacher', 'The Teacher\'s Path',
		'You embrace the role of teacher, sharing your hard-won wisdom with others. Students from far and wide come to learn not just magic and combat, but the deeper lessons of compassion, understanding, and the power of redemption over destruction.',
		[
			basicChoice('Establish a school of transformation', 'foundSchool'),
			basicChoice('Travel as a wandering teacher', 'wanderingMentor'),
			basicChoice('Write down your teachings', 'writeWisdom'),
			basicChoice('Seek out more students in need', 'findStudents')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				diplomacy: state.diplomacy + 5,
				experience: state.experience + 200,
				level: state.level + 2
			}));
		}
	),

	advancedMagic: createScene('advancedMagic', 'Mastery of the Arcane',
		'Your magical abilities reach new heights as you master advanced techniques of transformation, healing, and elemental control. The very air around you shimmers with contained power, and you feel the deep connections between all magical forces.',
		[
			basicChoice('Master elemental transformation', 'elementalMastery'),
			basicChoice('Learn to heal cursed lands', 'landHealing'),
			basicChoice('Develop new magical techniques', 'createSpells'),
			basicChoice('Seek out other magical practitioners', 'magicCommunity')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				magic_skill: state.magic_skill + 5,
				experience: state.experience + 150,
				level: state.level + 2,
				magic: 100
			}));
		}
	),

	usemagic: createScene('usemagic', 'Applying Magical Knowledge',
		() => {
			const { get } = require('svelte/store');
			const { gameStore } = require('./gameState.js');
			const state = get(gameStore);
			if (state.magic_skill >= 5) {
				return 'Your advanced magical knowledge allows you to weave powerful spells with confidence. Energy flows through you as you apply your magical skills to solve problems and help others.';
			}
			return 'You carefully apply the magical knowledge you\'ve gained, channeling energy through focus and will. Though still learning, you can feel your power growing with each use.';
		},
		[
			basicChoice('Use magic to heal the land', 'healLand'),
			basicChoice('Create magical protections', 'createWards'),
			basicChoice('Enhance your abilities temporarily', 'selfEnhancement'),
			basicChoice('Seek to help others with magic', 'helpWithMagic'),
			basicChoice('Continue practicing and learning', 'advancedMagic')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				magic: Math.max(10, state.magic - 20),
				experience: state.experience + 30
			}));
		}
	)
};

const additionalScenes: Record<string, Scene> = {
	magicsense: createScene('magicsense', 'Magical Perception',
		'You extend your magical senses and immediately detect the unnatural corruption in the soil. Dark tendrils of cursed energy seem to flow from the north, emanating from an ancient source of great power.',
		[
			basicChoice('Follow the magical trail north', 'tower'),
			basicChoice('Try to cleanse some of the corruption', 'cleanseCorruption'),
			basicChoice('Study the curse pattern more closely', 'studyCurse'),
			basicChoice('Return to warn others', 'approachVillage')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				curseKnowledge: true,
				magic_skill: state.magic_skill + 1,
				experience: state.experience + 25
			}));
		}
	),

	landHealing: createScene('landHealing', 'The Land\'s Renewal',
		'With Aethonaris restored to his true nature, his presence begins healing the land immediately. Green shoots push through barren soil, withered trees bloom with new leaves, and clean water flows where there was once only drought.',
		[
			basicChoice('Help spread the healing faster', 'accelerateHealing'),
			basicChoice('Document this miraculous recovery', 'recordMiracle'),
			basicChoice('Guide the healing to the village', 'healVillage'),
			basicChoice('Learn the techniques behind this restoration', 'studyRestoration')
		]
	),

	getSupplies: createScene('getSupplies', 'Village Aid',
		'The grateful villagers provide you with supplies for your quest: healing potions, travel rations, and a blessed charm for protection. Their hopes and prayers go with you as you prepare to face the unknown.',
		[
			basicChoice('Head immediately to the tower', 'tower'),
			basicChoice('Ask for more information about the dragon', 'askDragon'),
			basicChoice('Request directions to other helpful locations', 'getDirections'),
			basicChoice('Offer to help with village problems first', 'helpVillagers')
		],
		() => {
			const { gameStore } = require('./gameState.js');
			gameStore.update((state: any) => ({
				...state,
				health: Math.min(100, state.health + 25),
				magic: Math.min(100, state.magic + 25),
				gold: state.gold + 50,
				inventory: [...state.inventory, items.healingPotion, items.magicPotion]
			}));
		}
	)
};

export const version2Scenes = { ...missingScenes, ...additionalScenes };
