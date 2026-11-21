// @vitest-environment jsdom
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactNode } from 'react';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from '../services/db';
import { AppProvider, useApp } from '../context/AppContext';
import { TheatreScene } from '../components/common/TheatreScene';
import { PRELOADED_CAMPAIGNS } from '../services/preloadedData';
import { DERNIER_RELAIS_CONTENT_ID, DERNIER_RELAIS_TESTS } from '../services/dernierRelaisData';
import { UNE_DE_MINUIT_CONTENT_ID } from '../services/laUneDeMinuitData';
import {
  ROSTER_CAMPAIGN, ROSTER_CHARACTERS, ROSTER_CONTENT_ID, ROSTER_TESTS, getRosterEnding,
} from '../services/rosterData';
import { INITIAL_MORAL_SCORES } from '../services/moralEngine';
import { getPuzzleControl, isPuzzleAnswerCorrect } from '../services/simulationRules';
import { checkTextSafety } from '../services/safety';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

const decision = (choiceId: string) => ({
  testId: 'saved-stage', choiceId, choiceText: choiceId, timestamp: '', scoresAfter: INITIAL_MORAL_SCORES,
});

function seedRoster() {
  localStorage.setItem(db.CONTENT_INSTALLATIONS_KEY, JSON.stringify([
    DERNIER_RELAIS_CONTENT_ID, UNE_DE_MINUIT_CONTENT_ID, ROSTER_CONTENT_ID,
  ]));
  db.saveCampaigns([ROSTER_CAMPAIGN]);
  db.saveCharacters(ROSTER_CHARACTERS);
  db.saveTests(ROSTER_TESTS);
  db.saveTimeline([]);
  db.saveRuns([]);
}

beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); localStorage.clear(); });

describe('Le Roster: additive delivery', () => {
  it('adds the ten-room campaign, its five dossiers and its chapters to an existing library once', () => {
    localStorage.setItem(db.CONTENT_INSTALLATIONS_KEY, JSON.stringify([DERNIER_RELAIS_CONTENT_ID, UNE_DE_MINUIT_CONTENT_ID]));
    db.saveCampaigns([PRELOADED_CAMPAIGNS[0]]);
    db.saveCharacters([]);
    db.saveTests([DERNIER_RELAIS_TESTS[0]]);
    db.saveTimeline([]);
    db.saveRuns([]);

    db.initializeDB();
    expect(db.getCampaigns().map(campaign => campaign.id)).toEqual([PRELOADED_CAMPAIGNS[0].id, ROSTER_CAMPAIGN.id]);
    expect(db.getTests()).toEqual([DERNIER_RELAIS_TESTS[0], ...ROSTER_TESTS]);
    expect(db.getCharacters()).toEqual(ROSTER_CHARACTERS);
    expect(JSON.parse(localStorage.getItem(db.CONTENT_INSTALLATIONS_KEY)!))
      .toEqual([DERNIER_RELAIS_CONTENT_ID, UNE_DE_MINUIT_CONTENT_ID, ROSTER_CONTENT_ID]);

    db.saveCampaigns([{ ...ROSTER_CAMPAIGN, title: 'Mon roster réécrit' }]);
    db.initializeDB();
    expect(db.getCampaigns()).toHaveLength(1);
    expect(db.getCampaigns()[0].title).toBe('Mon roster réécrit');
  });

  it('keeps every authored text inside the fan-game safety layer', () => {
    for (const test of ROSTER_TESTS) {
      const texts = [
        test.title, test.openingTape, test.rules, test.puzzleData.question ?? '', test.safetyNote,
        test.sourceNote ?? '', ...test.clues,
        ...test.choices.flatMap(choice => [choice.text, choice.narrativeImpact]),
        ...(test.puzzleData.confessionOptions ?? []).map(option => option.text),
      ];
      for (const text of texts) {
        expect(checkTextSafety(text), test.id).toMatchObject({ isSafe: true });
      }
    }
  });

  it('names a documented film reference and the limits of each transposition', () => {
    const films = ['Saw (2004)', 'Saw II (2005)', 'Saw III (2006)', 'Saw IV (2007)', 'Saw V (2008)',
      'Saw VI (2009)', 'Saw VII (2010)', 'Jigsaw (2017)', 'Spiral (2021)', 'Saw X (2023)'];
    for (const [index, test] of ROSTER_TESTS.entries()) {
      expect(test.sourceNote).toContain(films[index]);
      expect(test.sourceNote).toContain('Non reproduits');
      expect(test.safetyNote).toContain('Fiction originale');
    }
  });
});

describe('Le Roster: playable rooms', () => {
  it('uses the authored control for each room and accepts only its answer', () => {
    const kinds = ['coordinates', 'answer', 'answer', 'date', 'answer', 'coordinates', 'confession', 'answer', 'confession', 'answer'];
    for (const [index, test] of ROSTER_TESTS.entries()) {
      expect(getPuzzleControl(test).kind, test.id).toBe(kinds[index]);
      expect(isPuzzleAnswerCorrect(test, test.puzzleData.correctAnswer!), test.id).toBe(true);
      expect(isPuzzleAnswerCorrect(test, '0'), test.id).toBe(false);
    }
    expect(new Date('2031-02-24T00:00:00Z').getUTCDay()).toBe(1);
    expect(540 / 30).toBe(18);
    expect((12 - (-3)) * 3).toBe(45);
    expect(1080 / 15).toBe(72);
    expect((432 - 3 * 9 * 12) / 12).toBe(9);
    expect(9 * 4).toBe(36);
  });

  it('gives each of the ten rooms its own illustration and fidelity note', () => {
    const rooms = [
      ['La salle carrelée', 'roster-01-bain.jpg'], ['La maison scellée', 'roster-02-maison.jpg'],
      ['La chambre froide', 'roster-03-congelateur.jpg'], ['Le mausolée', 'roster-04-mausolee.jpg'],
      ['La chambre des pompes', 'roster-05-cube.jpg'], ['Le manège', 'roster-06-manege.jpg'],
      ['La galerie publique', 'roster-07-cage.jpg'], ['Le silo à grains', 'roster-08-silo.jpg'],
      ['Le local de maintenance', 'roster-09-metro.jpg'], ['La dernière salle', 'roster-10-machine.jpg'],
    ] as const;
    for (const [index, [room, image]] of rooms.entries()) {
      const { unmount } = render(
        <TheatreScene campaign={ROSTER_CAMPAIGN} tests={ROSTER_TESTS} currentTestIndex={index}
          completedTestIds={[]} isFinished={false} isPlayingTape={false} isPuzzleActive />,
      );
      expect(screen.getByRole('heading', { level: 1, name: room })).toBeTruthy();
      expect(screen.getByRole('img').getAttribute('src')).toContain(image);
      expect(screen.getAllByRole('button', { name: /^Examiner / })).toHaveLength(4);
      expect(screen.getByText(/Référence documentaire/)).toBeTruthy();
      expect(existsSync(join(process.cwd(), 'public/theatre', image)), image).toBe(true);
      unmount();
    }
  });

  it('plays the ten rooms through the real state machine and records the roster ending', () => {
    seedRoster();
    const { result } = renderHook(() => useApp(), {
      wrapper: ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>,
    });
    act(() => result.current.startSimulation(ROSTER_CAMPAIGN.id));
    for (const id of ROSTER_CAMPAIGN.testIds) {
      const simulation = result.current.activeSimulation!;
      const test = simulation.tests[simulation.currentTestIndex];
      expect(test.id).toBe(id);
      act(() => result.current.submitPuzzleAnswer(test.puzzleData.correctAnswer!));
      expect(result.current.activeSimulation?.isPuzzleSolved, id).toBe(true);
      act(() => result.current.submitChoice(test.choices[0].id));
    }
    expect(result.current.activeSimulation?.isFinished).toBe(true);
    expect(result.current.activeSimulation?.ending?.type).toBe('Le Roster — Registre');
    const run = db.getRuns()[0];
    expect(run.campaignId).toBe(ROSTER_CAMPAIGN.id);
    expect(run.decisions).toHaveLength(10);
    expect(run.endingType).toBe('Le Roster — Registre');
  });

  it('keeps three authored outcomes behind the last room and leaves edited choices to the engine', () => {
    const read = (lucid: number) => [
      ...Array.from({ length: Math.max(0, lucid - 1) }, () => decision('choice-roster-06-partager')),
      ...Array.from({ length: 9 - Math.max(0, lucid - 1) }, () => decision('choice-roster-06-garder')),
      decision('choice-roster-10-partager'),
    ];
    expect(getRosterEnding(ROSTER_CAMPAIGN.id, read(8))?.type).toBe('Le Roster — Registre');
    expect(getRosterEnding(ROSTER_CAMPAIGN.id, read(8))?.title).toBe('Les dix salles ont un témoin');
    expect(getRosterEnding(ROSTER_CAMPAIGN.id, read(4))?.type).toBe('Le Roster — Réserve');
    expect(getRosterEnding(ROSTER_CAMPAIGN.id, [decision('choice-roster-06-garder'), decision('choice-roster-10-garder')])?.type).toBe('Le Roster — Impasse');
    expect(getRosterEnding(ROSTER_CAMPAIGN.id, [decision('edited-final-choice')])).toBeUndefined();
    expect(getRosterEnding('camp-saw-i', [decision('choice-roster-10-partager')])).toBeUndefined();
  });
});
