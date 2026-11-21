// @vitest-environment jsdom
import { createElement } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider, useApp } from '../context/AppContext';
import { ORION_CONFIRMED_KEY, isOrionConfirmed, recordOrionConfirmed } from '../services/orionMarker';
import { DERNIER_RELAIS_CAMPAIGN, getOrionDossierPiece } from '../services/dernierRelaisData';
import { StationMode } from '../views/StationMode';
import { TheatreMode } from '../views/TheatreMode';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));
vi.mock('../components/common/TheatreScene', () => ({ TheatreScene: () => null }));
vi.mock('../components/common/TapePlayer', () => ({
  TapePlayer: ({ onTogglePlay }: { onTogglePlay: (playing: boolean) => void }) => (
    <button onClick={() => onTogglePlay(false)}>Terminer l’écoute</button>
  ),
}));

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

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

function mountRelais() {
  function Harness() {
    const app = useApp();
    return app.activeSimulation
      ? <TheatreMode />
      : <button onClick={() => app.startSimulation(DERNIER_RELAIS_CAMPAIGN.id)}>Lancer Le Dernier Relais</button>;
  }
  render(<AppProvider><Harness /></AppProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'Lancer Le Dernier Relais' }));
}

describe('ORION detour: Station workshop carried into the Relais', () => {
  it('treats only the completed diagnostic as confirmed', () => {
    expect(isOrionConfirmed()).toBe(false);
    recordOrionConfirmed();
    expect(isOrionConfirmed()).toBe(true);
    for (const stale of ['registre', '{"version":1,"diagnostic":"complet"}', '']) {
      localStorage.setItem(ORION_CONFIRMED_KEY, stale);
      expect(isOrionConfirmed()).toBe(false);
    }
  });

  it('confirms nothing on the register alone and confirms on the witness', () => {
    const { send } = mountStation();
    [stationMessage('ready'), stationMessage('started', { mode: 'visite' }),
      stationMessage('progress', { stage: 'badge' }), stationMessage('progress', { stage: 'relais' }),
      stationMessage('progress', { stage: 'registre' })].forEach(send);
    expect(isOrionConfirmed()).toBe(false);
    expect(screen.getByText(/témoin à comparer/)).toBeTruthy();

    send(stationMessage('progress', { stage: 'atelier' }));
    expect(isOrionConfirmed()).toBe(true);
    expect(screen.getByText(/pièce versée au dossier du Relais/)).toBeTruthy();
  });

  it('shows the workshop as already handed over after a reload', () => {
    recordOrionConfirmed();
    render(createElement(StationMode, { onExit: vi.fn() }));
    expect(screen.getByText(/pièce versée au dossier du Relais/)).toBeTruthy();
    expect(screen.queryByText(/témoin à comparer|Après le relais/)).toBeNull();
  });

  it('points the confirmed clue at the workshop chapter without giving its answer', () => {
    const skipped = getOrionDossierPiece(false);
    expect(skipped.clue).toBeNull();
    expect(skipped.body).toContain('détour');
    const confirmed = getOrionDossierPiece(true);
    expect(confirmed.clue?.testId).toBe(DERNIER_RELAIS_CAMPAIGN.testIds[1]);
    expect(confirmed.clue?.text).not.toContain('C-2');
  });

  it('shows the confirmed piece and its free clue in the workshop chapter', () => {
    recordOrionConfirmed();
    mountRelais();
    expect(screen.getByText('Repère ORION — confirmé à la station')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.change(screen.getByLabelText('Date de calibration'), { target: { value: '2028-10-10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider la réponse' }));
    fireEvent.click(screen.getByRole('button', { name: /^Joindre le bordereau/ }));

    fireEvent.click(screen.getByRole('button', { name: /ACCESS DECRYPTION MEMORIES \(3 AVAILABLE\)/ }));
    expect(screen.getByText(/Repère ORION confirmé à la station :/)).toBeTruthy();
  });

  it('explains the missing piece and adds no clue when the detour was skipped', () => {
    mountRelais();
    expect(screen.getByText('Repère ORION — absent du dossier')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.click(screen.getByRole('button', { name: /ACCESS DECRYPTION MEMORIES \(2 AVAILABLE\)/ }));
    expect(screen.queryByText(/Dossier entry — station ORION/i)).toBeNull();
  });
});
