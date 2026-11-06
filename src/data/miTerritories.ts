export interface MITerritory {
  id: string;
  name: string;
  shortDescription: string;
  primaryLeads: string[];
  reciprocalLeads: string[];
  culpritArtery: string;
  coronaryAnatomyNotes: string;
  expectedECG: {
    stSegment: string;
    tWave: string;
    qWave: string;
    reciprocal: string;
    otherFindings?: string;
  };
  supplementalLeadsRecommended?: {
    leads: string[];
    reason: string;
    clinicalPearl: string;
  };
  clinicalPearls: string[];
  heartRegionCoords: {
    anteriorHighlightSvgId?: string[];
    posteriorHighlightSvgId?: string[];
  };
  // Waveform parameter offsets for our engine
  waveformDeltas: Record<string, {
    stElevationMm: number; // in mm (0.1 mV = 1 mm)
    stSlope?: 'concave' | 'convex' | 'horizontal' | 'downsloping' | 'upsloping';
    tWaveAmplitudeMm?: number;
    tInverted?: boolean;
    qWaveMm?: number;

    tallRWave?: boolean;

    rAmplitudeMultiplier?: number;
  }>;
}

export const MI_TERRITORIES: Record<string, MITerritory> = {
  normal: {
    id: 'normal',
    name: 'Normal ECG (Sinus Baseline)',
    shortDescription: 'Reference 12-lead sinus-rhythm tracing without acute territorial ST–T changes. A normal-appearing ECG does not exclude ACS or obstructive coronary disease.',
    primaryLeads: [],
    reciprocalLeads: [],
    culpritArtery: 'No culprit vessel is inferred from a reference ECG',
    coronaryAnatomyNotes: 'A normal ECG cannot establish coronary patency or the pattern of coronary dominance.',
    expectedECG: {
      stSegment: 'ST segments are usually near the isoelectric baseline relative to the preceding PR segment (or a source-defined TP fallback). Interpret J-point deviation using the applicable lead-, age-, and sex-specific criteria; no single cutoff applies to every lead.',
      tWave: 'Upright in leads I, II, V3–V6; inverted in aVR; variable in III, aVF, and V1.',
      qWave: 'Small septal q waves may be present in I, aVL, V5, and V6. Assess potentially pathological Q waves by their duration, depth, contiguous-lead distribution, and clinical context.',
      reciprocal: 'None.'
    },
    clinicalPearls: [
      'Early-repolarization patterns may show J-point notching or slurring, with or without ST elevation; do not assume a pattern is benign when symptoms suggest ACS.',
      'Always compare with prior ECGs when available.'
    ],
    heartRegionCoords: {},
    waveformDeltas: {}
  },

  septal: {
    id: 'septal',
    name: 'Septal STEMI',
    shortDescription: 'Injury involving the interventricular septum, commonly represented by changes in V1–V2. Isolated septal infarction is uncommon and often overlaps anterior involvement.',
    primaryLeads: ['V1', 'V2'],
    reciprocalLeads: [],
    culpritArtery: 'Left Anterior Descending (LAD) — Septal perforator branches',
    coronaryAnatomyNotes: 'LAD septal perforators supply much of the anterior two-thirds of the interventricular septum and may supply the conduction system. The posterior third is usually supplied by the PDA; branch anatomy varies.',
    expectedECG: {
      stSegment: 'ST elevation in V1–V2 may indicate septal/anterior-septal injury in the appropriate context. Apply current STEMI criteria to at least two anatomically contiguous leads; ST-segment shape alone does not establish the diagnosis.',
      tWave: 'Hyperacute T waves may appear early; T-wave inversion can develop during evolution. The sequence and degree of change vary with timing and reperfusion.',
      qWave: 'Loss or reduction of the expected septal r wave in V1–V2 or a QS pattern may be seen, but neither is specific. Interpret morphology with lead placement, prior ECGs, serial changes, and clinical evidence.',
      reciprocal: 'There is no single obligatory reciprocal pattern; reciprocal changes depend on the extent and direction of associated myocardial injury.'
    },
    clinicalPearls: [
      'New RBBB or fascicular conduction abnormalities may accompany extensive septal ischemia because septal branches supply parts of the conduction system; these findings require urgent clinical assessment.',
      'Isolated septal STEMI is rare; usually occurs with anterior involvement (Anteroseptal).'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-septum', 'artery-lad']
    },
    waveformDeltas: {
      'V1': { stElevationMm: 2.8, stSlope: 'convex', qWaveMm: 4, rAmplitudeMultiplier: 0.2 },
      'V2': { stElevationMm: 3.2, stSlope: 'convex', qWaveMm: 5, rAmplitudeMultiplier: 0.3 }
    }
  },

  anterior: {
    id: 'anterior',
    name: 'Anterior STEMI',
    shortDescription: 'Injury involving the anterior LV wall, often extending toward the apex. The extent depends on the level of LAD occlusion, branch anatomy, and collateral supply.',
    primaryLeads: ['V3', 'V4'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Left Anterior Descending (LAD) — main vessel or diagonal branches, depending on the involved territory',
    coronaryAnatomyNotes: 'The LAD and its branches supply the anterior LV; septal perforators supply the anterior septum, while diagonal branches commonly supply anterolateral myocardium. The precise territory varies.',
    expectedECG: {
      stSegment: 'ST elevation is commonly seen in V3–V4 and may extend into other anterior precordial leads according to the extent of injury. Apply current criteria to contiguous leads; a coved or tombstone shape is not required.',
      tWave: 'Hyperacute T waves may occur early, with T-wave inversion developing later; these changes are time- and reperfusion-dependent and are not obligatory.',
      qWave: 'Pathological Q waves or reduced R-wave progression may develop, but neither is required for acute MI. Poor R-wave progression is nonspecific and should not be used alone to localize infarction.',
      reciprocal: 'Inferior ST depression may accompany some anterior, particularly proximal LAD, occlusions; it is variable and is not present in every case.'
    },
    clinicalPearls: [
      'Large anterior territories can place substantial LV myocardium at risk and may lead to LV dysfunction or cardiogenic shock; risk depends on infarct extent and reperfusion time.',
      'Reduced anterior R-wave progression can occur with anterior injury or prior infarction, but is nonspecific and must be interpreted with the full ECG and clinical context.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-anterior', 'artery-lad']
    },
    waveformDeltas: {
      'V3': { stElevationMm: 4.5, stSlope: 'convex', tWaveAmplitudeMm: 6, qWaveMm: 4, rAmplitudeMultiplier: 0.3 },
      'V4': { stElevationMm: 4.0, stSlope: 'convex', tWaveAmplitudeMm: 5, qWaveMm: 3, rAmplitudeMultiplier: 0.4 },
      'II': { stElevationMm: -1.2, stSlope: 'horizontal', tInverted: true },
      'III': { stElevationMm: -1.8, stSlope: 'horizontal', tInverted: true },
      'aVF': { stElevationMm: -1.5, stSlope: 'horizontal', tInverted: true }
    }
  },

  anteroseptal: {
    id: 'anteroseptal',
    name: 'Anteroseptal STEMI',
    shortDescription: 'Injury involving the anterior interventricular septum and adjacent anterior LV wall; the ECG pattern may extend beyond these regions depending on LAD anatomy.',
    primaryLeads: ['V1', 'V2', 'V3', 'V4'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Left Anterior Descending (LAD) — commonly proximal or mid-vessel, depending on the branch level',
    coronaryAnatomyNotes: 'An LAD occlusion proximal to important septal and/or diagonal branches can involve both septal and anterior myocardium. The exact extent depends on branch origins, dominance, and collateral flow.',
    expectedECG: {
      stSegment: 'ST elevation commonly involves contiguous precordial leads V1–V4. The distribution varies with the level and extent of LAD involvement; use current diagnostic criteria rather than a fixed morphology.',
      tWave: 'Hyperacute T waves may occur early; T-wave inversion may appear later. Findings depend on the stage of injury and reperfusion.',
      qWave: 'QS complexes, pathological Q waves, or reduced R-wave progression may develop, but are not obligatory or specific enough to define the infarct territory alone.',
      reciprocal: 'Reciprocal inferior ST depression may occur, but is variable and should not be treated as a required finding.'
    },
    clinicalPearls: [
      'New RBBB, fascicular block, or AV conduction abnormalities can accompany extensive septal ischemia. They are important high-risk findings but do not by themselves predict inevitable complete heart block.',
      'A larger anterior-septal territory can place substantial LV myocardium at risk; prognosis depends on infarct size, reperfusion delay, ventricular function, and complications.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-septum', 'region-anterior', 'artery-lad']
    },
    waveformDeltas: {
      'V1': { stElevationMm: 2.6, stSlope: 'convex', qWaveMm: 5, rAmplitudeMultiplier: 0.1 },
      'V2': { stElevationMm: 4.0, stSlope: 'convex', qWaveMm: 6, rAmplitudeMultiplier: 0.2 },
      'V3': { stElevationMm: 4.5, stSlope: 'convex', qWaveMm: 5, rAmplitudeMultiplier: 0.3 },
      'V4': { stElevationMm: 3.5, stSlope: 'convex', qWaveMm: 3, rAmplitudeMultiplier: 0.4 },
      'II': { stElevationMm: -1.0, stSlope: 'horizontal' },
      'III': { stElevationMm: -1.5, stSlope: 'horizontal' },
      'aVF': { stElevationMm: -1.2, stSlope: 'horizontal' }
    }
  },

  extensive_anterior: {
    id: 'extensive_anterior',
    name: 'Extensive Anterior / Anterolateral STEMI',
    shortDescription: 'A large anterior/anteroseptal injury pattern that may extend to the apex and anterolateral LV. The actual area at risk depends on LAD anatomy, branch involvement, and collateral supply.',
    primaryLeads: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'I', 'aVL'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Usually a large proximal LAD territory; left-main or multivessel disease is a separate possibility requiring clinical and angiographic correlation',
    coronaryAnatomyNotes: 'Occlusion proximal to major septal and diagonal branches can jeopardize a large LV territory. The amount of myocardium at risk cannot be assigned a fixed percentage from the ECG alone.',
    expectedECG: {
      stSegment: 'Broad ST elevation may involve multiple anterior precordial leads (often V1–V6) and lateral leads I/aVL. The exact distribution varies; tombstone morphology is neither required nor specific.',
      tWave: 'Hyperacute T waves and evolving ST–T changes may occur across the involved leads; morphology changes with timing and reperfusion.',
      qWave: 'Pathological Q waves and reduced R-wave amplitudes may develop in affected leads, but complete loss of precordial R waves is not inevitable.',
      reciprocal: 'Inferior reciprocal ST depression may accompany extensive anterior injury, but its presence and magnitude are variable.'
    },
    clinicalPearls: [
      'Large proximal LAD infarctions can cause severe LV dysfunction, heart failure, cardiogenic shock, or ventricular arrhythmias; risk depends on the amount of myocardium involved and time to reperfusion.',
      'For suspected acute coronary occlusion, activate the local emergent reperfusion pathway promptly in accordance with the applicable ACS guideline.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-septum', 'region-anterior', 'region-lateral', 'artery-lad', 'artery-lmca']
    },
    waveformDeltas: {
      'I': { stElevationMm: 2.5, stSlope: 'convex', tWaveAmplitudeMm: 3 },
      'aVL': { stElevationMm: 3.0, stSlope: 'convex', tWaveAmplitudeMm: 3 },
      'V1': { stElevationMm: 3.0, stSlope: 'convex', qWaveMm: 4, rAmplitudeMultiplier: 0.1 },
      'V2': { stElevationMm: 5.5, stSlope: 'convex', qWaveMm: 6, rAmplitudeMultiplier: 0.1 },
      'V3': { stElevationMm: 6.0, stSlope: 'convex', qWaveMm: 5, rAmplitudeMultiplier: 0.2 },
      'V4': { stElevationMm: 5.0, stSlope: 'convex', qWaveMm: 4, rAmplitudeMultiplier: 0.3 },
      'V5': { stElevationMm: 3.5, stSlope: 'convex', qWaveMm: 3, rAmplitudeMultiplier: 0.5 },
      'V6': { stElevationMm: 2.5, stSlope: 'convex', qWaveMm: 2, rAmplitudeMultiplier: 0.6 },
      'II': { stElevationMm: -2.0, stSlope: 'downsloping', tInverted: true },
      'III': { stElevationMm: -2.8, stSlope: 'downsloping', tInverted: true },
      'aVF': { stElevationMm: -2.2, stSlope: 'downsloping', tInverted: true }
    }
  },

  lateral: {
    id: 'lateral',
    name: 'Lateral STEMI',
    shortDescription: 'Injury involving the lateral LV free wall; high-lateral and low-lateral lead patterns may overlap and can accompany anterior or inferior injury.',
    primaryLeads: ['I', 'aVL', 'V5', 'V6'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Left Circumflex (LCx) or Diagonal branch of LAD',
    coronaryAnatomyNotes: 'LCx courses in the left atrioventricular groove and supplies the lateral LV via obtuse marginal (OM) branches; a sizable LAD diagonal branch can also supply the anterolateral/lateral territory.',
    expectedECG: {
      stSegment: 'ST elevation may appear in I, aVL, V5, and/or V6 depending on the level and extent of lateral injury. Apply the current criteria for the relevant leads and contiguous distribution.',
      tWave: 'Hyperacute T waves may occur early, with T-wave inversion developing later; evolution is variable and depends on timing and reperfusion.',
      qWave: 'Pathological Q waves may develop in involved leads, but are not required for acute lateral MI. Assess Q waves using accepted duration, depth, and contiguous-lead criteria.',
      reciprocal: 'ST depression in inferior leads, particularly III and aVF, may be reciprocal but is not obligatory.'
    },
    clinicalPearls: [
      'Lateral involvement may coexist with anterior or inferior injury, producing anterolateral or inferolateral patterns.',
      'Assess for inferobasal/posterior extension when LCx or a dominant RCA territory is involved; coronary dominance and branch anatomy affect the distribution.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-lateral', 'artery-lcx', 'artery-lad-diagonal'],
      posteriorHighlightSvgId: ['region-lv-post', 'artery-lcx-post', 'artery-rca-plb']
    },
    waveformDeltas: {
      'I': { stElevationMm: 2.2, stSlope: 'convex' },
      'aVL': { stElevationMm: 2.5, stSlope: 'convex' },
      'V5': { stElevationMm: 2.8, stSlope: 'convex' },
      'V6': { stElevationMm: 2.2, stSlope: 'convex' },
      'II': { stElevationMm: -1.0, stSlope: 'horizontal' },
      'III': { stElevationMm: -1.8, stSlope: 'horizontal' },
      'aVF': { stElevationMm: -1.3, stSlope: 'horizontal' }
    }
  },

  high_lateral: {
    id: 'high_lateral',
    name: 'High Lateral STEMI',
    shortDescription: 'Injury involving the high/basal lateral LV, commonly reflected in leads I and aVL; the territory may overlap with anterolateral myocardium.',
    primaryLeads: ['I', 'aVL'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'First Diagonal of LAD (D1) or First Obtuse Marginal of LCx (OM1)',
    coronaryAnatomyNotes: 'High-lateral injury is often associated with a first diagonal (D1) or obtuse marginal (OM) branch occlusion, but ECG patterns do not identify the culprit artery with certainty.',
    expectedECG: {
      stSegment: 'ST elevation is commonly seen in I and aVL; it may be subtle. Some D1-related patterns also show elevation in V2 (e.g., the South African flag pattern).',
      tWave: 'Hyperacute T waves may occur early and T-wave inversion may develop later; findings vary with the stage of injury.',
      qWave: 'A Q wave may develop in I or aVL, but is not required. Interpret Q-wave duration, depth, and distribution using accepted criteria and the clinical context.',
      reciprocal: 'Reciprocal ST depression may appear in III and aVF. It can be more conspicuous than the ST elevation, but is not required and should not be labelled primary inferior infarction without supporting evidence.'
    },
    clinicalPearls: [
      'Inferior ST depression can be reciprocal to high-lateral injury; interpret the full lead pattern rather than localizing infarction from ST depression alone.',
      '"South African flag" pattern: ST elevation in I, aVL, and V2 with reciprocal depression in III, classically associated with D1 occlusion. This is a separate ECG variant; the simplified high-lateral waveform in this simulator does not model the additional V2 elevation.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-high-lateral', 'artery-lad-diagonal', 'artery-lcx-om']
    },
    waveformDeltas: {
      'I': { stElevationMm: 1.8, stSlope: 'convex' },
      'aVL': { stElevationMm: 2.5, stSlope: 'convex', tWaveAmplitudeMm: 3 },
      'II': { stElevationMm: -1.2, stSlope: 'downsloping', tInverted: true },
      'III': { stElevationMm: -2.2, stSlope: 'downsloping', tInverted: true },
      'aVF': { stElevationMm: -1.6, stSlope: 'downsloping', tInverted: true }
    }
  },

  inferior: {
    id: 'inferior',
    name: 'Inferior STEMI',
    shortDescription: 'Injury involving the diaphragmatic (inferior) LV wall. RV involvement may coexist, particularly with proximal RCA occlusion, but is a separate territory.',
    primaryLeads: ['II', 'III', 'aVF'],
    reciprocalLeads: ['I', 'aVL'],
    culpritArtery: 'Right Coronary Artery (RCA) or Left Circumflex (LCx), depending on coronary dominance',
    coronaryAnatomyNotes: 'The inferior LV is commonly supplied by the PDA, which usually arises from the RCA in right-dominant circulation or the LCx in left-dominant circulation. ST elevation in III greater than II and reciprocal depression in I/aVL may favor RCA involvement, but ECG patterns do not prove the culprit artery.',
    expectedECG: {
      stSegment: 'ST elevation in at least two anatomically contiguous inferior leads (II, III, aVF) supports an inferior injury pattern when current diagnostic criteria and clinical context are met. Convex morphology is not required.',
      tWave: 'Hyperacute T waves may occur early; T-wave inversion may develop later. The sequence is variable and depends on timing and reperfusion.',
      qWave: 'Pathological Q waves may develop in inferior leads, but are not required for acute MI. Interpret them using accepted duration, depth, and contiguous-lead criteria.',
      reciprocal: 'Reciprocal ST depression may appear in I and aVL, particularly aVL, but can be absent. Do not use an isolated reciprocal change as proof of an inferior culprit.'
    },
    supplementalLeadsRecommended: {
      leads: ['V3R', 'V4R'],
      reason: 'Record right-sided leads in suspected inferior MI to assess for associated RV involvement; V3R and V4R are particularly useful.',
      clinicalPearl: 'Record V3R/V4R promptly when RV involvement is suspected. Avoid nitrates in suspected RV infarction because preload reduction may precipitate hypotension; individualize other drugs and fluid therapy to the haemodynamic state and local protocol.'
    },
    clinicalPearls: [
      'Sinus bradycardia and AV-nodal block may occur, particularly with RCA-related inferior MI because the nodal arteries often arise from the RCA; the pattern and frequency vary with coronary dominance.',
      'Check I and aVL for reciprocal ST depression, especially when inferior ST elevation is subtle. Its presence can support the pattern, but its absence does not exclude inferior MI.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-inferior', 'artery-rca'],
      posteriorHighlightSvgId: ['region-inferior-post', 'artery-rca-pda']
    },
    waveformDeltas: {
      'II': { stElevationMm: 2.8, stSlope: 'convex', qWaveMm: 2, },
      'III': { stElevationMm: 4.2, stSlope: 'convex', qWaveMm: 4, },
      'aVF': { stElevationMm: 3.5, stSlope: 'convex', qWaveMm: 3, },
      'I': { stElevationMm: -1.6, stSlope: 'horizontal', tInverted: true },
      'aVL': { stElevationMm: -2.5, stSlope: 'horizontal', tInverted: true }
    }
  },

  posterior: {
    id: 'posterior',
    name: 'Posterior STEMI',
    shortDescription: 'Infarction of the inferobasal (traditionally termed posterior) left ventricular territory, sometimes extending into the posterolateral wall.',
    primaryLeads: ['V7', 'V8', 'V9'], // Supplemental
    reciprocalLeads: ['V1', 'V2', 'V3'], // Standard anterior leads show mirror image
    culpritArtery: 'Left Circumflex (LCx) or Right Coronary Artery (RCA — Posterolateral branches)',
    coronaryAnatomyNotes: 'Usually supplied by distal LCx or posterolateral branches of a dominant RCA; the exact territory varies with coronary dominance. The PDA more typically supplies the inferior LV and inferior interventricular septum. Because standard 12-lead electrodes face anteriorly, V1–V3 may show reciprocal changes; V7–V9 provide a direct posterior/inferobasal view.',
    expectedECG: {
      stSegment: 'ST depression in V1–V3, especially with a positive terminal T wave, may be the reciprocal presentation of posterior injury. Obtain V7–V9 when posterior occlusion is suspected, particularly with ongoing symptoms and isolated ST depression in V1–V3; interpret the posterior lead group using the selected source-specific criteria.',
      tWave: 'Tall, upright T waves in V1–V3 may accompany the reciprocal anterior pattern, but are not required and should be interpreted with ST-segment and clinical findings.',
      qWave: 'A relatively tall or broad R wave in V1–V3 may develop as a mirror-image finding in established posterior infarction; it is not required and is not diagnostic on its own.',
      reciprocal: 'V1–V3 may show reciprocal changes from posterior injury; this pattern is suggestive, not independently diagnostic.'
    },
    supplementalLeadsRecommended: {
      leads: ['V7', 'V8', 'V9'],
      reason: 'A standard 12-lead ECG may show only reciprocal anterior ST depression. Record V7–V9 when posterior occlusion is suspected, particularly with ongoing symptoms or isolated ST depression in V1–V3.',
      clinicalPearl: 'Place V7 (left posterior axillary line), V8 (midscapular line), V9 (paraspinal line) horizontally level with V6. Interpret the lead group using the selected source framework; a single lead is not independently confirmatory.'
    },
    clinicalPearls: [
      'Do not rely on the "flip test" for diagnosis. Recognize reciprocal ST depression in V1–V3 and obtain posterior leads V7–V9 when clinically indicated.',
      'Posterior/inferobasal infarction may be missed on a standard 12-lead ECG because the posterior wall is not directly viewed by the standard precordial leads.'
    ],
    heartRegionCoords: {
      posteriorHighlightSvgId: ['region-posterior', 'region-lv-post', 'artery-lcx-post', 'artery-rca-plb']
    },
    waveformDeltas: {
      'V1': { stElevationMm: -2.2, stSlope: 'horizontal', tallRWave: true, rAmplitudeMultiplier: 4.5, tWaveAmplitudeMm: 5 },
      'V2': { stElevationMm: -3.0, stSlope: 'horizontal', tallRWave: true, rAmplitudeMultiplier: 3.4, tWaveAmplitudeMm: 6 },
      'V3': { stElevationMm: -2.0, stSlope: 'horizontal', tallRWave: true, rAmplitudeMultiplier: 1.8, tWaveAmplitudeMm: 5 },
      'V7': { stElevationMm: 1.8, stSlope: 'convex', tWaveAmplitudeMm: 4.0 },
      'V8': { stElevationMm: 2.2, stSlope: 'convex', tWaveAmplitudeMm: 4.5 },
      'V9': { stElevationMm: 1.6, stSlope: 'convex', tWaveAmplitudeMm: 3.8 }
    }
  },

  right_ventricular: {
    id: 'right_ventricular',
    name: 'Right Ventricular (RV) Infarction',
    shortDescription: 'Infarction involving the RV free wall, often accompanying inferior MI and commonly associated with proximal RCA occlusion; isolated RV infarction is uncommon.',
    primaryLeads: ['V3R', 'V4R', 'II', 'III', 'aVF'],
    reciprocalLeads: ['I', 'aVL'],
    culpritArtery: 'Proximal Right Coronary Artery (RCA) — Proximal to acute marginal branches',
    coronaryAnatomyNotes: 'The proximal RCA gives off acute marginal branches that supply the RV free wall before the vessel continues toward the inferior/posterior interventricular territory. Branch anatomy and dominance vary.',
    expectedECG: {
      stSegment: 'ST elevation in right-sided leads, especially V3R–V4R, supports RV involvement in the appropriate clinical context. Record right-sided leads when inferior MI is suspected; interpret changes with symptoms and haemodynamics.',
      tWave: 'T-wave morphology in V3R/V4R varies with timing and is not required to identify RV involvement; interpret it with the right-sided ST segments and clinical findings.',
      qWave: 'Q waves in III/aVF usually indicate associated inferior LV injury, not RV injury alone. QS patterns may occur in right-sided leads but are not required or diagnostic by themselves.',
      reciprocal: 'I/aVL may show reciprocal changes when inferior injury coexists. Standard V1 may show ST elevation, but the absence of these findings does not exclude RV infarction.'
    },
    supplementalLeadsRecommended: {
      leads: ['V3R', 'V4R'],
      reason: 'Standard precordial leads provide limited direct assessment of the RV free wall; obtain right-sided leads, particularly V3R and V4R, when RV infarction is suspected.',
      clinicalPearl: 'Record V3R/V4R promptly when RV involvement is suspected; interpret findings with the standard ECG, symptoms, and haemodynamic assessment.'
    },
    clinicalPearls: [
      'RV systolic dysfunction can reduce pulmonary blood flow and LV preload, causing hypotension and elevated JVP. Assess haemodynamics and volume status rather than assuming that every patient needs a large fluid bolus.',
      'Avoid nitrates in suspected RV infarction because preload reduction may worsen hypotension. Other medications and fluid therapy must be individualized to blood pressure, congestion, and the applicable local protocol.',
      'Prioritize urgent reperfusion and haemodynamic support. Give fluids only when indicated by the patient’s filling status and response; use vasoactive or mechanical support when clinically required.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-rv', 'artery-rca'],
      posteriorHighlightSvgId: ['region-rv-post', 'artery-rca']
    },
    waveformDeltas: {
      'II': { stElevationMm: 2.5, stSlope: 'convex' },
      'III': { stElevationMm: 4.0, stSlope: 'convex', qWaveMm: 3 },
      'aVF': { stElevationMm: 3.2, stSlope: 'convex' },
      'I': { stElevationMm: -1.5, stSlope: 'horizontal', tInverted: true },
      'aVL': { stElevationMm: -2.2, stSlope: 'horizontal', tInverted: true },
      'V1': { stElevationMm: 1.2, stSlope: 'convex' },
      'V2': { stElevationMm: -0.5, stSlope: 'horizontal' },
      'V3R': { stElevationMm: 1.8, stSlope: 'convex', tWaveAmplitudeMm: 3.2 },
      'V4R': { stElevationMm: 2.5, stSlope: 'convex', tWaveAmplitudeMm: 3.5 }
    }
  },

  pericarditis: {
    id: 'pericarditis',
    name: 'STEMI Mimic: Acute Pericarditis',
    shortDescription: 'Inflammation of the pericardial sac that may produce diffuse ST elevation and PR depression; ECG findings are variable and must be interpreted with the clinical presentation.',
    primaryLeads: ['I', 'II', 'III', 'aVL', 'aVF', 'V2', 'V3', 'V4', 'V5', 'V6'],
    reciprocalLeads: ['aVR'],
    culpritArtery: 'Pericardial inflammation (infectious/idiopathic, autoimmune, uremic, post-injury, or other causes)',
    coronaryAnatomyNotes: 'Pericarditis does not define a coronary territory. The pericardium is electrically silent; ST/PR changes imply concomitant epicardial myocardial involvement. Troponin may be elevated with myopericarditis, and a pericarditis-like ECG does not exclude coexisting ACS.',
    expectedECG: {
      stSegment: 'Typically widespread, often concave ST elevation (commonly sparing aVR and often V1) with PR depression. ECG changes may be absent, incomplete, or atypical; morphology alone is not diagnostic.',
      tWave: 'In the classical sequence, T-wave inversion follows return of the ST segment toward baseline. The stages are not always present or sequential, so this timing is a clue rather than an absolute rule.',
      qWave: 'Pathological Q waves are not typical of uncomplicated pericarditis; consider myocardial involvement, infarction, or another diagnosis if they are present.',
      reciprocal: 'PR depression may occur in multiple leads, with reciprocal PR elevation and ST depression in aVR and sometimes V1. ST depression beyond these leads should prompt assessment for alternative or coexisting causes.'
    },
    clinicalPearls: [
      'Under the 2025 ESC framework, definite pericarditis requires a compatible clinical presentation plus more than one additional criterion (e.g. pericardial rub, PR depression/widespread ST elevation, raised CRP, new/worsening effusion, or CMR evidence). ECG alone is insufficient.',
      'Typical pain is sharp or pleuritic, worsens with inspiration or lying flat, and may improve when sitting up and leaning forward; presentations vary.'
    ],
    heartRegionCoords: {},
    waveformDeltas: {
      'I': { stElevationMm: 1.5, stSlope: 'concave' },
      'II': { stElevationMm: 2.0, stSlope: 'concave' },
      'III': { stElevationMm: 1.2, stSlope: 'concave' },
      'aVF': { stElevationMm: 1.8, stSlope: 'concave' },
      'aVL': { stElevationMm: 1.2, stSlope: 'concave' },
      'aVR': { stElevationMm: -1.0, stSlope: 'horizontal' },
      'V2': { stElevationMm: 2.0, stSlope: 'concave' },
      'V3': { stElevationMm: 2.5, stSlope: 'concave' },
      'V4': { stElevationMm: 2.5, stSlope: 'concave' },
      'V5': { stElevationMm: 2.0, stSlope: 'concave' },
      'V6': { stElevationMm: 1.5, stSlope: 'concave' }
    }
  },

  early_repolarization: {
    id: 'early_repolarization',
    name: 'STEMI Mimic: Early Repolarization Pattern (ERP)',
    shortDescription: 'An ECG pattern defined by an end-QRS notch or slur with Jp ≥0.1 mV in at least two contiguous leads other than V1–V3 and QRS duration <120 ms. ST elevation is not required; clinical context remains essential.',
    primaryLeads: ['V2', 'V3', 'V4', 'V5', 'V6', 'II'],
    reciprocalLeads: [],
    culpritArtery: 'No culprit vessel is implied by this ECG pattern; its presence does not exclude coronary disease or ACS.',
    coronaryAnatomyNotes: 'The pattern can occur in healthy people, but it is not synonymous with a universally benign prognosis. Inferior/lateral patterns and horizontal or descending ST segments have been associated with higher arrhythmic risk; this is distinct from diagnosing acute coronary occlusion.',
    expectedECG: {
      stSegment: 'The consensus definition requires an end-QRS notch and/or slur with Jp ≥0.1 mV in at least two contiguous leads (excluding V1–V3) and QRS duration <120 ms. ST-segment elevation is not required; elevation alone is nonspecific.',
      tWave: 'T waves are often prominent and concordant with the QRS, but their amplitude and shape vary by lead and individual.',
      qWave: 'Early repolarization does not itself produce infarction-related Q waves; pathological Q waves should prompt assessment for prior/current myocardial injury or another cause.',
      reciprocal: 'Reciprocal ST depression is usually absent, but its absence cannot rule out acute coronary occlusion or ACS.'
    },
    clinicalPearls: [
      'Compare with prior ECGs and assess serial changes when symptoms are ongoing. A single ST/T ratio or concave ST shape must not be used alone to label an ECG benign or exclude ACS.',
      'A stable pattern on prior ECGs can support an early-repolarization interpretation, but stability alone does not exclude ACS; interpret symptoms, serial ECGs, biomarkers, and the complete tracing.'
    ],
    heartRegionCoords: {},
    waveformDeltas: {
      'II': { stElevationMm: 1.0, stSlope: 'concave' },
      'V2': { stElevationMm: 2.0, stSlope: 'concave', tWaveAmplitudeMm: 5 },
      'V3': { stElevationMm: 2.5, stSlope: 'concave', tWaveAmplitudeMm: 6 },
      'V4': { stElevationMm: 2.0, stSlope: 'concave', tWaveAmplitudeMm: 5 },
      'V5': { stElevationMm: 1.5, stSlope: 'concave', tWaveAmplitudeMm: 4 },
      'V6': { stElevationMm: 1.0, stSlope: 'concave', tWaveAmplitudeMm: 3 }
    }
  }
};
