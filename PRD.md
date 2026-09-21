# Product Requirements Document (PRD) — Bhasha Gyan (भाषा ज्ञान / PalashSetu)

**Project Name:** Bhasha Gyan (PalashSetu) — Mother Tongue-Based Multilingual Education (MTB-MLE)  
**Target Environment:** Rural & Tribal Primary Schools, Jharkhand (Anganwadis, Balvatikas, Primary Schools)  
**Target Hardware:** Budget Android Tablets (Android 7.0–9.0, 2 GB RAM)  
**Connectivity Constraint:** 100% Standalone On-Device — Zero Internet, Zero External Servers, Zero External Hardware (Airplane Mode Ready)  
**Document Version:** 2.0 (Engineering Reality Reconciliation & Comprehensive Redesign)

---

## 1. Executive Summary & Problem Statement

In primary classrooms across rural Jharkhand, Hindi-speaking teachers face a critical linguistic barrier when teaching indigenous primary school children whose mother tongue is **Santali** (written in the **Ol Chiki ᱚᱞ ᱪᱤᱠᱤ** script), **Ho** (Warang Chiti), **Mundari**, **Kurukh**, or **Kharia**.

Remote village schools have **zero cellular connectivity** and operate on budget 2 GB RAM Android tablets. 

The original codebase snapshot claimed to be a "100% standalone AI app," but an empirical audit revealed four critical architectural deficiencies:

### Critical Audit of Existing Gaps:

1. **Offline STT & AI Model Failure:** 
   The application relies on `webkitSpeechRecognition` (which requires internet). When offline, it switches to a Web Audio microphone level meter that measures volume decibels but **cannot recognize spoken words**. Furthermore, the project's ONNX generator produced a dummy file filled with byte sequences (`0..255`) rather than a real machine learning model.
2. **Multi-Device LAN Connector Breakdown:** 
   The broadcast service used browser `BroadcastChannel` and `localStorage`, which **only function across tabs on the exact same single device**. Across two separate physical Android tablets connected via a local Wi-Fi Hotspot, no network packets were transmitted.
3. **Missing Role-Based Access Control (RBAC):** 
   There is no separation between Teacher and Student operating modes. Children using gamified practice tools can navigate into administrative settings, worksheet generators, lesson editors, and report logs.
4. **Latency & Live Data Processing SLA Violation (< 3 Seconds):** 
   The current application uses a batch-processing model (waiting for full sentences before translating). The problem statement mandates a **sub-3-second end-to-end latency SLA**, requiring the app to function like a live streaming **calling agent / walkie-talkie**.

---

## 2. System Architecture & Core Technology Stack

```
+-----------------------------------------------------------------------------------+
|               BHASHA GYAN STANDALONE ON-DEVICE ARCHITECTURE                       |
|        (100% On-Device • Zero Server • Airplane Mode Ready • < 60 MB RAM)         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ LAYER 1: STRICT ROLE-BASED UI ISOLATION ]                                      |
|  • Student Mode: Locked UI (FLN Games / Broadcast Receiver / Flashcards)           |
|  • Teacher Mode: PIN-Gated (Live Walkie-Talkie / NIPUN Lessons / Worksheets)       |
|                                                                                   |
|  [ LAYER 2: LINGUISTIC AGGLUTINATIVE TRANSLATION & PHONETIC SYNTHESIZER ]         |
|  • Latency: < 0.01 ms Hash Lookup • 7,503 Curated Entries + Morphological Parser   |
|  • Suffix Parser: Handles Santali case markers (-ᱨᱮ, -ᱛᱮ, -ᱠᱷᱚᱱ) & verb tenses     |
|  • Phonetic TTS: Ol Chiki syllable compiler to Devanagari phoneme queue           |
|                                                                                   |
|  [ LAYER 3: MULTI-TABLET LAN HOTSPOT STREAMING ENGINE ]                          |
|  • Android Hotspot Gateway (192.168.43.1) + QR-Code SDP WebRTC P2P DataChannels   |
|                                                                                   |
|  [ LAYER 4: ON-DEVICE STRUCTURED DATABASE PERSISTENCE ]                           |
|  • IndexedDB / SQLite: Teacher profiles, student FLN progress, offline queues     |
+-----------------------------------------------------------------------------------+
```

---

## 3. Detailed Functional Requirements (FRs)

### FR-1: 100% On-Device Offline Speech & Fallback Engine
- **FR-1.1:** Provide dual-mode Speech-to-Text:
  1. *WebAssembly / Native Offline STT:* Use Vosk WASM or Android Native `SpeechRecognizer` (`EXTRA_PREFER_OFFLINE`) for voice dictation when offline voice packs are available.
  2. *1-Tap Phonetic Quick Phrase Launcher:* Provide high-frequency classroom audio triggers (Greetings, Numeracy, Classroom Commands) that work 100% deterministically with zero latency.
- **FR-1.2:** Implement explicit memory management (`AudioContext.close()`, `MediaStreamTrack.stop()`) to prevent Web Audio memory leaks on 2 GB RAM tablets.

### FR-2: Agglutinative Morphological Translation & Phonetic Synthesis
- **FR-2.1:** Implement a 4-tier translation lookup fallback:
  1. Direct Hash Dictionary Match (`< 0.01 ms`).
  2. Agglutinative Morphological Case Suffix & Postposition Parser (`-ᱨᱮ`, `-ᱛᱮ`, `-ᱠᱷᱚᱱ`, `-ᱠᱟᱱᱟ`, `-ᱠᱮᱫᱟ`).
  3. Phrasebook Regex Pattern Parser.
  4. Ol Chiki Transliteration Fallback (`ᱨᱟᱦᱩᱞ` for proper nouns).
- **FR-2.2:** Acoustic Phonetic Synthesizer (`santaliSpeech.ts`): Compile Ol Chiki Unicode characters into authentic phonemes with glottal stop handling (`ᱽ`) and adjustable speech rate (`0.6x`–`1.0x`).

### FR-3: Multi-Tablet LAN Hotspot Peer-to-Peer Caption Broadcasting
- **FR-3.1:** Enable the Teacher tablet (acting as Wi-Fi Hotspot) to stream live translated captions to connected Student tablets.
- **FR-3.2:** Provide a **QR-Code WebRTC SDP Scanner**: Teacher screen generates a QR code containing local network SDP tokens; Student tablets scan the QR code with their camera to establish direct P2P DataChannels without needing external routers or internet servers.

### FR-4: Role-Based Access Control (RBAC) & Shared Tablet Security
- **FR-4.1:** Establish two distinct operating environments:
  - **Student Mode:** Full-screen locked mode containing Gamified Practice (`/practice`), Receiver View (`/student-view`), and Flashcards (`/flashcards`). Sidebar, navigation header, and settings are completely hidden.
  - **Teacher Mode:** PIN-gated administrative area containing Live Walkie-Talkie (`/translate`), NIPUN Lessons (`/lessons`), Worksheet Generator (`/worksheets`), Settings (`/settings`), and Issue Reporting (`/report`).
- **FR-4.2:** Local authentication using SHA-256 PIN hashing (`authService.ts`). Tablet reboots default automatically to locked Student Mode.

### FR-5: On-Device Structured Database Persistence
- **FR-5.1:** Implement `dbService.ts` using IndexedDB / SQLite to store:
  - Teacher profiles and assigned district configurations.
  - Student FLN progress, competency scores, and game completion timestamps.
  - Pending community content contributions.
  - Dynamic local dictionary cache injections.

---

## 4. Non-Functional Requirements (NFRs)

> [!IMPORTANT]
> **Core Architectural Principle:** **Functionality, AI Model Accuracy, and 100% Offline Dependability are prioritized over App Size.** We do NOT restrict or artificially shrink the application bundle size if doing so compromises offline AI model capability, voice accuracy, or feature completeness.

| Metric | Target Specification | Engineering Justification |
|---|---|---|
| **Max RAM Usage** | **Optimized Heap (< 250 MB RAM)** | Prevents Android Out-Of-Memory (OOM) crashes while supporting real model weights in memory. |
| **Max APK / Bundle Size** | **Unconstrained (Include Real Models)** | Prioritizes complete offline models (Vosk/Whisper/ONNX) without artificial micro-size limits. |
| **Algorithmic Latency** | **< 0.01 ms** | Instant dictionary lookup execution. |
| **End-to-End Latency** | **< 3.0 Seconds (Target < 500 ms)** | Satisfies live walkie-talkie / calling agent classroom requirement. |
| **Network Dependency** | **ZERO (100% Offline)** | Operates in total Airplane Mode with all assets self-contained. |
| **Target OS Support** | Android 7.0 (API 24) to Android 14+ (API 34) | Compatible with old government-distributed school tablets. |

---

## 5. Phase-by-Phase Task Breakdown & Implementation Roadmap

We will work through these phases **one by one**, verifying every step before proceeding to the next.

```
+-----------------------------------------------------------------------------------+
|                           5-PHASE IMPLEMENTATION ROADMAP                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  PHASE 1: Role-Based Access Control (RBAC) & Student/Teacher UI Separation       |
|  • Implement RoleContext, local SHA-256 PIN barrier, and guarded routes.          |
|                                                                                   |
|  PHASE 2: On-Device SQL Database & Profile Persistence Layer                      |
|  • Build dbService.ts (IndexedDB/SQLite) for offline progress & dictionary cache. |
|                                                                                   |
|  PHASE 3: Agglutinative Morphological Engine & Phonetic Audio Compiler            |
|  • Enhance suffix parser (-ᱨᱮ, -ᱛᱮ, -ᱠᱷᱚᱱ) & acoustic TTS glottal stop synthesis.|
|                                                                                   |
|  PHASE 4: Multi-Tablet LAN Hotspot Peer-to-Peer Caption Broadcasting              |
|  • Implement QR-Code WebRTC SDP Scanner & Hotspot Gateway P2P connection manager. |
|                                                                                   |
|  PHASE 5: Sub-3-Second Live Calling Agent Streaming Pipeline                      |
|  • Implement VAD chunking, memory leak cleanup, and end-to-end benchmark suite.  |
+-----------------------------------------------------------------------------------+
```

### Phase 1: Security & Role Isolation (Immediate Next Task)
- [ ] Create `mobile/src/context/RoleContext.tsx` to manage active role (`student` vs `teacher`).
- [ ] Implement SHA-256 PIN verification modal for switching into Teacher Mode.
- [ ] Update `App.tsx`, `Sidebar.tsx`, and `Header.tsx` to hide administrative routes when in Student Mode.
- [ ] Verify that students cannot access settings, worksheets, or lesson editors.

### Phase 2: On-Device Database Persistence (`dbService.ts`)
- [ ] Create `mobile/src/services/dbService.ts` using IndexedDB for structured local storage.
- [ ] Migrate `authService.ts` and `feedbackService.ts` to `dbService.ts`.
- [ ] Implement offline data export/import capabilities for shared school tablets.

### Phase 3: Agglutinative Morphological Parsing & Phonetic TTS
- [ ] Update `santali_comprehensive_dictionary.ts` with suffix parsing rules.
- [ ] Enhance `santaliSpeech.ts` with syllable phoneme queuing and glottal stop (`ᱽ`) acoustic mapping.
- [ ] Test linguistic fallback pipeline with out-of-vocabulary words.

### Phase 4: Multi-Tablet LAN Hotspot Streaming
- [ ] Refactor `webrtcP2PService.ts` to replace single-tab `BroadcastChannel` with real network transport.
- [ ] Create `mobile/src/components/QRCodeModal.tsx` to display local WebRTC SDP parameters.
- [ ] Create QR Code reader scanner component for student receiver tablets.
- [ ] Verify captions stream live between 2 physical devices connected via local Wi-Fi Hotspot.

### Phase 5: Sub-3-Second Streaming Pipeline & System Verification
- [ ] Implement VAD silence detection (300 ms window) in `LiveTranslation.tsx`.
- [ ] Add explicit memory cleanup (`AudioContext.close()`) to `useSpeechRecognition.ts`.
- [ ] Run full automated test suite (`node scripts/test_offline_engine.js`) and log latency metrics.
