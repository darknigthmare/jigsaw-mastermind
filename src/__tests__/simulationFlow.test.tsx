// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider, useApp } from '../context/AppContext';
import type { Campaign, SymbolicTest } from '../types';
import * as db from '../services/db';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { DERNIER_RELAIS_CONTENT_ID } from '../services/dernierRelaisData';
import { UNE_DE_MINUIT_CONTENT_ID } from '../services/laUneDeMinuitData';
import { ROSTER_CONTENT_ID } from '../services/rosterData';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(),
  playBeep: vi.fn(), playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(),
}));

function campaign(id: string, testIds: string[]): Campaign {
  return {
    id, title: `Original route ${id}`, timelinePeriod: 'fan-campaigns', tone: 'Quiet',
    moralTheme: 'Cooperation', fictionalLocation: 'An original control station',
    objective: 'Restore the signal', status: 'ready', characterIds: [], testIds,
    createdAt: '2026-11-20T00:00:00Z', updatedAt: '2026-11-20T00:00:00Z',
  };
}

function chapter(id: string, campaignId = 'route-a'): SymbolicTest {
  return {
    id, campaignId, characterId: 'original-participant', title: `Original chapter ${id}`,
    moralTheme: 'Cooperation', openingTape: 'Read the indicator before choosing.',
    rules: 'Choose the next signal.', puzzleType: 'choice', puzzleData: {}, clues: [],
    timerSeconds: 253,
    choices: [{ id: 'continue', text: 'Continue', scoresEffect: { cooperation: 10 }, narrativeImpact: 'The signal moves on.' }],
    safetyNote: 'Fictional puzzle.', createdAt: '2026-11-20T00:00:00Z', updatedAt: '2026-11-20T00:00:00Z',
  };
}

function prepare(campaigns: Campaign[], tests: SymbolicTest[]) {
  localStorage.setItem(db.CONTENT_INSTALLATIONS_KEY, JSON.stringify([DERNIER_RELAIS_CONTENT_ID, UNE_DE_MINUIT_CONTENT_ID, ROSTER_CONTENT_ID]));
  db.saveCampaigns(campaigns);
  db.saveTests(tests);
  return renderHook(() => useApp(), { wrapper: ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider> });
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

describe('Theatre saved chapter progression', () => {
  it('starts and advances in the campaign-authored order while preserving edited content', () => {
    const { result } = prepare([campaign('route-a', ['last', 'first'])], [chapter('first'), chapter('omitted'), chapter('last')]);
    act(() => result.current.startSimulation('route-a'));
    expect(result.current.activeSimulation?.tests.map(test => test.id)).toEqual(['last', 'first']);
    expect(result.current.activeSimulation?.timerLeft).toBe(253);
    act(() => result.current.submitChoice('continue'));
    expect(result.current.activeSimulation?.currentTestIndex).toBe(1);
    expect(result.current.activeSimulation?.tests[1].title).toBe('Original chapter first');
    expect(result.current.activeSimulation?.scores.cooperation).toBe(60);
  });

  it('appends a new chapter without hiding the existing chapters of a legacy empty-list save', () => {
    const { result } = prepare([campaign('route-a', [])], [chapter('first'), chapter('second')]);
    const { id: _id, createdAt: _created, updatedAt: _updated, ...payload } = chapter('new');
    let addedId = '';
    act(() => { addedId = result.current.addTest(payload); });
    expect(db.getCampaigns()[0].testIds).toEqual(['first', 'second', addedId]);
    act(() => result.current.startSimulation('route-a'));
    expect(result.current.activeSimulation?.tests.map(test => test.id)).toEqual(['first', 'second', addedId]);
  });

  it('keeps both campaign memberships coherent after moving and deleting a chapter without rewriting an active snapshot', () => {
    const { result } = prepare(
      [campaign('route-a', ['first', 'second']), campaign('route-b', [])],
      [chapter('first'), chapter('second'), chapter('other', 'route-b')],
    );
    act(() => result.current.updateTest('first', { campaignId: 'route-b' }));
    expect(db.getCampaigns().map(item => [item.id, item.testIds])).toEqual([
      ['route-a', ['second']], ['route-b', ['other', 'first']],
    ]);
    act(() => result.current.startSimulation('route-b'));
    expect(result.current.activeSimulation?.tests.map(test => test.id)).toEqual(['other', 'first']);
    act(() => result.current.deleteTest('first'));
    expect(db.getCampaigns().find(item => item.id === 'route-b')?.testIds).toEqual(['other']);
    expect(db.getTests().some(test => test.id === 'first')).toBe(false);
    expect(result.current.activeSimulation?.tests.map(test => test.id)).toEqual(['other', 'first']);
  });

  it('unlocks an authored confession before applying the separate choice consequences', () => {
    const test: SymbolicTest = {
      ...chapter('confession'), puzzleType: 'confession',
      puzzleData: { confessionOptions: [
        { id: 'evasion', text: 'Avoid the observation', truthScore: 10 },
        { id: 'evidence', text: 'Acknowledge the observation', truthScore: 90 },
      ] },
    };
    const { result } = prepare([campaign('route-a', ['confession'])], [test]);
    act(() => result.current.startSimulation('route-a'));
    act(() => result.current.submitPuzzleAnswer('evidence'));
    expect(result.current.activeSimulation?.isPuzzleSolved).toBe(true);
    expect(result.current.activeSimulation?.isPuzzleActive).toBe(false);
    expect(result.current.activeSimulation?.decisions).toEqual([]);
    expect(result.current.activeSimulation?.scores.cooperation).toBe(50);
  });

  it('resolves a restored old slider snapshot using its own captured rule rather than changed catalogue data', () => {
    const oldTest: SymbolicTest = {
      ...chapter('old-slider'), puzzleType: 'sacrifice',
      puzzleData: { question: 'Transfer the requested amount.' },
      rules: 'Set slider to at least $60,000.',
    };
    const initial = prepare([campaign('route-a', ['old-slider'])], [oldTest]);
    act(() => initial.result.current.startSimulation('route-a'));
    expect(localStorage.getItem('jigsaw_active_sim')).toContain('at least $60,000');
    initial.unmount();

    const restored = prepare([campaign('route-a', ['old-slider'])], [
      { ...oldTest, rules: 'Set slider to at least $200,000.' },
    ]);
    expect(restored.result.current.activeSimulation?.tests[0].rules).toBe('Set slider to at least $60,000.');
    act(() => restored.result.current.submitPuzzleAnswer('80000'));
    expect(restored.result.current.activeSimulation?.isPuzzleSolved).toBe(true);
    expect(restored.result.current.activeSimulation?.decisions).toEqual([]);
  });

  it('restores an unfinished legacy choice snapshot with its configured scanner active and preserves solved snapshots', () => {
    const test: SymbolicTest = { ...chapter('coordinate'), puzzleData: { correctAnswer: 'B-3' } };
    const initial = prepare([campaign('route-a', ['coordinate'])], [test]);
    act(() => initial.result.current.startSimulation('route-a'));
    const snapshot = JSON.parse(localStorage.getItem('jigsaw_active_sim')!);
    initial.unmount();
    snapshot.isPuzzleActive = false;
    localStorage.setItem('jigsaw_active_sim', JSON.stringify(snapshot));
    const restored = prepare([campaign('route-a', ['coordinate'])], [test]);
    expect(restored.result.current.activeSimulation?.isPuzzleActive).toBe(true);
    act(() => restored.result.current.submitPuzzleAnswer('B-3'));
    expect(restored.result.current.activeSimulation?.isPuzzleActive).toBe(false);
    restored.unmount();
    const solved = prepare([campaign('route-a', ['coordinate'])], [test]);
    expect(solved.result.current.activeSimulation?.isPuzzleSolved).toBe(true);
    expect(solved.result.current.activeSimulation?.isPuzzleActive).toBe(false);
  });

  it('completes every preloaded step without skipping its puzzle or rewriting the saved narrative', () => {
    let completed = 0;
    for (const originalCampaign of PRELOADED_CAMPAIGNS) {
      localStorage.clear();
      const originalTests = PRELOADED_TESTS.filter(test => test.campaignId === originalCampaign.id);
      const { result, unmount } = prepare([originalCampaign], originalTests);
      act(() => result.current.startSimulation(originalCampaign.id));
      for (const id of originalCampaign.testIds) {
        const simulation = result.current.activeSimulation!;
        const test = simulation.tests[simulation.currentTestIndex];
        expect(test.id, id).toBe(id);
        expect(simulation.isPuzzleActive, id).toBe(true);
        const answer = test.puzzleData.correctAnswer ?? (test.puzzleType === 'confession' ? 'B-2' : '180000');
        act(() => result.current.submitPuzzleAnswer(answer));
        expect(result.current.activeSimulation?.isPuzzleSolved, id).toBe(true);
        act(() => result.current.submitChoice(test.choices[0].id));
        completed += 1;
      }
      expect(result.current.activeSimulation?.isFinished, originalCampaign.id).toBe(true);
      expect(result.current.activeSimulation?.decisions, originalCampaign.id).toHaveLength(originalCampaign.testIds.length);
      expect(db.getTests()).toEqual(originalTests);
      expect(db.getCampaigns()[0]).toMatchObject({
        title: originalCampaign.title, objective: originalCampaign.objective,
        fictionalLocation: originalCampaign.fictionalLocation, testIds: originalCampaign.testIds,
      });
      unmount();
    }
    expect(completed).toBe(PRELOADED_TESTS.length);
  });
});
