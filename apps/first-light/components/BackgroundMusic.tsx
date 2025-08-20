import React, { useState, useRef, useEffect } from 'react';

interface BackgroundMusicProps {
  audioSrc: string;
  volume?: number;
  loop?: boolean;
  autoPlayOnFirstClick?: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  audioSrc,
  volume = 0.3,
  loop = true,
  autoPlayOnFirstClick = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showEnableButton, setShowEnableButton] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial properties
    audio.volume = currentVolume;
    audio.loop = loop;

    // Event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = 0;
    } else {
      audio.volume = currentVolume;
    }
  }, [currentVolume, isMuted]);

  // Handle first user interaction with the game
  useEffect(() => {
    const handleFirstClick = () => {
      if (!hasUserInteracted && autoPlayOnFirstClick) {
        setHasUserInteracted(true);
        // Try to autoplay music on first click
        const audio = audioRef.current;
        if (audio && !isPlaying) {
          audio.play().then(() => {
            setIsPlaying(true);
            setShowEnableButton(false);
          }).catch(() => {
            // Autoplay failed, show enable button
            setShowEnableButton(true);
          });
        }
      }
    };

    // Listen for any click on the document
    document.addEventListener('click', handleFirstClick, { once: true });
    
    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [hasUserInteracted, autoPlayOnFirstClick, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
      });
    }
    setShowEnableButton(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setCurrentVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const enableMusic = () => {
    setShowEnableButton(false);
    togglePlay();
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      
      {/* Enable Music Button (shown until user enables) */}
      {showEnableButton && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={enableMusic}
            className="flex items-center gap-3 bg-[rgba(5,5,5,0.9)] border border-[rgba(248,75,64,0.5)] rounded-lg px-6 py-4 backdrop-blur-sm hover:border-[rgba(248,75,64,0.8)] transition-all duration-200 group"
            style={{ fontFamily: '"TheGoodMonolith", monospace' }}
          >
            <span className="text-[#ff4e42] text-lg">🎵</span>
            <div className="flex flex-col">
              <span className="text-[#ff4e42] text-sm tracking-widest uppercase font-bold">
                Enable Music
              </span>
              <span className="text-[#c2b8b2] text-xs tracking-wide">
                Click to start ambient music
              </span>
            </div>
            <span className="text-[#ff4e42] text-sm group-hover:scale-110 transition-transform">
              ▶
            </span>
          </button>
        </div>
      )}
      
      {/* Music Controls (shown when music is enabled) */}
      {!showEnableButton && (
        <div style={{ 
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1000
        }}
        className=" absolute top-6 right-6 z-50 flex items-center gap-3 bg-[rgba(5,5,5,0.8)] border border-[rgba(248,75,64,0.3)] rounded-lg px-4 py-3 backdrop-blur-sm">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[rgba(248,75,64,0.5)] hover:border-[rgba(248,75,64,0.8)] transition-all duration-200"
            style={{ fontFamily: '"TheGoodMonolith", monospace' }}
          >
            {isPlaying ? (
              <span className="text-[#ff4e42] text-xs">⏸</span>
            ) : (
              <span className="text-[#ff4e42] text-xs">▶</span>
            )}
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-[#ff4e42] text-xs hover:opacity-70 transition-opacity"
              style={{ fontFamily: '"TheGoodMonolith", monospace' }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : currentVolume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-[rgba(248,75,64,0.3)] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ff4e42 0%, #ff4e42 ${(isMuted ? 0 : currentVolume) * 100}%, rgba(248,75,64,0.3) ${(isMuted ? 0 : currentVolume) * 100}%, rgba(248,75,64,0.3) 100%)`
              }}
            />
          </div>

          {/* Music Label */}
          <span 
            className="text-[#ff4e42] text-xs tracking-widest uppercase"
            style={{ fontFamily: '"TheGoodMonolith", monospace' }}
          >
            {isPlaying ? 'MUSIC' : 'SILENT'}
          </span>
        </div>
      )}
    </>
  );
}; 