import { describe, expect, it } from 'vitest';
import { CLINICAL_CASES, KNOWLEDGE_QUIZ } from './clinicalCases';
import { STEMI_CRITERIA_TABLE } from './clinicalCriteria';
import { CLINICAL_REFERENCES } from './references';
import { MI_TERRITORIES } from './miTerritories';
import { BASE_LEADS, getEcgVoltage } from '../utils/ecgGenerator';

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
      for (const territoryId of ['normal', 'inferior', 'anterior', 'posterior']) {
        expect(getEcgVoltage(lead, 0.42, territoryId, 75)).toBeCloseTo(
          getEcgVoltage(lead, 1.22, territoryId, 75),
          8
        );
      }
    }
  });
});
