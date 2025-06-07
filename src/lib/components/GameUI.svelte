<!-- src/lib/components/GameUI.svelte -->
<script lang="ts">
	import type { GameState } from '../types.js';

	interface Props {
		health: number;
		magic: number;
		gold: number;
		experience: number;
		level: number;
		combat: number;
		magic_skill: number;
		diplomacy: number;
		stealth: number;
		items: any[];
		onResetGame: () => void;
	}

	let { 
		health, 
		magic, 
		gold, 
		experience, 
		level, 
		combat, 
		magic_skill, 
		diplomacy, 
		stealth, 
		items, 
		onResetGame 
	}: Props = $props();

	function createProgressBar(value: number, max: number, colorClass: string) {
		return {
			percentage: Math.min(100, (value / max) * 100),
			colorClass
		};
	}

	const healthBar = $derived(createProgressBar(health, 100, 'bg-red-500'));
	const magicBar = $derived(createProgressBar(magic, 100, 'bg-blue-500'));
</script>

<div class="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-purple-200">
	<h1 class="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
		🏰 The Dragon's Tower: Expanded Adventure
	</h1>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
		<div class="space-y-2">
			<div class="flex items-center space-x-2">
				<span class="text-red-600">❤️</span>
				<div class="flex-1 bg-red-100 rounded-full h-4">
					<div class="{healthBar.colorClass} h-4 rounded-full transition-all duration-300" 
						 style="width: {healthBar.percentage}%"></div>
				</div>
				<span class="text-red-800 font-medium">{health}/100</span>
			</div>
			<div class="flex items-center space-x-2">
				<span class="text-blue-600">✨</span>
				<div class="flex-1 bg-blue-100 rounded-full h-4">
					<div class="{magicBar.colorClass} h-4 rounded-full transition-all duration-300" 
						 style="width: {magicBar.percentage}%"></div>
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
			onclick={onResetGame}
			class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium"
		>
			🔄 New Game
		</button>
	</div>
</div>
