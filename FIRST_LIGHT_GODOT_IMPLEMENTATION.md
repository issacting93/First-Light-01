# First-Light: Godot Implementation Guide

## 🎯 **Project Overview**

First-Light is a narrative puzzle game where players translate alien glyphs by selecting meanings from hexagon grids. The game features progressive unlocking, transmission synchronization, and complex state management.

## 🏗️ **Project Structure**

```
FirstLight/
├── scenes/
│   ├── Main.tscn
│   ├── UI/
│   │   ├── HexagonGrid.tscn
│   │   ├── TranslationPanel.tscn
│   │   ├── TransmissionRenderer.tscn
│   │   └── BackgroundMusic.tscn
│   └── Modals/
│       ├── WelcomeModal.tscn
│       └── GlyphAnalysisModal.tscn
├── scripts/
│   ├── autoload/
│   │   ├── GameState.gd
│   │   ├── DataService.gd
│   │   └── AudioManager.gd
│   ├── ui/
│   │   ├── HexagonGrid.gd
│   │   ├── Hexagon.gd
│   │   ├── TranslationPanel.gd
│   │   └── TransmissionRenderer.gd
│   └── game/
│       ├── Glyph.gd
│       ├── Transmission.gd
│       └── GameEngine.gd
├── assets/
│   ├── fonts/
│   ├── audio/
│   └── textures/
└── project.godot
```

## 🔧 **Core Systems**

### **1. Game State Management (Autoload)**

```gdscript
# GameState.gd
extends Node

signal glyph_selected(glyph_id: String)
signal meaning_assigned(glyph_id: String, meaning: String)
signal transmission_synchronized(transmission_id: int)
signal game_progress_updated

var unlocked_glyphs: Array[String] = []
var synchronized_transmissions: Array[int] = []
var current_transmission_id: int = 1
var translation_state: Dictionary = {}
var selected_glyph: String = ""
var score: int = 0
var chapter: int = 1

func _ready():
    # Initialize with first transmission
    unlock_glyph("i")
    save_game_state()

func unlock_glyph(glyph_id: String) -> bool:
    if can_unlock_glyph(glyph_id):
        unlocked_glyphs.append(glyph_id)
        emit_signal("glyph_selected", glyph_id)
        save_game_state()
        return true
    return false

func assign_meaning(glyph_id: String, meaning: String):
    translation_state[glyph_id] = meaning
    emit_signal("meaning_assigned", glyph_id, meaning)
    check_transmission_completion()
    save_game_state()

func check_transmission_completion():
    var current_transmission = DataService.get_transmission(current_transmission_id)
    if current_transmission:
        var all_glyphs = current_transmission.get_glyphs()
        var translated_count = 0
        
        for glyph in all_glyphs:
            if translation_state.has(glyph) and unlocked_glyphs.has(glyph):
                translated_count += 1
        
        if translated_count == all_glyphs.size():
            synchronize_transmission(current_transmission_id)

func synchronize_transmission(transmission_id: int):
    if not synchronized_transmissions.has(transmission_id):
        synchronized_transmissions.append(transmission_id)
        emit_signal("transmission_synchronized", transmission_id)
        unlock_next_transmission()
        save_game_state()

func unlock_next_transmission():
    var next_id = current_transmission_id + 1
    var next_transmission = DataService.get_transmission(next_id)
    if next_transmission:
        current_transmission_id = next_id
        for glyph in next_transmission.get_glyphs():
            unlock_glyph(glyph)

func can_unlock_glyph(glyph_id: String) -> bool:
    # Check if glyph should be unlocked based on game progression
    return DataService.is_glyph_unlockable(glyph_id, synchronized_transmissions)

func save_game_state():
    var save_data = {
        "unlocked_glyphs": unlocked_glyphs,
        "synchronized_transmissions": synchronized_transmissions,
        "current_transmission_id": current_transmission_id,
        "translation_state": translation_state,
        "score": score,
        "chapter": chapter
    }
    
    var save_file = FileAccess.open("user://savegame.save", FileAccess.WRITE)
    save_file.store_string(JSON.stringify(save_data))
    save_file.close()

func load_game_state():
    if FileAccess.file_exists("user://savegame.save"):
        var save_file = FileAccess.open("user://savegame.save", FileAccess.READ)
        var save_data = JSON.parse_string(save_file.get_as_text())
        save_file.close()
        
        if save_data:
            unlocked_glyphs = save_data.get("unlocked_glyphs", [])
            synchronized_transmissions = save_data.get("synchronized_transmissions", [])
            current_transmission_id = save_data.get("current_transmission_id", 1)
            translation_state = save_data.get("translation_state", {})
            score = save_data.get("score", 0)
            chapter = save_data.get("chapter", 1)
```

### **2. Data Service (Autoload)**

```gdscript
# DataService.gd
extends Node

var game_config: Dictionary = {}
var glyphs: Dictionary = {}
var transmissions: Array = []

func _ready():
    load_game_data()

func load_game_data():
    # Load game configuration
    var config_file = FileAccess.open("res://data/game_config.json", FileAccess.READ)
    if config_file:
        game_config = JSON.parse_string(config_file.get_as_text())
        config_file.close()
    
    # Load glyphs
    var glyphs_file = FileAccess.open("res://data/glyphs.json", FileAccess.READ)
    if glyphs_file:
        glyphs = JSON.parse_string(glyphs_file.get_as_text())
        glyphs_file.close()
    
    # Load transmissions
    var transmissions_file = FileAccess.open("res://data/transmissions.json", FileAccess.READ)
    if transmissions_file:
        transmissions = JSON.parse_string(transmissions_file.get_as_text())
        transmissions_file.close()

func get_glyph(glyph_id: String) -> Dictionary:
    return glyphs.get(glyph_id, {})

func get_transmission(transmission_id: int) -> Dictionary:
    for transmission in transmissions:
        if transmission.get("id") == transmission_id:
            return transmission
    return {}

func is_glyph_unlockable(glyph_id: String, synchronized_transmissions: Array) -> bool:
    var glyph = get_glyph(glyph_id)
    if not glyph:
        return false
    
    var required_transmission = glyph.get("required_transmission", 1)
    return synchronized_transmissions.has(required_transmission)

func get_unlocked_glyphs_for_transmission(transmission_id: int) -> Array:
    var transmission = get_transmission(transmission_id)
    var all_glyphs = transmission.get("glyphs", [])
    var unlocked_glyphs = []
    
    for glyph in all_glyphs:
        if GameState.unlocked_glyphs.has(glyph):
            unlocked_glyphs.append(glyph)
    
    return unlocked_glyphs
```

### **3. Hexagon Grid System**

```gdscript
# HexagonGrid.gd
extends Control

signal hexagon_selected(hexagon_id: String)

@onready var grid_container = $GridContainer
@onready var hexagon_scene = preload("res://scenes/UI/Hexagon.tscn")

var hexagons: Array[Node] = []
var selected_hexagon: String = ""
var is_transmission_synchronized: bool = false
var correct_answer_id: String = ""

func _ready():
    GameState.connect("glyph_selected", _on_glyph_selected)
    GameState.connect("transmission_synchronized", _on_transmission_synchronized)

func create_hexagon_grid(meanings: Array, correct_answer: String):
    clear_grid()
    correct_answer_id = correct_answer
    
    # Create hexagon positions in a circular pattern
    var positions = calculate_hexagon_positions(meanings.size())
    
    for i in range(meanings.size()):
        var hexagon = hexagon_scene.instantiate()
        var meaning = meanings[i]
        var is_correct = meaning == correct_answer
        
        hexagon.setup(meaning, is_correct, positions[i])
        hexagon.connect("hexagon_clicked", _on_hexagon_clicked)
        
        grid_container.add_child(hexagon)
        hexagons.append(hexagon)
        
        # Position hexagon
        hexagon.position = positions[i]

func calculate_hexagon_positions(count: int) -> Array:
    var positions = []
    var radius = 120.0
    var angle_step = TAU / count
    
    for i in range(count):
        var angle = i * angle_step
        var x = cos(angle) * radius
        var y = sin(angle) * radius
        positions.append(Vector2(x, y))
    
    return positions

func _on_hexagon_clicked(hexagon_id: String):
    if is_transmission_synchronized or hexagon_id == correct_answer_id:
        emit_signal("hexagon_selected", hexagon_id)
    else:
        # Show "transmission not synchronized" message
        Events.emit_signal("show_message", "TRANSMISSION NOT SYNCHRONIZED - COMPLETE THE TRANSMISSION FIRST")

func _on_glyph_selected(glyph_id: String):
    var glyph = GameState.get_selected_glyph()
    if glyph:
        var meanings = generate_meanings(glyph)
        create_hexagon_grid(meanings, glyph.get("confirmed_meaning", ""))

func _on_transmission_synchronized(transmission_id: int):
    is_transmission_synchronized = true
    update_hexagon_visibility()

func update_hexagon_visibility():
    for hexagon in hexagons:
        hexagon.set_synchronized(is_transmission_synchronized)

func clear_grid():
    for hexagon in hexagons:
        hexagon.queue_free()
    hexagons.clear()

func generate_meanings(glyph: Dictionary) -> Array:
    var correct_meaning = glyph.get("confirmed_meaning", "")
    var decoy_meanings = glyph.get("decoy_meanings", [])
    
    var all_meanings = [correct_meaning]
    all_meanings.append_array(decoy_meanings)
    
    # Shuffle meanings
    all_meanings.shuffle()
    return all_meanings
```

### **4. Individual Hexagon**

```gdscript
# Hexagon.gd
extends Control

signal hexagon_clicked(hexagon_id: String)

@onready var hexagon_sprite = $HexagonSprite
@onready var label = $Label
@onready var animation_player = $AnimationPlayer

var hexagon_id: String = ""
var is_correct: bool = false
var is_synchronized: bool = false

func _ready():
    # Connect input events
    mouse_entered.connect(_on_mouse_entered)
    mouse_exited.connect(_on_mouse_exited)
    gui_input.connect(_on_gui_input)

func setup(id: String, correct: bool, position: Vector2):
    hexagon_id = id
    is_correct = correct
    label.text = id
    
    # Set initial position
    position = position

func _on_gui_input(event: InputEvent):
    if event is InputEventMouseButton and event.pressed:
        if event.button_index == MOUSE_BUTTON_LEFT:
            emit_signal("hexagon_clicked", hexagon_id)
            play_click_animation()

func _on_mouse_entered():
    if is_correct and not is_synchronized:
        # Show locked state
        hexagon_sprite.modulate = Color.RED
    else:
        # Show hover state
        hexagon_sprite.modulate = Color.YELLOW
        animation_player.play("hover")

func _on_mouse_exited():
    hexagon_sprite.modulate = Color.WHITE
    animation_player.play("idle")

func set_synchronized(synchronized: bool):
    is_synchronized = synchronized
    if synchronized and is_correct:
        # Show correct answer
        hexagon_sprite.modulate = Color.GREEN
        label.modulate = Color.GREEN

func play_click_animation():
    animation_player.play("click")
```

### **5. Translation Panel**

```gdscript
# TranslationPanel.gd
extends Control

signal synchronize_requested
signal next_transmission_requested

@onready var progress_label = $ProgressLabel
@onready var synchronize_button = $SynchronizeButton
@onready var next_button = $NextButton

var current_transmission: Dictionary = {}

func _ready():
    GameState.connect("transmission_synchronized", _on_transmission_synchronized)
    GameState.connect("glyph_selected", _on_glyph_selected)
    
    synchronize_button.pressed.connect(_on_synchronize_pressed)
    next_button.pressed.connect(_on_next_pressed)

func _on_glyph_selected(glyph_id: String):
    update_progress()

func update_progress():
    if not current_transmission:
        return
    
    var unlocked_glyphs = GameState.get_unlocked_glyphs_for_transmission(current_transmission.get("id", 1))
    var translated_count = 0
    
    for glyph in unlocked_glyphs:
        if GameState.translation_state.has(glyph):
            translated_count += 1
    
    var total = unlocked_glyphs.size()
    progress_label.text = "TRANSLATING: %d/%d" % [translated_count, total]
    
    # Update button states
    var can_synchronize = translated_count == total and total > 0
    var is_synchronized = GameState.synchronized_transmissions.has(current_transmission.get("id", 1))
    
    synchronize_button.disabled = not can_synchronize or is_synchronized
    next_button.disabled = not is_synchronized
    
    if is_synchronized:
        synchronize_button.text = "✅ SYNCHRONIZED"
        synchronize_button.modulate = Color.GREEN
    else:
        synchronize_button.text = "🔄 SYNCHRONIZE"
        synchronize_button.modulate = Color.WHITE

func _on_synchronize_pressed():
    emit_signal("synchronize_requested")

func _on_next_pressed():
    emit_signal("next_transmission_requested")

func _on_transmission_synchronized(transmission_id: int):
    update_progress()
```

### **6. Transmission Renderer**

```gdscript
# TransmissionRenderer.gd
extends Control

signal glyph_clicked(glyph_id: String)

@onready var glyph_container = $GlyphContainer
@onready var glyph_scene = preload("res://scenes/UI/GlyphDisplay.tscn")

var current_transmission: Dictionary = {}
var glyph_displays: Array[Node] = []

func _ready():
    GameState.connect("glyph_selected", _on_glyph_selected)
    GameState.connect("meaning_assigned", _on_meaning_assigned)

func set_transmission(transmission: Dictionary):
    current_transmission = transmission
    render_transmission()

func render_transmission():
    clear_glyphs()
    
    if not current_transmission:
        return
    
    var glyphs = current_transmission.get("glyphs", [])
    
    for glyph_id in glyphs:
        var glyph_display = glyph_scene.instantiate()
        var glyph_data = DataService.get_glyph(glyph_id)
        var is_unlocked = GameState.unlocked_glyphs.has(glyph_id)
        var is_translated = GameState.translation_state.has(glyph_id)
        
        glyph_display.setup(glyph_id, glyph_data, is_unlocked, is_translated)
        glyph_display.connect("glyph_clicked", _on_glyph_display_clicked)
        
        glyph_container.add_child(glyph_display)
        glyph_displays.append(glyph_display)

func _on_glyph_display_clicked(glyph_id: String):
    if GameState.unlocked_glyphs.has(glyph_id):
        GameState.select_glyph(glyph_id)
        emit_signal("glyph_clicked", glyph_id)

func _on_glyph_selected(glyph_id: String):
    update_glyph_selection()

func _on_meaning_assigned(glyph_id: String, meaning: String):
    update_glyph_translation(glyph_id, meaning)

func update_glyph_selection():
    for display in glyph_displays:
        display.set_selected(display.glyph_id == GameState.selected_glyph)

func update_glyph_translation(glyph_id: String, meaning: String):
    for display in glyph_displays:
        if display.glyph_id == glyph_id:
            display.set_translated(meaning)
            break

func clear_glyphs():
    for display in glyph_displays:
        display.queue_free()
    glyph_displays.clear()
```

### **7. Audio Manager (Autoload)**

```gdscript
# AudioManager.gd
extends Node

@onready var music_player = AudioStreamPlayer.new()
@onready var sfx_player = AudioStreamPlayer.new()

var music_enabled: bool = true
var sfx_enabled: bool = true
var current_music: AudioStream

func _ready():
    add_child(music_player)
    add_child(sfx_player)
    
    # Load audio settings
    load_audio_settings()

func play_music(stream: AudioStream, loop: bool = true):
    if not music_enabled:
        return
    
    current_music = stream
    music_player.stream = stream
    music_player.play()
    
    if loop:
        music_player.finished.connect(_on_music_finished)

func play_sfx(stream: AudioStream):
    if not sfx_enabled:
        return
    
    sfx_player.stream = stream
    sfx_player.play()

func stop_music():
    music_player.stop()

func toggle_music():
    music_enabled = !music_enabled
    if not music_enabled:
        stop_music()
    save_audio_settings()

func toggle_sfx():
    sfx_enabled = !sfx_enabled
    save_audio_settings()

func _on_music_finished():
    if music_enabled and current_music:
        music_player.play()

func load_audio_settings():
    if FileAccess.file_exists("user://audio_settings.save"):
        var file = FileAccess.open("user://audio_settings.save", FileAccess.READ)
        var settings = JSON.parse_string(file.get_as_text())
        file.close()
        
        if settings:
            music_enabled = settings.get("music_enabled", true)
            sfx_enabled = settings.get("sfx_enabled", true)

func save_audio_settings():
    var settings = {
        "music_enabled": music_enabled,
        "sfx_enabled": sfx_enabled
    }
    
    var file = FileAccess.open("user://audio_settings.save", FileAccess.WRITE)
    file.store_string(JSON.stringify(settings))
    file.close()
```

## 🎨 **UI Scenes and Animations**

### **1. Hexagon Animations**

```gdscript
# HexagonAnimations.gd
extends Node

# Animation states for hexagons
var expand_animation: Animation
var collapse_animation: Animation
var hover_animation: Animation
var click_animation: Animation

func _ready():
    setup_animations()

func setup_animations():
    # Expand animation - hexagon grows from center
    expand_animation = Animation.new()
    var track_index = expand_animation.add_track(Animation.TYPE_VALUE)
    expand_animation.track_set_path(track_index, ".:scale")
    expand_animation.track_insert_key(track_index, 0.0, Vector2.ZERO)
    expand_animation.track_insert_key(track_index, 0.3, Vector2.ONE)
    
    # Collapse animation - hexagon shrinks to center
    collapse_animation = Animation.new()
    track_index = collapse_animation.add_track(Animation.TYPE_VALUE)
    collapse_animation.track_set_path(track_index, ".:scale")
    collapse_animation.track_insert_key(track_index, 0.0, Vector2.ONE)
    collapse_animation.track_insert_key(track_index, 0.3, Vector2.ZERO)
    
    # Hover animation - gentle pulsing
    hover_animation = Animation.new()
    track_index = hover_animation.add_track(Animation.TYPE_VALUE)
    hover_animation.track_set_path(track_index, ".:scale")
    hover_animation.track_insert_key(track_index, 0.0, Vector2.ONE)
    hover_animation.track_insert_key(track_index, 0.5, Vector2(1.1, 1.1))
    hover_animation.track_insert_key(track_index, 1.0, Vector2.ONE)
    hover_animation.loop_mode = Animation.LOOP_PING_PONG
    
    # Click animation - quick scale down and up
    click_animation = Animation.new()
    track_index = click_animation.add_track(Animation.TYPE_VALUE)
    click_animation.track_set_path(track_index, ".:scale")
    click_animation.track_insert_key(track_index, 0.0, Vector2.ONE)
    click_animation.track_insert_key(track_index, 0.1, Vector2(0.9, 0.9))
    click_animation.track_insert_key(track_index, 0.2, Vector2.ONE)
```

### **2. UI Theme and Styling**

```gdscript
# UITheme.gd
extends Resource

@export var primary_color: Color = Color("#F59E0C")
@export var secondary_color: Color = Color("#ffffff")
@export var background_color: Color = Color("#080C10")
@export var accent_color: Color = Color("#ff4e42")
@export var text_color: Color = Color("#f3ede9")

@export var font_primary: Font
@export var font_mono: Font

@export var hexagon_size: Vector2 = Vector2(40, 40)
@export var grid_spacing: float = 60.0
@export var animation_duration: float = 0.3

func apply_theme(node: Control):
    if node.has_method("set_theme"):
        node.set_theme(self)
    
    # Apply colors
    if node.has_method("modulate"):
        node.modulate = primary_color
    
    # Apply fonts
    if node.has_method("add_theme_font_override"):
        node.add_theme_font_override("font", font_primary)
    
    # Recursively apply to children
    for child in node.get_children():
        if child is Control:
            apply_theme(child)
```

## 🎮 **Game Flow and State Machine**

### **1. Main Game Controller**

```gdscript
# Main.gd
extends Node2D

@onready var hexagon_grid = $UI/HexagonGrid
@onready var translation_panel = $UI/TranslationPanel
@onready var transmission_renderer = $UI/TransmissionRenderer
@onready var background_music = $UI/BackgroundMusic

func _ready():
    # Connect signals
    hexagon_grid.connect("hexagon_selected", _on_hexagon_selected)
    translation_panel.connect("synchronize_requested", _on_synchronize_requested)
    translation_panel.connect("next_transmission_requested", _on_next_transmission_requested)
    
    # Initialize game
    GameState.load_game_state()
    start_game()

func start_game():
    # Show welcome modal
    show_welcome_modal()
    
    # Load first transmission
    var first_transmission = DataService.get_transmission(1)
    transmission_renderer.set_transmission(first_transmission)
    
    # Start background music
    AudioManager.play_music(load("res://assets/audio/ambient-alien.ogg"))

func _on_hexagon_selected(hexagon_id: String):
    var selected_glyph = GameState.selected_glyph
    if selected_glyph:
        GameState.assign_meaning(selected_glyph, hexagon_id)

func _on_synchronize_requested():
    var current_transmission_id = GameState.current_transmission_id
    GameState.synchronize_transmission(current_transmission_id)

func _on_next_transmission_requested():
    var next_transmission = DataService.get_transmission(GameState.current_transmission_id + 1)
    if next_transmission:
        transmission_renderer.set_transmission(next_transmission)
        translation_panel.update_progress()

func show_welcome_modal():
    var modal = preload("res://scenes/Modals/WelcomeModal.tscn").instantiate()
    add_child(modal)
    modal.connect("modal_closed", _on_welcome_modal_closed)

func _on_welcome_modal_closed():
    # Start the actual game
    pass
```

## 📊 **Data Files**

### **1. Game Configuration (game_config.json)**

```json
{
  "initial_score": 0,
  "initial_chapter": 1,
  "countdown_duration": 300,
  "hexagon_config": {
    "size": [40, 40],
    "spacing": 60,
    "animation_duration": 0.3
  },
  "unlock_requirements": {
    "i": 1,
    "you": 1,
    "light": 1,
    "world": 2,
    "love": 2,
    "future": 3
  }
}
```

### **2. Glyphs Data (glyphs.json)**

```json
{
  "i": {
    "symbol": "i",
    "confirmed_meaning": "i",
    "decoy_meanings": ["you", "light", "world"],
    "svg_path": "M10 20 L30 20 M20 10 L20 30",
    "svg_viewbox": "0 0 40 40",
    "required_transmission": 1,
    "rotation_degrees": 0
  },
  "you": {
    "symbol": "you",
    "confirmed_meaning": "you",
    "decoy_meanings": ["i", "light", "world"],
    "svg_path": "M5 15 L35 15 M5 25 L35 25",
    "svg_viewbox": "0 0 40 40",
    "required_transmission": 1,
    "rotation_degrees": 0
  }
}
```

### **3. Transmissions Data (transmissions.json)**

```json
[
  {
    "id": 1,
    "context": "First contact",
    "difficulty": 1,
    "chapter": 1,
    "communication_type": "basic",
    "glyphs": ["i", "you", "light"],
    "unlock_requirement": 0
  },
  {
    "id": 2,
    "context": "Understanding",
    "difficulty": 2,
    "chapter": 1,
    "communication_type": "conversation",
    "glyphs": ["world", "love"],
    "unlock_requirement": 1
  }
]
```

## 🚀 **Implementation Steps**

### **Phase 1: Core Systems (Week 1-2)**
1. Set up Godot project structure
2. Implement GameState autoload
3. Create DataService for data management
4. Set up basic UI framework

### **Phase 2: Hexagon System (Week 3-4)**
1. Create hexagon grid layout
2. Implement hexagon selection logic
3. Add hexagon animations
4. Connect to game state

### **Phase 3: Game Logic (Week 5-6)**
1. Implement progressive unlocking
2. Add transmission synchronization
3. Create meaning assignment system
4. Add progress tracking

### **Phase 4: UI and Polish (Week 7-8)**
1. Create transmission renderer
2. Add translation panel
3. Implement modals and overlays
4. Add audio system

### **Phase 5: Testing and Refinement (Week 9-10)**
1. Playtest and balance
2. Fix bugs and edge cases
3. Optimize performance
4. Add final polish

## 🎯 **Key Features to Implement**

1. **Progressive Glyph Unlocking** - Based on transmission completion
2. **Transmission Synchronization** - Gates meaning assignment
3. **Hexagon Grid Selection** - Visual meaning selection
4. **State Persistence** - Save/load game progress
5. **Audio Integration** - Background music and SFX
6. **Responsive UI** - Adapts to different screen sizes
7. **Animation System** - Smooth transitions and feedback
8. **Error Handling** - Graceful failure handling

## 🔧 **Performance Considerations**

1. **Object Pooling** - Reuse hexagon instances
2. **Signal Optimization** - Minimize signal connections
3. **Texture Atlasing** - Combine small textures
4. **Lazy Loading** - Load data as needed
5. **Memory Management** - Proper cleanup of resources

This implementation provides a solid foundation for recreating First-Light in Godot with clean architecture, proper state management, and scalable design patterns.
