import type { Campaign, SymbolicTest } from '../types';

type CampaignSequence = Pick<Campaign, 'id'> & Partial<Pick<Campaign, 'testIds'>>;

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
  test: Pick<SymbolicTest, 'puzzleType' | 'puzzleData'> & Partial<Pick<SymbolicTest, 'rules'>>,
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
