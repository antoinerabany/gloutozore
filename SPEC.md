# Gloutozore — PWA Specs

## Context
Breastfeeding tracking app. Must be dead simple — usable one-handed at 3am. PWA so it's installable on any phone, works offline, no app store needed.

## Core UX Flow (2 taps per feeding)

### Home Screen
- Shows **which breast is next** (the one not used last), big and obvious
- Two large buttons: **Left (L)** and **Right (R)**
- The suggested one is highlighted/prominent
- Last feeding info shown below (e.g. "Last: Right, 12min ago")

### Active Feeding (tap a breast)
- Timer starts and displays elapsed time
- Big **"Stop"** button
- Option to cancel (discard the session)

### Feeding Complete (tap stop)
- Session saved automatically (breast + start time + duration)
- Returns to home screen with updated next-breast indicator

### History
- Scrollable list of recent feedings
- Each entry: breast (L/R), date/time, duration
- Tap to edit or delete
- Grouped by day

## Data Model

```
FeedingSession {
  id: string (uuid)
  breast: 'left' | 'right'
  startedAt: timestamp (ISO string)
  durationSeconds: number
}
```

## Storage
- Local only (localStorage or IndexedDB)
- No backend, no auth, no sync
- Data persists on device across app restarts

## PWA Requirements
- Installable (manifest.json + service worker)
- Works offline
- Responsive (mobile-first, but works on desktop)
- Minimal — fast load, no splash screen bloat

## Design Principles
- **Minimal clicks**: 2 taps per complete feeding
- **One-handed**: large touch targets, bottom-of-screen actions
- **3am friendly**: not too bright, clear contrast, big text
- **No clutter**: only what's needed on screen

## Out of Scope (v1)
- Multi-device sync
- Diaper tracking (future)
- Bottle feeding
- Stats/charts
- Multiple babies
- Notes per session

## Tech Stack
- **Preact + Vite** — React-like API at 3KB, fast dev with HMR
- **TypeScript** — type safety for the data model
- **CSS** — plain CSS, no UI library needed for this size
- **localStorage** — for persisting feeding sessions
- **vite-plugin-pwa** — generates service worker + manifest for PWA support
- **GitHub Pages** — free hosting, auto-deploy via GitHub Actions

## Implementation Steps

### 1. Project setup
- Init Vite + Preact + TypeScript project
- Add `vite-plugin-pwa` for service worker & manifest
- Configure for GitHub Pages deployment (base path)

### 2. Data layer
- `types.ts` — `FeedingSession` type
- `storage.ts` — read/write sessions from localStorage
- Helper: `getLastSession()`, `getNextBreast()`

### 3. Home screen component
- Big L / R buttons, suggested breast highlighted
- "Last feeding" info line (time ago + duration + which breast)
- Link/button to history

### 4. Active feeding screen
- Running timer display (mm:ss)
- Big "Stop" button (bottom of screen, easy thumb reach)
- "Cancel" option (smaller, top corner)

### 5. History screen
- List of sessions grouped by day
- Each row: breast icon (L/R), time, duration
- Tap to edit or delete (simple modal or inline)

### 6. PWA config
- `manifest.json` — app name, icons, theme color, display: standalone
- Service worker via vite-plugin-pwa (precache assets)
- App icons (simple L/R breast icon, can be minimal)

### 7. Styling
- Dark-friendly theme (not blinding at 3am)
- Large touch targets (min 48px, ideally bigger)
- Mobile-first layout, centered content
- Simple color scheme: soft background, clear accent for L vs R

### 8. GitHub Pages deployment
- GitHub Actions workflow to build and deploy on push to main

### Files to create
```
src/
  App.tsx          — router/state between home, feeding, history
  components/
    HomeScreen.tsx
    ActiveFeeding.tsx
    History.tsx
  lib/
    types.ts
    storage.ts
  index.css        — global styles
index.html
vite.config.ts
```

## Verification
- Install PWA on phone
- Log a few feedings, verify history
- Close and reopen app — data persists
- Check "next breast" logic is correct
- Test offline behavior
