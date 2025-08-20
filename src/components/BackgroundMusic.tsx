import React, { useState, useRef, useEffect } from 'react';

interface BackgroundMusicProps {
  audioSrc: string;
  volume?: number;
  loop?: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  audioSrc,
  volume = 0.3,
  loop = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);
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

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      
      {/* Music Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[rgba(5,5,5,0.8)] border border-[rgba(248,75,64,0.3)] rounded-lg px-4 py-3 backdrop-blur-sm">
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

      {/* Auto-play prompt (hidden by default) */}
      <div className="hidden">
        <button onClick={togglePlay}>Enable Background Music</button>
      </div>
    </>
  );
}; 