import { useState, useCallback } from "react";
import { TerminalPanel } from "./ui/TerminalPanel";
import { MessageButton } from "./MessageSidebar";
import { DictionarySidebar } from "./DictionarySidebar";
import { TransmissionRenderer } from "./translation/TransmissionRenderer";
import { GlyphAnalysisModal } from "./modals/GlyphAnalysisModal";
import { AnimatedHexagonSelector } from "./hexagon/AnimatedHexagonSelector";
import { TranslationControls } from "./translation/TranslationControls";
import GlyphLambdaTabs from "./GlyphLambdaTabs";
import { BackgroundMusic } from "./BackgroundMusic";
import WelcomeModal from "./WelcomeModal";
import EncounterStartOverlay from "./EncounterStartOverlay";
import { useGameEngine } from "@/services/gameEngineService";
import { SoundShapeLanguage } from "./Lambda/SoundShapeLanguage";

// Constants
const INITIAL_TERMINAL_MESSAGES = [
  '[2157.03.15 14:23:07] INCOMING TRANSMISSION STATUS: ACTIVE',
  '[2157.03.15 14:23:07] TRANSLATION INTERFACE INITIALIZED',
  '[2157.03.15 14:23:07] GLYPH DATABASE ONLINE'
];

const END_GAME_DELAY = 2000;

// Utility functions
const createTerminalMessage = (message: string) => `[${new Date().toISOString()}] ${message}`;

export default function CombinedInterface() {
  const [activeTab, setActiveTab] = useState<'glyph' | 'lambda'>('glyph');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showEncounterStart, setShowEncounterStart] = useState(true);
  
  const {
    gameState,
    selectGlyph,
    selectTransmission,
    assignMeaning,
    nextTransmission,
    viewTransmission
  } = useGameEngine();

  const [terminalMessages, setTerminalMessages] = useState<string[]>(INITIAL_TERMINAL_MESSAGES);

  const [showGlyphModal, setShowGlyphModal] = useState(false);
  const [modalGlyph, setModalGlyph] = useState<any>(null);

  const handleTabChange = useCallback((tab: 'glyph' | 'lambda') => {
    setActiveTab(tab);
    setTerminalMessages(prev => [...prev, createTerminalMessage(`SWITCHED TO ${tab.toUpperCase()} INTERFACE`)]);
  }, []);

  const handleGlyphClick = useCallback((glyphId: string) => {
    selectGlyph(glyphId);
  }, [selectGlyph]);

  const handleAssignMeaning = useCallback((glyphId: string, meaning: string) => {
    assignMeaning(glyphId, meaning);
    
    // Add terminal message for successful translation
    setTerminalMessages(prev => [...prev, createTerminalMessage(`GLYPH "${glyphId}" TRANSLATED AS "${meaning}"`)]);
  }, [assignMeaning]);

  // Wrapper for hexagon selector that converts meaning selection to glyph assignment
  const handleHexagonSelect = useCallback((hexagonId: string) => {
    if (!gameState?.selectedGlyph) return;
    
    // Check if this is the correct answer (no "decoy-" prefix)
    if (!hexagonId.startsWith('decoy-')) {
      // This is the correct answer, assign the meaning
      console.log('✅ Correct answer selected:', hexagonId);
      handleAssignMeaning(gameState.selectedGlyph, hexagonId);
    } else {
      // This is a wrong answer, don't assign anything
      console.log('❌ Wrong answer selected:', hexagonId);
      setTerminalMessages(prev => [...prev, createTerminalMessage(`INCORRECT SELECTION: "${hexagonId.replace('decoy-', '')}"`)]);
    }
  }, [gameState?.selectedGlyph, handleAssignMeaning]);

  // Wrapper for modal that matches its expected signature
  const handleModalAssignMeaning = useCallback((meaning: string) => {
    if (gameState?.selectedGlyph) {
      handleAssignMeaning(gameState.selectedGlyph, meaning);
    }
  }, [gameState?.selectedGlyph, handleAssignMeaning]);

  const handleTransmissionComplete = useCallback((_transmission: any, accuracy: number) => {
    // Add terminal message for transmission synchronization
    setTerminalMessages(prev => [...prev, createTerminalMessage(`TRANSMISSION SYNCHRONIZED - ACCURACY: ${accuracy}%`)]);
  }, []);

  const handleCloseGlyphModal = useCallback(() => {
    setShowGlyphModal(false);
    setModalGlyph(null);
  }, []);

  const handleNextTransmission = useCallback(() => {
    nextTransmission();
    // Add terminal message for unlocking next transmission
    setTerminalMessages(prev => [...prev, 'UNLOCKING NEXT TRANSMISSION...']);
  }, [nextTransmission]);

  const handleSoundShapeEndTransmission = useCallback(() => {
    console.log('SoundShape end transmission triggered');
    setTerminalMessages(prev => [...prev, createTerminalMessage('SOUND SHAPE END TRANSMISSION SEQUENCE INITIATED')]);
    
    // Add a small delay to allow the UI to update before redirecting
    setTimeout(() => {
      window.location.href = '/audio/end-game.html';
    }, END_GAME_DELAY);
  }, []);

  // Get the currently selected glyph for the hexagon selector
  const selectedGlyph = gameState?.selectedGlyph ? gameState.lexicon.get(gameState.selectedGlyph) : null;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ 
      background: '#080C10',
      fontFamily: '"TheGoodMonolith", monospace',
      color: '#f3ede9'
    }}>
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 240, 230, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 240, 230, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
        }}
      />

      {/* Encounter Start Overlay */}
      <EncounterStartOverlay
        isOpen={showEncounterStart}
        onClose={() => setShowEncounterStart(false)}
      />

      {/* Background Music */}
      <BackgroundMusic 
        audioSrc="/audio/encounter-2.mp3"
        volume={0.2}
        loop={true}
        autoPlayOnFirstClick={true}
      />

      {/* Main Content Area - 3 Column Layout */}
      <div className="relative z-10 w-full h-full flex">
        {/* Left Sidebar */}
        <div className="w-80 h-full flex flex-col">
          <MessageButton
            transmissions={gameState.transmissions}
            currentTransmission={gameState.currentTransmission}
            onSelect={selectTransmission}
            gameState={gameState}
            viewTransmission={viewTransmission}
          />
        </div>

        {/* Center Content */}
        <div className="flex-1 h-full flex flex-col">
          {/* GlyphLambdaTabs - Top Section */}
          <div className="gridOverlay"></div>
          <div className="h-auto p-4">
            <GlyphLambdaTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'glyph' ? (
            <>
              {/* Transmission Renderer - Middle Section */}
              <div className="h-1/3 p-4 overflow-y-auto">
                <TransmissionRenderer
                  currentTransmission={gameState?.currentTransmission}
                  gameState={gameState}
                  onGlyphClick={handleGlyphClick}
                  onTransmissionComplete={handleTransmissionComplete}
                  onAssignMeaning={handleAssignMeaning}
                  onNextTransmission={nextTransmission}
                />
              </div>

              {/* Hexagon Selector - Middle Section */}
              <div className="h-1/3 p-4">
                <AnimatedHexagonSelector
                  selectedHexagon={gameState?.selectedGlyph || null}
                  onHexagonSelect={handleHexagonSelect}
                  selectedGlyph={selectedGlyph}
                  className="w-full h-full"
                />
              </div>

              {/* Translation Controls - Bottom Section */}
              <div className="h-1/10 p-4">
                <TranslationControls
                  currentTransmission={gameState?.currentTransmission}
                  gameState={gameState}
                  onNextTransmission={handleNextTransmission}
                />
              </div>
            </>
          ) : (
            /* SoundShape Interface - Full Height */
            <div className="h-full">
              <SoundShapeLanguage 
                onEndTransmission={handleSoundShapeEndTransmission}
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 h-full flex flex-col">
          <DictionarySidebar />
        </div>
      </div>

      {/* Glyph Analysis Modal */}
      {showGlyphModal && modalGlyph && (
        <GlyphAnalysisModal
          glyph={modalGlyph}
          onAssignMeaning={handleModalAssignMeaning}
          onClose={handleCloseGlyphModal}
        />
      )}
      
      {/* Terminal Panel - Fixed to Bottom Left of Screen */}
      <div className="fixed bottom-6 left-6 z-50 max-w-[400px] pointer-events-auto" 
      style={{zIndex: 5, bottom: '24px', left: '24px'}}>
        <TerminalPanel messages={terminalMessages} />
      </div>

      {/* Custom Styles for SoundShapeLanguage */}
      <style>{`
        .soundShapeLanguage {
          position: relative;
          width: 100%; 
          overflow: hidden; 
          color: #f3ede9;
          font-family: "TheGoodMonolith", monospace;
          text-transform: uppercase;
        }

        .loadingOverlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #080C10;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: opacity 0.5s ease-out;
        }

        .loadingContainer {
          text-align: center;
          color: #ff4e42;
        }

        .preloaderCanvasContainer {
          margin-bottom: 1.25rem;
        }

        .preloaderCanvas {
          border: 1px solid #ff4e42;
          border-radius: 50%;
        }

        .loadingText {
          font-size: 0.875rem;
          color: #c2b8b2;
        }

        .threeContainer {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
          cursor: grab;
          top: 0;
          left: 0;
        }

        .threeContainer:active {
          cursor: grabbing;
        }
        
        .threeContainer canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        .gridOverlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(
              to right,
              rgba(255, 240, 230, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(255, 240, 230, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .interfaceContainer {
          position: relative;
          width: 100%;
          
          z-index: 2;
          pointer-events: none;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .header {
          display: flex;
          justify-content: space-between;
          padding: 1.25rem;
        }

        .headerItem {
          font-size: 0.75rem;
          color: #c2b8b2;
        }

        .soundShapePanel {
            background: rgba(30, 26, 24, 0.7);
            border: 1px solid rgba(255, 78, 66, 0.3);
            border-radius: 5px;
            padding: 1.25rem;
            backdrop-filter: blur(8px);
            position: absolute;
            pointer-events: auto;
            z-index: 10;
            bottom: 0px;
            width: 100%;
            max-width: 400px;
            margin: auto;
            height: 450px;
            left: 0px;
            right: 0px;
        }

        .shapeInfoPanel { 
      
          width: 100%;
          background: rgba(30, 26, 24, 0.7);
          border: 1px solid rgba(255, 78, 66, 0.3);
          border-radius: 5px;
          padding: 1.25rem;
          backdrop-filter: blur(8px);
          pointer-events: auto;
          z-index: 10;
          display: none;
        }

        .panelHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.625rem;
          border-bottom: 1px solid rgba(255, 78, 66, 0.3);
        }

        .panelTitle {
          font-size: 0.875rem;
          color: #ff4e42;
        }

        .dragHandle {
          cursor: grab;
          color: #c2b8b2;
          font-size: 1.25rem;
          user-select: none;
        }

        .waveformContainer {
          position: relative;
          margin: 20px auto;
          border: 1px solid rgba(255, 78, 66, 0.3);
          background: rgba(0, 0, 0, 1);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          overflow: hidden;
          backdrop-filter: blur(5px);
          width: 100%;
          max-width: 1600px;
        }

        .attributeContainer {
          margin: 20px auto;
          width: 100%;
          padding: 0;
          margin-left: 0px;
          margin-right: 0px;
          background: rgba(0, 0, 0, 1);
          border: 1px solid rgba(255, 78, 66, 0.3);
          max-width: 1600px;
        }

        .attributeFrame {
          padding: 15px;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 0;
          margin: auto;
          max-width: 1600px;
        }

        .attributeItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .attributeItem strong {
          color: #ff4e42;
          font-size: 0.8rem;
        }

        .attributeValue {
          color: #c2b8b2;
          font-size: 1.1rem;
          font-weight: bold;
        }

        .buttons {
          display: flex;
          gap: 0.625rem;
          margin-top: 1.25rem;
        }

        .btn {
          flex: 1;
          padding: 0.5rem 0;
          background: rgba(255, 78, 66, 0.1);
          border: 1px solid rgba(255, 78, 66, 0.3);
          color: #ff4e42;
          font-size: 0.75rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: "TheGoodMonolith", monospace;
        }

        .btn:hover {
          background: rgba(255, 78, 66, 0.3);
        }

        .endTransmissionBtn {
          background: #ff4e42 !important;
          color: #080C10 !important;
          font-weight: bold;
          border: 1px solid #ff4e42;
        }

        .endTransmissionBtn:hover {
          background: #e63e33 !important;
          border-color: #e63e33;
        }

        .shapeReadouts {
          margin-top: 0.625rem;
        }

        .dataRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.3125rem;
          font-size: 0.75rem;
        }

        .dataLabel {
          color: #c2b8b2;
        }

        .dataValue {
          color: #f3ede9;
        }

        .terminalPanel {
          position: absolute;
          left: 20px;
          bottom: 20px;
          width: 500px;
          height: 150px;
          background: rgba(30, 26, 24, 0.7);
          border: 1px solid rgba(255, 78, 66, 0.3);
          border-radius: 5px;
          overflow: hidden;
          pointer-events: auto;
          z-index: 10;
        }

        .terminalHeader {
          padding: 0.5rem 0.625rem;
          background: rgba(0, 0, 0, 0.3);
          font-size: 0.875rem;
          color: #ff4e42;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .terminalContent {
          padding: 0.625rem;
          height: calc(100% - 40px);
          overflow-y: auto;
          font-size: 0.75rem;
          line-height: 1.4;
        }

        .terminalLine {
          margin-bottom: 0.25rem;
          color: #c2b8b2;
        }

        .typing {
          position: relative;
        }

        .typing::after {
          content: "|";
          animation: blink 1s infinite;
          color: #ff4e42;
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .waveformContainer {
            margin: 15px auto;
          }
          
          .attributeFrame {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          .attributeItem {
            flex-direction: row;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
} 