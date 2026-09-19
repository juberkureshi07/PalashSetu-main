# Codebase Inventory & Reconciled Architecture Map

**Project:** SetuVani (formerly PalashSetu) — Mother Tongue-Based Multilingual Education (MTB-MLE)  
**Team:** Ambivert's Team  
**Date:** September 19, 2026  
**Reconciliation Version:** 1.0 (Milestone 0 Completed)

---

## 1. Executive Summary of Inventory

This document reconciles the downloaded codebase snapshot against the initial assumptions in the Modification PRD. 

### Key Findings & Architecture Discrepancies
1. **Client-Side Standalone Architecture (No Python/FastAPI backend needed at runtime):**
   - **PRD Assumption:** Expected a FastAPI + SQLAlchemy backend running IndicTrans2 320M model server with SQLite database.
   - **Actual Codebase:** The application is a **100% standalone React 18.3 + TypeScript + Vite 5 + Capacitor 6.1** web and mobile app. The translation engine is a pure client-side TypeScript hash lookup engine with 7,503 curated entries (`mobile/src/data/santali_comprehensive_dictionary.ts`) combined with a 4-tier fallback pipeline (Direct Lookup $\to$ Phrasebook Regex Parser $\to$ Grammatical Suffix Parser $\to$ Ol Chiki Transliteration).
   - **TTS Synthesizer:** On-device acoustic mapping engine (`mobile/src/utils/santaliSpeech.ts`) compiling Ol Chiki Unicode syllables into phonetic Devanagari phonemes pronounced via offline Android/browser SpeechSynthesis (`hi-IN`).
   - **Persistence:** Local persistence uses Capacitor Preferences & `localStorage` (`authService.ts`, `feedbackService.ts`).

2. **Translation Cache Mechanism:**
   - **PRD Assumption:** LRU in-memory cache plus SQLite database.
   - **Actual Codebase:** JS in-memory dictionary map (`SANTALI_COMPREHENSIVE_DICTIONARY`). 
   - **Impact for Feature 3 (Contributions):** We will build a client-side `contributionService.ts` using `localStorage` / Capacitor Preferences for storing pending contributions. When approved by the teacher, contributions dynamically inject into the active in-memory dictionary map without breaking existing data structures.

3. **Live Classroom Networking (`/translate`):**
   - **PRD Assumption:** Check if multi-device broadcast already exists.
   - **Actual Codebase:** `LiveTranslation.tsx` is strictly single-device (Walkie-Talkie & Student tap mode). No multi-device network broadcast exists.
   - **Impact for Feature 4 (Classroom Broadcast):** Classroom LAN caption broadcast is **new additive functionality**. We will implement a peer-to-peer / local network broadcast manager (`broadcastService.ts`) using WebRTC / WebSockets / BroadcastChannel enabling student devices on the same local network / hotspot to receive real-time captions.

4. **Git Repository Status:**
   - Verified that `.git` folder is absent from the snapshot (`Test-Path .git` returned `False`).
   - Project rebranding to **SetuVani (Ambivert's Team)** will be applied across package metadata, configs, UI headers, and documentation.

---

## 2. Inventory of Codebase Structure

```
PalashSetu-main/
├── api/                        # Optional Vercel serverless functions (complaints.ts, feedback.ts)
├── data/                       # Raw & processed vocabulary data & schema.json
│   └── schema.json
├── mobile/                     # Main React 18 + TS + Vite + Capacitor App
│   ├── android/                # Native Android build project (Capacitor API 34)
│   ├── src/
│   │   ├── components/         # Header, Layout, Sidebar, OfflineVoiceModal
│   │   ├── context/            # ThemeContext
│   │   ├── data/               # Dictionary (7.5k words), NIPUN lessons, JCERT textbooks, flashcards
│   │   ├── hooks/              # useSpeechRecognition
│   │   ├── pages/              # 10 core pages (Dashboard, LiveTranslation, Flashcards, Lessons, etc.)
│   │   ├── services/           # authService, feedbackService
│   │   ├── utils/              # santaliSpeech (Acoustic TTS Compiler), sfx
│   │   └── App.tsx             # React Router 6 route declarations
│   ├── package.json            # React 18.3, Vite 5, TailwindCSS 3.4, Lucide icons
│   └── capacitor.config.ts     # Capacitor wrapper configuration
├── models/                     # Placeholder README
├── scripts/                    # test_offline_engine.js, setup_mobile.py, build_apk.py
└── README.md                   # Core system documentation
```

---

## 3. Reconciled Plan for New Features

| Feature | PRD Goal | Reconciled Implementation Strategy |
|---|---|---|
| **Feature 1: Kid-Facing Gamified Practice Mode** | Audio-first, icon-first game mode for Grade 1-3 non-reading children; no leaderboards. | New route `/practice` in `mobile/src/pages/PracticeMode.tsx`. Data-driven off `nipunDecks.ts` & dictionary. 3 games: Ol Chiki Sound Matching, Picture-Word Audio Matching, Counting Practice. |
| **Feature 2: Teacher Pronunciation Coaching** | Compare teacher recording to reference Santali audio clip; honest framing ( rhtyhm/tone comparison). | Integrated module in `/pronounce` or `/practice`. Web Audio API signal comparison (spectral energy/ rhtyhm envelope + DTW algorithm) with side-by-side audio playback fallback. |
| **Feature 3: Community Content-Contribution Loop** | Allow community to record new phrases or correct translations with offline moderation gate. | New route `/contribute` & `/contribute/review`. Client-side `contributionService.ts` managing `pending` $\to$ `approved` flow. Approved entries inject into live translation dictionary. |
| **Feature 4: Classroom LAN Caption Broadcast** | Stream teacher's live captions to student devices on local network. | Added to `/translate` & student route `/student-view`. `broadcastService.ts` sending real-time translated text over local WebRTC/BroadcastChannel network. |

---

## 4. Rebranding & Identity Actions

- **New App Name:** SetuVani (`सेतुवाणी` — Bridge of Voices for Mother Tongue Pedagogy)
- **Team:** Ambivert's Team
- **Updates Required:** `package.json`, `capacitor.config.ts`, `Header.tsx`, `Sidebar.tsx`, `Dashboard.tsx`, `AuthLogin.tsx`, and `README.md`.
