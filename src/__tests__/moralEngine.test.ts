import { describe, it, expect } from 'vitest';
import { calculateNextScores, determineEnding, INITIAL_MORAL_SCORES } from '../services/moralEngine';

describe('Moral Engine Tests', () => {
  describe('calculateNextScores', () => {
    it('should add positive deltas', () => {
      const scores = { ...INITIAL_MORAL_SCORES }; // All 50
      const next = calculateNextScores(scores, { truth: 20, empathy: 15 });
      expect(next.truth).toBe(70);
      expect(next.empathy).toBe(65);
      expect(next.responsibility).toBe(50); // Unchanged
    });

    it('should clamp scores to a maximum of 100', () => {
      const scores = { ...INITIAL_MORAL_SCORES };
      const next = calculateNextScores(scores, { courage: 60 });
      expect(next.courage).toBe(100);
    });

    it('should clamp scores to a minimum of 0', () => {
      const scores = { ...INITIAL_MORAL_SCORES };
      const next = calculateNextScores(scores, { denial: -80 });
      expect(next.denial).toBe(0);
    });
  });

  describe('determineEnding', () => {
    it('should resolve to Redemption Ending if truth and responsibility are high', () => {
      const scores = {
        responsibility: 80,
        truth: 85,
        empathy: 50,
        courage: 50,
        denial: 20,
        cooperation: 50,
        acceptance: 50
      };
      const ending = determineEnding(scores);
      expect(ending.type).toBe('Redemption Ending');
      expect(ending.title).toContain('Réveil');
    });

    it('should resolve to Denial Ending if denial is very high', () => {
      const scores = {
        responsibility: 30,
        truth: 30,
        empathy: 40,
        courage: 30,
        denial: 85,
        cooperation: 30,
        acceptance: 20
      };
      const ending = determineEnding(scores);
      expect(ending.type).toBe('Denial Ending');
      expect(ending.title).toContain('Labyrinthe');
    });

    it('should resolve to Mercy Ending if empathy and cooperation are high', () => {
      const scores = {
        responsibility: 50,
        truth: 50,
        empathy: 75,
        courage: 50,
        denial: 30,
        cooperation: 80,
        acceptance: 50
      };
      const ending = determineEnding(scores);
      expect(ending.type).toBe('Mercy Ending');
      expect(ending.title).toContain('Sacrifice');
    });

    it('should fall back to Mirror Ending for standard scores', () => {
      const ending = determineEnding(INITIAL_MORAL_SCORES);
      expect(ending.type).toBe('Mirror Ending');
    });
  });
});
