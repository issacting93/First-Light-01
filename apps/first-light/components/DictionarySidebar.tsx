import { useState } from 'react';
import dataService from '../src/services/dataService';

export function DictionarySidebar() {
  const [isOpen] = useState(true);
  const [search] = useState('');

  // Get all glyphs, not just unlocked ones
  const allGlyphs = Array.from(dataService.getGlyphs().values());
  const unlockedGlyphs = dataService.getUnlockedGlyphs();
  const unlockedGlyphIds = new Set(unlockedGlyphs.map(g => g.id));

  const symbols = allGlyphs.map(glyph => ({
    id: glyph.id,
    symbol: glyph.symbol,
    svgPath: glyph.svgPath,
    svgViewBox: glyph.svgViewBox,
    rotation: glyph.rotationDegrees || 0,
    confirmedMeaning: glyph.confirmedMeaning || null,
    possibleMeanings: glyph.possibleMeanings,
    firstSeen: glyph.firstSeenInTransmission,
    isUnlocked: unlockedGlyphIds.has(glyph.id)
  }));

  const filtered = symbols.filter(sym => {
    const term = search.toLowerCase();
    return (
      sym.id.toLowerCase().includes(term) ||
      sym.symbol.toLowerCase().includes(term) ||
      (sym.isUnlocked && sym.confirmedMeaning?.toLowerCase().includes(term)) ||
      (sym.isUnlocked && sym.possibleMeanings.some(w => w.toLowerCase().includes(term)))
    );
  }).sort((a, b) => {
    // Sort by unlocked status first (unlocked first)
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;
    
    // If both have same unlock status, sort by ID for consistency
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="w-80 h-full m-4 flex flex-col overflow-hidden pt-4">
      {/* Content */}
      {isOpen && (
        <>
          {/* Glyph List */}
          <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-3">
            {filtered.length > 0 ? (
              filtered.map(sym => (
                  <div 
                  key={sym.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    sym.isUnlocked 
                      ? 'border-[rgba(255,78,66,0.3)] bg-[rgba(22,22,22,0.2)]' 
                      : 'border-[rgba(255,78,66,0.1)] bg-[rgba(22,22,22,0.1)] opacity-60'
                  }`}
                  >
                  {/* Glyph and Words Layout */}
                  <div className="flex items-start justify-between">
                    {/* Glyph Display */}
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                      {sym.svgPath ? (
                        <div 
                          className={`w-6 h-6 ${!sym.isUnlocked ? 'opacity-50' : ''}`}
                          style={{ transform: `rotate(${sym.rotation}deg)` }}
                      >
                          <svg
                            viewBox={sym.svgViewBox || "0 0 22 22"}
                            fill="none"
                            className="w-full h-full"
                          >
                          <path 
                              d={sym.svgPath}
                              fill={sym.isUnlocked ? "#ffffff" : "#666666"}
                          />
                        </svg>
                        </div>
                      ) : (
                        <div className={`w-6 h-6 flex items-center justify-center font-bold text-sm ${
                          sym.isUnlocked ? 'text-white' : 'text-gray-500'
                        }`}>
                          {sym.symbol}
                        </div>
                      )}
                      </div>
                      
                    {/* Words List */}
                    <div className="flex-1 ml-4 text-right">
                      {sym.isUnlocked ? (
                        <ul className="list-none space-y-1">
                          {(sym.confirmedMeaning
                            ? [sym.confirmedMeaning, ...sym.possibleMeanings.filter(w => w !== sym.confirmedMeaning)]
                            : sym.possibleMeanings
                          ).map((word, i) => (
                            <li key={i} className="text-[#f3ede9] text-xs tracking-wide whitespace-nowrap" style={{ fontFamily: '"TheGoodMonolith", monospace' }}>
                              {word}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500 text-xs tracking-wide italic" style={{ fontFamily: '"TheGoodMonolith", monospace' }}>
                          <div className="text-gray-400">???</div>
                          <div className="text-gray-600 text-[10px] mt-1">LOCKED</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* First Seen Info (only for unlocked glyphs) */}
                  {sym.isUnlocked && sym.firstSeen && (
                    <div className="mt-2 pt-2 border-t border-[rgba(255,78,66,0.1)]">
                      <div className="text-[#ff4e42] text-[10px] tracking-widest uppercase" style={{ fontFamily: '"TheGoodMonolith", monospace' }}>
                        First seen in transmission {sym.firstSeen}
                      </div>
                    </div>
                  )}
                </div>
              ))
              ) : (
              <div className="text-center py-8 text-[#ff4e42] text-sm tracking-widest" style={{ fontFamily: '"TheGoodMonolith", monospace' }}>
                {search ? `No symbols match "${search}"` : 'No symbols available'}
                </div>
              )}
          </div>

          {/* Footer with stats */}
          <div className="px-4 pb-4 border-t border-[rgba(255,78,66,0.1)] pt-3">
            <div className="flex justify-between items-center text-xs text-[#ff4e42] tracking-widest" style={{ fontFamily: '"TheGoodMonolith", monospace' }}>
              <span>UNLOCKED: {unlockedGlyphs.length}</span>
              <span>TOTAL: {allGlyphs.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 