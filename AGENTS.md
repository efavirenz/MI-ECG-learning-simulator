# AGENTS.md — Development & Clinical Guidelines for AI Agents (Release v6.5)

This document defines the architecture, project conventions, and clinical accuracy standards for AI agents contributing to the **Interactive 12-Lead ECG & Myocardial Infarction Learning Simulator (v6.5)**.

---

## 1. Project Overview & Clinical Mission

- **Purpose**: Interactive clinical education simulator connecting:
  $$\text{Anatomical Location} \longrightarrow \text{Electrode Placement} \longrightarrow \text{ECG Lead Abnormalities}$$
- **Audience**: Registered Nurses, Paramedics/EMTs, Emergency and Critical Care staff, and Medical Trainees.
- **Language**: English throughout all user-facing strings, labels, ECG annotations, and references.
- **Patient Population**: Adult cardiology only.
- **Release identifiers**: the visible simulator release label (v6.5 and future v6.x releases) is maintained separately from the private npm package metadata version (`1.0.0`); do not automatically synchronize them.

---

## 2. Development Validation Commands

- `npm test`: run the Vitest + jsdom + React Testing Library suite.
- `npm run test:watch`: run tests in watch mode during local development.
- `npm run build`: run strict TypeScript compilation followed by the Vite production build.
- Keep tests focused on software behavior and data integrity; do not encode unapproved clinical thresholds or treat tests as a substitute for clinical validation.

## 3. Repository Architecture & File Map

```
MI-ECG-learning-simulator/
├── index.html                   # Entry HTML with system font fallback stacks
├── package.json                 # React 18, Vite 6, Vitest test scripts, Tailwind CSS, Lucide React
├── tsconfig.json                # TypeScript strict (noUnusedLocals, noUnusedParameters)
├── vite.config.ts               # Vite configuration (port 3000)
├── vitest.config.ts              # Vitest + jsdom + React Testing Library configuration
├── .github/
│   ├── dependabot.yml            # Monthly npm and GitHub Actions dependency updates
│   └── workflows/deploy.yml      # Pinned GitHub Pages build/test/deploy workflow
├── tailwind.config.js           # ECG grid and medical slate theme tokens
├── prompt.md                    # Core project specifications
├── README.md                    # User and developer documentation
├── AGENTS.md                    # AI agent instructions & clinical guidelines
├── public/
│   └── favicon.svg              # ECG rhythm vector favicon
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Global state coordinator & module switcher
    ├── index.css                # Tailwind base + calibrated ECG grid background classes
    ├── context/
    │   └── ThemeContext.tsx         # Global theme provider, tokens, and useTheme hook
    ├── data/
    │   ├── electrodes.ts        # 10 standard + 5 supplemental electrodes data
    │   ├── miTerritories.ts     # STEMI territories, culprit vessels, waveform deltas
    │   ├── clinicalCriteria.ts  # 2025 ACC/AHA & 2023 ESC criteria, mimics, ACS equivalents
    │   ├── clinicalCases.ts     # 5 clinical scenarios + 10-question knowledge quiz
    │   ├── references.ts        # Cited guideline references and clinical disclaimer
    │   ├── themes.ts            # 10 clinical UI themes (5 bright + 5 dark) and styling tokens
    │   └── clinicalDataIntegrity.test.ts # Structural regression tests for educational data
    ├── utils/
    │   ├── ecgGenerator.ts      # Synthetic ECG voltage model & landmark calculator
    │   ├── ecgDisplay.ts        # Shared canvas gain, baseline, sweep and waveform visual-state helpers
    │   ├── themeStorage.ts      # Safe, validated local theme persistence
    │   └── themeStorage.test.ts # Theme storage resilience tests
    ├── test/
    │   └── setup.ts             # Testing Library matchers and jsdom setup
    └── components/
        ├── Navbar.tsx                   # Top navigation with tabs and active MI pill
        ├── ECGBasicsModule.tsx          # 10 electrodes vs 12 leads, Angle of Louis, intervals
        ├── AnteriorTorso.tsx            # Interactive 2D vector chest SVG + practice mode
        ├── PosteriorTorso.tsx           # Interactive 2D vector back SVG (V7–V9)
        ├── SupplementalLeadsModule.tsx  # Right-sided (V3R/V4R), posterior, & QAS workflow
        ├── HeartTerritoryView.tsx       # Interactive 2D vector heart & coronary arteries
        ├── ECGWaveformMonitor.tsx       # Live 3x4 + Lead II rhythm strip canvas simulator
        ├── LeadDetailModal.tsx          # Magnified single lead view with calipers & landmarks
        ├── ClinicalScenariosModule.tsx  # Interactive case scenarios & quiz mode
        ├── ReferencesModule.tsx         # Guideline tables, STEMI mimics, & disclaimer
        └── *.test.tsx                    # Component interaction and accessibility regression tests
```

---

## 4. Strict Project Rules for Agents

### Rule 1 — TypeScript & Strict Compilation
- Strict mode is enabled (`noUnusedLocals: true`, `noUnusedParameters: true`).
- Any unused import or variable will cause `npm run build` to fail.
- Never use `any`, `@ts-ignore`, or non-null assertions without strict necessity.
- Every commit or edit must pass `npm run build` cleanly before completion.

### Rule 2 — Absolute Clinical Accuracy
- **Do not invent or estimate medical criteria.** Always adhere strictly to the cited guidelines:
  - **2025 ACC/AHA/ACEP/NAEMSP/SCAI ACS Guidelines**
  - **2023 ESC Guidelines for the Management of ACS**
  - **2026 ESC Fifth Universal Definition of Myocardial Infarction**
  - **Queensland Ambulance Service (QAS) June 2026 Clinical Practice Procedures**
- **J-Point Baseline**: The clinical reference-segment method must be explicit and approved. Use the preceding **PR segment** or a source-defined TP fallback where applicable; do not treat the synthetic modal reference as a validated clinical measurement baseline.
- **Contiguous Leads Rule**: STEMI diagnosis strictly requires $\ge 2$ anatomically contiguous leads.
- **STEMI Thresholds**:
  - Leads V2–V3:
    - Men $< 40$ years: $\ge 2.5\text{ mm}$ ($0.25\text{ mV}$)
    - Men $\ge 40$ years: $\ge 2.0\text{ mm}$ ($0.20\text{ mV}$)
    - Women (all ages): $\ge 1.5\text{ mm}$ ($0.15\text{ mV}$)
  - All other standard leads: $\ge 1.0\text{ mm}$ ($0.10\text{ mV}$)
  - Supplemental right-sided (V3R, V4R): qualitative acquisition guidance only until numeric threshold and subgroup claims are supported by approved primary sources.
  - Supplemental posterior (V7, V8, V9): use a reviewer-selected, source-specific lead combination and threshold; do not apply a single-lead rule or merge separate source statements.

### Rule 3 — Electrophysiological Calibration Standards
- **Paper Speed**: Standard is $25\text{ mm/s}$ ($1\text{ mm small box} = 0.04\text{ s} = 40\text{ ms}$; $5\text{ mm large box} = 0.20\text{ s} = 200\text{ ms}$).
- **Voltage Calibration**: Standard is $10\text{ mm/mV}$ ($1\text{ mm small box} = 0.1\text{ mV}$; $10\text{ mm} = 1.0\text{ mV}$).
- Canvas and SVG coordinates must preserve the same model time/voltage ratios and square grid boxes; browser CSS pixels are not a physical millimetre calibration.
- **Synthetic timing contract**: the reference cycle is 0.8 s at 75 bpm; the current model uses a 110 ms P wave, 200 ms PR interval, 105 ms QRS complex and a T wave ending at 680 ms. These are schematic model parameters, not a substitute for patient-derived ECG validation or a clinical normal-range claim.
- **Anti-Clipping & Margin Standards**: Standard, rhythm and supplemental canvases must share one gain and preserve at least 1.6 mV headroom on both sides of the baseline. The Lead II rhythm-strip sweep begins after its calibration pulse and connector, not at the canvas origin. Every canvas trace must end and wrap on a whole reference cycle to avoid phase discontinuity at the edge.
- **Trace colour semantics**: ischemic ST elevation, ST-elevation mimics (pericarditis/early repolarization), reciprocal depression and baseline morphology must remain visually distinguishable.

### Rule 4 — Mandatory Clinical Safety Warnings
- **Mason-Likar Torso Modification**: Always document that moving limb electrodes to the torso alters frontal axis and produces pseudo-Q waves; it is valid for telemetry but non-diagnostic for STEMI.
- **Prehospital Cable Reassignment**: When standard cables (e.g. V4) are moved to the right chest or back (V4R or V7–V9), the machine software still prints the original lead name. Agents must preserve the explicit warning that the clinician **must hand-annotate the printout** to prevent diagnostic errors.
- **Right Ventricular Infarction Medication Wording**: Keep medication classes distinct. Do not describe morphine or diuretics as universally contraindicated. Nitroglycerin wording must reflect the cited suspected-RV-infarction precaution. Any remaining morphine/diuretic teaching must be clinically signed off and aligned with the applicable local protocol.

### Rule 5 — Functional Integrity & Separation of Concerns
- Educational data and clinical parameters belong in `src/data/`, not hardcoded inside UI components.
- Do not create dead buttons, dummy links, or unclickable controls.
- Maintain bidirectional synchronization between the active MI territory, the heart diagram, the torso diagrams, and the ECG waveform monitors.

### Rule 6 — Mobile Responsiveness & Touch Ergonomics
- The default initial module on application launch is **Module 1 (`ECG Basics`)**.
- All educational data tables must feature horizontal touch scrolling (`overflow-x-auto touch-pan-x`) with explicit minimum widths (`min-w-[620px]`) so columns remain accessible on mobile phone viewports.
- Drawers and dialog overlays must support dismiss-on-outside-click/tap across all desktop and mobile touch browsers (including iOS Safari).
- Anatomical and thoracic reference lines must preserve high-contrast visibility across both dark and bright themes.

---

## 5. Verification Workflow for Agents

Before completing any task, execute:
```bash
# 1. Verify strict TypeScript build
npm run build

# 2. Check git status
git status
```
Ensure build exits with code 0 and no console warnings.

---
*Interactive 12-Lead ECG & Myocardial Infarction Learning Simulator • Release v6.5*

**Clinical review gate:** High-severity findings remain release blockers until a qualified clinical/model owner approves the source-specific medication wording, multi-lead criteria, posterior MI framework, Q-wave criterion/model semantics, and PR/J-point reference policy. Numeric V3R/V4R claims, Wellens/aVL statistics, and De Winter source details remain omitted until primary-source provenance and reviewer approval are recorded. LVH/LBBB is displayed as an interpretation limitation only; no modified threshold is implemented.

**Typography:** The application uses system font stacks and does not require Google Fonts at runtime.
