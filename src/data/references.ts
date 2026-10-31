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
      'Validation of posterior leads (V7–V9) with ≥0.5 mm ST elevation threshold in suspected posterior wall involvement.',
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
      'Definition of reciprocal ST-segment depression in distinguishing STEMI from acute pericarditis and early repolarization.',
      'Standardized guidance on repeat serial 12-lead ECG recording every 15–30 minutes in patients with ongoing ischemic symptoms and inconclusive initial ECG.'
    ]
  },
  {
    id: 'esc-universal-mi-2026',
    title: 'Fifth Universal Definition of Myocardial Infarction',
    organization: 'European Society of Cardiology (ESC), ACC, AHA, and World Heart Federation Task Force',
    year: '2026',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/pocket-guidelines/universal-definition-of-myocardial-infarction/',
    keyContributions: [
      'Delineation of acute myocardial injury vs true acute myocardial infarction (Types 1 to 5).',
      'Pathological Q-wave criteria (≥0.02s in V2–V3 or ≥0.03s and ≥1 mm deep in leads I, II, aVL, aVF, or V4–V6).',
      'Standardized definition of J-point reference to PR segment.'
    ]
  },
  {
    id: 'qas-ecg-2026',
    title: 'Queensland Ambulance Service Clinical Practice Procedures: 12-Lead ECG Acquisition and Interpretation',
    organization: 'Queensland Ambulance Service (QAS)',
    year: 'March 2026',
    url: 'https://www.ambulance.qld.gov.au/__data/assets/pdf_file/0033/475791/CPP_12-lead-ECG-acquisition-and-interpretation.pdf',
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
