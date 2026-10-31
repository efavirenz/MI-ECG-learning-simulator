import { MI_TERRITORIES } from '../data/miTerritories';

export interface BaseLeadConfig {
  pAmp: number;      // mV
  pWidth: number;    // seconds
  pPos: number;      // fraction of cycle (0..1)
  qAmp: number;
  qWidth: number;
  rAmp: number;
  rWidth: number;
  sAmp: number;
  sWidth: number;
  tAmp: number;
  tWidth: number;
  tPos: number;
}

// Canonical normal morphology for standard & supplemental leads (at HR 75 bpm = 800 ms per cycle)
export const BASE_LEADS: Record<string, BaseLeadConfig> = {
  'I':   { pAmp: 0.10, pWidth: 0.08, pPos: 0.16, qAmp: -0.05, qWidth: 0.025, rAmp: 0.85, rWidth: 0.04, sAmp: -0.10, sWidth: 0.035, tAmp: 0.25, tWidth: 0.16, tPos: 0.58 },
  'II':  { pAmp: 0.15, pWidth: 0.09, pPos: 0.16, qAmp: -0.05, qWidth: 0.025, rAmp: 1.25, rWidth: 0.045, sAmp: -0.15, sWidth: 0.035, tAmp: 0.35, tWidth: 0.18, tPos: 0.58 },
  'III': { pAmp: 0.08, pWidth: 0.08, pPos: 0.16, qAmp: -0.06, qWidth: 0.025, rAmp: 0.55, rWidth: 0.04, sAmp: -0.20, sWidth: 0.04, tAmp: 0.15, tWidth: 0.16, tPos: 0.58 },
  'aVR': { pAmp: -0.12, pWidth: 0.08, pPos: 0.16, qAmp: 0.08, qWidth: 0.025, rAmp: 0.15, rWidth: 0.03, sAmp: -1.05, sWidth: 0.045, tAmp: -0.25, tWidth: 0.16, tPos: 0.58 },
  'aVL': { pAmp: 0.06, pWidth: 0.08, pPos: 0.16, qAmp: -0.05, qWidth: 0.025, rAmp: 0.55, rWidth: 0.04, sAmp: -0.10, sWidth: 0.035, tAmp: 0.20, tWidth: 0.16, tPos: 0.58 },
  'aVF': { pAmp: 0.12, pWidth: 0.08, pPos: 0.16, qAmp: -0.06, qWidth: 0.025, rAmp: 0.90, rWidth: 0.04, sAmp: -0.15, sWidth: 0.035, tAmp: 0.25, tWidth: 0.16, tPos: 0.58 },
  'V1':  { pAmp: 0.08, pWidth: 0.07, pPos: 0.16, qAmp: 0.0,   qWidth: 0.02,  rAmp: 0.25, rWidth: 0.03, sAmp: -1.15, sWidth: 0.045, tAmp: 0.18, tWidth: 0.16, tPos: 0.58 },
  'V2':  { pAmp: 0.10, pWidth: 0.08, pPos: 0.16, qAmp: 0.0,   qWidth: 0.02,  rAmp: 0.45, rWidth: 0.035, sAmp: -1.45, sWidth: 0.05, tAmp: 0.38, tWidth: 0.18, tPos: 0.58 },
  'V3':  { pAmp: 0.11, pWidth: 0.08, pPos: 0.16, qAmp: -0.04, qWidth: 0.02,  rAmp: 0.80, rWidth: 0.04, sAmp: -0.85, sWidth: 0.04, tAmp: 0.45, tWidth: 0.18, tPos: 0.58 },
  'V4':  { pAmp: 0.12, pWidth: 0.08, pPos: 0.16, qAmp: -0.06, qWidth: 0.02,  rAmp: 1.30, rWidth: 0.045, sAmp: -0.35, sWidth: 0.035, tAmp: 0.40, tWidth: 0.18, tPos: 0.58 },
  'V5':  { pAmp: 0.11, pWidth: 0.08, pPos: 0.16, qAmp: -0.08, qWidth: 0.025, rAmp: 1.45, rWidth: 0.045, sAmp: -0.15, sWidth: 0.03, tAmp: 0.35, tWidth: 0.17, tPos: 0.58 },
  'V6':  { pAmp: 0.10, pWidth: 0.08, pPos: 0.16, qAmp: -0.08, qWidth: 0.025, rAmp: 1.15, rWidth: 0.045, sAmp: -0.10, sWidth: 0.03, tAmp: 0.30, tWidth: 0.16, tPos: 0.58 },
  'V3R': { pAmp: 0.08, pWidth: 0.07, pPos: 0.16, qAmp: 0.0,   qWidth: 0.02,  rAmp: 0.22, rWidth: 0.03, sAmp: -0.95, sWidth: 0.04, tAmp: 0.12, tWidth: 0.15, tPos: 0.58 },
  'V4R': { pAmp: 0.08, pWidth: 0.07, pPos: 0.16, qAmp: 0.0,   qWidth: 0.02,  rAmp: 0.24, rWidth: 0.03, sAmp: -0.85, sWidth: 0.04, tAmp: 0.12, tWidth: 0.15, tPos: 0.58 },
  'V7':  { pAmp: 0.09, pWidth: 0.08, pPos: 0.16, qAmp: -0.06, qWidth: 0.02,  rAmp: 0.85, rWidth: 0.04, sAmp: -0.10, sWidth: 0.03, tAmp: 0.25, tWidth: 0.16, tPos: 0.58 },
  'V8':  { pAmp: 0.08, pWidth: 0.08, pPos: 0.16, qAmp: -0.05, qWidth: 0.02,  rAmp: 0.70, rWidth: 0.04, sAmp: -0.10, sWidth: 0.03, tAmp: 0.22, tWidth: 0.16, tPos: 0.58 },
  'V9':  { pAmp: 0.07, pWidth: 0.08, pPos: 0.16, qAmp: -0.05, qWidth: 0.02,  rAmp: 0.60, rWidth: 0.04, sAmp: -0.10, sWidth: 0.03, tAmp: 0.20, tWidth: 0.16, tPos: 0.58 }
};

// Gaussian bell function
function gaussian(t: number, center: number, width: number, amp: number): number {
  const diff = t - center;
  return amp * Math.exp(-(diff * diff) / (2 * width * width));
}

/**
 * Computes exact ECG voltage (in mV) at given time in seconds.
 * Cycle duration: 0.8 s (75 bpm).
 */
export function getEcgVoltage(
  lead: string,
  timeSec: number,
  territoryId: string = 'normal',
  bpm: number = 75
): number {
  const cycleSec = 60 / bpm;
  const tInCycle = ((timeSec % cycleSec) + cycleSec) % cycleSec; // normalized 0..cycleSec

  const base = BASE_LEADS[lead] || BASE_LEADS['II'];
  const territory = MI_TERRITORIES[territoryId] || MI_TERRITORIES['normal'];
  const delta = territory.waveformDeltas[lead];

  // Timing markers in seconds within cycle (scaled by cycleSec/0.8)
  const scale = cycleSec / 0.8;
  const pCenter = base.pPos * cycleSec;
  const qrsCenter = 0.35 * cycleSec;
  const tCenter = base.tPos * cycleSec;

  let voltage = 0;

  // 1. P Wave
  let pAmp = base.pAmp;
  voltage += gaussian(tInCycle, pCenter, base.pWidth * scale, pAmp);

  // 2. Q Wave (or Pathological Q wave)
  let qAmp = base.qAmp;
  let qWidth = base.qWidth * scale;
  if (delta?.qWaveMm) {
    // 1 mm = 0.1 mV
    const pathologicalDepth = -(delta.qWaveMm * 0.1);
    qAmp = Math.min(qAmp, pathologicalDepth);
    if (delta.qWaveDurationMs) {
      qWidth = (delta.qWaveDurationMs / 1000) * 0.5;
    }
  }
  const qCenter = qrsCenter - 0.035 * scale;
  voltage += gaussian(tInCycle, qCenter, qWidth, qAmp);

  // 3. R Wave
  let rAmp = base.rAmp;
  if (delta?.rAmplitudeMultiplier !== undefined) {
    rAmp *= delta.rAmplitudeMultiplier;
  }
  if (delta?.tallRWave) {
    // Reciprocal posterior changes in V1-V3
    rAmp = Math.max(rAmp * 2.2, 1.1);
  }
  voltage += gaussian(tInCycle, qrsCenter, base.rWidth * scale, rAmp);

  // 4. S Wave
  let sAmp = base.sAmp;
  if (delta?.rAmplitudeMultiplier !== undefined && delta.rAmplitudeMultiplier < 0.3) {
    // In deep QS complex, S wave merges with Q
    sAmp *= 0.5;
  }
  const sCenter = qrsCenter + 0.035 * scale;
  voltage += gaussian(tInCycle, sCenter, base.sWidth * scale, sAmp);

  // 5. ST Segment & J Point
  // J point occurs at end of S wave: approximately qrsCenter + 0.05 * scale
  const jPointTime = qrsCenter + 0.048 * scale;

  if (delta?.stElevationMm) {
    const stMv = delta.stElevationMm * 0.1; // convert mm to mV
    const slopeType = delta.stSlope || 'convex';

    if (tInCycle >= jPointTime && tInCycle <= tCenter + 0.1 * scale) {
      const stProgress = Math.max(0, Math.min(1, (tInCycle - jPointTime) / (tCenter - jPointTime)));
      let stOffset = 0;

      if (slopeType === 'convex') {
        // Coved "tombstone" STEMI ST elevation: arches upward smoothly
        stOffset = stMv * Math.sin(stProgress * Math.PI * 0.75);
      } else if (slopeType === 'concave') {
        // "Saddleback" pericarditis / early repolarization: dips then rises
        stOffset = stMv * (1 - 0.4 * Math.sin(stProgress * Math.PI));
      } else if (slopeType === 'horizontal') {
        // Ischemic ST depression or reciprocal changes: flat shelf
        stOffset = stMv * (1 - stProgress * 0.15);
      } else if (slopeType === 'downsloping') {
        // Strain pattern / severe reciprocal: slopes downward
        stOffset = stMv * (1.1 - stProgress * 0.6);
      } else if (slopeType === 'upsloping') {
        // de Winter pattern: dips below baseline then rises steeply into tall T
        stOffset = stMv * (1 - stProgress * 1.5);
      }

      // Smooth window envelope to blend seamlessly into baseline/T wave
      const envelope = Math.sin(Math.min(1, Math.max(0, (tInCycle - jPointTime) / (0.28 * scale))) * Math.PI);
      voltage += stOffset * (envelope * 0.95 + 0.05);
    }
  }

  // 6. T Wave
  let tAmp = base.tAmp;
  if (delta?.tWaveAmplitudeMm !== undefined) {
    tAmp = delta.tWaveAmplitudeMm * 0.1;
  }
  if (delta?.tInverted) {
    tAmp = -Math.abs(tAmp > 0 ? tAmp : base.tAmp);
  }

  // T wave has asymmetric bell (gradual rise, steeper downstroke)
  const tDiff = tInCycle - tCenter;
  const tSigma = tDiff < 0 ? (base.tWidth * scale * 1.1) : (base.tWidth * scale * 0.85);
  voltage += tAmp * Math.exp(-(tDiff * tDiff) / (2 * tSigma * tSigma));

  return voltage;
}

export interface LandmarkLabel {
  name: string;
  code: string;
  timeSec: number;
  voltageMv: number;
  description: string;
}

/**
 * Returns labeled landmark positions for a single cardiac cycle
 */
export function getCycleLandmarks(lead: string, territoryId: string = 'normal', bpm: number = 75): LandmarkLabel[] {
  const cycleSec = 60 / bpm;
  const scale = cycleSec / 0.8;
  const territory = MI_TERRITORIES[territoryId] || MI_TERRITORIES['normal'];
  const delta = territory.waveformDeltas[lead];

  const pTime = 0.16 * scale;
  const prSegmentTime = 0.26 * scale;
  const qTime = 0.315 * scale;
  const rTime = 0.35 * scale;
  const sTime = 0.385 * scale;
  const jPointTime = 0.40 * scale;
  const stSegmentTime = 0.47 * scale;
  const tTime = 0.58 * scale;

  return [
    {
      name: 'P Wave',
      code: 'P',
      timeSec: pTime,
      voltageMv: getEcgVoltage(lead, pTime, territoryId, bpm),
      description: 'Atrial depolarization (SA node through right and left atria). Normal duration < 0.12s, amplitude < 0.25 mV.'
    },
    {
      name: 'PR Segment',
      code: 'PR Seg',
      timeSec: prSegmentTime,
      voltageMv: getEcgVoltage(lead, prSegmentTime, territoryId, bpm),
      description: 'Conduction delay through the AV node, bundle of His, and bundle branches. Crucial electrical baseline for J-point reference.'
    },
    {
      name: 'Q Wave',
      code: 'Q',
      timeSec: qTime,
      voltageMv: getEcgVoltage(lead, qTime, territoryId, bpm),
      description: delta?.qWaveMm ? `Pathological Q Wave (depth ≥ ${delta.qWaveMm} mm, duration ≥ 0.04s) representing transmural electrical void/necrosis.` : 'Initial negative deflection of ventricular depolarization (septal depolarization left-to-right).'
    },
    {
      name: 'R Wave',
      code: 'R',
      timeSec: rTime,
      voltageMv: getEcgVoltage(lead, rTime, territoryId, bpm),
      description: 'Primary positive ventricular depolarization vector (bulk of left and right ventricular free walls).'
    },
    {
      name: 'S Wave',
      code: 'S',
      timeSec: sTime,
      voltageMv: getEcgVoltage(lead, sTime, territoryId, bpm),
      description: 'Terminal negative deflection of ventricular depolarization (basal LV and RV outflow tract).'
    },
    {
      name: 'J Point',
      code: 'J-Pt',
      timeSec: jPointTime,
      voltageMv: getEcgVoltage(lead, jPointTime, territoryId, bpm),
      description: 'Junction point between QRS complex and ST segment. The exact anatomical point at which guideline ST elevation or depression is measured relative to PR segment.'
    },
    {
      name: 'ST Segment',
      code: 'ST',
      timeSec: stSegmentTime,
      voltageMv: getEcgVoltage(lead, stSegmentTime, territoryId, bpm),
      description: delta?.stElevationMm ? `Acute ST deviation (${delta.stElevationMm > 0 ? '+' : ''}${delta.stElevationMm} mm) indicating transmural current of injury / ischemia.` : 'Plateau phase (phase 2) of ventricular myocardial action potential. Isoelectric in normal myocardium.'
    },
    {
      name: 'T Wave',
      code: 'T',
      timeSec: tTime,
      voltageMv: getEcgVoltage(lead, tTime, territoryId, bpm),
      description: delta?.tInverted ? 'Symmetric T-wave inversion reflecting ischemic repolarization delay.' : delta?.tWaveAmplitudeMm ? 'Hyperacute tall T wave or prominent reciprocal upright T wave.' : 'Rapid ventricular repolarization (phase 3). Normal upright morphology concordant with main QRS vector.'
    }
  ];
}
