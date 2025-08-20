import React, { useEffect, useRef } from 'react';
import { NarrativeTransmission } from './NarrativeTransmission';
import type { Glyph, Transmission, NarrativeTransmission as NarrativeTransmissionType } from '../../src/services/dataService';
import dataService from '../../src/services/dataService';

interface TransmissionRendererProps {
  currentTransmission: (Transmission | NarrativeTransmissionType) | null;
  gameState: {
    lexicon: Map<string, Glyph>;
    translationState: Record<string, string>;
    selectedGlyph: string | null;
    persistentGlyphSelections?: Set<string>;
  };
  onGlyphClick: (glyphId: string) => void;
  onHexagonSelect?: (hexagonId: string) => void;
  onTransmissionComplete?: (transmission: any, accuracy: number) => void;
  onAssignMeaning?: (glyphId: string, meaning: string) => void;
  onNextTransmission?: () => void;
}

export const TransmissionRenderer: React.FC<TransmissionRendererProps> = ({
  currentTransmission,
  gameState,
  onGlyphClick,
  onTransmissionComplete,
  onAssignMeaning,
  onNextTransmission
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Check if it's a narrative transmission (has alienText) or a converted transmission (has glyphs)
  const isNarrativeTransmission = currentTransmission && 'alienText' in currentTransmission;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [currentTransmission]);

  // Debug: Check glyph unlocking status
  useEffect(() => {
    if (currentTransmission) {
      dataService.debugGlyphUnlocking();
    }
  }, [currentTransmission]);

  // If it's a narrative transmission, use the integrated component
  if (isNarrativeTransmission) {
    return (
      <NarrativeTransmission
        transmission={currentTransmission as NarrativeTransmissionType}
        gameState={gameState}
        onGlyphClick={onGlyphClick}
        onTransmissionComplete={onTransmissionComplete}
        onAssignMeaning={onAssignMeaning}
        onNextTransmission={onNextTransmission}
      />
    );
  }

  // Handle glyph click with unlocking logic - only for unlocked glyphs
  const handleGlyphClick = (glyphId: string) => {
    const isUnlocked = dataService.isGlyphUnlocked(glyphId);
    
    // Only allow clicking on unlocked glyphs
    if (!isUnlocked) {
      return; // Prevent clicking on locked glyphs
    }
    
    // Call the original onGlyphClick handler only for unlocked glyphs
    onGlyphClick(glyphId);
  };

  // Render legacy transmission text (including converted narrative transmissions)
  const renderTransmissionText = () => {
    const transmission = currentTransmission as Transmission;
    if (!transmission) {
      return null;
    }

    if (!transmission.glyphs || transmission.glyphs.length === 0) {
      return <div className="text-[#ffffff] font-['Roboto_Mono:Regular',_sans-serif] text-[16px] tracking-[0.8px]">No glyphs available</div>;
    }

    return transmission.glyphs.map((glyphId, index) => {
      const glyph = gameState.lexicon.get(glyphId);
      if (!glyph) {
        console.warn(`Glyph not found: ${glyphId}`);
        return null;
      }

      const isUnlocked = dataService.isGlyphUnlocked(glyphId);
      const translatedMeaning = gameState.translationState[glyphId];
      const isTranslated = !!translatedMeaning;
      const isPersistentlySelected = gameState.persistentGlyphSelections?.has(glyphId);

      // Determine glyph color and styling based on unlock state and selection
      const glyphColor = isUnlocked ? '#ffffff' : '#ff4e42';
      const isSelected = gameState.selectedGlyph === glyphId;
      
      // Border logic based on three states
      const borderColor = (() => {
        if (isSelected) return 'border-white';
        if (!isUnlocked) return 'border-[#ff4e42]';
        return 'border-white'; // Use white border class, control opacity with inline style
      })();
      
      // Border opacity logic
      const borderOpacity = (() => {
        if (isSelected) return '1'; // Full opacity for selected
        if (!isUnlocked) return '1'; // Full opacity for locked (red)
        return '0.2'; // 20% opacity for unselected unlocked
      })();
      
      const ringClass = isSelected ? 'ring-2 ring-white' : '';
      const bgColor = isUnlocked ? 'bg-[rgba(22,22,22,0.4)]' : 'bg-[rgba(255,78,66,0.1)]';
      
      // Determine cursor and click behavior based on unlock state
      const cursorClass = isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed';
      const opacityClass = isUnlocked ? 'hover:opacity-70' : 'opacity-60';
      
      // Add selection indicator
      const selectionClass = isPersistentlySelected ? 'ring-2 ring-[#ffffff]' : '';

      if (isTranslated) {
        return (
          <span 
            key={index}
            className={`${cursorClass} ${opacityClass} ${selectionClass} transition-all duration-300 inline-flex items-center px-3 py-2 rounded-lg mx-2 border ${ringClass} ${bgColor}`}
            style={{
              borderColor: borderColor === 'border-white' 
                ? (borderOpacity === '0.2' ? 'rgba(255,255,255,0.2)' : '#ffffff')
                : '#ff4e42'
            }}
            onClick={() => handleGlyphClick(glyphId)}
          >
            {glyph.svgPath ? (
              <div 
                className={`relative ${glyph.isRotated ? `rotate-[${glyph.rotationDegrees}deg]` : ''}`}
                style={{
                  height: '48px',
                  width: 'auto',
                  padding: '8px'
                }}
              >
                <svg className="block h-full w-auto" fill="none" preserveAspectRatio="xMidYMid meet" viewBox={glyph.svgViewBox}>
                  <path d={glyph.svgPath} fill={glyphColor} />
                </svg>
              </div>
            ) : (
              <span className="font-['Roboto_Mono:Regular',_sans-serif] text-[16px] font-bold tracking-[0.8px]" style={{ color: glyphColor }}>
                {glyph.symbol}
              </span>
            )}
            <span className="font-['Roboto_Mono:Regular',_sans-serif] text-[14px] ml-2 tracking-[0.6px]" style={{ color: `${glyphColor}80` }}>
              ({translatedMeaning})
            </span>
          </span>
        );
      } else {
        return (
          <span 
            key={index}
            className={`max-w-10 ${cursorClass} ${opacityClass} ${selectionClass} transition-all duration-300 inline-flex items-center px-3 py-2 rounded-lg mx-2 border ${ringClass} ${bgColor}`}
            style={{
              borderColor: borderColor === 'border-white' 
                ? (borderOpacity === '0.2' ? 'rgba(255,255,255,0.2)' : '#ffffff')
                : '#ff4e42'
            }}
            onClick={() => handleGlyphClick(glyphId)}
          >
            {glyph.svgPath ? (
              <div 
                className={`relative ${glyph.isRotated ? `rotate-[${glyph.rotationDegrees}deg]` : ''}`}
                style={{
                  height: '22px',
                  width: 'auto'
                }}
              >
                <svg className="block h-full w-auto" fill="none" preserveAspectRatio="xMidYMid meet" viewBox={glyph.svgViewBox}>
                  <path d={glyph.svgPath} fill={glyphColor} />
                </svg>
              </div>
            ) : (
              <span className="font-['Roboto_Mono:Regular',_sans-serif] text-[16px] font-bold tracking-[0.8px]" style={{ color: glyphColor }}>
                {glyph.symbol}
              </span>
            )}
            {!isUnlocked && (
              <span className="text-xs ml-1" style={{ color: '#ff4e42' }}>
              
              </span>
            )}
          </span>
        );
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-6 p-6 w-full justify-center items-center">

        {/* Transmission Content */}
        <div 
          ref={contentRef}
            className="flex flex-col gap-3 w-full max-h-[300px] max-w-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(246,15,15,0.3)]"
        >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {renderTransmissionText()}
            </div>
          </div>
        </div>
      </div>
  </div>
  );
}; 