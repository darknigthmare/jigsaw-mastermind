# JIGSAW MASTERMIND — Station FPS & Théâtre d’enquête

> [!IMPORTANT]
> **État actuel (v2.0, build `86280ba`) :** deux piliers livrés — la **Station de contrôle** en FPS et le **Théâtre** d’enquête et de décisions. L’**Architecte**, la **Régie** et la **Victime** sont une **extension de conception non livrée**. Voir [la bible du jeu](docs/BIBLE_DU_JEU.md) et le [registre des références](docs/REFERENCES_FRANCHISE.md).

An offline-first, local-first interactive writing studio and moral choice simulator inspired by the general psychological atmosphere, metronomic pacing, and ethical dilemmas of dark escape-room thrillers. 

The [game design bible](docs/BIBLE_DU_JEU.md) records the gameplay, art and acceptance criteria. The [franchise register](docs/REFERENCES_FRANCHISE.md) records the film and official game sources used for editorial continuity.

> [!IMPORTANT]
> **Ethical & Safety Guardrails**: This application is strictly an interactive roleplay, writing utility, and fictional escape-room dashboard. It does not contain blueprints or descriptions of real-world mechanical hazards, weapons, physical injury, or surveillance systems. A built-in local Safety Layer actively sanitizes inputs to maintain a non-violent, symbolic narrative focus.

## Key Features

1. **Control Room Dashboard**: Display counters, timeline events, active campaigns, and historical case logs.
2. **Game Architect (Campaign Builder)**: CRUD editor for escape-room scripts. Set the period, location, tone, and assign characters.
3. **Dossiers Sujets**: Define fictional participants, their moral deficiencies, greatest fears, and denial patterns.
4. **Test Chamber (Test Designer)**: Create logic puzzles, branching choice decisions, countdown parameters, and delta score effects.
5. **Tape Generator**: Compose Jigsaw-style cassette opening transcripts with cold, metadata-style metered prose.
6. **Theatre Mode (Simulator)**: Run campaigns with illustrated rooms, an authored stage route, cassette transcripts, timers, and moral score meters. *Le Dernier Relais* follows the last handover at the Aulnes control center through three dedicated rooms and three possible endings. *La Une de minuit* follows the last edition at the Passages print works through three dedicated rooms and three authored endings. *Le Roster — dix pièges* crosses ten illustrated rooms, one per film, each with a documented reference, a playable reading and a fidelity note stating what the room does not reproduce. The *Saw I* and *Saw II* campaigns now apply that same formula to their thirteen stages: a dedicated room, a cassette, a puzzle and a fidelity note replace the earlier one-line entries. *Saw III* and *Saw IV* follow with twelve more converted stages, then *Saw V*, *Saw VI* and *Saw VII* with twenty-two, and *Jigsaw*, *Spiral* and *Saw X* with twenty-one. Stages without a dedicated room use one of five original settings matched to the active puzzle.
7. **Local Vault Passphrase Protection**: Optionally encrypt stored JSON data in client-side storage using PBKDF2 key derivation and 256-bit AES-GCM (via standard Web Crypto API).
8. **Writer's Room AI Prompts**: Pre-moderated LLM templates to paste into local offline models (like Ollama) to draft safe, high-quality campaigns.
9. **Station de contrôle**: A first-person exploration game through the reception airlock, technical gallery, archives and evacuation post. The maintenance workshop offers an optional passage between the gallery and archives. Launch it from the control room.

Recover a badge in the reception airlock, bring a relay online in the technical gallery and restore the archive index to open the evacuation post. Confirm the protocol that matches the index before validating the exit. To take the workshop route, read its register and inspect its indicator to open the side passage. The in-game plan and the map beside the web player show the route and confirmed objectives.

Choose a visit to explore freely or a challenge to evacuate within three minutes of play. Pausing stops the countdown. At the end, replay the current mode or return to mode selection. The last run’s report (mode, objectives, outcome, date) is kept across reloads and announced explicitly; the room, doors and position are not restored, so a new crossing starts from the airlock.

On keyboard, use ZQSD or WASD to move, mouse or arrows to look, E to interact, and P or Escape to pause. On touchscreens, drag on the left to move and on the right to look. Use the on-screen buttons to interact or pause.

The web build serves the station from `public/godot-station`. To edit the level natively, open `godot-fps/project.godot` in Godot 4.6.3. Install the matching Web export templates and run `npm run station:export` to rebuild the playable files. Set `GODOT_BIN` to use a specific executable, or `GODOT_RUNTIME_DIR` when the existing export templates are stored under that directory's `data/godot` tree.

`npm run station:test` checks both routes in Godot, including floor joins, passage clearance, protocol selection, countdown, pause and replay. The test places a player at checkpoints to check physics and interactions independently of the browser controls.

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
