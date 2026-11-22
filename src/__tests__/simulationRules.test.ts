import { describe, expect, it } from 'vitest';
import type { SymbolicTest } from '../types';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { findGearPositions, getPuzzleControl, isPuzzleAnswerCorrect, requiresPuzzle, resolveCampaignTests } from '../services/simulationRules';

function chapter(id: string, campaignId = 'original-route'): SymbolicTest {
  return { ...PRELOADED_TESTS[0], id, campaignId, title: `Saved chapter ${id}` };
}

describe('saved campaign chapter order', () => {
  it('starts with the authored first chapter rather than storage order and excludes unselected chapters', () => {
    const tests = [chapter('last'), chapter('unselected'), chapter('first')];
    const campaign = { id: 'original-route', testIds: ['first', 'last'] };
    expect(resolveCampaignTests(campaign, tests).map(test => test.id)).toEqual(['first', 'last']);
    expect(tests.map(test => test.id)).toEqual(['last', 'unselected', 'first']);
    expect(campaign.testIds).toEqual(['first', 'last']);
  });

  it.each([undefined, [] as string[], ['deleted', 'foreign']])(
    'keeps owned storage order for a legacy save with no usable chapter list: %j',
    testIds => {
      const tests = [chapter('second'), chapter('foreign', 'another-route'), chapter('first')];
      expect(resolveCampaignTests({ id: 'original-route', testIds }, tests).map(test => test.id))
        .toEqual(['second', 'first']);
    },
  );

  it('skips stale references, duplicate references and chapters owned by another campaign', () => {
    const tests = [chapter('first'), chapter('second'), chapter('foreign', 'another-route')];
    expect(resolveCampaignTests({ id: 'original-route', testIds: ['deleted', 'second', 'foreign', 'second', 'first'] }, tests)
      .map(test => test.id)).toEqual(['second', 'first']);
  });

  it('keeps saved chapter content instead of replacing it with a preloaded version', () => {
    const saved = { ...chapter('edited'), timerSeconds: 253, openingTape: 'My own recorded instructions.' };
    expect(resolveCampaignTests({ id: 'original-route', testIds: ['edited'] }, [saved])[0]).toBe(saved);
  });

  it('returns no chapter when a list only references another campaign', () => {
    expect(resolveCampaignTests({ id: 'original-route', testIds: ['foreign'] }, [chapter('foreign', 'another-route')]))
      .toEqual([]);
  });

  it('resolves every preloaded chapter in the campaign-authored order without losing owned chapters', () => {
    for (const campaign of PRELOADED_CAMPAIGNS) {
      const resolved = resolveCampaignTests(campaign, PRELOADED_TESTS);
      expect(resolved.map(test => test.id), campaign.id).toEqual(campaign.testIds);
      expect(resolved.every(test => test.campaignId === campaign.id), campaign.id).toBe(true);
      expect(new Set(resolved.map(test => test.id)), campaign.id).toEqual(new Set(
        PRELOADED_TESTS.filter(test => test.campaignId === campaign.id).map(test => test.id),
      ));
    }
  });
});

describe('confession answer resolution', () => {
  const confession = {
    puzzleType: 'confession' as const,
    puzzleData: {
      confessionOptions: [
        { id: 'evasion', text: 'Change the subject', truthScore: 10 },
        { id: 'evidence', text: 'Acknowledge the observation', truthScore: 90 },
        { id: 'blame', text: 'Accuse somebody else', truthScore: 20 },
      ],
    },
  };

  it('unlocks the unique highest-scoring confession and rejects the other authored options', () => {
    expect(isPuzzleAnswerCorrect(confession, ' EVIDENCE ')).toBe(true);
    expect(isPuzzleAnswerCorrect(confession, 'evasion')).toBe(false);
    expect(isPuzzleAnswerCorrect(confession, 'blame')).toBe(false);
  });

  it('keeps an explicit custom answer authoritative over the highest-scoring option', () => {
    const custom = { ...confession, puzzleData: { ...confession.puzzleData, correctAnswer: 'evasion' } };
    expect(isPuzzleAnswerCorrect(custom, 'evasion')).toBe(true);
    expect(isPuzzleAnswerCorrect(custom, 'evidence')).toBe(false);
  });

  it('does not invent an answer when two options share the highest score', () => {
    const tied = { ...confession, puzzleData: { confessionOptions: [
      { id: 'one', text: 'First', truthScore: 90 },
      { id: 'two', text: 'Second', truthScore: 90 },
    ] } };
    expect(isPuzzleAnswerCorrect(tied, 'one')).toBe(false);
    expect(isPuzzleAnswerCorrect(tied, 'two')).toBe(false);
  });

  it('does not infer success from a missing or invalid score', () => {
    const invalid = { ...confession, puzzleData: { confessionOptions: [
      { id: 'one', text: 'First', truthScore: 90 },
      { id: 'two', text: 'Second', truthScore: Number.NaN },
    ] } };
    expect(isPuzzleAnswerCorrect(invalid, 'one')).toBe(false);
    expect(isPuzzleAnswerCorrect({ puzzleType: 'confession', puzzleData: {} }, '')).toBe(false);
  });

  it('does not infer an answer from two options whose identifiers normalize to the same value', () => {
    const ambiguous = { ...confession, puzzleData: { confessionOptions: [
      { id: 'Choice', text: 'First', truthScore: 90 },
      { id: 'choice', text: 'Second', truthScore: 10 },
    ] } };
    expect(isPuzzleAnswerCorrect(ambiguous, 'choice')).toBe(false);
  });

  it('leaves explicit answers in other puzzle families unchanged', () => {
    expect(isPuzzleAnswerCorrect({ puzzleType: 'logic', puzzleData: { correctAnswer: 'relay-6' } }, ' RELAY-6 ')).toBe(true);
    expect(isPuzzleAnswerCorrect({ puzzleType: 'logic', puzzleData: {} }, '')).toBe(false);
  });

  it('makes each preloaded confession solvable from its existing uniquely strongest option', () => {
    const tests = PRELOADED_TESTS.filter(test => test.puzzleType === 'confession');
    expect(tests.length).toBeGreaterThan(0);
    for (const test of tests) {
      const options = test.puzzleData.confessionOptions ?? [];
      expect(options.filter(option => isPuzzleAnswerCorrect(test, option.id)), test.id).toHaveLength(1);
    }
  });
});

describe('historical sacrifice slider instructions', () => {
  it.each([
    ['Set the balance slider to $150,000 or above.', 150000],
    ['Adjust slider to at least $60,000.', 60000],
    ['Move scale slider to at least $230,000.', 230000],
  ])('uses the inclusive amount from this rule: %s', (rules, threshold) => {
    const test = { puzzleType: 'sacrifice' as const, puzzleData: {}, rules };
    expect(isPuzzleAnswerCorrect(test, String(Number(threshold) - 1))).toBe(false);
    expect(isPuzzleAnswerCorrect(test, String(threshold))).toBe(true);
    expect(isPuzzleAnswerCorrect(test, String(Number(threshold) + 1))).toBe(true);
  });

  it.each([
    'Réglez le curseur de la balance à 150 000 $ ou plus.',
    'Réglez le curseur au moins à 150 000 $.',
    'Ajustez le curseur à 150 000 $ au minimum.',
  ])('reads this French slider instruction as an inclusive threshold: %s', rules => {
    const test = { puzzleType: 'sacrifice' as const, puzzleData: {}, rules };
    expect(getPuzzleControl(test)).toEqual({ kind: 'scale', max: 250000 });
    expect(isPuzzleAnswerCorrect(test, '150000')).toBe(true);
    expect(isPuzzleAnswerCorrect(test, '180000')).toBe(true);
    expect(isPuzzleAnswerCorrect(test, '149999')).toBe(false);
  });

  it('keeps the strict reading of a French instruction that asks for more than the amount', () => {
    const test = { puzzleType: 'sacrifice' as const, puzzleData: {}, rules: 'Ajustez le curseur à plus de 80 000 $.' };
    expect(isPuzzleAnswerCorrect(test, '80000')).toBe(false);
    expect(isPuzzleAnswerCorrect(test, '80001')).toBe(true);
  });

  it('does not read a French sentence that is not a complete slider instruction', () => {
    const test = { puzzleType: 'sacrifice' as const, puzzleData: {}, rules: 'Réglez le curseur à une valeur sûre.' };
    expect(getPuzzleControl(test).kind).toBe('answer');
    expect(isPuzzleAnswerCorrect(test, '150000')).toBe(false);
  });

  it('requires strictly more than the amount when the rule says past', () => {
    const test = { puzzleType: 'sacrifice' as const, puzzleData: {}, rules: 'Set slider past $80,000.' };
    expect(isPuzzleAnswerCorrect(test, '80000')).toBe(false);
    expect(isPuzzleAnswerCorrect(test, '80001')).toBe(true);
  });

  it('preserves an explicit exact custom answer over a legacy threshold rule', () => {
    const test = {
      puzzleType: 'sacrifice' as const, puzzleData: { correctAnswer: '125000' },
      rules: 'Set slider to at least $60,000.',
    };
    expect(isPuzzleAnswerCorrect(test, '125000')).toBe(true);
    expect(isPuzzleAnswerCorrect(test, '180000')).toBe(false);
  });

  it('does not take a threshold from the question or guess an unrecognized or compound rule', () => {
    const test = {
      puzzleType: 'sacrifice' as const,
      puzzleData: { question: 'Transfer at least $150,000 from the account.' },
    };
    expect(isPuzzleAnswerCorrect(test, '180000')).toBe(false);
    expect(isPuzzleAnswerCorrect({ ...test, rules: 'Set the ventilation to a safe value.' }, '180000')).toBe(false);
    expect(isPuzzleAnswerCorrect({ ...test, rules: 'Set slider past $150,000 or at least $90,000.' }, '180000')).toBe(false);
  });

  it('rejects blank, non-finite and partly parsed answers', () => {
    const test = { puzzleType: 'sacrifice' as const, puzzleData: {}, rules: 'Set slider to at least $60,000.' };
    for (const answer of ['', ' ', 'Infinity', 'NaN', '90000 trailing text', '90,00']) {
      expect(isPuzzleAnswerCorrect(test, answer), answer).toBe(false);
    }
  });

  it('makes every existing preloaded sacrifice solvable from its captured rules without modifying its data', () => {
    const tests = PRELOADED_TESTS.filter(test => test.puzzleType === 'sacrifice');
    expect(tests.length).toBeGreaterThan(0);
    for (const test of tests) {
      const original = JSON.stringify(test);
      expect(isPuzzleAnswerCorrect(test, '180000'), test.id).toBe(true);
      expect(isPuzzleAnswerCorrect(test, '140000'), test.id).toBe(false);
      expect(JSON.stringify(test), test.id).toBe(original);
    }
  });
});

describe('puzzle controls match saved definitions', () => {
  it('distinguishes a direct branching choice from a coordinate puzzle before the branch', () => {
    expect(requiresPuzzle({ puzzleType: 'choice', puzzleData: {} })).toBe(false);
    expect(getPuzzleControl({ puzzleType: 'choice', puzzleData: {} }).kind).toBe('branch');
    expect(requiresPuzzle({ puzzleType: 'choice', puzzleData: { correctAnswer: 'B-3' } })).toBe(true);
    expect(getPuzzleControl({ puzzleType: 'choice', puzzleData: { correctAnswer: 'B-3' } }).kind).toBe('coordinates');
    expect(getPuzzleControl({ puzzleType: 'choice', puzzleData: { correctAnswer: 'D-4' } }).kind).toBe('answer');
  });

  it('provides a real date control for valid dates of any year and free input for text or non-calendar codes', () => {
    expect(getPuzzleControl({ puzzleType: 'logic', puzzleData: { correctAnswer: '2038-06-21' } }).kind).toBe('date');
    expect(getPuzzleControl({ puzzleType: 'logic', puzzleData: { correctAnswer: 'relay-blue' } }).kind).toBe('answer');
    expect(getPuzzleControl({ puzzleType: 'logic', puzzleData: { correctAnswer: '2025-02-30' } }).kind).toBe('answer');
  });

  it('uses the authored gear target only if the actual controls can reach it', () => {
    expect(getPuzzleControl({ puzzleType: 'maze', puzzleData: { correctAnswer: '13' } })).toEqual({ kind: 'gears', target: 13 });
    expect(getPuzzleControl({ puzzleType: 'maze', puzzleData: { correctAnswer: '100' } }).kind).toBe('answer');
    expect(getPuzzleControl({ puzzleType: 'maze', puzzleData: { correctAnswer: '1' } }).kind).toBe('answer');
    const saved = findGearPositions(17)!;
    expect(saved.left * 3 + saved.right * 2).toBe(17);
  });

  it('keeps exact custom scale targets in range and falls back to text for literal nonnumeric answers', () => {
    const control = getPuzzleControl({ puzzleType: 'sacrifice', puzzleData: { correctAnswer: '380005.5' } });
    expect(control.kind).toBe('scale');
    if (control.kind === 'scale') expect(control.max).toBeGreaterThanOrEqual(380005.5);
    expect(getPuzzleControl({ puzzleType: 'sacrifice', puzzleData: { correctAnswer: '050' } }).kind).toBe('answer');
    expect(getPuzzleControl({ puzzleType: 'sacrifice', puzzleData: { correctAnswer: 'approved' } }).kind).toBe('answer');
  });

  it('gives every current preloaded step a reachable mechanism without skipping the configured choice puzzles', () => {
    const counts: Record<string, number> = {};
    for (const test of PRELOADED_TESTS) {
      expect(requiresPuzzle(test), test.id).toBe(true);
      const kind = getPuzzleControl(test).kind;
      counts[kind] = (counts[kind] ?? 0) + 1;
    }
    expect(counts).toEqual({ date: 13, confession: 13, scale: 1, coordinates: 14, gears: 6, answer: 40 });
  });
});
