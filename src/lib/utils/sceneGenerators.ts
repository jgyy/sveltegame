// src/lib/utils/sceneGenerators.ts
import type { Scene } from '../types.js';
import { basicChoice, createScene } from './sceneHelpers.js';

interface SceneTemplate {
  id: string;
  title: string;
  description: string;
  nextScenes?: string[];
  rewards?: {
    experience?: number;
    skill?: string;
    skillAmount?: number;
    gold?: number;
    health?: number;
    magic?: number;
    flags?: Record<string, boolean>;
  };
}

function generateSceneCategory(
  prefix: string,
  templates: SceneTemplate[],
  defaultNextScenes: string[] = ['start']
): Record<string, Scene> {
  return Object.fromEntries(
    templates.map(template => [
      template.id,
      createScene(
        template.id,
        template.title,
        template.description,
        [
          ...(template.nextScenes || []).map(next => 
            basicChoice(`Continue to ${next}`, next)
          ),
          ...defaultNextScenes.map(next => 
            basicChoice(next === 'start' ? 'Return to crossroads' : `Go to ${next}`, next)
          )
        ],
        template.rewards ? () => {
          const { gameStore } = require('../gameState.js');
          gameStore.update((state: any) => {
            const updates: any = { ...state };
            const rewards = template.rewards!;
            
            if (rewards.experience) updates.experience += rewards.experience;
            if (rewards.skill && rewards.skillAmount) updates[rewards.skill] += rewards.skillAmount;
            if (rewards.gold) updates.gold += rewards.gold;
            if (rewards.health) updates.health = Math.min(100, updates.health + rewards.health);
            if (rewards.magic) updates.magic = Math.min(100, updates.magic + rewards.magic);
            if (rewards.flags) Object.assign(updates, rewards.flags);
            
            return updates;
          });
        } : undefined
      )
    ])
  );
}

const SCENE_TEMPLATES = {
  village: [
    {
      id: 'villageMarket',
      title: 'The Village Market',
      description: 'You interact with the village market, learning more about the curse\'s effects.',
      nextScenes: ['askDragon', 'offerHelp'],
      rewards: { experience: 15, skill: 'diplomacy', skillAmount: 1, flags: { villageVisited: true } }
    },
    {
      id: 'villageInn',
      title: 'The Village Inn',
      description: 'You visit the local inn and gather information from travelers.',
      nextScenes: ['askDragon', 'offerHelp'],
      rewards: { experience: 15, skill: 'diplomacy', skillAmount: 1, flags: { villageVisited: true } }
    },
    {
      id: 'villageBlacksmith',
      title: 'The Village Blacksmith',
      description: 'The blacksmith shares tales of the curse and offers to maintain your equipment.',
      nextScenes: ['askDragon', 'offerHelp'],
      rewards: { experience: 15, skill: 'combat', skillAmount: 1, flags: { villageVisited: true } }
    }
  ],

  dragon: [
    {
      id: 'talkDragon',
      title: 'Attempting Communication',
      description: 'You attempt to speak with the dragon before fighting.',
      nextScenes: ['askAboutPain', 'offerHelp'],
      rewards: { experience: 25, skill: 'diplomacy', skillAmount: 2, flags: { curseKnowledge: true } }
    },
    {
      id: 'comfortDragon',
      title: 'Offering Comfort',
      description: 'You offer words of comfort to the suffering dragon.',
      nextScenes: ['promiseHelp', 'askHowToHeal'],
      rewards: { experience: 25, skill: 'diplomacy', skillAmount: 2, flags: { curseKnowledge: true } }
    },
    {
      id: 'discussCurse',
      title: 'Understanding the Curse',
      description: 'You speak knowledgeably about the curse affecting Aethonaris.',
      nextScenes: ['askCureMethod', 'showCompassion'],
      rewards: { experience: 25, skill: 'diplomacy', skillAmount: 2, flags: { curseKnowledge: true } }
    }
  ],

  preparation: [
    {
      id: 'meditation',
      title: 'Meditation Before Adventure',
      description: 'You take time to meditate and prepare yourself for the challenges ahead.',
      nextScenes: ['tower', 'approachVillage', 'mysteriousForest'],
      rewards: { experience: 20, health: 15, magic: 15 }
    },
    {
      id: 'practice',
      title: 'Practice Before Adventure',
      description: 'You practice your skills and prepare yourself for the challenges ahead.',
      nextScenes: ['tower', 'approachVillage', 'mysteriousForest'],
      rewards: { experience: 20, skill: 'combat', skillAmount: 1, health: 15 }
    },
    {
      id: 'study',
      title: 'Study Before Adventure',
      description: 'You study ancient texts and magical knowledge to prepare.',
      nextScenes: ['tower', 'approachVillage', 'mysteriousForest'],
      rewards: { experience: 20, skill: 'magic_skill', skillAmount: 1, magic: 15 }
    }
  ],

  endings: [
    {
      id: 'perfectVictory',
      title: 'Perfect Victory',
      description: 'Through your perfect approach, you achieve a truly meaningful victory.',
      nextScenes: ['celebrateWithDragon', 'ultimateHeroReturn', 'dragonMentor'],
      rewards: { experience: 200, skill: 'diplomacy', skillAmount: 3, flags: { dragonDefeated: true } }
    },
    {
      id: 'compassionateVictory',
      title: 'Compassionate Victory',
      description: 'Through compassion and understanding, you achieve true victory.',
      nextScenes: ['celebrateWithDragon', 'ultimateHeroReturn', 'dragonMentor'],
      rewards: { experience: 200, skill: 'diplomacy', skillAmount: 3, flags: { dragonDefeated: true } }
    }
  ],

  bridge: [
    {
      id: 'repairBridge',
      title: 'Repair Bridge',
      description: 'You work to repair the damaged stone bridge.',
      nextScenes: ['wizardTower', 'approachVillage'],
      rewards: { experience: 20, flags: { bridgeRepaired: true } }
    },
    {
      id: 'crossDamaged',
      title: 'Cross Damaged Bridge',
      description: 'You carefully attempt to cross the damaged bridge.',
      nextScenes: ['wizardTower', 'exploreWest'],
      rewards: { experience: 20, skill: 'stealth', skillAmount: 1 }
    }
  ],

  learning: [
    {
      id: 'dragonMentor',
      title: 'Dragon Mentor',
      description: 'You learn under Aethonaris\'s wise guidance.',
      nextScenes: ['advancedLearning', 'practiceSkills', 'becomeTeacher'],
      rewards: { experience: 100, skill: 'magic_skill', skillAmount: 3, skill: 'diplomacy', skillAmount: 2 }
    },
    {
      id: 'advancedLearning',
      title: 'Advanced Learning',
      description: 'You delve deep into advanced magical arts and wisdom.',
      nextScenes: ['transformationMaster', 'guardianMagic', 'becomeTeacher'],
      rewards: { experience: 100, skill: 'magic_skill', skillAmount: 4, skill: 'diplomacy', skillAmount: 2 }
    }
  ],

  magic: [
    {
      id: 'waterSpirits',
      title: 'Water Spirits',
      description: 'You commune with the water spirits and gain their wisdom.',
      nextScenes: ['advancedMagic', 'usemagic', 'tower'],
      rewards: { experience: 30, skill: 'magic_skill', skillAmount: 2, magic: 25 }
    },
    {
      id: 'spiritWisdom',
      title: 'Spirit Wisdom',
      description: 'Ancient spirits share their knowledge with you.',
      nextScenes: ['advancedMagic', 'usemagic', 'tower'],
      rewards: { experience: 30, skill: 'magic_skill', skillAmount: 2, magic: 25 }
    }
  ]
};

export const generateVillageScenes = () => generateSceneCategory('village', SCENE_TEMPLATES.village, ['approachVillage']);
export const generateDragonDialogues = () => generateSceneCategory('dragon', SCENE_TEMPLATES.dragon, ['climbTower']);
export const generatePreparationScenes = () => generateSceneCategory('preparation', SCENE_TEMPLATES.preparation);
export const generateEndingScenes = () => generateSceneCategory('ending', SCENE_TEMPLATES.endings);
export const generateBridgeScenes = () => generateSceneCategory('bridge', SCENE_TEMPLATES.bridge);
export const generateLearningScenes = () => generateSceneCategory('learning', SCENE_TEMPLATES.learning);
export const generateMagicScenes = () => generateSceneCategory('magic', SCENE_TEMPLATES.magic);

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
