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
            cx="18"
            cy="20"
            fill={isSelected ? "#F59E0C" : "#D9D9D9"}
            r="2"
          />
        </svg>
      );
    }
  };

  const getLabelPosition = () => {
    const baseClasses = "absolute font-['Roboto_Mono',_monospace] font-normal text-white text-[14px] text-nowrap tracking-[0.8px] whitespace-nowrap";
    
    // Calculate larger circular positions to avoid overlap with hexagons
    const { x, y } = config.position;
    const labelRadius = 60; // Distance from hexagon center to text
    
    // Calculate normalized direction vector
    const magnitude = Math.sqrt(x * x + y * y);
    const normalizedX = magnitude > 0 ? x / magnitude : 0;
    const normalizedY = magnitude > 0 ? y / magnitude : 0;
    
    // Position text further out in the same direction
    const labelX = normalizedX * labelRadius;
    const labelY = normalizedY * labelRadius;
    
    return `${baseClasses} -translate-x-1/2 -translate-y-1/2 text-center`;
  };
  
  const getLabelStyle = () => {
    const { x, y } = config.position;
    
    // Parametric label positioning - clean, symmetric, and reproducible
    const CENTER = { left: 24, top: 33.5 };
    const RADIUS = 53; // push/pull all labels uniformly

    const angles = {
      top: -90, 'top-right': -30, 'bottom-right': 30,
      bottom: 90, 'bottom-left': 150, 'top-left': -150
    };

    const labelPositions = Object.fromEntries(
      Object.entries(angles).map(([k, deg]) => {
        const rad = (deg * Math.PI) / 180;
        return [k, {
          left: +(CENTER.left + RADIUS * Math.cos(rad)).toFixed(1),
          top:  +(CENTER.top  + RADIUS * Math.sin(rad)).toFixed(1),
        }];
      })
    );
    
    // Determine position based on coordinates
    let position = 'top';
    if (x === -24 && y === -114) position = 'top';
    else if (x === 54 && y === -69) position = 'top-right';
    else if (x === 54 && y === 21) position = 'bottom-right';
    else if (x === -24 && y === 66) position = 'bottom';
    else if (x === -102 && y === 21) position = 'bottom-left';
    else if (x === -102 && y === -69) position = 'top-left';
    
    const labelPos = labelPositions[position] || labelPositions['top'];
    
    return {
      left: `${labelPos.left}px`,
      top: `${labelPos.top}px`
    };
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
      style={
        config.position.x === 0 && config.position.y === 0 ? 
        {
          left: 'calc(50% - 25px)',
          top: 'calc(50% - 22px)',
          transform: 'none'
        } : 
        {
          left: `calc(50% + ${config.position.x}px)`,
          top: `calc(50% + ${config.position.y}px)`,
          transform: 'translate(-50%, -50%)'
        }
      }
      initial={{ opacity: 0, ...getAnimationDirection() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
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
          style={getLabelStyle()}
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
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-full h-full min-w-[300px] min-h-[300px]">
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
      </div>
    </motion.div>
  );
} 