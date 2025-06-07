// src/lib/data/stateUpdates.ts
import type { StateUpdate } from '../core/types.js';

export const createStateUpdate = (update: StateUpdate) => () => {
  const { applyStateUpdate } = require('../gameState.js');
  applyStateUpdate(update);
};

export const stateUpdates = {
  villageInteraction: (): StateUpdate => ({ 
    experience: 15, 
    diplomacy: 1, 
    flags: { villageVisited: true } 
  }),
  
  basicExploration: (): StateUpdate => ({ experience: 15 }),
  
  dragonInteraction: (): StateUpdate => ({ 
    experience: 25, 
    diplomacy: 2, 
    flags: { curseKnowledge: true } 
  }),
  
  magicalDiscovery: (): StateUpdate => ({ 
    experience: 30, 
    magic_skill: 2, 
    magic: 25 
  }),
  
  combatTraining: (): StateUpdate => ({ 
    experience: 20, 
    combat: 1, 
    health: 10 
  }),
  
  restAndRecovery: (): StateUpdate => ({ 
    health: 25, 
    magic: 15, 
    experience: 10 
  }),
  
  treasureFound: (goldAmount = 50): StateUpdate => ({ 
    gold: goldAmount, 
    experience: 20 
  }),
  
  skillTraining: (skill: string, amount = 1): StateUpdate => ({ 
    experience: 20, 
    [skill]: amount 
  }),
  
  levelUpBonus: (): StateUpdate => ({ 
    level: 1, 
    health: 10, 
    magic: 10, 
    experience: 100 
  }),
  
  victoryReward: (type: 'minor' | 'major' | 'ultimate' = 'minor'): StateUpdate => {
    const rewards = {
      minor: { experience: 50, gold: 100, diplomacy: 1 },
      major: { experience: 150, gold: 300, diplomacy: 3, level: 1 },
      ultimate: { experience: 500, gold: 1000, diplomacy: 5, level: 3, flags: { dragonDefeated: true } }
    };
    return rewards[type];
  }
};
