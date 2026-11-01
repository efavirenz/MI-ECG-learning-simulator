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
    qWaveDurationMs?: number;
    tallRWave?: boolean;
    poorRProgression?: boolean;
    rAmplitudeMultiplier?: number;
  }>;
}

export const MI_TERRITORIES: Record<string, MITerritory> = {
  normal: {
    id: 'normal',
    name: 'Normal ECG (Sinus Baseline)',
    shortDescription: 'Normal 12-lead baseline with upright T waves, normal R wave progression, and isoelectric ST segments.',
    primaryLeads: [],
    reciprocalLeads: [],
    culpritArtery: 'None (Patent coronary arteries)',
    coronaryAnatomyNotes: 'Normal balanced coronary perfusion through Right Coronary Artery (RCA), Left Anterior Descending (LAD), and Left Circumflex (LCx).',
    expectedECG: {
      stSegment: 'Isoelectric (measured at J point relative to PR segment baseline; <0.5 mm deviation normal).',
      tWave: 'Upright in leads I, II, V3–V6; inverted in aVR; variable in III, aVF, and V1.',
      qWave: 'Septal q waves (<0.04s, <2 mm or <25% R wave) normal in I, aVL, V5, V6.',
      reciprocal: 'None.'
    },
    clinicalPearls: [
      'Normal variant: benign early repolarization may show concave ST elevation in V2–V5 with prominent J-point notching.',
      'Always compare with prior ECGs when available.'
    ],
    heartRegionCoords: {},
    waveformDeltas: {}
  },

  septal: {
    id: 'septal',
    name: 'Septal STEMI',
    shortDescription: 'Infarction of the basal and mid interventricular septum.',
    primaryLeads: ['V1', 'V2'],
    reciprocalLeads: [],
    culpritArtery: 'Left Anterior Descending (LAD) — Septal perforator branches',
    coronaryAnatomyNotes: 'First septal perforator branch of the LAD supplies the anterior two-thirds of the interventricular septum and bundle branches.',
    expectedECG: {
      stSegment: 'Convex or straight ST elevation in V1–V2 (often >= 2.0 mm in men >=40, >= 2.5 mm in men <40, >= 1.5 mm in women).',
      tWave: 'Hyperacute peaked T waves early; evolves to symmetric T-wave inversion.',
      qWave: 'Loss of normal septal r wave in V1–V2 (QS complex formation), indicating transmural septal necrosis.',
      reciprocal: 'Usually no prominent reciprocal depression unless accompanied by inferior changes.'
    },
    clinicalPearls: [
      'May be associated with new conduction blocks (RBBB or bifascicular block) due to septal perforator ischemia feeding the bundle of His.',
      'Isolated septal STEMI is rare; usually occurs with anterior involvement (Anteroseptal).'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-septum', 'artery-lad']
    },
    waveformDeltas: {
      'V1': { stElevationMm: 2.8, stSlope: 'convex', qWaveMm: 4, qWaveDurationMs: 40, rAmplitudeMultiplier: 0.2 },
      'V2': { stElevationMm: 3.2, stSlope: 'convex', qWaveMm: 5, qWaveDurationMs: 40, rAmplitudeMultiplier: 0.3 }
    }
  },

  anterior: {
    id: 'anterior',
    name: 'Anterior STEMI',
    shortDescription: 'Infarction of the anterior left ventricular free wall.',
    primaryLeads: ['V3', 'V4'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Left Anterior Descending (LAD) — Diagonal branches / Mid-LAD',
    coronaryAnatomyNotes: 'Diagonal branches of LAD supply the anterior wall of the left ventricle.',
    expectedECG: {
      stSegment: 'Marked ST-segment elevation in V3 and V4 (coved/tombstone morphology).',
      tWave: 'Hyperacute T waves initially, evolving into deep symmetric T-wave inversion.',
      qWave: 'Development of pathological Q waves or poor R-wave progression (PRWP) across precordium.',
      reciprocal: 'Reciprocal ST-segment depression in inferior leads (II, III, aVF) is common with proximal LAD occlusions.'
    },
    clinicalPearls: [
      'Anterior STEMI carries high risk of cardiogenic shock and heart failure due to large area of LV myocardium at risk.',
      'Loss of anterior R-wave progression (R in V3 < 3 mm) indicates substantial anterior myocardial loss.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-anterior', 'artery-lad']
    },
    waveformDeltas: {
      'V3': { stElevationMm: 4.5, stSlope: 'convex', tWaveAmplitudeMm: 6, qWaveMm: 4, qWaveDurationMs: 45, rAmplitudeMultiplier: 0.3 },
      'V4': { stElevationMm: 4.0, stSlope: 'convex', tWaveAmplitudeMm: 5, qWaveMm: 3, qWaveDurationMs: 40, rAmplitudeMultiplier: 0.4 },
      'II': { stElevationMm: -1.2, stSlope: 'horizontal', tInverted: true },
      'III': { stElevationMm: -1.8, stSlope: 'horizontal', tInverted: true },
      'aVF': { stElevationMm: -1.5, stSlope: 'horizontal', tInverted: true }
    }
  },

  anteroseptal: {
    id: 'anteroseptal',
    name: 'Anteroseptal STEMI',
    shortDescription: 'Combined infarction of both the interventricular septum and anterior wall.',
    primaryLeads: ['V1', 'V2', 'V3', 'V4'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Left Anterior Descending (LAD) — Proximal to Mid',
    coronaryAnatomyNotes: 'Occlusion of the proximal to mid-LAD before or between first septal and first diagonal branches.',
    expectedECG: {
      stSegment: 'Prominent ST elevation across contiguous precordial leads V1 through V4.',
      tWave: 'Tall hyperacute T waves or inverted T waves in V1–V4.',
      qWave: 'QS complexes in V1–V2, pathological Q waves in V3–V4, and abrupt loss of anterior R wave progression.',
      reciprocal: 'Reciprocal ST depression in inferior leads II, III, aVF.'
    },
    clinicalPearls: [
      'Look for new onset right bundle branch block (RBBB) + left anterior fascicular block (bifascicular block), warning of imminent complete heart block.',
      'Carries substantially worse prognosis than isolated inferior STEMI.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-septum', 'region-anterior', 'artery-lad']
    },
    waveformDeltas: {
      'V1': { stElevationMm: 2.6, stSlope: 'convex', qWaveMm: 5, qWaveDurationMs: 45, rAmplitudeMultiplier: 0.1 },
      'V2': { stElevationMm: 4.0, stSlope: 'convex', qWaveMm: 6, qWaveDurationMs: 45, rAmplitudeMultiplier: 0.2 },
      'V3': { stElevationMm: 4.5, stSlope: 'convex', qWaveMm: 5, qWaveDurationMs: 40, rAmplitudeMultiplier: 0.3 },
      'V4': { stElevationMm: 3.5, stSlope: 'convex', qWaveMm: 3, qWaveDurationMs: 40, rAmplitudeMultiplier: 0.4 },
      'II': { stElevationMm: -1.0, stSlope: 'horizontal' },
      'III': { stElevationMm: -1.5, stSlope: 'horizontal' },
      'aVF': { stElevationMm: -1.2, stSlope: 'horizontal' }
    }
  },

  extensive_anterior: {
    id: 'extensive_anterior',
    name: 'Extensive Anterior / Anterolateral STEMI',
    shortDescription: 'Massive infarction of septum, anterior wall, lateral wall, and apex.',
    primaryLeads: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'I', 'aVL'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Proximal Left Anterior Descending (LAD) or Left Main (LMCA)',
    coronaryAnatomyNotes: 'Occlusion proximal to both S1 (first septal perforator) and D1 (first diagonal branch), jeopardizing >50% of left ventricular muscle mass.',
    expectedECG: {
      stSegment: 'Dramatic "tombstone" ST elevation across precordial leads V1–V6 and limb leads I and aVL.',
      tWave: 'Massive monophasic ST-T wave amalgamation.',
      qWave: 'Extensive Q wave development with total loss of R waves across the precordium.',
      reciprocal: 'Deep reciprocal ST depression in inferior leads II, III, and aVF.'
    },
    clinicalPearls: [
      'High mortality; frequent progression to cardiogenic shock, malignant ventricular arrhythmias (VT/VF), and acute pulmonary edema.',
      'Emergency cardiac catheterization activation is immediate priority.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-septum', 'region-anterior', 'region-lateral', 'artery-lad', 'artery-lmca']
    },
    waveformDeltas: {
      'I': { stElevationMm: 2.5, stSlope: 'convex', tWaveAmplitudeMm: 3 },
      'aVL': { stElevationMm: 3.0, stSlope: 'convex', tWaveAmplitudeMm: 3 },
      'V1': { stElevationMm: 3.0, stSlope: 'convex', qWaveMm: 4, qWaveDurationMs: 45, rAmplitudeMultiplier: 0.1 },
      'V2': { stElevationMm: 5.5, stSlope: 'convex', qWaveMm: 6, qWaveDurationMs: 45, rAmplitudeMultiplier: 0.1 },
      'V3': { stElevationMm: 6.0, stSlope: 'convex', qWaveMm: 5, qWaveDurationMs: 45, rAmplitudeMultiplier: 0.2 },
      'V4': { stElevationMm: 5.0, stSlope: 'convex', qWaveMm: 4, qWaveDurationMs: 40, rAmplitudeMultiplier: 0.3 },
      'V5': { stElevationMm: 3.5, stSlope: 'convex', qWaveMm: 3, qWaveDurationMs: 40, rAmplitudeMultiplier: 0.5 },
      'V6': { stElevationMm: 2.5, stSlope: 'convex', qWaveMm: 2, qWaveDurationMs: 35, rAmplitudeMultiplier: 0.6 },
      'II': { stElevationMm: -2.0, stSlope: 'downsloping', tInverted: true },
      'III': { stElevationMm: -2.8, stSlope: 'downsloping', tInverted: true },
      'aVF': { stElevationMm: -2.2, stSlope: 'downsloping', tInverted: true }
    }
  },

  lateral: {
    id: 'lateral',
    name: 'Lateral STEMI',
    shortDescription: 'Infarction of the lateral free wall of the left ventricle.',
    primaryLeads: ['I', 'aVL', 'V5', 'V6'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'Left Circumflex (LCx) or Diagonal branch of LAD',
    coronaryAnatomyNotes: 'LCx courses in the left atrioventricular groove to supply lateral LV wall via obtuse marginal (OM) branches.',
    expectedECG: {
      stSegment: 'ST-segment elevation >= 1.0 mm in lateral leads I, aVL, V5, V6.',
      tWave: 'T-wave elevation/hyperacute changes early, followed by symmetric inversion.',
      qWave: 'Pathological Q waves in I, aVL, V5, V6 (>0.04s or >25% of following R wave).',
      reciprocal: 'Reciprocal ST depression in inferior leads (III > II).'
    },
    clinicalPearls: [
      'Often accompanies anterior or inferior infarctions, forming anterolateral or inferolateral patterns.',
      'Check for posterior involvement (LCx often supplies posterobasal myocardium).'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-lateral', 'artery-lcx']
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
    shortDescription: 'Subtle infarction localized to the superior/basal lateral LV free wall.',
    primaryLeads: ['I', 'aVL'],
    reciprocalLeads: ['II', 'III', 'aVF'],
    culpritArtery: 'First Diagonal of LAD (D1) or First Obtuse Marginal of LCx (OM1)',
    coronaryAnatomyNotes: 'Isolated high lateral wall infarction is caused by occlusion of high-takeoff diagonal or obtuse marginal branches.',
    expectedECG: {
      stSegment: 'ST elevation in I and aVL (may be subtle: 1–2 mm).',
      tWave: 'Hyperacute or inverted T waves in I and aVL.',
      qWave: 'Pathological Q wave in aVL (depth > 2 mm or width > 0.04s in presence of reciprocal inferior changes).',
      reciprocal: 'Mirror reciprocal ST depression in leads III and aVF (very prominent and often more noticeable than the subtle ST elevation in I/aVL!).'
    },
    clinicalPearls: [
      'CLASSIC PITFALL: Inferior reciprocal depression in lead III and aVF is frequently misinterpreted as "inferior ischemia" while overlooking the true culprit STEMI in aVL.',
      '"South African Flag sign": high lateral STEMI characterized by elevation in I, aVL, V2 with depression in III and aVF.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-high-lateral', 'artery-lcx']
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
    shortDescription: 'Infarction of the diaphragmatic (inferior) wall of the left ventricle.',
    primaryLeads: ['II', 'III', 'aVF'],
    reciprocalLeads: ['I', 'aVL'],
    culpritArtery: 'Right Coronary Artery (RCA) (~85-90% dominant) or Left Circumflex (LCx) (~10-15%)',
    coronaryAnatomyNotes: 'Supplied by the Posterior Descending Artery (PDA). When RCA dominant: ST elevation III > II and ST depression in lead I. When LCx dominant: ST elevation II >= III and ST elevation or isoelectric in I.',
    expectedECG: {
      stSegment: 'Convex ST elevation >= 1.0 mm in at least two contiguous leads: II, III, aVF.',
      tWave: 'Tall peaked T waves early, followed by deep T-wave inversion in II, III, aVF.',
      qWave: 'Pathological Q waves in III and aVF (width >= 0.04s).',
      reciprocal: 'Profound reciprocal ST depression and T inversion in lead aVL (99% sensitivity for inferior STEMI) and lead I.'
    },
    supplementalLeadsRecommended: {
      leads: ['V3R', 'V4R'],
      reason: 'Mandatory evaluation for co-existing Right Ventricular (RV) Infarction, present in up to 30-50% of inferior STEMIs.',
      clinicalPearl: 'Check V4R immediately! Patients with RV involvement are highly preload-dependent: nitrates, morphine, and diuretics may precipitate catastrophic hypotension.'
    },
    clinicalPearls: [
      'Sinus bradycardia and 1st, 2nd (Mobitz I / Wenckebach), or 3rd degree AV block are common due to RCA supply to SA node (~60%) and AV node (~90%). Usually transient/nodal with junctional escape.',
      'Always look for reciprocal ST depression in aVL. Even 0.5 mm ST depression in aVL with subtle inferior ST elevation is highly specific for acute inferior MI.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-inferior', 'artery-rca'],
      posteriorHighlightSvgId: ['region-inferior-post', 'artery-rca-pda']
    },
    waveformDeltas: {
      'II': { stElevationMm: 2.8, stSlope: 'convex', qWaveMm: 2, qWaveDurationMs: 40 },
      'III': { stElevationMm: 4.2, stSlope: 'convex', qWaveMm: 4, qWaveDurationMs: 45 },
      'aVF': { stElevationMm: 3.5, stSlope: 'convex', qWaveMm: 3, qWaveDurationMs: 40 },
      'I': { stElevationMm: -1.6, stSlope: 'horizontal', tInverted: true },
      'aVL': { stElevationMm: -2.5, stSlope: 'horizontal', tInverted: true }
    }
  },

  posterior: {
    id: 'posterior',
    name: 'Posterior STEMI',
    shortDescription: 'Infarction of the posterior / posterobasal wall of the left ventricle.',
    primaryLeads: ['V7', 'V8', 'V9'], // Supplemental
    reciprocalLeads: ['V1', 'V2', 'V3'], // Standard anterior leads show mirror image
    culpritArtery: 'Left Circumflex (LCx) or Right Coronary Artery (RCA — Posterolateral branches)',
    coronaryAnatomyNotes: 'Supplied by distal branches of LCx or dominant RCA. Because standard 12-lead electrodes face anteriorly, standard leads record the electrical event from the opposite side ("through the heart").',
    expectedECG: {
      stSegment: 'Standard leads V1–V3 show horizontal ST-segment depression (mirror image of ST elevation). Supplemental leads V7–V9 show ST elevation >= 0.5 mm.',
      tWave: 'Standard leads V1–V3 show tall, upright, prominent T waves (mirror image of T inversion).',
      qWave: 'Standard leads V1–V3 show abnormally tall, broad R waves (R/S ratio > 1 in V2; mirror image of pathological Q waves!).',
      reciprocal: 'Standard V1–V3 are the reciprocal view of the posterior wall!'
    },
    supplementalLeadsRecommended: {
      leads: ['V7', 'V8', 'V9'],
      reason: 'Standard 12-lead ECG is often nondiagnostic or misinterpreted as "anterior subendocardial ischemia", delaying primary reperfusion.',
      clinicalPearl: 'Place V7 (left posterior axillary line), V8 (midscapular line), V9 (paraspinal line) horizontally level with V6. ST elevation >= 0.5 mm diagnostic of STEMI.'
    },
    clinicalPearls: [
      'The "flip-test": Turning the ECG upside down and holding it to the light turns V1–V3 ST depression into classic ST elevation and tall R waves into deep Q waves.',
      'Isolated posterior STEMI represents 3-11% of all infarcts and is frequently missed.'
    ],
    heartRegionCoords: {
      posteriorHighlightSvgId: ['region-posterior', 'artery-lcx-post', 'artery-rca-pda']
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
    shortDescription: 'Infarction of the thin-walled right ventricle, almost always accompanying inferior STEMI.',
    primaryLeads: ['V3R', 'V4R', 'II', 'III', 'aVF'],
    reciprocalLeads: ['I', 'aVL'],
    culpritArtery: 'Proximal Right Coronary Artery (RCA) — Proximal to acute marginal branches',
    coronaryAnatomyNotes: 'RCA supplies the right ventricular free wall via acute marginal branches before continuing to the posterior interventricular groove.',
    expectedECG: {
      stSegment: 'ST-segment elevation >= 0.5 mm in lead V4R (>= 1.0 mm in men < 30 years). Usually co-exists with inferior ST elevation (II, III, aVF) with ST elevation III > II.',
      tWave: 'Upright, hyperacute T wave in right precordial leads V3R and V4R.',
      qWave: 'Q waves in III and aVF; QS patterns can emerge in V3R/V4R.',
      reciprocal: 'ST depression in I and aVL; standard V1 may show subtle ST elevation while V2 is isoelectric or depressed.'
    },
    supplementalLeadsRecommended: {
      leads: ['V3R', 'V4R'],
      reason: 'Standard 12-lead ECG is blind to right ventricular free wall electrical activity.',
      clinicalPearl: 'V4R has ~100% sensitivity for RV infarction when acquired within first 2 hours of symptom onset (transient signal that fades quickly).'
    },
    clinicalPearls: [
      'HEMODYNAMIC DISASTER WARNING: The infarcted RV behaves as a stiff, passive conduit. LV filling depends strictly on high right-sided preload (elevated JVP).',
      'CONTRAINDICATED: Nitroglycerin, Morphine, Diuretics (drop preload -> precipitous collapse/shock).',
      'TREATMENT: Aggressive IV fluid resuscitation (normal saline bolus), inotropes if needed, emergent PCI.'
    ],
    heartRegionCoords: {
      anteriorHighlightSvgId: ['region-rv', 'artery-rca']
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
    shortDescription: 'Inflammation of pericardial sac producing widespread concave ST elevation and PR depression.',
    primaryLeads: ['I', 'II', 'III', 'aVF', 'V2', 'V3', 'V4', 'V5', 'V6'],
    reciprocalLeads: ['aVR'],
    culpritArtery: 'Non-ischemic (Pericardial inflammation — viral, post-infarct, uremic)',
    coronaryAnatomyNotes: 'No epicardial coronary artery occlusion. Epicardial sub-surface irritation causes widespread current of injury.',
    expectedECG: {
      stSegment: 'Widespread, diffuse CONCAVE ("saddleback") ST elevation across limb and precordial leads without anatomical territory confinement.',
      tWave: 'Upright T waves during acute stage; T inversion develops ONLY AFTER ST segments have returned to baseline (unlike STEMI where T inverts while ST still elevated).',
      qWave: 'NO pathological Q waves develop.',
      reciprocal: 'Reciprocal PR elevation and ST depression in lead aVR (and occasionally lead V1). PR depression in inferolateral leads (II, V5, V6).'
    },
    clinicalPearls: [
      'Hallmark: PR segment depression in multiple leads with PR segment elevation in aVR (subepicardial atrial injury).',
      'Chest pain is sharp, pleuritic, worse lying flat (supine), and relieved by sitting up and leaning forward.'
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
    name: 'STEMI Mimic: Benign Early Repolarization (BER)',
    shortDescription: 'Normal physiological variant in healthy young individuals, especially athletes.',
    primaryLeads: ['V2', 'V3', 'V4', 'V5', 'V6', 'II'],
    reciprocalLeads: [],
    culpritArtery: 'None (Physiological normal variant)',
    coronaryAnatomyNotes: 'Commonly observed in healthy individuals < 50 years old.',
    expectedECG: {
      stSegment: 'Concave upward ST-segment elevation (typically < 2 mm in limb leads, < 3 mm in precordial leads). Distinct J-point notch or fishhook slur.',
      tWave: 'Large, prominent, concordant upright asymmetrical T waves.',
      qWave: 'No pathological Q waves.',
      reciprocal: 'ABSENCE of reciprocal ST depression (except sometimes in aVR).'
    },
    clinicalPearls: [
      'ST-to-T wave amplitude ratio in V6 < 0.25 strongly supports BER over anterior STEMI.',
      'ST elevation is static on serial ECGs (does not dynamically evolve like acute ischemia).'
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
