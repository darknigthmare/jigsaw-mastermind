# JIGSAW MASTERMIND — Local Fictional Escape-Room Console

An offline-first, local-first interactive writing studio and moral choice simulator inspired by the general psychological atmosphere, metronomic pacing, and ethical dilemmas of dark escape-room thrillers. 

> [!IMPORTANT]
> **Ethical & Safety Guardrails**: This application is strictly an interactive roleplay, writing utility, and fictional escape-room dashboard. It does not contain blueprints or descriptions of real-world mechanical hazards, weapons, physical injury, or surveillance systems. A built-in local Safety Layer actively sanitizes inputs to maintain a non-violent, symbolic narrative focus.

## Key Features

1. **Control Room Dashboard**: Display counters, timeline events, active campaigns, and historical case logs.
2. **Game Architect (Campaign Builder)**: CRUD editor for escape-room scripts. Set the period, location, tone, and assign characters.
3. **Dossiers Sujets**: Define fictional participants, their moral deficiencies, greatest fears, and denial patterns.
4. **Test Chamber (Test Designer)**: Create logic puzzles, branching choice decisions, countdown parameters, and delta score effects.
5. **Tape Generator**: Compose Jigsaw-style cassette opening transcripts with cold, metadata-style metered prose.
6. **Theatre Mode (Simulator)**: Run campaigns in a full-screen retro-styled terminal console with animated cassette reels, typing transcripts, Nixie-style timers, and dynamic moral score meters.
7. **Local Vault Passphrase Protection**: Optionally encrypt stored JSON data in client-side storage using PBKDF2 key derivation and 256-bit AES-GCM (via standard Web Crypto API).
8. **Writer's Room AI Prompts**: Pre-moderated LLM templates to paste into local offline models (like Ollama) to draft safe, high-quality campaigns.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 8
- **UI & Styling**: Tailwind CSS v4.0 (equipped with CRT scanline and noise shaders)
- **Icons**: Lucide React
- **Local Storage & Database**: HTML5 `localStorage` database layers
- **Local Encryption**: PBKDF2 + AES-GCM (Web Crypto API)
- **Unit Testing**: Vitest 4

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Environment**:
   ```bash
   npm run dev
   ```

3. **Build Static Bundle**:
   ```bash
   npm run build
   ```

4. **Execute Tests**:
   ```bash
   npm run test
   ```

## File Architecture

```
modest-goodall/
├── src/
│   ├── __tests__/
│   │   ├── moralEngine.test.ts  # Clamping & endings tests
│   │   └── safety.test.ts       # Safety scanner tests
│   ├── assets/                  # Default assets
│   ├── components/
│   │   ├── common/
│   │   │   ├── CRTPanel.tsx     # Scanline & noise screen
│   │   │   ├── MoralScoreBars.tsx # LED segmented meters
│   │   │   ├── SafeRewriteBox.tsx # Safety popup alert
│   │   │   ├── TapePlayer.tsx   # Spinning reels cassette deck
│   │   │   └── TimerDisplay.tsx # Nixie LED count display
│   │   └── layout/
│   │       ├── AppShell.tsx     # Theme wrapper
│   │       ├── Sidebar.tsx      # Vault metal side menu
│   │       └── TopStatusBar.tsx # Digital clock & network status
│   ├── context/
│   │   └── AppContext.tsx       # Global state machine & timers
│   ├── services/
│   │   ├── db.ts                # CRUD operations & Web Crypto
│   │   ├── moralEngine.ts       # Pure score calculation logic
│   │   ├── preloadedData.ts     # Pre-seeded campaigns
│   │   └── safety.ts            # Local regex blocklist
│   ├── types/
│   │   └── index.ts             # Strict TypeScript models
│   ├── App.tsx                  # Root state router
│   ├── index.css                # Global styles & keyframes
│   └── main.tsx                 # StrictMode renderer wrapper
├── vite.config.ts               # Tailwind plugin registration
├── package.json                 # Scripts and packages list
└── tsconfig.json                # TS declarations
```

## Safety Layer & Moral Engine Specifications

### 1. Red Line Safety Filter (`safety.ts`)
- Blocklist regex filters target: guns, blades, explosives, chemicals, kidnap, hostage, surveillance of real targets, or stalking.
- Automated replacements swap violent vocabulary for symbolic equivalents (e.g., `trap` -> `symbolic test`, `blood` -> `truth`, `acid` -> `corrosive choice`).
- Sanitizer scans forms on save and applies safe rewrites inline, alerting the user via the `SafeRewriteBox` warning console.

### 2. Moral Profile Balances (`moralEngine.ts`)
Decisions delta updates shape a 7-attribute profile:
- **Responsibility** (accepting consequences of actions)
- **Truth** (transparency vs. fabrication)
- **Empathy** (consideration for other characters)
- **Courage** (facing difficult decisions)
- **Denial** (self-justification shields)
- **Cooperation** (teamwork)
- **Acceptance** (willingness to yield privileges)

Depending on final score balances, Theatre Mode computes one of these endings:
- **Redemption Ending**: High truth and responsibility.
- **Denial Ending**: Very high denial score.
- **Mercy Ending**: Balanced empathy and cooperation.
- **Self-Awareness Ending**: High courage and acceptance.
- **Collapse of Persona**: Low responsibility combined with high denial.
- **Hollow Victory**: High truth but zero empathy.
- **Mirror Ending**: Balanced mid-range scores.
