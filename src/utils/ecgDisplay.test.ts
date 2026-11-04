import { describe, expect, it } from 'vitest';
import {
  getEcgBaselineY,
  getEcgRecordingEndX,
  getEcgSweepX,
  getUnifiedEcgSmallBox,
  getWaveformVisualState,
  RHYTHM_STRIP_LEAD_IN_MM
} from './ecgDisplay';

describe('ECG display geometry', () => {
  it('ends responsive lead traces on whole cycles to preserve phase continuity at wrap', () => {
    expect(getEcgRecordingEndX(240, 4)).toBe(240);
    expect(getEcgRecordingEndX(240, 4, RHYTHM_STRIP_LEAD_IN_MM)).toBe(240);
    expect(getEcgRecordingEndX(350, 5)).toBe(300);
    expect(getEcgRecordingEndX(350, 5, RHYTHM_STRIP_LEAD_IN_MM)).toBe(300);
  });

  it('starts the rhythm-strip sweep after the calibration pulse and connector', () => {
    const smallBox = 5;
    const width = 300;
    const startX = RHYTHM_STRIP_LEAD_IN_MM * smallBox;
    expect(getEcgSweepX(0, smallBox, width, RHYTHM_STRIP_LEAD_IN_MM)).toBe(startX);
    expect(getEcgSweepX(1, smallBox, width, RHYTHM_STRIP_LEAD_IN_MM)).toBe(startX + 25 * smallBox);
  });

  it('wraps the rhythm-strip sweep at the end of the recorded ECG, not across the calibration pulse', () => {
    const smallBox = 5;
    const width = 300;
    const startX = RHYTHM_STRIP_LEAD_IN_MM * smallBox;
    const recordingWidth = width - startX;
    const recordingDuration = recordingWidth / (25 * smallBox);
    expect(getEcgSweepX(recordingDuration, smallBox, width, RHYTHM_STRIP_LEAD_IN_MM)).toBeCloseTo(startX, 8);
  });

  it('keeps standard-lead sweep timing at 25 mm/s from the left edge', () => {
    expect(getEcgSweepX(0, 5, 300)).toBe(0);
    expect(getEcgSweepX(1, 5, 300)).toBe(125);
  });

  it('uses distinct visual states for ischemic elevation, ST-elevation mimics and reciprocal depression', () => {
    expect(getWaveformVisualState('anterior', 4.5, true, false)).toBe('ischemic-elevation');
    expect(getWaveformVisualState('pericarditis', 2, true, false)).toBe('mimic-elevation');
    expect(getWaveformVisualState('early_repolarization', 2, true, false)).toBe('mimic-elevation');
    expect(getWaveformVisualState('inferior', -1.5, false, true)).toBe('reciprocal-depression');
    expect(getWaveformVisualState('normal', undefined, false, false)).toBe('baseline');
  });

  it('preserves shared gain and vertical headroom on standard canvas heights', () => {
    for (const height of [192, 208]) {
      const smallBox = getUnifiedEcgSmallBox(5.6, height);
      const baseline = getEcgBaselineY(height, smallBox);
      expect(baseline).toBeGreaterThanOrEqual(1.6 * smallBox * 10 + 4 - smallBox / 2);
      expect(height - baseline).toBeGreaterThanOrEqual(1.6 * smallBox * 10 + 4 - smallBox / 2);
    }
  });
});
