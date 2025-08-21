export interface Symbol {
  id: string;
  name: string;
  svgPath: string;
  rotation: number;
  primaryWord: string;
  associatedWords: string[];
}

export interface SymbolWordMap {
  [word: string]: Symbol[];
}

// Import SVG paths from the centralized file
import svgPaths from './svg-paths.ts';

export const symbolWordAssociations = {
  "symbols": [
    {
      "id": "love",
      "name": "Love",
      "svgPath": "p95c0990",
      "rotation": 0,
      "primaryWord": "love",
      "associatedWords": [
        "love",
        "longing",
        "gift",
        "want",
        "us",
        "miss",
        "warmth",
        "give"
      ]
    },
    {
      "id": "light",
      "name": "Light",
      "svgPath": "p2c38e200",
      "rotation": 90,
      "primaryWord": "light",
      "associatedWords": [
      
        "see",
        "stars",
        "light",
        "brightness",
        "glow",
        "reflect",
        "gaze",
        "vision"
      ]
    },
    {
      "id": "sound",
      "name": "Sound",
      "svgPath": "pc48cd80",
      "rotation": 0,
      "primaryWord": "sound",
      "associatedWords": [
      
        "breath",
        "song",
        "voice",
        "listen",
        "sound",
        "sing",
        "pulse",
        "pulses",
        "rhythm",
        "taught"
      ]
    },
    {
      "id": "shape",
      "name": "Shape",
      "svgPath": "p37bae300",
      "rotation": 0,
      "primaryWord": "shape",
      "associatedWords": [
        "shape",
        "shapes",
        "form",
        "live",
        "life",
        "symbol"
      ]
    },
    {
      "id": "reach",
      "name": "Reach",
      "svgPath": "p16e3b380",
      "rotation": 0,
      "primaryWord": "reach",
      "associatedWords": [
        "distance",
        "far",
        "reaching",
        "reach",
        "chase",
        "find",
        "escape",
        "arrive"
      ]
    },
    {
      "id": "remember",
      "name": "Remember",
      "svgPath": "p2fc74c00",
      "rotation": 270,
      "primaryWord": "remember",
      "associatedWords": [
        "remember",
        "memory",
        "ever",
        "forever",
        "endless",
        "exist"
      ]
    },
    {
      "id": "not",
      "name": "Not",
      "svgPath": "p2394e530",
      "rotation": 270,
      "primaryWord": "not",
      "associatedWords": [
        "not",
        "never",
        "opposite"
      ]
    },
    {
      "id": "loop",
      "name": "Loop",
      "svgPath": "p1aa32600",
      "rotation": 0,
      "primaryWord": "loop",
      "associatedWords": [
        "loop",
        "90 days",
        "orbit",
        "world",
        "worlds",
        "alignment"
      ]
    },
    {
      "id": "time",
      "name": "Time",
      "svgPath": "pd285e00",
      "rotation": 0,
      "primaryWord": "time",
      "associatedWords": [
        "end",
        "fade",
        "time",
        "mourn",
        "absence"
      ]
    },
    {
      "id": "sky",
      "name": "Sky",
      "svgPath": "pd285e00",
      "rotation": 180,
      "primaryWord": "sky",
      "associatedWords": [
        "sky"
      ]
    },
    {
      "id": "creature",
      "name": "Creature",
      "svgPath": "p23d02500",
      "rotation": 0,
      "primaryWord": "creature",
      "associatedWords": [
        "creature",
        "creatures"
      ]
    },
    {
      "id": "you",
      "name": "You",
      "svgPath": "p37bae300",
      "rotation": 90,
      "primaryWord": "you",
      "associatedWords": [
        "you",
        "your",
        "yours"
      ]
    },
    {
      "id": "i",
      "name": "I",
      "svgPath": "p37bae300",
      "rotation": 180,
      "primaryWord": "i",
      "associatedWords": [
        "i",
        "me",
        "my",
        "mine"
      ]
    },
    {
      "id": "us",
      "name": "Us",
      "svgPath": "p37bae300",
      "rotation": 270,
      "primaryWord": "us",
      "associatedWords": [
        "us",
        "we",
        "our",
        "ours"
      ]
    }
  ]
};

// Export SVG paths for use in components
export { svgPaths };

export const createWordToSymbolMap = (): SymbolWordMap => {
  const wordMap: SymbolWordMap = {};
  
  symbolWordAssociations.symbols.forEach(symbol => {
    // Add primary word
    if (!wordMap[symbol.primaryWord]) {
      wordMap[symbol.primaryWord] = [];
    }
    wordMap[symbol.primaryWord].push(symbol);
    
    // Add associated words
    symbol.associatedWords.forEach(word => {
      if (!wordMap[word]) {
        wordMap[word] = [];
      }
      wordMap[word].push(symbol);
    });
  });
  
  return wordMap;
};

export const getAllWords = (): string[] => {
  const words = new Set<string>();
  
  symbolWordAssociations.symbols.forEach(symbol => {
    words.add(symbol.primaryWord);
    symbol.associatedWords.forEach(word => words.add(word));
  });
  
  return Array.from(words).sort();
};

export const findSymbolsByWord = (searchWord: string): Symbol[] => {
  const wordMap = createWordToSymbolMap();
  return wordMap[searchWord.toLowerCase()] || [];
};

export const getIntersectionWords = (): { word: string; symbols: Symbol[] }[] => {
  const wordMap = createWordToSymbolMap();
  return Object.entries(wordMap)
    .filter(([_, symbols]) => symbols.length > 1)
    .map(([word, symbols]) => ({ word, symbols }));
};

export const validateSentence = (sentence: string): {
  isValid: boolean;
  invalidWords: string[];
  wordSymbolMap: { [word: string]: Symbol[] };
} => {
  const words = sentence.toLowerCase().split(/\s+/);
  const wordMap = createWordToSymbolMap();
  const invalidWords: string[] = [];
  const wordSymbolMap: { [word: string]: Symbol[] } = {};
  
  words.forEach(word => {
    const symbols = wordMap[word];
    if (symbols && symbols.length > 0) {
      wordSymbolMap[word] = symbols;
    } else {
      invalidWords.push(word);
    }
  });
  
  return {
    isValid: invalidWords.length === 0,
    invalidWords,
    wordSymbolMap
  };
};

export const getStatistics = () => {
  const symbols = symbolWordAssociations.symbols;
  const allWords = getAllWords();
  
  return {
    totalSymbols: symbols.length,
    totalWords: allWords.length,
    averageWordsPerSymbol: allWords.length / symbols.length,
    symbolsWithMultipleWords: symbols.filter(s => s.associatedWords.length > 0).length,
    intersectionWords: getIntersectionWords().length
  };
};

export const searchWords = (query: string): string[] => {
  const allWords = getAllWords();
  const searchTerm = query.toLowerCase();
  
  return allWords.filter(word => 
    word.toLowerCase().includes(searchTerm)
  );
};

export const getSymbolById = (id: string): Symbol | undefined => {
  return symbolWordAssociations.symbols.find(symbol => symbol.id === id);
};