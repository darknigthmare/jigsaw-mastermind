import type { Campaign, CharacterProfile, SymbolicTest } from '../types';
import { PRELOADED_CAMPAIGNS, PRELOADED_CHARACTERS, PRELOADED_TESTS } from '../services/preloadedData';
import * as db from '../services/db';

export const originalCampaign: Campaign = {
  ...PRELOADED_CAMPAIGNS[PRELOADED_CAMPAIGNS.length - 1],
  id: 'original-route', title: 'Original signal route', fictionalLocation: 'Signal station',
  objective: 'Restore the observation signal.', characterIds: ['original-subject'], testIds: ['original-stage'],
};
export const originalSubject: CharacterProfile = {
  ...PRELOADED_CHARACTERS[0], id: 'original-subject', name: 'Ari', canonStatus: 'custom',
};
export function originalStage(overrides: Partial<SymbolicTest> = {}): SymbolicTest {
  return {
    ...PRELOADED_TESTS[0], id: 'original-stage', campaignId: originalCampaign.id,
    characterId: originalSubject.id, title: 'Original signal calibration',
    openingTape: 'Read the signal before choosing a route.', rules: 'Enter the observed signal.',
    puzzleType: 'logic', puzzleData: { question: 'Which signal?', correctAnswer: 'relay-blue' },
    clues: ['Read the first indicator.', 'Compare it with the record.'], timerSeconds: 253,
    choices: [
      { id: 'continue-id', text: 'Continue the route', narrativeImpact: 'The signal is recorded.', scoresEffect: { truth: 30, empathy: 7, cooperation: 8 }, endingType: 'Original ending' },
      { id: 'delay-id', text: 'Delay the route', narrativeImpact: 'The observation is delayed.', scoresEffect: { denial: 20, acceptance: 3 } },
    ],
    safetyNote: 'An original fictional interface puzzle.', ...overrides,
  };
}
export function seedOriginalStage(test: SymbolicTest): void {
  db.saveCampaigns([originalCampaign]);
  db.saveCharacters([originalSubject]);
  db.saveTests([test]);
  db.saveSettings({ ...db.getSettings(), visualNoise: false, strictSafetyMode: false });
}
