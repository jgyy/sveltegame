// src/lib/utils/sceneValidator.ts
import { scenes } from '../gameData.js';
import type { Scene, Choice } from '../types.js';

interface ValidationResult {
  missingScenes: string[];
  unreachableScenes: string[];
  totalScenes: number;
  referencedScenes: Set<string>;
}

export function validateScenes(): ValidationResult {
  const allSceneIds = new Set(Object.keys(scenes));
  const referencedScenes = new Set<string>();
  const missingScenes: string[] = [];

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
    totalScenes: allSceneIds.size,
    referencedScenes
  };
}

export function printValidationReport(): void {
  const result = validateScenes();
  
  console.log('=== Scene Validation Report ===');
  console.log(`Total scenes defined: ${result.totalScenes}`);
  console.log(`Total scenes referenced: ${result.referencedScenes.size}`);
  
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

export function generateMissingSceneTemplates(missingScenes: string[]): string {
  return missingScenes.map(sceneId => `
  ${sceneId}: {
    id: '${sceneId}',
    title: '${sceneId.charAt(0).toUpperCase() + sceneId.slice(1).replace(/([A-Z])/g, ' $1')}',
    description: 'This scene is not yet implemented. Please add content here.',
    choices: [
      { text: 'Continue your adventure', nextScene: 'start' },
      { text: 'Return to a previous location', nextScene: 'start' }
    ]
  },`).join('');
}

export function validateAndReport(): void {
  const result = validateScenes();
  printValidationReport();
  
  if (result.missingScenes.length > 0) {
    console.log('\n📝 Generated templates for missing scenes:');
    console.log(generateMissingSceneTemplates(result.missingScenes));
  }
}
