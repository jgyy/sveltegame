// src/lib/sceneGenerators.ts
import type { Scene } from './types.js';
import { basicChoice, createScene } from './utils/sceneHelpers.js';

export const generateVillageScenes = () => {
	const villageTypes = [
		'Market', 'Inn', 'Blacksmith', 'Healer', 'Librarian', 
		'Crops', 'Elder', 'Needs', 'Resources'
	];
	
	return Object.fromEntries(villageTypes.map(type => [
		`village${type}`,
		createScene(
			`village${type}`,
			`The Village ${type}`,
			`You interact with the village ${type.toLowerCase()}, learning more about the curse's effects.`,
			[
				basicChoice('Ask about the curse', 'askDragon'),
				basicChoice('Offer help', 'offerHelp'),
				basicChoice('Continue exploring the village', 'approachVillage'),
				basicChoice('Leave', 'start')
			],
			() => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					diplomacy: state.diplomacy + 1,
					experience: state.experience + 15,
					villageVisited: true
				}));
			}
		)
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
		createScene(
			type.toLowerCase(),
			`${type.replace(/([A-Z])/g, ' $1').trim()}`,
			() => {
				const { get } = require('svelte/store');
				const { gameStore } = require('./gameState.js');
				const state = get(gameStore);
				return state.curseKnowledge ? 
					`You speak with deep understanding of Aethonaris's true nature and the curse that binds him.` :
					`You attempt to communicate with the dragon, sensing there's more to this creature than meets the eye.`;
			},
			[
				basicChoice('Continue the conversation', 'towerConversation'),
				{ text: 'Offer to break the curse', nextScene: 'breakCurse', condition: () => {
					const { get } = require('svelte/store');
					const { gameStore } = require('./gameState.js');
					return get(gameStore).hasSword;
				}},
				basicChoice('Seek a peaceful solution', 'peacefulApproach'),
				basicChoice('Prepare for what comes next', 'climbTower')
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
		)
	]));
};

export const generatePreparationScenes = () => {
	const prepTypes = [
		'Meditation', 'Practice', 'Rest', 'Study', 'Gather', 'Plan',
		'Prepare', 'Reflect', 'Strengthen', 'Focus'
	];
	
	return Object.fromEntries(prepTypes.map(type => [
		type.toLowerCase(),
		createScene(
			type.toLowerCase(),
			`${type} Before Adventure`,
			`You take time to ${type.toLowerCase()} and prepare yourself for the challenges ahead.`,
			[
				basicChoice('Continue to the tower', 'tower'),
				basicChoice('Visit the village', 'approachVillage'),
				basicChoice('Explore the forest', 'mysteriousForest'),
				basicChoice('Return to crossroads', 'start')
			],
			() => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					health: Math.min(100, state.health + 15),
					magic: Math.min(100, state.magic + 15),
					experience: state.experience + 20
				}));
			}
		)
	]));
};

export const generateEndingScenes = () => {
	const endingTypes = [
		'Perfect', 'Ultimate', 'Compassionate', 'Wise', 'Peaceful',
		'Miraculous', 'Legendary', 'Sacred', 'Triumphant', 'Redemptive'
	];
	
	return Object.fromEntries(endingTypes.map(type => [
		`${type.toLowerCase()}Victory`,
		createScene(
			`${type.toLowerCase()}Victory`,
			`${type} Victory`,
			`Through your ${type.toLowerCase()} approach, you achieve a truly meaningful victory that transforms not just Aethonaris, but the entire land.`,
			[
				basicChoice('Celebrate with Aethonaris', 'celebrateWithDragon'),
				basicChoice('Return as a hero', 'ultimateHeroReturn'),
				basicChoice('Learn from this experience', 'dragonMentor'),
				basicChoice('Begin a new adventure', 'start')
			],
			() => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					dragonDefeated: true,
					level: state.level + 2,
					experience: state.experience + 200,
					diplomacy: state.diplomacy + 3
				}));
			}
		)
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
		createScene(
			action.charAt(0).toLowerCase() + action.slice(1),
			action.replace(/([A-Z])/g, ' $1').trim(),
			`You ${action.toLowerCase().replace(/([A-Z])/g, ' $1')} as part of your bridge crossing adventure.`,
			[
				basicChoice('Continue to the wizard tower', 'wizardTower'),
				basicChoice('Return to the village', 'approachVillage'),
				basicChoice('Explore the western lands', 'exploreWest'),
				basicChoice('Head back to crossroads', 'start')
			],
			() => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					...(action.includes('Repair') && { bridgeRepaired: true }),
					experience: state.experience + 20,
					...(action.includes('Gather') && { gold: state.gold + 15 })
				}));
			}
		)
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
		createScene(
			type.charAt(0).toLowerCase() + type.slice(1),
			type.replace(/([A-Z])/g, ' $1').trim(),
			`You engage in ${type.toLowerCase().replace(/([A-Z])/g, ' $1')} under Aethonaris's guidance.`,
			[
				basicChoice('Continue your studies', 'advancedLearning'),
				basicChoice('Apply your knowledge', 'practiceSkills'),
				basicChoice('Teach others', 'becomeTeacher'),
				basicChoice('Begin new adventures', 'start')
			],
			() => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					magic_skill: state.magic_skill + 3,
					diplomacy: state.diplomacy + 2,
					experience: state.experience + 100,
					level: state.level + 1
				}));
			}
		)
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
		createScene(
			type.charAt(0).toLowerCase() + type.slice(1),
			type.replace(/([A-Z])/g, ' $1').trim(),
			`You engage with the magical ${type.toLowerCase().replace(/([A-Z])/g, ' $1')} and gain deeper understanding.`,
			[
				basicChoice('Continue deeper into magic', 'advancedMagic'),
				basicChoice('Apply magical knowledge', 'usemagic'),
				basicChoice('Seek the dragon', 'tower'),
				basicChoice('Return to safety', 'start')
			],
			() => {
				const { gameStore } = require('./gameState.js');
				gameStore.update((state: any) => ({
					...state,
					magic_skill: state.magic_skill + 2,
					magic: Math.min(100, state.magic + 25),
					experience: state.experience + 30
				}));
			}
		)
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

export const addGeneratedScenes = (mainScenes: Record<string, Scene>) => {
	return {
		...mainScenes,
		...generateAllRemainingScenes()
	};
};
