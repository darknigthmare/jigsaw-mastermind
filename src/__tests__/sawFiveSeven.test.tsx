// @vitest-environment jsdom
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from '../services/db';
import { TheatreScene } from '../components/common/TheatreScene';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { SAW_FIVE_SEVEN_TEST_IDS, SAW_FIVE_SEVEN_TESTS } from '../services/sawFiveSevenData';
import { getPuzzleControl, isPuzzleAnswerCorrect, resolveCampaignTests } from '../services/simulationRules';
import { checkTextSafety } from '../services/safety';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

describe('Saw V–VII: the third film-by-film pass', () => {
  it('replaces the twenty-two legacy entries without changing their ids', () => {
    expect(SAW_FIVE_SEVEN_TESTS.map(test => test.id)).toEqual([...SAW_FIVE_SEVEN_TEST_IDS]);
    for (const id of SAW_FIVE_SEVEN_TEST_IDS) {
      const inLibrary = PRELOADED_TESTS.find(test => test.id === id);
      expect(inLibrary?.id).toBe(id);
      expect(inLibrary?.title).toMatch(/^\d{2} — /);
      expect(inLibrary?.sourceNote).toContain('Non reproduits');
      expect(inLibrary?.safetyNote).toContain('Fiction originale');
    }
    const legacyTitles = ['The Pendulum Bypass', 'The Oxygen Crusher', 'Horsepower Chain Release', 'Wisdom Teeth Combination'];
    for (const title of legacyTitles) {
      expect(PRELOADED_TESTS.some(test => test.title === title), title).toBe(false);
    }
  });

  it('keeps every rewritten text inside the fan-game safety layer', () => {
    for (const test of SAW_FIVE_SEVEN_TESTS) {
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
    for (const campaignId of ['camp-saw-v', 'camp-saw-vi', 'camp-saw-vii']) {
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === campaignId)!;
      const resolved = resolveCampaignTests(campaign, PRELOADED_TESTS);
      expect(resolved.map(test => test.id)).toEqual(campaign.testIds);
    }
    const kinds: Record<string, string> = {
      'test-s5-pendulum': 'answer', 'test-s5-collar-keys': 'answer', 'test-s5-ceiling-jars': 'answer',
      'test-s5-electric-bathtub': 'answer', 'test-s5-blood-saws': 'answer', 'test-s5-water-cube': 'date',
      'test-s5-glass-coffin': 'coordinates',
      'test-s6-oxygen': 'answer', 'test-s6-gallows': 'confession', 'test-s6-carousel': 'gears',
      'test-s6-steam-maze': 'answer', 'test-s6-acid-latch': 'coordinates', 'test-s6-pound-flesh': 'answer',
      'test-s6-bear-trap-2': 'gears',
      'test-s7-horsepower': 'answer', 'test-s7-silence': 'date', 'test-s7-lawnmower': 'answer',
      'test-s7-spike-cage': 'answer', 'test-s7-public-exec': 'confession', 'test-s7-brazen-bull': 'gears',
      'test-s7-impalement-wheel': 'answer', 'test-s7-wisdom-teeth': 'date',
    };
    for (const test of SAW_FIVE_SEVEN_TESTS) {
      expect(getPuzzleControl(test).kind, test.id).toBe(kinds[test.id]);
      expect(isPuzzleAnswerCorrect(test, test.puzzleData.correctAnswer!), test.id).toBe(true);
      expect(isPuzzleAnswerCorrect(test, '0'), test.id).toBe(false);
    }
    expect(78_400 + 51_600 + 20_000).toBe(150_000);
    expect(62_500 + 47_500 + 40_000).toBe(150_000);
    expect(96_000 + 31_000 + 23_000).toBe(150_000);
    expect((4 + 2) % 5).toBe(1);
    expect(3_600 - 2 * 900).toBe(1_800);
    expect(3_600 / 300).toBe(12);
  });

  it('upgrades an untouched legacy entry without replacing an edited one', () => {
    const legacyPendulum = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-s5-pendulum')!,
      title: 'The Pendulum Bypass', openingTape: 'Seth. Adjust the voltage slider past $150,000.',
      choices: [{ id: 'choice-p-f', text: 'Blade falls', scoresEffect: {}, narrativeImpact: 'Legacy.' }],
    };
    const editedCage = {
      ...PRELOADED_TESTS.find(test => test.id === 'test-s7-spike-cage')!,
      title: 'Ma version de la cage', openingTape: 'Mon texte personnel conservé.',
    };
    db.saveCampaigns([PRELOADED_CAMPAIGNS[4]]);
    db.saveCharacters([]);
    db.saveTests([legacyPendulum, editedCage]);
    db.initializeDB();
    const tests = db.getTests();
    expect(tests.find(test => test.id === 'test-s5-pendulum')?.title).toBe('01 — La salle des scellés');
    expect(tests.find(test => test.id === 'test-s5-pendulum')?.choices.some(choice => /Blade falls/.test(choice.text))).toBe(false);
    expect(tests.find(test => test.id === 'test-s7-spike-cage')?.title).toBe('Ma version de la cage');
    expect(tests.find(test => test.id === 'test-s7-spike-cage')?.openingTape).toBe('Mon texte personnel conservé.');
  });

  it('gives each rewritten stage an illustrated room with its fidelity note', () => {
    const rooms = [
      ['La salle des scellés', 'saw-v-scelles.jpg'], ['Le vestibule', 'saw-v-vestibule.jpg'],
      ['La réserve', 'saw-v-reserve.jpg'], ['La chaufferie', 'saw-v-chaufferie.jpg'],
      ['La salle de collecte', 'saw-v-collecte.jpg'], ['Le réservoir', 'saw-v-reservoir.jpg'],
      ['Le couloir bas', 'saw-v-couloir.jpg'],
      ['La salle d’attente', 'saw-vi-attente.jpg'], ['Le bureau d’audit', 'saw-vi-audit.jpg'],
      ['La rotonde', 'saw-vi-rotonde.jpg'], ['La chaufferie', 'saw-vi-chaufferie.jpg'],
      ['Le laboratoire', 'saw-vi-laboratoire.jpg'], ['La salle des comptes', 'saw-vi-comptes.jpg'],
      ['L’atelier', 'saw-vi-atelier.jpg'],
      ['Le garage', 'saw-vii-garage.jpg'], ['Le théâtre', 'saw-vii-theatre.jpg'],
      ['La cour arrière', 'saw-vii-cour.jpg'], ['L’entrepôt', 'saw-vii-entrepot.jpg'],
      ['La place', 'saw-vii-place.jpg'], ['Le hangar', 'saw-vii-hangar.jpg'],
      ['La galerie', 'saw-vii-galerie.jpg'], ['Le cabinet', 'saw-vii-cabinet.jpg'],
    ] as const;
    for (const [index, [room, image]] of rooms.entries()) {
      const campaignId = index < 7 ? 'camp-saw-v' : index < 14 ? 'camp-saw-vi' : 'camp-saw-vii';
      const campaign = PRELOADED_CAMPAIGNS.find(item => item.id === campaignId)!;
      const offset = index < 7 ? index : index < 14 ? index - 7 : index - 14;
      const tests = resolveCampaignTests(campaign, SAW_FIVE_SEVEN_TESTS);
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
