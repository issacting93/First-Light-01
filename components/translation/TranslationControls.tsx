import React from 'react';
import type { Glyph, Transmission, NarrativeTransmission } from '../../src/services/dataService';
import dataService from '../../src/services/dataService';

interface TranslationControlsProps {
  currentTransmission: (Transmission | NarrativeTransmission) | null;
  gameState: {
    lexicon: Map<string, Glyph>;
    translationState: Record<string, string>;
    selectedGlyph: string | null;
    chapter: number;
    lastTransmissionAccuracy: number | null;
  };
  onNextTransmission: () => void;
}

export const TranslationControls: React.FC<TranslationControlsProps> = ({
  currentTransmission,
  gameState,
  onNextTransmission
}) => {
  const isNarrativeTransmission = currentTransmission && 'alienText' in currentTransmission;

  // Get translation progress
  const getTranslationProgress = (): { unlocked: number; translated: number; total: number } => {
    if (isNarrativeTransmission) {
      const narrativeTransmission = currentTransmission as NarrativeTransmission;
      const unlockedGlyphItems = narrativeTransmission.alienText.filter(item => 
        item.type === 'glyph' && 
        item.glyph && 
        dataService.isGlyphUnlocked(item.glyph)
      );
      const translatedGlyphs = unlockedGlyphItems.filter(item => 
        gameState.translationState[item.glyph!]
      );
      return {
        unlocked: unlockedGlyphItems.length,
        translated: translatedGlyphs.length,
        total: narrativeTransmission.alienText.filter(item => item.type === 'glyph').length
      };
    } else if (currentTransmission && !('alienText' in currentTransmission)) {
      const unlockedGlyphs = currentTransmission.glyphs?.filter(g => dataService.isGlyphUnlocked(g)) || [];
      const translatedGlyphs = unlockedGlyphs.filter(g => gameState.translationState[g]);
      return {
        unlocked: unlockedGlyphs.length,
        translated: translatedGlyphs.length,
        total: currentTransmission.glyphs?.length || 0
      };
    }
    return { unlocked: 0, translated: 0, total: 0 };
  };

  const progress = getTranslationProgress();
  const hasUnlockedGlyphs = progress.unlocked > 0;

  return (
    <>
      {/* Bottom Interface */}
  
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4"
        style={{
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     flexDirection: 'column',
     gap: '10px', 
      }}>
        
          {/* Action Buttons */}
          <div className="flex flex-row gap-3 items-center">
            {hasUnlockedGlyphs ? (
              <>
               
                <button
                  onClick={onNextTransmission}
                  className="px-6 py-2 rounded font-bold tracking-wide uppercase transition-all duration-200"
                  style={{
                    background: 'rgba(255, 78, 66, 0.1)',
                    color: '#ff4e42',
                    border: '2px solid rgba(255, 78, 66, 0.3)',
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    fontFamily: '"TheGoodMonolith", monospace',
                    cursor: 'pointer'
                  }}
                >
                SYNCRONIZE
                </button>
              </>
            ) : (
              <div className="text-sm tracking-wide uppercase" style={{
                color: '#c2b8b2',
                fontFamily: '"TheGoodMonolith", monospace',
                letterSpacing: '0.5px'
              }}>
                Reading More Transmissions Unlocks More Glyphs
              </div>
            )}
          </div>
        </div> 
    </>
  );
}; 