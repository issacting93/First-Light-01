import { useState, useCallback } from 'react';
import type { NarrativeTransmission } from '../../src/services/dataService';
import dataService from '../../src/services/dataService';
import { Modal } from '../modals';
import { AnimatedHexagonSelector } from '../hexagon';

interface NarrativeTransmissionProps {
  transmission: NarrativeTransmission;
  gameState: {
    lexicon: Map<string, any>;
    translationState: Record<string, string>;
    selectedGlyph: string | null;
  };
  onGlyphClick: (glyphId: string) => void;
  onTransmissionComplete?: (transmission: NarrativeTransmission, accuracy: number) => void;
  onAssignMeaning?: (glyphId: string, meaning: string) => void;
  onNextTransmission?: () => void;
}

export function NarrativeTransmission({ 
  transmission, 
  gameState,
  onGlyphClick,
  onTransmissionComplete,
  onAssignMeaning,
  onNextTransmission
}: NarrativeTransmissionProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);

  // Only count unlocked glyphs for progress
  const unlockedGlyphItems = transmission.alienText.filter(item => 
    item.type === 'glyph' && 
    item.glyph && 
    dataService.isGlyphUnlocked(item.glyph!)
  );
  const totalUnlockedGlyphs = unlockedGlyphItems.length;
  const translatedUnlockedGlyphs = unlockedGlyphItems.filter(item => 
    item.glyph && gameState.translationState[item.glyph]
  ).length;

  const calculateConfidence = () => {
    if (totalUnlockedGlyphs === 0) return 100;
    
    let confidence = (translatedUnlockedGlyphs / totalUnlockedGlyphs) * 100;
    
    // Add consecutive translation bonus
    let consecutiveBonus = 0;
    let consecutiveCount = 0;
    
    unlockedGlyphItems.forEach((item) => {
      if (item.glyph && gameState.translationState[item.glyph]) {
        consecutiveCount++;
        if (consecutiveCount > 1) {
          consecutiveBonus += 5;
        }
      } else {
        consecutiveCount = 0;
      }
    });
    
    return Math.min(100, confidence + consecutiveBonus);
  };

  const handleTranslate = () => {
    const confidence = calculateConfidence();
    // Allow translation even with incomplete progress
      setShowTranslation(true);
      onTransmissionComplete?.(transmission, confidence);
  };

  const getGlyphStatus = (glyphId: string) => {
    const isUnlocked = dataService.isGlyphUnlocked(glyphId);
    
    if (!isUnlocked) {
      return 'locked';
    }
    if (gameState.translationState[glyphId]) {
      return 'translated';
    }
    if (gameState.selectedGlyph === glyphId) {
      return 'selected';
    }
    return 'unselected';
  };

  const getGlyphData = (glyphId: string) => {
    return gameState.lexicon.get(glyphId);
  };

  const getSelectedGlyph = useCallback(() => {
    if (!gameState?.selectedGlyph) return null;
    return gameState.lexicon.get(gameState.selectedGlyph) || null;
  }, [gameState?.selectedGlyph, gameState?.lexicon]);

  const currentSelectedHexagon = useCallback(() => {
    if (!gameState?.selectedGlyph) return null;
    const glyph = gameState.lexicon.get(gameState.selectedGlyph);
    return glyph?.confirmedMeaning || null;
  }, [gameState?.selectedGlyph, gameState?.lexicon]);

  const handleHexagonSelect = useCallback((hexagonId: string) => {
    if (!gameState?.selectedGlyph || !onAssignMeaning) return;
    
    // Check if this is the correct answer (no "decoy-" prefix)
    if (!hexagonId.startsWith('decoy-')) {
      // This is the correct answer, assign the meaning
      console.log('✅ Correct answer selected:', hexagonId);
      onAssignMeaning(gameState.selectedGlyph, hexagonId);
      // Clear the selection after assigning meaning
      onGlyphClick(gameState.selectedGlyph); // Click the same glyph to deselect it
    } else {
      // This is a wrong answer, don't assign anything
      console.log('❌ Wrong answer selected:', hexagonId);
    }
  }, [gameState?.selectedGlyph, onAssignMeaning, onGlyphClick]);

  const hasUnlockedGlyphs = totalUnlockedGlyphs > 0;

  return (
    <div className="bg-terminal-bg relative size-full overflow-hidden flex">
      {/* Grid Overlay Background */}
      <div 
        className="grid-overlay"
        style={{
          '--grid-color': 'rgba(255, 240, 230, 0.05)'
        } as React.CSSProperties}
      ></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
   

        {/* Central Content - Mixed Text and Glyphs */}
        <div className="flex justify-center items-centerflex-1 flex flex-col items-center justify-center gap-8 p-8 min-h-0 h-full">
          
          {/* Mixed Content Display */}
          <div className="w-full max-w-4xl bg-terminal-panel p-6 rounded-lg">
            <div className="flex justify-center items-center gap-2 text-lg leading-relaxed">
              {transmission.alienText.map((item, index) => (
                <span key={index}>
                  {item.type === 'text' ? (
                    <span className="text-terminal-text-primary">{item.content}</span>
                  ) : (
                    <button
                      onClick={() => onGlyphClick(item.glyph!)}
                      className={`inline-block p-2 rounded transition-all duration-200 ${
                        getGlyphStatus(item.glyph!) === 'translated'
                          ? 'bg-terminal-accent-primary text-terminal-bg'
                          : getGlyphStatus(item.glyph!) === 'selected'
                          ? 'bg-terminal-accent-secondary text-terminal-bg'
                          : getGlyphStatus(item.glyph!) === 'locked'
                          ? 'bg-red-900/20 border border-red-500/50'
                          : 'hover:bg-terminal-accent-secondary'
                      }`}
                      style={{
                        backgroundColor: getGlyphStatus(item.glyph!) === 'unselected' ? '#F84B40' : undefined,
                        color: getGlyphStatus(item.glyph!) === 'unselected' ? 'white' : undefined
                      }}
                    >
                      {(() => {
                        const glyphData = getGlyphData(item.glyph!);
                        const isTranslated = getGlyphStatus(item.glyph!) === 'translated';
                        const isLocked = getGlyphStatus(item.glyph!) === 'locked';
                        const translation = gameState.translationState[item.glyph!];
                        
                        // If translated, show the translation text
                        if (isTranslated && translation) {
                          return (
                            <span className="text-terminal-text-primary font-mono text-lg font-bold" style={{ letterSpacing: 'var(--terminal-letter-spacing-widest)' }}>
                              {translation}
                            </span>
                          );
                        }
                        
                        // Otherwise show the glyph
                        if (glyphData?.svgPath) {
                          return (
                            <div 
                              className={`relative ${glyphData.isRotated ? `rotate-[${glyphData.rotationDegrees}deg]` : ''}`}
                              style={{
                                height: '18px',
                                width: 'auto'
                              }}
                            >
                              <svg className="block h-full w-auto" fill="none" preserveAspectRatio="xMidYMid meet" viewBox={glyphData.svgViewBox}>
                                <path d={glyphData.svgPath} fill={isLocked ? '#ff4e42' : 'currentColor'} className="text-terminal-text-primary" />
                              </svg>
                            </div>
                          );
                        } else if (glyphData?.symbol) {
                          return (
                            <span className="font-mono text-lg font-bold" style={{ 
                              letterSpacing: 'var(--terminal-letter-spacing-widest)',
                              color: isLocked ? '#ff4e42' : 'var(--terminal-text-primary)'
                            }}>
                              {glyphData.symbol}
                            </span>
                          );
                        } else {
                          return (
                            <span className="text-terminal-text-secondary font-mono text-sm">
                              {item.glyph}
                            </span>
                          );
                        }
                      })()}
                      {getGlyphStatus(item.glyph!) === 'translated' && (
                        <span className="ml-1 text-xs">
                          ✓
                        </span>
                      )}
                      {getGlyphStatus(item.glyph!) === 'locked' && (
                        <span className="ml-1 text-xs text-red-500">
                          🔒
                        </span>
                      )}
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
          
          {/* Hexagon Selector - Always show, with different states */}
          <div className="w-full flex justify-center items-center" style={{ height: '450px' }}>
            <div 
              className="  bg-terminal-panel p-4 rounded"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '630px',
                width: '100%',
                height: '100%'
              }}
            >
              <div className="w-full h-full flex flex-col">
                {gameState?.selectedGlyph ? (
                  <>
                    <div className="mb-4">
                  
                    </div>
                    <AnimatedHexagonSelector
                      selectedHexagon={currentSelectedHexagon()}
                      onHexagonSelect={handleHexagonSelect}
                      selectedGlyph={getSelectedGlyph()}
                      className="h-full"
                    />
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                     
                    </div>
                    <AnimatedHexagonSelector
                      selectedHexagon={null}
                      onHexagonSelect={() => {}} // No-op when no glyph selected
                      selectedGlyph={null}
                      className="h-full"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
       
        </div>

        {/* Bottom Interface */}
        <div className="terminal-angular-border m-4 sm:m-8 lg:m-16 p-3 sm:p-4 lg:p-6 mt-auto">
  <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
    
    {/* Translate Button */}
    <button 
      className={`terminal-text-xl font-bold h-16 sm:h-20 lg:h-24 w-40 sm:w-48 lg:w-56 rounded transition-all duration-300 text-center whitespace-nowrap ${
        hasUnlockedGlyphs
          ? 'terminal-button-primary'
          : 'terminal-button opacity-50 cursor-not-allowed'
      }`}
      onClick={handleTranslate}
      disabled={!hasUnlockedGlyphs}
    >
      TRANSLATE
    </button>

    {/* Interpret Button */}
    <button 
      className="terminal-text-xl font-bold terminal-button-secondary h-16 sm:h-20 lg:h-24 w-40 sm:w-48 lg:w-56 rounded transition-all duration-300 whitespace-nowrap"
      onClick={() => setShowInterpretation(true)}
    >
      INTERPRET
    </button>

    {/* Explore Button - Changed from NEXT to EXPLORE */}
    <button 
      className="terminal-text-xl font-bold terminal-button-secondary h-16 sm:h-20 lg:h-24 w-40 sm:w-48 lg:w-56 rounded transition-all duration-300 whitespace-nowrap"
      onClick={onNextTransmission}
    >
      EXPLORE
    </button>
    
  </div>
</div>

      </div>

    

      {/* Translation Modal */}
      {showTranslation && (
        <Modal onClose={() => setShowTranslation(false)}>
          <div className="bg-terminal-bg p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-terminal-text-primary text-2xl font-bold mb-4">
              Transmission Synchronized
            </h2>
            
            <div className="space-y-4 h-full">
              <div>
                <h3 className="text-terminal-accent-primary font-semibold mb-2">Translated Text:</h3>
                <p className="text-terminal-text-primary text-lg">{transmission.translation}</p>
              </div>
              
              {transmission.translatorNote && (
                <div>
                  <h3 className="text-terminal-accent-primary font-semibold mb-2">Translator Note:</h3>
                  <p className="text-terminal-text-secondary italic">{transmission.translatorNote}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-terminal-accent-primary font-semibold mb-2">Interpretation:</h3>
                <p className="text-terminal-text-secondary">{transmission.interpretation}</p>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  className="terminal-button-primary px-6 py-2 rounded"
                  onClick={() => setShowTranslation(false)}
                >
                  Close
                </button>
                {onNextTransmission && (
                  <button 
                    className="terminal-button-secondary px-6 py-2 rounded"
                    onClick={() => {
                      setShowTranslation(false);
                      onNextTransmission();
                    }}
                  >
                    Unlock Next Transmission
                  </button>
                )}
                {/* Debug info */}
                <div className="text-xs text-red-400">
                  onNextTransmission: {onNextTransmission ? 'exists' : 'missing'}
                </div>
              </div>
            </div>
            
        
          </div>
        </Modal>
      )}

      {/* Interpretation Modal */}
      {showInterpretation && (
        <Modal onClose={() => setShowInterpretation(false)}>
          <div className="bg-terminal-bg p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-terminal-text-primary text-2xl font-bold mb-4">
              Cultural Interpretation
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-terminal-accent-primary font-semibold mb-2">Context:</h3>
                <p className="text-terminal-text-secondary">{transmission.interpretation}</p>
              </div>
              
              <div>
                <h3 className="text-terminal-accent-primary font-semibold mb-2">Original Text:</h3>
                <p className="text-terminal-text-primary">{transmission.translation}</p>
              </div>
              
              {transmission.translatorNote && (
                <div>
                  <h3 className="text-terminal-accent-primary font-semibold mb-2">Linguistic Note:</h3>
                  <p className="text-terminal-text-secondary italic">{transmission.translatorNote}</p>
                </div>
              )}
            </div>
            
            <button 
              className="terminal-button-primary mt-6 px-6 py-2 rounded"
              onClick={() => setShowInterpretation(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
} 