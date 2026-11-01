# Interactive 12-Lead ECG & Myocardial Infarction Learning Simulator

A clinically accurate, fully interactive educational web application designed for healthcare professionals (Registered Nurses, Paramedics / EMTs, Emergency and Critical Care staff, and Medical Trainees).

The simulator bridges three core electrophysiological concepts:
$$\text{Anatomical Location} \longrightarrow \text{Electrode Placement} \longrightarrow \text{ECG Lead Abnormalities}$$

---

## 🚀 Key Features & Modules

### 1. Standard 12-Lead ECG Electrode Placement
- **10 Electrodes vs 12 Leads**: Clarifies physical sensors vs electrical vector projections.
- **Interactive 2D Anterior Adult Torso**: Vector SVG chest model with toggleable skeletal ribcage, sternum, and reference vertical lines (Midclavicular, Anterior Axillary, Midaxillary).
- **The Angle of Louis (Sternal Angle)**: Step-by-step guidance on locating the 2nd costal cartilage and counting intercostal spaces down to the 4th and 5th ICS.
- **Sequence Best Practices**: Emphasizes placing V4 before V3 for proper spacing.
- **Female Patient Landmarks**: Chest wall placement in the inframammary fold, avoiding breast tissue and nipples.
- **Mason-Likar Torso Warning**: Cautions against modified torso placement for formal STEMI diagnosis due to axis shifts and false Q waves.
- **Practice Mode**: Test electrode landmarking skills with immediate feedback and scoring.

### 2. Supplemental ECG Leads (Right-Sided & Posterior)
- **Right-Sided ECG (V3R, V4R)**:
  - Indicated in inferior STEMI (30–50% co-involvement) and unexplained hypotension.
  - V4R (5th ICS right MCL) threshold: $\ge 0.5\text{ mm}$ ($\ge 1.0\text{ mm}$ in males < 30).
  - Hemodynamic collapse risk: Withhold nitrates, morphine, and diuretics; treat with rapid IV fluid volume boluses.
- **Posterior ECG (V7, V8, V9)**:
  - Indicated for reciprocal ST depression and tall R waves in V1–V3.
  - Placement: Horizontal plane of V6 at left posterior axillary line (V7), midscapular line (V8), and paraspinal line (V9).
  - Diagnostic threshold: $\ge 0.5\text{ mm}$ ST elevation.
- **Step-by-Step Acquisition Workflow**: Based on Queensland Ambulance Service (QAS) March 2026 guidelines. Includes cable reassignment table and mandatory manual re-labeling warnings.

### 3. Myocardial Infarction Anatomical Localization
- **Interactive 2D Vector Heart**: Anterior (Sternocostal) and Posterior/Inferior (Diaphragmatic) coronary views.
- **Coronary Arteries Visualized**: LMCA, LAD (D1, D2, S1), LCx (OM, PLB), and RCA (acute marginals, PDA).
- **Territories Covered**:
  - Septal (V1–V2, LAD septal branches)
  - Anterior (V3–V4, LAD diagonal branches)
  - Anteroseptal (V1–V4, proximal LAD)
  - Extensive Anterior / Tombstone (V1–V6, I, aVL, proximal LAD / Left Main)
  - Lateral (I, aVL, V5, V6, LCx or diagonal LAD)
  - High Lateral (I, aVL, 1st diagonal LAD or OM1, reciprocal II, III, aVF)
  - Inferior (II, III, aVF, RCA ~85% or LCx ~15%, reciprocal I, aVL)
  - Posterior (V7–V9, reciprocal horizontal ST depression & tall R in V1–V3)
  - Right Ventricular (V3R, V4R, proximal RCA)
- **Clinical Clarification**: Explains coronary dominance and highlights lead findings as typical and supportive rather than an absolute isolated geometry.

### 4. Calibrated ECG Waveform Simulator
- **Standard Clinical Layout**: $3 \times 4$ layout (I, II, III; aVR, aVL, aVF; V1, V2, V3; V4, V5, V6) plus a continuous Lead II rhythm strip.
- **Supplemental Leads Toggle**: View V3R, V4R, V7, V8, V9.
- **Clinical Grid Standards**: Calibrated to $25\text{ mm/s}$ paper speed and $10\text{ mm/mV}$ voltage calibration with $1.0\text{ mV}$ calibration pulse.
- **Animation Controls**: Real-time continuous sweep beam, play/pause, speed controls ($0.5\times$, $1.0\times$, $2.0\times$), reset.
- **Dual Display Modes**: Modern Dark Clinical Monitor vs Pink ECG Paper.
- **Normal Overlay Comparison**: Displays normal baseline morphology as a dashed line behind the active pathological waveform.
- **Magnified Single-Lead Analysis Modal**: Click any lead to inspect P, PR segment, Q, R, S, J point, ST segment, T wave, and use the interactive caliper to measure ST deviation in mm.

### 5. Clinical Criteria, STEMI Mimics & Equivalents
- **Guideline Diagnostic Thresholds**: 2025 ACC/AHA and 2023 ESC criteria by age and sex (including V2–V3 specific cutoffs).
- **STEMI Mimics Comparison Table**: Distinguishes acute STEMI from Acute Pericarditis, Benign Early Repolarization (BER), LVH with strain, and Left Bundle Branch Block (LBBB).
- **High-Risk Equivalents**: Wellens Syndrome (Type A and B), de Winter pattern, and Modified Sgarbossa criteria.

### 6. Clinical Scenarios & Knowledge Check Quiz
- **5 Realistic Cases**:
  1. Inferior STEMI & Right Ventricular Assessment
  2. The "Hidden" Posterior Wall Infarction
  3. Acute Anterior STEMI & LAD Occlusion
  4. High Lateral STEMI & The Pitfall of Reciprocal Depression
  5. Combined Inferior and RV Infarction & Nitroglycerin Collapse
- **10-Question Knowledge Quiz**: Covers electrode positioning, Angle of Louis, female patient techniques, J-point measurement, and STEMI diagnosis.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript (Strict mode)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Graphics**: Interactive custom SVG anatomical models & HTML5 Canvas ECG rendering

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd MI-ECG-learning-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Type check and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📚 Authoritative Clinical References

1. **2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes**  
   [American College of Cardiology / AHA Guidelines](https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes)
2. **2023 ESC Guidelines for the Management of Acute Coronary Syndromes**  
   [European Heart Journal](https://academic.oup.com/eurheartj/article/44/38/3720/7243210)
3. **Fifth Universal Definition of Myocardial Infarction (2026)**  
   [European Society of Cardiology Pocket Guidelines](https://www.escardio.org/guidelines/clinical-practice-guidelines/pocket-guidelines/universal-definition-of-myocardial-infarction/)
4. **Queensland Ambulance Service Clinical Practice Procedures: 12-Lead ECG Acquisition and Interpretation (March 2026)**  
   [Queensland Ambulance Service CPP](https://www.ambulance.qld.gov.au/__data/assets/pdf_file/0033/475791/CPP_12-lead-ECG-acquisition-and-interpretation.pdf)

---

## 📝 Update History & Changelog

### [v5.1] [2026-11-01] — Multi-Lead Waveform Animation Calibration, Phase-Locking & Magnified Analysis Precision
- **Synchronized Phase-Locking Across All 12 Leads & Lead II Rhythm Strip**:
  - In `src/components/ECGWaveformMonitor.tsx`, calibrated 12-lead and supplemental lead boxes strictly to an integer multiple of the cardiac cycle: $2.40\text{ s}$ duration ($60.0\text{ mm}$ width at $25\text{ mm/s} = 3$ complete beats at 75 bpm) and rhythm strip to $9.60\text{ s}$ duration ($240.0\text{ mm} = 12$ complete beats at 75 bpm = $4 \times 2.40\text{ s}$).
  - Aligned Lead II rhythm strip calibration lead-in to exactly $20.0\text{ mm}$ ($0.80\text{ s} = 1$ cardiac cycle), establishing 100% synchronous phase-lock between Lead II in the 3x4 grid matrix and the continuous Lead II rhythm strip below it.
  - Eliminated phase wrapping jumps: because durations are exact integer multiples of 0.80s, the sweep line loops seamlessly at the isoelectric electrical diastole baseline ($0.0\text{ mV}$) with zero visual glitching.
  - Aligned previous cycle trace color to match active injury morphology with 0.25 opacity (faint red for ST elevation, faint cyan for ST depression/reciprocal).
- **Magnified Waveform Analysis Graphic Accuracy & Calibration Pulse Fix**:
  - In `src/components/LeadDetailModal.tsx`, eradicated the overlapping calibration pulse artifact where abnormal and normal waveform traces re-stroked the standard calibration mark in dashed or injury colors. Waveform path points now initiate cleanly at $X = 90$ ($t = 0$), preserving a single, crisp, standard 1.0 mV (0.20s) calibration pulse with isoelectric connector.
  - Increased waveform sampling density from 450 to 600 points (exact 1 px / 4.0 ms resolution) for razor-sharp, sub-millimeter morphology without peak blunting.
  - In Live Sweep mode, introduced dual-cursor normal baseline tracking: displays a secondary reference cursor point and connecting dashed guide on the normal comparison curve, visualizing instantaneous ST deviation in real time.
  - Enhanced electronic caliper interaction to dynamically evaluate the clinician's active measurement against 2025 ACC/AHA and 2023 ESC criteria, with clear display of nominal programmed values.
- **Electrophysiological Headroom & Anti-Clipping Integrity**:
  - In `src/utils/ecgGenerator.ts` and `src/data/miTerritories.ts`, fixed compound multiplier bug on `tallRWave` in posterior STEMI that previously inflated Lead V3 R waves to $+3.74\text{ mV}$ (causing severe upper boundary clipping and excessive slew rates). R waves across V1–V3 are now accurately calibrated within clinical amplitudes ($1.1\text{--}1.53\text{ mV}$, $R/S > 1.0$ in V2/V3), remaining strictly within the calibrated $2.0\text{ mV}$ headroom.
- **Version Bump**: Updated badges and footer to `v5.1` across `Navbar.tsx`, `App.tsx`, `AGENTS.md`, and `README.md`.

### [v5] [2026-11-01] — Waveform Simulator Calibration Overhaul, Magnified Analysis & Anti-Clipping Standards
- **Waveform Simulator Paper Speed & Grid Calibration Overhaul**:
  - In `src/components/ECGWaveformMonitor.tsx`, eliminated the box clamping bug that caused grid-to-waveform paper speed misalignment. Calibrated 12-lead boxes strictly to 2.5 seconds ($62.5\text{ mm}$ at $25\text{ mm/s}$, $\text{smallBox} = w / 62.5$) and continuous Lead II rhythm strip strictly to 10.0 seconds ($250\text{ mm}$ at $25\text{ mm/s}$, $\text{smallBox} = w / 250$).
  - Corrected Lead II rhythm strip elapsed time calculations so trace waveform time advances at strictly $25\text{ mm/s}$ without compression.
- **Anti-Clipping & Vertical Headroom Standards**:
  - Increased 12-lead and supplemental lead canvas heights from `h-28` to `h-36 sm:h-40`, and rhythm strip to `h-40 sm:h-44`, ensuring ample headroom ($\ge 2.0\text{ mV}$ positive, $\ge 1.6\text{ mV}$ negative) for deep S waves (down to $-1.45\text{ mV}$ in V1/V2) and tall R waves (+1.45 mV) + STEMI ST elevations (up to $+6.0\text{ mm}$ in extensive anterior MI).
- **Magnified Waveform Analysis (1:1 Isometric Square Grid)**:
  - In `src/components/LeadDetailModal.tsx`, eradicated the 3:1 rectangular aspect ratio stretch ($24.5\text{ px} \times 8\text{ px}$) that distorted ECG morphology. Re-architected with true square grid boxes ($10\text{ px} \times 10\text{ px}$ minor, $50\text{ px} \times 50\text{ px}$ major).
  - Calibration pulse calibrated to exactly 1 large box wide ($50\text{ px} = 5\text{ mm} = 0.20\text{ s}$) and 2 large boxes tall ($100\text{ px} = 10\text{ mm} = 1.0\text{ mV}$).
  - Displays 3 continuous cardiac cycles (2.40s) with 8 interactive landmark pins centered on Cycle 2.
  - **Baseline Label Collision Resolution**: Relocated `0.0 mV Baseline` directly beneath the standardization calibration pulse ($x=20, y=215$) and right-aligned `PR Segment Isoelectric Reference (0 mV)` at the far right edge ($x=705, y=215$), keeping all waveform cycles completely clear of overlapping text.
  - Interactive Electronic Caliper anchored directly at the user's clicked $(x, y)$ coordinates with vertical bracket and floating measurement badge.
  - Added dismiss-on-outside-click/tap to modal dialog backdrop per Rule 6.
- **Electrophysiological Synthesis Fixes**:
  - In `src/utils/ecgGenerator.ts`, fixed ST segment slope evaluation when $\text{stMv} = 0$, ensuring baseline normal ECG ST segments remain strictly isoelectric ($0.0\text{ mV}$) without false convex elevation arches.
  - Calibrated P-wave landmark apex time to $0.150\text{ s}$ matching mathematical peak of raised sine lobe.
  - Fixed Q-wave landmark when absent (V1/V2 rS morphology), placing landmark at QRS onset baseline ($0.0\text{ mV}$) rather than midway up the R-wave upstroke.
  - Enhanced clinical threshold evaluator to accurately recognize reciprocal ST depression in V1–V3 as acute posterior STEMI criteria.
- **Version Bump**: Updated release badges, footers, and guidelines to `v5` across `Navbar.tsx`, `App.tsx`, `AGENTS.md`, and `README.md`.

### [v4.3] [2026-11-01] — Torso Graphic Overhaul, Reference Line Alignment & Waveform Calibration
- **Torso Electrode Hover Stability Fix**:
  - In `src/components/AnteriorTorso.tsx` and `src/components/PosteriorTorso.tsx`, removed `group-hover:scale-125 origin-center` which caused SVG transform coordinate misalignment and button jumping on mouse hover. Replaced with rock-solid `group-hover:brightness-110 drop-shadow-md` keeping the colored marker and text label perfectly centered.
  - In `2. Electrode Placement` and `3. Supplemental Leads` (`Right-Sided Leads V3R, V4R`), fixed all reference line vertical trajectories to strictly align with precordial electrode coordinates: Left MCL ($x=264$) passes precisely through V4, Left AAL ($x=296$) passes through V5, Left MAL ($x=328$) passes through V6, and Right MCL ($x=136$) passes through V4R.
  - Aligned all electrode coordinates in `src/data/electrodes.ts` to their anatomically calibrated landmark intersections (V1 at right 4th ICS, V2 at left 4th ICS, V3 at diagonal midpoint, V4 at 5th ICS MCL, V5 at 5th ICS AAL, V6 at 5th ICS MAL).
- **Anatomical Human Body Graphic Recreation**:
  - Re-rendered vector torso graphics in `src/components/AnteriorTorso.tsx` and `src/components/PosteriorTorso.tsx` with clinical mannequin limbs: forearms slightly abducted (~15°–20°) to ensure zero obstruction of the Left Midaxillary Line (V6), realistic wrist creases, and fingerless contoured palms with relaxed thumb silhouettes.
  - Re-anchored `RA` ($x=7.0\%, y=83.0\%$) and `LA` ($x=93.0\%, y=83.0\%$) to the distal inner wrists in `src/data/electrodes.ts`, accurately demonstrating standard 12-lead diagnostic limb lead placement versus telemetry Mason-Likar torso modification.
  - Included suprasternal (jugular) notch, realistic clavicular arches with midpoints centered at $x=136$ and $x=264$, pectoralis major contours, sternal body, Angle of Louis bony ridge at 2nd rib, and ribcage ribs 1–5.
- **Magnified Baseline Label Collision Fix**:
  - In `LeadDetailModal` (`Magnified Waveform Analysis`), relocated the red `Isoelectric Baseline (0 mV / PR Segment)` text label to below the horizontal dotted baseline ($y=195$) and shifted it to the far left ($x=18$), completely eliminating text collisions with the `P` and `PR Seg` landmark labels.
- **Lead II Continuous Rhythm Strip Calibration Pulse Separation**:
  - In `5. Waveform Simulator` (`Lead II Continuous Rhythm Strip`), inserted a dedicated $1.5\text{ large box}$ ($7.5\text{ mm} / 0.30\text{ s}$) isoelectric lead-in segment between the standardization Calibration Pulse and the emergence of the 1st P wave, aligning with clinical ECG paper standards.
- **Version Bump**: Updated release badges and footers to `v4.3` across `Navbar.tsx`, `App.tsx`, `AGENTS.md`, and `README.md`.

### [v4.2] [2026-11-01] — Reference Line Dual Labels, Anatomical Heart Graphic Overhaul, Waveform Sweep & Lead Contrast
- **Dual-Ended Thoracic Reference Line Labels**:
  - In `2. Electrode Placement` and `3. Supplemental Leads` (`Right-Sided Leads V3R, V4R`), added inferior labels at the bottom of all vertical guidelines (`Right MCL (V4R)`, `Midsternal Line`, `Left MCL`, `Ant. Axillary (AAL)`, `Midaxillary (MAL)`).
- **Posterior Overlay Collision Fix**:
  - In `3. Supplemental Leads` (`Posterior Leads V7, V8, V9`), moved `Thoracic Spine (T7-T8)` upward to $y=262$ and placed `Horizontal Plane of V6 (Crucial Reference)` directly beneath the horizontal dashed line at $y=288$, preventing label overlap.
- **Bright Theme Selected Lead Contrast**:
  - Resolved low-contrast white font on light buttons when selecting precordial and supplemental leads (`V1–V6`, `V3R`, `V4R`, `V7–V9`). Buttons now display prominent dark typography (`#020617`), accented borders, and rich tint fills in bright modes.
- **High-Fidelity 2D Anatomical Heart UI**:
  - In `4. MI Localization`, redesigned vector heart graphics for both Sternocostal (Anterior) and Diaphragmatic/Base (Posterior) orientations. Features 3D tubular lighting, aortic arch branches, pulmonary trunk bifurcation, cardiac auricles, 4 pulmonary veins, coronary sinus, and epicardial fat sulci, while retaining 100% synchronization with coronary perfusion territories.
- **Calibrated Waveform Simulation & Magnified Inspection**:
  - In `5. Waveform Simulator`, eliminated animation time jumps on pause/resume, stabilized freeze-frame display, and added continuous isoelectric baseline connections.
  - In `LeadDetailModal`, added live sweep playback toggle at 25 mm/s, lead-specific landmark morphology (pathological QS complexes, aVR inverted vectors, tall reciprocal posterior R waves), and theme-harmonized caliper overlays.
- **Version Bump**: Updated badges and footer to `v4.2` across `Navbar.tsx`, `App.tsx`, `AGENTS.md`, and `README.md`.

### [v4.1] [2026-10-31] — Default Homepage, Outside-Tap Dismissal, High-Contrast Overlays & Mobile Table Scrolling
- **Default Homepage Routing**:
  - Set default landing view to `1. ECG Basics` on startup for optimal pedagogical progression.
- **Hamburger Menu Outside Click/Tap Dismissal**:
  - Implemented full backdrop event capture (`onClick` and `onTouchEnd` with `e.stopPropagation()` on drawer content), enabling seamless menu closure when tapping or clicking outside on mobile Safari (iOS) and desktop browsers.
- **High-Contrast Thoracic Reference Lines**:
  - In `2. Electrode Placement` and `3. Supplemental Leads`, elevated vertical reference line contrast in bright themes with saturated strokes ($1.8\text{--}2.0\text{ px}$), $0.95$ opacity, and bold dark typography (`#0369a1`, `#312e81`, `#581c87`, `#6b21a8`, `#78350f`) for crisp visibility on light chest walls.
- **Mobile Horizontal Table Scrolling**:
  - In `1. ECG Basics` (`10 Electrodes vs 12 Leads`), wrapped `Standard 12 Leads Generation Matrix` in an `overflow-x-auto touch-pan-x` container with `min-w-[620px]` and mobile swipe indicator, resolving column clipping on iPhone screens.
- **Version Bump**: Updated application release badge to `v4.1`.

### [v4] [2026-10-31] — Theme Consistency, Responsive Waveforms, Jitter-Free Rendering & Placement Ergonomics
- **Eliminated Redundant Concept Banner**:
  - Removed the `Synchronized Educational Core • Concept Triad` banner to streamline interface hierarchy.
- **Theme Color & Contrast Harmonization**:
  - Introduced unified React `ThemeContext` providing dynamic design tokens (`accentBg`, `accentText`, `cardBg`, `cardSubBg`, `cardBorder`, etc.) across all 7 curriculum modules.
  - Resolved theme mismatches where topic fonts and highlight buttons remained hardcoded red in non-red palettes. The red `HeartPulse` logo next to the hamburger menu remains preserved.
  - Eliminated pale font over pale background in `3. Supplemental Leads` and other bright themes, replacing them with high-contrast dark text on light backgrounds.
- **Electrode Placement Hit Target Ergonomics & Practice Blind Mode**:
  - In `MODULE 1: STANDARD 12-LEAD PLACEMENT SIMULATOR`, enlarged electrode tap targets with an invisible $56 \times 56\text{ px}$ ($r=28$) touch zone and expanded marker radius ($r=12\text{--}15$), resolving mobile touch issues.
  - Added limb leads (`RA`, `LA`, `RL`, `LL`) to randomized practice targets alongside precordial leads.
  - In Practice Mode, hid all electrode text labels and color markers (displaying neutral unlabelled `?` targets) and hid the bottom legend to enforce true anatomical landmark recall.
- **Conditional Active MI State Dropdown**:
  - Moved the active MI dropdown directly below the navigation tabs and restricted display to `4. MI Localization` and `5. Waveform Simulator` tabs only.
- **Jitter-Free Waveform Rendering**:
  - Overhauled canvas rendering loops to use invariant, fixed $1.0\text{ px}$ sampling coordinates across all traces (active wave, prior cycle, and normal overlay), eliminating visual jitter during playback.
- **Mobile Single-Column Clinical Lead Ordering**:
  - Configured responsive CSS Grid positioning for mobile screens (e.g. Safari on iPhone): sorted in canonical order from limb leads (`I, II, III, aVR, aVL, aVF`) to precordial leads (`V1–V6`), while maintaining the standard $3 \times 4$ layout matrix on desktop.
- **Version Bump**: Updated application release badge to `v4`.

### [v3.1] [2026-10-31] — Lead II Rhythm Strip Anti-Clipping, Full-Height Menu & Waveform Precision
- **Lead II Continuous Rhythm Strip Anti-Clipping**:
  - Resolved vertical clipping where tall Lead II R waves ($+1.25\text{ mV}$) exceeded canvas boundaries.
  - Increased rhythm strip canvas height to `h-36 sm:h-40` (144–160px) and synchronized physical millimeter scaling ($3.5\text{--}4.2\text{ px/mm}$) across all leads.
  - Aligned isoelectric baseline to 60% height, guaranteeing $>30\text{ px}$ headroom for tall R peaks and hyperacute ST-T elevation.
- **Full-Height Hamburger Navigation Drawer**:
  - Restructured drawer container to occupy full display height (`h-screen max-h-screen`) without vertical overflow.
  - Converted the 10 color themes into a 2-column side-by-side grid (5 Bright on left, 5 Dark on right), eliminating unnecessary scrolling.
- **Waveform Graphical Accuracy & Dynamic Headroom**:
  - Re-audited and calibrated baseline morphologies across all 12 standard and 5 supplemental leads.
  - Corrected Lead aVR morphology (`qAmp: 0.0`) for clean physiological rS complex and inverted T wave.
  - Calibrated magnified single-lead inspection modal baseline to $Y = 180$ with 40 px major grid lines, preventing clipping of deep S waves ($-1.45\text{ mV}$ in V2) and tall R waves ($+1.45\text{ mV}$ in V5).
- **Version Bump**: Updated application release badge to `v3.1`.

### [v3] [2026-10-31] — Layout Optimization, Version Badge, Navigation Drawer & Color Themes
- **Active MI State Dropdown Relocation**:
  - Moved the interactive territory selector from the top-right header to a dedicated centered row between the simulator subtitle (`Interactive Clinical Simulator: Anatomy → Electrodes → ECG Waveforms`) and the navigation tabs (`1. ECG Basics`).
  - Aligned center with responsive screen-fitted width (`max-w-3xl`) for seamless visibility across mobile, tablet, and widescreen desktop displays.
- **Release Version Badge**:
  - Added a dedicated `v3` indicator in a rounded rectangle badge at the top-right of the header with status pulse.
- **Slide-in Hamburger Menu (Auto-Closing)**:
  - Added a top-left hamburger menu (`Menu` icon) providing convenient access to all 7 curriculum modules:
    1. `1. ECG Basics`
    2. `2. Electrode Placement`
    3. `3. Supplemental Leads`
    4. `4. MI Localization`
    5. `5. Waveform Simulator`
    6. `6. Cases & Quiz`
    7. `7. References & Criteria`
  - Automatically closes upon module selection or backdrop click.
- **10 Color Themes (5 Bright & 5 Dark)**:
  - Embedded a full 10-palette clinical theme switcher directly within the hamburger drawer:
    - **5 Bright Themes**: Pink ECG Paper (classic grid paper), Clinical White (hospital clean), Mint Health (emerald soft), Sky Pediatric (crisp sky), and Warm Clinic (amber parchment).
    - **5 Dark Themes**: Telemetry Navy (default ICU monitor), Obsidian Cath-Lab (deep charcoal black), Bio-Monitor Green (biomedical telemetry), Deep Cobalt ICU (cardiac monitoring), and Critical Care Violet (high-contrast violet).
  - Theme preference is automatically persisted across browser sessions via `localStorage` and synchronized with the ECG paper view mode.

### [v2] [2026-10-31] — Clinical ECG Waveform Precision & Interactive State Enhancements
- **Global Active MI State Dropdown**:
  - Replaced the static text badge in the top-right header with an interactive grouped `<select>` dropdown menu.
  - Allows instant switching between Normal Baseline, 9 STEMI territories, and STEMI mimics from any screen or module.
- **Accurate & Clinically Calibrated ECG Tracings**:
  - Overhauled the mathematical electrophysiological cardiac cycle synthesizer in `src/utils/ecgGenerator.ts`.
  - **Normal Baseline**: Strict $0\text{ mV}$ isoelectric PR and TP segments, crisp QRS deflections, and physiological asymmetric T-wave transitions.
  - **Acute ST Elevation (STEMI & Mimics)**: S-wave terminates directly at the elevated J-point with a smooth coved "tombstone" dome merging into the T wave; concave "saddleback" ST elevation with PR depression for acute pericarditis; J-point slurring for benign early repolarization.
  - **ST Depression & Reciprocal Changes**: Clean horizontal ischemic shelf and downsloping ST depression starting strictly at the depressed J-point; tall R waves ($R/S > 1$) and upright prominent T waves for reciprocal posterior STEMI patterns.
- **Synchronized Real-Time Sweeping Beam**:
  - Fixed the static waveform issue during playback in `src/components/ECGWaveformMonitor.tsx`.
  - Waveforms now actively draw and reveal point-by-point in direct synchronization with the sweeping vertical beam from left to right ($25\text{ mm/s}$ paper speed).
  - Implemented an erase bar gap ahead of the sweep head with dim phosphor persistence for previous traces, matching clinical bedside monitors.
  - Added high-DPI (Retina) canvas scaling for razor-sharp, crystal-clear trace rendering.

---

## ⚖️ Clinical Disclaimer

This interactive simulator is strictly an educational tool for healthcare professionals and students. Simulated ECG signals and case studies are synthesized mathematical and educational models. This software does not provide medical diagnoses or real-time patient treatment guidance.
