import { describe, expect, it } from 'vitest';
import { CLINICAL_CASES, KNOWLEDGE_QUIZ } from './clinicalCases';
import { STEMI_CRITERIA_TABLE } from './clinicalCriteria';
import { CLINICAL_REFERENCES } from './references';
import { MI_TERRITORIES } from './miTerritories';
import { BASE_LEADS, getCycleLandmarks, getEcgVoltage } from '../utils/ecgGenerator';

describe('educational data structure integrity', () => {
  it('keeps case and quiz answer indexes within their option arrays', () => {
    for (const clinicalCase of CLINICAL_CASES) {
      expect(clinicalCase.questions.length, clinicalCase.id).toBeGreaterThan(0);
      for (const question of clinicalCase.questions) {
        expect(question.options.length, question.id).toBeGreaterThan(1);
        expect(Number.isInteger(question.correctIndex), question.id).toBe(true);
        expect(question.correctIndex, question.id).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex, question.id).toBeLessThan(question.options.length);
      }
    }

    for (const question of KNOWLEDGE_QUIZ) {
      expect(question.options.length, question.id).toBeGreaterThan(1);
      expect(Number.isInteger(question.correctIndex), question.id).toBe(true);
      expect(question.correctIndex, question.id).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex, question.id).toBeLessThan(question.options.length);
    }
  });

  it('points the QAS reference record to the official June 2026 procedure', () => {
    const qasReference = CLINICAL_REFERENCES.find(reference => reference.id === 'qas-ecg-2026');
    expect(qasReference?.year).toBe('June 2026');
    expect(qasReference?.url).toContain('CPP_12-Lead-ECG-acquisition-and-interpretation.pdf');
  });

  it('keeps criteria rows structurally complete without asserting clinical thresholds', () => {
    expect(STEMI_CRITERIA_TABLE.length).toBeGreaterThan(0);
    for (const row of STEMI_CRITERIA_TABLE) {
      expect(row.leads.trim()).not.toBe('');
      expect(row.patientGroup.trim()).not.toBe('');
      expect(row.thresholdMm.trim()).not.toBe('');
      expect(row.thresholdMv.trim()).not.toBe('');
      expect(row.guidelineSource.trim()).not.toBe('');
    }
  });

  it('produces finite waveform samples for configured leads and territory scenarios', () => {
    const territoryIds = Object.keys(MI_TERRITORIES);
    for (const lead of Object.keys(BASE_LEADS)) {
      for (const territoryId of territoryIds) {
        for (const timeSec of [0, 0.08, 0.16, 0.22, 0.28, 0.305, 0.335, 0.36, 0.385, 0.42, 0.485, 0.57, 0.68, 0.79]) {
          expect(Number.isFinite(getEcgVoltage(lead, timeSec, territoryId, 75)), `${lead}/${territoryId}/${timeSec}`).toBe(true);
        }
      }
    }
  });

  it('repeats the synthetic waveform at the same phase one cardiac cycle later', () => {
    for (const lead of Object.keys(BASE_LEADS)) {
      for (const territoryId of Object.keys(MI_TERRITORIES)) {
        expect(getEcgVoltage(lead, 0.42, territoryId, 75)).toBeCloseTo(
          getEcgVoltage(lead, 1.22, territoryId, 75),
          8
        );
      }
    }
  });

  it('defines every primary and reciprocal territory lead in the 17-lead model', () => {
    for (const [territoryId, territory] of Object.entries(MI_TERRITORIES)) {
      for (const lead of [...territory.primaryLeads, ...territory.reciprocalLeads]) {
        expect(BASE_LEADS[lead], `${territoryId}/${lead} base lead`).toBeDefined();
        expect(territory.waveformDeltas[lead], `${territoryId}/${lead} waveform`).toBeDefined();
      }
    }
  });

  it('keeps every displayed landmark voltage identical to the waveform generator for every lead and territory', () => {
    for (const lead of Object.keys(BASE_LEADS)) {
      for (const territoryId of Object.keys(MI_TERRITORIES)) {
        for (const landmark of getCycleLandmarks(lead, territoryId, 75)) {
          expect(landmark.voltageMv, `${territoryId}/${lead}/${landmark.code}`).toBeCloseTo(
            getEcgVoltage(lead, landmark.timeSec, territoryId, 75),
            8
          );
        }
      }
    }
  });

  it('matches every configured lead/territory J-point sample to its programmed ST level', () => {
    for (const [territoryId, territory] of Object.entries(MI_TERRITORIES)) {
      for (const [lead, delta] of Object.entries(territory.waveformDeltas)) {
        expect(getEcgVoltage(lead, 0.385, territoryId, 75), `${territoryId}/${lead}`).toBeCloseTo(
          delta.stElevationMm * 0.1,
          8
        );
      }
    }
  });

  it('matches each modeled QS trough to its configured Q-wave depth', () => {
    for (const [territoryId, territory] of Object.entries(MI_TERRITORIES)) {
      for (const [lead, delta] of Object.entries(territory.waveformDeltas)) {
        const base = BASE_LEADS[lead];
        const isQs = (delta.rAmplitudeMultiplier !== undefined && delta.rAmplitudeMultiplier <= 0.25) ||
          (delta.qWaveMm !== undefined && delta.qWaveMm >= 4 && base.rAmp < 0.5);
        if (isQs && delta.qWaveMm !== undefined) {
          const qsLandmark = getCycleLandmarks(lead, territoryId, 75).find(landmark => landmark.code === 'QS');
          expect(qsLandmark?.voltageMv, `${territoryId}/${lead}`).toBeCloseTo(-delta.qWaveMm * 0.1, 8);
        }
      }
    }
  });

  it('keeps waveform voltage continuous at every modeled phase boundary across all leads and territories', () => {
    const phaseBoundaries = [0.08, 0.19, 0.28, 0.385, 0.485, 0.57, 0.68];
    const epsilon = 1e-7;
    for (const lead of Object.keys(BASE_LEADS)) {
      for (const territoryId of Object.keys(MI_TERRITORIES)) {
        for (const boundary of phaseBoundaries) {
          const before = getEcgVoltage(lead, boundary - epsilon, territoryId, 75);
          const after = getEcgVoltage(lead, boundary + epsilon, territoryId, 75);
          expect(Math.abs(after - before), `${territoryId}/${lead}/${boundary}`).toBeLessThan(0.001);
        }
      }
    }
  });

  it('keeps all configured waveform samples within the simulator display headroom', () => {
    for (const lead of Object.keys(BASE_LEADS)) {
      for (const territoryId of Object.keys(MI_TERRITORIES)) {
        for (let sample = 0; sample <= 200; sample += 1) {
          const timeSec = sample * 0.004;
          const voltage = getEcgVoltage(lead, timeSec, territoryId, 75);
          expect(voltage, `${territoryId}/${lead}/${timeSec}`).toBeGreaterThanOrEqual(-1.6);
          expect(voltage, `${territoryId}/${lead}/${timeSec}`).toBeLessThanOrEqual(1.6);
        }
      }
    }
  });

  it('models a normal P wave shorter than 120 ms and places the PR sample inside the PR segment', () => {
    const landmarks = getCycleLandmarks('II', 'normal', 75);
    const pWave = landmarks.find(landmark => landmark.code === 'P');
    const prSegment = landmarks.find(landmark => landmark.code === 'PR Seg');
    expect(pWave?.timeSec).toBeCloseTo(0.135, 8);
    expect(prSegment?.timeSec).toBeCloseTo(0.235, 8);
    expect(getEcgVoltage('II', 0.19, 'normal', 75)).toBeCloseTo(0, 12);
    expect(getEcgVoltage('II', 0.135, 'normal', 75)).toBeGreaterThan(0);
  });

  it('labels prominent T waves according to the selected disease scenario', () => {
    const berTWave = getCycleLandmarks('V3', 'early_repolarization', 75).find(landmark => landmark.code === 'T');
    const posteriorTWave = getCycleLandmarks('V2', 'posterior', 75).find(landmark => landmark.code === 'T');
    const acuteTWave = getCycleLandmarks('V3', 'anterior', 75).find(landmark => landmark.code === 'T');
    expect(berTWave?.description).toContain('not an acute coronary occlusion marker');
    expect(posteriorTWave?.description).toContain('anterior reciprocal lead');
    expect(acuteTWave?.description).toContain('complete ECG and clinical context');
  });

  it('shows pericarditis PR displacement in all modeled diffuse ST-elevation leads and reciprocal aVR', () => {
    const depressedPrLeads = ['I', 'II', 'III', 'aVL', 'aVF', 'V2', 'V3', 'V4', 'V5', 'V6'];
    for (const lead of depressedPrLeads) {
      expect(getEcgVoltage(lead, 0.235, 'pericarditis', 75), lead).toBeCloseTo(-0.06, 8);
    }
    expect(getEcgVoltage('aVR', 0.235, 'pericarditis', 75)).toBeCloseTo(0.06, 8);
    expect(getEcgVoltage('V1', 0.235, 'pericarditis', 75)).toBe(0);
  });
});
