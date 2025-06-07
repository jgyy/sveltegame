// src/lib/core/sceneFactory.ts
import { SceneBuilder } from './sceneBuilder.js';
import type { Scene, Choice, Skills, StateUpdate } from './types.js';

export class SceneFactory {
  static create(id: string, title: string): SceneBuilder {
    return new SceneBuilder(id, title);
  }

  static exploration(
    id: string, 
    title: string, 
    description: string, 
    destinations: Array<{ name: string; sceneId: string; requirement?: () => boolean }>,
    reward?: StateUpdate
  ): Scene {
    const builder = this.create(id, title)
      .description(description)
      .category('exploration');

    destinations.forEach(dest => {
      builder.addDestination(dest.name, dest.sceneId, dest.requirement);
    });

    builder.addReturnChoice();

    if (reward) {
      builder.onEnter(() => {
        const { applyStateUpdate } = require('../gameState.js');
        applyStateUpdate(reward);
      });
    }

    return builder.build();
  }

  static conversation(
    id: string,
    title: string,
    description: string | (() => string),
    responses: Array<{ text: string; nextScene: string; requirement?: () => boolean }>,
    reward?: StateUpdate
  ): Scene {
    const builder = this.create(id, title)
      .description(description)
      .category('dialogue');

    responses.forEach(response => {
      builder.addResponse(response.text, response.nextScene, response.requirement);
    });

    if (reward) {
      builder.onEnter(() => {
        const { applyStateUpdate } = require('../gameState.js');
        applyStateUpdate(reward);
      });
    }

    return builder.build();
  }

  static interaction(
    id: string,
    title: string,
    description: string | (() => string),
    interactions: Array<{ text: string; nextScene: string; requirement?: () => boolean }>,
    reward?: StateUpdate
  ): Scene {
    const builder = this.create(id, title)
      .description(description)
      .category('interaction');

    interactions.forEach(interaction => {
      builder.addBasicChoice(interaction.text, interaction.nextScene);
    });

    builder.addReturnChoice();

    if (reward) {
      builder.onEnter(() => {
        const { applyStateUpdate } = require('../gameState.js');
        applyStateUpdate(reward);
      });
    }

    return builder.build();
  }

  static victory(
    id: string, 
    title: string, 
    description: string, 
    victoryType: 'minor' | 'major' | 'ultimate' = 'minor'
  ): Scene {
    const victoryRewards = {
      minor: { experience: 50, gold: 100, diplomacy: 1 },
      major: { experience: 150, gold: 300, diplomacy: 3, level: 1 },
      ultimate: { experience: 500, gold: 1000, diplomacy: 5, level: 3, flags: { dragonDefeated: true } }
    };

    return this.create(id, title)
      .description(description)
      .category('victory')
      .addBasicChoice('Celebrate your victory', 'celebrate')
      .addBasicChoice('Return as a hero', 'heroReturn')
      .addBasicChoice('Continue your journey', 'start')
      .onEnter(() => {
        const { applyStateUpdate } = require('../gameState.js');
        applyStateUpdate(victoryRewards[victoryType]);
      })
      .build();
  }

  static training(
    id: string,
    title: string,
    description: string,
    skill: keyof Skills,
    nextScenes: string[] = ['start']
  ): Scene {
    const builder = this.create(id, title)
      .description(description)
      .category('training');

    nextScenes.forEach(scene => {
      builder.addBasicChoice(`Continue to ${scene}`, scene);
    });

    builder
      .addBasicChoice('Practice more', id)
      .addReturnChoice()
      .onEnter(() => {
        const { applyStateUpdate } = require('../gameState.js');
        applyStateUpdate({ experience: 20, [skill]: 1 });
      });

    return builder.build();
  }

  static basic(text: string, nextScene: string): Choice {
    return { text, nextScene };
  }

  static conditional(text: string, nextScene: string, condition: () => boolean): Choice {
    return { text, nextScene, condition };
  }

  static skill(text: string, nextScene: string, skill: keyof Skills, level: number): Choice {
    return { text, nextScene, skillRequirement: { skill, level } };
  }

  static gold(text: string, nextScene: string, cost: number): Choice {
    return { 
      text, 
      nextScene, 
      goldCost: cost,
      condition: () => {
        const { get } = require('svelte/store');
        const { gameStore } = require('../gameState.js');
        return get(gameStore).gold >= cost;
      }
    };
  }

  static item(text: string, nextScene: string, itemId: string): Choice {
    return { 
      text, 
      nextScene, 
      itemRequired: itemId,
      condition: () => {
        const { get } = require('svelte/store');
        const { gameStore } = require('../gameState.js');
        return get(gameStore).inventory.some((item: any) => item.id === itemId);
      }
    };
  }

  static multi(text: string, nextScene: string, requirements: {
    items?: string[];
    flags?: string[];
    skills?: Array<{ skill: keyof Skills; level: number }>;
    gold?: number;
  }): Choice {
    return {
      text,
      nextScene,
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
    };
  }

  static scene(
    id: string, 
    title: string, 
    description: string | (() => string), 
    choices: Choice[], 
    options: { onEnter?: () => void; category?: Scene['category'] } = {}
  ): Scene {
    const builder = this.create(id, title)
      .description(description);

    if (options.category) {
      builder.category(options.category);
    }

    if (options.onEnter) {
      builder.onEnter(options.onEnter);
    }

    choices.forEach(choice => {
      (builder as any).sceneChoices.push(choice);
    });

    return builder.build();
  }
}

export const exampleScenes = {
  complexTowerScene: SceneFactory.create('complexTower', 'The Ancient Tower')
    .description('A towering structure of ancient stone, pulsing with mystical energy.')
    .category('exploration')
    .addDestination('the tower entrance', 'towerEntrance')
    .addExamination('the mystical runes', 'examineRunes')
    .addChoice('Attempt to climb the exterior', 'climbExterior')
      .skillRequirement('stealth', 3)
      .build()
    .addChoice('Try to sense the magic within', 'senseMagic')
      .skillRequirement('magic_skill', 2)
      .build()
    .addItemChoice('Use the iron key on the door', 'unlockDoor', 'ironKey')
    .addReturnChoice()
    .onEnter(() => {
      const { applyStateUpdate } = require('../gameState.js');
      applyStateUpdate({ experience: 20, magic_skill: 1 });
    })
    .build(),

  merchantConversation: SceneFactory.create('merchant', 'The Village Merchant')
    .description('A friendly merchant with interesting wares and tales from distant lands.')
    .category('dialogue')
    .addResponse('Ask about rare magical items', 'magicalWares')
    .addResponse('Inquire about the dragon', 'merchantDragonTale')
    .addGoldChoice('Buy healing potions (50 gold)', 'buyPotions', 50)
    .addChoice('Trade your sword for supplies', 'tradeSword')
      .itemRequired('ancientSword')
      .build()
    .addReturnChoice('villageCenter')
    .onEnter(() => {
      const { applyStateUpdate } = require('../gameState.js');
      applyStateUpdate({ experience: 10, diplomacy: 1 });
    })
    .build()
};
