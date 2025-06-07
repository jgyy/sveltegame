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
	import { safeStoreAccess } from '../utils/errorHandler.js';
	import GameUI from './GameUI.svelte';

	let error: string | null = null;

	const scene = $derived(safeStoreAccess($currentScene, { 
		title: 'Error Loading Scene', 
		description: 'There was an error loading the current scene.',
		choices: [{ text: 'Reset Game', nextScene: 'start' }]
	}, 'currentScene'));

	const items = $derived(safeStoreAccess($inventory, [], 'inventory'));
	const playerStats = $derived(safeStoreAccess($stats, { health: 100, magic: 50, gold: 0, experience: 0, level: 1 }, 'stats'));
	const playerSkills = $derived(safeStoreAccess($skills, { combat: 1, magic_skill: 1, diplomacy: 1, stealth: 1 }, 'skills'));
	const gameState = $derived(safeStoreAccess($gameStore, { gameHistory: [], dragonDefeated: false }, 'gameStore'));

	const usableItems = $derived(items.filter(item => item?.usable));
	const isHealthCritical = $derived(playerStats.health <= 30);
	const isMagicLow = $derived(playerStats.magic <= 20 && playerSkills.magic_skill > 1);

	function handleChoice(choice: any) {
		try {
			error = null;
			makeChoice(choice);
		} catch (err) {
			error = `Error making choice: ${(err as Error).message}`;
		}
	}

	function handleUseItem(itemId: string) {
		try {
			error = null;
			useItem(itemId);
		} catch (err) {
			error = `Error using item: ${(err as Error).message}`;
		}
	}

	function handleResetGame() {
		try {
			error = null;
			resetGame();
		} catch (err) {
			error = `Error resetting game: ${(err as Error).message}`;
		}
	}

	onMount(() => {
		try {
			initializeAutoSave();
		} catch (err) {
			error = `Error initializing auto-save: ${(err as Error).message}`;
		}
	});
</script>

<div class="max-w-4xl mx-auto p-6 bg-gradient-to-b from-purple-50 via-blue-50 to-green-50 min-h-screen">
	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
			<div class="flex justify-between items-start">
				<div>
					<strong class="font-bold">⚠️ Error:</strong>
					<span class="block sm:inline">{error}</span>
				</div>
				<button onclick={() => error = null} class="ml-4 text-red-700 hover:text-red-900">✕</button>
			</div>
			<div class="mt-2">
				<button onclick={handleResetGame} class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
					Reset Game
				</button>
			</div>
		</div>
	{/if}

	<GameUI 
		{...playerStats}
		{...playerSkills}
		{items}
		onResetGame={handleResetGame}
	/>

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
				{#each scene.choices as choice}
					{#if canMakeChoice(choice)}
						<button
							onclick={() => handleChoice(choice)}
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
			{/if}
		</div>

		{#if usableItems.length > 0}
			<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
				<h3 class="font-medium text-yellow-800 mb-2">💼 Quick Use Items:</h3>
				<div class="flex flex-wrap gap-2">
					{#each usableItems as item}
						<button
							onclick={() => handleUseItem(item.id)}
							class="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-3 py-1 rounded-lg text-sm transition-colors"
						>
							Use {item.name}
						</button>
					{/each}
				</div>
			</div>
		{/if}

	</div>
</div>
