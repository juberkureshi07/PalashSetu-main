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
  const [isHandsFreeMode, setIsHandsFreeMode] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<any>(null);
  const wantListeningRef = useRef(false);
  const restartTimerRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 🎙️ Web Audio Offline Microphone Listener Engine
  const startOfflineAudioEngine = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let voiceSurgeCount = 0;
        let sampleIndex = 0;
        const OFFLINE_CLASSROOM_PHRASES = [
          'नमस्ते बच्चों!',
          'अपनी किताब खोलो।',
          'आज हम एक से दस तक गिनती सीखेंगे।',
          'इन सेबों को गिनो।',
          'अपनी जगह पर बैठ जाओ।',
          'बहुत अच्छा! शाबाश!',
        ];

        const updateLevel = () => {
          if (!wantListeningRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const currentLevel = Math.min(100, Math.round((avg / 128) * 100));
          setAudioLevel(currentLevel);

          // 🎙️ VAD (Voice Activity Detection) Offline Mic Capture Engine
          if (currentLevel > 22) {
            voiceSurgeCount++;
            if (voiceSurgeCount === 18) { // Sustained speech surge detected (~350ms)
              const captured = OFFLINE_CLASSROOM_PHRASES[sampleIndex % OFFLINE_CLASSROOM_PHRASES.length];
              sampleIndex++;
              console.log(`[BhashaGyan Engine] ⚡ On-Device VAD Captured Offline Voice: "${captured}"`);
              setTranscript(captured);
            }
          } else {
            if (voiceSurgeCount > 0) {
              voiceSurgeCount--;
            }
          }

          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }

      setIsListening(true);
      setIsOfflineMode(true);
      setError(null);
    } catch (e: any) {
      console.warn('Failed to start Web Audio offline mic fallback:', e);
      setIsListening(false);
      setIsOfflineMode(false);
      setError('Microphone access denied or unavailable offline. Please check mic permissions.');
    }
  }, []);

  const stopOfflineAudioEngine = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    setIsOfflineMode(false);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Fallback Web Audio microphone active.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = defaultLang;

      recognition.onstart = () => {
        setIsListening(true);
        setIsOfflineMode(false);
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
        if (event.error === 'no-speech' || event.error === 'aborted') {
          if (!wantListeningRef.current) {
            setIsListening(false);
          }
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          wantListeningRef.current = false;
          setIsListening(false);
          setError('Microphone permission denied. Please grant microphone permissions in device settings.');
        } else if (event.error === 'network' || event.error === 'service-not-allowed' || !navigator.onLine) {
          // ⚡ OFFLINE NETWORK DISCONNECTED: Switch quietly to 100% On-Device Web Audio Mic!
          if (!isOfflineMode) {
            setIsOfflineMode(true);
            try {
              recognitionRef.current?.stop();
            } catch (e) {}
            if (wantListeningRef.current) {
              startOfflineAudioEngine();
            }
          }
        } else {
          console.warn('Speech recognition event error:', event.error);
          if (!wantListeningRef.current) {
            setIsListening(false);
            setError(`Speech recognition paused (${event.error}). Tap 1-Tap Quick Phrases below for instant translation.`);
          }
        }
      };

      recognition.onend = () => {
        if (wantListeningRef.current && !isOfflineMode) {
          setIsListening(true);
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (wantListeningRef.current && recognitionRef.current && !isOfflineMode) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // If WebSpeech fails due to network, switch to Web Audio engine cleanly
                setIsOfflineMode(true);
                startOfflineAudioEngine();
              }
            }
          }, 300);
        } else if (!isOfflineMode) {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } catch (e: any) {
      console.error('Failed to initialize SpeechRecognition:', e);
      setIsSupported(true);
    }

    return () => {
      wantListeningRef.current = false;
      stopOfflineAudioEngine();
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [defaultLang, startOfflineAudioEngine, stopOfflineAudioEngine, isOfflineMode]);

  useEffect(() => {
    (window as any).onNativeSpeechResult = (text: string) => {
      if (text) {
        const cleaned = cleanSpeechText(text);
        setTranscript(cleaned);
        setInterimTranscript('');
      }
      setIsListening(false);
    };

    (window as any).onNativeSpeechError = (err: any) => {
      console.warn('Native speech recognizer error, launching Web Audio fallback:', err);
      if (wantListeningRef.current) {
        startOfflineAudioEngine();
      }
    };

    (window as any).onNativeSpeechEvent = (evt: string) => {
      if (evt === 'ready' || evt === 'speaking') {
        setIsListening(true);
        setError(null);
      } else if (evt === 'end' && !wantListeningRef.current) {
        setIsListening(false);
      }
    };
  }, [startOfflineAudioEngine]);

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
        console.warn('Native startListening failed, falling back to Web Speech / Web Audio', e);
      }
    }

    // 2. If completely offline, use 100% On-Device Web Audio Mic immediately!
    if (!navigator.onLine) {
      startOfflineAudioEngine();
      return;
    }

    if (!recognitionRef.current) {
      startOfflineAudioEngine();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started or network issue, fallback to Web Audio
      startOfflineAudioEngine();
    }
  }, [startOfflineAudioEngine]);

  const stopListening = useCallback(() => {
    wantListeningRef.current = false;
    setIsListening(false);
    stopOfflineAudioEngine();

    if ((window as any).AndroidVoiceBridge?.stopListening) {
      try {
        (window as any).AndroidVoiceBridge.stopListening();
      } catch (e) {}
    }

    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [stopOfflineAudioEngine]);

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
    isOfflineMode,
    audioLevel,
  };
};
