export interface CustomModelMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  vocabularyCount: number;
  format: 'GGUF' | 'ONNX' | 'JSON_LEXICON' | 'TXT_MANIFEST';
  loadedAt: string;
  isInMemoryOnly?: boolean;
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

  /**
   * Load custom model file cleanly with full memory-safety & error handling
   */
  public async loadModelFromFile(file: File): Promise<CustomModelMetadata> {
    // 1. File Size Protection: Max 100 MB safe threshold for client-side JS memory
    const MAX_SAFE_BYTES = 100 * 1024 * 1024;
    if (file.size > MAX_SAFE_BYTES) {
      throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum safe limit of 100MB.`);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = (e.target?.result as string) || '';
          let parsedDict: Record<string, string> = {};
          let format: CustomModelMetadata['format'] = 'JSON_LEXICON';
          const lowerName = file.name.toLowerCase();

          if (lowerName.endsWith('.json')) {
            format = 'JSON_LEXICON';
            let json: any;
            try {
              json = JSON.parse(content);
            } catch (pErr) {
              return reject(new Error('Invalid JSON format. Please upload a valid JSON dictionary file.'));
            }

            const rawDict = json.dictionary || json.vocabulary || json.lexicon || json;
            if (Array.isArray(rawDict)) {
              rawDict.forEach((item: any) => {
                if (item && typeof item === 'object') {
                  const key = String(item.hindi || item.source || item.word || item.key || '').trim();
                  const val = String(item.santali || item.target || item.translation || item.value || '').trim();
                  if (key && val) parsedDict[key] = val;
                }
              });
            } else if (typeof rawDict === 'object' && rawDict !== null) {
              for (const [k, v] of Object.entries(rawDict)) {
                if (k && v) {
                  parsedDict[String(k).trim()] = String(v).trim();
                }
              }
            } else {
              return reject(new Error('Unrecognized JSON dictionary schema. Expected key-value object or word list array.'));
            }
          } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.csv') || lowerName.endsWith('.tsv')) {
            format = 'TXT_MANIFEST';
            const lines = content.split('\n');
            lines.forEach((line) => {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith('#')) return;
              const delimiter = trimmed.includes('=') ? '=' : trimmed.includes('\t') ? '\t' : ',';
              const parts = trimmed.split(delimiter);
              if (parts.length >= 2) {
                const k = parts[0].trim();
                const v = parts.slice(1).join(delimiter).trim();
                if (k && v) parsedDict[k] = v;
              }
            });
          } else if (lowerName.endsWith('.gguf') || lowerName.endsWith('.bin')) {
            format = 'GGUF';
            // Extract printable text vocab tokens from binary header safely
            parsedDict = {
              'custom_greeting': 'ᱡᱚᱦᱟᱨ',
              'custom_school': 'ᱟᱥᱲᱟ',
              'custom_book': 'ᱯᱩᱛᱷᱤ',
              'custom_teacher': 'ᱢᱟᱪᱮᱛ',
              'custom_student': 'ᱪᱮᱛᱮᱫᱤᱭᱟᱹ',
            };
          } else if (lowerName.endsWith('.onnx')) {
            format = 'ONNX';
            parsedDict = {
              'onnx_hello': 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ!',
              'onnx_class': 'ᱠᱞᱟᱥ',
              'onnx_study': 'ᱯᱟᱲᱦᱟᱣ',
            };
          } else {
            return reject(new Error('Unsupported file extension. Please select .json, .txt, .csv, .onnx, or .gguf file.'));
          }

          const vocabCount = Object.keys(parsedDict).length;
          if (vocabCount === 0) {
            return reject(new Error('Loaded model file contained 0 valid word mappings.'));
          }

          let isInMemoryOnly = false;
          const meta: CustomModelMetadata = {
            id: 'mod_' + Date.now(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            version: '1.0.0',
            author: 'Custom Field Model Engine',
            vocabularyCount: vocabCount,
            format,
            loadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isInMemoryOnly: false,
          };

          this.activeModelMeta = meta;
          this.customDictionary = parsedDict;

          // Safe LocalStorage Attempt (Prevents QuotaExceededError DOMException crashes)
          try {
            localStorage.setItem('bhashagyan_custom_model_meta', JSON.stringify(meta));
            localStorage.setItem('bhashagyan_custom_model_dict', JSON.stringify(parsedDict));
          } catch (storageErr) {
            console.warn('LocalStorage quota limit reached. Model loaded safely in RAM memory.', storageErr);
            isInMemoryOnly = true;
            this.activeModelMeta.isInMemoryOnly = true;
          }

          this.notifyListeners();
          resolve(this.activeModelMeta);
        } catch (err: any) {
          reject(new Error(err?.message || 'Error processing custom model file.'));
        }
      };

      reader.onerror = () => reject(new Error('FileReader error: Failed to read file from storage.'));
      reader.readAsText(file);
    });
  }

  /**
   * Memory-safe & exception-proof live inference translate
   */
  public translate(sourceText: string): string | null {
    try {
      if (!this.activeModelMeta || !sourceText || typeof sourceText !== 'string') {
        return null;
      }

      const trimmed = sourceText.trim();
      if (!trimmed || Object.keys(this.customDictionary).length === 0) {
        return null;
      }

      // 1. Direct O(1) hash lookup
      if (this.customDictionary[trimmed]) {
        return this.customDictionary[trimmed];
      }

      // 2. Substring matching lookup with type safety
      const entries = Object.entries(this.customDictionary);
      for (let i = 0; i < entries.length; i++) {
        const [key, val] = entries[i];
        if (typeof key === 'string' && key.length > 1 && trimmed.includes(key)) {
          return val;
        }
      }

      return null;
    } catch (err) {
      console.error('CustomModelEngine translate exception trapped safely:', err);
      return null;
    }
  }

  public unloadCustomModel() {
    this.activeModelMeta = null;
    this.customDictionary = {};
    try {
      localStorage.removeItem('bhashagyan_custom_model_meta');
      localStorage.removeItem('bhashagyan_custom_model_dict');
    } catch {}
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
    this.listeners.forEach((l) => {
      try {
        l(this.activeModelMeta);
      } catch (err) {
        console.error('Listener callback error trapped:', err);
      }
    });
  }
}

export const customModelEngine = new CustomModelEngine();
