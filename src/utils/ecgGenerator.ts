import { MI_TERRITORIES } from '../data/miTerritories';

export interface BaseLeadConfig {
  pAmp: number;      // mV
  pWidth: number;    // seconds
  pPos: number;      // fraction of cycle
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

// Canonical physiological morphology for standard & supplemental leads (HR 75 bpm = 800 ms cycle)
export const BASE_LEADS: Record<string, BaseLeadConfig> = {
  'I':   { pAmp: 0.10, pWidth: 0.035, pPos: 0.16, qAmp: -0.05, qWidth: 0.012, rAmp: 0.85, rWidth: 0.018, sAmp: -0.12, sWidth: 0.015, tAmp: 0.25, tWidth: 0.045, tPos: 0.57 },
  'II':  { pAmp: 0.15, pWidth: 0.035, pPos: 0.16, qAmp: -0.05, qWidth: 0.012, rAmp: 1.25, rWidth: 0.020, sAmp: -0.22, sWidth: 0.016, tAmp: 0.35, tWidth: 0.050, tPos: 0.57 },
  'III': { pAmp: 0.07, pWidth: 0.035, pPos: 0.16, qAmp: -0.06, qWidth: 0.012, rAmp: 0.55, rWidth: 0.018, sAmp: -0.25, sWidth: 0.016, tAmp: 0.15, tWidth: 0.045, tPos: 0.57 },
  'aVR': { pAmp: -0.12, pWidth: 0.035, pPos: 0.16, qAmp: 0.08, qWidth: 0.012, rAmp: 0.12, rWidth: 0.015, sAmp: -1.05, sWidth: 0.022, tAmp: -0.25, tWidth: 0.045, tPos: 0.57 },
  'aVL': { pAmp: 0.06, pWidth: 0.035, pPos: 0.16, qAmp: -0.05, qWidth: 0.012, rAmp: 0.55, rWidth: 0.018, sAmp: -0.12, sWidth: 0.015, tAmp: 0.20, tWidth: 0.045, tPos: 0.57 },
  'aVF': { pAmp: 0.11, pWidth: 0.035, pPos: 0.16, qAmp: -0.06, qWidth: 0.012, rAmp: 0.90, rWidth: 0.019, sAmp: -0.18, sWidth: 0.016, tAmp: 0.25, tWidth: 0.048, tPos: 0.57 },
  'V1':  { pAmp: 0.08, pWidth: 0.032, pPos: 0.16, qAmp: 0.0,   qWidth: 0.010, rAmp: 0.25, rWidth: 0.015, sAmp: -1.25, sWidth: 0.022, tAmp: 0.16, tWidth: 0.045, tPos: 0.57 },
  'V2':  { pAmp: 0.10, pWidth: 0.035, pPos: 0.16, qAmp: 0.0,   qWidth: 0.010, rAmp: 0.45, rWidth: 0.016, sAmp: -1.45, sWidth: 0.024, tAmp: 0.38, tWidth: 0.050, tPos: 0.57 },
  'V3':  { pAmp: 0.11, pWidth: 0.035, pPos: 0.16, qAmp: -0.04, qWidth: 0.012, rAmp: 0.85, rWidth: 0.018, sAmp: -0.85, sWidth: 0.020, tAmp: 0.45, tWidth: 0.050, tPos: 0.57 },
  'V4':  { pAmp: 0.12, pWidth: 0.035, pPos: 0.16, qAmp: -0.06, qWidth: 0.012, rAmp: 1.35, rWidth: 0.020, sAmp: -0.35, sWidth: 0.016, tAmp: 0.40, tWidth: 0.048, tPos: 0.57 },
  'V5':  { pAmp: 0.11, pWidth: 0.035, pPos: 0.16, qAmp: -0.08, qWidth: 0.012, rAmp: 1.45, rWidth: 0.020, sAmp: -0.15, sWidth: 0.015, tAmp: 0.35, tWidth: 0.048, tPos: 0.57 },
  'V6':  { pAmp: 0.10, pWidth: 0.035, pPos: 0.16, qAmp: -0.08, qWidth: 0.012, rAmp: 1.15, rWidth: 0.019, sAmp: -0.10, sWidth: 0.015, tAmp: 0.30, tWidth: 0.045, tPos: 0.57 },
  'V3R': { pAmp: 0.08, pWidth: 0.032, pPos: 0.16, qAmp: 0.0,   qWidth: 0.010, rAmp: 0.22, rWidth: 0.015, sAmp: -0.95, sWidth: 0.020, tAmp: 0.12, tWidth: 0.042, tPos: 0.57 },
  'V4R': { pAmp: 0.08, pWidth: 0.032, pPos: 0.16, qAmp: 0.0,   qWidth: 0.010, rAmp: 0.24, rWidth: 0.015, sAmp: -0.85, sWidth: 0.020, tAmp: 0.12, tWidth: 0.042, tPos: 0.57 },
  'V7':  { pAmp: 0.09, pWidth: 0.035, pPos: 0.16, qAmp: -0.06, qWidth: 0.012, rAmp: 0.85, rWidth: 0.018, sAmp: -0.10, sWidth: 0.015, tAmp: 0.25, tWidth: 0.045, tPos: 0.57 },
  'V8':  { pAmp: 0.08, pWidth: 0.035, pPos: 0.16, qAmp: -0.05, qWidth: 0.012, rAmp: 0.70, rWidth: 0.018, sAmp: -0.10, sWidth: 0.015, tAmp: 0.22, tWidth: 0.045, tPos: 0.57 },
  'V9':  { pAmp: 0.07, pWidth: 0.035, pPos: 0.16, qAmp: -0.05, qWidth: 0.012, rAmp: 0.60, rWidth: 0.018, sAmp: -0.10, sWidth: 0.015, tAmp: 0.20, tWidth: 0.045, tPos: 0.57 }
};

/**
 * Computes exact, clinically calibrated ECG voltage (in mV) at given time in seconds.
 * 1 mm on ECG paper = 0.1 mV (10 mm = 1.0 mV).
 * Standard HR 75 bpm = 0.8 s cycle duration (20 mm on paper at 25 mm/s).
 */
export function getEcgVoltage(
  lead: string,
  timeSec: number,
  territoryId: string = 'normal',
  bpm: number = 75
): number {
  const cycleSec = 60 / bpm;
  const tNorm = ((timeSec % cycleSec) + cycleSec) % cycleSec; // normalized 0..cycleSec
  const scale = cycleSec / 0.8;

  const base = BASE_LEADS[lead] || BASE_LEADS['II'];
  const territory = MI_TERRITORIES[territoryId] || MI_TERRITORIES['normal'];
  const delta = territory.waveformDeltas[lead];

  // Key physiological timing markers within 800 ms cycle:
  const pCenter = 0.16 * scale;
  const prSegmentStart = 0.21 * scale;
  const qrsStart = 0.29 * scale;
  const qCenter = 0.315 * scale;
  const rCenter = 0.345 * scale;
  const sCenter = 0.375 * scale;
  const jPointTime = 0.395 * scale;   // J-point junction where ST segment begins
  const stEnd = 0.49 * scale;         // ST segment transition to T wave
  const tCenter = base.tPos * scale;  // Peak of T wave (~0.57s)
  const tEnd = 0.68 * scale;          // T wave termination / return to baseline

  const stMv = (delta?.stElevationMm || 0) * 0.1; // 1 mm = 0.1 mV
  const slopeType = delta?.stSlope || (stMv >= 0 ? 'convex' : 'horizontal');

  let voltage = 0;

  // 1. P Wave (Atrial Depolarization: 0.10s - 0.22s)
  if (tNorm >= 0.08 * scale && tNorm <= prSegmentStart) {
    const pDiff = (tNorm - pCenter) / (base.pWidth * scale);
    voltage += base.pAmp * Math.exp(-0.5 * pDiff * pDiff);
  }

  // 2. PR Segment (Isoelectric baseline: 0.21s - 0.29s)
  if (tNorm > prSegmentStart && tNorm < qrsStart) {
    // In acute pericarditis: PR depression in inferolateral leads, PR elevation in aVR
    if (territoryId === 'pericarditis') {
      if (['II', 'V5', 'V6'].includes(lead)) voltage = -0.06;
      else if (lead === 'aVR') voltage = +0.06;
    }
  }

  // 3. QRS Complex (Ventricular Depolarization: 0.29s - 0.395s)
  if (tNorm >= qrsStart && tNorm <= jPointTime) {
    // Q wave (initial septal deflection)
    let qAmp = base.qAmp;
    let qSigma = base.qWidth * scale;
    if (delta?.qWaveMm) {
      qAmp = -(delta.qWaveMm * 0.1); // Pathological Q wave depth
      qSigma = Math.max(qSigma, (delta.qWaveDurationMs ? (delta.qWaveDurationMs / 1000) * 0.4 : 0.018 * scale));
    }
    const qDiff = (tNorm - qCenter) / qSigma;
    voltage += qAmp * Math.exp(-0.5 * qDiff * qDiff);

    // R wave
    let rAmp = base.rAmp;
    if (delta?.rAmplitudeMultiplier !== undefined) {
      rAmp *= delta.rAmplitudeMultiplier;
    }
    if (delta?.tallRWave) {
      // Prominent tall R wave in V1-V3 (reciprocal of posterior wall)
      rAmp = Math.max(rAmp * 2.2, 1.15);
    }
    const rDiff = (tNorm - rCenter) / (base.rWidth * scale);
    voltage += rAmp * Math.exp(-0.5 * rDiff * rDiff);

    // S wave
    let sAmp = base.sAmp;
    if (delta?.rAmplitudeMultiplier !== undefined && delta.rAmplitudeMultiplier < 0.25) {
      sAmp *= 0.5; // In deep QS complex, S wave blends into pathological Q
    }
    const sDiff = (tNorm - sCenter) / (base.sWidth * scale);
    voltage += sAmp * Math.exp(-0.5 * sDiff * sDiff);

    // Smooth return from S nadir directly to J-point potential (stMv)
    if (tNorm > sCenter && tNorm <= jPointTime) {
      const upProgress = (tNorm - sCenter) / (jPointTime - sCenter);
      voltage += stMv * Math.pow(upProgress, 2);
    }
  }

  // 4. J Point & ST Segment (0.395s - 0.49s)
  // Standard STEMI threshold is measured at J point relative to PR baseline!
  if (tNorm > jPointTime && tNorm <= stEnd) {
    const prog = (tNorm - jPointTime) / (stEnd - jPointTime);

    if (slopeType === 'convex') {
      // Acute STEMI: coved "tombstone" ST elevation arching into T wave
      voltage = stMv * (1 + 0.22 * Math.sin(prog * Math.PI));
    } else if (slopeType === 'concave') {
      // Pericarditis / Benign Early Repol: concave "saddleback" ST elevation
      voltage = stMv * (1 - 0.25 * Math.sin(prog * Math.PI));
    } else if (slopeType === 'horizontal') {
      // Classic ischemic ST depression / reciprocal changes: flat shelf
      voltage = stMv;
    } else if (slopeType === 'downsloping') {
      // Strain pattern: slopes downwards
      voltage = stMv * (1 + prog * 0.35);
    } else if (slopeType === 'upsloping') {
      // de Winter pattern: upsloping depression towards tall T wave
      voltage = stMv * (1 - prog * 1.6);
    } else {
      voltage = stMv;
    }
  }

  // 5. T Wave (Ventricular Repolarization: 0.49s - 0.68s)
  if (tNorm > stEnd && tNorm <= tEnd) {
    const prog = (tNorm - stEnd) / (tEnd - stEnd);

    let targetTAmp = base.tAmp;
    if (delta?.tWaveAmplitudeMm !== undefined) {
      targetTAmp = delta.tWaveAmplitudeMm * 0.1;
    }
    if (delta?.tallRWave) {
      targetTAmp = Math.max(targetTAmp, 0.48); // Tall upright T wave in V1-V3 for posterior STEMI
    }
    if (delta?.tInverted) {
      targetTAmp = -Math.abs(targetTAmp > 0 ? targetTAmp : 0.30);
    }

    // Asymmetric Gaussian for physiological T wave (gradual rise, slightly steeper descent)
    const tSigma = (tNorm < tCenter ? (base.tWidth * 1.15) : (base.tWidth * 0.85)) * scale;
    const tDiff = (tNorm - tCenter) / tSigma;
    const tBell = Math.exp(-0.5 * tDiff * tDiff);

    // Seamless continuous transition from ST segment into T wave down to baseline
    const stDecay = (1 - prog) * stMv;
    voltage = targetTAmp * tBell + stDecay * (1 - tBell);
  }

  // 6. TP Segment (0.68s - 0.80s): strictly isoelectric (0 mV baseline)
  if (tNorm > tEnd || tNorm < 0.08 * scale) {
    voltage = 0;
  }

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
  const prSegmentTime = 0.25 * scale;
  const qTime = 0.315 * scale;
  const rTime = 0.345 * scale;
  const sTime = 0.375 * scale;
  const jPointTime = 0.395 * scale;
  const stSegmentTime = 0.45 * scale;
  const tTime = 0.57 * scale;

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
      description: 'Conduction delay through AV node, bundle of His, and bundle branches. The standard isoelectric baseline for J-point reference.'
    },
    {
      name: 'Q Wave',
      code: 'Q',
      timeSec: qTime,
      voltageMv: getEcgVoltage(lead, qTime, territoryId, bpm),
      description: delta?.qWaveMm ? `Pathological Q Wave (depth ≥ ${delta.qWaveMm} mm, duration ≥ 0.04s) representing transmural electrical necrosis.` : 'Initial negative deflection of ventricular depolarization (septal depolarization left-to-right).'
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
      description: 'Junction point between QRS complex and ST segment. The exact anatomical point at which guideline ST elevation or depression is measured relative to PR segment baseline.'
    },
    {
      name: 'ST Segment',
      code: 'ST',
      timeSec: stSegmentTime,
      voltageMv: getEcgVoltage(lead, stSegmentTime, territoryId, bpm),
      description: delta?.stElevationMm ? `Acute ST deviation (${delta.stElevationMm > 0 ? '+' : ''}${delta.stElevationMm} mm) indicating transmural current of injury / ischemia.` : 'Plateau phase (phase 2) of ventricular action potential. Isoelectric in normal myocardium.'
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
