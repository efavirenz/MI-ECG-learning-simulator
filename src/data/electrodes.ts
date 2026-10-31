export interface Electrode {
  id: string;
  name: string;
  code: string;
  type: 'limb' | 'precordial' | 'right-sided' | 'posterior';
  anatomicalLocation: string;
  landmarks: string[];
  instructions: string;
  clinicalPurpose: string;
  commonMistakes: string[];
  femaleLandmarkNotes?: string;
  modifiedTorsoNotes?: string;
  torsoView: 'anterior' | 'posterior';
  color: string;
  coords: { x: number; y: number }; // percentage on SVG viewBox
}

export const STANDARD_ELECTRODES: Electrode[] = [
  {
    id: 'ra',
    name: 'Right Arm',
    code: 'RA',
    type: 'limb',
    anatomicalLocation: 'Right wrist or forearm (standard diagnostic placement). Deltoid fossa or right upper chest used for continuous cardiac monitoring only.',
    landmarks: ['Right wrist / inner forearm', 'Right infraclavicular fossa (monitoring only)'],
    instructions: 'Place on the inner aspect of the right forearm or wrist on clean, intact skin. Ensure symmetrical placement with LA.',
    clinicalPurpose: 'Contributes to bipolar leads I and II, and unipolar augmented lead aVR. Forms right vertex of Einthoven triangle.',
    commonMistakes: [
      'Reversal with LA (causes inverted Lead I, simulated dextrocardia)',
      'Placing on torso for diagnostic 12-lead (Mason-Likar modification alters axis, amplitudes, and Q waves; not diagnostic of STEMI)',
      'Placing over bony prominences causing muscle tremor artifact'
    ],
    modifiedTorsoNotes: 'Torso/Mason-Likar placement significantly changes frontal QRS axis and ST segments. Only standard limb placement is valid for formal STEMI diagnosis.',
    torsoView: 'anterior',
    color: '#ef4444', // Red
    coords: { x: 12, y: 32 }
  },
  {
    id: 'la',
    name: 'Left Arm',
    code: 'LA',
    type: 'limb',
    anatomicalLocation: 'Left wrist or forearm (standard diagnostic placement). Deltoid fossa or left upper chest used for continuous cardiac monitoring only.',
    landmarks: ['Left wrist / inner forearm', 'Left infraclavicular fossa (monitoring only)'],
    instructions: 'Place on the inner aspect of the left forearm or wrist. Match symmetry with RA.',
    clinicalPurpose: 'Contributes to bipolar leads I and III, and unipolar augmented lead aVL. Forms left vertex of Einthoven triangle.',
    commonMistakes: [
      'Reversal with RA (causes inverted P, QRS, T in Lead I)',
      'Reversal with LL (alters frontal plane axis and simulated inferior ischemia)',
      'Poor skin prep leading to high electrode impedance'
    ],
    modifiedTorsoNotes: 'Moving to the left shoulder/clavicle may produce false pathological Q waves in inferior leads or falsely mask STEMI.',
    torsoView: 'anterior',
    color: '#eab308', // Yellow
    coords: { x: 88, y: 32 }
  },
  {
    id: 'rl',
    name: 'Right Leg (Ground / Earth)',
    code: 'RL',
    type: 'limb',
    anatomicalLocation: 'Right lower leg above ankle (standard diagnostic). Right lower abdomen / flank for continuous monitoring.',
    landmarks: ['Right medial or lateral lower leg / calf', 'Right lower quadrant (monitoring)'],
    instructions: 'Place on the inner or outer aspect of the right lower leg above the ankle. Acts as neutral electrical ground / reference.',
    clinicalPurpose: 'Electrical reference ground electrode that eliminates electromagnetic common-mode interference from AC power lines. Does not directly produce a lead view.',
    commonMistakes: [
      'Reversal with LL (severely distorts leads II, III, and aVF, creating pseudo-infarction patterns)',
      'Loose contact resulting in 50/60 Hz electrical interference baseline noise'
    ],
    modifiedTorsoNotes: 'On torso, placed near right iliac crest. Safe for monitoring, but standard limb placement preferred for 12-lead STEMI evaluation.',
    torsoView: 'anterior',
    color: '#10b981', // Green / Black
    coords: { x: 22, y: 88 }
  },
  {
    id: 'll',
    name: 'Left Leg',
    code: 'LL',
    type: 'limb',
    anatomicalLocation: 'Left lower leg above ankle (standard diagnostic). Left lower quadrant or anterior superior iliac spine for monitoring.',
    landmarks: ['Left medial or lateral lower leg / calf', 'Left lower quadrant / iliac crest'],
    instructions: 'Place on the left lower leg above the ankle. In continuous monitoring, place on left lower quadrant of abdomen.',
    clinicalPurpose: 'Contributes to bipolar leads II and III, and unipolar augmented lead aVF. Forms the inferior vertex of Einthoven triangle.',
    commonMistakes: [
      'Reversal with RL (causes baseline disturbance or distortion in inferior leads)',
      'Placing over calf muscle spasticity or trembling muscles'
    ],
    modifiedTorsoNotes: 'Placing on abdomen shifts electrical axis rightward or leftward and may decrease inferior lead voltage.',
    torsoView: 'anterior',
    color: '#06b6d4', // Green/Cyan
    coords: { x: 78, y: 88 }
  },
  {
    id: 'v1',
    name: 'Precordial V1',
    code: 'V1',
    type: 'precordial',
    anatomicalLocation: '4th intercostal space (ICS) at the right sternal border (RSB)',
    landmarks: [
      'Suprasternal notch',
      'Angle of Louis (sternal angle - marks 2nd costal cartilage / 2nd rib)',
      '2nd intercostal space directly below 2nd rib',
      'Count down past 3rd rib to 4th intercostal space',
      'Right edge of sternum'
    ],
    instructions: 'Locate Angle of Louis (bony ridge ~4 cm below sternal notch). Move right to 2nd rib; space below is 2nd ICS. Count down to 3rd and 4th ICS immediately adjacent to right sternal border.',
    clinicalPurpose: 'Views septal and right ventricular anterior wall. Evaluates anterior/septal infarction, right bundle branch block (rsR\'), and reciprocal posterior changes.',
    commonMistakes: [
      'Placing in 2nd or 3rd ICS (too high - most common error, causes pseudo-infarction rSr\' or false Brugada pattern)',
      'Placing too far laterally away from the sternal edge'
    ],
    femaleLandmarkNotes: 'Palpate the sternal border beneath breast tissue; never place on the nipple or guess without palpating the intercostal spaces.',
    torsoView: 'anterior',
    color: '#ef4444', // Red
    coords: { x: 44, y: 41 }
  },
  {
    id: 'v2',
    name: 'Precordial V2',
    code: 'V2',
    type: 'precordial',
    anatomicalLocation: '4th intercostal space (ICS) at the left sternal border (LSB)',
    landmarks: [
      'Angle of Louis',
      '4th intercostal space',
      'Left edge of sternum (opposite V1)'
    ],
    instructions: 'Place in the 4th intercostal space directly opposite V1, immediately at the left sternal border.',
    clinicalPurpose: 'Views interventricular septum and anterior wall. Critical for detecting septal/anterior STEMI and reciprocal posterior MI patterns.',
    commonMistakes: [
      'Placing too high in 2nd/3rd ICS, causing false negative or false positive anterior ST changes',
      'Placing too close to V3 before establishing V4 landmark'
    ],
    femaleLandmarkNotes: 'Palpate left 4th ICS medial to or underneath breast tissue using anatomical bony landmarks.',
    torsoView: 'anterior',
    color: '#eab308', // Yellow
    coords: { x: 56, y: 41 }
  },
  {
    id: 'v3',
    name: 'Precordial V3',
    code: 'V3',
    type: 'precordial',
    anatomicalLocation: 'Directly midway on a straight line between V2 and V4',
    landmarks: [
      'Electrode V2 (4th ICS LSB)',
      'Electrode V4 (5th ICS MCL)',
      'Midpoint diagonal line'
    ],
    instructions: 'IMPORTANT: Place V4 first! Then place V3 precisely halfway between V2 and V4 over the 5th rib/intercostal region.',
    clinicalPurpose: 'Views anterior left ventricular wall and transition zone. Sensitive indicator of anterior wall ischemia and STEMI.',
    commonMistakes: [
      'Placing V3 before V4, leading to improper spacing and incorrect precordial progression',
      'Placing directly along the 4th ICS rather than the diagonal line toward V4'
    ],
    femaleLandmarkNotes: 'Place under breast fold if necessary; lifting breast gently with back of hand respects patient dignity while securing correct chest wall contact.',
    torsoView: 'anterior',
    color: '#22c55e', // Green
    coords: { x: 59, y: 47 }
  },
  {
    id: 'v4',
    name: 'Precordial V4',
    code: 'V4',
    type: 'precordial',
    anatomicalLocation: '5th intercostal space (ICS) in the left midclavicular line (MCL)',
    landmarks: [
      'Midpoint of the left clavicle',
      'Drop imaginary vertical line down from midclavicle',
      '5th intercostal space (one rib space below V2 level)'
    ],
    instructions: 'Find midpoint of left clavicle. Follow vertical midclavicular line down to 5th ICS (below 5th rib). Place V4 here before placing V3.',
    clinicalPurpose: 'Primary view of the left ventricular anterior wall and apex. Key lead for anterior STEMI and R-wave progression.',
    commonMistakes: [
      'Using nipple line as landmark (nipple position varies widely by age, sex, BMI, and body habitus; always palpate 5th ICS)',
      'Placing too lateral (anterior axillary line instead of midclavicular)'
    ],
    femaleLandmarkNotes: 'In female patients with large breasts, elevate breast tissue with back of hand and place electrode on the chest wall in the inframammary fold or 5th ICS, NOT on breast parenchyma.',
    torsoView: 'anterior',
    color: '#3b82f6', // Blue
    coords: { x: 64, y: 53 }
  },
  {
    id: 'v5',
    name: 'Precordial V5',
    code: 'V5',
    type: 'precordial',
    anatomicalLocation: 'Left anterior axillary line (AAL), in the horizontal plane of V4',
    landmarks: [
      'Anterior axillary fold (front border of armpit)',
      'Horizontal line extending laterally from V4 (NOT following intercostal space curvature)'
    ],
    instructions: 'Drop vertical line from anterior axillary fold. Align horizontally with V4 (even if this crosses onto a rib or adjacent ICS).',
    clinicalPurpose: 'Views anterolateral left ventricular wall. Detects lateral STEMI, LV hypertrophy, and lateral ischemia.',
    commonMistakes: [
      'Following rib contour downward instead of staying on the strictly horizontal level of V4',
      'Placing too anteriorly or too posteriorly'
    ],
    femaleLandmarkNotes: 'Ensure electrode is on thoracic wall beneath lateral breast tissue or lateral to it along the anterior axillary line.',
    torsoView: 'anterior',
    color: '#ec4899', // Orange/Magenta
    coords: { x: 73, y: 54 }
  },
  {
    id: 'v6',
    name: 'Precordial V6',
    code: 'V6',
    type: 'precordial',
    anatomicalLocation: 'Left midaxillary line (MAL), in the horizontal plane of V4',
    landmarks: [
      'Apex of the axilla (midpoint of armpit between anterior and posterior folds)',
      'Horizontal line level with V4 and V5'
    ],
    instructions: 'Drop vertical line from the center of the axilla. Align strictly horizontally with V4 and V5.',
    clinicalPurpose: 'Views lateral left ventricular myocardium. Reflects lateral STEMI, circumflex artery occlusion, and lateral strain.',
    commonMistakes: [
      'Placing too low by following rib curvature down to 6th or 7th ICS',
      'Placing too anteriorly due to difficulty reaching midaxillary line with patient supine'
    ],
    femaleLandmarkNotes: 'Ensure arm is relaxed slightly abducted so midaxillary line can be accurately visualized.',
    torsoView: 'anterior',
    color: '#a855f7', // Purple
    coords: { x: 80, y: 55 }
  }
];

export const SUPPLEMENTAL_ELECTRODES: Electrode[] = [
  {
    id: 'v3r',
    name: 'Right Precordial V3R',
    code: 'V3R',
    type: 'right-sided',
    anatomicalLocation: 'Midway between V1 and V4R on right anterior chest',
    landmarks: ['V1 electrode position', 'V4R electrode position', 'Right anterior chest wall'],
    instructions: 'Place midway between V1 and V4R on the right chest wall (mirror image of standard V3).',
    clinicalPurpose: 'Supplemental assessment of right ventricular ischemia/infarction in suspected inferior STEMI. Identifies proximal RCA occlusion.',
    commonMistakes: [
      'Failing to re-label ECG tracing machine printout (leads to misinterpretation as left precordial leads)',
      'Omitting right-sided leads when inferior STEMI is identified'
    ],
    torsoView: 'anterior',
    color: '#06b6d4',
    coords: { x: 38, y: 47 }
  },
  {
    id: 'v4r',
    name: 'Right Precordial V4R',
    code: 'V4R',
    type: 'right-sided',
    anatomicalLocation: '5th intercostal space in right midclavicular line (mirror of V4)',
    landmarks: ['Midpoint of right clavicle', 'Right 5th intercostal space', 'Right midclavicular line'],
    instructions: 'Identify right midclavicular line at the 5th intercostal space (exact right-side mirror of V4).',
    clinicalPurpose: 'Highest sensitivity and specificity for right ventricular infarction (ST elevation >= 0.5 mm or >= 1.0 mm in males < 30). Critical before administering nitrates or morphine due to severe preload dependence!',
    commonMistakes: [
      'Delaying recording: ST elevation in V4R can be transient and resolve within 2-10 hours',
      'Forgetting that standard 10-lead ECG machine cable V4 is repurposed and MUST be hand-written as "V4R"'
    ],
    torsoView: 'anterior',
    color: '#3b82f6',
    coords: { x: 33, y: 53 }
  },
  {
    id: 'v7',
    name: 'Posterior V7',
    code: 'V7',
    type: 'posterior',
    anatomicalLocation: 'Left posterior axillary line (PAL), horizontal plane of V6',
    landmarks: ['Posterior axillary fold', 'Horizontal plane extending around back at V6 level'],
    instructions: 'Position patient slightly turned onto right side. Place electrode at left posterior axillary line on same horizontal level as V6.',
    clinicalPurpose: 'Directly records posterior wall of left ventricle. Detects isolated or inferoposterior STEMI (ST elevation >= 0.5 mm).',
    commonMistakes: [
      'Placing at incorrect vertical level instead of horizontal with V6',
      'Ignoring reciprocal ST depression in V1-V3 on standard ECG'
    ],
    torsoView: 'posterior',
    color: '#f97316',
    coords: { x: 28, y: 55 } // on posterior view (facing back, left is patient left)
  },
  {
    id: 'v8',
    name: 'Posterior V8',
    code: 'V8',
    type: 'posterior',
    anatomicalLocation: 'Left midscapular line, horizontal plane of V6',
    landmarks: ['Tip/inferior angle of left scapula', 'Midscapular line', 'Horizontal plane of V6'],
    instructions: 'Place directly below the inferior angle of the left scapula in the midscapular line, horizontal with V6 and V7.',
    clinicalPurpose: 'True direct posterior view of left ventricle. Confirms posterior STEMI and LCx or dominant RCA occlusion.',
    commonMistakes: [
      'Placing directly on the scapula bone instead of intercostal tissue beneath it',
      'Failing to record when V1-V3 shows ST depression and tall R waves'
    ],
    torsoView: 'posterior',
    color: '#ec4899',
    coords: { x: 37, y: 55 }
  },
  {
    id: 'v9',
    name: 'Posterior V9',
    code: 'V9',
    type: 'posterior',
    anatomicalLocation: 'Left paraspinal line, horizontal plane of V6',
    landmarks: ['Left vertebral border', 'Paraspinal muscle border', 'Horizontal plane of V6'],
    instructions: 'Place in the left paraspinal border (adjacent to spine) on the horizontal plane of V6.',
    clinicalPurpose: 'Detects posteromedial and basal left ventricular myocardial injury.',
    commonMistakes: [
      'Placing over the spinous process bone rather than left paraspinal muscular groove'
    ],
    torsoView: 'posterior',
    color: '#8b5cf6',
    coords: { x: 45, y: 55 }
  }
];

export interface LeadMapping {
  leadName: string;
  category: 'Limb Bipolar' | 'Limb Augmented' | 'Precordial' | 'Supplemental Right' | 'Supplemental Posterior';
  electrodesUsed: string;
  viewOfHeart: string;
  artery: string;
}

export const LEAD_MAPPINGS: LeadMapping[] = [
  { leadName: 'Lead I', category: 'Limb Bipolar', electrodesUsed: 'LA (+) vs RA (-)', viewOfHeart: 'High lateral wall of left ventricle', artery: 'LCx or Diagonal LAD' },
  { leadName: 'Lead II', category: 'Limb Bipolar', electrodesUsed: 'LL (+) vs RA (-)', viewOfHeart: 'Inferior wall of left ventricle', artery: 'RCA (or LCx)' },
  { leadName: 'Lead III', category: 'Limb Bipolar', electrodesUsed: 'LL (+) vs LA (-)', viewOfHeart: 'Inferior wall of left ventricle', artery: 'RCA (or LCx)' },
  { leadName: 'aVR', category: 'Limb Augmented', electrodesUsed: 'RA (+) vs (LA + LL)/2', viewOfHeart: 'Cavity view / basal septum / Right ventricular outflow', artery: 'Left Main (LMCA) / Proximal LAD in diffuse ischemia' },
  { leadName: 'aVL', category: 'Limb Augmented', electrodesUsed: 'LA (+) vs (RA + LL)/2', viewOfHeart: 'High lateral wall of left ventricle', artery: 'LCx or 1st Diagonal LAD' },
  { leadName: 'aVF', category: 'Limb Augmented', electrodesUsed: 'LL (+) vs (RA + LA)/2', viewOfHeart: 'Inferior wall of left ventricle', artery: 'RCA (or LCx)' },
  { leadName: 'V1', category: 'Precordial', electrodesUsed: 'V1 (+) vs Wilson Central Terminal', viewOfHeart: 'Interventricular septum & Right ventricle', artery: 'LAD (septal branches)' },
  { leadName: 'V2', category: 'Precordial', electrodesUsed: 'V2 (+) vs Wilson Central Terminal', viewOfHeart: 'Interventricular septum & Anterior LV wall', artery: 'LAD (septal/diagonal branches)' },
  { leadName: 'V3', category: 'Precordial', electrodesUsed: 'V3 (+) vs Wilson Central Terminal', viewOfHeart: 'Anterior wall of left ventricle', artery: 'LAD' },
  { leadName: 'V4', category: 'Precordial', electrodesUsed: 'V4 (+) vs Wilson Central Terminal', viewOfHeart: 'Anterior wall / Apex of left ventricle', artery: 'LAD' },
  { leadName: 'V5', category: 'Precordial', electrodesUsed: 'V5 (+) vs Wilson Central Terminal', viewOfHeart: 'Anterolateral wall of left ventricle', artery: 'LCx or LAD' },
  { leadName: 'V6', category: 'Precordial', electrodesUsed: 'V6 (+) vs Wilson Central Terminal', viewOfHeart: 'Lateral wall of left ventricle', artery: 'LCx or LAD' },
  { leadName: 'V3R', category: 'Supplemental Right', electrodesUsed: 'V3R (+) on right chest', viewOfHeart: 'Right ventricular anterior wall', artery: 'Proximal RCA' },
  { leadName: 'V4R', category: 'Supplemental Right', electrodesUsed: 'V4R (+) at right 5th ICS MCL', viewOfHeart: 'Right ventricular free wall & apex', artery: 'Proximal RCA' },
  { leadName: 'V7', category: 'Supplemental Posterior', electrodesUsed: 'V7 (+) at left posterior axillary line', viewOfHeart: 'Posterobasal left ventricle', artery: 'LCx or RCA (posterolateral)' },
  { leadName: 'V8', category: 'Supplemental Posterior', electrodesUsed: 'V8 (+) at left midscapular line', viewOfHeart: 'Posterior wall of left ventricle', artery: 'LCx or RCA (posterolateral)' },
  { leadName: 'V9', category: 'Supplemental Posterior', electrodesUsed: 'V9 (+) at left paraspinal line', viewOfHeart: 'Posterobasal & inferoseptal LV', artery: 'LCx or RCA (posterolateral)' }
];
