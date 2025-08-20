# Background Music for Alien Translation Game

## 🎵 Adding Your Own Background Music

### Supported Audio Formats
- MP3 (recommended)
- WAV
- OGG
- M4A

### File Placement
Place your audio files in the `public/audio/` directory:
```
public/audio/
├── ambient-alien.mp3    # Current placeholder
├── your-music.mp3       # Add your own files here
└── README.md           # This file
```

### Recommended Audio Characteristics
For the best experience with the alien translation game:

**🎼 Style Suggestions:**
- **Ambient/Atmospheric**: Mysterious, space-like sounds
- **Sci-Fi**: Electronic, futuristic tones
- **Minimal**: Subtle background that won't distract from translation
- **Loopable**: Should seamlessly loop for continuous playback

**📊 Technical Recommendations:**
- **Duration**: 2-5 minutes (will loop automatically)
- **Bitrate**: 128-320 kbps MP3
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo or Mono

### Updating the Audio Source
To change the background music, edit the `audioSrc` prop in `components/AlienTranslatorInterface.tsx`:

```tsx
<BackgroundMusic 
  audioSrc="/audio/your-music.mp3"  // Change this line
  volume={0.2}
  loop={true}
/>
```

### Music Controls
The game includes built-in music controls in the top-right corner:
- **Play/Pause**: ▶/⏸ button
- **Volume**: Slider control
- **Mute**: 🔊/🔇 toggle
- **Status**: Shows "MUSIC" or "SILENT"

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: May require user interaction to start
- **Mobile**: Limited by browser autoplay policies

### Free Music Resources
For royalty-free ambient music:
- [Freesound.org](https://freesound.org/)
- [Incompetech.com](https://incompetech.com/)
- [Pixabay Music](https://pixabay.com/music/)
- [YouTube Audio Library](https://studio.youtube.com/channel/UC/music)

### Example Audio Files
You can replace `ambient-alien.mp3` with any of these styles:
- `space-ambient.mp3` - Cosmic, mysterious
- `alien-communication.mp3` - Electronic, otherworldly
- `translation-interface.mp3` - Sci-fi, futuristic
- `silence.mp3` - No audio (for testing)

The music will automatically loop and maintain the game's immersive atmosphere! 🛸 