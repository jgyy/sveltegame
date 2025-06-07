// src/lib/utils/sceneHelpers.ts
import type { Scene, Choice, Skills } from '../types.js';
import { items } from '../data/items.js';
import { applyStateUpdate, commonUpdates, type StateUpdate } from '../gameState.js';

export const basicChoice = (text: string, nextScene: string): Choice => ({ text, nextScene });

export const conditionalChoice = (text: string, nextScene: string, condition: () => boolean): Choice => ({ 
	text, 
	nextScene, 
	condition 
});

export const skillChoice = (text: string, nextScene: string, skill: keyof Skills, level: number): Choice => ({ 
	text, 
	nextScene, 
	skillRequirement: { skill, level } 
});

export const goldChoice = (text: string, nextScene: string, cost: number): Choice => 
	conditionalChoice(text, nextScene, () => {
		const { get } = require('svelte/store');
		const { gameStore } = require('../gameState.js');
		return get(gameStore).gold >= cost;
	});

export const itemRequiredChoice = (text: string, nextScene: string, itemId: string): Choice => 
	conditionalChoice(text, nextScene, () => {
		const { get } = require('svelte/store');
		const { gameStore } = require('../gameState.js');
		return get(gameStore).inventory.some((item: any) => item.id === itemId);
	});

export const flagRequiredChoice = (text: string, nextScene: string, flag: string): Choice => 
	conditionalChoice(text, nextScene, () => {
		const { get } = require('svelte/store');
		const { gameStore } = require('../gameState.js');
		return get(gameStore)[flag];
	});

export const multiRequirementChoice = (
	text: string, 
	nextScene: string, 
	requirements: {
		items?: string[];
		flags?: string[];
		skills?: Array<{ skill: keyof Skills; level: number }>;
		gold?: number;
	}
): Choice => conditionalChoice(text, nextScene, () => {
	const { get } = require('svelte/store');
	const { gameStore } = require('../gameState.js');
	const state = get(gameStore);
	
	if (requirements.items && !requirements.items.every(itemId => 
		state.inventory.some((item: any) => item.id === itemId))) return false;
	
	if (requirements.flags && !requirements.flags.every(flag => state[flag])) return false;
	
	if (requirements.skills && !requirements.skills.every(req => 
		state[req.skill] >= req.level)) return false;
	
	if (requirements.gold && state.gold < requirements.gold) return false;
	
	return true;
});

export const createScene = (
	id: string, 
	title: string, 
	description: string | (() => string), 
	choices: Choice[], 
	onEnter?: () => void
): Scene => ({
	id, 
	title, 
	description, 
	choices, 
	...(onEnter && { onEnter })
});

export const createExplorationScene = (
	id: string, 
	title: string, 
	description: string, 
	destinations: Array<{ name: string; sceneId: string; requirement?: () => boolean }>
): Scene => 
	createScene(id, title, description, [
		...destinations.map(dest => dest.requirement 
			? conditionalChoice(`Go to ${dest.name}`, dest.sceneId, dest.requirement)
			: basicChoice(`Go to ${dest.name}`, dest.sceneId)
		),
		basicChoice('Return to crossroads', 'start')
	], () => applyStateUpdate(commonUpdates.basicExploration()));

export const createInteractionScene = (
	id: string,
	title: string,
	description: string | (() => string),
	interactions: Array<{ text: string; nextScene: string; requirement?: () => boolean }>,
	reward: StateUpdate = commonUpdates.basicExploration()
): Scene => 
	createScene(id, title, description, [
		...interactions.map(interaction => interaction.requirement
			? conditionalChoice(interaction.text, interaction.nextScene, interaction.requirement)
			: basicChoice(interaction.text, interaction.nextScene)
		),
		basicChoice('Leave this area', 'start')
	], () => applyStateUpdate(reward));

export const createVictoryScene = (
	id: string, 
	title: string, 
	description: string, 
	victoryType: 'minor' | 'major' | 'ultimate' = 'minor'
): Scene =>
	createScene(id, title, description, [
		basicChoice('Celebrate your victory', 'celebrate'),
		basicChoice('Return as a hero', 'heroReturn'),
		basicChoice('Continue your journey', 'start')
	], () => applyStateUpdate(commonUpdates.victoryReward(victoryType)));

export const createConversationScene = (
	id: string,
	title: string,
	baseDescription: string,
	responses: Array<{ text: string; nextScene: string; requirement?: () => boolean }>,
	reward: StateUpdate = commonUpdates.dragonInteraction()
): Scene => 
	createScene(id, title, () => {
		const { get } = require('svelte/store');
		const { gameStore } = require('../gameState.js');
		const state = get(gameStore);
		
		let description = baseDescription;
		if (state.curseKnowledge) {
			description += ' Your understanding of the curse colors this interaction.';
		}
		if (state.hasSword) {
			description += ' The Blade of Transformation pulses with power at your side.';
		}
		return description;
	}, responses.map(response => response.requirement
		? conditionalChoice(response.text, response.nextScene, response.requirement)
		: basicChoice(response.text, response.nextScene)
	), () => applyStateUpdate(reward));

export const createTrainingScene = (
	id: string,
	title: string,
	description: string,
	skill: keyof Skills,
	nextScenes: string[] = ['start']
): Scene => 
	createScene(id, title, description, [
		...nextScenes.map(scene => basicChoice(`Continue to ${scene}`, scene)),
		basicChoice('Practice more', id),
		basicChoice('Return to crossroads', 'start')
	], () => applyStateUpdate(commonUpdates.skillTraining(skill)));

export const createSceneSet = (
	sceneConfigs: Array<{
		id: string;
		title: string;
		description: string | (() => string);
		type: 'exploration' | 'interaction' | 'victory' | 'conversation' | 'training';
		config: any;
	}>
): Record<string, Scene> => {
	return Object.fromEntries(
		sceneConfigs.map(config => {
			let scene: Scene;
			
			switch (config.type) {
				case 'exploration':
					scene = createExplorationScene(config.id, config.title, config.description as string, config.config.destinations);
					break;
				case 'interaction':
					scene = createInteractionScene(config.id, config.title, config.description, config.config.interactions, config.config.reward);
					break;
				case 'victory':
					scene = createVictoryScene(config.id, config.title, config.description as string, config.config.victoryType);
					break;
				case 'conversation':
					scene = createConversationScene(config.id, config.title, config.description as string, config.config.responses, config.config.reward);
					break;
				case 'training':
					scene = createTrainingScene(config.id, config.title, config.description as string, config.config.skill, config.config.nextScenes);
					break;
				default:
					scene = createScene(config.id, config.title, config.description, config.config.choices, config.config.onEnter);
			}
			
			return [config.id, scene];
		})
	);
};

export const updateStats = (updates: any) => () => applyStateUpdate(updates);
export const addItems = (...itemIds: string[]) => () => applyStateUpdate({ items: itemIds });
export const combineUpdates = (...updates: (() => void)[]) => () => updates.forEach(update => update());
