import { type Glyph } from '../../src/services/dataService';

interface GlyphDisplayProps {
  glyph: Glyph;
  isClickable?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isTranslated?: boolean;
}

export function GlyphDisplay({ glyph, isClickable = false, onClick, isSelected = false, isTranslated = false }: GlyphDisplayProps) {
  const getStateClasses = () => {
    if (isSelected) return "terminal-glyph-selected";
    if (isTranslated) return "terminal-glyph-translated";
    return "terminal-glyph-untranslated";
  };
  
  return (
    <div 
      className={`h-20 sm:h-24 lg:h-[110.796px] relative shrink-0 min-w-[80px] sm:min-w-[90px] lg:min-w-[100px] cursor-pointer transition-all duration-300 ${getStateClasses()}`} 
      onClick={isClickable ? onClick : undefined}
    >
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {glyph.svgPath ? (
          <div 
            className={`relative ${glyph.isRotated ? `rotate-[${glyph.rotationDegrees}deg]` : ''}`}
            style={{
              height: '18px',
              width: 'auto'
            }}
          >
            <svg className="block h-full w-auto" fill="none" preserveAspectRatio="xMidYMid meet" viewBox={glyph.svgViewBox}>
              <path d={glyph.svgPath} fill="currentColor" />
            </svg>
          </div>
        ) : (
          <div className="terminal-text-xl text-terminal-text-primary text-center text-nowrap" style={{ letterSpacing: 'var(--terminal-letter-spacing-widest)' }}>
            {glyph.symbol}
          </div>
        )}
      </div>
    </div>
  );
} 