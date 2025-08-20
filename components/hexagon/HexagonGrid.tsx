import React from 'react';

export interface HexagonConfig {
  id: string;
  label: string;
  type: 'filled' | 'outline';
  position: {
    x: number; // percentage from center
    y: number; // percentage from center
  };
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
}

interface HexagonGridProps {
  hexagons: HexagonConfig[];
  selectedHexagon: string | null;
  onHexagonSelect: (id: string) => void;
  centerElement?: React.ReactNode;
  className?: string;
}

function Hexagon({ 
  config, 
  isSelected, 
  onClick 
}: { 
  config: HexagonConfig; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const renderHexagonShape = () => {
    if (config.type === 'filled') {
      return (
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 40 40"
          width="34.64"
          height="40"
        >
          <path
            d="M20 2L36 12V28L20 38L4 28V12L20 2Z"
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
          viewBox="0 0 40 40"
          width="34.64"
          height="40"
        >
          <path
            d="M20 2L36 12V28L20 38L4 28V12L20 2Z"
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
    const baseClasses = "absolute font-['Roboto_Mono',_monospace] font-normal text-white text-[14px] text-nowrap tracking-[0.8px] whitespace-nowrap";
    
    switch (config.labelPosition) {
      case 'left':
        return `${baseClasses} right-full pr-6 top-1/2 -translate-y-1/2 text-right`;
      case 'right':
        return `${baseClasses} left-full pl-6 top-1/2 -translate-y-1/2 text-left`;
      case 'top':
        return `${baseClasses} bottom-full pb-4 left-1/2 -translate-x-1/2 text-center`;
      case 'bottom':
        return `${baseClasses} top-full pt-4 left-1/2 -translate-x-1/2 text-center`;
      default:
        return `${baseClasses} left-full pl-6 top-1/2 -translate-y-1/2 text-left`;
    }
  };

  return (
    <div 
      className="absolute"
      style={{
        left: `calc(50% + ${config.position.x}px)`,
        top: `calc(50% + ${config.position.y}px)`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative">
        <button
          onClick={onClick}
          className="relative w-10 h-10 transition-all duration-200 hover:scale-105"
          style={{ 
            filter: isSelected ? 'drop-shadow(0 0 8px rgba(245, 158, 12, 0.6))' : 'none'
          }}
        >
          {renderHexagonShape()}
        </button>
        <div className={getLabelPosition()}>
          {config.label}
        </div>
      </div>
    </div>
  );
}

export function HexagonGrid({ 
  hexagons, 
  selectedHexagon, 
  onHexagonSelect, 
  centerElement,
  className = ""
}: HexagonGridProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Center element */}
      {centerElement && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {centerElement}
        </div>
      )}
      
      {/* Hexagon selectors */}
      {hexagons.map((hexagon) => (
        <Hexagon
          key={hexagon.id}
          config={hexagon}
          isSelected={selectedHexagon === hexagon.id}
          onClick={() => onHexagonSelect(hexagon.id)}
        />
      ))}
    </div>
  );
} 