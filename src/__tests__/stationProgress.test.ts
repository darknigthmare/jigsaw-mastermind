// @vitest-environment jsdom
import { createElement } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialStationProgress, updateStationProgress } from '../services/stationProgress';
import { StationMode } from '../views/StationMode';

const stationMessage = (type: string, fields = {}) => ({ channel: 'jigsaw-station', type, ...fields });
const stage = (value: string) => stationMessage('progress', { stage: value });
const started = (mode: 'visite' | 'defi' = 'visite') => stationMessage('started', { mode });
const mainStages = ['badge', 'relais', 'index', 'evacuation'];
const finished = (issue = 'sortie-validee') => stationMessage('finished', { issue });

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('Station plan progression', () => {
  it.each(['visite', 'defi'] as const)('requires the evacuation protocol then the terminal for all five objectives in %s mode', mode => {
    const result = [started(mode), ...mainStages.map(stage), finished()].reduce(updateStationProgress, initialStationProgress);
    expect(result).toEqual({ started: true, completed: 5, workshop: 'unvisited', mode, outcome: 'sortie-validee' });
  });

  it('records the workshop independently while preserving the main sequence', () => {
    const inspected = [started(), stage('badge'), stage('relais'), stage('registre')]
      .reduce(updateStationProgress, initialStationProgress);
    expect(inspected).toMatchObject({ completed: 2, workshop: 'registered' });
    const passed = [stage('index'), stage('evacuation'), stage('atelier')].reduce(updateStationProgress, inspected);
    expect(passed).toMatchObject({ completed: 4, workshop: 'open' });
    expect(updateStationProgress(passed, stationMessage('restarted')))
      .toEqual({ ...initialStationProgress, started: true, mode: 'visite' });
  });

  it('rejects missing or invalid modes and progress before the run starts', () => {
    for (const message of [started().channel, stationMessage('started'), stationMessage('started', { mode: 'other' }),
      stationMessage('started', { mode: null }), stationMessage('restarted', { mode: 'defi' }), stage('badge'), finished('delai-expire')]) {
      expect(updateStationProgress(initialStationProgress, message)).toBe(initialStationProgress);
    }
  });

  it('ignores duplicate and out-of-order stages, premature success and malformed messages', () => {
    const relayReady = [started(), stage('badge'), stage('relais')].reduce(updateStationProgress, initialStationProgress);
    for (const message of [stage('badge'), stage('atelier'), stage('evacuation'), stage('other'),
      { type: 'restarted' }, null, [], started('defi'), finished(), stationMessage('menu')]) {
      expect(updateStationProgress(relayReady, message)).toBe(relayReady);
    }
    const indexReady = updateStationProgress(relayReady, stage('index'));
    expect(updateStationProgress(indexReady, finished())).toBe(indexReady);
    expect(updateStationProgress(indexReady, stage('index'))).toBe(indexReady);
  });

  it.each([0, 1, 2, 3, 4])('keeps %i attained objectives after challenge expiry and freezes further events', count => {
    const progress = [started('defi'), ...mainStages.slice(0, count).map(stage)].reduce(updateStationProgress, initialStationProgress);
    const expired = updateStationProgress(progress, finished('delai-expire'));
    expect(expired).toMatchObject({ completed: count, outcome: 'delai-expire', mode: 'defi' });
    for (const message of [...mainStages.map(stage), stage('registre'), stage('atelier'), finished(), finished('delai-expire'), started('visite')]) {
      expect(updateStationProgress(expired, message)).toBe(expired);
    }
  });

  it('does not invent an expiry for the untimed visit or accept an unknown outcome', () => {
    const progress = updateStationProgress(initialStationProgress, started());
    expect(updateStationProgress(progress, finished('delai-expire'))).toBe(progress);
    expect(updateStationProgress(progress, finished('unknown'))).toBe(progress);
  });

  it('replays in the same mode with all main and optional progress reset', () => {
    const expired = [started('defi'), stage('badge'), stage('relais'), stage('registre'), finished('delai-expire')]
      .reduce(updateStationProgress, initialStationProgress);
    expect(updateStationProgress(expired, stationMessage('restarted', { mode: 'visite' }))).toBe(expired);
    for (const message of [stationMessage('restarted'), stationMessage('restarted', { mode: 'defi' })]) {
      expect(updateStationProgress(expired, message)).toEqual({ ...initialStationProgress, started: true, mode: 'defi' });
    }
  });

  it('changes mode only after a finished run returns to the menu', () => {
    const complete = [started(), ...mainStages.map(stage), finished()].reduce(updateStationProgress, initialStationProgress);
    expect(updateStationProgress(complete, stage('registre'))).toBe(complete);
    expect(updateStationProgress(complete, finished('delai-expire'))).toBe(complete);
    const menu = updateStationProgress(complete, stationMessage('menu'));
    expect(menu).toEqual(initialStationProgress);
    expect(updateStationProgress(menu, started('defi'))).toEqual({ ...initialStationProgress, started: true, mode: 'defi' });
  });
});

function mountStation() {
  render(createElement(StationMode, { onExit: vi.fn() }));
  const frame = screen.getByTitle('Station de contrôle — exploration à la première personne') as HTMLIFrameElement;
  const send = (message: unknown, source: MessageEventSource | null = frame.contentWindow, origin = window.location.origin) => {
    act(() => { window.dispatchEvent(new MessageEvent('message', { origin, source, data: message })); });
  };
  return { frame, send };
}

describe('Station iframe bridge and result presentation', () => {
  it('accepts events only from the current iframe and origin after readiness', () => {
    const { frame, send } = mountStation();
    send(started('defi'));
    send(stage('badge'));
    expect(screen.getByText('0 / 5 objectifs')).toBeTruthy();
    send(stationMessage('ready'), window);
    send(stationMessage('ready'), frame.contentWindow, 'https://wrong-origin.example');
    send(started('defi'));
    expect(screen.queryByText('Défi · 3 min')).toBeNull();
    send(stationMessage('ready'));
    send(started('defi'));
    send(stage('badge'), window);
    send(stage('badge'), frame.contentWindow, 'https://wrong-origin.example');
    expect(screen.getByText('0 / 5 objectifs')).toBeTruthy();
    send(stage('badge'));
    expect(screen.getByText('1 / 5 objectifs')).toBeTruthy();
    expect(screen.getByText('Défi · 3 min')).toBeTruthy();
  });

  it('shows expiry without adding a success objective and can reload a new traversal', () => {
    const { send } = mountStation();
    [stationMessage('ready'), started('defi'), stage('badge'), stage('relais'), stage('index'), finished('delai-expire')].forEach(message => send(message));
    expect(screen.getByRole('alert').textContent).toContain('3 / 5 objectifs atteints');
    send(stage('evacuation'));
    send(finished());
    expect(screen.getByText('3 / 5 objectifs')).toBeTruthy();
    expect(document.querySelector('[data-room="evacuation"]')?.getAttribute('data-state')).toBe('stopped');
    fireEvent.click(screen.getByRole('button', { name: 'Choisir une nouvelle traversée' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('0 / 5 objectifs')).toBeTruthy();
  });

  it('keeps the iframe ready when the native result returns to the mode menu', () => {
    const { frame, send } = mountStation();
    [stationMessage('ready'), started('defi'), finished('delai-expire'), stationMessage('menu')].forEach(message => send(message));
    expect(screen.getByText('Station prête')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByTitle(frame.title)).toBe(frame);
    send(started('visite'));
    send(stage('badge'));
    expect(screen.getByText('1 / 5 objectifs')).toBeTruthy();
    expect(screen.getByText('Visite · sans limite de temps')).toBeTruthy();
  });

  it('rejects stale messages from an old iframe after the outer restart', () => {
    const { frame, send } = mountStation();
    const previousWindow = frame.contentWindow;
    [stationMessage('ready'), started('visite'), stage('badge')].forEach(message => send(message));
    fireEvent.click(screen.getByRole('button', { name: 'Recommencer' }));
    const current = screen.getByTitle(frame.title) as HTMLIFrameElement;
    expect(current).not.toBe(frame);
    [stationMessage('ready'), started('defi'), stage('badge')].forEach(message => send(message, previousWindow));
    expect(screen.getByText('0 / 5 objectifs')).toBeTruthy();
    [stationMessage('ready'), started('visite'), stage('badge')].forEach(message => send(message, current.contentWindow));
    expect(screen.getByText('1 / 5 objectifs')).toBeTruthy();
  });

  it('shows all five objectives only after protocol and terminal events arrive in order', () => {
    const { send } = mountStation();
    [stationMessage('ready'), started(), ...mainStages.map(stage)].forEach(message => send(message));
    expect(screen.getByText('4 / 5 objectifs')).toBeTruthy();
    expect(screen.getByText('Activez le terminal de sortie du poste d’évacuation.')).toBeTruthy();
    send(finished());
    expect(screen.getByText('5 / 5 objectifs')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sortie validée' })).toBeTruthy();
  });
});
