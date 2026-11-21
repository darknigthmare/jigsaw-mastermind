// @vitest-environment jsdom
/// <reference types="node" />
import type { ReactNode } from 'react';
import { webcrypto } from 'node:crypto';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as db from '../services/db';
import { AppProvider, useApp } from '../context/AppContext';
import { TheatreMode } from '../views/TheatreMode';
import { PRELOADED_CAMPAIGNS, PRELOADED_TESTS } from '../services/preloadedData';
import { DERNIER_RELAIS_CAMPAIGN, DERNIER_RELAIS_CHARACTERS, DERNIER_RELAIS_CONTENT_ID, DERNIER_RELAIS_TESTS, getDernierRelaisEnding } from '../services/dernierRelaisData';
import { UNE_DE_MINUIT_CAMPAIGN, UNE_DE_MINUIT_CHARACTERS, UNE_DE_MINUIT_CONTENT_ID, UNE_DE_MINUIT_TESTS } from '../services/laUneDeMinuitData';
import { ROSTER_CAMPAIGN, ROSTER_CHARACTERS, ROSTER_CONTENT_ID, ROSTER_TESTS } from '../services/rosterData';
import { INITIAL_MORAL_SCORES } from '../services/moralEngine';
import { getPuzzleControl, isPuzzleAnswerCorrect, resolveCampaignTests } from '../services/simulationRules';

vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));
vi.mock('../components/common/TheatreScene', () => ({ TheatreScene: () => null }));
vi.mock('../components/common/TapePlayer', () => ({ TapePlayer: ({ onTogglePlay }: { onTogglePlay: (playing: boolean) => void }) => <button onClick={() => onTogglePlay(false)}>Terminer l’écoute</button> }));

function legacyLibrary() {
  db.saveCampaigns([{ ...PRELOADED_CAMPAIGNS[0], title: 'Mon ancien titre modifié', testIds: ['test-s1-bathroom'] }]);
  db.saveCharacters([]);
  db.saveTests([{ ...PRELOADED_TESTS.find(test => test.id === 'test-s1-bathroom')!, openingTape: 'Mon texte personnel conservé.', timerSeconds: 253 }]);
  db.saveTimeline([]);
  db.saveRuns([]);
}
function appHook() {
  return renderHook(() => useApp(), { wrapper: ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider> });
}
beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); localStorage.clear(); });

describe('Le Dernier Relais: additive delivery', () => {
  it('adds only the new pack to an existing library before React reads its first state', () => {
    legacyLibrary();
    const oldCampaign = JSON.parse(localStorage.getItem('jigsaw_campaigns')!)[0];
    const oldTest = JSON.parse(localStorage.getItem('jigsaw_tests')!)[0];
    localStorage.setItem('jigsaw_active_sim', 'old snapshot bytes');
    db.initializeDB();
    expect(localStorage.getItem('jigsaw_active_sim')).toBe('old snapshot bytes');
    localStorage.removeItem('jigsaw_active_sim');
    const { result } = appHook();
    expect(result.current.campaigns.map(campaign => campaign.id)).toEqual([oldCampaign.id, DERNIER_RELAIS_CAMPAIGN.id, UNE_DE_MINUIT_CAMPAIGN.id, ROSTER_CAMPAIGN.id]);
    expect(result.current.campaigns[0]).toEqual(oldCampaign);
    expect(result.current.tests[0]).toEqual(oldTest);
    expect(result.current.tests).toHaveLength(17);
    expect(result.current.characters).toEqual([...DERNIER_RELAIS_CHARACTERS, ...UNE_DE_MINUIT_CHARACTERS, ...ROSTER_CHARACTERS]);
    expect(db.getCampaigns()).toHaveLength(4);
    expect(db.getTests()).toHaveLength(17);
    expect(JSON.parse(localStorage.getItem(db.CONTENT_INSTALLATIONS_KEY)!)).toEqual([DERNIER_RELAIS_CONTENT_ID, UNE_DE_MINUIT_CONTENT_ID, ROSTER_CONTENT_ID]);
  });

  it('does not confuse freshly filled missing lists with a pack installed in an old partial library', () => {
    db.saveCampaigns([]);
    db.saveTests([]);
    expect(db.getCampaigns()).toEqual([DERNIER_RELAIS_CAMPAIGN, UNE_DE_MINUIT_CAMPAIGN, ROSTER_CAMPAIGN]);
    expect(db.getTests()).toEqual([...DERNIER_RELAIS_TESTS, ...UNE_DE_MINUIT_TESTS, ...ROSTER_TESTS]);
    expect(db.getCharacters().filter(character => character.id.startsWith('char-dernier-relais-'))).toEqual(DERNIER_RELAIS_CHARACTERS);
  });

  it('preserves edits and deletions after delivery, including deleting the entire pack', () => {
    db.initializeDB();
    db.saveCampaigns([{ ...DERNIER_RELAIS_CAMPAIGN, title: 'Ma réécriture', testIds: [DERNIER_RELAIS_TESTS[2].id] }]);
    db.saveTests([{ ...DERNIER_RELAIS_TESTS[2], puzzleData: { correctAnswer: '42' }, openingTape: 'Ma propre restitution.' }]);
    db.saveCharacters([]);
    db.initializeDB();
    expect(db.getCampaigns()[0].title).toBe('Ma réécriture');
    expect(db.getTests()).toHaveLength(1);
    expect(db.getTests()[0].puzzleData.correctAnswer).toBe('42');
    expect(db.getCharacters()).toEqual([]);
    db.saveCampaigns([]); db.saveTests([]);
    db.initializeDB();
    expect(db.getCampaigns()).toEqual([]);
    expect(db.getTests()).toEqual([]);
  });

  it('retries an interrupted installation by ID without replacing edited records or duplicating them', () => {
    legacyLibrary();
    const originalSetItem = Storage.prototype.setItem;
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      if (key === 'jigsaw_tests' && value.includes(DERNIER_RELAIS_TESTS[0].id)) {
        throw new DOMException('Simulated full storage', 'QuotaExceededError');
      }
      originalSetItem.call(this, key, value);
    });
    expect(() => db.initializeDB()).toThrow('Simulated full storage');
    expect(localStorage.getItem(db.CONTENT_INSTALLATIONS_KEY)).toBeNull();
    write.mockRestore();
    const partial = JSON.parse(localStorage.getItem('jigsaw_campaigns')!);
    db.saveCampaigns(partial.map((campaign: typeof DERNIER_RELAIS_CAMPAIGN) => campaign.id === DERNIER_RELAIS_CAMPAIGN.id ? { ...campaign, title: 'Titre modifié pendant la reprise' } : campaign));
    db.initializeDB();
    expect(db.getCampaigns().filter(campaign => campaign.id === DERNIER_RELAIS_CAMPAIGN.id)).toHaveLength(1);
    expect(db.getCampaigns().find(campaign => campaign.id === DERNIER_RELAIS_CAMPAIGN.id)?.title).toBe('Titre modifié pendant la reprise');
    expect(db.getTests().filter(test => test.campaignId === DERNIER_RELAIS_CAMPAIGN.id)).toEqual(DERNIER_RELAIS_TESTS);
    expect(localStorage.getItem(db.CONTENT_INSTALLATIONS_KEY)).toContain(DERNIER_RELAIS_CONTENT_ID);
  });

  it('carries delivery history through a backup so deleted content stays deleted in a clean browser', () => {
    db.initializeDB(); db.saveCampaigns([]); db.saveTests([]); db.saveCharacters([]);
    const exported = db.exportBackupJSON();
    expect(JSON.parse(exported).contentInstallations).toContain(DERNIER_RELAIS_CONTENT_ID);
    localStorage.clear();
    expect(db.importBackupJSON(exported)).toBe(true);
    expect(db.getCampaigns()).toEqual([]);
    expect(db.getTests()).toEqual([]);
    expect(db.getCharacters()).toEqual([]);
  });

  it('replaces a local journal when importing an older backup and preserves its edited content', () => {
    legacyLibrary();
    const backup = {
      settings: db.getSettings(), campaigns: JSON.parse(localStorage.getItem('jigsaw_campaigns')!),
      characters: [], tests: JSON.parse(localStorage.getItem('jigsaw_tests')!), timeline: [], runs: [],
    };
    db.initializeDB();
    expect(db.importBackupJSON(JSON.stringify(backup))).toBe(true);
    expect(db.getCampaigns().map(campaign => campaign.id)).toEqual([backup.campaigns[0].id, DERNIER_RELAIS_CAMPAIGN.id, UNE_DE_MINUIT_CAMPAIGN.id, ROSTER_CAMPAIGN.id]);
    expect(db.getTests()[0]).toEqual(backup.tests[0]);
  });

  it('does not mutate any key while the existing vault is marked encrypted', () => {
    legacyLibrary();
    localStorage.setItem('jigsaw_is_encrypted', 'true');
    localStorage.setItem('jigsaw_encrypted_vault', 'opaque encrypted bytes');
    const before = { ...localStorage };
    db.initializeDB(); db.getCampaigns(); db.getCharacters(); db.getTests();
    expect({ ...localStorage }).toEqual(before);
    localStorage.setItem('jigsaw_is_encrypted', 'false');
    expect(db.getCampaigns().some(campaign => campaign.id === DERNIER_RELAIS_CAMPAIGN.id)).toBe(true);
    expect(localStorage.getItem('jigsaw_encrypted_vault')).toBe('opaque encrypted bytes');
  });

  it('preserves deleted-pack history through a real encrypted backup round trip', async () => {
    vi.useRealTimers();
    vi.spyOn(window, 'crypto', 'get').mockReturnValue(webcrypto as unknown as Crypto);
    db.initializeDB(); db.saveCampaigns([]); db.saveTests([]); db.saveCharacters([]);
    expect(await db.encryptVault('phrase fictive de test')).toBe(true);
    const encrypted = localStorage.getItem('jigsaw_encrypted_vault')!;
    localStorage.clear();
    localStorage.setItem('jigsaw_encrypted_vault', encrypted);
    localStorage.setItem('jigsaw_is_encrypted', 'true');
    db.initializeDB();
    expect(localStorage.getItem('jigsaw_campaigns')).toBeNull();
    expect(await db.decryptVault('phrase fictive de test')).toBe(true);
    expect(db.getCampaigns()).toEqual([]);
    expect(db.getTests()).toEqual([]);
    expect(db.getCharacters()).toEqual([]);
    expect(localStorage.getItem(db.CONTENT_INSTALLATIONS_KEY)).toContain(DERNIER_RELAIS_CONTENT_ID);
  });

  it('encrypts and restores the complete library without exceeding the engine argument limit', async () => {
    vi.useRealTimers();
    vi.spyOn(window, 'crypto', 'get').mockReturnValue(webcrypto as unknown as Crypto);
    db.initializeDB();
    const backup = db.exportBackupJSON();
    expect(new TextEncoder().encode(backup).length).toBeGreaterThan(131072);
    expect(await db.encryptVault('phrase complète de test')).toBe(true);
    const encrypted = localStorage.getItem('jigsaw_encrypted_vault')!;
    localStorage.clear();
    localStorage.setItem('jigsaw_encrypted_vault', encrypted);
    localStorage.setItem('jigsaw_is_encrypted', 'true');
    expect(await db.decryptVault('phrase complète de test')).toBe(true);
    expect(JSON.parse(db.exportBackupJSON())).toEqual(JSON.parse(backup));
    expect(db.getCampaigns()).toHaveLength(PRELOADED_CAMPAIGNS.length);
    expect(db.getTests()).toHaveLength(PRELOADED_TESTS.length);
  });
});

describe('Le Dernier Relais: playable authored route', () => {
  it('keeps the authored French endings within their original final choices and respects explicit edited endings', () => {
    const decision = (choiceId: string) => ({ testId: 'saved-stage', choiceId, choiceText: choiceId, timestamp: '', scoresAfter: INITIAL_MORAL_SCORES });
    expect(getDernierRelaisEnding(DERNIER_RELAIS_CAMPAIGN.id, [decision('choice-dernier-relais-reserver')])?.title).toBe('La clôture laisse une dette');
    expect(getDernierRelaisEnding(DERNIER_RELAIS_CAMPAIGN.id, [decision('choice-dernier-relais-partager')])?.title).toBe('Une transmission sous réserve');
    expect(getDernierRelaisEnding(DERNIER_RELAIS_CAMPAIGN.id, ['choice-dernier-relais-joindre', 'choice-dernier-relais-verifier', 'choice-dernier-relais-partager'].map(decision))?.title).toBe('Le relais est transmis');
    expect(getDernierRelaisEnding(DERNIER_RELAIS_CAMPAIGN.id, [decision('edited-final-choice')])).toBeUndefined();
    db.initializeDB();
    const final = { ...DERNIER_RELAIS_TESTS[2], choices: [{ ...DERNIER_RELAIS_TESTS[2].choices[0], endingType: 'Fin choisie par l’auteur' }] };
    db.saveTests([final]);
    db.saveCampaigns([{ ...DERNIER_RELAIS_CAMPAIGN, testIds: [final.id] }]);
    const { result } = appHook();
    act(() => result.current.startSimulation(DERNIER_RELAIS_CAMPAIGN.id));
    act(() => result.current.submitPuzzleAnswer('270'));
    act(() => result.current.submitChoice(final.choices[0].id));
    expect(db.getRuns()[0].endingType).toBe('Fin choisie par l’auteur');
    expect(result.current.activeSimulation?.ending?.title).not.toBe('Une transmission sous réserve');
  });

  it('uses a real calendar, a unique inventory association and an integrated arithmetic answer', () => {
    expect(resolveCampaignTests(DERNIER_RELAIS_CAMPAIGN, DERNIER_RELAIS_TESTS).map(test => test.id)).toEqual(DERNIER_RELAIS_CAMPAIGN.testIds);
    expect(new Date('2028-10-10T00:00:00Z').getUTCDay()).toBe(2);
    expect(getPuzzleControl(DERNIER_RELAIS_TESTS[0]).kind).toBe('date');
    expect(getPuzzleControl(DERNIER_RELAIS_TESTS[1]).kind).toBe('coordinates');
    expect(getPuzzleControl(DERNIER_RELAIS_TESTS[2]).kind).toBe('answer');
    expect(isPuzzleAnswerCorrect(DERNIER_RELAIS_TESTS[0], '2028-10-03')).toBe(false);
    expect(isPuzzleAnswerCorrect(DERNIER_RELAIS_TESTS[1], 'B-1')).toBe(false);
    expect(isPuzzleAnswerCorrect(DERNIER_RELAIS_TESTS[2], '90')).toBe(false);
    expect(540 - 90 - 180).toBe(270);
  });

  it('completes the actual Theatre widgets, restores the middle stage and records the French ending', () => {
    function Harness() {
      const app = useApp();
      return app.activeSimulation ? <TheatreMode /> : <button onClick={() => app.startSimulation(DERNIER_RELAIS_CAMPAIGN.id)}>Lancer Le Dernier Relais</button>;
    }
    const mounted = render(<AppProvider><Harness /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Lancer Le Dernier Relais' }));
    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.change(screen.getByLabelText('Date de calibration'), { target: { value: '2028-10-10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider la réponse' }));
    fireEvent.click(screen.getByRole('button', { name: /^Joindre le bordereau/ }));
    mounted.unmount();
    render(<AppProvider><Harness /></AppProvider>);
    expect(JSON.parse(localStorage.getItem('jigsaw_active_sim')!).currentTestIndex).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.click(screen.getByRole('button', { name: 'C-2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Valider le casier' }));
    fireEvent.click(screen.getByRole('button', { name: /^Signer la caisse/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Terminer l’écoute' }));
    fireEvent.change(screen.getByLabelText('Réponse à l’énigme'), { target: { value: '270' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider la réponse' }));
    fireEvent.click(screen.getByRole('button', { name: /^Répartir le solde/ }));
    expect(screen.getByText('Le relais est transmis')).toBeTruthy();
    const run = db.getRuns()[0];
    expect(run.campaignId).toBe(DERNIER_RELAIS_CAMPAIGN.id);
    expect(run.decisions).toHaveLength(3);
    expect(run.endingType).toBe('Dernier Relais — Transmission');
    expect(run.report).toContain('01 — Le calendrier des archives');
    expect(run.report).toContain('03 — Le solde à restituer');
    expect(db.getCampaigns().find(campaign => campaign.id === DERNIER_RELAIS_CAMPAIGN.id)?.status).toBe('simulated');
  });
});
