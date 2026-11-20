import type { Campaign, SymbolicTest } from '../types';

type CampaignSequence = Pick<Campaign, 'id'> & Partial<Pick<Campaign, 'testIds'>>;
type PuzzleDefinition = Pick<SymbolicTest, 'puzzleType' | 'puzzleData'> & Partial<Pick<SymbolicTest, 'rules'>>;

export type PuzzleControl =
  | { kind: 'branch' | 'date' | 'answer' | 'confession' | 'coordinates' }
  | { kind: 'gears'; target: number }
  | { kind: 'scale'; max: number };

export function requiresPuzzle(test: PuzzleDefinition): boolean {
  return test.puzzleType !== 'choice' || Boolean(test.puzzleData.correctAnswer?.trim());
}

export function findGearPositions(sum: number): { left: number; right: number } | undefined {
  for (let left = 0; left < 8; left += 1) {
    for (let right = 0; right < 6; right += 1) {
      if (left * 3 + right * 2 === sum) return { left, right };
    }
  }
  return undefined;
}

/** Choose a control that can actually express the authored answer. */
export function getPuzzleControl(test: PuzzleDefinition): PuzzleControl {
  if (!requiresPuzzle(test)) return { kind: 'branch' };
  const answer = test.puzzleData.correctAnswer?.trim() ?? '';
  if (test.puzzleType === 'confession' && test.puzzleData.confessionOptions?.length) return { kind: 'confession' };
  if (test.puzzleType === 'logic' && /^\d{4}-\d{2}-\d{2}$/.test(answer) && !answer.startsWith('0000')) {
    const date = new Date(`${answer}T00:00:00Z`);
    if (Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === answer) return { kind: 'date' };
  }
  if (test.puzzleType === 'choice' && /^[A-C]-[1-3]$/.test(answer)) return { kind: 'coordinates' };
  const numeric = Number(answer);
  const canonicalNumber = /^\d+(?:\.\d+)?$/.test(answer) && Number.isFinite(numeric) && String(numeric) === answer;
  if (test.puzzleType === 'maze' && canonicalNumber && findGearPositions(numeric)) return { kind: 'gears', target: numeric };
  if (test.puzzleType === 'sacrifice') {
    const legacy = typeof test.rules === 'string' ? legacySacrificeThreshold(test.rules) : undefined;
    const threshold = canonicalNumber ? numeric : !answer ? legacy?.value : undefined;
    const max = threshold === undefined ? Number.NaN : Math.max(250000, threshold + (!answer && legacy && !legacy.inclusive ? 1 : 0));
    if (Number.isFinite(max)) return { kind: 'scale', max };
  }
  return { kind: 'answer' };
}

/** Resolve saved chapter selection without importing another campaign's tests.
 *
 * A usable explicit list selects the chapters and their order. Older saves
 * without usable references retain the previous storage order of owned tests.
 * An active run keeps its own snapshot and does not call this resolver again.
 */
export function resolveCampaignTests(campaign: CampaignSequence, tests: SymbolicTest[]): SymbolicTest[] {
  const owned = new Map<string, SymbolicTest>();
  for (const test of tests) {
    if (test.campaignId === campaign.id && !owned.has(test.id)) owned.set(test.id, test);
  }

  const selected: SymbolicTest[] = [];
  const seen = new Set<string>();
  if (Array.isArray(campaign.testIds)) {
    for (const id of campaign.testIds) {
      const test = owned.get(id);
      if (test && !seen.has(id)) {
        selected.push(test);
        seen.add(id);
      }
    }
  }

  return selected.length ? selected : [...owned.values()];
}

/** Read only the complete, explicit slider instructions used by older saves. */
function legacySacrificeThreshold(rules: string): { value: number; inclusive: boolean } | undefined {
  const amount = '((?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?)';
  const slider = '^(?:set|adjust|move)\\s+(?:the\\s+)?(?:(?:balance|scale)\\s+)?slider\\s+(?:to\\s+)?';
  const prefix = rules.trim().match(new RegExp(`${slider}(at least|past)\\s+\\$?\\s*${amount}\\s*\\.?$`, 'i'));
  const suffix = rules.trim().match(new RegExp(`${slider}\\$?\\s*${amount}\\s+or above\\s*\\.?$`, 'i'));
  if (!prefix && !suffix) return undefined;
  const value = Number((prefix ? prefix[2] : suffix![1]).replaceAll(',', ''));
  return Number.isFinite(value) ? { value, inclusive: !prefix || prefix[1].toLowerCase() === 'at least' } : undefined;
}

/** Explicit answers win over the narrowly supported historical puzzle rules. */
export function isPuzzleAnswerCorrect(
  test: PuzzleDefinition,
  answer: string,
): boolean {
  const normalize = (value: string) => value.toLowerCase().trim();
  const explicit = test.puzzleData.correctAnswer;
  if (typeof explicit === 'string' && explicit.trim()) {
    return normalize(explicit) === normalize(answer);
  }
  if (test.puzzleType === 'sacrifice') {
    const requirement = typeof test.rules === 'string' ? legacySacrificeThreshold(test.rules) : undefined;
    if (!requirement || !/^\$?\s*(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/.test(answer.trim())) return false;
    const value = Number(answer.trim().replace(/^\$\s*/, '').replaceAll(',', ''));
    return Number.isFinite(value) && (requirement.inclusive ? value >= requirement.value : value > requirement.value);
  }
  if (test.puzzleType !== 'confession') return false;

  const options = test.puzzleData.confessionOptions;
  if (!options?.length || options.some(option =>
    !Number.isFinite(option.truthScore) || typeof option.id !== 'string' || !option.id.trim()
  )) return false;
  if (new Set(options.map(option => normalize(option.id))).size !== options.length) return false;
  const highestScore = Math.max(...options.map(option => option.truthScore));
  const best = options.filter(option => option.truthScore === highestScore);
  return best.length === 1 && normalize(best[0].id) === normalize(answer);
}
