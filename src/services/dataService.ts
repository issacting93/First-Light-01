// Define interfaces locally to avoid circular dependencies
export interface Glyph {
  id: string;
  symbol: string;
  svgPath: string;
  svgViewBox: string;
  possibleMeanings: string[];
  confirmedMeaning?: string;
  confidence: number;
  timesUsed: number;
  isRotated?: boolean;
  rotationDegrees?: number;
  contextualNote?: string;
  isUnlocked?: boolean; // New: tracks if glyph is visible to player
  firstSeenInTransmission?: number; // New: tracks when glyph was first encountered
}

export interface Transmission {
  id: string;
  glyphs?: string[];
  context: string;
  difficulty: number;
  chapter: number;
  solution?: string;
  correctMeanings?: Record<string, string | undefined>;
  isCompleted?: boolean;
  accuracy?: number;
  communicationType?: 'glyphs';
}

import glyphsData from '../data/glyphs.json';
import gameConfigData from '../data/gameConfig.json';
import narrativeTransmissionsData from '../data/narrativeTransmissions.json';

// Import SVG paths from the new file
import svgPaths from '../data/svg-paths.ts';

// SVG path mapping - using only the new SVG paths
const svgPathMap: Record<string, any> = {
  ...svgPaths
};

export interface GameConfig {
  initialScore: number;
  initialChapter: number;
  countdownDuration: number;
  maxTransmissions: number;
  difficultyProgression: Record<string, {
    maxDifficulty: number;
    transmissions: string[];
  }>;
  scoring: {
    perfectTranslation: number;
    goodTranslation: number;
    acceptableTranslation: number;
    poorTranslation: number;
    failedTranslation: number;
  };
  confidenceThresholds: {
    high: number;
    medium: number;
    low: number;
    veryLow: number;
  };
}

export interface TranslatorNote {
  word: string;
  note: string;
}

export interface NarrativeTransmission {
  id: number;
  title: string;
  subtitle: string;
  alienText: Array<{ type: string; content?: string; glyph?: string }>;
  glyphLocking?: {
    unlockedGlyphs: string[];
    lockedGlyphs: string[];
    description: string;
  };
  translation: string;
  interpretation: string;
  timestamp: string;
  translatorNote?: string;
  chapter: number;
  difficulty: number;
  confidenceThreshold: number;
}

class DataService {
  private glyphs: Map<string, Glyph> = new Map();
  private narrativeTransmissions: NarrativeTransmission[] = [];
  private gameConfig!: GameConfig;
  private unlockedGlyphs: Set<string> = new Set(); // Track unlocked glyphs
  private cachedTransmissions: Transmission[] | null = null; // Cache for transmissions
  private processedTransmissions: Set<number> = new Set(); // Track processed transmissions to prevent duplicates

  constructor() {
    this.loadData();
    this.initializeUnlockedGlyphs();
  }

  private loadData() {
    // Clear cache when loading new data
    this.cachedTransmissions = null;
    
    // Load glyphs
    glyphsData.glyphs.forEach((glyphData: any) => {
      // Map SVG path reference to actual path
      let actualSvgPath = glyphData.svgPath;
      if (glyphData.svgPath.includes('.')) {
        // Handle references like "svgPaths3.p2d404d00"
        const [, pathKey] = glyphData.svgPath.split('.');
        if (svgPathMap[pathKey]) {
          actualSvgPath = svgPathMap[pathKey];
        }
      } else if (svgPathMap[glyphData.svgPath]) {
        // Handle direct path names like "speak", "love", "hold"
        actualSvgPath = svgPathMap[glyphData.svgPath];
      }
      
      // Fallback: if no valid path found, use a simple placeholder
      if (!actualSvgPath || actualSvgPath === glyphData.svgPath) {
        console.warn(`SVG path not found for glyph ${glyphData.id}: ${glyphData.svgPath}`);
        actualSvgPath = "M0 0"; // Simple fallback path
      }
      
      const glyph: Glyph = {
        id: glyphData.id,
        symbol: glyphData.symbol,
        svgPath: actualSvgPath,
        svgViewBox: glyphData.svgViewBox,
        possibleMeanings: glyphData.possibleMeanings,
        confirmedMeaning: glyphData.confirmedMeaning,
        confidence: glyphData.confidence,
        timesUsed: glyphData.timesUsed,
        isRotated: glyphData.isRotated,
        rotationDegrees: glyphData.rotationDegrees,
        contextualNote: glyphData.contextualNote,
        isUnlocked: false, // Start locked
        firstSeenInTransmission: undefined
      };
      
      this.glyphs.set(glyph.id, glyph);
    });

    // Load narrative transmissions
    this.narrativeTransmissions = narrativeTransmissionsData.transmissions;

    // Load game config
    this.gameConfig = gameConfigData.gameSettings;
  }

  // Initialize unlocked glyphs based on first transmission
  private initializeUnlockedGlyphs() {
    // Get the first transmission's glyph locking data
    const firstTransmission = this.narrativeTransmissions.find(t => t.id === 1);
    if (!firstTransmission || !firstTransmission.glyphLocking) {
      console.warn('No glyph locking data found for transmission 1');
      return;
    }

    const { unlockedGlyphs, lockedGlyphs, description } = firstTransmission.glyphLocking;
    
    // Unlock the specified glyphs from the first transmission
    unlockedGlyphs.forEach(glyphId => {
      this.unlockedGlyphs.add(glyphId);
      const glyph = this.glyphs.get(glyphId);
      if (glyph) {
        glyph.isUnlocked = true;
        glyph.firstSeenInTransmission = 1;
      }
    });

    // Log the locking state for debugging
    console.log('🔒 Locked glyphs (should appear red):', lockedGlyphs);
    console.log('🔓 Unlocked glyphs (should appear white):', unlockedGlyphs);
    console.log('📝 Locking description:', description);
  }

  // Glyph methods
  getGlyphs(): Map<string, Glyph> {
    return this.glyphs;
  }

  getGlyph(id: string): Glyph | undefined {
    return this.glyphs.get(id);
  }

  // Get only unlocked glyphs for dictionary display
  getUnlockedGlyphs(): Glyph[] {
    return Array.from(this.glyphs.values()).filter(glyph => glyph.isUnlocked);
  }

  // Check if glyph is unlocked
  isGlyphUnlocked(glyphId: string): boolean {
    return this.unlockedGlyphs.has(glyphId);
  }

  // Unlock a glyph when encountered
  unlockGlyph(glyphId: string, transmissionId: number) {
    if (this.unlockedGlyphs.has(glyphId)) {
      console.log(`✅ Glyph ${glyphId} already unlocked`);
      return;
    }
    
    this.unlockedGlyphs.add(glyphId);
    const glyph = this.glyphs.get(glyphId);
    if (glyph) {
      glyph.isUnlocked = true;
      if (!glyph.firstSeenInTransmission) {
        glyph.firstSeenInTransmission = transmissionId;
      }
      console.log(`🔓 NEW GLYPH UNLOCKED: ${glyphId} in transmission ${transmissionId}`);
    }
  }

  // Unlock glyphs based on transmission data
  unlockGlyphsForTransmission(transmissionId: number) {
    // Check if this transmission has already been processed
    if (this.processedTransmissions.has(transmissionId)) {
      console.log(`⏭️ Transmission ${transmissionId} already processed, skipping`);
      return;
    }
    
    console.log(`🔍 Attempting to unlock glyphs for transmission ${transmissionId}`);
    
    const transmission = this.narrativeTransmissions.find(t => t.id === transmissionId);
    if (!transmission) {
      console.log(`❌ No transmission found with id ${transmissionId}`);
      return;
    }
    
    if (!transmission.glyphLocking) {
      console.log(`⚠️ No glyph locking data found for transmission ${transmissionId}`);
      return;
    }

    const { unlockedGlyphs, description } = transmission.glyphLocking;
    console.log(`📋 Transmission ${transmissionId} has ${unlockedGlyphs.length} glyphs to unlock:`, unlockedGlyphs);
    
    let newlyUnlocked = 0;
    unlockedGlyphs.forEach(glyphId => {
      if (!this.unlockedGlyphs.has(glyphId)) {
        this.unlockedGlyphs.add(glyphId);
        const glyph = this.glyphs.get(glyphId);
        if (glyph) {
          glyph.isUnlocked = true;
          if (!glyph.firstSeenInTransmission) {
            glyph.firstSeenInTransmission = transmissionId;
          }
          newlyUnlocked++;
          console.log(`🔓 NEW GLYPH UNLOCKED: ${glyphId} in transmission ${transmissionId}`);
        } else {
          console.log(`⚠️ Glyph ${glyphId} not found in glyphs map`);
        }
      } else {
        console.log(`✅ Glyph ${glyphId} already unlocked`);
      }
    });

    console.log(`📖 Transmission ${transmissionId} unlocked ${newlyUnlocked} new glyphs`);
    console.log(`📝 Description: ${description}`);
    console.log(`🔍 Current unlocked glyphs:`, Array.from(this.unlockedGlyphs));
    
    // Mark this transmission as processed
    this.processedTransmissions.add(transmissionId);
  }

  // Get glyphs that appear in a specific transmission
  getGlyphsInTransmission(transmissionId: number): string[] {
    const transmission = this.narrativeTransmissions.find(t => t.id === transmissionId);
    if (!transmission) return [];
    
    return transmission.alienText
      .filter(item => item.type === 'glyph' && item.glyph)
      .map(item => item.glyph!);
  }

  // Check which glyphs in a transmission are unlocked
  getUnlockedGlyphsInTransmission(transmissionId: number): string[] {
    const transmissionGlyphs = this.getGlyphsInTransmission(transmissionId);
    return transmissionGlyphs.filter(glyphId => this.isGlyphUnlocked(glyphId));
  }

  // Get locked glyphs in a transmission
  getLockedGlyphsInTransmission(transmissionId: number): string[] {
    const transmissionGlyphs = this.getGlyphsInTransmission(transmissionId);
    return transmissionGlyphs.filter(glyphId => !this.isGlyphUnlocked(glyphId));
  }

  // Transmission methods - now using narrative transmissions
  getTransmissions(): Transmission[] {
    // Return cached result if available
    if (this.cachedTransmissions) {
      return this.cachedTransmissions;
    }
    
    // Calculate and cache the result
    this.cachedTransmissions = this.narrativeTransmissions.map(nt => ({
      id: nt.id.toString(),
      context: nt.title,
      difficulty: nt.difficulty,
      chapter: nt.chapter,
      communicationType: 'glyphs' as const,
      glyphs: this.getNarrativeTransmissionGlyphs(nt)
    }));
    
    return this.cachedTransmissions;
  }

  getTransmission(id: string): Transmission | undefined {
    const narrativeTransmission = this.narrativeTransmissions.find(t => t.id.toString() === id);
    if (!narrativeTransmission) {
      console.log('DataService: No narrative transmission found for id:', id);
      return undefined;
    }
    
    const glyphs = this.getNarrativeTransmissionGlyphs(narrativeTransmission);
    const transmission = {
      id: narrativeTransmission.id.toString(),
      context: narrativeTransmission.title,
      difficulty: narrativeTransmission.difficulty,
      chapter: narrativeTransmission.chapter,
      communicationType: 'glyphs' as const,
      glyphs: glyphs
    };
    
    return transmission;
  }

  getTransmissionsForChapter(chapter: number): Transmission[] {
    return this.narrativeTransmissions
      .filter(t => t.chapter === chapter)
      .map(nt => ({
        id: nt.id.toString(),
        context: nt.title,
        difficulty: nt.difficulty,
        chapter: nt.chapter,
        communicationType: 'glyphs' as const,
        glyphs: this.getNarrativeTransmissionGlyphs(nt)
      }));
  }

  // Game config methods
  getGameConfig(): GameConfig {
    return this.gameConfig;
  }

  // Narrative transmission methods
  getNarrativeTransmissions(): NarrativeTransmission[] {
    return this.narrativeTransmissions;
  }

  getNarrativeTransmission(id: number): NarrativeTransmission | undefined {
    return this.narrativeTransmissions.find(t => t.id === id);
  }

  getNarrativeTransmissionsForChapter(chapter: number): NarrativeTransmission[] {
    return this.narrativeTransmissions.filter(t => t.chapter === chapter);
  }

  searchNarrativeTransmissions(searchTerm: string): NarrativeTransmission[] {
    const term = searchTerm.toLowerCase();
    return this.narrativeTransmissions.filter(transmission => 
      transmission.title.toLowerCase().includes(term) ||
      transmission.subtitle.toLowerCase().includes(term) ||
      transmission.translation.toLowerCase().includes(term) ||
      transmission.interpretation.toLowerCase().includes(term) ||
      (transmission.translatorNote && transmission.translatorNote.toLowerCase().includes(term))
    );
  }

  getNarrativeTransmissionGlyphs(transmission: NarrativeTransmission): string[] {
    const glyphs = transmission.alienText
      .filter(item => item.type === 'glyph' && item.glyph)
      .map(item => item.glyph!);
    
    return glyphs;
  }

  // Update methods
  updateGlyph(id: string, updates: Partial<Glyph>) {
    const glyph = this.glyphs.get(id);
    if (glyph) {
      Object.assign(glyph, updates);
    }
  }

  // Clear cache when data changes
  clearCache() {
    this.cachedTransmissions = null;
  }

  updateTransmission(id: string, updates: Partial<Transmission>) {
    const narrativeTransmission = this.narrativeTransmissions.find(t => t.id.toString() === id);
    if (narrativeTransmission) {
      // For narrative transmissions, we can only update certain fields
      if (updates.isCompleted !== undefined) {
        (narrativeTransmission as any).isCompleted = updates.isCompleted;
      }
      if (updates.accuracy !== undefined) {
        (narrativeTransmission as any).accuracy = updates.accuracy;
      }
    }
  }

  // Utility methods
  getGlyphsByConfidence(minConfidence: number): Glyph[] {
    return Array.from(this.glyphs.values()).filter(g => g.confidence >= minConfidence);
  }

  getConfirmedGlyphs(): Glyph[] {
    return Array.from(this.glyphs.values()).filter(g => g.confirmedMeaning);
  }

  getUnconfirmedGlyphs(): Glyph[] {
    return Array.from(this.glyphs.values()).filter(g => !g.confirmedMeaning);
  }

  searchGlyphsByMeaning(searchTerm: string): Glyph[] {
    const term = searchTerm.toLowerCase();
    return Array.from(this.glyphs.values()).filter(glyph =>
      glyph.possibleMeanings.some(meaning => meaning.toLowerCase().includes(term)) ||
      (glyph.confirmedMeaning && glyph.confirmedMeaning.toLowerCase().includes(term))
    );
  }

  getGlyphsForTransmission(transmission: Transmission): Glyph[] {
    if (!transmission.glyphs) {
      return [];
    }
    return transmission.glyphs
      .map(glyphId => this.glyphs.get(glyphId))
      .filter((glyph): glyph is Glyph => glyph !== undefined);
  }

  calculateTransmissionDifficulty(transmission: Transmission): number {
    const glyphs = this.getGlyphsForTransmission(transmission);
    const avgConfidence = glyphs.reduce((sum, glyph) => sum + glyph.confidence, 0) / glyphs.length;
    return Math.max(1, Math.min(10, Math.round((1 - avgConfidence) * 10)));
  }

  // Debug method to check glyph unlocking status
  debugGlyphUnlocking() {
    console.log('🔍 === GLYPH UNLOCKING DEBUG ===');
    console.log(`Total glyphs: ${this.glyphs.size}`);
    console.log(`Unlocked glyphs: ${this.unlockedGlyphs.size}`);
    console.log('Unlocked glyphs:', Array.from(this.unlockedGlyphs));
    
    // Check transmission 1 specifically
    const transmission1Glyphs = this.getGlyphsInTransmission(1);
    const unlockedInTransmission1 = this.getUnlockedGlyphsInTransmission(1);
    const lockedInTransmission1 = this.getLockedGlyphsInTransmission(1);
    
    console.log('📋 Transmission 1 glyphs:', transmission1Glyphs);
    console.log('🔓 Unlocked in transmission 1:', unlockedInTransmission1);
    console.log('🔒 Locked in transmission 1:', lockedInTransmission1);
    console.log('🔍 === END DEBUG ===');
  }

  // Force unlock all glyphs (for testing)
  forceUnlockAllGlyphs() {
    this.glyphs.forEach((glyph, glyphId) => {
      if (!glyph.isUnlocked) {
        this.unlockGlyph(glyphId, 1); // Mark as unlocked from first transmission
        console.log(`🔓 FORCE UNLOCKED: ${glyphId}`);
      }
    });
  }

  // Test method to manually trigger unlocking for debugging
  testUnlockingMechanics() {
    console.log('🧪 TESTING UNLOCKING MECHANICS');
    console.log('📊 Current unlocked glyphs:', Array.from(this.unlockedGlyphs));
    console.log('📊 Total glyphs:', this.glyphs.size);
    
    // Test unlocking transmission 1
    console.log('\n🔍 Testing transmission 1...');
    this.unlockGlyphsForTransmission(1);
    
    // Test unlocking transmission 2
    console.log('\n🔍 Testing transmission 2...');
    this.unlockGlyphsForTransmission(2);
    
    console.log('\n📊 Final unlocked glyphs:', Array.from(this.unlockedGlyphs));
  }
}

const dataService = new DataService();
export default dataService; 