# vocon

Mobile-first language learning app for **English speakers learning Japanese, Spanish, or Russian** through daily real-world conversation tasks (shop, café, directions, library, friend chat) instead of traditional lessons.

## Project Structure

- `frontend/` React + Vite mobile UI (Home To-Do, Conversation, Summary)
- `backend/` Node.js + Express adaptive conversation API
- `android/` Android WebView wrapper project for APK build
- `.github/workflows/android-build.yml` CI pipeline that builds frontend, runs backend smoke test, and compiles APK

## Features Implemented

- Daily To-Do generator with **mandatory + optional** scenario tasks
- Keiko anime guide with trigger-based dialogue moments only
- Conversation evaluation for:
  - correctness
  - naturalness
  - clarity
- Supports target languages:
  - Japanese (`ja`)
  - Spanish (`es`)
  - Russian (`ru`)
- Better phrasing suggestions + tone variation (friendly/neutral/confident)
- Adaptive tracking:
  - repeated mistakes
  - hesitation samples
  - weak-area attempts
- Progress model:
  - effort streak
  - hidden progress reveal (no XP/league)
- Mobile-first UI with smooth intro animation (cloud dive -> earth -> flash -> home)

## Local Setup

### 1) Backend

```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:4000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

Optional API base override:
```bash
VITE_API_URL=http://localhost:4000 npm run dev
```

## API Endpoints

- `GET /tasks?duration=15|30&language=ja|es|ru` → generate daily scenario to-do list
- `POST /evaluate` → evaluate user response and return correction + alternatives
  - body includes: `taskId`, `userText`, `tone`, `language`, `responseTimeMs`
- `GET /progress?language=ja|es|ru` → return effort streak + hidden progress reveal
- `GET /health` → smoke check

## Build Android APK (WebView Wrapper)

1. Build web app:
```bash
cd frontend
npm install
npm run build
```

2. Copy build output into Android assets:
```bash
cd ..
node scripts/copy-web-assets.mjs
```

3. Build APK:
```bash
cd android
gradle assembleDebug
```

APK output:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Capacitor-Compatible Setup Notes

A Capacitor configuration file (`capacitor.config.ts`) is included so the project can be migrated to full Capacitor sync flow if desired. The current Android target is a direct WebView wrapper for reliable CI prototype builds.

## Scenario Examples Included

1. **Shop**: buy 3 items + ask total price
2. **Café**: order drink + small talk
3. **Directions**: ask location + follow-up clarification
