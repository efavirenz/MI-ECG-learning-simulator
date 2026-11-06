export interface ReferenceItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  url: string;
  keyContributions: string[];
}

export const CLINICAL_REFERENCES: ReferenceItem[] = [
  {
    id: 'acc-aha-2025',
    title: '2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes',
    organization: 'American College of Cardiology & American Heart Association Joint Committee on Clinical Practice Guidelines',
    year: '2025',
    url: 'https://professional.heart.org/en/science-news/2025-guideline-for-the-management-of-patients-with-acute-coronary-syndromes',
    keyContributions: [
      'Current standard criteria for J-point ST-segment elevation across sex and age groups (V2–V3 thresholds: men <40 ≥2.5 mm, men ≥40 ≥2.0 mm, women ≥1.5 mm).',
      'Recommendation for routine acquisition of right-sided precordial leads (V3R, V4R) in suspected acute inferior STEMI.',
      'Recommendation to acquire posterior leads when LCx occlusion is suspected, particularly with isolated anterior ST depression; use source-specific criteria rather than an unverified isolated-lead threshold.',
      'Integration of high-sensitivity cardiac troponin (hs-cTn) accelerated diagnostic pathways.'
    ]
  },
  {
    id: 'esc-acs-2023',
    title: '2023 ESC Guidelines for the Management of Acute Coronary Syndromes',
    organization: 'European Society of Cardiology (ESC)',
    year: '2023',
    url: 'https://academic.oup.com/eurheartj/article/44/38/3720/7243210',
    keyContributions: [
      'Comprehensive definitions of STEMI equivalents including Wellens syndrome, de Winter T-wave pattern, and modified Sgarbossa criteria.',
      'Recommendations for V3R–V4R in suspected inferior STEMI and V7–V9 when posterior MI is suspected.',
      'Recognition that ST depression in V1–V3 and/or ST elevation in V7–V9 can indicate posterior coronary occlusion.',
      'Guidance on ECG criteria, serial assessment, and limitations of surface ECG localization.'
    ]
  },
  {
    id: 'esc-universal-mi-2026',
    title: 'Fifth Universal Definition of Myocardial Infarction',
    organization: 'European Society of Cardiology (ESC), ACC, AHA, and World Heart Federation Task Force',
    year: '2026',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/universal-definition-myocardial-infarction/',
    keyContributions: [
      'Replaces the previous numerical Type 1–5 classification with primary, secondary, and procedure-related clinical MI categories.',
      'Refines the definition of acute and chronic myocardial injury and emphasizes sex-specific cardiac troponin reference limits.',
      'Emphasizes that MI diagnosis integrates clinical evidence, biomarkers, ECG findings, and coronary/cardiac imaging; no single ECG feature is sufficient on its own.',
      'Summarizes ECG findings of myocardial ischemia or infarction, including posterior MI and RV MI patterns and the South African flag sign.'
    ]
  },
  {
    id: 'acc-rv-mi-2024',
    title: 'Right Ventricular Myocardial Infarction — A Tale of Two Ventricles: JACC Focus Seminar',
    organization: 'American College of Cardiology / Journal of the American College of Cardiology',
    year: '2024',
    url: 'https://www.jacc.org/doi/10.1016/j.jacc.2023.09.839',
    keyContributions: [
      'RV infarction commonly accompanies inferior STEMI and is usually related to proximal RCA occlusion affecting RV branches.',
      'Right-sided ECG, particularly V3R and V4R, is useful when assessing suspected RV infarction in inferior MI.',
      'RV dysfunction can reduce pulmonary blood flow and LV preload; haemodynamic and volume assessment should guide support.'
    ]
  },
  {
    id: 'esc-pericarditis-2025',
    title: '2025 ESC Guidelines for the Management of Myocarditis and Pericarditis',
    organization: 'European Society of Cardiology (ESC)',
    year: '2025',
    url: 'https://academic.oup.com/eurheartj/article/46/40/3952/8234483',
    keyContributions: [
      'The 2025 ESC framework defines definite pericarditis as a compatible clinical presentation with more than one additional criterion; ECG changes include PR depression and widespread ST elevation.',
      'Pathological Q waves are not typical of uncomplicated pericarditis; myopericardial involvement and coexisting ACS require clinical assessment.',
      'ECG changes occur in up to 60% of cases, imply concomitant myocardial involvement because the pericardium is electrically silent, and their temporal evolution is variable.'
    ]
  },
  {
    id: 'jacc-early-repolarization-2015',
    title: 'The Early Repolarization Pattern: A Consensus Paper',
    organization: 'Journal of the American College of Cardiology',
    year: '2015',
    url: 'https://www.jacc.org/doi/10.1016/j.jacc.2015.05.033',
    keyContributions: [
      'Defines early repolarization by an end-QRS notch/slur with Jp ≥0.1 mV in at least two contiguous leads excluding V1–V3, and QRS duration <120 ms; ST elevation is not required.',
      'Clarifies that early repolarization should be described as an ECG pattern and interpreted in clinical context rather than automatically assumed benign.'
    ]
  },
  {
    id: 'qas-ecg-2026',
    title: 'Queensland Ambulance Service Clinical Practice Procedures: 12-Lead ECG Acquisition and Interpretation',
    organization: 'Queensland Ambulance Service (QAS)',
    year: 'June 2026',
    url: 'https://www.ambulance.qld.gov.au/__data/assets/pdf_file/0033/475791/CPP_12-Lead-ECG-acquisition-and-interpretation.pdf',
    keyContributions: [
      'Step-by-step prehospital procedure for anatomical landmark palpation (Angle of Louis, midclavicular line, axillary lines).',
      'Standard protocol for repositioning electrodes to acquire supplemental right-sided leads (V4 cable to right 5th ICS MCL labeled V4R) and posterior leads (V4-V6 cables to V7-V9).',
      'Critical clinical instruction on manual annotation of reconfigured lead recordings.'
    ]
  }
];

export const CLINICAL_DISCLAIMER = {
  title: 'Clinical Education & Training Disclaimer',
  content: `This interactive learning simulator is developed strictly for educational and training purposes for healthcare professionals and students (registered nurses, paramedics, EMTs, emergency medicine trainees, and physicians). 

All simulated ECG waveforms, rhythm strips, and clinical vignettes are synthesized teaching models designed to illustrate canonical electrophysiological principles and guideline-recommended diagnostic patterns. Individual patient coronary anatomy, coronary dominance, collateral circulation, baseline conduction abnormalities, and clinical presentations exhibit substantial biological variation.

This tool is NOT intended for primary clinical diagnosis, triage, or direct patient care decisions. In real clinical emergencies, healthcare providers must adhere to local clinical protocols, hospital guidelines, and licensed medical direction.`
};
