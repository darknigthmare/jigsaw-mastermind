// @vitest-environment jsdom
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import * as db from '../services/db';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TheatreScene } from '../components/common/TheatreScene';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { SAW_ONE_TWO_TEST_IDS, SAW_ONE_TWO_TESTS } from '../services/sawOneTwoData';
import { getPuzzleControl, isPuzzleAnswerCorrect, resolveCampaignTests } from '../services/simulationRules';
import { checkTextSafety } from '../services/safety';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

describe('Saw I & II: formula applied to the founding films', () => {
  it('replaces the thirteen legacy entries without changing their ids', () => {
    expect(SAW_ONE_TWO_TESTS.map(test => test.id)).toEqual([...SAW_ONE_TWO_TEST_IDS]);
    for (const id of SAW_ONE_TWO_TEST_IDS) {
      const inLibrary = PRELOADED_TESTS.find(test => test.id === id);
      expect(inLibrary?.id).toBe(id);
      expect(inLibrary?.title).toMatch(/^\d{2} — /);
      expect(inLibrary?.sourceNote).toContain('Non reproduits');
      expect(inLibrary?.safetyNote).toContain('Fiction originale');
    }
    const legacyTitles = ['Bathroom Padlock Key', 'The Reverse Bear Lockway', 'Razor Wire Exit Lock', 'The Death Mask Scale'];
    for (const title of legacyTitles) {
      expect(PRELOADED_TESTS.some(test => test.title === title), title).toBe(false);
    }
  });

  it('keeps every rewritten text inside the fan-game safety layer', () => {
    for (const test of SAW_ONE_TWO_TESTS) {
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
    for (const campaignId of ['camp-saw-i', 'camp-saw-ii']) {
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === campaignId)!;
      const resolved = resolveCampaignTests(campaign, PRELOADED_TESTS);
      expect(resolved.map(test => test.id)).toEqual(campaign.testIds);
    }
    const kinds: Record<string, string> = {
      'test-s1-bathroom': 'coordinates', 'test-s1-bear-trap': 'gears', 'test-s1-razor-wire': 'date',
      'test-s1-flammable-jelly': 'answer', 'test-s1-drill-chair': 'answer', 'test-s1-shotgun-hallway': 'coordinates',
      'test-s1-zep-hostage': 'confession', 'test-s2-death-mask': 'answer', 'test-s2-needle-pit': 'confession',
      'test-s2-razor-box': 'answer', 'test-s2-furnace': 'answer', 'test-s2-shotgun-peephole': 'coordinates',
      'test-s2-gas-house': 'answer',
    };
    for (const test of SAW_ONE_TWO_TESTS) {
      expect(getPuzzleControl(test).kind, test.id).toBe(kinds[test.id]);
      expect(isPuzzleAnswerCorrect(test, test.puzzleData.correctAnswer!), test.id).toBe(true);
      expect(isPuzzleAnswerCorrect(test, '0'), test.id).toBe(false);
    }
    expect(new Date('2004-03-18T00:00:00Z').getUTCDay()).toBe(4);
    expect((40 - 18) / 2 * 5).toBe(55);
    expect(900 / 3).toBe(300);
    expect(8 * 3.5).toBe(28);
    expect((85 - 15) / 5 * 4).toBe(56);
    expect(720 / 24).toBe(30);
  });

  it('upgrades an untouched legacy entry in an existing library without replacing an edited one', () => {
    const legacyBathroom = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-s1-bathroom')!,
      title: 'Bathroom Padlock Key', openingTape: 'Hello, Lawrence. The key to your ankle chains is hidden under floor tile B-3.',
      choices: [{ id: 'choice-gordon-k', text: 'Unlock padlock with key B-3', scoresEffect: {}, narrativeImpact: 'Legacy.' }],
    };
    const editedBear = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-s1-bear-trap')!,
      title: 'Mon propre titre', openingTape: 'Mon texte personnel conservé.',
    };
    db.saveCampaigns([PRELOADED_CAMPAIGNS[0]]);
    db.saveCharacters([]);
    db.saveTests([legacyBathroom, editedBear]);
    db.initializeDB();
    const tests = db.getTests();
    expect(tests.find(test => test.id === 'test-s1-bathroom')?.title).toBe('01 — Le bain');
    expect(tests.find(test => test.id === 'test-s1-bathroom')?.choices.some(choice => /Amputate/.test(choice.text))).toBe(false);
    expect(tests.find(test => test.id === 'test-s1-bear-trap')?.title).toBe('Mon propre titre');
    expect(tests.find(test => test.id === 'test-s1-bear-trap')?.openingTape).toBe('Mon texte personnel conservé.');
  });

  it('gives each rewritten stage an illustrated room with its fidelity note', () => {
    const rooms = [
      ['La salle carrelée', 'saw-i-bathroom.jpg'], ['La chambre scellée', 'saw-i-apartment.jpg'],
      ['Le passage grillagé', 'saw-i-razor.jpg'], ['Le local de chauffe', 'saw-i-heat.jpg'],
      ['L’atelier de la presse', 'saw-i-workshop.jpg'], ['Le couloir aux portes', 'saw-i-corridor.jpg'],
      ['L’appartement', 'saw-i-zep.jpg'], ['L’entrée scellée', 'saw-ii-entry.jpg'],
      ['La réserve du sous-sol', 'saw-ii-basement.jpg'], ['La salle de bain', 'saw-ii-bath.jpg'],
      ['La chaufferie', 'saw-ii-basement.jpg'], ['Le palier', 'saw-ii-hall.jpg'],
      ['Le salon scellé', 'saw-ii-living.jpg'],
    ] as const;
    for (const [index, [room, image]] of rooms.entries()) {
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === (index < 7 ? 'camp-saw-i' : 'camp-saw-ii'))!;
      const tests = resolveCampaignTests(campaign, SAW_ONE_TWO_TESTS);
      const { unmount } = render(
        <TheatreScene campaign={campaign} tests={tests} currentTestIndex={index < 7 ? index : index - 7}
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
