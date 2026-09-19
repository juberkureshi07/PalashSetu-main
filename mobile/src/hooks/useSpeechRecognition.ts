import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionOptions {
  defaultLang?: string;
}

/**
 * Strips speech recognition artifact loops and repetitions
 * e.g. "कैसे कैसे हो कैसे हो बच्चों कैसे हो बच्चों" -> "कैसे हो बच्चों"
 */
function cleanSpeechText(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();

  // 1. Remove consecutive duplicated words: "कैसे कैसे" -> "कैसे"
  const words = cleaned.split(/\s+/);
  const dedupedWords: string[] = [];
  for (let i = 0; i < words.length; i++) {
    if (i === 0 || words[i].toLowerCase() !== words[i - 1].toLowerCase()) {
      dedupedWords.push(words[i]);
    }
  }
  cleaned = dedupedWords.join(' ');

  // 2. Check if string contains doubled sentence: "कैसे हो बच्चों कैसे हो बच्चों" -> "कैसे हो बच्चों"
  const tokens = cleaned.split(/\s+/);
  if (tokens.length >= 2 && tokens.length % 2 === 0) {
    const mid = tokens.length / 2;
    const firstHalf = tokens.slice(0, mid).join(' ');
    const secondHalf = tokens.slice(mid).join(' ');
    if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
      cleaned = firstHalf;
    }
  }

  // 3. Remove 3x or nx subphrase repetition
  const currentTokens = cleaned.split(/\s+/);
  for (let len = 1; len <= Math.floor(currentTokens.length / 2); len++) {
    const candidate = currentTokens.slice(0, len).join(' ');
    const candidatePattern = new RegExp(`^(${candidate}\\s*)+$`, 'i');
    if (candidatePattern.test(cleaned)) {
      cleaned = candidate;
      break;
    }
  }

  return cleaned;
}

export const useSpeechRecognition = (defaultLang = 'hi-IN') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isHandsFreeMode, setIsHandsFreeMode] = useState(true); // Default: Hands-Free Lecture Mode

  const recognitionRef = useRef<any>(null);
  const wantListeningRef = useRef(false);
  const restartTimerRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or an Android device.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Enable native continuous listening
      recognition.interimResults = true;
      recognition.lang = defaultLang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let bestTranscript = '';
        let isFinalResult = false;

        const startIndex = event.resultIndex !== undefined ? event.resultIndex : 0;
        for (let i = startIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item && item[0] && item[0].transcript) {
            bestTranscript = item[0].transcript;
            if (item.isFinal) {
              isFinalResult = true;
            }
          }
        }

        const cleaned = cleanSpeechText(bestTranscript);
        if (isFinalResult && cleaned) {
          setTranscript(cleaned);
          setInterimTranscript('');
        } else if (cleaned) {
          setInterimTranscript(cleaned);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // Normal during teacher pauses in lecture! Keep mic active in Hands-Free mode.
          if (!wantListeningRef.current) {
            setIsListening(false);
          }
          return;
        }

        if (event.error === 'aborted') {
          // Internal reset or restart, ignore if user wants mic active
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          wantListeningRef.current = false;
          setIsListening(false);
          setError('Microphone permission was denied. Please grant microphone permissions in device settings.');
        } else if (event.error === 'network' || event.error === 'service-not-allowed') {
          wantListeningRef.current = false;
          setIsListening(false);
          setError('✈️ Offline / Airplane Mode: Speech-to-Text requires internet or Android Offline Speech Pack. Use 1-Tap Quick Phrases below for instant offline voice!');
        } else {
          if (!wantListeningRef.current) {
            setIsListening(false);
            setError(`Speech recognition paused (${event.error}). Tap 1-Tap Quick Phrases below for offline voice.`);
          }
        }
      };

      recognition.onend = () => {
        // Auto-restart loop for Hands-Free Lecture Mode
        if (wantListeningRef.current) {
          setIsListening(true);
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (wantListeningRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Ignore if already active
              }
            }
          }, 120);
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } catch (e: any) {
      console.error('Failed to initialize SpeechRecognition:', e);
      setIsSupported(false);
      setError('Failed to initialize speech engine.');
    }

    return () => {
      wantListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [defaultLang]);

  useEffect(() => {
    // Register native Android Speech Recognizer Callbacks
    (window as any).onNativeSpeechResult = (text: string) => {
      if (text) {
        const cleaned = cleanSpeechText(text);
        setTranscript(cleaned);
        setInterimTranscript('');
      }
      setIsListening(false);
    };

    (window as any).onNativeSpeechError = (err: any) => {
      console.warn('Native speech recognizer error:', err);
      setIsListening(false);
      setError('✈️ Offline Speech: Speech recognition paused or offline. Tap any 1-Tap Quick Phrase below for instant voice!');
    };

    (window as any).onNativeSpeechEvent = (evt: string) => {
      if (evt === 'ready' || evt === 'speaking') {
        setIsListening(true);
        setError(null);
      } else if (evt === 'end') {
        setIsListening(false);
      }
    };
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    wantListeningRef.current = true;
    setIsListening(true);

    // 1. Try Native Android Speech Recognizer (Supports 100% Offline Intent)
    if ((window as any).AndroidVoiceBridge?.startListening) {
      try {
        (window as any).AndroidVoiceBridge.startListening();
        return;
      } catch (e) {
        console.warn('Native startListening failed, falling back to Web Speech API', e);
      }
    }

    if (!recognitionRef.current) {
      wantListeningRef.current = false;
      setIsListening(false);
      setError('Speech recognition engine not initialized. Tap 1-Tap Quick Phrases below for offline voice.');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started, re-sync wantListening state
    }
  }, []);

  const stopListening = useCallback(() => {
    wantListeningRef.current = false;
    setIsListening(false);

    if ((window as any).AndroidVoiceBridge?.stopListening) {
      try {
        (window as any).AndroidVoiceBridge.stopListening();
      } catch (e) {}
    }

    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    setTranscript,
    startListening,
    stopListening,
    error,
    isSupported,
    isHandsFreeMode,
    setIsHandsFreeMode,
  };
};
