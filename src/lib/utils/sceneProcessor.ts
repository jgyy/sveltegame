// src/lib/utils/sceneProcessor.ts
import type { Scene } from '../types.js';

export function processScene(scene: Scene): Scene {
	const processedScene = { ...scene };
	
	if (typeof scene.description === 'function') {
		try {
			processedScene.description = scene.description();
		} catch (err) {
			console.error('Error calling scene description function:', err);
			processedScene.description = 'Error loading scene description.';
		}
	}
	
	if (typeof scene.choices === 'function') {
		try {
			processedScene.choices = scene.choices();
		} catch (err) {
			console.error('Error calling scene choices function:', err);
			processedScene.choices = [{ text: 'Reset Game', nextScene: 'start' }];
		}
	}
	
	return processedScene;
}
