import svgPathsNew from '../../imports/svg-jqubfyh4jl';

interface WsopuGlyphProps {
  onClick?: () => void;
  isSelected?: boolean;
}

export function WsopuGlyph({ onClick, isSelected }: WsopuGlyphProps) {
  const svgComponents = [
    { path: 'p286fe300', viewBox: '0 0 28 22', width: 'w-[20px] sm:w-[24px] lg:w-[27.07px]' },
    { path: 'p1cc70880', viewBox: '0 0 16 22', width: 'w-[12px] sm:w-[14px] lg:w-[15.222px]' },
    { path: 'p3755c280', viewBox: '0 0 22 22', width: 'size-4 sm:size-5 lg:size-[22px]' },
    { path: 'p2f76c800', viewBox: '0 0 21 22', width: 'w-[16px] sm:w-[18px] lg:w-[20.303px]' },
    { path: 'p1083c400', viewBox: '0 0 22 22', width: 'size-4 sm:size-5 lg:size-[22px]' },
    { path: 'p2e653780', viewBox: '0 0 19 22', width: 'w-[15px] sm:w-[17px] lg:w-[19px]' }
  ];

  return (
    <div 
      className={`basis-0 grow min-h-px min-w-px relative shrink-0 cursor-pointer transition-all duration-300 ${
        isSelected ? 'terminal-glyph-selected' : 'terminal-glyph-untranslated'
      }`}
      data-name="wsopu"
      onClick={onClick}
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-1 sm:gap-2 items-center justify-center p-3 sm:p-4 lg:p-[24px] relative w-full">
          {svgComponents.map(({ path, viewBox, width }) => (
            svgPathsNew?.[path as keyof typeof svgPathsNew] ? (
              <div key={path} className={`h-4 sm:h-5 lg:h-[22px] relative shrink-0 ${width}`}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={viewBox}>
                  <path d={svgPathsNew[path as keyof typeof svgPathsNew]} fill="currentColor" />
                </svg>
              </div>
            ) : null
          ))}
          {!svgPathsNew && (
            <div className="terminal-text-lg text-terminal-text-primary">wsopu</div>
          )}
        </div>
      </div>
    </div>
  );
} 