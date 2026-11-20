import { describe, expect, it } from 'vitest';
import { initialStationProgress, updateStationProgress } from '../services/stationProgress';

const stationMessage = (type: string, fields = {}) => ({ channel: 'jigsaw-station', type, ...fields });
const stage = (value: string) => stationMessage('progress', { stage: value });

describe('Station plan progression', () => {
  it('tracks the complete main route without any workshop events', () => {
    const result = [
      stationMessage('started'), stage('badge'), stage('relais'), stage('index'),
      stationMessage('finished', { issue: 'sortie-validee' }),
    ].reduce(updateStationProgress, initialStationProgress);
    expect(result).toEqual({ started: true, completed: 4, workshop: 'unvisited' });
  });

  it('records the optional branch independently before or after restoring the index', () => {
    const inspected = [stationMessage('started'), stage('badge'), stage('relais'), stage('registre')]
      .reduce(updateStationProgress, initialStationProgress);
    expect(inspected).toEqual({ started: true, completed: 2, workshop: 'registered' });

    const passed = [stage('index'), stage('atelier')].reduce(updateStationProgress, inspected);
    expect(passed).toEqual({ started: true, completed: 3, workshop: 'open' });
    expect(updateStationProgress(passed, stationMessage('restarted'))).toEqual({ ...initialStationProgress, started: true });
  });

  it('ignores incomplete, old and out of order progress events', () => {
    expect(updateStationProgress(initialStationProgress, stage('badge'))).toBe(initialStationProgress);
    const started = updateStationProgress(initialStationProgress, stationMessage('started'));
    const relayReady = [stage('badge'), stage('relais')].reduce(updateStationProgress, started);
    for (const invalid of [stage('badge'), stage('atelier'), stage('other'), { type: 'restarted' }, null, [], stationMessage('finished', { issue: 'sortie-validee' })]) {
      expect(updateStationProgress(relayReady, invalid)).toBe(relayReady);
    }
  });
});
