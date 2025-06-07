// src/lib/core/sceneFactory.ts
import type { Scene, Choice, Skills, StateUpdate } from './types.js';

export class SceneFactory {
	private static createChoice(
		text: string, 
		nextScene: string, 
		options: {
			condition?: () => boolean;
			skillRequirement?: { skill: keyof Skills; level: number };
			goldCost?: number;
			itemRequired?: string;
			flagRequired?: string;
		} = {}
	): Choice {
		const choice: Choice = { text, nextScene };
		
		if (options.condition) choice.condition = options.condition;
		if (options.skillRequirement) choice.skillRequirement = options.skillRequirement;
		if (options.goldCost) choice.goldCost = options.goldCost;
		if (options.itemRequired) choice.itemRequired = options.itemRequired;
		if (options.flagRequired) choice.flagRequired = options.flagRequired;
		
		return choice;
	}

	static basic(text: string, nextScene: string): Choice {
		return this.createChoice(text, nextScene);
	}

	static conditional(text: string, nextScene: string, condition: () => boolean): Choice {
		return this.createChoice(text, nextScene, { condition });
	}

	static skill(text: string, nextScene: string, skill: keyof Skills, level: number): Choice {
		return this.createChoice(text, nextScene, { skillRequirement: { skill, level } });
	}

	static gold(text: string, nextScene: string, cost: number): Choice {
		return this.createChoice(text, nextScene, { 
			condition: () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('../gameState.js');
				return get(gameStore).gold >= cost;
			},
			goldCost: cost 
		});
	}

	static item(text: string, nextScene: string, itemId: string): Choice {
		return this.createChoice(text, nextScene, { 
			condition: () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('../gameState.js');
				return get(gameStore).inventory.some((item: any) => item.id === itemId);
			},
			itemRequired: itemId 
		});
	}

	static flag(text: string, nextScene: string, flag: string): Choice {
		return this.createChoice(text, nextScene, { 
			condition: () => {
				const { get } = require('svelte/store');
				const { gameStore } = require('../gameState.js');
				return get(gameStore)[flag];
			},
			flagRequired: flag 
		});
	}

	static multi(
		text: string, 
		nextScene: string, 
		requirements: {
			items?: string[];
			flags?: string[];
			skills?: Array<{ skill: keyof Skills; level: number }>;
			gold?: number;
		}
	): Choice {
		return this.createChoice(text, nextScene, {
			condition: () => {
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
			}
		});
	}

	static scene(
		id: string, 
		title: string, 
		description: string | (() => string), 
		choices: Choice[], 
		options: {
			onEnter?: () => void;
			category?: Scene['category'];
		} = {}
	): Scene {
		return {
			id, 
			title, 
			description, 
			choices, 
			category: options.category || 'interaction',
			...(options.onEnter && { onEnter: options.onEnter })
		};
	}

	static exploration(
		id: string, 
		title: string, 
		description: string, 
		destinations: Array<{ name: string; sceneId: string; requirement?: () => boolean }>,
		reward?: StateUpdate
	): Scene {
		const choices = [
			...destinations.map(dest => dest.requirement 
				? this.conditional(`Go to ${dest.name}`, dest.sceneId, dest.requirement)
				: this.basic(`Go to ${dest.name}`, dest.sceneId)
			),
			this.basic('Return to crossroads', 'start')
		];

		return this.scene(id, title, description, choices, {
			category: 'exploration',
			onEnter: reward ? () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate(reward);
			} : undefined
		});
	}

	static interaction(
		id: string,
		title: string,
		description: string | (() => string),
		interactions: Array<{ text: string; nextScene: string; requirement?: () => boolean }>,
		reward?: StateUpdate
	): Scene {
		const choices = [
			...interactions.map(interaction => interaction.requirement
				? this.conditional(interaction.text, interaction.nextScene, interaction.requirement)
				: this.basic(interaction.text, interaction.nextScene)
			),
			this.basic('Leave this area', 'start')
		];

		return this.scene(id, title, description, choices, {
			category: 'interaction',
			onEnter: reward ? () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate(reward);
			} : undefined
		});
	}

	static victory(
		id: string, 
		title: string, 
		description: string, 
		victoryType: 'minor' | 'major' | 'ultimate' = 'minor'
	): Scene {
		const choices = [
			this.basic('Celebrate your victory', 'celebrate'),
			this.basic('Return as a hero', 'heroReturn'),
			this.basic('Continue your journey', 'start')
		];

		const victoryRewards = {
			minor: { experience: 50, gold: 100, diplomacy: 1 },
			major: { experience: 150, gold: 300, diplomacy: 3, level: 1 },
			ultimate: { experience: 500, gold: 1000, diplomacy: 5, level: 3, flags: { dragonDefeated: true } }
		};

		return this.scene(id, title, description, choices, {
			category: 'victory',
			onEnter: () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate(victoryRewards[victoryType]);
			}
		});
	}

	static conversation(
		id: string,
		title: string,
		baseDescription: string,
		responses: Array<{ text: string; nextScene: string; requirement?: () => boolean }>,
		reward?: StateUpdate 
	): Scene {
		const description = () => {
			const { get } = require('svelte/store');
			const { gameStore } = require('../gameState.js');
			const state = get(gameStore);
			
			let desc = baseDescription;
			if (state.curseKnowledge) {
				desc += ' Your understanding of the curse colors this interaction.';
			}
			if (state.hasSword) {
				desc += ' The Blade of Transformation pulses with power at your side.';
			}
			return desc;
		};

		const choices = responses.map(response => response.requirement
			? this.conditional(response.text, response.nextScene, response.requirement)
			: this.basic(response.text, response.nextScene)
		);

		return this.scene(id, title, description, choices, {
			category: 'dialogue',
			onEnter: reward ? () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate(reward);
			} : undefined
		});
	}

	static training(
		id: string,
		title: string,
		description: string,
		skill: keyof Skills,
		nextScenes: string[] = ['start']
	): Scene {
		const choices = [
			...nextScenes.map(scene => this.basic(`Continue to ${scene}`, scene)),
			this.basic('Practice more', id),
			this.basic('Return to crossroads', 'start')
		];

		const trainingReward = { 
			experience: 20, 
			[skill]: 1 
		};

		return this.scene(id, title, description, choices, {
			category: 'training',
			onEnter: () => {
				const { applyStateUpdate } = require('../gameState.js');
				applyStateUpdate(trainingReward);
			}
		});
	}
}
