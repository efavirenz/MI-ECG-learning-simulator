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
    notes: 'Apply these conventional thresholds in the absence of LVH and/or LBBB, which can alter baseline ST segments and complicate interpretation. Criteria require the appropriate contiguous lead set and clinical context; this table does not provide a modified threshold for LVH/LBBB.'
  },
  {
    leads: 'Supplemental Right: V3R, V4R',
    patientGroup: 'Men & Women (adults)',
    thresholdMm: 'Not stated pending primary-source verification',
    thresholdMv: 'Not stated',
    guidelineSource: 'Primary source required; reviewer approval pending',
    notes: 'The previously displayed V3R/V4R numeric thresholds and performance claims could not be verified from the reviewed dossier. Use qualitative acquisition guidance and interpret with the full ECG and clinical context until primary evidence is approved.'
  },
  {
    leads: 'Supplemental Posterior: V7, V8, V9',
    patientGroup: 'Men & Women (adults)',
    thresholdMm: 'Source-specific wording pending reviewer selection',
    thresholdMv: 'Not stated',
    guidelineSource: 'QAS June 2026 / Fifth UDMI 2026 / ACC/AHA 2025 — distinguish statements',
    notes: 'Do not merge source descriptions into one universal threshold or treat one posterior lead as independently confirmatory. Reviewer approval is required for the lead combination, threshold and certainty level attributed to each source.'
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
    pericarditis: 'Usually absent outside aVR, which may show reciprocal PR elevation and ST depression',
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
    pericarditis: 'T waves are often upright initially; inversion may occur after ST segments return toward baseline',
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
    leadPattern: 'Biphasic or deeply inverted T waves in precordial leads V2–V3 (sometimes extending more widely), without significant ST elevation and with preserved precordial R waves. Type proportions are omitted pending primary-study verification.',
    culpritPathology: 'Classically associated with critical proximal LAD disease and a reperfusion/resolution pattern. The precise stenosis range requires primary-study verification.',
    clinicalSignificance: 'High-risk pattern requiring urgent clinical assessment and consideration of coronary angiography. The cited percentage and time-to-infarction estimate are omitted pending primary-study verification. Avoid exercise stress testing in suspected Wellens syndrome; manage according to specialist and local protocols.'
  },
  {
    name: 'de Winter Pattern',
    leadPattern: 'Upsloping ST-segment depression at the J point in precordial leads with tall, prominent, symmetrical hyperacute T waves. Confirm the exact lead range, thresholds and conjunction against the selected QAS June 2026 description before presenting numeric criteria.',
    culpritPathology: 'Associated with acute coronary occlusion, commonly involving the proximal LAD. The prevalence estimate is omitted pending primary-study verification.',
    clinicalSignificance: 'Treat as a high-risk ischemic ECG pattern requiring urgent clinical assessment and escalation under the applicable ACS pathway. Exact teaching wording should be attributed to the selected QAS source edition.'
  },
  {
    name: 'Modified Sgarbossa Criteria (in LBBB or Ventricular Pacing)',
    leadPattern: '1. Concordant ST elevation ≥ 1 mm in any lead with positive QRS (5 points).\n2. Concordant ST depression ≥ 1 mm in V1, V2, or V3 (3 points).\n3. Smith Modified: Excessively discordant ST elevation ≥ 1 mm and ST/S ratio ≤ -0.25 (i.e. ST elevation ≥ 25% of preceding S-wave depth).',
    culpritPathology: 'Acute myocardial infarction occurring in the presence of pre-existing Left Bundle Branch Block or right ventricular apical pacing.',
    clinicalSignificance: 'Provides an approach to interpreting possible acute coronary occlusion in LBBB or ventricular pacing. The performance statistic is omitted pending primary-study verification.'
  }
];
