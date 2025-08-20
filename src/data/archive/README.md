# Archived Data Files

This directory contains data files that were identified as unused or redundant in the current application.

## Archived Files

### 1. `glyphSchema.json`
- **Reason**: Not imported or used anywhere in the application
- **Status**: Completely unused
- **Action**: Moved to archive
- **Date**: 2025-08-04

### 2. `compoundWords.json`
- **Reason**: Loaded by dataService but no components use compound word functionality
- **Status**: Data service has methods for it but they're not called
- **Action**: Moved to archive, removed from dataService
- **Date**: 2025-08-04

### 3. `vibrationalDictionary.json`
- **Reason**: Loaded by dataService but no components use vibrational patterns
- **Status**: Data service has methods for it but they're not called
- **Action**: Moved to archive, removed from dataService
- **Date**: 2025-08-04

## Data Service Cleanup

The following were removed from `src/services/dataService.ts`:

### Removed Interfaces:
- `CompoundWord` interface
- `VibrationalPattern` interface

### Removed Private Properties:
- `compoundWords: Map<string, CompoundWord>`
- `vibrationalPatterns: VibrationalPattern[]`
- `vibrationalCategories: Record<string, { name: string; description: string }>`

### Removed Methods:
- `getCompoundWords()`
- `getCompoundWord()`
- `isCompoundWord()`
- `getCompoundWordGlyphs()`
- `getCompoundWordsContainingGlyph()`
- `getVibrationalPatterns()`
- `getVibrationalPattern()`
- `getVibrationalCategories()`
- `getVibrationalPatternsByCategory()`
- `searchVibrationalPatterns()`

### Removed Imports:
- `compoundWordsData` import
- `vibrationalDictionaryData` import

## Current Active Data Files

- **`glyphs.json`** - Core glyph definitions
- **`transmissions.json`** - Core transmission puzzles
- **`gameConfig.json`** - Game configuration
- **`narrativeTransmissions.json`** - Narrative content
- **`symbolWordAssociations.ts`** - Symbol mapping (used by VibrationalDictionary)

## Benefits of Cleanup

1. **Reduced Bundle Size**: Removed unused data from the build
2. **Cleaner Code**: Removed unused interfaces and methods
3. **Better Performance**: Less data to load and process
4. **Easier Maintenance**: Fewer files to maintain
5. **Clearer Architecture**: Only active data files remain

## Future Considerations

If you need to implement:
- **Compound Words**: Restore `compoundWords.json` and related methods
- **Vibrational Patterns**: Restore `vibrationalDictionary.json` and related methods
- **Glyph Schema**: Restore `glyphSchema.json` if needed for validation 