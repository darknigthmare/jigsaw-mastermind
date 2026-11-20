// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppProvider } from '../context/AppContext';
import { TestDesigner } from '../views/TestDesigner';
import type { SymbolicTest } from '../types';
import * as db from '../services/db';
import { originalStage, seedOriginalStage } from './puzzleFixtures';

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); localStorage.clear(); });

const definitions: [SymbolicTest['puzzleType'], SymbolicTest['puzzleData']][] = [
  ['logic', { question: 'Which signal?', correctAnswer: 'relay-blue', items: ['relay-blue', 'relay-amber'], gridItems: [{ id: 'record', name: 'Record', score: 8 }] }],
  ['confession', { question: 'Which observation?', confessionOptions: [
    { id: 'observation', text: 'Acknowledge the observation', truthScore: 90 },
    { id: 'delay', text: 'Postpone the observation', truthScore: 10 },
  ] }],
  ['maze', { question: 'Find the target index.', correctAnswer: '13' }],
  ['sacrifice', { question: 'Set the exact allocation.', correctAnswer: '180005.5' }],
  ['choice', { question: 'Which coordinate?', correctAnswer: 'D-4', items: ['D-4', 'D-5'] }],
];

describe('Test Designer preserves playable saved configurations', () => {
  it.each(definitions)('retains %s data, choice identities, hidden effects, endings and additional branches while renaming', (puzzleType, data) => {
    const puzzleData = { ...data, savedLayout: { route: 'observation', revision: 3 } };
    const original = originalStage({ puzzleType, puzzleData });
    original.choices.push({ id: 'third-id', text: 'Compare another record', narrativeImpact: 'The second record is checked.', scoresEffect: { courage: 12 }, endingType: 'Third ending' });
    seedOriginalStage(original);
    render(<AppProvider><TestDesigner /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    fireEvent.change(screen.getByLabelText('Test Title'), { target: { value: 'Revised signal title' } });
    fireEvent.click(screen.getByRole('button', { name: 'SAVE TEST LAYER' }));
    const saved = db.getTests()[0];
    expect(saved.title).toBe('Revised signal title');
    expect(saved.puzzleData).toEqual(puzzleData);
    expect(saved.choices).toEqual(original.choices);
    expect(saved.clues).toEqual(original.clues);
    expect(saved.safetyNote).toBe(original.safetyNote);
    expect(saved.id).toBe(original.id);
  });

  it('preserves a valid single-choice test instead of requiring or silently adding a second branch', () => {
    const test = originalStage({ puzzleType: 'choice', puzzleData: {} });
    test.choices = [test.choices[0]];
    seedOriginalStage(test);
    render(<AppProvider><TestDesigner /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: /^edit$/i }));
    fireEvent.click(screen.getByRole('button', { name: 'SAVE TEST LAYER' }));
    expect(db.getTests()[0].choices).toEqual(test.choices);
  });

  function startNew() {
    seedOriginalStage(originalStage());
    render(<AppProvider><TestDesigner /></AppProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'NEW TEST DESIGN' }));
    for (const [label, value] of [
      ['Select Campaign', 'original-route'], ['Assign Subject Character', 'original-subject'],
      ['Test Title', 'New signal puzzle'], ['Fictional Cassette Tape Message', 'Observe the colored indicator.'],
      ['Rules Statement', 'Enter the observed signal.'], ['Choice A text', 'Record the signal'], ['Choice B text', 'Wait for another signal'],
    ]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }

  it('creates a real text-answer puzzle and stores independent multiline clues', () => {
    startNew();
    fireEvent.change(screen.getByLabelText('Question présentée au joueur'), { target: { value: 'Which relay is lit?' } });
    fireEvent.change(screen.getByLabelText('Réponse exacte'), { target: { value: 'relay-blue' } });
    fireEvent.change(screen.getByLabelText('Clues Database (One per line)'), { target: { value: 'Read the indicator.\nCompare the color.' } });
    fireEvent.click(screen.getByRole('button', { name: 'SAVE TEST LAYER' }));
    const saved = db.getTests().find(test => test.id !== 'original-stage')!;
    expect(saved.puzzleData).toEqual({ question: 'Which relay is lit?', correctAnswer: 'relay-blue' });
    expect(saved.clues).toEqual(['Read the indicator.', 'Compare the color.']);
    expect(saved.choices).toHaveLength(2);
  });

  it('offers maze editing and rejects a newly authored puzzle without a resolvable answer', () => {
    startNew();
    fireEvent.change(screen.getByLabelText('Puzzle Type'), { target: { value: 'maze' } });
    fireEvent.click(screen.getByRole('button', { name: 'SAVE TEST LAYER' }));
    expect(screen.getByRole('alert').textContent).toContain('réponse exacte');
    expect(db.getTests()).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Réponse exacte'), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'SAVE TEST LAYER' }));
    expect(db.getTests().find(test => test.id !== 'original-stage')?.puzzleData.correctAnswer).toBe('100');
  });

  it('rejects ambiguous confession scores until the author supplies a real unique answer', () => {
    startNew();
    fireEvent.change(screen.getByLabelText('Puzzle Type'), { target: { value: 'confession' } });
    fireEvent.change(screen.getByLabelText('Texte de l’option 1'), { target: { value: 'Record observation' } });
    fireEvent.change(screen.getByLabelText('Texte de l’option 2'), { target: { value: 'Delay observation' } });
    fireEvent.click(screen.getByRole('button', { name: 'SAVE TEST LAYER' }));
    expect(screen.getByRole('alert').textContent).toContain('une seule réponse valide');
    fireEvent.change(screen.getByLabelText('Réponse exacte'), { target: { value: 'option-a' } });
    fireEvent.click(screen.getByRole('button', { name: 'SAVE TEST LAYER' }));
    expect(db.getTests().find(test => test.id !== 'original-stage')?.puzzleData.correctAnswer).toBe('option-a');
  });
});
