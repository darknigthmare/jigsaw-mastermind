import { describe, it, expect } from 'vitest';
import { checkTextSafety, autoRewrite, sanitizeCampaignData } from '../services/safety';

describe('Safety Layer Tests', () => {
  describe('checkTextSafety', () => {
    it('should pass for safe fictional text', () => {
      const safeText = "The character must solve a logic puzzle to retrieve the code for the archive.";
      const result = checkTextSafety(safeText);
      expect(result.isSafe).toBe(true);
      expect(result.blockedTerm).toBeUndefined();
    });

    it('should catch violent weapons keywords', () => {
      const unsafeText = "The character is locked in a room with a knife on the table.";
      const result = checkTextSafety(unsafeText);
      expect(result.isSafe).toBe(false);
      expect(result.blockedTerm?.toLowerCase()).toBe('knife');
    });

    it('should catch lethal intent keywords', () => {
      const unsafeText = "The goal is to kill the participant if they fail the riddle.";
      const result = checkTextSafety(unsafeText);
      expect(result.isSafe).toBe(false);
      expect(result.blockedTerm?.toLowerCase()).toBe('kill');
    });

    it('should catch real-world surveillance keywords', () => {
      const unsafeText = "I want to track location of my neighbor using GPS.";
      const result = checkTextSafety(unsafeText);
      expect(result.isSafe).toBe(false);
      expect(result.blockedTerm?.toLowerCase()).toBe('track location');
    });
  });

  describe('autoRewrite', () => {
    it('should rewrite trap to symbolic test and blood to truth', () => {
      const originalText = "A dangerous trap that requires blood to open.";
      const rewritten = autoRewrite(originalText);
      expect(rewritten).toContain("symbolic test");
      expect(rewritten).toContain("truth");
      expect(rewritten).not.toContain("trap");
      expect(rewritten).not.toContain("blood");
    });

    it('should rewrite kill him/her/them to confront narratively', () => {
      const text = "We will abduct him and kill him.";
      const rewritten = autoRewrite(text);
      expect(rewritten).toContain("confront him narratively");
    });
  });

  describe('sanitizeCampaignData', () => {
    it('should return isSafe: false and rewrite data when unsafe inputs are present', () => {
      const campaignInput = {
        title: "The poison vault",
        objective: "To teach them a lesson with acid",
        fictionalLocation: "An old bathroom"
      };
      
      const result = sanitizeCampaignData(campaignInput);
      expect(result.isSafe).toBe(false);
      expect(result.blockedTerm).toBeDefined();
      expect(result.sanitized.title).not.toContain("poison");
      expect(result.sanitized.title).toContain("dilemma");
      expect(result.sanitized.objective).not.toContain("acid");
    });
  });
});
