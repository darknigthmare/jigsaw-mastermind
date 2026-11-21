// @vitest-environment jsdom
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from '../services/db';
import { AppProvider, useApp } from '../context/AppContext';
import { TheatreMode } from '../views/TheatreMode';
import { PRELOADED_CAMPAIGNS } from '../services/preloadedData';
import { DERNIER_RELAIS_CAMPAIGN, DERNIER_RELAIS_CONTENT_ID, DERNIER_RELAIS_TESTS } from '../services/dernierRelaisData';
import {
  UNE_DE_MINUIT_CAMPAIGN, UNE_DE_MINUIT_CHARACTERS, UNE_DE_MINUIT_CONTENT_ID, UNE_DE_MINUIT_TESTS, getUneDeMinuitEnding,
} from '../services/laUneDeMinuitData';
import { ROSTER_CONTENT_ID } from '../services/rosterData';
import { INITIAL_MORAL_SCORES } from '../services/moralEngine';
import { getPuzzleControl, isPuzzleAnswerCorrect } from '../services/simulationRules';
import { checkTextSafety } from '../services/safety';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));
vi.mock('../components/common/TheatreScene', async importOriginal => {
  const actual = await importOriginal<typeof import('../components/common/TheatreScene')>();
  return { ...actual, TheatreScene: () => null };
});
vi.mock('../components/common/TapePlayer', () => ({
  TapePlayer: ({ onTogglePlay }: { onTogglePlay: (playing: boolean) => void }) => (
    <button onClick={() => onTogglePlay(false)}>Terminer l’écoute</button>
  ),
}));

const decision = (choiceId: string) => ({
  testId: 'saved-stage', choiceId, choiceText: choiceId, timestamp: '', scoresAfter: INITIAL_MORAL_SCORES,
});

function Harness() {
  const app = useApp();
  return app.activeSimulation
    ? <TheatreMode />
    : <button onClick={() => app.startSimulation(UNE_DE_MINUIT_CAMPAIGN.id)}>Lancer La Une de minuit</button>;
}

beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); localStorage.clear(); });

describe('La Une de minuit: additive delivery', () => {
  it('adds the campaign, its dossiers and its chapters to an existing library once', () => {
    localStorage.setItem(db.CONTENT_INSTALLATIONS_KEY, JSON.stringify([DERNIER_RELAIS_CONTENT_ID, ROSTER_CONTENT_ID]));
    db.saveCampaigns([PRELOADED_CAMPAIGNS[0]]);
    db.saveCharacters([]);
    db.saveTests([DERNIER_RELAIS_TESTS[0]]);
    db.saveTimeline([]);
    db.saveRuns([]);

    db.initializeDB();
    expect(db.getCampaigns().map(campaign => campaign.id)).toEqual([
      PRELOADED_CAMPAIGNS[0].id, UNE_DE_MINUIT_CAMPAIGN.id,
    ]);
    expect(db.getTests()).toEqual([DERNIER_RELAIS_TESTS[0], ...UNE_DE_MINUIT_TESTS]);
    expect(db.getCharacters()).toEqual(UNE_DE_MINUIT_CHARACTERS);
    expect(JSON.parse(localStorage.getItem(db.CONTENT_INSTALLATIONS_KEY)!))
      .toEqual([DERNIER_RELAIS_CONTENT_ID, ROSTER_CONTENT_ID, UNE_DE_MINUIT_CONTENT_ID]);

    db.saveCampaigns([{ ...UNE_DE_MINUIT_CAMPAIGN, title: 'Ma une réécrite' }]);
    db.initializeDB();
    expect(db.getCampaigns()).toHaveLength(1);
    expect(db.getCampaigns()[0].title).toBe('Ma une réécrite');
  });

  it('keeps every authored text inside the fan-game safety layer', () => {
    for (const test of UNE_DE_MINUIT_TESTS) {
      for (const text of [test.title, test.openingTape, test.rules, test.puzzleData.question ?? '', test.safetyNote]) {
        expect(checkTextSafety(text), test.id).toMatchObject({ isSafe: true });
      }
    }
  });
});

describe('La Une de minuit: authored route', () => {
  it('uses a real calendar, a unique register mention and a render delay', () => {
    expect(new Date('2029-03-08T00:00:00Z').getUTCDay()).toBe(4);
    expect(getPuzzleControl(UNE_DE_MINUIT_TESTS[0]).kind).toBe('date');
    expect(getPuzzleControl(UNE_DE_MINUIT_TESTS[1]).kind).toBe('confession');
    expect(getPuzzleControl(UNE_DE_MINUIT_TESTS[2]).kind).toBe('answer');

    expect(isPuzzleAnswerCorrect(UNE_DE_MINUIT_TESTS[0], '2029-03-08')).toBe(true);
    expect(isPuzzleAnswerCorrect(UNE_DE_MINUIT_TESTS[0], '2029-03-05')).toBe(false);
    expect(isPuzzleAnswerCorrect(UNE_DE_MINUIT_TESTS[1], 'B-2')).toBe(true);
    expect(isPuzzleAnswerCorrect(UNE_DE_MINUIT_TESTS[1], 'A-1')).toBe(false);
    expect(isPuzzleAnswerCorrect(UNE_DE_MINUIT_TESTS[2], '60')).toBe(true);
    expect(isPuzzleAnswerCorrect(UNE_DE_MINUIT_TESTS[2], '40')).toBe(false);

    expect(12 * 40 - 3 * 25).toBe(405);
    expect(25 + 15 + 20).toBe(60);
  });

  it('keeps three authored endings behind the final choice and leaves edited choices to the generic engine', () => {
    const best = getUneDeMinuitEnding(UNE_DE_MINUIT_CAMPAIGN.id, [
      decision('choice-une-minuit-joindre'), decision('choice-une-minuit-mention'), decision('choice-une-minuit-publier'),
    ]);
    expect(best?.type).toBe('La Une de minuit — Provenance');
    expect(best?.title).toBe('La une porte les deux noms');

    const protectedSource = getUneDeMinuitEnding(UNE_DE_MINUIT_CAMPAIGN.id, [
      decision('choice-une-minuit-joindre'), decision('choice-une-minuit-mention'), decision('choice-une-minuit-proteger'),
    ]);
    expect(protectedSource?.type).toBe('La Une de minuit — Provenance');

    const reserve = getUneDeMinuitEnding(UNE_DE_MINUIT_CAMPAIGN.id, [
      decision('choice-une-minuit-noter'), decision('choice-une-minuit-chiffre'), decision('choice-une-minuit-proteger'),
    ]);
    expect(reserve?.type).toBe('La Une de minuit — Réserve');
    expect(reserve?.title).toBe('La correction reste sous réserve');

    const sealed = getUneDeMinuitEnding(UNE_DE_MINUIT_CAMPAIGN.id, [
      decision('choice-une-minuit-joindre'), decision('choice-une-minuit-mention'), decision('choice-une-minuit-boucler'),
    ]);
    expect(sealed?.type).toBe('La Une de minuit — Bouclage');
    expect(sealed?.title).toBe('La une sans témoin');

    expect(getUneDeMinuitEnding(UNE_DE_MINUIT_CAMPAIGN.id, [decision('edited-final-choice')])).toBeUndefined();
    expect(getUneDeMinuitEnding(DERNIER_RELAIS_CAMPAIGN.id, [decision('choice-une-minuit-boucler')])).toBeUndefined();
  });

  it('gives each chapter its own illustrated room', async () => {
    const { TheatreScene: RealTheatreScene } = await vi.importActual<typeof import('../components/common/TheatreScene')>('../components/common/TheatreScene');
    const rooms = [
      ['L’atelier de composition', 'une-de-minuit-composition.jpg'],
      ['La salle de la rotative', 'une-de-minuit-rotative.jpg'],
      ['Le bureau de la une', 'une-de-minuit-bureau.jpg'],
    ] as const;
    for (const [index, [room, image]] of rooms.entries()) {
      const { unmount } = render(
        <RealTheatreScene campaign={UNE_DE_MINUIT_CAMPAIGN} tests={UNE_DE_MINUIT_TESTS} currentTestIndex={index}
          completedTestIds={[]} isFinished={false} isPlayingTape={false} isPuzzleActive />,
      );
      expect(screen.getByRole('heading', { level: 1, name: room })).toBeTruthy();
      expect(screen.getByRole('img').getAttribute('src')).toContain(image);
      expect(screen.getAllByRole('button', { name: /^Examiner / })).toHaveLength(4);
      expect(existsSync(join(process.cwd(), 'public/theatre', image)), image).toBe(true);
      unmount();
    }
  });

  it('plays the whole route through the real consoles and records the authored ending', () => {
    render(<AppProvider><Harness /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Lancer La Une de minuit' }));

    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.change(screen.getByLabelText('Date de calibration'), { target: { value: '2029-03-08' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider la réponse' }));
    fireEvent.click(screen.getByRole('button', { name: /^Joindre le bon de tirage/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.click(screen.getByRole('button', { name: /B-2/ }));
    fireEvent.click(screen.getByRole('button', { name: 'TRANSMIT CONFESSION DATA' }));
    fireEvent.click(screen.getByRole('button', { name: /^Inscrire la mention exacte/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.change(screen.getByLabelText('Réponse à l’énigme'), { target: { value: '60' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider la réponse' }));
    fireEvent.click(screen.getByRole('button', { name: /^Publier la correction avec les deux noms/ }));

    expect(screen.getByText('La une porte les deux noms')).toBeTruthy();
    const run = db.getRuns()[0];
    expect(run.campaignId).toBe(UNE_DE_MINUIT_CAMPAIGN.id);
    expect(run.decisions).toHaveLength(3);
    expect(run.endingType).toBe('La Une de minuit — Provenance');
    expect(run.report).toContain('01 — Le bon de tirage');
    expect(run.report).toContain('03 — La dernière une');
    expect(db.getCampaigns().find(campaign => campaign.id === UNE_DE_MINUIT_CAMPAIGN.id)?.status).toBe('simulated');
  });
});
