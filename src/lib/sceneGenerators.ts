// src/lib/sceneGenerators.ts
export const generateVillageScenes = () => {
	const villageTypes = [
		'Market', 'Inn', 'Blacksmith', 'Healer', 'Librarian', 
		'Crops', 'Elder', 'Needs', 'Resources'
	];
	
	return Object.fromEntries(villageTypes.map(type => [
		`village${type}`,
		{
			id: `village${type}`,
			title: `The Village ${type}`,
			description: `You interact with the village ${type.toLowerCase()}, learning more about the curse's effects.`,
			choices: [
				{ text: 'Ask about the curse', nextScene: 'askDragon' },
				{ text: 'Offer help', nextScene: 'offerHelp' },
				{ text: 'Continue exploring the village', nextScene: 'approachVillage' },
				{ text: 'Leave', nextScene: 'start' }
			],
			onEnter: () => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					diplomacy: state.diplomacy + 1,
					experience: state.experience + 15,
					villageVisited: true
				}));
			}
		}
	]));
};

export const generateDragonDialogues = () => {
	const dialogueTypes = [
		'TalkDragon', 'ComfortDragon', 'DiscussCurse', 'ShowCompassion',
		'AskAboutPain', 'OfferHelp', 'ExplainMission', 'AskSuffering',
		'RequestGuidance', 'ShareKnowledge', 'PromiseHelp', 'ExplainNature'
	];
	
	return Object.fromEntries(dialogueTypes.map(type => [
		type.toLowerCase(),
		{
			id: type.toLowerCase(),
			title: `${type.replace(/([A-Z])/g, ' $1').trim()}`,
			description: () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				const state = get(gameStore);
				return state.curseKnowledge ? 
					`You speak with deep understanding of Aethonaris's true nature and the curse that binds him.` :
					`You attempt to communicate with the dragon, sensing there's more to this creature than meets the eye.`;
			},
			choices: [
				{ text: 'Continue the conversation', nextScene: 'towerConversation' },
				{ text: 'Offer to break the curse', nextScene: 'breakCurse', condition: () => {
					const { get } = require('svelte/store');
					const { gameStore } = require('./gameState.js');
					return get(gameStore).hasSword;
				}},
				{ text: 'Seek a peaceful solution', nextScene: 'peacefulApproach' },
				{ text: 'Prepare for what comes next', nextScene: 'climbTower' }
			],
			onEnter: () => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					diplomacy: state.diplomacy + 2,
					experience: state.experience + 25,
					curseKnowledge: true
				}));
			}
		}
	]));
};

export const generatePreparationScenes = () => {
	const prepTypes = [
		'Meditation', 'Practice', 'Rest', 'Study', 'Gather', 'Plan',
		'Prepare', 'Reflect', 'Strengthen', 'Focus'
	];
	
	return Object.fromEntries(prepTypes.map(type => [
		type.toLowerCase(),
		{
			id: type.toLowerCase(),
			title: `${type} Before Adventure`,
			description: `You take time to ${type.toLowerCase()} and prepare yourself for the challenges ahead.`,
			choices: [
				{ text: 'Continue to the tower', nextScene: 'tower' },
				{ text: 'Visit the village', nextScene: 'approachVillage' },
				{ text: 'Explore the forest', nextScene: 'mysteriousForest' },
				{ text: 'Return to crossroads', nextScene: 'start' }
			],
			onEnter: () => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					health: Math.min(100, state.health + 15),
					magic: Math.min(100, state.magic + 15),
					experience: state.experience + 20
				}));
			}
		}
	]));
};

export const generateEndingScenes = () => {
	const endingTypes = [
		'Perfect', 'Ultimate', 'Compassionate', 'Wise', 'Peaceful',
		'Miraculous', 'Legendary', 'Sacred', 'Triumphant', 'Redemptive'
	];
	
	return Object.fromEntries(endingTypes.map(type => [
		`${type.toLowerCase()}Victory`,
		{
			id: `${type.toLowerCase()}Victory`,
			title: `${type} Victory`,
			description: `Through your ${type.toLowerCase()} approach, you achieve a truly meaningful victory that transforms not just Aethonaris, but the entire land.`,
			choices: [
				{ text: 'Celebrate with Aethonaris', nextScene: 'celebrateWithDragon' },
				{ text: 'Return as a hero', nextScene: 'ultimateHeroReturn' },
				{ text: 'Learn from this experience', nextScene: 'dragonMentor' },
				{ text: 'Begin a new adventure', nextScene: 'start' }
			],
			onEnter: () => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					dragonDefeated: true,
					level: state.level + 2,
					experience: state.experience + 200,
					diplomacy: state.diplomacy + 3
				}));
			}
		}
	]));
};

export const generateBridgeScenes = () => {
	const bridgeActions = [
		'RepairBridge', 'CrossDamaged', 'FindCrossing', 'FordCrossing',
		'RestBridge', 'RecoverFromCrossing', 'RepairForOthers', 'ExploreRiverbank',
		'GatherResources', 'ShareFordKnowledge', 'ExploreWest'
	];
	
	return Object.fromEntries(bridgeActions.map(action => [
		action.charAt(0).toLowerCase() + action.slice(1),
		{
			id: action.charAt(0).toLowerCase() + action.slice(1),
			title: action.replace(/([A-Z])/g, ' $1').trim(),
			description: `You ${action.toLowerCase().replace(/([A-Z])/g, ' $1')} as part of your bridge crossing adventure.`,
			choices: [
				{ text: 'Continue to the wizard tower', nextScene: 'wizardTower' },
				{ text: 'Return to the village', nextScene: 'approachVillage' },
				{ text: 'Explore the western lands', nextScene: 'exploreWest' },
				{ text: 'Head back to crossroads', nextScene: 'start' }
			],
			onEnter: () => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					...(action.includes('Repair') && { bridgeRepaired: true }),
					experience: state.experience + 20,
					...(action.includes('Gather') && { gold: state.gold + 15 })
				}));
			}
		}
	]));
};

export const generateLearningScenes = () => {
	const learningTypes = [
		'DragonMentor', 'MagicalEducation', 'GuardianApprentice', 'WisdomStudent',
		'TransformationMaster', 'BalanceStudent', 'HealingWisdom', 'AncientKnowledge',
		'SacredTeaching', 'MysticalTraining'
	];
	
	return Object.fromEntries(learningTypes.map(type => [
		type.charAt(0).toLowerCase() + type.slice(1),
		{
			id: type.charAt(0).toLowerCase() + type.slice(1),
			title: type.replace(/([A-Z])/g, ' $1').trim(),
			description: `You engage in ${type.toLowerCase().replace(/([A-Z])/g, ' $1')} under Aethonaris's guidance.`,
			choices: [
				{ text: 'Continue your studies', nextScene: 'advancedLearning' },
				{ text: 'Apply your knowledge', nextScene: 'practiceSkills' },
				{ text: 'Teach others', nextScene: 'becomeTeacher' },
				{ text: 'Begin new adventures', nextScene: 'start' }
			],
			onEnter: () => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					magic_skill: state.magic_skill + 3,
					diplomacy: state.diplomacy + 2,
					experience: state.experience + 100,
					level: state.level + 1
				}));
			}
		}
	]));
};

export const generateMagicScenes = () => {
	const magicTypes = [
		'WaterSpirits', 'SpiritWisdom', 'SpiritBlessing', 'SpiritGuidance',
		'MagicSense', 'HiddenPath', 'CaveMeditation', 'StudyCave',
		'CaveDrawings', 'CurseDetails', 'CureDetails', 'SpiritMeditation'
	];
	
	return Object.fromEntries(magicTypes.map(type => [
		type.charAt(0).toLowerCase() + type.slice(1),
		{
			id: type.charAt(0).toLowerCase() + type.slice(1),
			title: type.replace(/([A-Z])/g, ' $1').trim(),
			description: `You engage with the magical ${type.toLowerCase().replace(/([A-Z])/g, ' $1')} and gain deeper understanding.`,
			choices: [
				{ text: 'Continue deeper into magic', nextScene: 'advancedMagic' },
				{ text: 'Apply magical knowledge', nextScene: 'usemagic' },
				{ text: 'Seek the dragon', nextScene: 'tower' },
				{ text: 'Return to safety', nextScene: 'start' }
			],
			onEnter: () => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					magic_skill: state.magic_skill + 2,
					magic: Math.min(100, state.magic + 25),
					experience: state.experience + 30
				}));
			}
		}
	]));
};

export const generateAllRemainingScenes = () => {
	return {
		...generateVillageScenes(),
		...generateDragonDialogues(),
		...generatePreparationScenes(),
		...generateEndingScenes(),
		...generateBridgeScenes(),
		...generateLearningScenes(),
		...generateMagicScenes()
	};
};

export const addGeneratedScenes = (mainScenes: Record<string, any>) => {
	return {
		...mainScenes,
		...generateAllRemainingScenes()
	};
};
