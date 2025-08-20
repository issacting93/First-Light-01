# Data Architecture

This directory contains the JSON data files that have been separated from the components for better maintainability and organization.

## File Structure

```
src/data/
├── glyphs.json          # All glyph definitions and metadata
├── transmissions.json    # All transmission puzzles and solutions
├── gameConfig.json      # Game configuration and settings
└── README.md           # This documentation
```

## Data Files

### `glyphs.json`
Contains all glyph definitions with the following structure:
```json
{
  "glyphs": [
    {
      "id": "unique_identifier",
      "symbol": "visual_symbol",
      "svgPath": "svg_path_reference",
      "svgViewBox": "0 0 width height",
      "possibleMeanings": ["meaning1", "meaning2"],
      "confidence": 85,
      "timesUsed": 2,
      "confirmedMeaning": "speak",
      "isRotated": true,
      "rotationDegrees": 90,
      "contextualNote": "Additional context about this glyph"
    }
  ]
}
```

### `transmissions.json`
Contains all transmission puzzles:
```json
{
  "transmissions": [
    {
      "id": "1",
      "glyphs": ["wsopu"],
      "context": "First contact - a simple greeting",
      "difficulty": 1,
      "chapter": 1,
      "solution": "greetings",
      "correctMeanings": { "wsopu": "greetings" },
      "isCompleted": false
    }
  ]
}
```

### `gameConfig.json`
Contains game configuration settings:
```json
{
  "gameConfig": {
    "initialScore": 0,
    "initialChapter": 1,
    "countdownDuration": 300,
    "maxTransmissions": 8,
    "difficultyProgression": {
      "chapter1": {
        "maxDifficulty": 2,
        "transmissions": ["1", "2"]
      }
    },
    "scoring": {
      "perfectTranslation": 100,
      "goodTranslation": 80
    }
  }
}
```

## Data Service

The `src/services/dataService.ts` provides a clean API for accessing and manipulating this data:

### Key Methods

- `getGlyphs()` - Get all glyphs as a Map
- `getGlyph(id)` - Get a specific glyph by ID
- `getTransmissions()` - Get all transmissions
- `getTransmission(id)` - Get a specific transmission by ID
- `getTransmissionsForChapter(chapter)` - Get transmissions for a specific chapter
- `getGameConfig()` - Get game configuration
- `updateGlyph(id, updates)` - Update glyph data
- `updateTransmission(id, updates)` - Update transmission data
- `searchGlyphsByMeaning(term)` - Search glyphs by meaning
- `getConfirmedGlyphs()` - Get only confirmed glyphs
- `getUnconfirmedGlyphs()` - Get only unconfirmed glyphs

## Benefits of This Architecture

1. **Separation of Concerns**: Data is separate from components
2. **Maintainability**: Easy to modify data without touching code
3. **Scalability**: Easy to add new glyphs, transmissions, or configuration
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Testing**: Easy to mock data for testing
6. **Localization**: Easy to create different language versions
7. **Version Control**: Data changes are clearly tracked in git

## Adding New Data

### Adding a New Glyph
1. Add the glyph definition to `glyphs.json`
2. Add the corresponding SVG path to the imports
3. The data service will automatically load it

### Adding a New Transmission
1. Add the transmission to `transmissions.json`
2. Ensure all referenced glyphs exist
3. The game will automatically include it

### Modifying Game Configuration
1. Update `gameConfig.json`
2. The changes will be reflected immediately

## Migration from Hardcoded Data

The original hardcoded data in `GameEngine.tsx` has been moved to:
- `INITIAL_LEXICON` → `glyphs.json`
- `TRANSMISSIONS` → `transmissions.json`
- Game settings → `gameConfig.json`

The `useGameEngine` hook now uses the data service instead of hardcoded data. 