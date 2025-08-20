import { useState } from 'react';
import { Modal } from './Modal';
import { GlyphDisplay } from '../ui';
import { type Glyph } from '../../src/services/dataService';

interface GlyphAnalysisModalProps {
  glyph: Glyph;
  onAssignMeaning: (meaning: string) => void;
  onClose: () => void;
}

export function GlyphAnalysisModal({ glyph, onAssignMeaning, onClose }: GlyphAnalysisModalProps) {
  const [selectedMeaning, setSelectedMeaning] = useState<string>('');

  const handleAssignMeaning = () => {
    if (selectedMeaning.trim()) {
      onAssignMeaning(selectedMeaning.trim());
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} maxWidth="600px">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wide uppercase" style={{
            color: '#ff4e42',
            fontFamily: '"TheGoodMonolith", monospace'
          }}>
            GLYPH ANALYSIS
          </h2>
          <button
            onClick={onClose}
            className="text-sm transition-colors hover:text-red-300" style={{
              color: '#ff4e42',
              fontFamily: '"TheGoodMonolith", monospace'
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Glyph Display */}
        <div className="flex justify-center mb-6">
          <GlyphDisplay glyph={glyph} isClickable={false} />
        </div>

        {/* Glyph Information */}
        <div className="mb-6 p-4 rounded" style={{
          background: 'rgba(30, 26, 24, 0.7)',
          border: '1px solid rgba(255, 78, 66, 0.3)',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="mb-4">
            <div className="text-sm font-bold tracking-wide uppercase mb-2" style={{
              color: '#ff4e42',
              fontFamily: '"TheGoodMonolith", monospace',
              letterSpacing: '0.5px'
            }}>
              GLYPH ID: {glyph.id}
            </div>
            <div className="text-sm tracking-wide uppercase" style={{
              color: '#c2b8b2',
              fontFamily: '"TheGoodMonolith", monospace',
              letterSpacing: '0.5px'
            }}>
              SYMBOL: {glyph.symbol}
            </div>
          </div>

          {/* Possible Meanings */}
          <div className="mb-4">
            <div className="text-sm font-bold tracking-wide uppercase mb-2" style={{
              color: '#ff4e42',
              fontFamily: '"TheGoodMonolith", monospace',
              letterSpacing: '0.5px'
            }}>
              POSSIBLE MEANINGS:
            </div>
            <div className="flex flex-wrap gap-2">
              {glyph.possibleMeanings.map((meaning, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMeaning(meaning)}
                  className="px-3 py-1 rounded text-xs font-bold tracking-wide uppercase transition-all duration-200"
                  style={{
                    background: selectedMeaning === meaning ? '#ff4e42' : 'rgba(255, 78, 66, 0.1)',
                    color: selectedMeaning === meaning ? '#080C10' : '#ff4e42',
                    border: '1px solid rgba(255, 78, 66, 0.3)',
                    fontFamily: '"TheGoodMonolith", monospace',
                    letterSpacing: '0.5px',
                    cursor: 'pointer'
                  }}
                >
                  {meaning}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div className="text-sm tracking-wide uppercase" style={{
            color: '#c2b8b2',
            fontFamily: '"TheGoodMonolith", monospace',
            letterSpacing: '0.5px'
          }}>
            CONFIDENCE: {(glyph.confidence * 100).toFixed(0)}%
          </div>
        </div>

        {/* Meaning Input */}
        <div className="mb-6">
          <div className="text-sm font-bold tracking-wide uppercase mb-2" style={{
            color: '#ff4e42',
            fontFamily: '"TheGoodMonolith", monospace',
            letterSpacing: '0.5px'
          }}>
            ASSIGN MEANING:
          </div>
          <input
            type="text"
            value={selectedMeaning}
            onChange={(e) => setSelectedMeaning(e.target.value)}
            placeholder="Enter meaning..."
            className="w-full px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-red-400/30"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 78, 66, 0.3)',
              color: '#f3ede9',
              fontFamily: '"TheGoodMonolith", monospace',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
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
            CANCEL
          </button>
          <button
            onClick={handleAssignMeaning}
            disabled={!selectedMeaning.trim()}
            className="px-6 py-2 rounded font-bold tracking-wide uppercase transition-all duration-200"
            style={{
              background: selectedMeaning.trim() ? '#ff4e42' : 'rgba(255, 78, 66, 0.3)',
              color: selectedMeaning.trim() ? '#080C10' : '#c2b8b2',
              border: '2px solid #ff4e42',
              fontSize: '0.9rem',
              letterSpacing: '2px',
              boxShadow: selectedMeaning.trim() ? '0 0 15px rgba(255, 78, 66, 0.3)' : 'none',
              fontFamily: '"TheGoodMonolith", monospace',
              cursor: selectedMeaning.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            ASSIGN
          </button>
        </div>
      </div>
    </Modal>
  );
} 