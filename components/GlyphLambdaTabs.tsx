import { useState } from 'react';

interface GlyphLambdaTabsProps {
  activeTab?: 'glyph' | 'lambda';
  onTabChange?: (tab: 'glyph' | 'lambda') => void;
}

export default function GlyphLambdaTabs({ 
  activeTab: externalActiveTab, 
  onTabChange 
}: GlyphLambdaTabsProps = {}) {
  const [internalActiveTab, setInternalActiveTab] = useState<'glyph' | 'lambda'>('glyph');
  
  // Use external state if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  
  const handleTabChange = (tab: 'glyph' | 'lambda') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-4 font-mono text-[20px] uppercase tracking-[0.25em] font-bold">
        
        {/* Glyph Tab */}
        <button
          onClick={() => handleTabChange('glyph')}
          className={`transition-opacity text-[20px] duration-200 ${
            activeTab === 'glyph'
              ? 'text-[#ff4e42] opacity-100'
              : 'text-[#ff4e42] opacity-50 hover:opacity-80'
          }`}
        >
          GLYPHS
        </button>

        {/* Divider */} 
          <div className="text-[20px] text-[#ff4e42]">|</div> 

        {/* Lambda Tab */}
        <button
          onClick={() => handleTabChange('lambda')}
          className={`transition-opacity text-[20px] duration-200 ${
            activeTab === 'lambda'
              ? 'text-[#ff4e42] opacity-100'
              : 'text-[#ff4e42] opacity-50 hover:opacity-80'
          }`}
        >
          LAMBDA
        </button>
      </div>
    </div>
  );
}
