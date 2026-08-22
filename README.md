# MitrAI (SafeSpeak) 🛡️🌿

> **Real-Time, Zero-Trace Indic Peer Support Sanctuary & Sub-2ms Safety Shield**  
> *Destigmatizing emotional support with emotion-preserving colloquial Indic translation and deterministic crisis prevention.*

---

## 🌟 Executive Summary

**MitrAI (SafeSpeak)** is a real-time, privacy-first peer support platform designed to remove social stigma and language barriers for mental health and emotional distress discussions across India. 

It pairs anonymous users based on shared intent tags and features an in-stream AI pipeline that translates colloquial Indic dialects with emotion-preserving nuance, blocks toxic interactions, and deterministically halts self-harm crises in **sub-2ms** with one-tap national helpline escalation.

---

## 🚀 Core Engineering & Safety Pillars

### 1. ⚡ Sub-2ms Aho-Corasick Deterministic Crisis Breaker
* Built with an optimized **Aho-Corasick trie and regex scanner** (`backend/crisis_scanner.py`, `src/lib/crisisKeywords.ts`).
* Scans distress markers across English and transliterated Indic dialects (*Hinglish*, *Hindi*, *Tamil*, *Telugu*).
* **Deterministic Circuit Breaker:** Halts message transmission to the peer within **< 2ms** to prevent contagion or panic, instantly presenting the user with verified 24/7 crisis helplines:
  * **Tele-MANAS (Govt. of India):** `14416` (Toll-Free, 20+ languages)
  * **KIRAN Helpline:** `1800-599-0019`
  * **Vandrevala Foundation:** `+91 9999 666 555`

### 2. 🌐 Emotion-Preserving Indic Dialect Translation
* In-stream colloquial translation preserving sentiment valence, emotional tone, and vulnerability without clinical distortion.
* Supports code-mixed **Hinglish**, **Hindi**, **Tamil**, and **Telugu**.
* Features an intuitive **Dual-Bubble stream** showing both original native speech and real-time translated text.

### 3. 🔥 Zero-Trace Ephemeral RAM Session Dissolve
* **Zero persistent database storage:** Message packets stream solely through in-memory circular buffers.
* Upon room exit, all session memory is permanently dissolved with zero disk trace.

### 4. 🎛️ Interactive Dual-Peer Judge Sandbox & Escape Hero
* **Split-Screen Sandbox (`src/components/DualPeerDemo.tsx`):** Live side-by-side terminal allowing judges to test code-mixed translation, crisis circuit breakers, and audio transcription simultaneously in real time.
* **Modern Editorial Landing Experience:** Full-bleed interactive landscape hero with curated typography, rating cards, and national emergency directory.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, Lucide Icons, GSAP, Three.js |
| **Backend & Engine** | Python 3.11, FastAPI, WebSockets, Aho-Corasick Trie Engine |
| **Voice & Speech** | Web Speech Recognition API + Web Speech Synthesis |
| **Deployment** | Vercel (Edge Frontend) |

---

## ⚡ Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/jasonabel01/MITR.AI.git
cd MITR.AI
```

### 2. Install & Run Frontend
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. (Optional) Run FastAPI Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 📜 Compliance & Ethics Blueprint

- **DPDP Act (India) / HIPAA Aligned:** Zero PII storage, transient anonymous alias generation, ephemeral memory teardown.
- **National Emergency Escalation:** Direct Tele-MANAS (14416) one-tap hotline escalation for acute distress triggers.
