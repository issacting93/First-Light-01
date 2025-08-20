import { HexagonConfig } from './HexagonGrid';

// Define the hexagon configurations for expanded state
export const expandedHexagons: HexagonConfig[] = [
  {
    id: 'again-top',
    label: 'again',
    type: 'outline',
    position: { x: 0, y: -80 },
    labelPosition: 'top'
  },
  {
    id: 'word',
    label: 'word',
    type: 'filled',
    position: { x: -121, y: 0 },
    labelPosition: 'left'
  },
  {
    id: 'loop',
    label: 'loop',
    type: 'outline',
    position: { x: 121, y: 0 },
    labelPosition: 'right'
  },
  {
    id: 'again-bottom',
    label: 'again',
    type: 'outline',
    position: { x: 0, y: 80 },
    labelPosition: 'bottom'
  }
];

// Collapsed state has just a few overlapping hexagons
export const collapsedHexagons: HexagonConfig[] = [
  {
    id: 'collapsed-1',
    label: '',
    type: 'outline',
    position: { x: 0, y: 0 }
  },
  {
    id: 'collapsed-2',
    label: '',
    type: 'outline',
    position: { x: 0, y: 0 }
  },
  {
    id: 'collapsed-3',
    label: '',
    type: 'outline',
    position: { x: 0, y: 0 }
  }
];

// Pool of wrong meanings to use as decoys
// Note: Words that exist in glyphs.json have been removed to avoid conflicts
const wrongMeaningsPool = [
  'star', 'moon', 'sun', 'fire', 'water', 'earth', 'wind', 'storm', 'rain', 'snow',
  'tree', 'flower', 'grass', 'rock', 'mountain', 'river', 'ocean', 'lake', 'forest',
  'bird', 'fish', 'snake', 'wolf', 'bear', 'deer', 'rabbit', 'fox', 'eagle', 'hawk',
  'run', 'walk', 'jump', 'fly', 'swim', 'climb', 'fall', 'rise', 'sink', 'float',
  'hot', 'cold', 'warm', 'cool', 'bright', 'dark', 'shadow', 'shine',
  'big', 'small', 'tall', 'short', 'wide', 'narrow', 'thick', 'thin', 'heavy',
  'fast', 'slow', 'quick', 'steady', 'smooth', 'rough', 'soft', 'hard', 'sharp', 'dull',
  'old', 'new', 'young', 'fresh', 'clean', 'dirty', 'pure', 'mixed', 'simple', 'complex',
  'near', 'close', 'distant', 'inside', 'outside', 'above', 'below', 'around', 'through',
  'start', 'begin', 'finish', 'open', 'enter', 'exit', 'leave',
  'take', 'send', 'receive', 'bring', 'carry', 'hold', 'drop', 'catch', 'throw',
  'build', 'break', 'create', 'destroy', 'make', 'unmake', 'change', 'stay',
  'learn', 'know', 'understand', 'think', 'feel', 'believe', 'doubt', 'hope', 'fear',
  'friend', 'enemy', 'ally', 'foe', 'partner', 'rival', 'helper', 'hinder', 'support', 'oppose'
];

// Function to create dynamic hexagons with wrong meanings as decoys
export function createDynamicHexagons(_meanings: string[], correctMeaning?: string): HexagonConfig[] {
  // If no correct meaning provided, return collapsed state
  if (!correctMeaning) {
    return collapsedHexagons;
  }

  // Use circular positions for dynamic meanings
  const circularPositions = [
    { x: 0, y: -80, labelPosition: 'top' as const },
    { x: 69, y: -40, labelPosition: 'right' as const },
    { x: 69, y: 40, labelPosition: 'right' as const },
    { x: 0, y: 80, labelPosition: 'bottom' as const },
    { x: -69, y: 40, labelPosition: 'left' as const },
    { x: -69, y: -40, labelPosition: 'left' as const }
  ];

  // Create a pool of wrong meanings, excluding only the correct answer
  const availableWrongMeanings = wrongMeaningsPool.filter(
    meaning => meaning !== correctMeaning
  );

  // Shuffle the wrong meanings
  const shuffledWrongMeanings = [...availableWrongMeanings].sort(() => Math.random() - 0.5);

  // Create hexagons with wrong meanings as decoys
  const decoyHexagons: HexagonConfig[] = shuffledWrongMeanings.slice(0, 5).map((meaning, index) => ({
    id: `decoy-${meaning}`,
    label: meaning,
    type: 'outline' as const,
    position: circularPositions[index] || { x: 0, y: 0, labelPosition: 'top' as const },
    labelPosition: circularPositions[index]?.labelPosition || 'top'
  }));

  // Create all hexagons (decoy + correct) and shuffle positions
  let allHexagons: HexagonConfig[] = [...decoyHexagons];
  
  // Add the correct meaning if provided
  if (correctMeaning) {
    const correctHexagon: HexagonConfig = {
      id: correctMeaning,
      label: correctMeaning,
      type: 'filled' as const,
      position: { x: 0, y: 0 }, // Temporary position
      labelPosition: 'top'
    };
    allHexagons.push(correctHexagon);
  } else {
    // If no correct meaning provided, add one more decoy to maintain 6 hexagons
    const extraDecoy = shuffledWrongMeanings[5];
    if (extraDecoy) {
      const extraDecoyHexagon: HexagonConfig = {
        id: `decoy-${extraDecoy}`,
        label: extraDecoy,
        type: 'outline' as const,
        position: { x: 0, y: 0 }, // Temporary position
        labelPosition: 'top'
      };
      allHexagons.push(extraDecoyHexagon);
    }
  }

  // Shuffle the positions and assign them randomly
  const shuffledPositions = [...circularPositions].sort(() => Math.random() - 0.5);
  
  // Assign shuffled positions to hexagons
  allHexagons = allHexagons.map((hexagon, index) => ({
    ...hexagon,
    position: { 
      x: shuffledPositions[index]?.x || 0, 
      y: shuffledPositions[index]?.y || 0 
    },
    labelPosition: shuffledPositions[index]?.labelPosition || 'top'
  }));

  // Final shuffle of the hexagons themselves
  const finalHexagons = allHexagons.sort(() => Math.random() - 0.5);
  
  // Validation: Ensure we have exactly one correct answer
  const correctHexagons = finalHexagons.filter(h => h.type === 'filled');
  
  if (correctHexagons.length !== 1) {
    console.error('❌ ERROR: Expected exactly 1 correct answer, got', correctHexagons.length);
  }
  
  // Validation: Ensure all decoy words come from wrongMeaningsPool
  const decoyWords = finalHexagons.filter(h => h.type === 'outline').map(h => h.label);
  const invalidDecoys = decoyWords.filter(word => !wrongMeaningsPool.includes(word));
  if (invalidDecoys.length > 0) {
    console.error('❌ ERROR: Found decoy words not in wrongMeaningsPool:', invalidDecoys);
  }
  
  return finalHexagons;
} 