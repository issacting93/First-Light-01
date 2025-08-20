import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedHexagonGrid } from './AnimatedHexagonGrid';
import { AnimatedCenterHexagon } from './AnimatedCenterHexagon';
import { collapsedHexagons, createDynamicHexagons } from './HexagonAnimations';
import { HexagonConfig } from './HexagonGrid';
import { type Glyph } from '../../src/services/dataService';


interface AnimatedHexagonSelectorProps {
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  selectedGlyph?: Glyph | null;
  className?: string;
}

function CollapsedState({ 
  selectedHexagon, 
  onHexagonSelect,
  selectedGlyph 
}: { 
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  selectedGlyph?: Glyph | null;
}) {
  return (
    <motion.div
      key="collapsed"
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatedHexagonGrid
        hexagons={collapsedHexagons}
        selectedHexagon={selectedHexagon}
        onHexagonSelect={onHexagonSelect}
        isExpanded={false}
        centerElement={
          <AnimatedCenterHexagon 
            selectedGlyph={selectedGlyph}
            isExpanded={false}
          />
        }
      />
    </motion.div>
  );
}

function ExpandedState({ 
  selectedHexagon, 
  onHexagonSelect,
  selectedGlyph,
  hexagons
}: { 
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  selectedGlyph?: Glyph | null;
  hexagons: HexagonConfig[];
}) {
  return (
    <motion.div
      key="expanded"
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatedHexagonGrid
        hexagons={hexagons}
        selectedHexagon={selectedHexagon}
        onHexagonSelect={onHexagonSelect}
        isExpanded={true}
        centerElement={
          <AnimatedCenterHexagon 
            selectedGlyph={selectedGlyph}
            isExpanded={true}
          />
        }
      />
    </motion.div>
  );
}

export function AnimatedHexagonSelector({ 
  selectedHexagon, 
  onHexagonSelect, 
  selectedGlyph,
  className = ""
}: AnimatedHexagonSelectorProps) {
  // Determine if we should show expanded state
  const isExpanded = !!selectedGlyph;
  
  // Use expanded hexagons when glyph is selected, collapsed when not
  // Pass empty array for meanings since we only need the correct answer from confirmedMeaning
  const hexagons = isExpanded 
    ? createDynamicHexagons([], selectedGlyph?.confirmedMeaning) 
    : collapsedHexagons;

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <ExpandedState 
            selectedHexagon={selectedHexagon}
            onHexagonSelect={onHexagonSelect}
            selectedGlyph={selectedGlyph}
            hexagons={hexagons}
          />
        ) : (
          <CollapsedState 
            selectedHexagon={selectedHexagon}
            onHexagonSelect={onHexagonSelect}
            selectedGlyph={selectedGlyph}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 