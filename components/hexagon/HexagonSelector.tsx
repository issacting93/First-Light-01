import { useState } from 'react';
import svgPaths from "../../src/svg-paths.ts";

interface SelectorOption {
  id: string;
  label: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

interface HexagonSelectorProps {
  options?: SelectorOption[];
  onSelectionChange?: (selectedId: string) => void;
  defaultSelected?: string;
}

// Default options for backward compatibility
const defaultSelectorOptions: SelectorOption[] = [
  { id: 'again-top', label: 'again', position: 'top' },
  { id: 'word', label: 'word', position: 'left' },
  { id: 'loop', label: 'loop', position: 'right' },
  { id: 'again-bottom', label: 'again', position: 'bottom' },
];

function HexagonOption({ 
  option, 
  isSelected, 
  onClick 
}: { 
  option: SelectorOption; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const getPositionClasses = () => {
    switch (option.position) {
      case 'top':
        return 'left-[439px] top-[94px]';
      case 'left':
        return 'left-[371px] top-[174px]';
      case 'right':
        return 'left-[511px] top-[174px]';
      case 'bottom':
        return 'left-[439px] top-[254px]';
      default:
        return '';
    }
  };

  const getLabelPositionClasses = () => {
    switch (option.position) {
      case 'top':
        return 'left-[459px] top-[66px] text-center translate-x-[-50%]';
      case 'left':
        return 'left-[318px] top-[184px] text-left text-nowrap';
      case 'right':
        return 'left-[559px] top-[184px] text-left text-nowrap';
      case 'bottom':
        return 'left-[459px] top-[302px] text-center translate-x-[-50%]';
      default:
        return '';
    }
  };

  return (
    <div className="absolute contents">
      {/* Label */}
      <div className={`absolute font-['Roboto_Mono',_monospace] font-normal leading-[0] text-[#ffffff] text-[14px] tracking-[0.8px] ${getLabelPositionClasses()}`}>
        <p className="adjustLetterSpacing block leading-[20px] whitespace-nowrap">
          {option.label}
        </p>
      </div>
      
      {/* Hexagon */}
      <div 
        className={`absolute size-10 cursor-pointer transition-all duration-200 hover:scale-110 ${getPositionClasses()}`}
        onClick={onClick}
      >
        {option.id === 'word' && isSelected ? (
          // Orange filled hexagon for selected "word"
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 36 40"
              width="40"
              height="40"
            >
              <path
                d={svgPaths.hexagon}
                fill="var(--fill-0, #F59E0C)"
                id="Polygon 1"
                stroke="var(--stroke-0, white)"
              />
            </svg>
          </div>
        ) : (
          // Default hexagon with dot
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 36 40"
            width="40"
            height="40"
          >
            <path
              d={svgPaths.hexagon}
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="18"
              cy="20"
              fill="#D9D9D9"
              r="2"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export function HexagonSelector({ 
  options = defaultSelectorOptions, 
  onSelectionChange, 
  defaultSelected 
}: HexagonSelectorProps) {
  const [selectedId, setSelectedId] = useState(defaultSelected || options[0]?.id || '');

  const handleSelectionChange = (id: string) => {
    setSelectedId(id);
    onSelectionChange?.(id);
  };

  return (
    <div className="relative w-full h-full">
      {options.map((option) => (
        <HexagonOption
          key={option.id}
          option={option}
          isSelected={selectedId === option.id}
          onClick={() => handleSelectionChange(option.id)}
        />
      ))}
    </div>
  );
} 