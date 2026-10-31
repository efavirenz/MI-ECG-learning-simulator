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
        explanation: 'Contiguous ST elevation in leads II, III, and aVF defines an inferior myocardial infarction. In ~85-90% of individuals, the posterior descending artery (PDA) arises from the RCA (right-dominant system).',
        pearl: 'ST elevation in III > II combined with reciprocal ST depression in lead I strongly predicts RCA occlusion over LCx.'
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
        explanation: 'Reciprocal ST-segment depression in lead aVL is present in >95% of acute inferior STEMIs. Lead aVL looks directly down upon the inferior wall from the opposite perspective (+30° looking at -60°). Reciprocal depression in aVL is one of the most sensitive and specific markers confirming acute inferior coronary occlusion.',
        pearl: 'Even 0.5 mm ST depression in aVL in the context of borderline inferior ST elevation strongly confirms acute transmural injury.'
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
        explanation: 'In every patient with acute inferior STEMI, recording right-sided precordial leads (V3R, V4R) is strongly recommended. Up to 30-50% of inferior STEMIs have right ventricular involvement, which dramatically alters hemodynamic stability and management.',
        pearl: 'ST elevation ≥ 0.5 mm in lead V4R confirms acute RV infarction.'
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
        question: 'If lead V4R demonstrates 1.5 mm ST elevation, what critical management precaution must be observed?',
        options: [
          'Administer high-dose sublingual nitroglycerin and intravenous loop diuretics',
          'Withhold nitrates, morphine, and diuretics; prepare for aggressive IV fluid volume loading if hypotensive',
          'Immediately administer high-dose beta-blockers to lower heart rate',
          'Perform immediate electrical cardioversion'
        ],
        correctIndex: 1,
        explanation: 'The infarcted right ventricle loses contractile power and acts as a passive conduit. Maintenance of left ventricular cardiac output is entirely dependent on adequate right-sided filling pressure (preload). Nitrates and diuretics decrease venous return, precipitating profound, life-threatening hypotension and cardiovascular collapse.',
        pearl: 'First-line therapy for hypotension in RV infarction is rapid isotonic IV crystalloid boluses (500–1000 mL) to optimize preload.'
      }
    ],
    managementTakeaways: [
      'Inferior STEMI involves leads II, III, aVF (RCA in ~90%).',
      'Reciprocal ST depression in aVL is nearly 100% specific for acute inferior infarction.',
      'Routinely acquire right-sided leads (V3R, V4R) in all inferior STEMI patients.',
      'V4R ST elevation ≥ 0.5 mm = Right Ventricular Infarction.',
      'AVOID nitrates and diuretics in RV infarction; fluid load to maintain RV preload.'
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
          'Reciprocal mirror-image changes of an acute transmural posterior wall STEMI',
          'Digitalis effect causing "sagging" ST depression',
          'Normal female repolarization pattern'
        ],
        correctIndex: 1,
        explanation: 'Standard leads V1–V3 face the anterior surface of the heart. The posterior LV wall is situated opposite to them. Transmural injury of the posterior wall creates an electrical vector directed away from anterior leads, resulting in reciprocal horizontal ST depression, tall broad R waves (mirror of Q waves), and tall upright T waves (mirror of inverted T waves).',
        pearl: 'The "Flip Test": Turn the ECG trace upside down and view it against the light. Leads V1–V3 will appear as classic ST-elevation myocardial infarction with Q waves!'
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
        explanation: 'Posterior leads V7, V8, and V9 are positioned directly over the posterior left ventricular myocardium on the patient\'s back. They directly capture the true transmural injury current.',
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
        question: 'What ST-segment elevation threshold in posterior leads V7–V9 is diagnostic of acute posterior STEMI according to ESC and ACC/AHA guidelines?',
        options: [
          '≥ 2.0 mm (0.20 mV)',
          '≥ 1.0 mm (0.10 mV)',
          '≥ 0.5 mm (0.05 mV) in at least two contiguous leads',
          '≥ 3.0 mm (0.30 mV)'
        ],
        correctIndex: 2,
        explanation: 'Because the posterior thoracic wall has thicker musculature and greater distance from the heart, electrical voltages recorded on the back are attenuated. Current 2023 ESC and 2025 ACC/AHA guidelines define ST elevation ≥ 0.5 mm (0.05 mV) in V7–V9 as sufficient criteria for STEMI.',
        pearl: 'A common catastrophic error is applying the 1 mm or 2 mm standard precordial threshold to posterior leads and mistakenly ruling out STEMI.'
      }
    ],
    managementTakeaways: [
      'ST depression in V1–V3 with tall R waves and upright T waves is Posterior STEMI until proven otherwise.',
      'Standard 12-lead ECG is often "blind" to posterior infarction, missing up to 10% of occluded vessels.',
      'Place V7 (posterior axillary), V8 (midscapular), V9 (paraspinal) on horizontal line with V6.',
      'ST elevation ≥ 0.5 mm in V7–V9 confirms acute posterior STEMI requiring emergency catheterization/reperfusion.',
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
          'Represents transmural infarction and loss of viable anterior septal myocardium',
          'Proves the patient has had a prior myocardial infarction 10 years ago',
          'Shows hyperkalemia'
        ],
        correctIndex: 1,
        explanation: 'Normal septal depolarization creates an initial small r wave in V1–V2. Transmural necrosis in the septum and anterior wall abolishes this initial positive electrical vector, causing an unopposed negative vector directed toward the posterior LV wall, producing a QS complex or pathological Q wave.',
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
          'Immediate rapid intravenous isotonic crystalloid fluid bolus (e.g. 500–1000 mL normal saline)',
          'Administer additional sublingual nitrates to relieve ongoing coronary ischemia',
          'Administer intravenous high-dose beta-blockers'
        ],
        correctIndex: 1,
        explanation: 'Aggressive volume expansion with IV normal saline boluses is the cornerstone of initial resuscitation in RV infarction to restore right-sided filling pressure and left ventricular preload.',
        pearl: 'Diuretics and nitrates are STRICTLY CONTRAINDICATED. If hypotension persists after 1-2 liters of fluid, inotropes (dobutamine/norepinephrine) and emergent PCI are required.'
      }
    ],
    managementTakeaways: [
      'Inferior STEMI with ST elevation in III > II strongly hints at RV involvement.',
      'Lead V4R ST elevation ≥ 0.5 mm confirms RV infarction.',
      'Nitrates, morphine, and diuretics can cause fatal hypotension in RV infarction.',
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
