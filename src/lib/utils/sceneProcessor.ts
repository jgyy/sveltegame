// src/lib/utils/sceneProcessor.ts
import type { Scene, Choice } from '../core/types.js';
import { createSafeWrapper, logDebug } from './errorHandler.js';

export interface ProcessedScene {
	id: string;
	title: string;
	description: string;
	choices: Choice[];
	category?: string;
}

export const processScene = createSafeWrapper((scene: Scene): ProcessedScene => {
	logDebug(`Processing scene: ${scene.id}`);
	
	let description: string;
	if (typeof scene.description === 'function') {
		try {
			description = scene.description();
		} catch (error) {
			console.warn(`Error executing description function for scene ${scene.id}:`, error);
			description = `Error loading description for ${scene.title}`;
		}
	} else {
		description = scene.description;
	}
	
	let choices: Choice[];
	if (typeof scene.choices === 'function') {
		try {
			choices = scene.choices();
		} catch (error) {
			console.warn(`Error executing choices function for scene ${scene.id}:`, error);
			choices = [
				{ text: 'Return to start (error occurred)', nextScene: 'start' }
			];
		}
	} else {
		choices = scene.choices;
	}
	
	const validatedChoices = choices.filter(choice => {
		if (!choice.text || !choice.nextScene) {
			console.warn(`Invalid choice in scene ${scene.id}:`, choice);
			return false;
		}
		return true;
	});
	
	if (validatedChoices.length === 0) {
		console.warn(`No valid choices found for scene ${scene.id}, adding fallback`);
		validatedChoices.push({ text: 'Continue', nextScene: 'start' });
	}
	
	return {
		id: scene.id,
		title: scene.title,
		description,
		choices: validatedChoices,
		category: scene.category
	};
}, 'processScene', {
	id: 'error',
	title: 'Processing Error',
	description: 'There was an error processing this scene.',
	choices: [{ text: 'Return to start', nextScene: 'start' }]
});

export function validateChoice(choice: Choice): boolean {
	return !!(choice.text && choice.nextScene);
}

export function sanitizeText(text: string): string {
	return text.replace(/<script[^>]*>.*?<\/script>/gi, '')
			   .replace(/<[^>]*>/g, '')
			   .trim();
}

export function formatDescription(description: string): string {
	return description
		.replace(/\n\n/g, '</p><p>')
		.replace(/\n/g, '<br>')
		.replace(/^/, '<p>')
		.replace(/$/, '</p>');
}
