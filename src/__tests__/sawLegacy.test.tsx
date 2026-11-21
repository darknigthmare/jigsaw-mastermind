// @vitest-environment jsdom
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from '../services/db';
import { TheatreScene } from '../components/common/TheatreScene';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { SAW_LEGACY_TEST_IDS, SAW_LEGACY_TESTS } from '../services/sawLegacyData';
import { getPuzzleControl, isPuzzleAnswerCorrect, resolveCampaignTests } from '../services/simulationRules';
import { checkTextSafety } from '../services/safety';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

describe('Jigsaw, Spiral and Saw X: the fourth film-by-film pass', () => {
  it('replaces the twenty-one legacy entries without changing their ids', () => {
    expect(SAW_LEGACY_TESTS.map(test => test.id)).toEqual([...SAW_LEGACY_TEST_IDS]);
    for (const id of SAW_LEGACY_TEST_IDS) {
      const inLibrary = PRELOADED_TESTS.find(test => test.id === id);
      expect(inLibrary?.id).toBe(id);
      expect(inLibrary?.title).toMatch(/^\d{2} — /);
      expect(inLibrary?.sourceNote).toContain('Non reproduits');
      expect(inLibrary?.safetyNote).toContain('Fiction originale');
    }
    const legacyTitles = ['The Bucket Head Scanner', 'The Tongue Subway Release', 'Gigli Saw Voltage', 'Poison Gas Room'];
    for (const title of legacyTitles) {
      expect(PRELOADED_TESTS.some(test => test.title === title), title).toBe(false);
    }
  });

  it('keeps every rewritten text inside the fan-game safety layer', () => {
    for (const test of SAW_LEGACY_TESTS) {
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
    for (const campaignId of ['camp-jigsaw', 'camp-spiral', 'camp-saw-x']) {
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === campaignId)!;
      const resolved = resolveCampaignTests(campaign, PRELOADED_TESTS);
      expect(resolved.map(test => test.id)).toEqual(campaign.testIds);
    }
    const kinds: Record<string, string> = {
      'test-jg-bucket-heads': 'answer', 'test-jg-chain-hangers': 'confession',
      'test-jg-poison-syringes': 'coordinates', 'test-jg-leg-wire': 'answer',
      'test-jg-silo': 'date', 'test-jg-cycle': 'gears', 'test-jg-shotgun-keys': 'answer',
      'test-jg-laser-collars': 'coordinates',
      'test-sp-tongue': 'answer', 'test-sp-finger': 'date', 'test-sp-skinning': 'answer',
      'test-sp-wax': 'date', 'test-sp-shredder': 'coordinates', 'test-sp-puppet-strings': 'confession',
      'test-sx-vacuum': 'answer', 'test-sx-gigli': 'answer', 'test-sx-pipebomb': 'date',
      'test-sx-radiation': 'date', 'test-sx-bone-crusher': 'answer',
      'test-sx-blood-pit': 'coordinates', 'test-sx-gas-room': 'confession',
    };
    for (const test of SAW_LEGACY_TESTS) {
      expect(getPuzzleControl(test).kind, test.id).toBe(kinds[test.id]);
      expect(isPuzzleAnswerCorrect(test, test.puzzleData.correctAnswer!), test.id).toBe(true);
      expect(isPuzzleAnswerCorrect(test, '0'), test.id).toBe(false);
    }
    expect(8 * 6 - 2 * 6).toBe(36);
    expect(42 / 7).toBe(6);
    expect(5 * 3 - 2).toBe(13);
    expect(60 / 6).toBe(10);
    expect(240 / 8).toBe(30);
    expect(3_600 - 1_200).toBe(2_400);
    expect(90 * 6).toBe(540);
    expect(16 * 24).toBe(384);
  });

  it('upgrades an untouched legacy entry without replacing an edited one', () => {
    const legacyBuckets = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-jg-bucket-heads')!,
      title: 'The Bucket Head Scanner', openingTape: 'Anna. Scan floor coordinate B-3.',
      choices: [{ id: 'choice-b-f', text: 'Chains pull', scoresEffect: {}, narrativeImpact: 'Legacy.' }],
    };
    const editedWax = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-sp-wax')!,
      title: 'Ma version du dépôt', openingTape: 'Mon texte personnel conservé.',
    };
    db.saveCampaigns([PRELOADED_CAMPAIGNS[7]]);
    db.saveCharacters([]);
    db.saveTests([legacyBuckets, editedWax]);
    db.initializeDB();
    const tests = db.getTests();
    expect(tests.find(test => test.id === 'test-jg-bucket-heads')?.title).toBe('01 — La salle de tri');
    expect(tests.find(test => test.id === 'test-jg-bucket-heads')?.choices.some(choice => /Chains pull/.test(choice.text))).toBe(false);
    expect(tests.find(test => test.id === 'test-sp-wax')?.title).toBe('Ma version du dépôt');
    expect(tests.find(test => test.id === 'test-sp-wax')?.openingTape).toBe('Mon texte personnel conservé.');
  });

  it('gives each rewritten stage an illustrated room with its fidelity note', () => {
    const rooms = [
      ['La salle de tri', 'saw-jg-tri.jpg'], ['La grange', 'saw-jg-grange.jpg'],
      ['L’infirmerie', 'saw-jg-infirmerie.jpg'], ['L’atelier de réparation', 'saw-jg-atelier.jpg'],
      ['Le silo', 'saw-jg-silo.jpg'], ['Le hangar à machines', 'saw-jg-machines.jpg'],
      ['Le vestiaire', 'saw-jg-vestiaire.jpg'], ['La salle des dossiers', 'saw-jg-dossiers.jpg'],
      ['Le quai', 'saw-sp-quai.jpg'], ['Le vestiaire du commissariat', 'saw-sp-vestiaire.jpg'],
      ['La savonnerie', 'saw-sp-savonnerie.jpg'], ['Le dépôt de cire', 'saw-sp-cire.jpg'],
      ['Le hall du commissariat', 'saw-sp-hall.jpg'], ['La salle des scellés', 'saw-sp-scelles.jpg'],
      ['La salle d’examen', 'saw-sx-examen.jpg'], ['Le bloc opératoire', 'saw-sx-bloc.jpg'],
      ['Le vestiaire du personnel', 'saw-sx-vestiaire.jpg'], ['La salle d’imagerie', 'saw-sx-imagerie.jpg'],
      ['La pharmacie', 'saw-sx-pharmacie.jpg'], ['La cuve', 'saw-sx-cuve.jpg'],
      ['Le local technique', 'saw-sx-technique.jpg'],
    ] as const;
    for (const [index, [room, image]] of rooms.entries()) {
      const campaignId = index < 8 ? 'camp-jigsaw' : index < 14 ? 'camp-spiral' : 'camp-saw-x';
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === campaignId)!;
      const offset = index < 8 ? index : index < 14 ? index - 8 : index - 14;
      const tests = resolveCampaignTests(campaign, SAW_LEGACY_TESTS);
      const { unmount } = render(
        <TheatreScene campaign={campaign} tests={tests} currentTestIndex={offset}
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
