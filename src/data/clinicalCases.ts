export interface CaseQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pearl?: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  category: string;
  patientHistory: {
    age: number;
    sex: 'Male' | 'Female';
    presentation: string;
    vitals: {
      bp: string;
      hr: string;
      rr: string;
      spo2: string;
    };
    ecgSummary: string;
  };
  territoryId: string;
  initial12LeadLeadsHighlighted: string[];
  recommendedSupplementalMode?: 'right' | 'posterior';
  questions: CaseQuestion[];
  managementTakeaways: string[];
}

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-1-inferior',
    title: 'Case 1: Inferior STEMI & Right Ventricular Assessment',
    category: 'Inferior Territory',
    patientHistory: {
      age: 62,
      sex: 'Male',
      presentation: 'Presents with 90 minutes of heavy retrosternal pressure radiating to the jaw and epigastrium, accompanied by diaphoresis and nausea.',
      vitals: {
        bp: '118/74 mmHg',
        hr: '54 bpm (Sinus bradycardia)',
        rr: '18 /min',
        spo2: '97% on room air'
      },
      ecgSummary: 'Standard 12-lead shows 3 mm convex ST elevation in lead III, 2 mm in lead aVF, and 2 mm in lead II. Marked 2 mm horizontal ST depression in lead aVL and 1.5 mm depression in lead I.'
    },
    territoryId: 'inferior',
    initial12LeadLeadsHighlighted: ['II', 'III', 'aVF', 'I', 'aVL'],
    recommendedSupplementalMode: 'right',
    questions: [
      {
        id: 'c1-q1',
        question: 'Which anatomical myocardial territory and primary culprit coronary artery are indicated by these ECG findings?',
        options: [
          'Anterior wall MI caused by Left Anterior Descending (LAD) occlusion',
          'Inferior wall MI typically caused by Right Coronary Artery (RCA) occlusion',
          'Lateral wall MI caused by Left Circumflex (LCx) occlusion',
          'Apical MI caused by diagonal branch occlusion'
        ],
        correctIndex: 1,
        explanation: 'Contiguous ST elevation in leads II, III, and aVF defines an inferior myocardial infarction. Coronary dominance varies between individuals; the culprit vessel should be considered in the context of the full coronary anatomy.',
        pearl: 'ST elevation in III greater than II, with reciprocal changes, can support an RCA-versus-LCx localization hypothesis; consider coronary dominance and the complete clinical context.'
      },
      {
        id: 'c1-q2',
        question: 'What is the diagnostic significance of the ST-segment depression seen in leads I and aVL?',
        options: [
          'It represents co-existing acute anterolateral subendocardial ischemia',
          'It is an artifact caused by improper limb electrode placement',
          'It is a true reciprocal electrical change reflecting the inferior injury current',
          'It indicates secondary digitalis toxicity'
        ],
        correctIndex: 2,
        explanation: 'Reciprocal ST-segment depression in aVL can be a useful reciprocal clue in the context of inferior injury. Avoid treating this finding alone as confirmation; interpret the full set of contiguous leads and clinical presentation. The percentage and performance statistics are omitted pending primary-study verification.',
        pearl: 'Reciprocal ST depression in aVL may support an inferior injury pattern; it is not an independent confirmation criterion.'
      },
      {
        id: 'c1-q3',
        question: 'What immediate supplemental ECG recording is recommended by the 2025 ACC/AHA and 2023 ESC guidelines for this patient?',
        options: [
          'Right-sided precordial leads (specifically V3R and V4R) to assess for Right Ventricular Infarction',
          'Posterior leads V7–V9 to assess for isolated basal ischemia',
          'Exercise stress ECG to assess functional capacity',
          'High chest lead recording (2nd intercostal space)'
        ],
        correctIndex: 0,
        explanation: 'When inferior injury is present, consider right-sided precordial leads (V3R, V4R) to assess for possible RV involvement. The reported prevalence estimate is omitted pending primary-study verification.',
        pearl: 'Right-sided ST changes support assessment for RV involvement in the context of inferior injury; interpret the complete ECG and clinical picture.'
      },
      {
        id: 'c1-q4',
        question: 'Where is the V4R electrode accurately placed on the patient\'s body?',
        options: [
          '4th intercostal space at the right sternal border (position of standard V1)',
          '5th intercostal space in the right midclavicular line (exact right-sided mirror of standard V4)',
          'Right anterior axillary line at the 6th intercostal space',
          'Directly on the right nipple'
        ],
        correctIndex: 1,
        explanation: 'V4R is located in the 5th intercostal space in the right midclavicular line. This is the exact anatomical mirror of standard precordial electrode V4.',
        pearl: 'Never use the nipple as an anatomical landmark. Palpate the Angle of Louis, locate the 2nd rib, count down to the 5th ICS, and identify the midclavicular line.'
      },
      {
        id: 'c1-q5',
        question: 'If right-sided leads show changes in a patient with inferior injury, what medication-teaching precaution is appropriate?',
        options: [
          'Administer high-dose sublingual nitroglycerin and intravenous loop diuretics',
          'Avoid nitroglycerin in suspected RV infarction; assess morphine and diuretics individually in the clinical and local-protocol context',
          'Immediately administer high-dose beta-blockers to lower heart rate',
          'Perform immediate electrical cardioversion'
        ],
        correctIndex: 1,
        explanation: 'The infarcted right ventricle may be preload-sensitive. Nitroglycerin should be avoided in suspected RV infarction. Morphine is not universally contraindicated and requires the cited guideline context if considered for refractory pain; diuretic use depends on haemodynamic and volume status. Follow the applicable local protocol.',
        pearl: 'For hypotension with suspected RV involvement, manage haemodynamics according to the applicable emergency and local protocols; fluid therapy must be guided by clinical assessment.'
      }
    ],
    managementTakeaways: [
      'Inferior injury is assessed in anatomically contiguous leads II, III, and aVF.',
      'Interpret reciprocal changes in aVL with the complete ECG and clinical context; unsupported performance statistics are omitted.',
      'Acquire right-sided leads when RV involvement is suspected in the context of inferior injury.',
      'Right-sided ST changes support assessment but must not be treated as an isolated-lead diagnostic verdict.',
      'Avoid nitroglycerin in suspected RV infarction; assess morphine and diuretic use individually under the applicable clinical and local-protocol context.'
    ]
  },

  {
    id: 'case-2-posterior',
    title: 'Case 2: The "Hidden" Posterior Wall Infarction',
    category: 'Posterior Territory',
    patientHistory: {
      age: 58,
      sex: 'Female',
      presentation: 'Presented to emergency department with 2 hours of unrelenting crushing midsternal tightness, radiation to back between shoulder blades, and nausea.',
      vitals: {
        bp: '136/82 mmHg',
        hr: '84 bpm',
        rr: '16 /min',
        spo2: '98% on room air'
      },
      ecgSummary: 'Standard 12-lead ECG demonstrates 2.5 mm horizontal ST-segment depression in leads V1, V2, and V3 with prominent, tall R waves (R/S ratio > 1 in V2) and upright, broad T waves. No ST elevation is seen in standard 12 leads.'
    },
    territoryId: 'posterior',
    initial12LeadLeadsHighlighted: ['V1', 'V2', 'V3'],
    recommendedSupplementalMode: 'posterior',
    questions: [
      {
        id: 'c2-q1',
        question: 'What is the most likely clinical interpretation of horizontal ST depression and tall R waves in leads V1–V3 in a patient with acute ischemic chest pain?',
        options: [
          'Benign non-specific ST changes requiring no further workup',
          'Reciprocal ECG clues that raise suspicion for posterior wall injury and warrant a complete contextual assessment',
          'Digitalis effect causing "sagging" ST depression',
          'Normal female repolarization pattern'
        ],
        correctIndex: 1,
        explanation: 'Standard leads V1–V3 face the anterior surface of the heart. The posterior LV wall is situated opposite to them. Posterior injury may create reciprocal horizontal ST depression, tall broad R waves (mirror of Q waves), and tall upright T waves (mirror of inverted T waves). Treat these as contextual clues and interpret them alongside the complete ECG and clinical presentation.',
        pearl: 'The flip-test can be a visual teaching aid for reciprocal morphology; it does not replace supplemental-lead assessment or clinical interpretation.'
      },
      {
        id: 'c2-q2',
        question: 'Which supplemental ECG leads must be recorded immediately to confirm this diagnosis?',
        options: [
          'Right-sided leads V3R and V4R',
          'Posterior leads V7, V8, and V9 placed along the back',
          'Einthoven extremity leads only',
          'Fontaine leads for arrhythmogenic dysplasia'
        ],
        correctIndex: 1,
        explanation: 'Posterior leads V7, V8, and V9 are positioned directly over the posterior left ventricular myocardium on the patient\'s back. They provide a direct view of the posterior surface electrical activity and should be interpreted with the complete ECG and clinical context.',
        pearl: 'Recording posterior leads prevents catastrophic delay in activating the cardiac catheterization lab for an occluded coronary artery.'
      },
      {
        id: 'c2-q3',
        question: 'What are the correct anatomical landmark locations for electrodes V7, V8, and V9?',
        options: [
          'V7: Left midaxillary line; V8: Midscapular; V9: Spine — all at the 4th intercostal space',
          'V7: Left posterior axillary line; V8: Left midscapular line; V9: Left paraspinal border — all strictly horizontal with V6',
          'V7: 7th rib; V8: 8th rib; V9: 9th rib along the vertebral column',
          'Placed symmetrically along the right posterior hemithorax'
        ],
        correctIndex: 1,
        explanation: 'All three electrodes are aligned horizontally with standard electrode V6: V7 at the left posterior axillary line, V8 at the left midscapular line (inferior to scapular angle), and V9 at the left paraspinal muscle border.',
        pearl: 'Ensure the patient is rolled onto their right lateral decubitus position and do not place electrodes directly on bone (scapula or vertebrae).'
      },
      {
        id: 'c2-q4',
        question: 'How should ST-segment findings in posterior leads V7–V9 be interpreted when posterior infarction is suspected?',
        options: [
          'A single lead at or above 0.5 mm independently confirms infarction',
          'Only the standard 1.0 mm limb-lead threshold can be applied',
          'Use a source-specific posterior lead combination and threshold with the full ECG and clinical context',
          'Posterior lead values are not interpretable'
        ],
        correctIndex: 2,
        explanation: 'The source dossier identifies distinct descriptions in QAS June 2026 and Fifth UDMI 2026, and separate ACC/AHA 2025 guidance about acquiring posterior leads when LCx occlusion is suspected. Keep the lead combination, threshold and certainty level attributed to the selected source; do not merge them into one universal numeric rule.',
        pearl: 'Do not transfer a threshold from another lead group or source; use the selected posterior-lead framework and its source-specific certainty wording.'
      }
    ],
    managementTakeaways: [
      'ST depression in V1–V3 with tall R waves and upright T waves can be a reciprocal clue to posterior involvement and should prompt contextual assessment.',
      'A standard 12-lead ECG may not fully display posterior injury; supplemental posterior leads can add information when posterior involvement is suspected.',
      'Place V7 (posterior axillary), V8 (midscapular), V9 (paraspinal) on horizontal line with V6.',
      'Posterior-lead findings should be interpreted as a source-defined lead group with the complete ECG and clinical context; do not use a single-lead confirmation rule.',
      'Culprit artery is usually Left Circumflex (LCx) or dominant RCA posterolateral branch.'
    ]
  },

  {
    id: 'case-3-anterior',
    title: 'Case 3: Acute Anterior STEMI & LAD Occlusion',
    category: 'Anterior Territory',
    patientHistory: {
      age: 49,
      sex: 'Male',
      presentation: 'Sudden onset of severe 10/10 substernal squeezing chest pain, radiating down the left arm, with marked pallor and diaphoresis while at work.',
      vitals: {
        bp: '144/92 mmHg',
        hr: '92 bpm',
        rr: '22 /min',
        spo2: '96% on room air'
      },
      ecgSummary: 'Standard 12-lead ECG shows 4.5 mm convex ST-segment elevation in leads V2, V3, and V4 with 3 mm in V1 and V5. Small initial r waves in V1–V2 are lost (QS complexes). Reciprocal ST depression in leads II, III, and aVF.'
    },
    territoryId: 'anteroseptal',
    initial12LeadLeadsHighlighted: ['V1', 'V2', 'V3', 'V4', 'V5', 'II', 'III', 'aVF'],
    questions: [
      {
        id: 'c3-q1',
        question: 'Which anatomical territory is affected, and what is the primary culprit coronary vessel?',
        options: [
          'Anteroseptal territory caused by Left Anterior Descending (LAD) occlusion',
          'Lateral territory caused by Left Circumflex (LCx) occlusion',
          'Inferior territory caused by Right Coronary Artery (RCA) occlusion',
          'Right ventricular territory caused by conus artery occlusion'
        ],
        correctIndex: 0,
        explanation: 'Contiguous ST elevation spanning leads V1 to V4 (and V5) signifies extensive anteroseptal myocardial injury caused by acute occlusion of the Left Anterior Descending (LAD) artery, commonly called the "widow-maker".',
        pearl: 'Anterior STEMIs account for the largest loss of left ventricular ejection fraction and carry the highest incidence of post-infarct heart failure and cardiogenic shock.'
      },
      {
        id: 'c3-q2',
        question: 'What is the clinical significance of QS complexes (loss of anterior r waves) developing in leads V1–V3?',
        options: [
          'Indicates benign respiratory variation in thoracic resistance',
          'Represents a possible anterior septal infarction pattern; a QS complex alone does not establish transmural necrosis or loss of viable myocardium',
          'Proves the patient has had a prior myocardial infarction 10 years ago',
          'Shows hyperkalemia'
        ],
        correctIndex: 1,
        explanation: 'Normal septal depolarization creates an initial small r wave in V1–V2. A QS complex or pathological Q-wave morphology may occur in infarction, but the pattern alone does not prove transmural necrosis or total loss of viable myocardium; interpretation requires the broader ECG and clinical context.',
        pearl: 'Development of Q waves during acute presentation does not mean the infarction is old or irreversible; acute reperfusion can still salvage significant penumbral myocardium.'
      },
      {
        id: 'c3-q3',
        question: 'What conduction abnormality should clinicians monitor closely for in proximal LAD occlusions?',
        options: [
          'Junctional escape rhythm and Mobitz I AV block only',
          'New onset Right Bundle Branch Block (RBBB) and Left Anterior Fascicular Block (bifascicular block), warning of sudden complete heart block',
          'Wolff-Parkinson-White pre-excitation syndrome',
          'Wandering atrial pacemaker'
        ],
        correctIndex: 1,
        explanation: 'The first septal perforator (S1) of the LAD supplies the bundle of His and the right bundle branch, as well as the anterior fascicle of the left bundle branch. Proximal occlusion puts this specialized conduction system at risk, leading to sudden high-grade AV block with unstable, wide, slow ventricular escape rhythms.',
        pearl: 'Unlike inferior MI AV block (which is usually AV nodal and responsive to atropine), anterior MI AV block is infranodal, carries >50% mortality, and requires transcutaneous/transvenous pacing.'
      }
    ],
    managementTakeaways: [
      'Anteroseptal STEMI involves leads V1–V4 (LAD occlusion).',
      'High risk of rapid hemodynamic deterioration and cardiogenic shock.',
      'Reciprocal ST depression in inferior leads (II, III, aVF) is typical.',
      'Monitor for new bifascicular block and prepare transcutaneous pacing pads immediately.',
      'Primary PCI is top priority: door-to-balloon time goal < 90 minutes.'
    ]
  },

  {
    id: 'case-4-lateral',
    title: 'Case 4: High Lateral STEMI & The Pitfall of Reciprocal Depression',
    category: 'High Lateral Territory',
    patientHistory: {
      age: 66,
      sex: 'Male',
      presentation: 'Presented with subtle intermittent left shoulder ache, mild shortness of breath, and epigastric discomfort over 4 hours.',
      vitals: {
        bp: '128/78 mmHg',
        hr: '76 bpm',
        rr: '16 /min',
        spo2: '97% on room air'
      },
      ecgSummary: 'Standard 12-lead ECG shows 2 mm ST elevation in lead aVL and 1.5 mm ST elevation in lead I. Prominent 2.5 mm ST-segment depression in lead III, 1.8 mm depression in lead aVF, and 1 mm in lead II. Precordial leads V1–V6 are essentially unremarkable.'
    },
    territoryId: 'high_lateral',
    initial12LeadLeadsHighlighted: ['I', 'aVL', 'II', 'III', 'aVF'],
    questions: [
      {
        id: 'c4-q1',
        question: 'What is the primary territory of acute myocardial infarction in this tracing?',
        options: [
          'Inferior wall subendocardial ischemia',
          'Acute high lateral STEMI (involving leads I and aVL)',
          'Benign nonspecific T-wave changes',
          'Right ventricular free wall necrosis'
        ],
        correctIndex: 1,
        explanation: 'The primary STEMI is in the high lateral territory, demonstrated by contiguous ST elevation in leads I and aVL. The striking ST depression in leads III and aVF is RECIPROCAL to the high lateral ST elevation.',
        pearl: 'A common clinical pitfall is focusing on the deep inferior ST depressions, misdiagnosing "inferior ischemia" or "NSTEMI", and overlooking the STEMI in lead aVL.'
      },
      {
        id: 'c4-q2',
        question: 'Which coronary artery or branch is most commonly occluded in isolated high lateral STEMI?',
        options: [
          'First Diagonal branch of LAD (D1) or First Obtuse Marginal branch of LCx (OM1)',
          'Distal Posterior Descending Artery (PDA)',
          'Acute marginal branch of RCA',
          'Sinus node artery'
        ],
        correctIndex: 0,
        explanation: 'The high lateral wall of the left ventricle is perfused by the first diagonal branch (D1) of the LAD or the first obtuse marginal branch (OM1) of the circumflex artery.',
        pearl: 'The "South African Flag Sign": ST elevation in I, aVL, and V2 with ST depression in lead III corresponds to the diagonal branch occlusion pattern.'
      }
    ],
    managementTakeaways: [
      'High lateral STEMI involves leads I and aVL.',
      'Always look at aVL first when assessing reciprocal inferior ST depression.',
      'Culprit vessel: First diagonal branch of LAD or obtuse marginal of LCx.',
      'Treat as emergent STEMI requiring urgent catheterization.'
    ]
  },

  {
    id: 'case-5-rv-infarct',
    title: 'Case 5: Combined Inferior and Right Ventricular Infarction',
    category: 'Inferior + RV',
    patientHistory: {
      age: 71,
      sex: 'Male',
      presentation: 'Paramedics were dispatched to a patient with acute crushing chest pain, marked diaphoresis, and cool clammy extremities. The crew administered sublingual nitroglycerin (0.4 mg). Within 3 minutes, the patient became acutely dizzy and unresponsive.',
      vitals: {
        bp: '68/40 mmHg (previously 130/80 prior to nitroglycerin)',
        hr: '48 bpm (Sinus bradycardia with first-degree AV block)',
        rr: '24 /min',
        spo2: '93% on room air'
      },
      ecgSummary: 'Standard 12-lead ECG shows 4 mm ST elevation in lead III, 2.5 mm in lead aVF, and 2 mm in lead II. ST elevation in III is markedly greater than II. A supplemental right-sided lead V4R reveals 2 mm of convex ST elevation.'
    },
    territoryId: 'right_ventricular',
    initial12LeadLeadsHighlighted: ['II', 'III', 'aVF', 'V4R', 'V3R', 'I', 'aVL'],
    recommendedSupplementalMode: 'right',
    questions: [
      {
        id: 'c5-q1',
        question: 'Why did this patient experience catastrophic hemodynamic collapse following nitroglycerin administration?',
        options: [
          'Anaphylactic reaction to nitroglycerin',
          'Acute RV infarction causes loss of RV contractility, making LV filling strictly dependent on elevated RV preload (venous return); nitroglycerin venodilation dropped preload to zero',
          'Nitroglycerin induced immediate coronary spasm',
          'Nitroglycerin caused acute pulmonary edema'
        ],
        correctIndex: 1,
        explanation: 'In Right Ventricular Infarction, the right ventricle cannot generate normal forward stroke volume. High systemic venous pressures (elevated right-sided filling pressure) are required to push blood passively through the pulmonary circuit into the left ventricle. Nitroglycerin causes widespread venodilation, sharply dropping preload and causing immediate cardiovascular collapse.',
        pearl: 'Triad of RV infarction: Hypotension, clear lung fields (no rales/crackles), and elevated jugular venous distension (JVD).'
      },
      {
        id: 'c5-q2',
        question: 'What is the immediate primary resuscitation measure for this profound hypotension?',
        options: [
          'Administer IV furosemide (Lasix) 40 mg',
          'Assess haemodynamic status and manage according to the applicable emergency and local protocol',
          'Administer additional sublingual nitrates to relieve ongoing coronary ischemia',
          'Administer intravenous high-dose beta-blockers'
        ],
        correctIndex: 1,
        explanation: 'Haemodynamic management in suspected RV infarction must be individualized to the clinical assessment and applicable emergency/local protocol.',
        pearl: 'Avoid nitroglycerin in suspected RV infarction. Morphine is not universally contraindicated; any use requires the cited guideline context and monitoring. Diuretic use depends on haemodynamic and volume status. Treat hypotension according to the applicable emergency and local protocols.'
      }
    ],
    managementTakeaways: [
      'Inferior STEMI with ST elevation in III > II strongly hints at RV involvement.',
      'Right-sided ST changes should be interpreted in the context of the complete ECG and clinical picture.',
      'Avoid nitroglycerin in suspected RV infarction; assess morphine and diuretic use individually according to haemodynamic status and local protocol.',
      'Rapid IV fluid boluses restore cardiac output by restoring preload.',
      'Emergent revascularization of proximal RCA saves RV function.'
    ]
  }
];

export interface QuizQuestion {
  id: string;
  category: 'Electrode Placement' | 'Supplemental Leads' | 'MI Localization' | 'ECG Criteria';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const KNOWLEDGE_QUIZ: QuizQuestion[] = [
  {
    id: 'kq-1',
    category: 'Electrode Placement',
    question: 'How many physical electrodes are placed on the patient\'s body to obtain a standard 12-lead diagnostic ECG?',
    options: ['12 electrodes', '10 electrodes', '6 electrodes', '8 electrodes'],
    correctIndex: 1,
    explanation: 'A standard 12-lead ECG uses 10 physical electrodes: 4 limb electrodes (RA, LA, RL, LL) and 6 precordial electrodes (V1–V6) to record 12 electrical perspectives (leads).'
  },
  {
    id: 'kq-2',
    category: 'Electrode Placement',
    question: 'What anatomical landmark corresponds to the second costal cartilage and is used to locate the second intercostal space?',
    options: ['Xiphoid process', 'Angle of Louis (sternal angle)', 'Suprasternal notch', 'Jugular notch'],
    correctIndex: 1,
    explanation: 'The Angle of Louis (manubriosternal junction) forms a palpable transverse bony ridge ~4-5 cm below the suprasternal notch, marking the attachment of the 2nd costal cartilage. The 2nd intercostal space lies directly below it.'
  },
  {
    id: 'kq-3',
    category: 'Electrode Placement',
    question: 'What is the correct recommended sequence when placing precordial electrodes V1 through V6?',
    options: [
      'Place in strict numerical order: V1, V2, V3, V4, V5, then V6',
      'Place V1, V2, then place V4 (5th ICS MCL), then place V3 midway between V2 and V4, then V5 and V6',
      'Place V6 first and work backwards towards the sternum',
      'Place limb leads, then place all chest electrodes along the 4th intercostal space'
    ],
    correctIndex: 1,
    explanation: 'Clinical guidelines recommend placing V1 (4th ICS RSB) and V2 (4th ICS LSB), then establishing V4 in the 5th ICS midclavicular line. V3 is then placed accurately midway between V2 and V4.'
  },
  {
    id: 'kq-4',
    category: 'Electrode Placement',
    question: 'When acquiring a 12-lead ECG on an adult female patient with large breasts, where should electrode V4 be placed?',
    options: [
      'Directly on the left nipple',
      'On top of the breast tissue over the estimated apex',
      'Under the breast tissue in the 5th intercostal space / inframammary fold on the chest wall',
      'Moved down to the 7th intercostal space'
    ],
    correctIndex: 2,
    explanation: 'Electrodes must be placed directly on the chest wall, never on breast tissue or the nipple. The breast should be gently elevated using the back of the hand and the electrode secured in the 5th ICS midclavicular line.'
  },
  {
    id: 'kq-5',
    category: 'Supplemental Leads',
    question: 'Where is the posterior lead V8 electrode placed on the patient\'s back?',
    options: [
      'Left midscapular line, strictly horizontal with standard lead V6',
      'Directly over the center of the left scapular bone',
      'Along the lumbar spine at L2',
      'Left paraspinal border at the 3rd intercostal space'
    ],
    correctIndex: 0,
    explanation: 'Lead V8 is placed in the left midscapular line (just below the inferior scapular angle) on the horizontal plane level with standard lead V6.'
  },
  {
    id: 'kq-6',
    category: 'ECG Criteria',
    question: 'According to 2025 ACC/AHA and 2023 ESC guidelines, what is the ST-elevation threshold in leads V2–V3 for a 35-year-old male with acute chest pain?',
    options: ['≥ 1.0 mm (0.10 mV)', '≥ 1.5 mm (0.15 mV)', '≥ 2.0 mm (0.20 mV)', '≥ 2.5 mm (0.25 mV)'],
    correctIndex: 3,
    explanation: 'In men under 40 years old, the ST-elevation threshold in leads V2–V3 is ≥ 2.5 mm (0.25 mV). In men ≥ 40 years it is ≥ 2.0 mm, and in women of any age it is ≥ 1.5 mm.'
  },
  {
    id: 'kq-7',
    category: 'MI Localization',
    question: 'ST-segment elevation in leads II, III, and aVF with reciprocal depression in leads I and aVL corresponds to which infarct territory?',
    options: ['High lateral STEMI', 'Extensive anterior STEMI', 'Acute inferior STEMI', 'Isolated septal STEMI'],
    correctIndex: 2,
    explanation: 'Leads II, III, and aVF face the inferior (diaphragmatic) wall of the left ventricle. Reciprocal ST-segment depression in lead aVL is classic for acute inferior STEMI.'
  },
  {
    id: 'kq-8',
    category: 'Supplemental Leads',
    question: 'When using a standard 10-electrode ECG machine to record a right-sided ECG (V3R/V4R), what essential procedural step must be documented on the printout?',
    options: [
      'No documentation is needed because machines auto-detect electrode position',
      'The printout must be clearly hand-labeled with the specific modified lead configuration (e.g. "V4 is V4R")',
      'The paper speed must be doubled to 50 mm/s',
      'Voltage calibration must be halved to 5 mm/mV'
    ],
    correctIndex: 1,
    explanation: 'Because standard cables (e.g. V4 cable) are physically moved to the right chest, the machine software still prints "V4" on the header. The operator must clearly write "V4R" on the tracing to avoid dangerous clinical misinterpretation.'
  },
  {
    id: 'kq-9',
    category: 'ECG Criteria',
    question: 'What ECG baseline landmark must be used to measure ST-segment deviation at the J point?',
    options: [
      'The nadir of the S wave',
      'The PR segment baseline (or TP segment if sinus tachycardia)',
      'The peak of the P wave',
      'The middle of the QRS complex'
    ],
    correctIndex: 1,
    explanation: 'The PR segment immediately preceding the QRS complex is the clinical standard baseline for measuring J-point ST-segment elevation or depression.'
  },
  {
    id: 'kq-10',
    category: 'MI Localization',
    question: 'Which of the following ECG patterns is characteristic of acute pericarditis rather than acute STEMI?',
    options: [
      'Convex "tombstone" ST elevation confined strictly to leads V1–V4 with reciprocal inferior depression',
      'Diffuse concave upward ("saddleback") ST elevation across multiple non-contiguous territories with PR segment depression and PR elevation in aVR',
      'Horizontal ST depression and tall R waves in V1–V3',
      'New pathological Q waves appearing within 60 minutes'
    ],
    correctIndex: 1,
    explanation: 'Acute pericarditis typically causes diffuse, non-territorial concave ST-segment elevation accompanied by PR depression in inferolateral leads and reciprocal PR elevation in lead aVR.'
  }
];
