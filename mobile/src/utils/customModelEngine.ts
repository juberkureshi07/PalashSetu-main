export interface CustomModelMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  vocabularyCount: number;
  format: 'GGUF' | 'ONNX' | 'JSON_LEXICON';
  loadedAt: string;
}

class CustomModelEngine {
  private activeModelMeta: CustomModelMetadata | null = null;
  private customDictionary: Record<string, string> = {};
  private listeners: Array<(meta: CustomModelMetadata | null) => void> = [];

  constructor() {
    this.loadActiveModelFromStorage();
  }

  private loadActiveModelFromStorage() {
    try {
      const savedMeta = localStorage.getItem('bhashagyan_custom_model_meta');
      const savedDict = localStorage.getItem('bhashagyan_custom_model_dict');
      if (savedMeta && savedDict) {
        this.activeModelMeta = JSON.parse(savedMeta);
        this.customDictionary = JSON.parse(savedDict);
      }
    } catch {
      this.activeModelMeta = null;
      this.customDictionary = {};
    }
  }

  public async loadModelFromFile(file: File): Promise<CustomModelMetadata> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let parsedDict: Record<string, string> = {};
          let format: CustomModelMetadata['format'] = 'JSON_LEXICON';

          if (file.name.endsWith('.json')) {
            const json = JSON.parse(content);
            if (json.dictionary) {
              parsedDict = json.dictionary;
            } else {
              parsedDict = json;
            }
            format = 'JSON_LEXICON';
          } else if (file.name.endsWith('.gguf') || file.name.endsWith('.bin')) {
            // GGUF Binary Manifest Parser simulation
            format = 'GGUF';
            parsedDict = {
              'custom_greeting': 'ᱡᱚᱦᱟᱨ',
              'custom_school': 'ᱟᱥᱲᱟ',
              'custom_book': 'ᱯᱩᱛᱷᱤ',
            };
          } else {
            // ONNX manifest parser simulation
            format = 'ONNX';
            parsedDict = {
              'onnx_hello': 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!',
            };
          }

          const vocabCount = Object.keys(parsedDict).length;
          const meta: CustomModelMetadata = {
            id: 'mod_' + Date.now(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            version: '1.0.0',
            author: 'Custom Field Model',
            vocabularyCount: vocabCount,
            format,
            loadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          this.activeModelMeta = meta;
          this.customDictionary = parsedDict;

          localStorage.setItem('bhashagyan_custom_model_meta', JSON.stringify(meta));
          localStorage.setItem('bhashagyan_custom_model_dict', JSON.stringify(parsedDict));

          this.notifyListeners();
          resolve(meta);
        } catch (err) {
          reject(new Error('Invalid custom model file structure'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read model file'));
      reader.readAsText(file);
    });
  }

  public translate(sourceText: string): string | null {
    if (!this.activeModelMeta || Object.keys(this.customDictionary).length === 0) {
      return null;
    }
    const trimmed = sourceText.trim();
    if (this.customDictionary[trimmed]) {
      return this.customDictionary[trimmed];
    }
    // Partial word lookup
    for (const [key, val] of Object.entries(this.customDictionary)) {
      if (trimmed.includes(key)) {
        return val;
      }
    }
    return null;
  }

  public unloadCustomModel() {
    this.activeModelMeta = null;
    this.customDictionary = {};
    localStorage.removeItem('bhashagyan_custom_model_meta');
    localStorage.removeItem('bhashagyan_custom_model_dict');
    this.notifyListeners();
  }

  public getActiveModel(): CustomModelMetadata | null {
    return this.activeModelMeta;
  }

  public subscribe(fn: (meta: CustomModelMetadata | null) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.activeModelMeta));
  }
}

export const customModelEngine = new CustomModelEngine();
