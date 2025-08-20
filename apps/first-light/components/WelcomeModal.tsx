import { useState, useEffect } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 3-second delay before showing the modal
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const steps = [
    {
      title: "Encounter",
      subtitle: "Decode the messages from beyond",
      content: (
        <div className="space-y-4 text-left">
          <p className="text-[#f3ede9] leading-relaxed">
            You are humanity's contact specialist. 
            You translate between two beings who cannot understand each other. 
            One sees but cannot hear, the other hears but cannot see.
            Their only connection is a broken message, scattered across fragments of light and sound.
            As you decode each fragment, you uncover more of their story and slowly rebuild the bond between them.

          </p>
         
        </div>
      )
    },
    {
      title: "HOW TO PLAY",
      subtitle: "Master the translation system",
      content: (
        <div className="space-y-4 text-left max-w-[800px] w-full " >
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-[#ff4e42] font-bold text-lg">1</span>
              <div>
                <h4 className="text-[#f3ede9] font-bold text-sm">Select Glyphs</h4>
                <p className="text-[#c2b8b2] text-sm">Click on glyphs in the transmission to select them for translation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#ff4e42] font-bold text-lg">2</span>
              <div>
                <h4 className="text-[#f3ede9] font-bold text-sm">Guess Meanings</h4>
                <p className="text-[#c2b8b2] text-sm">Use the hexagon selector to guess what each glyph means. Choose from multiple options.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#ff4e42] font-bold text-lg">3</span>
              <div>
                <h4 className="text-[#f3ede9] font-bold text-sm">Unlock Progress</h4>
                <p className="text-[#c2b8b2] text-sm">Correct translations unlock new glyphs and reveal more of the alien language.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "PROGRESSION SYSTEM",
      subtitle: "Unlock the alien lexicon",
      content: (
        <div className="space-y-4 text-left">
          <div className="space-y-3">
            <div className="bg-[rgba(22,22,22,0.3)] border border-[rgba(248,75,64,0.2)] rounded-lg p-3">
              <h4 className="text-[#ff4e42] font-bold text-sm mb-1">UNLOCKED GLYPHS</h4>
              <p className="text-[#c2b8b2] text-sm">White glyphs with known meanings that you can translate.</p>
            </div>
            <div className="bg-[rgba(22,22,22,0.3)] border border-[rgba(248,75,64,0.2)] rounded-lg p-3">
              <h4 className="text-[#ff4e42] font-bold text-sm mb-1">LOCKED GLYPHS</h4>
              <p className="text-[#c2b8b2] text-sm">Red glyphs that appear in other transmissions. You must discover them first.</p>
            </div>
            <div className="bg-[rgba(22,22,22,0.3)] border border-[rgba(248,75,64,0.2)] rounded-lg p-3">
              <h4 className="text-[#ff4e42] font-bold text-sm mb-1">DICTIONARY</h4>
              <p className="text-[#c2b8b2] text-sm">Track your progress and see all discovered glyphs and their meanings.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-4"
      style={{
        transition: 'opacity 1s ease-out',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div 
        className="bg-[#080C10] border border-[rgba(248,75,64,0.3)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        style={{
          bottom: '24px',
          position: 'absolute',
          width: '600px',
          left: '24px',
          transition: 'opacity 1s ease-out, transform 1s ease-out',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        {/* Header */}
        <div className="border-b border-[rgba(248,75,64,0.2)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#ff4e42] font-bold text-2xl tracking-widest">
                {steps[currentStep].title}
              </h1>
              <p className="text-[#c2b8b2] text-sm mt-1">
                {steps[currentStep].subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-[#ff4e42]' 
                      : 'bg-[rgba(248,75,64,0.3)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="border-t border-[rgba(248,75,64,0.2)] p-6 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg border transition-all duration-200 ${
              currentStep === 0
                ? 'border-[rgba(248,75,64,0.2)] text-[rgba(248,75,64,0.5)] cursor-not-allowed'
                : 'border-[rgba(248,75,64,0.5)] text-[#ff4e42] hover:border-[#ff4e42] hover:bg-[rgba(248,75,64,0.1)]'
            }`}
            style={{ fontFamily: '"TheGoodMonolith", monospace' }}
          >
            PREVIOUS
          </button>

          <div className="text-[#c2b8b2] text-sm">
            {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-[#ff4e42] text-white rounded-lg border border-[#ff4e42] hover:bg-[#e63939] transition-all duration-200"
            style={{ fontFamily: '"TheGoodMonolith", monospace' }}
          >
            {currentStep === steps.length - 1 ? 'BEGIN MISSION' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
} 