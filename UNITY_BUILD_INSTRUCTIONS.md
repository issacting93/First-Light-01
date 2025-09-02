# 🎮 Encounter - Complete Game Design Document v1.1

## 📋 Project Overview
**Encounter** is an alien language translation puzzle game where players decode mysterious glyphs from interdimensional transmissions. The game features linguistic puzzles, narrative storytelling, and cosmic romance themes.

**Last Updated:** August 24, 2025  
**Document Type:** Game Design Document (GDD)  
**Scope:** Complete game design specification for development teams

---

## 🗂️ Project Structure

```
Project/
├── Assets/
│   ├── Art/
│   │   ├── Glyphs/ (SVG)           ← Glyph symbols and graphics
│   │   └── UI/                     ← Interface elements and icons
│   ├── Audio/
│   │   ├── BGM/                    ← Background music tracks
│   │   └── SFX/                    ← Sound effects
│   └── Data/
│       ├── glyphs.json             ← Glyph definitions and meanings
│       ├── narrativeTransmissions.json ← Story content and transmissions
│       └── gameConfig.json         ← Game settings and progression
├── Scenes/
│   ├── MainMenu                    ← Title screen and navigation
│   ├── Game                        ← Main gameplay interface
│   └── EndGame                     ← Conclusion and credits
└── UI/
    ├── Components/                 ← Reusable UI elements
    ├── Layouts/                    ← Screen layouts and panels
    └── Styles/                     ← Visual themes and styling
```

## 🎯 Core Game Components

### **1. Glyph System**
- **SVG Import**: Unity's Vector Graphics package handles all glyph rendering
- **Progressive Unlocking**: Glyphs unlock based on transmission progression
- **Translation States**: Locked (red), Unlocked (white), Translated (highlighted)

### **2. Hexagon Selector**
- **Circular Grid**: 6-8 hexagons arranged around selected glyphs
- **Meaning Selection**: Includes correct answers and decoy options
- **Animated Interface**: Smooth expand/collapse animations

### **3. Transmission System**
- **Story Content**: 14 narrative transmissions with embedded glyphs
- **Progressive Unlocking**: New transmissions unlock as previous ones complete
- **Mixed Content**: Glyphs and text interwoven naturally

### **4. Dictionary Panel**
- **Reference System**: Shows all discovered glyphs with meanings
- **Context Clues**: Provides hints for translation

### **5. Terminal Interface**
- **System Messages**: Game feedback and progress updates
- **Retro Styling**: Terminal aesthetic with scrollable history

## 🔧 Core Game Systems

### **1. Data Model & Game State**

#### **Core Data Structures**
```json
{
  "glyphData": {
    "id": "string",
    "symbol": "string", 
    "svgPath": "string",
    "possibleMeanings": ["string"],
    "confidence": "number",
    "unlockChapter": "number"
  },
  "transmissionData": {
    "id": "number",
    "title": "string",
    "alienText": [{"type": "glyph|text", "content": "string"}],
    "glyphLocking": {
      "unlockedGlyphs": ["string"],
      "lockedGlyphs": ["string"]
    }
  }
}
```

#### **Game State Management**
- **Current Chapter**: Tracks story progression (1-4)
- **Translation State**: Maps glyph IDs to their translated meanings
- **Synchronized Transmissions**: Set of completed transmission IDs
- **Available Transmissions**: List of unlocked transmissions for player selection

### **2. Core Game Logic**

#### **Glyph Translation Flow**
1. **Selection**: Player clicks on glyph in transmission
2. **Validation**: System checks if glyph is unlocked
3. **Meaning Display**: Hexagon selector shows possible meanings
4. **Choice**: Player selects appropriate meaning
5. **Assignment**: Glyph is marked as translated
6. **Progress Check**: System evaluates transmission completion

#### **Transmission Completion Logic**
- Only unlocked glyphs count toward completion
- All unlocked glyphs must be translated
- Completion triggers synchronization and unlocks next transmission
- Progress is saved and cannot be replayed

### **3. Data Management**

#### **Glyph Unlocking System**
- **Chapter-Based**: Glyphs unlock based on story progression
- **Prerequisites**: Complex glyphs require simpler ones first
- **Discovery**: Some glyphs unlock through context clues
- **Progressive**: New concepts introduced gradually

#### **Save System Requirements**
- **Game Progress**: Chapter, transmission index, translation state
- **Player Data**: Synchronized transmissions, achievements
- **Session Info**: Last save time, preferences
- **Cross-Platform**: Compatible save format for all platforms

## 🎨 UI Architecture

### **Layout Structure**
- **Left Panel**: Transmission list with completion status
- **Center Panel**: Active transmission with glyph display
- **Right Panel**: Dictionary and reference information  
- **Bottom Panel**: Terminal messages and system feedback
- **Overlay**: Hexagon selector for meaning selection

### **Component Design**
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Accessibility First**: High contrast, keyboard navigation, screen reader support
- **Consistent Styling**: Unified visual language across all interface elements
- **Performance Optimized**: Efficient rendering and smooth animations

## 🔊 Audio System

### **Audio Requirements**
- **Background Music**: Ambient alien music with looping capability
- **Sound Effects**: Glyph selection, translation feedback, completion sounds
- **Volume Control**: Independent BGM and SFX volume controls
- **Audio Persistence**: Remember user audio preferences across sessions
- **Cross-Platform**: Compatible audio formats for all target platforms

## 📊 Save System

### **Save System Requirements**
- **Data Persistence**: Save game progress across sessions
- **Cross-Platform**: Compatible save format for all target platforms
- **Auto-Save**: Automatic saving at key moments (transmission completion, chapter unlock)
- **Manual Save**: Option for players to save manually
- **Save Validation**: Verify save data integrity and handle corruption gracefully

## 🌐 Platform Considerations

### **Cross-Platform Requirements**
- **Desktop**: Native file system access for save data
- **Web**: Browser-compatible storage (localStorage, IndexedDB)
- **Mobile**: Platform-specific storage APIs
- **Cloud Sync**: Optional cloud save synchronization

## 🚀 Development Plan

### **Phase 1: Core Systems (2-3 weeks)**
- [ ] Project setup and architecture
- [ ] Basic UI framework and layout
- [ ] Data loading and management system
- [ ] Glyph display and selection mechanics
- [ ] Hexagon selector interface
- [ ] Translation validation and progress tracking
- [ ] Basic save/load system

### **Phase 2: Game Loop (3-4 weeks)**
- [ ] Full transmission cycle implementation
- [ ] Chapter progression system
- [ ] Achievement and progression tracking
- [ ] Audio system integration
- [ ] Accessibility features
- [ ] Performance optimization
- [ ] Cross-platform testing

### **Phase 3: Polish & Testing (2-3 weeks)**
- [ ] UI/UX refinement
- [ ] Comprehensive testing
- [ ] Bug fixes and optimization
- [ ] Final polish and preparation for release

## 📋 Key Implementation Notes

### **Glyph System**
- **SVG Support**: Ensure glyphs render crisply at all sizes
- **Progressive Unlocking**: Glyphs unlock based on story progression
- **Translation Validation**: Multiple valid meanings with confidence scoring
- **Context Sensitivity**: Meanings adapt based on transmission context

### **Performance Requirements**
- **60 FPS**: Smooth gameplay on target platforms
- **Responsive UI**: Sub-100ms response time for user interactions
- **Memory Management**: Efficient asset loading and cleanup
- **Scalability**: Support for future content additions

### **Accessibility Features**
- **High Contrast**: Alternative color schemes for visual accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader**: Proper labeling and descriptions
- **Audio Cues**: Sound feedback for visual elements
- **Motion Sensitivity**: Option to reduce animations

---

**Document Version**: 2.0  
**Last Updated**: August 24, 2025  
**Scope**: Platform-agnostic game design specification