// src/lib/data/scenes/explorationScenes.ts
import type { Scene } from '../../core/types.js';
import { SceneFactory } from '../../core/sceneFactory.js';
import { createStateUpdate, stateUpdates } from '../stateUpdates.js';

export const explorationScenes: Record<string, Scene> = {
  mysteriousForest: SceneFactory.exploration(
    'mysteriousForest', 
    'The Mysterious Forest',
    'You enter a dark forest where ancient trees whisper secrets. Shafts of moonlight pierce through the canopy, revealing a path deeper into the woods.',
    [
      { name: 'the ancient grove', sceneId: 'ancientGrove' },
      { name: 'the wizard\'s tower', sceneId: 'wizardTower' },
      { name: 'a hidden clearing', sceneId: 'hiddenClearing' }
    ]
  ),

  ancientGrove: SceneFactory.exploration(
    'ancientGrove',
    'The Ancient Grove',
    'You discover a grove of impossibly old trees, their branches intertwining to form natural arches. Mystical energy pulses through the air.',
    [
      { name: 'the heartwood shrine', sceneId: 'heartwoodShrine' },
      { name: 'the singing springs', sceneId: 'singingsprings' },
      { name: 'the elder tree', sceneId: 'elderTree' }
    ],
    stateUpdates.magicalDiscovery()
  ),

  hiddenClearing: SceneFactory.exploration(
    'hiddenClearing',
    'Hidden Clearing',
    'You push through thick undergrowth to find a secret clearing where magical herbs grow wild.',
    [
      { name: 'rare magical herbs', sceneId: 'gatherHerbs' },
      { name: 'a mysterious circle of stones', sceneId: 'stoneCircle' },
      { name: 'tracks of magical creatures', sceneId: 'followTracks' }
    ]
  ),

  stoneBridge: SceneFactory.exploration(
    'stoneBridge',
    'The Ancient Stone Bridge', 
    'You approach an old stone bridge spanning a turbulent river. The bridge looks sturdy but ancient, with mysterious runes carved into its pillars.',
    [
      { name: 'cross to the other side', sceneId: 'bridgeOtherSide' },
      { name: 'examine the runes', sceneId: 'examineRunes' },
      { name: 'explore the river bank', sceneId: 'riverBank' }
    ]
  ),

  bridgeOtherSide: SceneFactory.exploration(
    'bridgeOtherSide',
    'Beyond the Bridge',
    'Having crossed the ancient bridge, you find yourself in unfamiliar territory with new opportunities for adventure.',
    [
      { name: 'a mountain path', sceneId: 'mountainPath' },
      { name: 'a crystal cave', sceneId: 'crystalCave' },
      { name: 'an abandoned watchtower', sceneId: 'watchtower' }
    ]
  ),

  examineArea: SceneFactory.interaction(
    'examineArea',
    'Careful Examination',
    'You carefully examine the crossroads, noticing details you missed before. There are old wagon tracks, worn signposts, and what appears to be a hidden cache.',
    [
      { text: 'Search the hidden cache', nextScene: 'findCache' },
      { text: 'Follow the wagon tracks', nextScene: 'wagonTracks' },
      { text: 'Read the worn signposts', nextScene: 'readSigns' }
    ],
    { experience: 20, stealth: 1 }
  ),

  findCache: SceneFactory.scene(
    'findCache',
    'Hidden Cache',
    'You discover a hidden cache containing useful items.',
    [SceneFactory.basic('Take the items and continue', 'start')],
    { 
      category: 'exploration',
      onEnter: createStateUpdate({ 
        items: ['healingPotion', 'goldCoin'], 
        experience: 20 
      })
    }
  ),

  examineRunes: SceneFactory.scene(
    'examineRunes',
    'Ancient Bridge Runes',
    'The runes tell of safe passage and protection. Understanding them grants you mystical knowledge.',
    [SceneFactory.basic('Cross the bridge with confidence', 'bridgeOtherSide')],
    {
      onEnter: createStateUpdate({ 
        magic_skill: 2, 
        experience: 30, 
        flags: { runeKnowledge: true } 
      })
    }
  ),

  riverBank: SceneFactory.exploration(
    'riverBank',
    'The River Bank',
    'You explore along the rushing river, finding interesting items washed up by the current.',
    [
      { name: 'driftwood and debris', sceneId: 'searchDebris' },
      { name: 'a small fishing spot', sceneId: 'tryFishing' },
      { name: 'upstream along the bank', sceneId: 'followRiver' }
    ]
  ),

  singingsprings: SceneFactory.scene(
    'singingsprings',
    'The Singing Springs',
    'You discover springs that sing with magical resonance, their waters having healing properties.',
    [SceneFactory.basic('Drink from the springs', 'drinkSprings')],
    {
      onEnter: createStateUpdate({ health: 20, magic: 15, experience: 20 })
    }
  ),

  elderTree: SceneFactory.conversation(
    'elderTree',
    'The Elder Tree',
    'The ancient tree speaks to you with wisdom accumulated over centuries.',
    [
      { text: 'Ask about the dragon\'s curse', nextScene: 'treeWisdomDragon' },
      { text: 'Request guidance for your quest', nextScene: 'treeGuidance' },
      { text: 'Seek nature\'s blessing', nextScene: 'seekNatureBlessing' }
    ],
    { experience: 30, magic_skill: 2, flags: { elderTreeWisdom: true } }
  )
};

export const additionalExplorationScenes: Record<string, Scene> = {
  wizardTower: SceneFactory.exploration(
    'wizardTower',
    'The Wizard\'s Tower',
    'A tall, spiral tower made of white stone rises before you, with mystical energies swirling around its peak. This is clearly the dwelling of a powerful wizard.',
    [
      { name: 'the tower entrance', sceneId: 'wizardTowerEntrance' },
      { name: 'the magical garden', sceneId: 'magicalGarden' },
      { name: 'the observatory at the top', sceneId: 'wizardObservatory' },
      { name: 'the library window', sceneId: 'libraryWindow' }
    ],
    { experience: 25, magic_skill: 1, flags: { foundWizardTower: true } }
  ),

  heartwoodShrine: SceneFactory.exploration(
    'heartwoodShrine',
    'The Heartwood Shrine',
    'Deep within the ancient grove stands a natural shrine carved from the living heartwood of the eldest tree. Ancient magic pulses through every grain.',
    [
      { name: 'the altar of nature', sceneId: 'natureAltar' },
      { name: 'the spirit pool', sceneId: 'spiritPool' },
      { name: 'the wisdom carvings', sceneId: 'wisdomCarvings' },
      { name: 'the guardian\'s presence', sceneId: 'forestGuardian' }
    ],
    { experience: 30, magic_skill: 2, flags: { foundHeartwood: true } }
  ),

  gatherHerbs: SceneFactory.interaction(
    'gatherHerbs',
    'Gathering Magical Herbs',
    'You carefully collect rare magical herbs that grow wild in this hidden clearing. Each plant glows with its own unique properties.',
    [
      { text: 'Gather healing moonflowers', nextScene: 'gatherMoonflowers' },
      { text: 'Collect energy-restoring stargrass', nextScene: 'gatherStargrass' },
      { text: 'Pick wisdom-enhancing sage', nextScene: 'gatherWisdomSage' },
      { text: 'Take a variety of all herbs', nextScene: 'gatherAllHerbs' }
    ],
    { experience: 20, magic_skill: 1, items: ['magicHerbs'] }
  ),

  stoneCircle: SceneFactory.exploration(
    'stoneCircle',
    'The Mysterious Stone Circle',
    'Ancient standing stones form a perfect circle, humming with residual magical energy. The ground within is worn smooth by countless rituals.',
    [
      { name: 'the center of the circle', sceneId: 'circleCenter' },
      { name: 'the rune-carved stones', sceneId: 'runeStones' },
      { name: 'the ritual altar', sceneId: 'ritualAltar' },
      { name: 'the ley line convergence', sceneId: 'leyLines' }
    ],
    { experience: 25, magic_skill: 2, flags: { foundStoneCircle: true } }
  ),

  followTracks: SceneFactory.exploration(
    'followTracks',
    'Following Magical Creature Tracks',
    'You follow the tracks of magical creatures deeper into the forest, discovering their hidden paths and secret gathering places.',
    [
      { name: 'a unicorn\'s grove', sceneId: 'unicornGrove' },
      { name: 'a fairy ring', sceneId: 'fairyRing' },
      { name: 'a phoenix nesting site', sceneId: 'phoenixNest' },
      { name: 'an ancient creature\'s lair', sceneId: 'ancientLair' }
    ],
    { experience: 30, stealth: 1, flags: { trackedCreatures: true } }
  ),

  mountainPath: SceneFactory.exploration(
    'mountainPath',
    'The Mountain Path',
    'A winding path leads up into the mountains, offering breathtaking views and the promise of high-altitude adventures.',
    [
      { name: 'the eagle\'s nest peak', sceneId: 'eaglesPeak' },
      { name: 'the mountain monastery', sceneId: 'mountainMonastery' },
      { name: 'the crystal mines', sceneId: 'crystalMines' },
      { name: 'the cloud bridge', sceneId: 'cloudBridge' }
    ],
    { experience: 25, stealth: 1, flags: { foundMountainPath: true } }
  ),

  crystalCave: SceneFactory.exploration(
    'crystalCave',
    'The Crystal Cave',
    'A magnificent cave filled with glowing crystals of every color. The walls pulse with magical energy and the air itself seems to shimmer.',
    [
      { name: 'the crystal formations', sceneId: 'crystalFormations' },
      { name: 'the underground lake', sceneId: 'undergroundLake' },
      { name: 'the resonance chamber', sceneId: 'resonanceChamber' },
      { name: 'the deeper tunnels', sceneId: 'deeperTunnels' }
    ],
    { experience: 35, magic_skill: 2, magic: 25, flags: { foundCrystalCave: true } }
  ),

  watchtower: SceneFactory.exploration(
    'watchtower',
    'The Abandoned Watchtower',
    'An old watchtower stands sentinel over the landscape, abandoned but still structurally sound. It offers commanding views of the surrounding area.',
    [
      { name: 'the tower\'s peak', sceneId: 'towerPeak' },
      { name: 'the guard quarters', sceneId: 'guardQuarters' },
      { name: 'the signal room', sceneId: 'signalRoom' },
      { name: 'the armory', sceneId: 'towerArmory' }
    ],
    { experience: 20, combat: 1, flags: { foundWatchtower: true } }
  ),

  wagonTracks: SceneFactory.interaction(
    'wagonTracks',
    'Following Wagon Tracks',
    'You follow the old wagon tracks, discovering clues about past travelers and their destinations.',
    [
      { text: 'Follow tracks toward the mountains', nextScene: 'tracksToMountains' },
      { text: 'Follow tracks toward the forest', nextScene: 'tracksToForest' },
      { text: 'Investigate where the tracks split', nextScene: 'tracksSplit' },
      { text: 'Look for a hidden camp', nextScene: 'hiddenCamp' }
    ],
    { experience: 15, stealth: 1, flags: { followedTracks: true } }
  ),

  readSigns: SceneFactory.interaction(
    'readSigns',
    'Reading the Old Signposts',
    'The weathered signposts provide valuable information about the surrounding area and its history.',
    [
      { text: 'Study the distance markers', nextScene: 'distanceMarkers' },
      { text: 'Decode the faded warnings', nextScene: 'fadedWarnings' },
      { text: 'Look for hidden messages', nextScene: 'hiddenMessages' },
      { text: 'Map out the region', nextScene: 'mapRegion' }
    ],
    { experience: 20, flags: { readSigns: true } }
  ),

  searchDebris: SceneFactory.interaction(
    'searchDebris',
    'Searching River Debris',
    'You carefully examine the driftwood and debris washed up along the riverbank, finding interesting items.',
    [
      { text: 'Search for lost treasures', nextScene: 'findLostTreasures' },
      { text: 'Look for useful materials', nextScene: 'findMaterials' },
      { text: 'Examine strange artifacts', nextScene: 'examineArtifacts' },
      { text: 'Check for message bottles', nextScene: 'findMessages' }
    ],
    { experience: 15, gold: 10, flags: { searchedDebris: true } }
  ),

  tryFishing: SceneFactory.interaction(
    'tryFishing',
    'Trying Your Hand at Fishing',
    'You attempt to catch fish in the rushing river, testing your patience and skill.',
    [
      { text: 'Fish with careful technique', nextScene: 'skillfulFishing' },
      { text: 'Try using magical bait', nextScene: 'magicalFishing' },
      { text: 'Look for the biggest fish', nextScene: 'bigGameFishing' },
      { text: 'Just enjoy the peaceful activity', nextScene: 'peacefulFishing' }
    ],
    { experience: 15, flags: { triedFishing: true } }
  ),

  followRiver: SceneFactory.exploration(
    'followRiver',
    'Following the River Upstream',
    'You follow the river upstream, discovering its source and the secrets hidden along its banks.',
    [
      { name: 'the waterfall source', sceneId: 'waterfallSource' },
      { name: 'the old mill', sceneId: 'oldMill' },
      { name: 'the beaver dam', sceneId: 'beaverDam' },
      { name: 'the forest pool', sceneId: 'forestPool' }
    ],
    { experience: 20, flags: { followedRiver: true } }
  ),

  drinkSprings: SceneFactory.scene(
    'drinkSprings',
    'Drinking from the Magical Springs',
    'You drink deeply from the singing springs, feeling their magical properties restore and enhance your abilities.',
    [
      SceneFactory.basic('Feel the magic coursing through you', 'springsMagicEffect'),
      SceneFactory.basic('Meditate by the springs', 'springsmeditation'),
      SceneFactory.basic('Fill containers with the water', 'collectSpringWater'),
      SceneFactory.basic('Continue exploring the grove', 'ancientGrove')
    ],
    {
      onEnter: createStateUpdate({ health: 25, magic: 30, experience: 25, magic_skill: 1 })
    }
  ),

  treeWisdomDragon: SceneFactory.conversation(
    'treeWisdomDragon',
    'Tree\'s Wisdom About the Dragon',
    'The ancient tree shares its centuries of wisdom about the dragon and the true nature of the curse.',
    [
      { text: 'Learn about the dragon\'s past', nextScene: 'dragonPastWisdom' },
      { text: 'Ask about breaking the curse', nextScene: 'treeCurseAdvice' },
      { text: 'Seek guidance on approaching the dragon', nextScene: 'treeApproachAdvice' },
      { text: 'Request the tree\'s blessing', nextScene: 'treeBlessing' }
    ],
    { experience: 40, magic_skill: 2, diplomacy: 1, flags: { treeWisdomDragon: true } }
  ),

  treeGuidance: SceneFactory.conversation(
    'treeGuidance',
    'Seeking the Tree\'s Guidance',
    'You ask the ancient tree for guidance on your quest and life in general.',
    [
      { text: 'Ask about your destiny', nextScene: 'destinyGuidance' },
      { text: 'Seek advice on difficult choices', nextScene: 'choiceAdvice' },
      { text: 'Request wisdom for leadership', nextScene: 'leadershipWisdom' },
      { text: 'Ask how to help others', nextScene: 'helpingOthersAdvice' }
    ],
    { experience: 35, diplomacy: 2, magic_skill: 1, flags: { receivedTreeGuidance: true } }
  ),

  seekNatureBlessing: SceneFactory.scene(
    'seekNatureBlessing',
    'Seeking Nature\'s Blessing',
    'You respectfully request a blessing from the ancient tree and the forces of nature it represents.',
    [
      SceneFactory.basic('Receive the blessing of strength', 'strengthBlessing'),
      SceneFactory.basic('Receive the blessing of wisdom', 'wisdomBlessing'),
      SceneFactory.basic('Receive the blessing of healing', 'healingBlessing'),
      SceneFactory.basic('Ask for a blessing to help the dragon', 'dragonHelpBlessing')
    ],
    {
      onEnter: createStateUpdate({ 
        experience: 30, 
        magic_skill: 2, 
        magic: 20, 
        flags: { natureBlessingReceived: true } 
      })
    }
  ),

  tower: SceneFactory.exploration(
    'tower',
    'The Ancient Tower',
    'You approach the mysterious ancient tower that dominates the landscape. Its dark stones seem to absorb light, and you can sense powerful magic within.',
    [
      { name: 'the main entrance', sceneId: 'towerEntrance' },
      { name: 'around the tower base', sceneId: 'towerBase' },
      { name: 'the tower peak', sceneId: 'climbTower' },
      { name: 'hidden passages', sceneId: 'hiddenPassages' }
    ],
    { experience: 20, flags: { approachedTower: true } }
  )
};
