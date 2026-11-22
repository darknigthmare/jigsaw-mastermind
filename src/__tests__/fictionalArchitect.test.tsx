// @vitest-environment jsdom
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from '../services/db';
import { TheatreScene } from '../components/common/TheatreScene';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { FICTIONAL_ARCHITECT_TEST_IDS, FICTIONAL_ARCHITECT_TESTS } from '../services/fictionalArchitectData';
import { getPuzzleControl, isPuzzleAnswerCorrect, resolveCampaignTests } from '../services/simulationRules';
import { checkTextSafety } from '../services/safety';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

describe('the Gideon campaign: the fifth and last migration pass', () => {
  it('replaces the three fictional entries without changing their ids', () => {
    expect(FICTIONAL_ARCHITECT_TESTS.map(test => test.id)).toEqual([...FICTIONAL_ARCHITECT_TEST_IDS]);
    for (const id of FICTIONAL_ARCHITECT_TEST_IDS) {
      const inLibrary = PRELOADED_TESTS.find(test => test.id === id);
      expect(inLibrary?.id).toBe(id);
      expect(inLibrary?.title).toMatch(/^\d{2} — /);
      expect(inLibrary?.sourceNote).toContain('Non reproduits');
      expect(inLibrary?.safetyNote).toContain('Fiction originale');
    }
    for (const title of ['The Ledger Calibration', 'The Reflection of Deceit', 'The Balance of Ledger']) {
      expect(PRELOADED_TESTS.some(test => test.title === title), title).toBe(false);
    }
  });

  it('keeps every rewritten text inside the fan-game safety layer', () => {
    for (const test of FICTIONAL_ARCHITECT_TESTS) {
      const texts = [
        test.title, test.openingTape, test.rules, test.puzzleData.question ?? '', test.safetyNote,
        test.sourceNote ?? '', ...test.clues,
        ...test.choices.flatMap(choice => [choice.text, choice.narrativeImpact]),
        ...(test.puzzleData.confessionOptions ?? []).map(option => option.text),
      ];
      for (const text of texts) expect(checkTextSafety(text), test.id).toMatchObject({ isSafe: true });
    }
  });

  it('keeps the campaign route complete and each room on a real control', () => {
    const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === 'camp-fictional-architect')!;
    const resolved = resolveCampaignTests(campaign, PRELOADED_TESTS);
    expect(resolved.map(test => test.id)).toEqual(campaign.testIds);

    const kinds: Record<string, string> = {
      'test-ledger-room-1': 'date', 'test-glass-confession-1': 'confession', 'test-quiet-scale-1': 'scale',
    };
    for (const test of FICTIONAL_ARCHITECT_TESTS) {
      expect(getPuzzleControl(test).kind, test.id).toBe(kinds[test.id]);
    }
    const ledger = FICTIONAL_ARCHITECT_TESTS[0];
    expect(isPuzzleAnswerCorrect(ledger, '2024-03-22')).toBe(true);
    expect(isPuzzleAnswerCorrect(ledger, '2024-04-12')).toBe(false);
    const mirrors = FICTIONAL_ARCHITECT_TESTS[1];
    expect(isPuzzleAnswerCorrect(mirrors, 'B-2')).toBe(true);
    expect(isPuzzleAnswerCorrect(mirrors, 'A-1')).toBe(false);
    const balance = FICTIONAL_ARCHITECT_TESTS[2];
    expect(isPuzzleAnswerCorrect(balance, '180000')).toBe(true);
    expect(isPuzzleAnswerCorrect(balance, '140000')).toBe(false);
  });

  it('upgrades an untouched fictional entry without replacing an edited one', () => {
    const legacyLedger = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-ledger-room-1')!,
      title: 'The Ledger Calibration', openingTape: 'Enter the signature override date.',
      choices: [{ id: 'choice-vic-lie', text: 'Select File #C Lie', scoresEffect: {}, narrativeImpact: 'Legacy.' }],
    };
    const editedScale = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-quiet-scale-1')!,
      title: 'Ma balance personnelle', openingTape: 'Mon texte personnel conservé.',
    };
    db.saveCampaigns([PRELOADED_CAMPAIGNS.find(item => item.id === 'camp-fictional-architect')!]);
    db.saveCharacters([]);
    db.saveTests([legacyLedger, editedScale]);
    db.initializeDB();
    const tests = db.getTests();
    expect(tests.find(test => test.id === 'test-ledger-room-1')?.title).toBe('01 — Le bureau des registres');
    expect(tests.find(test => test.id === 'test-ledger-room-1')?.choices.some(choice => /#C Lie/.test(choice.text))).toBe(false);
    expect(tests.find(test => test.id === 'test-quiet-scale-1')?.title).toBe('Ma balance personnelle');
    expect(tests.find(test => test.id === 'test-quiet-scale-1')?.openingTape).toBe('Mon texte personnel conservé.');
  });

  it('gives each rewritten stage an illustrated room with its fidelity note', () => {
    const rooms = [
      ['Le bureau des registres', 'architecte-registres.jpg'],
      ['La salle des miroirs', 'architecte-miroirs.jpg'],
      ['La salle de la balance', 'architecte-balance.jpg'],
    ] as const;
    const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === 'camp-fictional-architect')!;
    for (const [index, [room, image]] of rooms.entries()) {
      const tests = resolveCampaignTests(campaign, FICTIONAL_ARCHITECT_TESTS);
      const { unmount } = render(
        <TheatreScene campaign={campaign} tests={tests} currentTestIndex={index}
          completedTestIds={[]} isFinished={false} isPlayingTape={false} isPuzzleActive />,
      );
      expect(screen.getByRole('heading', { level: 1, name: room })).toBeTruthy();
      expect(screen.getByRole('img').getAttribute('src')).toContain(image);
      expect(screen.getAllByRole('button', { name: /^Examiner / })).toHaveLength(4);
      expect(screen.getByText(/Fiction originale :/)).toBeTruthy();
      expect(existsSync(join(process.cwd(), 'public/theatre', image)), image).toBe(true);
      unmount();
    }
  });
});
