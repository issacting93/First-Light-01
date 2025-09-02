import React, { useState, useCallback, useEffect } from 'react';
import dataService, { Glyph, Transmission, NarrativeTransmission } from './dataService';

// Define LogEntry interface locally
export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  category: string;
  message: string;
  details?: string;
  metadata?: Record<string, any>;
}

export interface TranslationState {
  [glyphId: string]: string;
}

export interface GameState {
  currentTransmission: (Transmission | NarrativeTransmission) | null;
  transmissions: (Transmission | NarrativeTransmission)[];
  lexicon: Map<string, Glyph>;
  selectedGlyph: string | null;
  translationState: TranslationState;
  persistentGlyphSelections: Set<string>; // Track persistently selected glyphs
  score: number;
  chapter: number;
  countdown: number;
  logs: LogEntry[];
  isTransmissionComplete: boolean;
  lastTransmissionAccuracy: number | null;
  viewedTransmissions: Set<number>; // Track which transmissions have been viewed
  synchronizedTransmissions: Set<number>; // Track which transmissions have been synchronized
}

// Type guards for better type safety
const isNarrativeTransmission = (transmission: Transmission | NarrativeTransmission): transmission is NarrativeTransmission => {
  return 'alienText' in transmission;
};

const isLegacyTransmission = (transmission: Transmission | NarrativeTransmission): transmission is Transmission => {
  return 'glyphs' in transmission;
};

// Initialize game state with proper error handling
const initializeGameState = (): GameState => {
  try {
    const config = dataService.getGameConfig();
    // Use only narrative transmissions since getTransmissions() converts them to legacy format
    const transmissions = dataService.getTransmissions();
    const lexicon = dataService.getGlyphs();

    
    return {
      currentTransmission: transmissions[0] || null,
      transmissions: transmissions,
      lexicon,
      selectedGlyph: null,
      translationState: {},
      persistentGlyphSelections: new Set(),
      score: config.initialScore,
      chapter: config.initialChapter,
      countdown: config.countdownDuration,
      logs: [],
      isTransmissionComplete: false,
      lastTransmissionAccuracy: null,
      viewedTransmissions: new Set([1]), // Start with first transmission viewed
      synchronizedTransmissions: new Set() // Start with no synchronized transmissions
    };
  } catch (error) {
    console.error('Failed to initialize game state:', error);
    // Return a safe default state
    return {
      currentTransmission: null,
      transmissions: [],
      lexicon: new Map(),
      selectedGlyph: null,
      translationState: {},
      persistentGlyphSelections: new Set(),
      score: 0,
      chapter: 0,
      countdown: 300,
      logs: [],
      isTransmissionComplete: false,
      lastTransmissionAccuracy: null,
      viewedTransmissions: new Set(),
      synchronizedTransmissions: new Set()
    };
  }
};

export function useGameEngine() {
  // Safety check to ensure React is available
  if (!React || !React.useState) {
    throw new Error('React is not available. Make sure React is properly imported.');
  }

  const [gameState, setGameState] = useState<GameState>(() => {
    // Use lazy initialization to avoid calling during import phase
    try {
      const initialState = initializeGameState();
      
      // Unlock glyphs from the first transmission and update lexicon
      if (initialState.currentTransmission) {
        const firstTransmissionId = typeof initialState.currentTransmission.id === 'string' 
          ? parseInt(initialState.currentTransmission.id) 
          : initialState.currentTransmission.id;
        
        if (firstTransmissionId) {
          // Unlock glyphs for the first transmission
          dataService.unlockGlyphsForTransmission(firstTransmissionId);
          
          // Update the lexicon to reflect the current unlocked status
          const allGlyphsInTransmission = dataService.getGlyphsInTransmission(firstTransmissionId);
          const updatedLexicon = new Map(initialState.lexicon);
          
          allGlyphsInTransmission.forEach(glyphId => {
            const glyph = updatedLexicon.get(glyphId);
            if (glyph) {
              // Check if glyph is unlocked according to dataService
              glyph.isUnlocked = dataService.isGlyphUnlocked(glyphId);
              if (glyph.isUnlocked && !glyph.firstSeenInTransmission) {
                glyph.firstSeenInTransmission = firstTransmissionId;
              }
            }
          });
          
          return {
            ...initialState,
            lexicon: updatedLexicon
          };
        }
      }
      
      // Debug: Show current unlocking status
      // dataService.debugGlyphUnlocking(); // Removed debug log
      
      return initialState;
    } catch (error) {
      console.error('Failed to initialize game state:', error);
      // Return a safe default state
      return {
        currentTransmission: null,
        transmissions: [],
        lexicon: new Map(),
        selectedGlyph: null,
        translationState: {},
        persistentGlyphSelections: new Set(),
        score: 0,
        chapter: 0,
        countdown: 300,
        logs: [],
        isTransmissionComplete: false,
        lastTransmissionAccuracy: null,
        viewedTransmissions: new Set(),
        synchronizedTransmissions: new Set()
      };
    }
  });

  // Trigger UI update when component mounts to reflect unlocked glyphs
  useEffect(() => {
    // Force a re-render to show unlocked glyphs
    setGameState(prev => ({
      ...prev,
      lexicon: new Map(prev.lexicon)
    }));
    // console.log('🔄 Initial UI update triggered'); // Removed debug log
  }, []);

  const selectGlyph = useCallback((glyphId: string | null) => {
    setGameState(prev => {
      const newPersistentSelections = new Set(prev.persistentGlyphSelections);
      
      if (glyphId) {
        // Add to persistent selections
        newPersistentSelections.add(glyphId);
      } else {
        // Clear current selection but keep persistent ones
        // (This happens when clicking away or deselecting)
      }
      
      return {
        ...prev,
        selectedGlyph: prev.selectedGlyph === glyphId ? null : glyphId,
        persistentGlyphSelections: newPersistentSelections
      };
    });
  }, []);

  const clearPersistentSelections = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      persistentGlyphSelections: new Set()
    }));
  }, []);

  // New method to handle viewing transmissions (for unlocking glyphs)
  const viewTransmission = useCallback((transmissionId: number) => {
    console.log(`👁️ Viewing transmission ${transmissionId}`);
    
    setGameState(prev => {
      const newViewedTransmissions = new Set([...prev.viewedTransmissions, transmissionId]);
      
      // Use the new data-driven unlocking method
      dataService.unlockGlyphsForTransmission(transmissionId);
      
      // Update the lexicon to reflect unlocked glyphs
      const updatedLexicon = new Map(prev.lexicon);
      const glyphsInTransmission = dataService.getGlyphsInTransmission(transmissionId);
      
      console.log(`📋 Glyphs in transmission ${transmissionId}:`, glyphsInTransmission);
      
      glyphsInTransmission.forEach(glyphId => {
        const glyph = updatedLexicon.get(glyphId) as Glyph | undefined;
        if (glyph) {
          const wasUnlocked = glyph.isUnlocked;
          glyph.isUnlocked = dataService.isGlyphUnlocked(glyphId);
          if (glyph.isUnlocked && !glyph.firstSeenInTransmission) {
            glyph.firstSeenInTransmission = transmissionId;
          }
          if (!wasUnlocked && glyph.isUnlocked) {
            console.log(`🔄 UI updated: ${glyphId} is now unlocked`);
          }
        }
      });
      
      return {
        ...prev,
        viewedTransmissions: newViewedTransmissions,
        lexicon: updatedLexicon
      };
    });
  }, []);

  const selectTransmission = useCallback((transmissionId: string | number) => {
    console.log(`🎯 Selecting transmission ${transmissionId}`);
    
    let transmission: Transmission | NarrativeTransmission | null = null;
    
    try {
      if (typeof transmissionId === 'string') {
        transmission = dataService.getTransmission(transmissionId) || null;
      } else {
        transmission = dataService.getNarrativeTransmission(transmissionId) || null;
      }
      
      if (transmission) {
        // Mark transmission as viewed
        const numericId = typeof transmissionId === 'string' ? parseInt(transmissionId) : transmissionId;
        
        setGameState(prev => ({
          ...prev,
          currentTransmission: transmission as (Transmission | NarrativeTransmission) | null,
          selectedGlyph: null,
          translationState: {},
          isTransmissionComplete: false,
          viewedTransmissions: new Set([...prev.viewedTransmissions, numericId])
        }));

        // Use the new data-driven unlocking method
        dataService.unlockGlyphsForTransmission(numericId);
        
        // Update the lexicon to reflect unlocked glyphs
        setGameState(prev => {
          const updatedLexicon = new Map(prev.lexicon);
          const glyphsInTransmission = dataService.getGlyphsInTransmission(numericId);
          
          console.log(`📋 Glyphs in transmission ${numericId}:`, glyphsInTransmission);
          
          glyphsInTransmission.forEach(glyphId => {
            const glyph = updatedLexicon.get(glyphId) as Glyph | undefined;
            if (glyph) {
              const wasUnlocked = glyph.isUnlocked;
              glyph.isUnlocked = dataService.isGlyphUnlocked(glyphId);
              if (glyph.isUnlocked && !glyph.firstSeenInTransmission) {
                glyph.firstSeenInTransmission = numericId;
              }
              if (!wasUnlocked && glyph.isUnlocked) {
                console.log(`🔄 UI updated: ${glyphId} is now unlocked`);
              }
            }
          });
          
          return {
            ...prev,
            lexicon: updatedLexicon
          };
        });
      }
    } catch (error) {
      console.error('Failed to select transmission:', error);
    }
  }, []);

  const assignMeaning = useCallback((glyphId: string, meaning: string) => {
    setGameState(prev => {
      const newTranslationState = { ...prev.translationState, [glyphId]: meaning };
      
      // Update glyph usage count and create a new glyph object
      const glyph = prev.lexicon.get(glyphId);
      if (glyph) {
        try {
          // Update the glyph in the data service
          dataService.updateGlyph(glyphId, {
            timesUsed: glyph.timesUsed + 1,
            confirmedMeaning: meaning,
            confidence: Math.min(100, glyph.confidence + 10)
          });
          
          // Create a new lexicon Map with the updated glyph
          const newLexicon = new Map(prev.lexicon);
          newLexicon.set(glyphId, {
            ...glyph,
            timesUsed: glyph.timesUsed + 1,
            confirmedMeaning: meaning,
            confidence: Math.min(100, glyph.confidence + 10)
          });
          
          // Check if transmission is complete
          const currentTransmission = prev.currentTransmission;
          let isComplete = false;
          
          if (currentTransmission) {
            if (isNarrativeTransmission(currentTransmission)) {
              // Only check unlocked glyphs for completion
              const unlockedGlyphItems = (currentTransmission.alienText as any[]).filter((item: any) => 
                item.type === 'glyph' && 
                item.glyph && 
                dataService.isGlyphUnlocked(item.glyph)
              );
              isComplete = unlockedGlyphItems.length > 0 && unlockedGlyphItems.every((item: any) => newTranslationState[item.glyph!]);
            } else if (isLegacyTransmission(currentTransmission)) {
              // Only check unlocked glyphs for completion
              const unlockedGlyphs = currentTransmission.glyphs?.filter(g => dataService.isGlyphUnlocked(g)) || [];
              isComplete = unlockedGlyphs.length > 0 && unlockedGlyphs.every(g => newTranslationState[g]);
            }
          }
          
          return {
            ...prev,
            lexicon: newLexicon,
            translationState: newTranslationState,
            isTransmissionComplete: isComplete
          };
        } catch (error) {
          console.error('Failed to update glyph:', error);
        }
      }
      
      // Fallback if glyph not found
      return {
        ...prev,
        translationState: newTranslationState
      };
    });
  }, []);

  const calculateAccuracy = useCallback((transmission: Transmission | NarrativeTransmission, translationState: Record<string, string>): number => {
    if (isNarrativeTransmission(transmission)) {
      // Narrative transmission - calculate based on glyph translations
      const glyphItems = (transmission.alienText as any[]).filter((item: any) => item.type === 'glyph' && item.glyph);
      if (glyphItems.length === 0) return 100;
      
      const correctTranslations = glyphItems.filter((item: any) => {
        const glyphId = item.glyph!;
        return translationState[glyphId] && translationState[glyphId].toLowerCase() === 'correct';
      });
      
      return Math.round((correctTranslations.length / glyphItems.length) * 100);
    } else {
      // Legacy transmission
      if (!transmission.glyphs || transmission.glyphs.length === 0) return 100;
      
      const correctTranslations = transmission.glyphs.filter(glyphId => {
        return translationState[glyphId] && translationState[glyphId].toLowerCase() === 'correct';
      });
      
      return Math.round((correctTranslations.length / transmission.glyphs.length) * 100);
    }
  }, []);

  const nextTransmission = useCallback(() => {
    setGameState(prev => {
      const currentIndex = prev.transmissions.findIndex(t => 
        t.id === prev.currentTransmission?.id
      );
      
      // Mark current transmission as synchronized if it was complete
      const currentTransmissionId = prev.currentTransmission?.id;
      const numericCurrentId = typeof currentTransmissionId === 'string' ? parseInt(currentTransmissionId) : currentTransmissionId;
      const newSynchronizedTransmissions = new Set([...prev.synchronizedTransmissions]);
      if (numericCurrentId && prev.isTransmissionComplete) {
        newSynchronizedTransmissions.add(numericCurrentId);
      }
      
      // Check if we're on the last transmission
      const isLastTransmission = currentIndex === prev.transmissions.length - 1;
      
      if (isLastTransmission) {
        // If we're on the last transmission, unlock its glyphs if not already unlocked
        if (numericCurrentId && prev.currentTransmission && isNarrativeTransmission(prev.currentTransmission)) {
          const glyphsInCurrentTransmission = dataService.getGlyphsInTransmission(numericCurrentId);
          glyphsInCurrentTransmission.forEach(glyphId => {
            if (!dataService.isGlyphUnlocked(glyphId)) {
              dataService.unlockGlyph(glyphId, numericCurrentId);
              // console.log(`🔓 UNLOCKED: ${glyphId} from current (last) transmission ${numericCurrentId}`); // Removed debug log
            }
          });
        }
        
        // Debug: Check glyph unlocking status
        // dataService.debugGlyphUnlocking(); // Removed debug log
        
        // Don't change anything else, just unlock the glyphs
        const newState = {
          ...prev,
          selectedGlyph: null,
          translationState: {},
          isTransmissionComplete: false,
          synchronizedTransmissions: newSynchronizedTransmissions
        };
        
        // Check for end game condition after state update
        setTimeout(() => {
          const totalTransmissions = newState.transmissions.length;
          const synchronizedCount = newSynchronizedTransmissions.size;
          
          // console.log(`🎯 End Game Check: ${synchronizedCount}/${totalTransmissions} transmissions synchronized`); // Removed debug log
          
          if (synchronizedCount >= totalTransmissions && totalTransmissions > 0) {
            // console.log('🎉 ALL TRANSMISSIONS SYNCHRONIZED! Opening end game...'); // Removed debug log
            window.location.href = '/audio/end-game.html';
          }
        }, 100);
        
        return newState;
      }
      
      const nextIndex = currentIndex + 1;
      const nextTransmission = prev.transmissions[nextIndex] || null;
      
      // Mark next transmission as viewed (unlock it) instead of automatically selecting it
      const numericId = typeof nextTransmission?.id === 'string' ? parseInt(nextTransmission.id) : nextTransmission?.id;
      const newViewedTransmissions = new Set([...prev.viewedTransmissions]);
      if (numericId) {
        newViewedTransmissions.add(numericId);
        
        // Use the new data-driven unlocking method
        dataService.unlockGlyphsForTransmission(numericId);
      }
      
      // Change the current transmission to the next one and unlock its glyphs
      const newState = {
        ...prev,
        currentTransmission: nextTransmission,
        selectedGlyph: null,
        translationState: {},
        isTransmissionComplete: false,
        viewedTransmissions: newViewedTransmissions,
        synchronizedTransmissions: newSynchronizedTransmissions
      };
      
      // Check for end game condition after state update
      setTimeout(() => {
        const totalTransmissions = newState.transmissions.length;
        const synchronizedCount = newSynchronizedTransmissions.size;
        
        // console.log(`🎯 End Game Check: ${synchronizedCount}/${totalTransmissions} transmissions synchronized`); // Removed debug log
        
        if (synchronizedCount >= totalTransmissions && totalTransmissions > 0) {
          // console.log('🎉 ALL TRANSMISSIONS SYNCHRONIZED! Opening end game...'); // Removed debug log
          window.location.href = '/audio/end-game.html';
        }
      }, 100);
      
      return newState;
    });
  }, []);

  const addLog = useCallback((log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, newLog]
    }));
  }, []);

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score + points)
    }));
  }, []);

  const updateChapter = useCallback((newChapter: number) => {
    setGameState(prev => ({
      ...prev,
      chapter: newChapter
    }));
  }, []);

  const updateCountdown = useCallback((newCountdown: number) => {
    setGameState(prev => ({
      ...prev,
      countdown: Math.max(0, newCountdown)
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGameState());
  }, []);

  // Check if all transmissions are synchronized and trigger end game
  const checkEndGameCondition = useCallback(() => {
    setGameState(prev => {
      const totalTransmissions = prev.transmissions.length;
      const synchronizedCount = prev.synchronizedTransmissions.size;
      
      // console.log(`🎯 End Game Check: ${synchronizedCount}/${totalTransmissions} transmissions synchronized`); // Removed debug log
      
      // If all transmissions are synchronized, trigger end game
      if (synchronizedCount >= totalTransmissions && totalTransmissions > 0) {
        // console.log('🎉 ALL TRANSMISSIONS SYNCHRONIZED! Opening end game...'); // Removed debug log
        
        // Add a small delay to allow the UI to update before redirecting
        setTimeout(() => {
          window.location.href = '/audio/end-game.html';
        }, 1000);
      }
      
      return prev;
    });
  }, []);

  const markTransmissionSynchronized = useCallback((transmissionId: string | number) => {
    setGameState(prev => {
      const numericId = typeof transmissionId === 'string' ? parseInt(transmissionId) : transmissionId;
      if (!numericId) return prev;
      
      const newSynchronizedTransmissions = new Set([...prev.synchronizedTransmissions, numericId]);
      
      console.log(`🎯 Marking transmission ${numericId} as synchronized`);
      console.log(`📊 Synchronized transmissions:`, Array.from(newSynchronizedTransmissions));
      
      // ✅ CRITICAL FIX: Also set completion flag when manually synchronized
      const isCurrentTransmission = prev.currentTransmission && 
        (typeof prev.currentTransmission.id === 'string' ? parseInt(prev.currentTransmission.id) : prev.currentTransmission.id) === numericId;
      
      return {
        ...prev,
        synchronizedTransmissions: newSynchronizedTransmissions,
        // ✅ Set completion flag if this is the current transmission
        isTransmissionComplete: isCurrentTransmission ? true : prev.isTransmissionComplete
      };
    });
  }, []);

  return {
    gameState,
    selectGlyph,
    clearPersistentSelections,
    selectTransmission,
    viewTransmission, // Add the new method to the return object
    assignMeaning,
    calculateAccuracy,
    nextTransmission,
    addLog,
    updateScore,
    updateChapter,
    updateCountdown,
    resetGame,
    checkEndGameCondition, // Add the new function to the return object
    markTransmissionSynchronized, // Add the new function to mark transmissions as synchronized
    // Debug functions
    debugGlyphUnlocking: () => dataService.debugGlyphUnlocking(),
    forceUnlockAllGlyphs: () => dataService.forceUnlockAllGlyphs()
  };
} 