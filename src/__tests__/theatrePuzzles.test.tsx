// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider, useApp } from '../context/AppContext';
import { TheatreMode } from '../views/TheatreMode';
import type { SymbolicTest } from '../types';
import { originalStage, seedOriginalStage } from './puzzleFixtures';

vi.mock('../components/common/TheatreScene', () => ({ TheatreScene: () => null }));
vi.mock('../components/common/TapePlayer', () => ({ TapePlayer: ({ onTogglePlay }: { onTogglePlay: (playing: boolean) => void }) =>
  <button onClick={() => onTogglePlay(false)}>Pause narrative</button> }));
vi.mock('../services/sound', () => ({
  startTapeHum: vi.fn(), stopTapeHum: vi.fn(), playClick: vi.fn(), playBeep: vi.fn(),
  playChime: vi.fn(), playAlarm: vi.fn(), playTick: vi.fn(), playBillyLaughter: vi.fn(),
}));

function Harness() {
  const app = useApp();
  return app.activeSimulation ? <TheatreMode /> : <button onClick={() => app.startSimulation('original-route')}>Launch original route</button>;
}
function mountRun(test: SymbolicTest) {
  seedOriginalStage(test);
  const view = render(<AppProvider><Harness /></AppProvider>);
  fireEvent.click(screen.getByRole('button', { name: 'Launch original route' }));
  fireEvent.click(screen.getByRole('button', { name: 'Pause narrative' }));
  return view;
}

beforeEach(() => { vi.useFakeTimers(); localStorage.clear(); });
afterEach(() => { cleanup(); localStorage.clear(); vi.useRealTimers(); });

describe('Theatre controls express authored puzzle answers', () => {
  it.each(['logic', 'maze', 'choice'] as const)('accepts a custom text answer in %s instead of forcing an unrelated mechanism', puzzleType => {
    mountRun(originalStage({ puzzleType, puzzleData: { question: 'Which signal?', correctAnswer: 'relay-blue' } }));
    const input = screen.getByLabelText('Réponse à l’énigme');
    expect(input.getAttribute('type')).toBe('text');
    expect(screen.queryByRole('button', { name: /^Continue the route/ })).toBeNull();
    fireEvent.change(input, { target: { value: 'relay-blue' } });
    fireEvent.click(screen.getByRole('button', { name: 'Valider la réponse' }));
    expect(screen.getByRole('button', { name: /^Continue the route/ })).toBeTruthy();
  });

  it('accepts and saves a real date beyond the old fixed year list', () => {
    mountRun(originalStage({ puzzleData: { correctAnswer: '2038-06-21' } }));
    const input = screen.getByLabelText('Date de calibration');
    expect(input.getAttribute('type')).toBe('date');
    fireEvent.change(input, { target: { value: '2038-06-21' } });
    expect(JSON.parse(localStorage.getItem('jigsaw_active_sim')!).puzzleInput).toBe('2038-06-21');
    fireEvent.click(screen.getByRole('button', { name: 'Valider la réponse' }));
    expect(screen.getByRole('button', { name: /^Continue the route/ })).toBeTruthy();
  });

  it('requires a configured coordinate puzzle before showing its narrative choices', () => {
    mountRun(originalStage({ puzzleType: 'choice', puzzleData: { correctAnswer: 'B-3' } }));
    expect(screen.queryByRole('button', { name: /^Continue the route/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'B-3' }));
    fireEvent.click(screen.getByRole('button', { name: 'SCAN SELECTED COORDINATE TILE' }));
    expect(screen.getByRole('button', { name: /^Continue the route/ })).toBeTruthy();
  });

  it('uses a reachable gear target other than 15 and persists the in-progress gear sum', () => {
    const test = originalStage({ puzzleType: 'maze', puzzleData: { correctAnswer: '13' } });
    const initial = mountRun(test);
    fireEvent.click(screen.getByRole('button', { name: 'ROTATE (+3)' }));
    expect(JSON.parse(localStorage.getItem('jigsaw_active_sim')!).puzzleInput).toBe('3');
    initial.unmount();
    render(<AppProvider><Harness /></AppProvider>);
    expect(screen.getByText('3 / 13 index')).toBeTruthy();
    for (let click = 0; click < 5; click += 1) fireEvent.click(screen.getByRole('button', { name: 'ROTATE (+2)' }));
    expect(screen.getByText('13 / 13 index')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Valider l’alignement' }));
    expect(screen.getByRole('button', { name: /^Continue the route/ })).toBeTruthy();
  });

  it('can submit an exact decimal scale value outside the old range and step', () => {
    mountRun(originalStage({ puzzleType: 'sacrifice', puzzleData: { correctAnswer: '380005.5' } }));
    const slider = screen.getByRole('slider');
    expect(Number(slider.getAttribute('max'))).toBeGreaterThanOrEqual(380005.5);
    fireEvent.change(screen.getByLabelText('Valeur exacte'), { target: { value: '380005.5' } });
    fireEvent.click(screen.getByRole('button', { name: 'CALIBRATE SCALES BALANCE' }));
    expect(screen.getByRole('button', { name: /^Continue the route/ })).toBeTruthy();
  });
});
