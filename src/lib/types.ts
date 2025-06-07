// src/lib/types.ts
export interface Choice {
	text: string;
	nextScene: string | (() => string);
	condition?: () => boolean;
	skillRequirement?: { skill: keyof Skills; level: number };
}

export interface Scene {
	id: string;
	title: string;
	description: string | (() => string);
	choices: Choice[] | (() => Choice[]);
	onEnter?: () => void;
	image?: string;
}

export interface Item {
	id: string;
	name: string;
	description: string;
	value?: number;
	usable?: boolean;
}

export interface Skills {
	combat: number;
	magic_skill: number;
	diplomacy: number;
	stealth: number;
}

export interface GameState {
	currentSceneId: string;
	inventory: Item[];
	health: number;
	magic: number;
	gold: number;
	experience: number;
	level: number;
	
	hasKey: boolean;
	hasSword: boolean;
	hasMap: boolean;
	hasPotion: boolean;
	hasSpellbook: boolean;
	dragonDefeated: boolean;
	wizardMet: boolean;
	villageVisited: boolean;
	bridgeRepaired: boolean;
	merchantFriend: boolean;
	curseKnowledge: boolean;
	
	combat: number;
	magic_skill: number;
	diplomacy: number;
	stealth: number;
	
	gameHistory: string[];
}
