// src/lib/core/sceneBuilder.ts
import type { Scene, Choice, Skills, StateUpdate } from './types.js';

export class SceneBuilder {
  private scene: Partial<Scene> = {};
  private sceneChoices: Choice[] = [];

  constructor(id: string, title: string) {
    this.scene.id = id;
    this.scene.title = title;
  }

  description(desc: string | (() => string)): this {
    this.scene.description = desc;
    return this;
  }

  category(cat: Scene['category']): this {
    this.scene.category = cat;
    return this;
  }

  onEnter(callback: () => void): this {
    this.scene.onEnter = callback;
    return this;
  }

  addChoice(text: string, nextScene: string): ChoiceBuilder {
    const choiceBuilder = new ChoiceBuilder(text, nextScene, this);
    return choiceBuilder;
  }

  _addChoice(choice: Choice): this {
    this.sceneChoices.push(choice);
    return this;
  }

  addBasicChoice(text: string, nextScene: string): this {
    this.sceneChoices.push({ text, nextScene });
    return this;
  }

  addConditionalChoice(text: string, nextScene: string, condition: () => boolean): this {
    this.sceneChoices.push({ text, nextScene, condition });
    return this;
  }

  addSkillChoice(text: string, nextScene: string, skill: keyof Skills, level: number): this {
    this.sceneChoices.push({ 
      text, 
      nextScene, 
      skillRequirement: { skill, level } 
    });
    return this;
  }

  addGoldChoice(text: string, nextScene: string, cost: number): this {
    this.sceneChoices.push({ 
      text, 
      nextScene, 
      goldCost: cost,
      condition: () => {
        const { get } = require('svelte/store');
        const { gameStore } = require('../gameState.js');
        return get(gameStore).gold >= cost;
      }
    });
    return this;
  }

  addItemChoice(text: string, nextScene: string, itemId: string): this {
    this.sceneChoices.push({ 
      text, 
      nextScene, 
      itemRequired: itemId,
      condition: () => {
        const { get } = require('svelte/store');
        const { gameStore } = require('../gameState.js');
        return get(gameStore).inventory.some((item: any) => item.id === itemId);
      }
    });
    return this;
  }

  addDestination(name: string, sceneId: string, requirement?: () => boolean): this {
    const choice: Choice = { text: `Go to ${name}`, nextScene: sceneId };
    if (requirement) choice.condition = requirement;
    this.sceneChoices.push(choice);
    return this;
  }

  addExamination(name: string, sceneId: string): this {
    this.sceneChoices.push({ text: `Examine ${name}`, nextScene: sceneId });
    return this;
  }

  addResponse(text: string, nextScene: string, requirement?: () => boolean): this {
    const choice: Choice = { text, nextScene };
    if (requirement) choice.condition = requirement;
    this.sceneChoices.push(choice);
    return this;
  }

  addReturnChoice(sceneName: string = 'start'): this {
    const text = sceneName === 'start' ? 'Return to crossroads' : `Return to ${sceneName}`;
    this.sceneChoices.push({ text, nextScene: sceneName });
    return this;
  }

  addContinueChoice(nextScene: string): this {
    this.sceneChoices.push({ text: 'Continue', nextScene });
    return this;
  }

  build(): Scene {
    this.scene.choices = this.sceneChoices;
    return this.scene as Scene;
  }
}

/**
 * Choice Builder for complex choice configurations
 */
export class ChoiceBuilder {
  private choice: Choice;
  private sceneBuilder: SceneBuilder;

  constructor(text: string, nextScene: string, sceneBuilder: SceneBuilder) {
    this.choice = { text, nextScene };
    this.sceneBuilder = sceneBuilder;
  }

  condition(cond: () => boolean): this {
    this.choice.condition = cond;
    return this;
  }

  skillRequirement(skill: keyof Skills, level: number): this {
    this.choice.skillRequirement = { skill, level };
    return this;
  }

  goldCost(cost: number): this {
    this.choice.goldCost = cost;
    this.choice.condition = () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../gameState.js');
      return get(gameStore).gold >= cost;
    };
    return this;
  }

  itemRequired(itemId: string): this {
    this.choice.itemRequired = itemId;
    this.choice.condition = () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../gameState.js');
      return get(gameStore).inventory.some((item: any) => item.id === itemId);
    };
    return this;
  }

  flagRequired(flag: string): this {
    this.choice.flagRequired = flag;
    this.choice.condition = () => {
      const { get } = require('svelte/store');
      const { gameStore } = require('../gameState.js');
      return get(gameStore)[flag];
    };
    return this;
  }

  multipleRequirements(requirements: {
    items?: string[];
    flags?: string[];
    skills?: Array<{ skill: keyof Skills; level: number }>;
    gold?: number;
  }): this {
    this.choice.condition = () => {
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
    };
    return this;
  }

  build(): SceneBuilder {
    this.sceneBuilder._addChoice(this.choice);
    return this.sceneBuilder;
  }
}
