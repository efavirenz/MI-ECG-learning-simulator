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
  'aVR': { pAmp: -0.12, pWidth: 0.035, pPos: 0.16, qAmp: 0.0,   qWidth: 0.012, rAmp: 0.12, rWidth: 0.015, sAmp: -1.05, sWidth: 0.022, tAmp: -0.25, tWidth: 0.045, tPos: 0.57 },
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
 * Computes exact, clinically calibrated, mathematically continuous ECG voltage (in mV).
 * Standard calibration: 10 mm/mV (1 mm = 0.1 mV).
 * Paper speed: 25 mm/s (0.04s = 1 mm small box; 0.20s = 5 mm large box).
 * Normal baseline is isoelectric at 0.0 mV referenced to PR segment.
 */
export function getEcgVoltage(
  lead: string,
  timeSec: number,
  territoryId: string = 'normal',
  bpm: number = 75
): number {
  const cycleSec = 60 / bpm;
  const tNorm = ((timeSec % cycleSec) + cycleSec) % cycleSec;
  const scale = cycleSec / 0.8;
  const tau = tNorm / scale;

  const base = BASE_LEADS[lead] || BASE_LEADS['II'];
  const territory = MI_TERRITORIES[territoryId] || MI_TERRITORIES['normal'];
  const delta = territory.waveformDeltas[lead];

  // 1 mm ST deviation = 0.1 mV
  const stMv = (delta?.stElevationMm || 0) * 0.1;
  const slopeType = delta?.stSlope || (Math.abs(stMv) < 0.02 ? 'horizontal' : (stMv > 0 ? 'convex' : 'horizontal'));

  // Key physiological timing markers normalized to 0.8s cycle (75 bpm):
  const tPStart = 0.08;
  const tPEnd = 0.22;
  const tQRSStart = 0.28;
  const tQ = 0.305;
  const tR = 0.335;
  const tS = 0.360;
  const tJ = 0.385;      // J-point junction where QRS finishes and ST begins
  const tSTEnd = 0.485;  // ST segment transition into T wave
  const tTPeak = 0.570;  // Peak of T wave
  const tTEnd = 0.680;   // T wave completes and returns to baseline

  // 1. TP Segment (0.680 -> 0.080): Isoelectric electrical diastole (strictly 0.0 mV)
  if (tau < tPStart || tau >= tTEnd) {
    return 0.0;
  }

  // 2. P Wave (0.080 -> 0.220): Atrial Depolarization
  if (tau >= tPStart && tau < tPEnd) {
    const u = (tau - tPStart) / (tPEnd - tPStart);
    // Smooth raised sine lobe: starts at 0 with 0 slope, peaks smoothly, ends at 0 with 0 slope
    return base.pAmp * Math.sin(Math.PI * u) * Math.sin(Math.PI * u);
  }

  // 3. PR Segment (0.220 -> 0.280): AV node conduction delay
  if (tau >= tPEnd && tau < tQRSStart) {
    // In acute pericarditis: subepicardial atrial injury causes PR depression in inferolateral leads, PR elevation in aVR
    if (territoryId === 'pericarditis') {
      const u = (tau - tPEnd) / (tQRSStart - tPEnd);
      const prEnvelope = Math.sin(Math.PI * u);
      if (['II', 'III', 'aVF', 'V5', 'V6'].includes(lead)) {
        return -0.06 * prEnvelope;
      } else if (lead === 'aVR') {
        return +0.06 * prEnvelope;
      }
    }
    return 0.0;
  }

  // 4. QRS Complex (0.280 -> 0.385): Ventricular Depolarization
  if (tau >= tQRSStart && tau <= tJ) {
    let qAmp = delta?.qWaveMm ? -(delta.qWaveMm * 0.1) : base.qAmp;
    let rAmp = base.rAmp;
    let sAmp = base.sAmp;

    if (delta?.rAmplitudeMultiplier !== undefined) {
      rAmp *= delta.rAmplitudeMultiplier;
    } else if (delta?.tallRWave) {
      // Reciprocal tall, broad R wave in V1-V3 (posterior wall STEMI)
      rAmp = Math.max(rAmp * 2.2, 1.25);
    }

    const isQS = (delta?.rAmplitudeMultiplier !== undefined && delta.rAmplitudeMultiplier <= 0.25) ||
                 (delta?.qWaveMm !== undefined && delta.qWaveMm >= 4 && base.rAmp < 0.5);

    if (isQS) {
      // Deep monophasic QS complex representing full-thickness transmural necrosis
      const qsNadir = Math.min(qAmp, -0.55);
      const tQSNadir = 0.335;
      if (tau < tQSNadir) {
        const u = (tau - tQRSStart) / (tQSNadir - tQRSStart);
        return qsNadir * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
      } else {
        const u = (tau - tQSNadir) / (tJ - tQSNadir);
        // Ascends directly and smoothly from QS trough to elevated J-point (stMv)
        return qsNadir + (stMv - qsNadir) * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
      }
    }

    const hasQ = qAmp < -0.015;
    const hasS = sAmp < -0.05;

    // Upstroke to R peak (via septal Q if present)
    if (tau < tR) {
      if (hasQ) {
        if (tau < tQ) {
          const u = (tau - tQRSStart) / (tQ - tQRSStart);
          return qAmp * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
        } else {
          const u = (tau - tQ) / (tR - tQ);
          return qAmp + (rAmp - qAmp) * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
        }
      } else {
        const u = (tau - tQRSStart) / (tR - tQRSStart);
        return rAmp * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
      }
    }

    // Downstroke from R peak, through S nadir, ascending to J-point
    let baseVoltage: number;
    if (hasS) {
      if (tau < tS) {
        const u = (tau - tR) / (tS - tR);
        baseVoltage = rAmp + (sAmp - rAmp) * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
      } else {
        // Continuous, smooth ascent from S nadir to reach EXACTLY stMv at tJ
        const u = (tau - tS) / (tJ - tS);
        baseVoltage = sAmp + (stMv - sAmp) * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
      }
    } else {
      // Direct descent from R peak to reach stMv at tJ
      const u = (tau - tR) / (tJ - tR);
      baseVoltage = rAmp + (stMv - rAmp) * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
    }

    // Benign early repolarization: J-point notch / fishhook slurring on terminal QRS
    if (territoryId === 'early_repolarization' && tau > tS && tau <= tJ) {
      const notchProg = (tau - tS) / (tJ - tS);
      const notch = 0.08 * Math.sin(Math.PI * notchProg);
      return baseVoltage + notch;
    }

    return baseVoltage;
  }

  // Calculate target T-wave peak amplitude
  let tAmp = base.tAmp;
  if (delta?.tWaveAmplitudeMm !== undefined) {
    tAmp = delta.tWaveAmplitudeMm * 0.1;
  }
  if (delta?.tallRWave) {
    // Reciprocal prominent upright T wave in posterior STEMI
    tAmp = Math.max(tAmp, 0.48);
  }
  if (delta?.tInverted) {
    tAmp = -Math.abs(tAmp > 0 ? tAmp : 0.30);
  }

  // 5. ST Segment (0.385 -> 0.485): Ventricular Plateau Phase
  // Transition voltage where ST segment joins the T wave
  let vSTEnd = stMv;
  if (slopeType === 'convex') {
    vSTEnd = stMv + (tAmp - stMv) * 0.35;
  } else if (slopeType === 'concave') {
    vSTEnd = stMv + (tAmp - stMv) * 0.20;
  } else if (slopeType === 'horizontal') {
    vSTEnd = stMv;
  } else if (slopeType === 'downsloping') {
    vSTEnd = stMv * 1.35;
  } else if (slopeType === 'upsloping') {
    vSTEnd = stMv * 0.25;
  }

  if (tau > tJ && tau <= tSTEnd) {
    const u = (tau - tJ) / (tSTEnd - tJ);
    if (slopeType === 'convex') {
      // Acute STEMI: coved "tombstone" ST elevation arching into hyperacute T wave
      const arch = 0.30 * Math.max(Math.abs(stMv), 0.15) * Math.sin(Math.PI * u);
      return (stMv + (vSTEnd - stMv) * u) + (stMv >= 0 ? arch : -arch);
    } else if (slopeType === 'concave') {
      // Pericarditis / Benign Early Repol: concave "saddleback" ST elevation
      const scoop = -0.20 * Math.max(Math.abs(stMv), 0.10) * Math.sin(Math.PI * u);
      return (stMv + (vSTEnd - stMv) * u) + scoop;
    } else if (slopeType === 'horizontal') {
      // Classic ischemic ST depression / reciprocal changes: flat shelf
      return stMv;
    } else if (slopeType === 'downsloping') {
      // Strain pattern: progressive downsloping ST depression
      return stMv * (1 + 0.35 * u);
    } else if (slopeType === 'upsloping') {
      // de Winter pattern: upsloping ST depression leading into tall peaked T wave
      return stMv + (vSTEnd - stMv) * (u * u);
    }
    return stMv;
  }

  // 6. T Wave (0.485 -> 0.680): Ventricular Repolarization
  if (tau > tSTEnd && tau <= tTEnd) {
    if (tau <= tTPeak) {
      // Seamless rise from ST junction to T peak
      const u = (tau - tSTEnd) / (tTPeak - tSTEnd);
      return vSTEnd + (tAmp - vSTEnd) * Math.sin(0.5 * Math.PI * u) * Math.sin(0.5 * Math.PI * u);
    } else {
      // Smooth descent from T peak back to 0.0 mV isoelectric baseline with zero slope
      const u = (tau - tTPeak) / (tTEnd - tTPeak);
      return tAmp * Math.cos(0.5 * Math.PI * u) * Math.cos(0.5 * Math.PI * u);
    }
  }

  return 0.0;
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
  const base = BASE_LEADS[lead] || BASE_LEADS['II'];

  const pTime = 0.150 * scale;
  const prSegmentTime = 0.250 * scale;
  const qTime = 0.305 * scale;
  const rTime = 0.335 * scale;
  const sTime = 0.360 * scale;
  const jPointTime = 0.385 * scale;
  const stSegmentTime = 0.435 * scale;
  const tTime = 0.570 * scale;

  const isQS = (delta?.rAmplitudeMultiplier !== undefined && delta.rAmplitudeMultiplier <= 0.25) ||
               (delta?.qWaveMm !== undefined && delta.qWaveMm >= 4 && base.rAmp < 0.5);

  const landmarks: LandmarkLabel[] = [
    {
      name: 'P Wave',
      code: 'P',
      timeSec: pTime,
      voltageMv: getEcgVoltage(lead, pTime, territoryId, bpm),
      description: lead === 'aVR'
        ? 'Normally inverted P wave in lead aVR due to atrial depolarization vector traveling away from the right shoulder electrode.'
        : 'Atrial depolarization (SA node spreading across right and left atria). Normal duration < 0.12s, amplitude < 0.25 mV.'
    },
    {
      name: 'PR Segment',
      code: 'PR Seg',
      timeSec: prSegmentTime,
      voltageMv: getEcgVoltage(lead, prSegmentTime, territoryId, bpm),
      description: territoryId === 'pericarditis'
        ? (['II', 'III', 'aVF', 'V5', 'V6'].includes(lead)
            ? 'PR segment depression: pathognomonic sign of acute pericarditis due to subepicardial atrial current of injury.'
            : lead === 'aVR'
            ? 'PR segment elevation: reciprocal sign in aVR strongly indicative of acute pericarditis.'
            : 'Conduction delay through AV node, bundle of His, and bundle branches. The standard isoelectric baseline for J-point reference.')
        : 'Conduction delay through AV node, bundle of His, and bundle branches. The standard isoelectric baseline for J-point reference.'
    }
  ];

  if (isQS) {
    landmarks.push({
      name: 'QS Complex',
      code: 'QS',
      timeSec: 0.335 * scale,
      voltageMv: getEcgVoltage(lead, 0.335 * scale, territoryId, bpm),
      description: `Pathological QS complex (depth ≥ ${delta?.qWaveMm || 4} mm, duration ≥ 0.04s): total loss of viable myocardium and electrical transmural necrosis.`
    });
  } else {
    const hasQ = (delta?.qWaveMm ? -(delta.qWaveMm * 0.1) : base.qAmp) < -0.015;
    const effectiveQTime = hasQ ? qTime : (0.280 * scale);
    const effectiveQVoltage = hasQ ? getEcgVoltage(lead, qTime, territoryId, bpm) : 0.0;

    landmarks.push({
      name: 'Q Wave',
      code: 'Q',
      timeSec: effectiveQTime,
      voltageMv: effectiveQVoltage,
      description: delta?.qWaveMm
        ? `Pathological Q Wave (depth ≥ ${delta.qWaveMm} mm, duration ≥ 0.04s) representing transmural electrical necrosis.`
        : !hasQ
        ? 'Normal absence of Q wave (rS morphology typical of right precordial leads V1-V2). QRS onset begins directly from baseline.'
        : 'Initial negative deflection of ventricular depolarization (physiologic septal depolarization left-to-right).'
    });

    landmarks.push({
      name: 'R Wave',
      code: 'R',
      timeSec: rTime,
      voltageMv: getEcgVoltage(lead, rTime, territoryId, bpm),
      description: delta?.tallRWave
        ? 'Abnormally tall, broad reciprocal R wave (R/S > 1.0) diagnostic of acute posterior wall STEMI.'
        : 'Primary positive ventricular depolarization vector (bulk of left and right ventricular free walls).'
    });

    landmarks.push({
      name: 'S Wave',
      code: 'S',
      timeSec: sTime,
      voltageMv: getEcgVoltage(lead, sTime, territoryId, bpm),
      description: 'Terminal negative deflection of ventricular depolarization (basal LV and RV outflow tract).'
    });
  }

  landmarks.push({
    name: 'J Point',
    code: 'J-Pt',
    timeSec: jPointTime,
    voltageMv: getEcgVoltage(lead, jPointTime, territoryId, bpm),
    description: 'Junction point between QRS complex and ST segment. The exact anatomical point at which guideline ST elevation or depression is measured relative to PR segment baseline.'
  });

  landmarks.push({
    name: 'ST Segment',
    code: 'ST',
    timeSec: stSegmentTime,
    voltageMv: getEcgVoltage(lead, stSegmentTime, territoryId, bpm),
    description: delta?.stElevationMm
      ? `Acute ST deviation (${delta.stElevationMm > 0 ? '+' : ''}${delta.stElevationMm} mm) indicating transmural current of injury / ischemia.`
      : 'Plateau phase (phase 2) of ventricular action potential. Isoelectric in normal myocardium.'
  });

  landmarks.push({
    name: 'T Wave',
    code: 'T',
    timeSec: tTime,
    voltageMv: getEcgVoltage(lead, tTime, territoryId, bpm),
    description: lead === 'aVR'
      ? 'Normally inverted T wave in lead aVR reflecting repolarization away from right arm electrode.'
      : delta?.tInverted
      ? 'Symmetric T-wave inversion reflecting ischemic repolarization delay.'
      : delta?.tWaveAmplitudeMm && delta.tWaveAmplitudeMm >= 6
      ? 'Hyperacute tall T wave: earliest recognizable ECG sign of acute coronary occlusion.'
      : 'Rapid ventricular repolarization (phase 3). Normal upright morphology concordant with main QRS vector.'
  });

  return landmarks;
}
