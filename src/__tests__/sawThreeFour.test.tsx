// @vitest-environment jsdom
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from '../services/db';
import { TheatreScene } from '../components/common/TheatreScene';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { SAW_THREE_FOUR_TEST_IDS, SAW_THREE_FOUR_TESTS } from '../services/sawThreeFourData';
import { getPuzzleControl, isPuzzleAnswerCorrect, resolveCampaignTests } from '../services/simulationRules';
import { checkTextSafety } from '../services/safety';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

describe('Saw III & IV: formula applied to the next two films', () => {
  it('replaces the twelve legacy entries without changing their ids', () => {
    expect(SAW_THREE_FOUR_TESTS.map(test => test.id)).toEqual([...SAW_THREE_FOUR_TEST_IDS]);
    for (const id of SAW_THREE_FOUR_TEST_IDS) {
      const inLibrary = PRELOADED_TESTS.find(test => test.id === id);
      expect(inLibrary?.id).toBe(id);
      expect(inLibrary?.title).toMatch(/^\d{2} — /);
      expect(inLibrary?.sourceNote).toContain('Non reproduits');
      expect(inLibrary?.safetyNote).toContain('Fiction originale');
    }
    const legacyTitles = ['Freezer Water Valve Lock', 'The Angel Lockway Gears', 'The Knife Chair Scale', 'Eric Matthews Ice Blocks'];
    for (const title of legacyTitles) {
      expect(PRELOADED_TESTS.some(test => test.title === title), title).toBe(false);
    }
  });

  it('keeps every rewritten text inside the fan-game safety layer', () => {
    for (const test of SAW_THREE_FOUR_TESTS) {
      const texts = [
        test.title, test.openingTape, test.rules, test.puzzleData.question ?? '', test.safetyNote,
        test.sourceNote ?? '', ...test.clues,
        ...test.choices.flatMap(choice => [choice.text, choice.narrativeImpact]),
        ...(test.puzzleData.confessionOptions ?? []).map(option => option.text),
      ];
      for (const text of texts) expect(checkTextSafety(text), test.id).toMatchObject({ isSafe: true });
    }
  });

  it('keeps each campaign route complete and each room on a real control', () => {
    for (const campaignId of ['camp-saw-iii', 'camp-saw-iv']) {
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === campaignId)!;
      const resolved = resolveCampaignTests(campaign, PRELOADED_TESTS);
      expect(resolved.map(test => test.id)).toEqual(campaign.testIds);
    }
    const kinds: Record<string, string> = {
      'test-s3-freezer': 'answer', 'test-s3-angel': 'gears', 'test-s3-rack': 'answer',
      'test-s3-classroom': 'answer', 'test-s3-pig-vat': 'coordinates', 'test-s3-shotgun-collar': 'confession',
      'test-s4-mausoleum': 'coordinates', 'test-s4-knife-chair': 'answer', 'test-s4-hair': 'answer',
      'test-s4-spikes': 'confession', 'test-s4-bedroom': 'answer', 'test-s4-ice-blocks': 'answer',
    };
    for (const test of SAW_THREE_FOUR_TESTS) {
      expect(getPuzzleControl(test).kind, test.id).toBe(kinds[test.id]);
      expect(isPuzzleAnswerCorrect(test, test.puzzleData.correctAnswer!), test.id).toBe(true);
      expect(isPuzzleAnswerCorrect(test, '0'), test.id).toBe(false);
    }
    expect((8 + 12) / 2 * 5).toBe(50);
    expect(84 * 4).toBe(336);
    expect(9 * 36 * 4).toBe(1296);
    expect(1.5 * 80).toBe(120);
    expect(18 / 2).toBe(9);
    expect(24 * 11 * 60).toBe(15840);
    expect(400 - 4 * 85).toBe(60);
  });

  it('upgrades an untouched legacy entry without replacing an edited one', () => {
    const legacyFreezer = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-s3-freezer')!,
      title: 'Freezer Water Valve Lock', openingTape: 'Jeff. Enter the date 2024-04-12 on the code terminal.',
      choices: [{ id: 'choice-danica-f', text: 'Allow freezing', scoresEffect: {}, narrativeImpact: 'Legacy.' }],
    };
    const editedHair = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-s4-hair')!,
      title: 'Mon propre titre', openingTape: 'Mon texte personnel conservé.',
    };
    db.saveCampaigns([PRELOADED_CAMPAIGNS[2]]);
    db.saveCharacters([]);
    db.saveTests([legacyFreezer, editedHair]);
    db.initializeDB();
    const tests = db.getTests();
    expect(tests.find(test => test.id === 'test-s3-freezer')?.title).toBe('01 — La chambre froide');
    expect(tests.find(test => test.id === 'test-s3-freezer')?.choices.some(choice => /Allow freezing/.test(choice.text))).toBe(false);
    expect(tests.find(test => test.id === 'test-s4-hair')?.title).toBe('Mon propre titre');
    expect(tests.find(test => test.id === 'test-s4-hair')?.openingTape).toBe('Mon texte personnel conservé.');
  });

  it('gives each rewritten stage an illustrated room with its fidelity note', () => {
    const rooms = [
      ['La chambre froide', 'saw-iii-freezer.jpg'], ['La salle du harnais', 'saw-iii-harness.jpg'],
      ['La salle du treuil', 'saw-iii-rack.jpg'], ['La salle de classe', 'saw-iii-classroom.jpg'],
      ['La salle des cuves', 'saw-iii-vat.jpg'], ['Le bureau', 'saw-iii-office.jpg'],
      ['Le mausolée', 'saw-iv-mausoleum.jpg'], ['L’atelier', 'saw-iv-workshop.jpg'],
      ['La chambre', 'saw-iv-bedroom.jpg'], ['La chambre d’hôtel', 'saw-iv-hotel.jpg'],
      ['La chambre filmée', 'saw-iv-studio.jpg'], ['La plateforme', 'saw-iv-platform.jpg'],
    ] as const;
    for (const [index, [room, image]] of rooms.entries()) {
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === (index < 6 ? 'camp-saw-iii' : 'camp-saw-iv'))!;
      const tests = resolveCampaignTests(campaign, SAW_THREE_FOUR_TESTS);
      const { unmount } = render(
        <TheatreScene campaign={campaign} tests={tests} currentTestIndex={index < 6 ? index : index - 6}
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
});
