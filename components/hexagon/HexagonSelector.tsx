import { useState } from 'react';
import svgPaths from "../../imports/svg-jqubfyh4jl";

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
      <div className={`absolute font-['Roboto_Mono:Regular',_sans-serif] font-normal leading-[0] text-[#ffffff] text-[16px] tracking-[0.8px] ${getLabelPositionClasses()}`}>
        <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">
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
            viewBox="0 0 40 40"
               width="40"
                height="40"
          >
            <g id="Frame 64">
              <path
                d={svgPaths.hexagon}
                id="Polygon 2"
                stroke={isSelected ? "var(--stroke-0, #F59E0C)" : "var(--stroke-0, white)"}
                strokeWidth={isSelected ? "2" : "1"}
         
              />
              <circle
                cx="20"
                cy="20"
                fill={isSelected ? "var(--fill-0, #F59E0C)" : "var(--fill-0, #D9D9D9)"}
                id="Ellipse 34"
                r="2"
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}

export default function HexagonSelector({ 
  options = defaultSelectorOptions,
  onSelectionChange,
  defaultSelected
}: HexagonSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<string>(defaultSelected || options[0]?.id || '');

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
    onSelectionChange?.(optionId);
  };

  return (
    <div className="bg-[#080c10] relative size-full border border-blue-500">
      <div className="text-blue-400 text-xs absolute top-2 left-2">DEBUG: HexagonSelector</div>
      <div className="absolute contents left-1/2 top-[66px] translate-x-[-50%]">
        {/* Render all options */}
        {options.map((option) => (
          <HexagonOption
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onClick={() => handleOptionClick(option.id)}
          />
        ))}
        
        {/* Central large hexagon */}
        <div
          className="absolute left-1/2 size-[90px] translate-x-[-50%] translate-y-[-50%] cursor-pointer transition-all duration-200 hover:scale-105"
          style={{ top: "calc(50% + 0.5px)" }}
        >
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 78 90"
            >
              <path
                d={svgPaths.hexagon}
                id="Polygon 3"
                stroke="var(--stroke-0, white)"
                strokeWidth="1"
                fill="transparent"
              />
            </svg>
          </div>
        </div>
        
        {/* Central icon */}
        <div
          className="absolute left-1/2 size-[22px] translate-x-[-50%] translate-y-[-50%] pointer-events-none"
          data-name="Vector"
          style={{ top: "calc(50% + 0.5px)" }}
        >
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 22 22"
               width="40"
                height="40"
          >
            <path d={svgPaths.p95c0990} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
} 