<!-- src/lib/components/DebugPanel.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { gameStore } from '../gameState.js';
  import { validateScenes, printValidationReport } from '../utils/sceneValidator.js';
  import { scenes } from '../gameData.js';

  let showDebug = false;
  let validationResult: any = null;

  onMount(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      showDebug = true;
      validationResult = validateScenes();
      printValidationReport();
    }
  });

  function runValidation() {
    validationResult = validateScenes();
    printValidationReport();
  }

  function checkCurrentScene() {
    const currentSceneId = $gameStore.currentSceneId;
    const sceneExists = !!scenes[currentSceneId];
    
    console.log(`Current scene: ${currentSceneId}`);
    console.log(`Scene exists: ${sceneExists}`);
    
    if (sceneExists) {
      const scene = scenes[currentSceneId];
      console.log('Scene data:', scene);
      
      try {
        const choices = typeof scene.choices === 'function' ? scene.choices() : scene.choices;
        console.log('Choices:', choices);
        
        choices.forEach((choice, index) => {
          const nextScene = typeof choice.nextScene === 'function' ? choice.nextScene() : choice.nextScene;
          const nextSceneExists = !!scenes[nextScene];
          console.log(`Choice ${index + 1}: "${choice.text}" -> ${nextScene} (exists: ${nextSceneExists})`);
        });
      } catch (error) {
        console.error('Error processing scene choices:', error);
      }
    }
  }
</script>

{#if showDebug}
  <div class="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md text-sm z-50">
    <h3 class="font-bold mb-2">🔧 Debug Panel</h3>
    
    <div class="space-y-2">
      <button 
        onclick={runValidation}
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
      >
        Validate Scenes
      </button>
      
      <button 
        onclick={checkCurrentScene}
        class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
      >
        Check Current Scene
      </button>
    </div>

    {#if validationResult}
      <div class="mt-3 space-y-1">
        <p class="text-xs">
          <span class="text-green-400">✓ Total scenes:</span> {validationResult.totalScenes}
        </p>
        <p class="text-xs">
          <span class="text-yellow-400">⚠ Missing:</span> {validationResult.missingScenes.length}
        </p>
        <p class="text-xs">
          <span class="text-blue-400">ℹ Unreachable:</span> {validationResult.unreachableScenes.length}
        </p>
        
        {#if validationResult.missingScenes.length > 0}
          <details class="mt-2">
            <summary class="text-xs text-red-400 cursor-pointer">Missing Scenes</summary>
            <ul class="mt-1 max-h-32 overflow-y-auto">
              {#each validationResult.missingScenes as sceneId}
                <li class="text-xs text-red-300">• {sceneId}</li>
              {/each}
            </ul>
          </details>
        {/if}
      </div>
    {/if}

    <div class="mt-3 text-xs text-gray-400">
      Current: {$gameStore.currentSceneId}
    </div>
  </div>
{/if}
