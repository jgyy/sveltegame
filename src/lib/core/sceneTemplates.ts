// src/lib/core/sceneTemplates.ts
import type { Scene } from './types.js';
import { SceneFactory } from './sceneFactory.js';
import { createStateUpdate } from '../data/stateUpdates.js';

interface SceneTemplate {
	id: string;
	title: string;
	description: string | (() => string);
	type: 'exploration' | 'interaction' | 'conversation' | 'victory' | 'training';
	config: any;
}

export class SceneTemplates {
	static generateScenes(templates: SceneTemplate[]): Record<string, Scene> {
		return Object.fromEntries(
			templates.map(template => {
				let scene: Scene;
				
				switch (template.type) {
					case 'exploration':
						scene = SceneFactory.exploration(
							template.id, 
							template.title, 
							template.description as string, 
							template.config.destinations,
							template.config.reward
						);
						break;
					case 'interaction':
						scene = SceneFactory.interaction(
							template.id, 
							template.title, 
							template.description, 
							template.config.interactions, 
							template.config.reward
						);
						break;
					case 'victory':
						scene = SceneFactory.victory(
							template.id, 
							template.title, 
							template.description as string, 
							template.config.victoryType
						);
						break;
					case 'conversation':
						scene = SceneFactory.conversation(
							template.id, 
							template.title, 
							template.description as string, 
							template.config.responses, 
							template.config.reward
						);
						break;
					case 'training':
						scene = SceneFactory.training(
							template.id, 
							template.title, 
							template.description as string, 
							template.config.skill, 
							template.config.nextScenes
						);
						break;
					default:
						scene = SceneFactory.scene(template.id, template.title, template.description, template.config.choices);
				}
				
				return [template.id, scene];
			})
		);
	}

	static getVillageScenes(): SceneTemplate[] {
		return [
			{
				id: 'villageElder',
				title: 'The Village Elder',
				description: 'You speak with the wise elder who knows the village\'s history.',
				type: 'conversation',
				config: {
					responses: [
						{ text: 'Ask about the dragon\'s curse', nextScene: 'askDragon' },
						{ text: 'Request help for your quest', nextScene: 'getSupplies' },
						{ text: 'Offer your services', nextScene: 'offerHelp' }
					],
					reward: { experience: 20, diplomacy: 1, flags: { villageVisited: true } }
				}
			},
			{
				id: 'villageMarket',
				title: 'The Village Market',
				description: 'You explore the market, learning about local trade and the curse\'s impact.',
				type: 'interaction',
				config: {
					interactions: [
						{ text: 'Buy supplies', nextScene: 'buySupplies' },
						{ text: 'Talk to merchants', nextScene: 'merchantChat' },
						{ text: 'Investigate empty stalls', nextScene: 'emptyStalls' }
					],
					reward: { experience: 15, diplomacy: 1, flags: { villageVisited: true } }
				}
			},
			{
				id: 'villageInn',
				title: 'The Village Inn',
				description: 'The inn provides rest and gossip from travelers.',
				type: 'interaction',
				config: {
					interactions: [
						{ text: 'Rest and recover', nextScene: 'restAtInn' },
						{ text: 'Listen to traveler stories', nextScene: 'travelerTales' },
						{ text: 'Ask about the tower', nextScene: 'askAboutTower' }
					],
					reward: { experience: 15, health: 20, flags: { villageVisited: true } }
				}
			}
		];
	}

	static getDragonScenes(): SceneTemplate[] {
		return [
			{
				id: 'askAboutPain',
				title: 'Understanding Suffering',
				description: 'You ask Aethonaris about the pain of the curse.',
				type: 'conversation',
				config: {
					responses: [
						{ text: 'Offer comfort and understanding', nextScene: 'comfortDragon' },
						{ text: 'Promise to find a way to help', nextScene: 'promiseHelp' },
						{ text: 'Ask about the curse\'s origin', nextScene: 'cursOrigin' }
					],
					reward: { diplomacy: 2, experience: 25, flags: { curseKnowledge: true } }
				}
			},
			{
				id: 'showCompassion',
				title: 'True Understanding',
				description: 'Your compassion touches the dragon deeply.',
				type: 'conversation',
				config: {
					responses: [
						{ text: 'Offer to perform the redemption ritual', nextScene: 'breakCurse', 
						  requirement: () => {
							const { get } = require('svelte/store');
							const { gameStore } = require('../../gameState.js');
							const state = get(gameStore);
							return state.hasSword && state.curseKnowledge;
						  }},
						{ text: 'Ask how you can help heal', nextScene: 'askHowToHeal' },
						{ text: 'Share wisdom about redemption', nextScene: 'shareWisdom' }
					],
					reward: { diplomacy: 4, experience: 40, flags: { curseKnowledge: true } }
				}
			}
		];
	}

	static getTrainingScenes(): SceneTemplate[] {
		return [
			{
				id: 'combatTraining',
				title: 'Combat Practice',
				description: 'You practice your combat skills.',
				type: 'training',
				config: {
					skill: 'combat',
					nextScenes: ['tower', 'approachVillage', 'mysteriousForest']
				}
			},
			{
				id: 'magicTraining',
				title: 'Magical Study',
				description: 'You meditate and practice your magical abilities.',
				type: 'training',
				config: {
					skill: 'magic_skill',
					nextScenes: ['tower', 'wizardTower', 'mysteriousForest']
				}
			},
			{
				id: 'diplomaticTraining',
				title: 'Social Skills Practice',
				description: 'You practice your communication and diplomatic skills.',
				type: 'training',
				config: {
					skill: 'diplomacy',
					nextScenes: ['approachVillage', 'tower', 'wizardTower']
				}
			}
		];
	}

	static getVictoryScenes(): SceneTemplate[] {
		return [
			{
				id: 'perfectVictory',
				title: 'Perfect Redemption',
				description: 'You achieve the ultimate victory through understanding and compassion.',
				type: 'victory',
				config: {
					victoryType: 'ultimate'
				}
			},
			{
				id: 'heroicVictory',
				title: 'Heroic Achievement',
				description: 'Your brave actions save the day.',
				type: 'victory',
				config: {
					victoryType: 'major'
				}
			}
		];
	}

	static getAllTemplates(): SceneTemplate[] {
		return [
			...this.getVillageScenes(),
			...this.getDragonScenes(),
			...this.getTrainingScenes(),
			...this.getVictoryScenes()
		];
	}
}

