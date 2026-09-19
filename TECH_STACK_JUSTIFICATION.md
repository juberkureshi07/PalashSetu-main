# 🏗️ SetuVani — Simple Tech Stack & Choices Explained
> **Project Name:** SetuVani (सेतुवाणी)  
> **Team Name:** Ambivert's Team  
> **Target App:** Native Android App (`com.ambivert.setuvani`)  
> **Built APK:** [`SetuVani-v1.0-debug.apk`](SetuVani-v1.0-debug.apk)  

---

## 📱 Simple App Architecture Map

```
┌───────────────────────────────────────────────────────────────────────────┐
│                      SETUVANI NATIVE ANDROID APP                          │
│                      (Package: com.ambivert.setuvani)                     │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │               React 18 + TypeScript + Vite UI Screen              │   │
│   └─────────────────────────────────┬─────────────────────────────────┘   │
│                                     │                                     │
│     ┌───────────────────────────────┼───────────────────────────────┐     │
│     ▼                               ▼                               ▼     │
│ ┌───────────────┐           ┌───────────────┐               ┌───────────┐ │
│ │ 7,500+ Word   │           │ Audio Pattern │               │ Local P2P │ │
│ │ Offline List  │           │  Match Engine │               │ Hotspot   │ │
│ └───────┬───────┘           └───────┬───────┘               └─────┬─────┘ │
│         │                           │                             │       │
│         └───────────────────────────┼─────────────────────────────┘       │
│                                     ▼                                     │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │              Capacitor 6 Android Native Packaging                 │   │
│   └─────────────────────────────────┬─────────────────────────────────┘   │
│                                     │                                     │
└─────────────────────────────────────┼─────────────────────────────────────┘
                                      ▼
                      ┌───────────────────────────────┐
                      │ Android Phone or Tablet       │
                      │ (Runs 100% in Airplane Mode)  │
                      └───────────────────────────────┘
```

---

## 🛠️ Quick Tech Stack Overview Table

| Technology Used | What It Is (Simple Analogy) | Why We Chose It (What to Tell Judges) |
|---|---|---|
| **React 18** | The visual UI builder. | Updates buttons and screens instantly when kids tap cards without reloading the page. |
| **TypeScript** | Code with built-in spell check. | Prevents bugs and screen crashes by checking script names and word variables before building. |
| **Vite** | Ultra-fast code compiler. | Bundles the whole app into a tiny ~600 KB file that opens fast on cheap school tablets. |
| **Vanilla CSS** | Styling and layout design. | Gives total control over font colors and clean rendering of Santali Ol Chiki letters (`ᱚᱞ ᱪᱤᱠᱤ`). |
| **Capacitor 6** | Web-to-Android wrapper. | Turns our web app directly into an Android `.apk` file without rewriting code in Java or Kotlin. |
| **WebRTC P2P DataChannels** | Device-to-device radio connection. | **Zero internet required.** Sends live lesson text from teacher phone to student tablets over a hotspot. |
| **Web Audio API** | Microphone sound analyzer. | Compares speech rhythm on the tablet in under 5 milliseconds without needing online speech servers. |
| **Offline Lexicon Engine** | Built-in 7,500+ word dictionary. | Translates words instantly (**0.0375 ms speed**) with zero monthly internet or server bills. |
| **HTML5 LocalStorage** | On-device mini memory. | Saves teacher additions, lesson progress, and practice stars directly on the tablet. |
| **Playwright & Node.js** | Automatic code tester. | Ran 64 automated checks on our code to ensure 0 errors before generating the APK. |

---

## 🔍 Detailed Explanations: "Why Did We Pick This Tool?"

---

### 1. React 18 + TypeScript + Vite (App Display Stack)

* **What it does:** React builds the visual screens, TypeScript prevents code typos, and Vite packages everything into small files.
* **Why we picked it over simple static HTML or traditional frameworks:**
  1. **Fast Screen Responses:** Primary school educational games need immediate sound effects and visual feedback when children tap buttons.
  2. **No Typo Crashes:** Santali Ol Chiki (`ᱚᱞ ᱪᱤᱠᱤ`) and Devanagari Hindi (`नमस्ते`) use different alphabets. TypeScript makes sure dictionary keys match properly so the app never crashes during class.
  3. **Small File Size:** Vite compresses code so the app opens smoothly even on budget 2 GB RAM Android tablets.

---

### 2. Capacitor 6 (Web to Native Android APK)

* **What it does:** Capacitor wraps our web application so it runs as a native Android app (`.apk`).
* **Why we picked it over Flutter or Android Kotlin:**
  1. **One Single Codebase:** Writing separate code for web browsers and Android phones doubles development time. Capacitor lets one single codebase run everywhere.
  2. **Access to Phone Hardware:** Allows the app to use the phone microphone, storage, and local network without complicated extra plugins.
  3. **Direct APK File:** Generates a real native `.apk` file (`SetuVani-v1.0-debug.apk`) that can be shared via pendrive or Bluetooth and installed on any Android device.

---

### 3. WebRTC Peer-to-Peer Data Channels

* **What it does:** WebRTC lets two devices talk directly to each other over local Wi-Fi or mobile hotspot.
* **Why we picked it over Cloud Servers or Databases:**
  1. **Works Without Internet:** Rural primary schools often have zero internet towers. WebRTC sends data directly through local radio signals over a phone hotspot (even with mobile data turned off).
  2. **₹0 Monthly Bill:** Traditional apps pay monthly fees to cloud servers like AWS or Firebase. WebRTC connects device-to-device for free.
  3. **Simple 6-Digit Room Code:** The teacher starts a broadcast, and students enter a 6-digit code to see live translated captions on their screens.

---

### 4. Web Audio API & Speech Pattern Matcher

* **What it does:** Measures soundwave pitch and volume patterns directly inside the tablet's browser memory.
* **Why we picked it over Cloud AI tools (Google Speech API or Whisper):**
  1. **Instant Speed:** Online AI tools take 3 to 5 seconds to respond and stop working when internet drops. Our local code analyzes voice rhythm in **under 5 milliseconds**.
  2. **Complete Offline Use:** Teachers can practice their pronunciation in remote village locations without internet.

---

### 5. On-Device 7,500+ Word Lexicon

* **What it does:** A comprehensive Hindi-to-Santali dictionary stored directly inside the app code.
* **Why we picked it:**
  1. **Instant Lookups:** Word searches complete in **0.0375 milliseconds**, making translation feel instantaneous.
  2. **100% Airplane Mode Capability:** Teachers can search words, numbers, JCERT textbook lessons, and classroom commands anywhere.

---

## 📊 Comparison: SetuVani vs. Standard Online Cloud Apps

| Feature | Standard Online Cloud App | SetuVani App |
|---|---|---|
| **Internet Required?** | ❌ Yes (Needs continuous 4G / Wi-Fi) | ✅ **No (Works 100% in Airplane Mode)** |
| **Monthly Server Cost** | ❌ Expensive cloud server bills | ✅ **₹0 (Free Forever)** |
| **Translation Speed** | ❌ Slow (1.5 to 4 seconds delay) | ✅ **Instant (0.0375 milliseconds)** |
| **Classroom Sync** | ❌ Requires internet database | ✅ **6-Digit Local Hotspot Sync** |
| **Device Compatibility** | ❌ Requires high-end smartphones | ✅ **Runs on low-cost 2GB RAM school tablets** |
| **Child Usability** | ❌ Complex menus & rankings | ✅ **Picture-based, voice-based, stress-free** |

---

## 🗣️ Quick 30-Second Answer for Judges

> *"Judges, we built **SetuVani** using **React 18 and TypeScript** for an instant, responsive UI, packaged into a native Android APK using **Capacitor 6**.*
>
> *To solve the internet problem in rural Jharkhand primary schools, we used **WebRTC Peer-to-Peer Data Channels** to sync classroom tablets over a local hotspot with zero internet. All dictionary lookups (0.0375 ms speed) and voice rhythm pattern math run **100% on the device**, meaning zero server costs and complete offline reliability in Airplane Mode."*
