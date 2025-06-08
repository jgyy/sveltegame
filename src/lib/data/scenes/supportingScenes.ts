// src/lib/data/scenes/supportingScenes.ts
import type { Scene } from '../../core/types.js';
import { SceneFactory } from '../../core/sceneFactory.js';
import { createStateUpdate, stateUpdates } from '../stateUpdates.js';

export const supportingScenes: Record<string, Scene> = {
  repairBuildings: SceneFactory.scene(
    'repairBuildings',
    'Repairing Village Buildings',
    'You help the villagers repair buildings damaged by the dragon\'s influence. Your work brings hope to the community.',
    [SceneFactory.basic('Continue helping', 'villageCenter')],
    {
      onEnter: createStateUpdate({ experience: 25, combat: 1, diplomacy: 2, gold: 30 })
    }
  ),

  helpFarming: SceneFactory.scene(
    'helpFarming',
    'Helping with Farm Work',
    'You assist the villagers with their farming tasks, learning about their daily struggles and showing them they\'re not alone.',
    [SceneFactory.basic('Continue your assistance', 'villageCenter')],
    {
      onEnter: createStateUpdate({ experience: 20, diplomacy: 2, health: 10, gold: 20 })
    }
  ),

  protectVillage: SceneFactory.scene(
    'protectVillage',
    'Protecting the Village',
    'You help defend the village from bandits and wild creatures, earning the villagers\' deep gratitude.',
    [SceneFactory.basic('Accept their thanks', 'villageCenter')],
    {
      onEnter: createStateUpdate({ experience: 30, combat: 2, diplomacy: 2, gold: 50 })
    }
  ),

  teachSkills: SceneFactory.scene(
    'teachSkills',
    'Teaching Skills to Villagers',
    'You share your knowledge and skills with the villagers, helping them become more self-sufficient.',
    [SceneFactory.basic('Continue teaching', 'villageCenter')],
    {
      onEnter: createStateUpdate({ experience: 35, diplomacy: 3, magic_skill: 1, gold: 25 })
    }
  ),

  ritualSuccess: SceneFactory.victory(
    'ritualSuccess',
    'Successful Ritual',
    'Your magical power perfectly channels the healing energy, successfully breaking the curse and freeing Aethonaris.',
    'ultimate'
  ),

  compassionateRitual: SceneFactory.scene(
    'compassionateRitual',
    'Ritual of Compassion',
    'You focus entirely on your compassion and understanding, allowing these pure emotions to fuel the healing magic.',
    [SceneFactory.basic('Complete the transformation', 'compassionVictory')],
    {
      onEnter: createStateUpdate({ experience: 40, diplomacy: 3, magic_skill: 1 })
    }
  ),

  perfectRitual: SceneFactory.victory(
    'perfectRitual',
    'The Perfect Ritual',
    'Combining magical skill, ancient wisdom, and pure compassion, you perform a perfect ritual that not only breaks the curse but transforms both you and Aethonaris.',
    'ultimate'
  ),

  compassionVictory: SceneFactory.victory(
    'compassionVictory',
    'Victory Through Compassion',
    'Your pure compassion succeeds where force would have failed, breaking the curse and earning a lifelong friend.',
    'ultimate'
  ),

  wizardTowerEntrance: SceneFactory.interaction(
    'wizardTowerEntrance',
    'The Wizard\'s Tower Entrance',
    'You approach the entrance to the wizard\'s tower. The door is adorned with complex magical symbols.',
    [
      { text: 'Knock politely', nextScene: 'knockOnDoor' },
      { text: 'Try to decipher the symbols', nextScene: 'decipherSymbols' },
      { text: 'Use magic to announce yourself', nextScene: 'magicAnnouncement' },
      { text: 'Look for another way in', nextScene: 'wizardTower' }
    ],
    { experience: 15, magic_skill: 1 }
  ),

  magicalGarden: SceneFactory.exploration(
    'magicalGarden',
    'The Wizard\'s Magical Garden',
    'A beautiful garden where magical plants grow in impossible combinations, defying natural laws.',
    [
      { name: 'the floating flowers', sceneId: 'floatingFlowers' },
      { name: 'the singing vegetables', sceneId: 'singingVegetables' },
      { name: 'the time-distortion area', sceneId: 'timeDistortion' },
      { name: 'the potion ingredients', sceneId: 'potionIngredients' }
    ],
    { experience: 25, magic_skill: 2, magic: 15 }
  ),

  circleCenter: SceneFactory.scene(
    'circleCenter',
    'Center of the Stone Circle',
    'You step into the center of the ancient stone circle and feel powerful energies flowing through you.',
    [
      SceneFactory.skill('Channel the energy into your magic', 'channelCircleEnergy', 'magic_skill', 2),
      SceneFactory.basic('Meditate on the ancient power', 'circlemeditation'),
      SceneFactory.basic('Study the energy patterns', 'studyPatterns'),
      SceneFactory.basic('Leave the circle respectfully', 'stoneCircle')
    ],
    {
      onEnter: createStateUpdate({ experience: 30, magic: 20, magic_skill: 1 })
    }
  ),

  unicornGrove: SceneFactory.conversation(
    'unicornGrove',
    'The Unicorn\'s Grove',
    'You discover a magnificent unicorn in a grove of silver trees. The creature regards you with intelligent, knowing eyes.',
    [
      { text: 'Approach with respect and humility', nextScene: 'respectfulApproach' },
      { text: 'Offer a gift of pure intent', nextScene: 'offerGift' },
      { text: 'Ask for the unicorn\'s blessing', nextScene: 'unicornBlessing' },
      { text: 'Simply admire from a distance', nextScene: 'admireUnicorn' }
    ],
    { experience: 40, magic_skill: 2, diplomacy: 2, flags: { metUnicorn: true } }
  ),

  crystalFormations: SceneFactory.interaction(
    'crystalFormations',
    'Studying the Crystal Formations',
    'You examine the magnificent crystal formations, each one resonating with different magical frequencies.',
    [
      { text: 'Attune to the healing crystals', nextScene: 'attunHealing' },
      { text: 'Study the power crystals', nextScene: 'studyPower' },
      { text: 'Meditate with the wisdom crystals', nextScene: 'meditateWisdom' },
      { text: 'Attempt to harvest some crystals', nextScene: 'harvestCrystals' }
    ],
    { experience: 25, magic_skill: 2, magic: 20 }
  ),

  knockOnDoor: SceneFactory.conversation(
    'knockOnDoor',
    'Meeting the Wizard',
    'A wise old wizard opens the door, greeting you with curious but friendly eyes.',
    [
      { text: 'Ask for help with the dragon', nextScene: 'wizardDragonAdvice' },
      { text: 'Request magical training', nextScene: 'wizardTraining' },
      { text: 'Offer your services', nextScene: 'offerWizardHelp' },
      { text: 'Ask about local mysteries', nextScene: 'localMysteries' }
    ],
    { experience: 30, magic_skill: 2, flags: { metWizard: true } }
  ),

  wizardDragonAdvice: SceneFactory.conversation(
    'wizardDragonAdvice',
    'The Wizard\'s Dragon Advice',
    'The wizard shares valuable insights about dragons, curses, and the power of understanding.',
    [
      { text: 'Learn about curse-breaking magic', nextScene: 'learnCurseBreaking' },
      { text: 'Ask for a magical item to help', nextScene: 'requestMagicalAid' },
      { text: 'Discuss the dragon\'s nature', nextScene: 'discussDragonNature' }
    ],
    { experience: 35, magic_skill: 3, flags: { wizardAdvice: true } }
  ),

  natureBlessingResult: SceneFactory.scene(
    'natureBlessingResult',
    'The Power of Nature\'s Blessing',
    'You feel the blessing of nature flowing through you, enhancing your connection to the natural world.',
    [SceneFactory.basic('Continue with renewed purpose', 'start')],
    {
      onEnter: createStateUpdate({ 
        experience: 40, 
        magic_skill: 2, 
        magic: 30, 
        health: 20,
        flags: { natureBlessingActive: true } 
      })
    }
  ),

  strengthBlessing: SceneFactory.scene(
    'strengthBlessing',
    'Blessing of Strength',
    'The ancient tree grants you a blessing of physical and inner strength.',
    [SceneFactory.basic('Feel your strength increase', 'natureBlessingResult')],
    {
      onEnter: createStateUpdate({ combat: 2, health: 25, experience: 30 })
    }
  ),

  wisdomBlessing: SceneFactory.scene(
    'wisdomBlessing',
    'Blessing of Wisdom',
    'The tree imparts ancient wisdom, enhancing your understanding and magical abilities.',
    [SceneFactory.basic('Feel wisdom flowing through you', 'natureBlessingResult')],
    {
      onEnter: createStateUpdate({ magic_skill: 3, diplomacy: 2, experience: 35 })
    }
  ),

  healingBlessing: SceneFactory.scene(
    'healingBlessing',
    'Blessing of Healing',
    'You receive a powerful blessing of healing and restoration.',
    [SceneFactory.basic('Feel your body and spirit heal', 'natureBlessingResult')],
    {
      onEnter: createStateUpdate({ health: 40, magic: 30, experience: 30 })
    }
  ),

  dragonHelpBlessing: SceneFactory.scene(
    'dragonHelpBlessing',
    'Blessing to Help the Dragon',
    'The tree grants you a special blessing specifically to aid in helping the cursed dragon.',
    [SceneFactory.basic('Feel the power to heal others', 'natureBlessingResult')],
    {
      onEnter: createStateUpdate({ 
        diplomacy: 3, 
        magic_skill: 2, 
        experience: 40,
        flags: { dragonHelpBlessing: true } 
      })
    }
  )
};
