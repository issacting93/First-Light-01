import { type Glyph } from "@/services/dataService";

interface CenterHexagonProps {
  selectedGlyph?: Glyph | null;
}

export function CenterHexagon({ selectedGlyph }: CenterHexagonProps) {
  return (
    <div className="relative">
      {/* Large hexagon outline */}
      <div className=" h-[90px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 90 90"
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
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {selectedGlyph && (
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
)}
      </div>
    </div>
  );
} 