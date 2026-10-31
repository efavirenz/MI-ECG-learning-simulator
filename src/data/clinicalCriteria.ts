export interface ThresholdRow {
  leads: string;
  patientGroup: string;
  thresholdMm: string;
  thresholdMv: string;
  guidelineSource: string;
  notes: string;
}

export const STEMI_CRITERIA_TABLE: ThresholdRow[] = [
  {
    leads: 'V2 – V3',
    patientGroup: 'Men < 40 years',
    thresholdMm: '≥ 2.5 mm (0.25 mV)',
    thresholdMv: '≥ 0.25 mV',
    guidelineSource: '2025 ACC/AHA & 2023 ESC ACS Guidelines',
    notes: 'Higher threshold accounts for normal male youth physiological early repolarization and high chest wall voltage.'
  },
  {
    leads: 'V2 – V3',
    patientGroup: 'Men ≥ 40 years',
    thresholdMm: '≥ 2.0 mm (0.20 mV)',
    thresholdMv: '≥ 0.20 mV',
    guidelineSource: '2025 ACC/AHA & 2023 ESC ACS Guidelines',
    notes: 'Threshold decreases with age as physiological baseline ST elevation diminishes.'
  },
  {
    leads: 'V2 – V3',
    patientGroup: 'Women (all ages)',
    thresholdMm: '≥ 1.5 mm (0.15 mV)',
    thresholdMv: '≥ 0.15 mV',
    guidelineSource: '2025 ACC/AHA & 2023 ESC ACS Guidelines',
    notes: 'Same threshold applies regardless of age in adult females. Must be measured strictly at J point relative to PR segment.'
  },
  {
    leads: 'All other standard leads (I, II, III, aVF, aVL, V1, V4, V5, V6)',
    patientGroup: 'All adults (both sexes, all ages)',
    thresholdMm: '≥ 1.0 mm (0.10 mV)',
    thresholdMv: '≥ 0.10 mV',
    guidelineSource: '2025 ACC/AHA & 2023 ESC ACS Guidelines',
    notes: 'Must be present in ≥ 2 anatomically contiguous leads (e.g. II + III + aVF, or V3 + V4, or I + aVL).'
  },
  {
    leads: 'Supplemental Right: V3R, V4R',
    patientGroup: 'Men & Women (adults)',
    thresholdMm: '≥ 0.5 mm (0.05 mV)*',
    thresholdMv: '≥ 0.05 mV',
    guidelineSource: '2025 ACC/AHA & QAS March 2026 CPP',
    notes: '*In men < 30 years old, threshold is ≥ 1.0 mm (0.10 mV). V4R is most sensitive and specific for Right Ventricular Infarction.'
  },
  {
    leads: 'Supplemental Posterior: V7, V8, V9',
    patientGroup: 'Men & Women (adults)',
    thresholdMm: '≥ 0.5 mm (0.05 mV)*',
    thresholdMv: '≥ 0.05 mV',
    guidelineSource: '2023 ESC & 2025 ACC/AHA Guidelines',
    notes: '*Some ESC guidelines cite ≥ 1.0 mm in men < 40 years due to thoracic wall proximity. ≥ 0.5 mm in all other patients.'
  }
];

export interface StemMimicComparison {
  feature: string;
  acuteSTEMI: string;
  pericarditis: string;
  earlyRepol: string;
  lvhWithStrain: string;
  lbbb: string;
}

export const STEMI_MIMICS: StemMimicComparison[] = [
  {
    feature: 'ST Segment Morphology',
    acuteSTEMI: 'Convex upward ("coved", tombstone) or straight oblique',
    pericarditis: 'Concave upward ("saddleback"), widespread across multiple territories',
    earlyRepol: 'Concave upward, notched/slurred J point',
    lvhWithStrain: 'Asymmetrical downsloping ST depression in lateral leads; concave ST elevation in V1–V3',
    lbbb: 'Discordant to major QRS deflection (ST elevation in right leads with QS; ST depression in lateral leads)'
  },
  {
    feature: 'Anatomical Distribution',
    acuteSTEMI: 'Confined to specific coronary artery territory (e.g. II/III/aVF or V1–V4)',
    pericarditis: 'Diffuse, non-territorial (leads I, II, III, aVF, V2–V6)',
    earlyRepol: 'Most pronounced in V3–V5 and inferolateral leads',
    lvhWithStrain: 'V1–V3 (elevation) and I, aVL, V5–V6 (depression)',
    lbbb: 'V1–V3 (elevation) and I, aVL, V5–V6 (depression)'
  },
  {
    feature: 'Reciprocal ST Depression',
    acuteSTEMI: 'Present and highly specific (e.g. aVL depression in inferior STEMI)',
    pericarditis: 'Absent (ONLY in aVR, which shows reciprocal PR elevation & ST depression)',
    earlyRepol: 'Absent',
    lvhWithStrain: 'Strain pattern is secondary repolarization abnormality, not true ischemic reciprocity',
    lbbb: 'Secondary discordance, not true acute ischemic reciprocity (evaluate modified Sgarbossa)'
  },
  {
    feature: 'PR Segment Changes',
    acuteSTEMI: 'Isoelectric (PR depression rare, seen in atrial infarction)',
    pericarditis: 'PR segment depression in inferolateral leads; PR elevation in aVR (very specific)',
    earlyRepol: 'Isoelectric PR segment',
    lvhWithStrain: 'Isoelectric',
    lbbb: 'Isoelectric'
  },
  {
    feature: 'T Wave Morphology',
    acuteSTEMI: 'Hyperacute tall symmetrical early; evolves to deep symmetric inversion while ST elevated',
    pericarditis: 'Upright initially; inverts ONLY AFTER ST segment returns to baseline',
    earlyRepol: 'Prominent, asymmetrical upright T waves',
    lvhWithStrain: 'Asymmetrical T wave inversion with rapid return to baseline in lateral leads',
    lbbb: 'Discordant T waves (inverted in leads with positive QRS)'
  },
  {
    feature: 'Serial Evolution',
    acuteSTEMI: 'Dynamic and rapid evolution over hours (hyperacute T -> ST elevation -> Q waves -> T inversion)',
    pericarditis: 'Slow evolution over days to weeks (4 distinct stages)',
    earlyRepol: 'Static over weeks/months/years',
    lvhWithStrain: 'Static (unless hypertension controlled over months)',
    lbbb: 'Static baseline (unless acute new coronary occlusion occurs)'
  }
];

export interface AcsEquivalent {
  name: string;
  leadPattern: string;
  culpritPathology: string;
  clinicalSignificance: string;
}

export const ACS_EQUIVALENTS: AcsEquivalent[] = [
  {
    name: 'Wellens Syndrome (Type A: Biphasic; Type B: Deeply Inverted)',
    leadPattern: 'Deeply inverted (Type B, ~75%) or biphasic (Type A, ~25%) T waves in precordial leads V2–V3 (often extending V1–V6) without significant ST elevation and with preserved precordial R waves.',
    culpritPathology: 'Severe critical proximal LAD stenosis (90–99%). Pattern represents reperfusion/resolution of transient transmural ischemia.',
    clinicalSignificance: 'Pre-infarction state! Highly unstable: 75% develop extensive anterior myocardial infarction within 8.5 days if treated conservatively. Requires urgent angiography. Stress testing is STRICTLY CONTRAINDICATED (can precipitate fatal infarction).'
  },
  {
    name: 'de Winter Pattern',
    leadPattern: '1–3 mm upsloping ST-segment depression at the J point in precordial leads V1–V6, continuing into tall, prominent, symmetrical hyperacute T waves, plus 0.5–1 mm ST elevation in lead aVR.',
    culpritPathology: 'Acute proximal LAD occlusion without classic STEMI ST elevation (seen in ~2% of acute anterior coronary occlusions).',
    clinicalSignificance: 'STEMI Equivalent! Immediate primary percutaneous coronary intervention (PCI) activation is mandatory despite lack of traditional ST elevation.'
  },
  {
    name: 'Modified Sgarbossa Criteria (in LBBB or Ventricular Pacing)',
    leadPattern: '1. Concordant ST elevation ≥ 1 mm in any lead with positive QRS (5 points).\n2. Concordant ST depression ≥ 1 mm in V1, V2, or V3 (3 points).\n3. Smith Modified: Excessively discordant ST elevation ≥ 1 mm and ST/S ratio ≤ -0.25 (i.e. ST elevation ≥ 25% of preceding S-wave depth).',
    culpritPathology: 'Acute myocardial infarction occurring in the presence of pre-existing Left Bundle Branch Block or right ventricular apical pacing.',
    clinicalSignificance: 'Overcomes the masking effect of LBBB. High specificity (>98%) for acute coronary occlusion requiring immediate catheterization.'
  }
];
