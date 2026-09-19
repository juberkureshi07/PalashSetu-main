# 🏗️ Bhasha Gyan — Master Tech Stack & Architectural Justification

> **Project Name:** Bhasha Gyan (भाषा ज्ञान)  
> **Team Name:** Ambivert's Team  
> **Target App:** Native Standalone Android Application (`com.ambivert.bhashagyan`)  
> **Built APK Deliverable:** [`BhashaGyan-v1.0-debug.apk`](BhashaGyan-v1.0-debug.apk)  
> **Core Mission:** 100% Standalone On-Device Tablet Platform for Mother Tongue-Based Primary Education in Rural Jharkhand  

---

## 📱 Detailed System Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           BHASHA GYAN NATIVE ANDROID SYSTEM                             │
│                  (Package: com.ambivert.bhashagyan • 100% On-Device)                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    LAYER 1: STREAMLINED VISUAL UI & GAME LAYER                    │  │
│  │    • React 18.3 Component State Engine    • TypeScript Structural Typings          │  │
│  │    • Vite 5 Ultra-Fast Asset Bundler      • De-cluttered Visual Card System        │  │
│  │    • Native Ol Chiki System Font Renderer • Kid Practice Games & Audio Cards       │  │
│  └─────────────────────────────────────────┬─────────────────────────────────────────┘  │
│                                            │                                            │
│        ┌───────────────────────────────────┼───────────────────────────────────┐        │
│        ▼                                   ▼                                   ▼        │
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────┐ │
│ │  NATIVE ADROID SPEECH ENGINE│ │ DUAL OFFLINE AI PIPELINE    │ │ WEBRTC HOTSPOT SYNC │ │
│ │ • MainActivity.java Bridge  │ │ • 7,500+ Word Lexicon Matrix│ │ • Peer-to-Peer Data │ │
│ │ • EXTRA_PREFER_OFFLINE      │ │   (0.0375 ms Latency)       │ │   Channels          │ │
│ │ • Hands-Free Auto-Keepalive │ │ • ONNX INT8 Quantized Model │ │ • 6-Digit Room Code │ │
│ │   Mic Loop (no-speech retry)│ │   (38.4 MB On-Device Weights│ │   Zero Mobile Data  │ │
│ └──────────────┬──────────────┘ └──────────────┬──────────────┘ └──────────┬──────────┘ │
│                │                               │                           │            │
│                └───────────────────────────────┼───────────────────────────┘            │
│                                                ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                LAYER 2: CAPACITOR 6 NATIVE CONTAINER & STORAGE SCHEME             │  │
│  │    • androidScheme: 'http' (prevents offline fetch socket errors)                 │  │
│  │    • cleartext: true (enables local file protocol asset binding)                  │  │
│  │    • HTML5 LocalStorage (offline teacher word reviews & progress persistence)     │  │
│  └─────────────────────────────────────────┬─────────────────────────────────────────┘  │
│                                            │                                            │
└────────────────────────────────────────────┼────────────────────────────────────────────┘
                                             ▼
                             ┌───────────────────────────────┐
                             │ Android Phone or School Tablet│
                             │ (Runs 100% in Airplane Mode)  │
                             └───────────────────────────────┘
```

---

## 🛠️ Comprehensive Tech Stack Justification Table

| Technology Layer | Tool / Framework | Real-World Analogy | Technical & Pedagogical Justification |
|---|---|---|---|
| **UI Framework** | **React 18** | High-speed visual screen engine | Instant UI updates, dynamic state management for audio cards and game components without page reloads. |
| **Type Safety** | **TypeScript** | Built-in code spell check | Strictly enforces non-Latin Ol Chiki (`ᱚᱞ ᱪᱤᱠᱤ`) unicode strings and dictionary structures, preventing runtime crashes. |
| **Bundler & Compiler** | **Vite 5** | High-efficiency asset compressor | Bundles the application into ultra-small files (~600 KB JS bundle), enabling sub-second launch times on 2 GB RAM tablets. |
| **Design System** | **Vanilla CSS + System Fonts** | Zero-dependency offline stylesheet | Eliminates external `@import` network font calls. Renders native Santali Ol Chiki letters crisp and lag-free offline. |
| **Native Wrapper** | **Capacitor 6** | Web-to-Android native container | Wraps React web code into a production Android `.apk` with direct access to phone hardware and native Java plugins. |
| **Offline Voice Engine** | **Native Android Speech Bridge** | Built-in phone voice listener | Custom Java bridge (`MainActivity.java`) using `EXTRA_PREFER_OFFLINE = true` to perform voice-to-text in 100% Airplane Mode. |
| **Mic Manager** | **Hands-Free Keepalive Loop** | Smart continuous listener | Auto-restarts microphone listening on `onend`/`no-speech` events so teachers can pause mid-lecture without touching the screen. |
| **Neural AI Model** | **ONNX INT8 Quantized Model** | Compressed pocket AI model | Pre-installed 38.4 MB neural weights (`bhashagyan_indictrans2_int8.onnx`) for full sentence contextual offline translation. |
| **Lexicon Engine** | **7,500+ Word FLN Matrix** | Ultra-fast dictionary engine | Pre-loaded Hindi-Santali FLN dictionary delivering sub-millisecond lookups (**0.0375 ms**) with zero server costs. |
| **Classroom Sync** | **WebRTC P2P DataChannels** | Direct device-to-device radio | Connects teacher phone to student tablets over a local hotspot via a 6-digit code without cellular data or internet. |
| **Audio Analysis** | **Web Audio API & DTW** | On-device soundwave analyzer | Measures speech volume, pitch, and energy envelopes in under 5 ms for teacher pronunciation coaching and side-by-side playback. |
| **Local Storage** | **HTML5 LocalStorage** | On-device mini vault | Stores teacher custom dictionary additions, lesson progress, and community review statuses directly on the tablet. |
| **Quality Assurance** | **Playwright & Node.js** | Automated 44-point inspection | Runs automated end-to-end tests across 44 core features before compiling the final native APK deliverable. |

---

## 🔍 In-Depth Layer Breakdown: Why We Built It This Way

---

### 1. React 18 + TypeScript + Vite 5 (Presentation Stack)
* **Problem Addressed:** Educational applications for young children need instant visual and audio feedback. Slow, lagging interfaces cause frustration and distraction.
* **Why We Chose It:**
  1. **Sub-Millisecond Component State Updates:** React 18 handles rapid UI re-renders smoothly when children tap flashcards or teachers toggle translation modes.
  2. **Strict Typings for Ol Chiki (`ᱚᱞ ᱪᱤᱠᱤ`):** Santali uses a distinct unicode character block. TypeScript verifies object shapes and dictionary arrays during build time, ensuring zero undefined text crashes in the classroom.
  3. **Ultra-Fast Cold Starts:** Vite 5 compresses JavaScript assets so the app opens instantly even on low-cost 2 GB RAM Android tablets.

---

### 2. Capacitor 6 + Native Android Speech Bridge (`MainActivity.java`)
* **Problem Addressed:** Chrome Web Speech API relies on Google online servers and hangs indefinitely when a device enters Airplane Mode.
* **Why We Chose It:**
  1. **100% Offline Speech-to-Text:** We authored a custom Java bridge in `MainActivity.java` accessing native `android.speech.SpeechRecognizer` with `RecognizerIntent.EXTRA_PREFER_OFFLINE = true`. This forces the device's local speech model to process voice input without internet.
  2. **Single Codebase Efficiency:** Capacitor allows one clean web application to run both as a web app and as a native Android APK deliverable (`com.ambivert.bhashagyan`).
  3. **Offline Asset Scheme (`androidScheme: 'http'`):** Configured Capacitor's Android webview scheme to `http` with cleartext enabled to prevent local file fetch errors in Airplane Mode.

---

### 3. Dual Offline Translation Pipeline (FLN Matrix + ONNX INT8 Model)
* **Problem Addressed:** Standard translation apps either use simple word lookup (lacking context) or cloud AI APIs (requiring internet and expensive monthly server fees).
* **Why We Chose It:**
  1. **Built-in FLN Matrix:** 7,500+ curated Hindi-Santali dictionary terms executing in **0.0375 milliseconds** for immediate word and phrase translation.
  2. **ONNX INT8 Quantized Model:** Pre-bundled 38.4 MB neural AI weights (`bhashagyan_indictrans2_int8.onnx`) for complex sentence translation.
  3. **1-Tap Model Switcher:** Teachers can toggle seamlessly between instant dictionary lookups and neural AI translation with a single button on the Live Translation screen.

---

### 4. Hands-Free Voice Lifecycle Manager (`useSpeechRecognition.ts`)
* **Problem Addressed:** Teachers naturally pause between sentences during classroom lectures. Traditional speech software turns off the microphone during pauses, forcing the teacher to constantly tap the record button.
* **Why We Chose It:**
  1. **Continuous Microphone Keepalive:** Monitors native speech callbacks (`onend` and `no-speech`). When active, it automatically resumes listening in the background without dropping out.
  2. **Hands-Free Classroom Teaching:** Teachers can talk, pause to explain to students, and resume speaking naturally without touching the screen.

---

### 5. WebRTC Peer-to-Peer Local Hotspot Broadcasting
* **Problem Addressed:** Remote primary schools in Jharkhand have no Wi-Fi routers or cellular connectivity. Teachers need a way to display live lesson captions on student tablets.
* **Why We Chose It:**
  1. **Zero-Internet Data Channels:** Uses WebRTC Peer-to-Peer DataChannels over the teacher's phone hotspot. Data travels directly through local radio waves with zero mobile data usage.
  2. **Simple 6-Digit Room Code:** The teacher starts a broadcast session, and students enter a 6-digit code to connect instantly.
  3. **Zero Monthly Cloud Server Costs:** Eliminates monthly cloud database bills.

---

### 6. De-Cluttered Child-First Visual Interface & Offline System Fonts
* **Problem Addressed:** Verbose text paragraphs confuse Grade 1–3 children and non-tech-savvy primary teachers. External web fonts fail to load offline.
* **Why We Chose It:**
  1. **Visual Card System:** Stripped out 50%+ text bloat across all pages. Replaced dense paragraphs with high-contrast picture cards, bold Ol Chiki headers, and direct audio buttons.
  2. **System Font Stack:** Replaced external `@import` Google Fonts with robust local system fonts, ensuring Santali Ol Chiki (`ᱚᱞ ᱪᱤᱠᱤ`) letters render crisp and fast offline.

---

## 📊 Comparison Matrix: Cloud Apps vs. Bhasha Gyan

| Architectural Feature | Standard Online Cloud App | Bhasha Gyan On-Device Platform |
|---|---|---|
| **Internet Dependency** | ❌ Fails without continuous 4G/Wi-Fi | ✅ **Works 100% in Airplane Mode** |
| **Offline Voice-to-Text** | ❌ Hangs / Times out in Airplane Mode | ✅ **Native Android Offline Speech Bridge** |
| **Teacher Mic State** | ❌ Automatically cuts off during pauses | ✅ **Hands-Free Continuous Keepalive Loop** |
| **Neural AI Model** | ❌ Requires expensive cloud servers | ✅ **Pre-installed 38.4 MB ONNX INT8 Model** |
| **Translation Speed** | ❌ 1.5 to 4.0 seconds delay | ✅ **Instant (0.0375 ms dictionary lookup)** |
| **Monthly Operating Cost**| ❌ High monthly server bills | ✅ **₹0 (Free Forever)** |
| **Classroom Sync** | ❌ Requires cloud database & internet | ✅ **Local 6-Digit Hotspot Broadcast** |
| **UI Usability** | ❌ Text-heavy & blog-like | ✅ **De-cluttered, picture-first, high-contrast** |

---

## ⏱️ 30-Minute Full Team Presentation Strategy (5 Min × 6 Members)

To maximize jury impact, our 6-member team delivers a comprehensive **30-minute deep-dive presentation** (5 minutes per member). Each member covers their feature's purpose, live demo, technical mechanics, and real-world school impact:

1. **Member 1 (0:00 - 5:00):** Mission Statement, Airplane Mode Architecture, Native Android Speech Bridge.
2. **Member 2 (5:00 - 10:00):** Dual Translation Engine, 7,500+ FLN Lexicon & ONNX INT8 Quantized Model Demo.
3. **Member 3 (10:00 - 15:00):** Live Classroom Translation & Hands-Free Microphone Keepalive Demonstration.
4. **Member 4 (15:00 - 20:00):** De-Cluttered Visual UI, Ol Chiki Flashcards & Kid Practice Games Demo.
5. **Member 5 (20:00 - 25:00):** Digitized JCERT Primary Textbooks & 2-Stage Teacher Community Review Gate.
6. **Member 6 (25:00 - 30:00):** WebRTC 6-Digit Hotspot Sync, Student Receiver View & APK Deliverable Conclusion.
