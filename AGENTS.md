# AGENTS.md — Development & Clinical Guidelines for AI Agents (Release v5.5)

This document defines the architecture, project conventions, and clinical accuracy standards for AI agents contributing to the **Interactive 12-Lead ECG & Myocardial Infarction Learning Simulator (v5.5)**.

---

## 1. Project Overview & Clinical Mission

- **Purpose**: Interactive clinical education simulator connecting:
  $$\text{Anatomical Location} \longrightarrow \text{Electrode Placement} \longrightarrow \text{ECG Lead Abnormalities}$$
- **Audience**: Registered Nurses, Paramedics/EMTs, Emergency and Critical Care staff, and Medical Trainees.
- **Language**: English throughout all user-facing strings, labels, ECG annotations, and references.
- **Patient Population**: Adult cardiology only.

---

## 2. Repository Architecture & File Map

```
MI-ECG-learning-simulator/
├── index.html                   # Entry HTML with Inter and JetBrains Mono fonts
├── package.json                 # React 18, Vite 6, Tailwind CSS, Lucide React
├── tsconfig.json                # TypeScript strict (noUnusedLocals, noUnusedParameters)
├── vite.config.ts               # Vite configuration (port 3000)
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
    │   └── themes.ts            # 10 clinical UI themes (5 bright + 5 dark) and styling tokens
    ├── utils/
    │   └── ecgGenerator.ts      # Mathematical Gaussian ECG synthesizer & landmark calculator
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
        └── ReferencesModule.tsx         # Guideline tables, STEMI mimics, & disclaimer
```

---

## 3. Strict Project Rules for Agents

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
  - **Queensland Ambulance Service (QAS) March 2026 Clinical Practice Procedures**
- **J-Point Baseline**: The ST segment deviation must always be referenced to the preceding **PR segment** (or TP segment in tachycardic rhythms).
- **Contiguous Leads Rule**: STEMI diagnosis strictly requires $\ge 2$ anatomically contiguous leads.
- **STEMI Thresholds**:
  - Leads V2–V3:
    - Men $< 40$ years: $\ge 2.5\text{ mm}$ ($0.25\text{ mV}$)
    - Men $\ge 40$ years: $\ge 2.0\text{ mm}$ ($0.20\text{ mV}$)
    - Women (all ages): $\ge 1.5\text{ mm}$ ($0.15\text{ mV}$)
  - All other standard leads: $\ge 1.0\text{ mm}$ ($0.10\text{ mV}$)
  - Supplemental right-sided (V3R, V4R): $\ge 0.5\text{ mm}$ ($\ge 1.0\text{ mm}$ in men $< 30$)
  - Supplemental posterior (V7, V8, V9): $\ge 0.5\text{ mm}$

### Rule 3 — Electrophysiological Calibration Standards
- **Paper Speed**: Standard is $25\text{ mm/s}$ ($1\text{ mm small box} = 0.04\text{ s} = 40\text{ ms}$; $5\text{ mm large box} = 0.20\text{ s} = 200\text{ ms}$).
- **Voltage Calibration**: Standard is $10\text{ mm/mV}$ ($1\text{ mm small box} = 0.1\text{ mV}$; $10\text{ mm} = 1.0\text{ mV}$).
- All canvas and SVG waveform renderings must align with these grid measurements.
- **Anti-Clipping & Margin Standards**: Waveform monitors must provide sufficient vertical headroom for tall R waves (Lead II, V4, V5 up to $1.45\text{ mV}$ + STEMI ST elevation) and deep S waves (V1, V2 down to $-1.45\text{ mV}$). Lead II continuous rhythm strips must have proportional canvas height and width-adjusted duration so waveforms never exceed canvas boundaries.

### Rule 4 — Mandatory Clinical Safety Warnings
- **Mason-Likar Torso Modification**: Always document that moving limb electrodes to the torso alters frontal axis and produces pseudo-Q waves; it is valid for telemetry but non-diagnostic for STEMI.
- **Prehospital Cable Reassignment**: When standard cables (e.g. V4) are moved to the right chest or back (V4R or V7–V9), the machine software still prints the original lead name. Agents must preserve the explicit warning that the clinician **must hand-annotate the printout** to prevent diagnostic errors.
- **Right Ventricular Infarction Hemodynamics**: When inferior/RV infarction is present, preserve the strict contraindication warning against nitrates, morphine, and diuretics due to fatal preload collapse.

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

## 4. Verification Workflow for Agents

Before completing any task, execute:
```bash
# 1. Verify strict TypeScript build
npm run build

# 2. Check git status
git status
```
Ensure build exits with code 0 and no console warnings.

---
*Interactive 12-Lead ECG & Myocardial Infarction Learning Simulator • Release v5.5*
