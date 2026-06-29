export interface UserSettings {
  theme: 'industrial-dark' | 'monochrome-dark' | 'clinical-green';
  visualNoise: boolean;
  narrativeIntensity: 'light' | 'dark' | 'grim';
  strictSafetyMode: boolean;
  localEncryptionEnabled: boolean;
}

export interface LoreEvent {
  id: string;
  title: string;
  period: 'pre-saw-i' | 'saw-i' | 'saw-x-interquel' | 'saw-i-ii-interval' | 'saw-ii' | 'saw-iii-iv' | 'posthumous' | 'apprentice-arcs' | 'fan-campaigns';
  summary: string;
  canonStatus: 'canon' | 'fanon' | 'custom';
  relatedCharacters: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  archetype: string;
  timelinePeriod: string;
  moralFlaw: string;
  symbolicFear: string;
  redemptionGoal: string;
  denialPattern: string;
  relationships: string;
  canonStatus: 'canon' | 'fanon' | 'custom';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  timelinePeriod: string;
  tone: string;
  moralTheme: string;
  fictionalLocation: string;
  objective: string;
  status: 'draft' | 'ready' | 'simulated' | 'archived';
  characterIds: string[];
  testIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChoiceBranch {
  id: string;
  text: string;
  scoresEffect: Partial<MoralScores>;
  narrativeImpact: string;
  endingType?: string; // If this choice immediately triggers an ending
}

export interface SymbolicTest {
  id: string;
  campaignId: string;
  characterId: string;
  title: string;
  moralTheme: string;
  openingTape: string;
  rules: string;
  puzzleType: 'logic' | 'confession' | 'choice' | 'maze' | 'sacrifice';
  puzzleData: {
    question?: string;
    correctAnswer?: string;
    items?: string[];
    confessionOptions?: { id: string; text: string; truthScore: number }[];
    gridItems?: { id: string; name: string; score: number }[];
  };
  clues: string[];
  timerSeconds: number;
  choices: ChoiceBranch[];
  safetyNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionLog {
  testId: string;
  choiceId: string;
  choiceText: string;
  timestamp: string;
  scoresAfter: MoralScores;
}

export interface SimulationRun {
  id: string;
  campaignId: string;
  startedAt: string;
  endedAt: string;
  decisions: DecisionLog[];
  finalScores: MoralScores;
  endingType: string;
  report: string;
}

export interface MoralScores {
  responsibility: number; // 0 to 100
  truth: number;          // 0 to 100
  empathy: number;        // 0 to 100
  courage: number;        // 0 to 100
  denial: number;         // 0 to 100
  cooperation: number;    // 0 to 100
  acceptance: number;     // 0 to 100
}
