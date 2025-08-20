import React from 'react';
import { motion } from 'framer-motion';
import { HexagonConfig } from './HexagonGrid';

interface AnimatedHexagonGridProps {
  hexagons: HexagonConfig[];
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  centerElement?: React.ReactNode;
  className?: string;
  isExpanded: boolean;
}

function AnimatedHexagon({ 
  config, 
  isSelected, 
  onClick,
  animationDelay = 0
}: { 
  config: HexagonConfig; 
  isSelected: boolean; 
  onClick: () => void;
  animationDelay?: number;
}) {
  const renderHexagonShape = () => {
    if (config.type === 'filled') {
      return (
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 36 40"
          width="36 "
          height="40"
        >
          <path
            d="M35.3203 10V30L18 40L0.679688 30V10L18 0L35.3203 10ZM1.67969 10.5771V29.4219L18 38.8447L34.3203 29.4219V10.5771L18 1.1543L1.67969 10.5771Z"
            fill={isSelected ? "#F59E0C" : "#F59E0C"}
            stroke="white"
            strokeWidth={isSelected ? "2" : "1"}
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 36 40"
          width="36"
          height="40"
        > 
        
          <path
            d="M35.3203 10V30L18 40L0.679688 30V10L18 0L35.3203 10ZM1.67969 10.5771V29.4219L18 38.8447L34.3203 29.4219V10.5771L18 1.1543L1.67969 10.5771Z"
            stroke="white"
            strokeWidth={isSelected ? "2" : "1"}
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            fill={isSelected ? "#F59E0C" : "#D9D9D9"}
            r="2"
          />
        </svg>
      );
    }
  };

  const getLabelPosition = () => {
    const baseClasses = "absolute font-['Roboto_Mono:Regular',_sans-serif] font-normal text-white text-[16px] text-nowrap tracking-[0.8px] whitespace-pre";
    
    switch (config.labelPosition) {
      case 'left':
        return `${baseClasses} right-full mr-2 top-1/2 -translate-y-1/2 text-right`;
      case 'right':
        return `${baseClasses} left-full ml-2 top-1/2 -translate-y-1/2 text-left`;
      case 'top':
        return `${baseClasses} bottom-full mb-2 left-1/2 -translate-x-1/2 text-center`;
      case 'bottom':
        return `${baseClasses} top-full mt-2 left-1/2 -translate-x-1/2 text-center`;
      default:
        return `${baseClasses} left-full ml-2 top-1/2 -translate-y-1/2 text-left`;
    }
  };

  const getAnimationDirection = () => {
    const { x, y } = config.position;
    // Determine animation direction based on position
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? { x: -50 } : { x: 50 };
    } else {
      return y > 0 ? { y: -30 } : { y: 30 };
    }
  };

  return (
    <motion.div 
      className="absolute"
      style={{
        left: `calc(50% + ${config.position.x}px)`,
        top: `calc(50% + ${config.position.y}px)`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ opacity: 0, ...getAnimationDirection() }}
      animate={{ opacity: 1, x: -17.32, y:-20 }}
      exit={{ opacity: 0, ...getAnimationDirection() }}
      transition={{ duration: 0.4, delay: animationDelay }}
    >
      <div className="relative">
        <motion.button
          onClick={onClick}
          className="relative w-10 h-10 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            filter: isSelected ? 'drop-shadow(0 0 8px rgba(245, 158, 12, 0.6))' : 'none'
          }}
        >
          {renderHexagonShape()}
        </motion.button>
        <motion.div 
          className={getLabelPosition()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: animationDelay + 0.1 }}
        >
          {config.label}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function AnimatedHexagonGrid({ 
  hexagons, 
  selectedHexagon, 
  onHexagonSelect, 
  centerElement,
  className = ""
}: AnimatedHexagonGridProps) {
  return (
    <motion.div 
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Center element */}
      {centerElement && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {centerElement}
        </div>
      )}
      
      {/* Hexagon selectors */}
      {hexagons.map((hexagon, index) => (
        <AnimatedHexagon
          key={hexagon.id}
          config={hexagon}
          isSelected={selectedHexagon === hexagon.id}
          onClick={() => onHexagonSelect(hexagon.id)}
          animationDelay={0.1 + (index * 0.1)}
        />
      ))}
    </motion.div>
  );
} 