# 🎮 First Light - Unity Build Instructions

## 📋 Project Overview
**First Light** is an alien language translation puzzle game where players decode mysterious glyphs from interdimensional transmissions. The game features linguistic puzzles, narrative storytelling, and cosmic romance themes.

**Last Updated:** August 24, 2025

---

## 🛠️ Unity Setup Requirements

### **Unity Version**
- **Unity 2022.3 LTS** or newer
- **Platform Target**: PC/Mac/Linux (WebGL for browser deployment)

### **Required Unity Packages**
- **TextMeshPro** (auto-import on first use)
- **Input System** (1.7+) → Project Settings ▸ Player ▸ Active Input Handling = **Input System Package (New)**
- **Vector Graphics** (com.unity.vectorgraphics) for SVG import
- **Addressables** (com.unity.addressables) for runtime asset loading
- **Unity Test Framework** for play/edit mode tests

> **Optional**: **Newtonsoft Json** (com.unity.nuget.newtonsoft-json) if you prefer dictionary serialization without DTOs.

## 🗂️ Project Structure

```
Assets/
├── Art/
│   ├── Glyphs/ (SVG)               ← Vector Graphics import
│   └── UI/
├── Audio/
│   ├── BGM/
│   └── SFX/
├── Data/
│   └── StreamingAssets/            ← WebGL fallback
│       ├── glyphs.json
│       ├── narrativeTransmissions.json
│       └── gameConfig.json
├── Prefabs/
│   └── UI/
│       ├── GlyphDisplay.prefab
│       ├── HexagonButton.prefab
│       └── TransmissionPanel.prefab
├── Scenes/
│   ├── MainMenu.unity
│   ├── Game.unity
│   └── EndGame.unity
├── Scripts/
│   ├── Core/
│   ├── Data/
│   ├── Save/
│   ├── UI/
│   └── Utils/
├── UI/
│   ├── UXML/                       ← UI Toolkit shell
│   │   ├── GameShell.uxml
│   │   ├── TransmissionList.uxml
│   │   ├── DictionaryPanel.uxml
│   │   └── Terminal.uxml
│   └── USS/                        ← UI Toolkit styling
│       ├── Theme.uss
│       ├── Panels.uss
│       └── States.uss
└── AddressableGroups/              ← runtime asset loading
    ├── Sprites_Glyphs/
    ├── Audio_BGM/
    ├── Audio_SFX/
    └── UI_Prefabs/
```

> **Addressables**: Create groups `Sprites_Glyphs`, `Audio_BGM`, `Audio_SFX`, `UI_Prefabs`. Label glyph entries with `glyph/*`.

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

## 🔧 Core Implementation

### **1. Data Model & Serialization**

Unity `JsonUtility` doesn't serialize `Dictionary<>`/`HashSet<>`. Use DTOs:

```csharp
[System.Serializable]
public class StringPair { public string key; public string value; }

[System.Serializable]
public class SaveDataDTO {
    public int currentChapter;
    public int currentTransmissionIndex;
    public List<StringPair> translationState = new();  // Dict substitute
    public List<int> synchronizedTransmissions = new();
    public string lastSaveTimeIso;
}

public static class SaveConverters {
    public static SaveDataDTO ToDto(GameStateModel s) => new SaveDataDTO {
        currentChapter = s.CurrentChapter,
        translationState = s.TranslationState
            .Select(kv => new StringPair{ key = kv.Key, value = kv.Value}).ToList(),
        synchronizedTransmissions = s.SynchronizedTransmissions.ToList()
    };
}
```

### **2. Game State Management**

```csharp
public sealed class GameState : MonoBehaviour
{
    public static GameState I { get; private set; }
    public readonly GameStateModel Model = new();
    
    private void Awake()
    {
        if (I == null) { I = this; DontDestroyOnLoad(gameObject); }
        else Destroy(gameObject);
    }
    
    public void MarkTransmissionSynchronized(int transmissionId)
    {
        Model.SynchronizedTransmissions.Add(transmissionId);
        EventHub.RaiseTransmissionCompleted(transmissionId);
    }
}
```

### **3. Data Service System**

```csharp
public sealed class DataService : MonoBehaviour
{
    public static DataService I { get; private set; }

    [SerializeField] private TextAsset glyphsDataFallback;
    [SerializeField] private TextAsset transmissionsDataFallback;

    private GlyphData[] _glyphs;
    private TransmissionData[] _transmissions;

    public IEnumerator Initialize() {
        // Try StreamingAssets (WebGL), else fallback to bundled TextAssets
        string glyphsJson = yield return LoadJson("glyphs.json", glyphsDataFallback);
        string txJson = yield return LoadJson("narrativeTransmissions.json", transmissionsDataFallback);

        _glyphs = JsonUtilityExt.FromJsonArray<GlyphData>(glyphsJson);
        _transmissions = JsonUtilityExt.FromJsonArray<TransmissionData>(txJson);
    }

    public bool IsGlyphUnlocked(string id) { 
        var g = GetGlyph(id); 
        return g != null && g.unlockChapter <= GameState.I.Model.CurrentChapter; 
    }
}
```

### **4. Event System**

```csharp
public static class EventHub {
    public static event System.Action<string> GlyphSelected;
    public static event System.Action<string,string> GlyphTranslated;
    public static event System.Action<int> TransmissionCompleted;

    public static void RaiseGlyphSelected(string id) => GlyphSelected?.Invoke(id);
    public static void RaiseGlyphTranslated(string id, string m) => GlyphTranslated?.Invoke(id, m);
    public static void RaiseTransmissionCompleted(int id) => TransmissionCompleted?.Invoke(id);
}
```

## 🎨 UI Architecture

### **Hybrid Approach**
- **UI Toolkit**: Main interface panels (transmission list, dictionary, terminal)
- **UGUI**: Animated hexagon selector overlay

### **Layout Structure**
- **Left Panel**: Transmission list with completion status
- **Center Panel**: Active transmission with glyph display
- **Right Panel**: Dictionary and reference information  
- **Bottom Panel**: Terminal messages and system feedback
- **Overlay**: UGUI hexagon selector for meaning selection

## 🔊 Audio System

```csharp
public sealed class AudioManager : MonoBehaviour
{
    [SerializeField] private UnityEngine.Audio.AudioMixer mixer;
    [SerializeField] private AudioSource bgm, sfx;
    
    public void PlayBgm(AudioClip clip) { 
        if (bgm.clip == clip) return; 
        bgm.clip = clip; 
        bgm.loop = true; 
        bgm.Play(); 
    }
    
    public void PlaySfx(AudioClip clip) { 
        sfx.PlayOneShot(clip); 
    }
}
```

## 📊 Save System

```csharp
public sealed class SaveSystem : MonoBehaviour
{
    public static SaveSystem I { get; private set; }
    const string SaveFile = "firstlight_save.json";
    const string SaveKey = "FirstLight_SaveData";

    public void Save() {
        var dto = SaveConverters.ToDto(GameState.I.Model);
        string json = JsonUtility.ToJson(dto);
#if UNITY_WEBGL && !UNITY_EDITOR
        PlayerPrefs.SetString(SaveKey, json); 
        PlayerPrefs.Save();
#else
        string path = System.IO.Path.Combine(Application.persistentDataPath, SaveFile);
        System.IO.File.WriteAllText(path, json);
#endif
    }
}
```

## 🌐 WebGL Build Settings

### **Player Settings → WebGL**
- **Compression Format**: Brotli
- **Data Caching**: Enabled
- **Memory Size**: 512 MB (adjust after profiling)
- **Exceptions**: `Explicitly Thrown Exceptions Only`
- **WebGL 2.0**: On

## 🚀 Development Plan

### **Sprint 1: Core Systems (1 week)**
- [ ] Project setup with required packages
- [ ] Basic UI shell (UI Toolkit panels)
- [ ] Data loading system
- [ ] Glyph display and selection
- [ ] Hexagon selector with meaning choice
- [ ] Translation validation and progress
- [ ] Basic save/load system

### **Sprint 2: Game Loop (1 week)**
- [ ] Full transmission cycle
- [ ] Chapter progression system
- [ ] Audio system integration
- [ ] Performance optimization
- [ ] Cross-platform testing
- [ ] Final polish and bug fixes

## 📋 Key Implementation Notes

### **SVG Import**
- Use Unity's Vector Graphics package for automatic SVG handling
- Set **Generate Physics Shape**: Off for performance
- Mark as **Addressable** for runtime loading

### **Glyph Unlocking Logic**
1. Transmission viewed → unlocks specific glyphs
2. Player clicks unlocked glyph → hexagon selector appears
3. Correct selection → glyph marked as translated
4. All unlocked glyphs translated → transmission synchronized
5. Synchronized transmission → next transmission unlocks

### **Performance Considerations**
- Object pooling for hexagon buttons
- Lazy loading of transmission data
- Caching of frequently accessed glyph data
- Batch UI updates for better performance

---

**Document Version**: 2.0  
**Last Updated**: August 24, 2025  
**Target Unity Version**: 2022.3 LTS