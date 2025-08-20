import { motion } from 'framer-motion';
import { type Glyph } from '../../src/services/dataService';

interface AnimatedCenterHexagonProps {
  selectedGlyph?: Glyph | null;
  isExpanded: boolean;
}

export function AnimatedCenterHexagon({ selectedGlyph, isExpanded }: AnimatedCenterHexagonProps) {
  return (
    <motion.div 
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      {/* Large hexagon outline */}
      <div className="h-[90px] w-[90px] relative">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 78 90"
        >
          <path
            d="M39 3L75 24V66L39 87L3 66V24L39 3Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Center glyph or default "e" character */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: isExpanded ? 0.1 : 0 }}
      >
        {selectedGlyph ? (
          <div 
            className={`relative ${selectedGlyph.isRotated ? `rotate-[${selectedGlyph.rotationDegrees}deg]` : ''}`}
            style={{
              height: '40px',
              width: 'auto'
            }}
          >
            {selectedGlyph.svgPath ? (
              <svg className="block h-full w-auto" fill="none" preserveAspectRatio="xMidYMid meet" viewBox={selectedGlyph.svgViewBox}>
                <path d={selectedGlyph.svgPath} fill="white" />
              </svg>
            ) : (
              <div className="text-white font-mono text-2xl text-center" style={{ letterSpacing: 'var(--terminal-letter-spacing-widest)' }}>
                {selectedGlyph.symbol}
              </div>
            )}
          </div>
        ) : (
          <div className="text-white font-mono text-2xl text-center opacity-50" style={{ letterSpacing: 'var(--terminal-letter-spacing-widest)' }}>
            ⬡
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 