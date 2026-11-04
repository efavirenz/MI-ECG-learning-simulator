/** Display geometry helpers shared by the animated ECG canvases. */
export const ECG_PAPER_SPEED_MM_PER_SEC = 25;
export const RHYTHM_STRIP_LEAD_IN_MM = 20;

export type WaveformVisualState = 'ischemic-elevation' | 'mimic-elevation' | 'reciprocal-depression' | 'baseline';

/** Keep ST-elevation mimics visually distinct from ischemic territory waveforms. */
export function getWaveformVisualState(
  territoryId: string,
  stElevationMm: number | undefined,
  isPrimary: boolean,
  isReciprocal: boolean
): WaveformVisualState {
  const isMimic = territoryId === 'pericarditis' || territoryId === 'early_repolarization';
  if (stElevationMm !== undefined && stElevationMm > 0) return isMimic ? 'mimic-elevation' : 'ischemic-elevation';
  if ((stElevationMm !== undefined && stElevationMm < 0) || isReciprocal) return 'reciprocal-depression';
  if (isPrimary && territoryId !== 'normal') return isMimic ? 'mimic-elevation' : 'ischemic-elevation';
  return 'baseline';
}

/**
 * Returns a common pixel/mm gain that preserves at least 1.6 mV headroom
 * above and below the baseline on the simulator's fixed-height lead canvases.
 */
export function getUnifiedEcgSmallBox(unifiedWidthScale: number, canvasHeightPx: number): number {
  const verticalScaleLimit = Math.max(3, (canvasHeightPx / 2 - 4) / 16.5);
  return Math.min(unifiedWidthScale, verticalScaleLimit);
}

/** Align the isoelectric baseline to the nearest minor grid line near vertical centre. */
export function getEcgBaselineY(canvasHeightPx: number, smallBoxPx: number): number {
  return Math.round((canvasHeightPx / 2) / smallBoxPx) * smallBoxPx;
}

/** End the visible trace on a whole reference cardiac cycle to avoid a phase jump at wrap. */
export function getEcgRecordingEndX(canvasWidthPx: number, smallBoxPx: number, leadInMm = 0): number {
  const startX = Math.min(Math.max(0, leadInMm * smallBoxPx), Math.max(0, canvasWidthPx - 1));
  const cycleWidthPx = 0.8 * ECG_PAPER_SPEED_MM_PER_SEC * smallBoxPx;
  const completeCycles = Math.floor((canvasWidthPx - startX) / cycleWidthPx);
  if (completeCycles < 1) return canvasWidthPx;
  return startX + completeCycles * cycleWidthPx;
}

/**
 * Sweep at 25 mm/s. A rhythm strip begins after its calibration pulse and connector.
 * Each trace wraps only after a whole number of reference cycles, avoiding an ECG phase jump.
 */
export function getEcgSweepX(
  elapsedSec: number,
  smallBoxPx: number,
  canvasWidthPx: number,
  leadInMm = 0
): number {
  const startX = Math.min(Math.max(0, leadInMm * smallBoxPx), Math.max(0, canvasWidthPx - 1));
  const endX = getEcgRecordingEndX(canvasWidthPx, smallBoxPx, leadInMm);
  const spanPx = Math.max(1, endX - startX);
  const elapsedPx = Math.max(0, elapsedSec) * ECG_PAPER_SPEED_MM_PER_SEC * smallBoxPx;
  return startX + (elapsedPx % spanPx);
}
