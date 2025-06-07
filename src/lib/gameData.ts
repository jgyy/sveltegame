// src/lib/gameData.ts
import type { Scene } from './core/types.js';
import { SceneFactory } from './core/sceneFactory.js';
import { SceneTemplates } from './core/sceneTemplates.js';
import { items } from './data/items.js';
import { missingScenes } from './data/missingScenes.js';

const coreScenes: Record<string, Scene> = {
	start: SceneFactory.exploration('start', 'The Crossroads of Destiny',
		'You stand at a crossroads where three paths diverge. To the north lies a mysterious forest shrouded in mist. To the east, you can see smoke rising from what appears to be a small village. To the west, an ancient stone bridge spans a rushing river, leading to unknown lands.',
		[
			{ name: 'the mysterious forest', sceneId: 'mysteriousForest' },
			{ name: 'the village', sceneId: 'approachVillage' },
			{ name: 'the stone bridge', sceneId: 'stoneBridge' },
			{ name: 'examine the area more carefully', sceneId: 'examineArea' }
		]
	),

	climbTower: SceneFactory.conversation('climbTower', 'The Dragon\'s Lair',
		'You reach the top of the tower and behold Aethonaris - the great dragon whose scales shimmer between gold and deep sorrow.',
		[
			{ 
				text: 'Offer to break the curse and restore his true form', 
				nextScene: 'breakCurse',
				requirement: () => {
					const { get } = require('svelte/store');
					const { gameStore } = require('./gameState.js');
					const state = get(gameStore);
					return state.hasSword && state.curseKnowledge;
				}
			},
			{ 
				text: 'Fight the dragon to end his suffering', 
				nextScene: 'fightDragon',
				requirement: () => {
					const { get } = require('svelte/store');
					const { gameStore } = require('./gameState.js');
					return get(gameStore).hasSword;
				}
			},
			{ 
				text: 'Try to communicate with the dragon', 
				nextScene: 'talkDragon'
			},
			{ 
				text: 'Run back down the stairs immediately', 
				nextScene: 'unlockTower'
			}
		],
		{
			experience: 25,
			diplomacy: 2,
			flags: { curseKnowledge: true }
		}
	),

	breakCurse: SceneFactory.victory('breakCurse', 'The Ritual of Redemption',
		'With the Blade of Transformation and your knowledge of the curse\'s true nature, you work together with Aethonaris to perform an ancient ritual. The sword glows with transformative light as you channel magic not to destroy, but to heal.',
		'ultimate'
	),

	openWithKey: SceneFactory.scene(
		'openWithKey',
		'Unlocking the Tower',
		'Your iron key fits perfectly into the ancient lock. The massive door creaks open, revealing a spiraling staircase leading upward.',
		[
			SceneFactory.basic('Climb the stairs to face the dragon', 'climbTower'),
			SceneFactory.basic('Explore the tower base first', 'towerBase'),
			SceneFactory.basic('Prepare yourself before ascending', 'towerPrepare')
		],
		{
			onEnter: () => {
				const { applyStateUpdate } = require('./gameState.js');
				applyStateUpdate({ experience: 20 });
			}
		}
	),

	towerBase: SceneFactory.exploration(
		'towerBase',
		'The Tower Base',
		'You explore the base of the dragon\'s tower. Ancient stones are carved with mystical symbols, and you sense powerful magic all around.',
		[
			{ name: 'the mysterious symbols', sceneId: 'examineSymbols' },
			{ name: 'a hidden chamber', sceneId: 'hiddenChamber' },
			{ name: 'the spiral staircase', sceneId: 'climbTower' }
		]
	),

	examineSymbols: SceneFactory.scene(
		'examineSymbols',
		'Ancient Symbols',
		'The symbols tell the story of a great curse and hint at its possible resolution through compassion rather than violence.',
		[SceneFactory.basic('Continue exploring', 'towerBase')],
		{
			onEnter: () => {
				const { applyStateUpdate } = require('./gameState.js');
				applyStateUpdate({ 
					experience: 25, 
					magic_skill: 1, 
					flags: { curseKnowledge: true } 
				});
			}
		}
	),

	hiddenChamber: SceneFactory.scene(
		'hiddenChamber',
		'Hidden Chamber',
		'You discover a hidden chamber containing ancient treasures and a magical sword that pulses with transformative energy.',
		[SceneFactory.basic('Take the sword and continue', 'towerBase')],
		{
			onEnter: () => {
				const { applyStateUpdate } = require('./gameState.js');
				applyStateUpdate({ 
					items: ['ancientSword'],
					experience: 30,
					flags: { hasSword: true }
				});
			}
		}
	),

	askAboutTower: SceneFactory.conversation(
		'askAboutTower',
		'Learning About the Tower',
		'The villagers speak in hushed tones about the dragon\'s tower and the curse that binds the creature within.',
		[
			{ text: 'Ask how to break the curse', nextScene: 'learnCurseBreaking' },
			{ text: 'Request guidance for approaching the tower', nextScene: 'getTowerGuidance' },
			{ text: 'Offer to face the dragon', nextScene: 'offerToHelp' }
		],
		{ experience: 20, diplomacy: 1, flags: { curseKnowledge: true } }
	),

	learnCurseBreaking: SceneFactory.scene(
		'learnCurseBreaking',
		'Knowledge of the Curse',
		'You learn that the dragon was once human, cursed by dark magic. Breaking the curse requires understanding, not violence.',
		[SceneFactory.basic('Thank them for the knowledge', 'start')],
		{
			onEnter: () => {
				const { applyStateUpdate } = require('./gameState.js');
				applyStateUpdate({ 
					experience: 30, 
					diplomacy: 2, 
					flags: { curseKnowledge: true } 
				});
			}
		}
	),

	combatVictory: SceneFactory.victory(
		'combatVictory',
		'Victory Through Strength',
		'Through superior combat skill, you defeat the dragon in honorable battle. The curse breaks as the dragon finds peace.',
		'major'
	),

	magicVictory: SceneFactory.victory(
		'magicVictory',
		'Victory Through Magic',
		'Your powerful magic overcomes the dragon\'s defenses. As your spell completes, the curse dissolves and the dragon is freed.',
		'major'
	),

	hardFought: SceneFactory.scene(
		'hardFought',
		'A Hard-Fought Battle',
		'You battle valiantly but the fight is difficult. Still, your determination impresses the dragon.',
		[
			SceneFactory.basic('Continue the fight', 'fightDragon'),
			SceneFactory.basic('Try to reason with the dragon', 'talkDragon'),
			SceneFactory.basic('Attempt to use diplomacy', 'showCompassion')
		],
		{
			onEnter: () => {
				const { applyStateUpdate } = require('./gameState.js');
				applyStateUpdate({ experience: 20, combat: 1, health: -20 });
			}
		}
	)
};

const generatedScenes = SceneTemplates.generateScenes(SceneTemplates.getAllTemplates());

export const scenes: Record<string, Scene> = {
	...coreScenes,
	...generatedScenes,
	...missingScenes
};

export { items };
