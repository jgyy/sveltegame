// src/lib/utils/sceneValidator.ts
import { scenes } from '../gameData.js';
import type { Scene, Choice } from '../core/types.js';

interface ValidationResult {
	missingScenes: string[];
	unreachableScenes: string[];
	duplicateScenes: string[];
	totalScenes: number;
	referencedScenes: Set<string>;
	scenesByCategory: Record<string, string[]>;
}

export function validateScenes(): ValidationResult {
	const allSceneIds = new Set(Object.keys(scenes));
	const referencedScenes = new Set<string>();
	const missingScenes: string[] = [];
	const duplicateScenes: string[] = [];
	const scenesByCategory: Record<string, string[]> = {};

	const seenTitles = new Map<string, string>();
	Object.values(scenes).forEach((scene: Scene) => {
		const category = scene.category || 'uncategorized';
		if (!scenesByCategory[category]) scenesByCategory[category] = [];
		scenesByCategory[category].push(scene.id);

		if (seenTitles.has(scene.title)) {
			duplicateScenes.push(`${scene.id} (duplicate of ${seenTitles.get(scene.title)})`);
		} else {
			seenTitles.set(scene.title, scene.id);
		}
	});

	referencedScenes.add('start');

	Object.values(scenes).forEach((scene: Scene) => {
		let choices: Choice[] = [];
		
		if (typeof scene.choices === 'function') {
			try {
				choices = scene.choices();
			} catch (error) {
				console.warn(`Error executing choices function for scene ${scene.id}:`, error);
				return;
			}
		} else {
			choices = scene.choices;
		}

		choices.forEach(choice => {
			let nextSceneId: string;
			
			if (typeof choice.nextScene === 'function') {
				try {
					nextSceneId = choice.nextScene();
				} catch (error) {
					console.warn(`Error executing nextScene function for choice in scene ${scene.id}:`, error);
					return;
				}
			} else {
				nextSceneId = choice.nextScene;
			}

			referencedScenes.add(nextSceneId);
			
			if (!allSceneIds.has(nextSceneId)) {
				missingScenes.push(nextSceneId);
			}
		});
	});

	const unreachableScenes = Array.from(allSceneIds).filter(
		sceneId => !referencedScenes.has(sceneId)
	);

	return {
		missingScenes: Array.from(new Set(missingScenes)), 
		unreachableScenes,
		duplicateScenes,
		totalScenes: allSceneIds.size,
		referencedScenes,
		scenesByCategory
	};
}

export function printValidationReport(): void {
	const result = validateScenes();
	
	console.log('=== Enhanced Scene Validation Report ===');
	console.log(`Total scenes defined: ${result.totalScenes}`);
	console.log(`Total scenes referenced: ${result.referencedScenes.size}`);
	
	console.log('\n📊 Scenes by Category:');
	Object.entries(result.scenesByCategory).forEach(([category, scenes]) => {
		console.log(`  ${category}: ${scenes.length} scenes`);
	});
	
	if (result.duplicateScenes.length > 0) {
		console.log('\n🔄 Potential Duplicate Scenes:');
		result.duplicateScenes.forEach(duplicate => {
			console.log(`  - ${duplicate}`);
		});
	}
	
	if (result.missingScenes.length > 0) {
		console.log('\n❌ Missing scenes (referenced but not defined):');
		result.missingScenes.forEach(sceneId => {
			console.log(`  - ${sceneId}`);
		});
	} else {
		console.log('\n✅ No missing scenes found!');
	}
	
	if (result.unreachableScenes.length > 0) {
		console.log('\n⚠️ Unreachable scenes (defined but never referenced):');
		result.unreachableScenes.forEach(sceneId => {
			console.log(`  - ${sceneId}`);
		});
	} else {
		console.log('\n✅ All defined scenes are reachable!');
	}
	
	console.log('\n=== End Report ===');
}
