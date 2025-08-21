import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedHexagonGrid } from './AnimatedHexagonGrid';
import { AnimatedCenterHexagon } from './AnimatedCenterHexagon';
import { collapsedHexagons, createDynamicHexagons } from './HexagonAnimations';
import { HexagonConfig } from './HexagonGrid';
import { type Glyph } from "@/services/dataService";


interface AnimatedHexagonSelectorProps {
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  selectedGlyph?: Glyph | null;
  className?: string;
  isTransmissionSynchronized?: boolean;
  correctAnswerId?: string;
}

function CollapsedState({ 
  selectedHexagon, 
  onHexagonSelect,
  selectedGlyph,
  isTransmissionSynchronized = false,
  correctAnswerId = ""
}: { 
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  selectedGlyph?: Glyph | null;
  isTransmissionSynchronized?: boolean;
  correctAnswerId?: string;
}) {
  return (
    <motion.div
      key="collapsed"
      className="w-full h-full flex items-center justify-center"
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
        isTransmissionSynchronized={isTransmissionSynchronized}
        correctAnswerId={correctAnswerId}
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
  hexagons,
  isTransmissionSynchronized = false,
  correctAnswerId = ""
}: { 
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  selectedGlyph?: Glyph | null;
  hexagons: HexagonConfig[];
  isTransmissionSynchronized?: boolean;
  correctAnswerId?: string;
}) {
  return (
    <motion.div
      key="expanded"
      className="w-full h-full flex items-center justify-center"
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
        isTransmissionSynchronized={isTransmissionSynchronized}
        correctAnswerId={correctAnswerId}
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
  className = "",
  isTransmissionSynchronized = false,
  correctAnswerId = ""
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
            isTransmissionSynchronized={isTransmissionSynchronized}
            correctAnswerId={correctAnswerId}
          />
        ) : (
          <CollapsedState 
            selectedHexagon={selectedHexagon}
            onHexagonSelect={onHexagonSelect}
            selectedGlyph={selectedGlyph}
            isTransmissionSynchronized={isTransmissionSynchronized}
            correctAnswerId={correctAnswerId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
