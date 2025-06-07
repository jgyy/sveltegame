<!-- src/lib/components/TextAdventure.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		gameStore, 
		currentScene, 
		inventory, 
		stats, 
		skills,
		makeChoice, 
		canMakeChoice, 
		useItem, 
		resetGame,
		initializeAutoSave
	} from '../gameState.js';

	let error: string | null = null;
	let scene: any = null;
	let items: any[] = [];
	let playerStats: any = {};
	let playerSkills: any = {};
	let gameState: any = {};

	function clearError() {
		error = null;
	}

	function handleError(err: Error, context: string) {
		console.error(`Error in ${context}:`, err);
		error = `Game Error (${context}): ${err.message}. Please try refreshing the page or starting a new game.`;
	}

	function safeStore(storeValue: any, fallback: any, storeName: string) {
		try {
			return storeValue || fallback;
		} catch (err) {
			handleError(err as Error, `accessing ${storeName} store`);
			return fallback;
		}
	}

	function safeMakeChoice(choice: any) {
		try {
			clearError();
			makeChoice(choice);
		} catch (err) {
			handleError(err as Error, 'making choice');
		}
	}

	function safeUseItem(itemId: string) {
		try {
			clearError();
			useItem(itemId);
		} catch (err) {
			handleError(err as Error, 'using item');
		}
	}

	function safeResetGame() {
		try {
			clearError();
			resetGame();
		} catch (err) {
			handleError(err as Error, 'resetting game');
		}
	}

	function safeCanMakeChoice(choice: any): boolean {
		try {
			return canMakeChoice(choice);
		} catch (err) {
			handleError(err as Error, 'checking choice availability');
			return false;
		}
	}

	onMount(() => {
		try {
			initializeAutoSave();
		} catch (err) {
			handleError(err as Error, 'initializing auto-save');
		}
	});

	$: {
		try {
			scene = safeStore($currentScene, { 
				title: 'Error Loading Scene', 
				description: 'There was an error loading the current scene.',
				choices: [{ text: 'Reset Game', nextScene: 'start' }]
			}, 'currentScene');
		} catch (err) {
			handleError(err as Error, 'updating scene');
		}
	}

	$: {
		try {
			items = safeStore($inventory, [], 'inventory');
		} catch (err) {
			handleError(err as Error, 'updating inventory');
		}
	}

	$: {
		try {
			playerStats = safeStore($stats, { health: 100, magic: 50, gold: 0, experience: 0, level: 1 }, 'stats');
		} catch (err) {
			handleError(err as Error, 'updating stats');
		}
	}

	$: {
		try {
			playerSkills = safeStore($skills, { combat: 1, magic_skill: 1, diplomacy: 1, stealth: 1 }, 'skills');
		} catch (err) {
			handleError(err as Error, 'updating skills');
		}
	}

	$: {
		try {
			gameState = safeStore($gameStore, { gameHistory: [], dragonDefeated: false }, 'gameStore');
		} catch (err) {
			handleError(err as Error, 'updating game state');
		}
	}
	
	$: health = playerStats.health || 100;
	$: magic = playerStats.magic || 50;
	$: gold = playerStats.gold || 0;
	$: experience = playerStats.experience || 0;
	$: level = playerStats.level || 1;
	
	$: combat = playerSkills.combat || 1;
	$: magic_skill = playerSkills.magic_skill || 1;
	$: diplomacy = playerSkills.diplomacy || 1;
	$: stealth = playerSkills.stealth || 1;
	
	$: gameHistory = gameState.gameHistory || [];
	$: dragonDefeated = gameState.dragonDefeated || false;
	
	$: usableItems = items.filter(item => item?.usable);
	$: isHealthCritical = health <= 30;
	$: isMagicLow = magic <= 20 && magic_skill > 1;
</script>

<div class="max-w-4xl mx-auto p-6 bg-gradient-to-b from-purple-50 via-blue-50 to-green-50 min-h-screen">
	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
			<div class="flex justify-between items-start">
				<div>
					<strong class="font-bold">⚠️ Error:</strong>
					<span class="block sm:inline">{error}</span>
				</div>
				<button 
					on:click={clearError}
					class="ml-4 text-red-700 hover:text-red-900"
				>
					✕
				</button>
			</div>
			<div class="mt-2">
				<button 
					on:click={safeResetGame}
					class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
				>
					Reset Game
				</button>
			</div>
		</div>
	{/if}

	<div class="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-purple-200">
		<h1 class="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
			🏰 The Dragon's Tower: Expanded Adventure
		</h1>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
			<div class="space-y-2">
				<div class="flex items-center space-x-2">
					<span class="text-red-600">❤️</span>
					<div class="flex-1 bg-red-100 rounded-full h-4">
						<div class="bg-red-500 h-4 rounded-full transition-all duration-300" style="width: {health}%"></div>
					</div>
					<span class="text-red-800 font-medium">{health}/100</span>
				</div>
				<div class="flex items-center space-x-2">
					<span class="text-blue-600">✨</span>
					<div class="flex-1 bg-blue-100 rounded-full h-4">
						<div class="bg-blue-500 h-4 rounded-full transition-all duration-300" style="width: {magic}%"></div>
					</div>
					<span class="text-blue-800 font-medium">{magic}/100</span>
				</div>
			</div>

			<div class="space-y-2">
				<div class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-center">
					<span class="font-medium">Level {level}</span>
				</div>
				<div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-center">
					<span class="font-medium">💰 {gold} Gold</span>
				</div>
				<div class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-center">
					<span class="font-medium">⭐ {experience} XP</span>
				</div>
			</div>

			<div class="space-y-1">
				<div class="text-xs text-gray-600 font-medium">Skills:</div>
				<div class="grid grid-cols-2 gap-1 text-xs">
					<span class="bg-red-100 text-red-700 px-2 py-1 rounded">⚔️ Combat {combat}</span>
					<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">🔮 Magic {magic_skill}</span>
					<span class="bg-green-100 text-green-700 px-2 py-1 rounded">🗣️ Diplomacy {diplomacy}</span>
					<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded">🥷 Stealth {stealth}</span>
				</div>
			</div>
		</div>

		<div class="flex justify-between items-center mt-4">
			{#if items.length > 0}
				<div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
					<span class="font-medium">🎒 Inventory:</span> 
					<span class="text-sm">{items.map(item => item?.name || 'Unknown Item').join(', ')}</span>
				</div>
			{:else}
				<div></div>
			{/if}
			
			<button 
				on:click={safeResetGame}
				class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
			>
				🔄 New Game
			</button>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-200">
		<div class="mb-6">
			<h2 class="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
				{scene?.title || 'Loading...'}
			</h2>
			<div class="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
				<p class="text-gray-700 leading-relaxed text-lg">
					{scene?.description || 'Loading scene...'}
				</p>
			</div>
		</div>

		<div class="space-y-3">
			{#if scene?.choices}
				{#each scene.choices as choice, index}
					{#if safeCanMakeChoice(choice)}
						<button
							on:click={() => safeMakeChoice(choice)}
							class="w-full text-left p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-blue-300"
						>
							<span class="font-medium">{choice.text}</span>
							{#if choice.skillRequirement}
								<span class="text-blue-200 text-sm ml-2">
									(Requires {choice.skillRequirement.skill.replace('_', ' ')} {choice.skillRequirement.level})
								</span>
							{/if}
						</button>
					{:else if choice.skillRequirement}
						<div class="w-full text-left p-4 bg-gray-300 text-gray-500 rounded-lg border-2 border-gray-400 cursor-not-allowed">
							<span>{choice.text}</span>
							<span class="text-gray-400 text-sm ml-2">
								(Requires {choice.skillRequirement.skill.replace('_', ' ')} {choice.skillRequirement.level})
							</span>
						</div>
					{/if}
				{/each}
			{:else}
				<div class="text-gray-500 text-center p-4">
					Loading choices...
				</div>
			{/if}
		</div>

		{#if usableItems.length > 0}
			<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
				<h3 class="font-medium text-yellow-800 mb-2">💼 Quick Use Items:</h3>
				<div class="flex flex-wrap gap-2">
					{#each usableItems as item}
						<button
							on:click={() => safeUseItem(item.id)}
							class="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-3 py-1 rounded-lg text-sm transition-colors"
						>
							Use {item.name}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		{#if isHealthCritical}
			<div class="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
				<p class="text-red-700 text-sm">⚠️ Your health is critically low! Seek healing immediately!</p>
			</div>
		{/if}

		{#if isMagicLow}
			<div class="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
				<p class="text-blue-700 text-sm">🔮 Your magical energy is running low!</p>
			</div>
		{/if}

		{#if dragonDefeated}
			<div class="mt-4 p-3 bg-gradient-to-r from-gold-100 to-yellow-100 border border-yellow-300 rounded-lg">
				<p class="text-yellow-700 text-sm">🐉✨ The dragon's curse has been broken! You are a true hero!</p>
			</div>
		{/if}

		{#if level > 1}
			<div class="mt-4 p-3 bg-purple-100 border border-purple-300 rounded-lg">
				<p class="text-purple-700 text-sm">⭐ You have grown stronger through your adventures! (Level {level})</p>
			</div>
		{/if}
	</div>

	{#if gameHistory.length > 0}
		<details class="mt-6 bg-white rounded-lg shadow-lg p-6 border-2 border-green-200">
			<summary class="cursor-pointer text-lg font-semibold text-gray-800 hover:text-green-600 flex items-center gap-2">
				📜 Adventure Chronicle ({gameHistory.length} actions)
			</summary>
			<div class="mt-4 space-y-2 max-h-60 overflow-y-auto">
				{#each gameHistory as action, index}
					<div class="text-sm text-gray-600 border-l-2 border-green-200 pl-3 hover:bg-green-50 rounded-r">
						<span class="font-medium text-green-700">{index + 1}.</span> {action}
					</div>
				{/each}
			</div>
		</details>
	{/if}
</div>
