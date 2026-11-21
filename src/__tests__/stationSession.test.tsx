// @vitest-environment jsdom
import { createElement } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initialStationProgress, updateStationProgress } from '../services/stationProgress';
import {
  STATION_SESSION_KEY, readStationSession, saveStationSession, toStationSession, type StationSession,
} from '../services/stationSession';
import { StationMode } from '../views/StationMode';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

const stationMessage = (type: string, fields = {}) => ({ channel: 'jigsaw-station', type, ...fields });

function mountStation() {
  render(createElement(StationMode, { onExit: vi.fn() }));
  const frame = screen.getByTitle('Station de contrôle — exploration à la première personne') as HTMLIFrameElement;
  const send = (message: unknown) => {
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        origin: window.location.origin, source: frame.contentWindow, data: message,
      }));
    });
  };
  return { send };
}

const report = (overrides: Partial<StationSession> = {}): StationSession => ({
  version: 1, status: 'en-cours', mode: 'visite', completed: 2,
  recordedAt: '2026-11-21T17:05:00.000Z', ...overrides,
});

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

describe('Station run report', () => {
  it('keeps a report only for a started run', () => {
    expect(toStationSession(initialStationProgress)).toBeNull();
    let progress = updateStationProgress(initialStationProgress, stationMessage('started', { mode: 'defi' }));
    progress = updateStationProgress(progress, stationMessage('progress', { stage: 'badge' }));
    const saved = toStationSession(progress, '2026-11-21T17:05:00.000Z');
    expect(saved).toEqual(report({ mode: 'defi', completed: 1 }));
    saveStationSession(saved!);
    expect(readStationSession()).toEqual(saved);
  });

  it('ignores a corrupt, invalid or outdated report', () => {
    const entries = [
      '{', 'null', '[]', '{"version":1}',
      JSON.stringify(report({ version: 2 } as unknown as Partial<StationSession>)),
      JSON.stringify(report({ completed: 9 as StationSession['completed'] })),
      JSON.stringify(report({ mode: 'exploration' as StationSession['mode'] })),
      JSON.stringify(report({ status: 'sortie-validee', completed: 3 })),
      JSON.stringify(report({ recordedAt: 'hier' })),
    ];
    for (const raw of entries) {
      localStorage.setItem(STATION_SESSION_KEY, raw);
      expect(readStationSession()).toBeNull();
    }
  });

  it('still opens when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(readStationSession()).toBeNull();
    expect(() => saveStationSession(report())).not.toThrow();
    mountStation();
    expect(screen.getByRole('heading', { name: 'Station de contrôle' })).toBeTruthy();
    expect(screen.queryByText('DERNIÈRE TRAVERSÉE')).toBeNull();
  });

  it('announces an interrupted crossing after a reload and keeps the ORION piece', () => {
    const { send } = mountStation();
    [stationMessage('ready'), stationMessage('started', { mode: 'visite' }),
      stationMessage('progress', { stage: 'badge' }), stationMessage('progress', { stage: 'relais' }),
      stationMessage('progress', { stage: 'registre' }), stationMessage('progress', { stage: 'atelier' }),
      stationMessage('progress', { stage: 'index' })].forEach(send);
    cleanup();

    render(createElement(StationMode, { onExit: vi.fn() }));
    expect(screen.getByRole('heading', { name: 'Traversée interrompue' })).toBeTruthy();
    expect(screen.getByText(/Visite · 3 \/ 5 objectifs/)).toBeTruthy();
    expect(screen.getByText(/pièce versée au dossier du Relais/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Nouvelle traversée' })).toBeTruthy();
  });

  it('keeps a completed report and clears it on an explicit new crossing', () => {
    const { send } = mountStation();
    [stationMessage('ready'), stationMessage('started', { mode: 'visite' }),
      stationMessage('progress', { stage: 'badge' }), stationMessage('progress', { stage: 'relais' }),
      stationMessage('progress', { stage: 'index' }), stationMessage('progress', { stage: 'evacuation' }),
      stationMessage('finished', { issue: 'sortie-validee' })].forEach(send);
    cleanup();

    render(createElement(StationMode, { onExit: vi.fn() }));
    expect(screen.getByRole('heading', { name: 'Sortie validée' })).toBeTruthy();
    expect(screen.getByText(/5 \/ 5 objectifs/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Nouvelle traversée' }));
    expect(screen.queryByRole('heading', { name: 'Sortie validée' })).toBeNull();
    expect(localStorage.getItem(STATION_SESSION_KEY)).toBeNull();
  });
});
