import type { MoralScores } from '../types';

export const INITIAL_MORAL_SCORES: MoralScores = {
  responsibility: 50,
  truth: 50,
  empathy: 50,
  courage: 50,
  denial: 50,
  cooperation: 50,
  acceptance: 50
};

/**
 * Calculates updated moral scores by applying an effect delta and clamping scores between 0 and 100.
 */
export function calculateNextScores(currentScores: MoralScores, effect: Partial<MoralScores>): MoralScores {
  const next = { ...currentScores };
  
  Object.keys(effect).forEach((key) => {
    const k = key as keyof MoralScores;
    const change = effect[k] || 0;
    next[k] = Math.max(0, Math.min(100, currentScores[k] + change));
  });

  return next;
}

export interface EndingDetails {
  type: string;
  title: string;
  description: string;
}

/**
 * Evaluates the final scores to determine the narrative ending.
 */
export function determineEnding(scores: MoralScores): EndingDetails {
  // 1. Redemption Ending: High Truth + High Responsibility
  if (scores.truth >= 70 && scores.responsibility >= 70) {
    return {
      type: 'Redemption Ending',
      title: 'Le Réveil de la Conscience (Redemption Ending)',
      description: 'A hard-won path. By embracing full culpability and speaking the raw, unfiltered truth, the subject has shattered their old persona and emerged morally rehabilitated.'
    };
  }

  // 2. Denial Ending: Very High Denial
  if (scores.denial >= 75) {
    return {
      type: 'Denial Ending',
      title: 'Le Labyrinthe des Justifications (Denial Ending)',
      description: 'The subject refused to face their actions, burying their guilt under a mountain of rationalizations. They remain trapped in a prison of their own design.'
    };
  }

  // 3. Mercy Ending: High Empathy + High Cooperation
  if (scores.empathy >= 70 && scores.cooperation >= 70) {
    return {
      type: 'Mercy Ending',
      title: 'Le Sacrifice Solidaire (Mercy Ending)',
      description: 'Recognizing that their mistakes affected others, the subject chose solidarity, cooperation, and mutual assistance over selfish preservation.'
    };
  }

  // 4. Self-Awareness Ending: High Courage + High Acceptance
  if (scores.courage >= 70 && scores.acceptance >= 70) {
    return {
      type: 'Self-Awareness Ending',
      title: 'Le Regard dans le Miroir (Self-Awareness Ending)',
      description: 'Though the narrative cost was immense, the subject looked into the mirror without blinking, accepting the weight of their choices.'
    };
  }

  // 5. Collapse of Persona: Low Responsibility + High Denial
  if (scores.responsibility < 35 && scores.denial >= 60) {
    return {
      type: 'Collapse of Persona',
      title: 'L\'Effondrement du Masque (Collapse of Persona)',
      description: 'Under the weight of absolute contradiction, the subject\'s self-deception broke down, leaving them in psychological ruins, unable to justify their actions or rebuild their character.'
    };
  }

  // 6. Hollow Victory: High Truth + Low Empathy
  if (scores.truth >= 60 && scores.empathy < 35) {
    return {
      type: 'Hollow Victory',
      title: 'Une Victoire Vide (Hollow Victory)',
      description: 'A cold, mechanical truth was spoken, but with zero concern for the lives impacted. The clock stopped and they survived the ordeal, but the triumph is empty.'
    };
  }

  // Default: Mirror Ending (Balanced / Middle Ground)
  return {
    type: 'Mirror Ending',
    title: 'Le Seuil de la Réflexion (Mirror Ending)',
    description: 'The subject has seen their reflection clearly, but remains paralyzed on the threshold of transformation, neither fully redeeming themselves nor completely denying their fault.'
  };
}
