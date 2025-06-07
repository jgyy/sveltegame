<!-- src/lib/components/TextAdventure.svelte -->
<script lang="ts">
	interface Choice {
		text: string;
		nextScene: string;
		condition?: () => boolean;
	}

	interface Scene {
		id: string;
		title: string;
		description: string;
		choices: Choice[];
		onEnter?: () => void;
	}

	let currentSceneId = $state('start');
	let inventory = $state<string[]>([]);
	let health = $state(100);
	let hasKey = $state(false);
	let hasSword = $state(false);
	let dragonDefeated = $state(false);
	let gameHistory = $state<string[]>([]);

	const scenes: Record<string, Scene> = {
		start: {
			id: 'start',
			title: 'The Mysterious Forest',
			description: 'You find yourself standing at the edge of a dark, mysterious forest. Ancient trees tower above you, their branches creating an intricate canopy that blocks most of the sunlight. A worn path winds deeper into the woods, while to your right you notice what appears to be an old, abandoned cottage.',
			choices: [
				{ text: 'Follow the path deeper into the forest', nextScene: 'deepForest' },
				{ text: 'Investigate the abandoned cottage', nextScene: 'cottage' },
				{ text: 'Turn back and leave this place', nextScene: 'coward' }
			]
		},

		cottage: {
			id: 'cottage',
			title: 'The Abandoned Cottage',
			description: 'The cottage is old and weathered, with ivy covering most of its stone walls. The wooden door hangs slightly ajar, creaking softly in the breeze. Through the dirty windows, you can see the dim outline of furniture covered in dust sheets.',
			choices: [
				{ text: 'Enter the cottage', nextScene: 'insideCottage' },
				{ text: 'Look around the outside of the cottage', nextScene: 'cottageSide' },
				{ text: 'Return to the forest edge', nextScene: 'start' }
			]
		},

		insideCottage: {
			id: 'insideCottage',
			title: 'Inside the Cottage',
			description: 'The interior is dusty but surprisingly well-preserved. A stone fireplace dominates one wall, and an old wooden table sits in the center of the room. On the table, you notice a rusty iron key and what appears to be an old journal.',
			choices: [
				{ text: 'Take the key', nextScene: 'takeKey' },
				{ text: 'Read the journal', nextScene: 'journal' },
				{ text: 'Search the rest of the cottage', nextScene: 'searchCottage' },
				{ text: 'Leave the cottage', nextScene: 'cottage' }
			]
		},

		takeKey: {
			id: 'takeKey',
			title: 'The Iron Key',
			description: 'You pick up the iron key. It\'s heavy and old, but still seems functional. There are strange symbols etched into its surface that you don\'t recognize.',
			onEnter: () => {
				hasKey = true;
				inventory.push('Iron Key');
			},
			choices: [
				{ text: 'Read the journal on the table', nextScene: 'journal' },
				{ text: 'Search the rest of the cottage', nextScene: 'searchCottage' },
				{ text: 'Leave the cottage', nextScene: 'cottage' }
			]
		},

		journal: {
			id: 'journal',
			title: 'The Mysterious Journal',
			description: 'The journal is written in an elegant hand. The last entry reads: "The dragon in the old tower has been terrorizing our village for months. I\'ve discovered that the ancient sword hidden in the cave behind the waterfall is the only weapon that can defeat it. The key I\'ve left here will unlock the tower door. May whoever finds this have the courage I lacked."',
			choices: [
				{ text: 'Take the key if you haven\'t already', nextScene: hasKey ? 'searchCottage' : 'takeKey' },
				{ text: 'Search the rest of the cottage', nextScene: 'searchCottage' },
				{ text: 'Leave and head to the deep forest', nextScene: 'deepForest' }
			]
		},

		searchCottage: {
			id: 'searchCottage',
			title: 'Searching the Cottage',
			description: 'You search through the cottage but find nothing else of interest. The furniture is mostly empty, and any food has long since spoiled.',
			choices: [
				{ text: 'Leave the cottage and head to the deep forest', nextScene: 'deepForest' },
				{ text: 'Return to the forest edge', nextScene: 'start' }
			]
		},

		cottageSide: {
			id: 'cottageSide',
			title: 'Around the Cottage',
			description: 'Walking around the cottage, you discover a small vegetable garden that has grown wild and a well that looks like it might still have water.',
			choices: [
				{ text: 'Drink from the well', nextScene: 'drinkWell' },
				{ text: 'Enter the cottage', nextScene: 'insideCottage' },
				{ text: 'Head into the deep forest', nextScene: 'deepForest' }
			]
		},

		drinkWell: {
			id: 'drinkWell',
			title: 'The Healing Well',
			description: 'The water is surprisingly clear and refreshing. You feel revitalized and stronger than before.',
			onEnter: () => {
				health = Math.min(100, health + 20);
			},
			choices: [
				{ text: 'Enter the cottage', nextScene: 'insideCottage' },
				{ text: 'Head into the deep forest', nextScene: 'deepForest' },
				{ text: 'Return to the forest edge', nextScene: 'start' }
			]
		},

		deepForest: {
			id: 'deepForest',
			title: 'Deep in the Forest',
			description: 'The path leads you deeper into the forest. The trees grow denser and the air becomes cooler. You hear the sound of rushing water ahead and notice two paths: one leading toward the sound of water, and another that winds upward toward what looks like an old stone tower in the distance.',
			choices: [
				{ text: 'Follow the sound of water', nextScene: 'waterfall' },
				{ text: 'Head toward the stone tower', nextScene: 'tower' },
				{ text: 'Return to the forest edge', nextScene: 'start' }
			]
		},

		waterfall: {
			id: 'waterfall',
			title: 'The Hidden Waterfall',
			description: 'You discover a beautiful waterfall cascading down rocky cliffs. The mist creates tiny rainbows in the filtered sunlight. Behind the waterfall, you can make out what appears to be the entrance to a cave.',
			choices: [
				{ text: 'Go behind the waterfall to the cave', nextScene: 'cave' },
				{ text: 'Rest by the waterfall', nextScene: 'restWaterfall' },
				{ text: 'Return to the deep forest', nextScene: 'deepForest' }
			]
		},

		cave: {
			id: 'cave',
			title: 'The Cave Behind the Waterfall',
			description: 'The cave is cool and damp. As your eyes adjust to the dim light, you see ancient drawings on the walls depicting a great battle between a warrior and a dragon. At the far end of the cave, something metallic glints in the shadows.',
			choices: [
				{ text: 'Investigate the metallic object', nextScene: 'findSword' },
				{ text: 'Examine the cave drawings more closely', nextScene: 'caveDrawings' },
				{ text: 'Leave the cave', nextScene: 'waterfall' }
			]
		},

		findSword: {
			id: 'findSword',
			title: 'The Ancient Sword',
			description: 'You discover an ancient sword embedded in a stone pedestal. The blade gleams with an otherworldly light, and strange runes are etched along its length. As you grasp the hilt, you feel a surge of power.',
			onEnter: () => {
				hasSword = true;
				inventory.push('Ancient Sword');
			},
			choices: [
				{ text: 'Examine the cave drawings', nextScene: 'caveDrawings' },
				{ text: 'Leave the cave with the sword', nextScene: 'waterfall' },
				{ text: 'Head directly to the tower', nextScene: 'tower' }
			]
		},

		caveDrawings: {
			id: 'caveDrawings',
			title: 'Ancient Cave Drawings',
			description: 'The drawings tell the story of a brave warrior who wielded a magical sword to defeat a terrible dragon that had been terrorizing the land. The final drawing shows the warrior sealing the dragon in a tower, but warns that the beast might one day return.',
			choices: [
				{ text: 'Take the ancient sword if you haven\'t already', nextScene: hasSword ? 'waterfall' : 'findSword' },
				{ text: 'Leave the cave', nextScene: 'waterfall' }
			]
		},

		restWaterfall: {
			id: 'restWaterfall',
			title: 'Resting by the Waterfall',
			description: 'You sit by the peaceful waterfall and rest. The sound of the flowing water is soothing, and you feel your energy returning.',
			onEnter: () => {
				health = Math.min(100, health + 15);
			},
			choices: [
				{ text: 'Go behind the waterfall to the cave', nextScene: 'cave' },
				{ text: 'Return to the deep forest', nextScene: 'deepForest' },
				{ text: 'Head toward the stone tower', nextScene: 'tower' }
			]
		},

		tower: {
			id: 'tower',
			title: 'The Ancient Tower',
			description: hasKey 
				? 'You stand before an imposing stone tower that reaches high into the sky. The massive wooden door is locked, but you remember the iron key you found. Strange roars and the sound of heavy breathing echo from within.'
				: 'You stand before an imposing stone tower that reaches high into the sky. The massive wooden door is locked with an intricate iron mechanism. Strange roars and the sound of heavy breathing echo from within, suggesting something large and dangerous lives inside.',
			choices: hasKey 
				? [
					{ text: 'Use the iron key to unlock the door', nextScene: 'unlockTower' },
					{ text: 'Return to the deep forest', nextScene: 'deepForest' }
				]
				: [
					{ text: 'Try to force open the door', nextScene: 'forceDoor' },
					{ text: 'Look for another way in', nextScene: 'searchTower' },
					{ text: 'Return to the deep forest', nextScene: 'deepForest' }
				]
		},

		forceDoor: {
			id: 'forceDoor',
			title: 'Forcing the Door',
			description: 'You throw your weight against the heavy wooden door, but it doesn\'t budge. The lock mechanism is too strong, and you only succeed in bruising your shoulder.',
			onEnter: () => {
				health = Math.max(0, health - 10);
			},
			choices: [
				{ text: 'Look for another way in', nextScene: 'searchTower' },
				{ text: 'Return to the deep forest to look for a key', nextScene: 'deepForest' }
			]
		},

		searchTower: {
			id: 'searchTower',
			title: 'Searching the Tower',
			description: 'You walk around the tower looking for another entrance, but the stone walls are solid and too high to climb. You\'ll need to find the key to get inside.',
			choices: [
				{ text: 'Return to the deep forest to look for a key', nextScene: 'deepForest' },
				{ text: 'Try to force the door again', nextScene: 'forceDoor' }
			]
		},

		unlockTower: {
			id: 'unlockTower',
			title: 'Inside the Tower',
			description: 'The key turns easily in the lock, and the heavy door swings open with a deep groan. Inside, you see a spiral staircase leading upward. The roaring is much louder now, and you can feel heat radiating from above.',
			choices: [
				{ text: 'Climb the stairs to face whatever awaits', nextScene: 'climbTower' },
				{ text: 'Turn back while you still can', nextScene: 'tower' }
			]
		},

		climbTower: {
			id: 'climbTower',
			title: 'The Dragon\'s Lair',
			description: hasSword 
				? 'You reach the top of the tower and find yourself face to face with a massive red dragon. Its eyes burn like embers as it notices you, but then it sees the ancient sword in your hand and lets out a roar of recognition and fear.'
				: 'You reach the top of the tower and find yourself face to face with a massive red dragon. Its eyes burn like embers and smoke billows from its nostrils. Without a proper weapon, you feel completely helpless before this magnificent and terrifying creature.',
			choices: hasSword 
				? [
					{ text: 'Attack the dragon with the ancient sword', nextScene: 'fightDragon' },
					{ text: 'Try to communicate with the dragon', nextScene: 'talkDragon' },
					{ text: 'Retreat down the stairs', nextScene: 'unlockTower' }
				]
				: [
					{ text: 'Try to communicate with the dragon', nextScene: 'talkDragonNoSword' },
					{ text: 'Run back down the stairs immediately', nextScene: 'unlockTower' }
				]
		},

		fightDragon: {
			id: 'fightDragon',
			title: 'Battle with the Dragon',
			description: 'You raise the ancient sword, and it blazes with magical light. The dragon attacks with fire and claw, but the enchanted blade cuts through its defenses. After an epic battle, you strike the final blow. The dragon falls, and with its last breath, it speaks: "Thank you, brave warrior. The curse is finally broken."',
			onEnter: () => {
				dragonDefeated = true;
			},
			choices: [
				{ text: 'Explore the dragon\'s treasure hoard', nextScene: 'treasure' },
				{ text: 'Leave the tower victorious', nextScene: 'victory' }
			]
		},

		talkDragon: {
			id: 'talkDragon',
			title: 'Speaking with the Dragon',
			description: 'To your surprise, the dragon speaks: "Brave warrior, I have been cursed to guard this tower for centuries. The ancient sword you carry is the key to breaking my curse. If you strike me down with it, both my suffering and my threat to the land will end. Will you grant me this mercy?"',
			choices: [
				{ text: 'Grant the dragon\'s request and end its suffering', nextScene: 'fightDragon' },
				{ text: 'Refuse and try to find another solution', nextScene: 'sparedragon' },
				{ text: 'Leave without helping', nextScene: 'unlockTower' }
			]
		},

		talkDragonNoSword: {
			id: 'talkDragonNoSword',
			title: 'Defenseless Before the Dragon',
			description: 'The dragon speaks with a voice like distant thunder: "Foolish mortal, you come before me unarmed? I am bound by an ancient curse to remain in this tower, and my rage grows with each passing day. Find the ancient sword and return, or flee and never come back!"',
			choices: [
				{ text: 'Promise to return with the sword', nextScene: 'unlockTower' },
				{ text: 'Flee immediately', nextScene: 'unlockTower' }
			]
		},

		sparedragon: {
			id: 'sparedragon',
			title: 'Mercy for the Dragon',
			description: 'You lower your sword and tell the dragon you won\'t kill it. The dragon looks surprised, then sad. "Your mercy is noble, but there is no other way to break the curse. I am doomed to remain here, and eventually my madness will return. Perhaps... perhaps it is better this way." The dragon curls up and closes its eyes, resigned to its fate.',
			choices: [
				{ text: 'Change your mind and end the dragon\'s suffering', nextScene: 'fightDragon' },
				{ text: 'Leave the dragon in peace', nextScene: 'peacefulEnd' }
			]
		},

		treasure: {
			id: 'treasure',
			title: 'The Dragon\'s Hoard',
			description: 'Behind where the dragon lay, you discover a vast treasure hoard: gold coins, precious gems, and ancient artifacts. Among the treasure, you find a scroll that reads: "The curse is broken. The land is safe. You have proven yourself a true hero."',
			choices: [
				{ text: 'Take some treasure and leave', nextScene: 'victory' },
				{ text: 'Leave the treasure and depart with honor', nextScene: 'victory' }
			]
		},

		victory: {
			id: 'victory',
			title: 'Hero\'s Victory',
			description: 'You emerge from the tower as a true hero. The forest seems brighter, the air cleaner. Birds sing in the trees, and you know that you have made the world a safer place. Your adventure has come to a triumphant end.',
			choices: [
				{ text: 'Begin a new adventure', nextScene: 'start' }
			]
		},

		peacefulEnd: {
			id: 'peacefulEnd',
			title: 'A Peaceful Resolution',
			description: 'You leave the tower, knowing that sometimes the greatest courage is in showing mercy. The dragon remains in its tower, but perhaps your kindness has given it some small comfort. Your adventure ends with the knowledge that you chose compassion over violence.',
			choices: [
				{ text: 'Begin a new adventure', nextScene: 'start' }
			]
		},

		coward: {
			id: 'coward',
			title: 'The Safe Path',
			description: 'You decide that discretion is the better part of valor and turn away from the mysterious forest. Sometimes the wisest choice is to avoid danger altogether. Your adventure ends before it truly began, but you live to see another day.',
			choices: [
				{ text: 'Reconsider and enter the forest', nextScene: 'start' }
			]
		}
	};

	function getCurrentScene(): Scene {
		return scenes[currentSceneId];
	}

	function makeChoice(choice: Choice) {
		gameHistory.push(`${getCurrentScene().title}: ${choice.text}`);
		
		if (getCurrentScene().onEnter) {
			getCurrentScene().onEnter!();
		}
		
		currentSceneId = choice.nextScene;
		
		if (scenes[currentSceneId].onEnter) {
			scenes[currentSceneId].onEnter!();
		}
	}

	function resetGame() {
		currentSceneId = 'start';
		inventory = [];
		health = 100;
		hasKey = false;
		hasSword = false;
		dragonDefeated = false;
		gameHistory = [];
	}

	$effect(() => {
	});
</script>

<div class="max-w-4xl mx-auto p-6 bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h1 class="text-3xl font-bold text-center text-gray-800 mb-4">The Dragon's Tower</h1>
		
		<div class="flex justify-between items-center text-sm">
			<div class="flex space-x-4">
				<span class="bg-red-100 text-red-800 px-3 py-1 rounded-full">
					Health: {health}/100
				</span>
				{#if inventory.length > 0}
					<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
						Inventory: {inventory.join(', ')}
					</span>
				{/if}
			</div>
			<button 
				onclick={resetGame}
				class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
			>
				New Game
			</button>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow-lg p-6">
		<div class="mb-6">
			<h2 class="text-2xl font-semibold text-gray-800 mb-4">
				{getCurrentScene().title}
			</h2>
			<p class="text-gray-700 leading-relaxed text-lg">
				{getCurrentScene().description}
			</p>
		</div>

		<div class="space-y-3">
			{#each getCurrentScene().choices as choice}
				{#if !choice.condition || choice.condition()}
					<button
						onclick={() => makeChoice(choice)}
						class="w-full text-left p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
					>
						{choice.text}
					</button>
				{/if}
			{/each}
		</div>

		{#if health <= 30}
			<div class="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
				<p class="text-red-700 text-sm">⚠️ Your health is low. Be careful!</p>
			</div>
		{/if}

		{#if dragonDefeated}
			<div class="mt-4 p-3 bg-gold-100 border border-yellow-300 rounded-lg bg-yellow-50">
				<p class="text-yellow-700 text-sm">🐉 You have defeated the dragon! You are a true hero!</p>
			</div>
		{/if}
	</div>

	{#if gameHistory.length > 0}
		<details class="mt-6 bg-white rounded-lg shadow-lg p-6">
			<summary class="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-600">
				Adventure History ({gameHistory.length} actions)
			</summary>
			<div class="mt-4 space-y-2">
				{#each gameHistory as action, index}
					<div class="text-sm text-gray-600 border-l-2 border-blue-200 pl-3">
						{index + 1}. {action}
					</div>
				{/each}
			</div>
		</details>
	{/if}
</div>
