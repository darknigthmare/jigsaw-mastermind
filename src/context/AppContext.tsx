import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type {
  UserSettings,
  Campaign,
  CharacterProfile,
  SymbolicTest,
  LoreEvent,
  SimulationRun,
  MoralScores,
  DecisionLog
} from '../types';
import * as db from '../services/db';
import * as sound from '../services/sound';
import { checkTextSafety, autoRewrite } from '../services/safety';
import { calculateNextScores, determineEnding, INITIAL_MORAL_SCORES } from '../services/moralEngine';
import type { EndingDetails } from '../services/moralEngine';

interface ActiveSimulation {
  campaign: Campaign;
  tests: SymbolicTest[];
  currentTestIndex: number;
  scores: MoralScores;
  decisions: DecisionLog[];
  timerLeft: number;
  isPlayingTape: boolean;
  isFinished: boolean;
  ending?: EndingDetails;
  textPrinted: string;
  isPuzzleSolved: boolean;
  puzzleInput: string;
  puzzleAttempts: number;
  isPuzzleActive: boolean;
  revealedCluesIndices: number[];
}

interface AppContextType {
  currentView: string;
  selectedId: string | null;
  setView: (view: string, id?: string | null) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  campaigns: Campaign[];
  characters: CharacterProfile[];
  tests: SymbolicTest[];
  timeline: LoreEvent[];
  runs: SimulationRun[];
  
  // CRUD Campaigns
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // CRUD Characters
  addCharacter: (character: Omit<CharacterProfile, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCharacter: (id: string, character: Partial<CharacterProfile>) => void;
  deleteCharacter: (id: string) => void;

  // CRUD Tests
  addTest: (test: Omit<SymbolicTest, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTest: (id: string, test: Partial<SymbolicTest>) => void;
  deleteTest: (id: string) => void;

  // CRUD Timeline Events
  addLoreEvent: (event: Omit<LoreEvent, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateLoreEvent: (id: string, event: Partial<LoreEvent>) => void;
  deleteLoreEvent: (id: string) => void;

  // Simulation (Theatre Mode)
  activeSimulation: ActiveSimulation | null;
  startSimulation: (campaignId: string) => void;
  submitChoice: (choiceId: string) => void;
  toggleTapePlayback: (playing: boolean) => void;
  exitSimulation: () => void;
  submitPuzzleAnswer: (answer: string) => void;
  setPuzzleInput: (input: string) => void;
  revealClue: (clueIndex: number) => void;

  // Security / Local Backup
  safetyTriggered: { triggered: boolean; term?: string; suggestion?: string } | null;
  dismissSafetyAlert: () => void;
  exportDatabase: () => string;
  importDatabase: (jsonStr: string) => boolean;
  encryptVault: (passphrase: string) => Promise<boolean>;
  decryptVault: (passphrase: string) => Promise<boolean>;
  isVaultEncrypted: boolean;
  resetAll: () => void;
  
  // Console logging console
  logs: string[];
  addLog: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Console logging console
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-35), `[${timestamp}] ${message}`]);
  };

  // Initialize Database
  useEffect(() => {
    db.initializeDB();
    addLog("SYSTEM: Local vault database layers loaded.");
    addLog("LORE: Loaded canon continuity timeline database (5 distinct eras parsed).");
    addLog("LORE: Warning - Retcon detected in Logan Nelson files (2017 Jigsaw script).");
    addLog("LORE: Warning - Mexico interquel gap calibrated (Saw X timeline matched).");
    
    // Restore active simulation if it exists
    const savedSim = localStorage.getItem('jigsaw_active_sim');
    if (savedSim) {
      try {
        const parsed = JSON.parse(savedSim);
        setActiveSimulation(parsed);
        setCurrentViewState('theatre');
        addLog("SYSTEM: Resumed active simulation: " + parsed.campaign.title);
      } catch (e) {
        localStorage.removeItem('jigsaw_active_sim');
      }
    }
  }, []);

  const [currentView, setCurrentViewState] = useState<string>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<UserSettings>(db.getSettings);
  const [campaigns, setCampaigns] = useState<Campaign[]>(db.getCampaigns);
  const [characters, setCharacters] = useState<CharacterProfile[]>(db.getCharacters);
  const [tests, setTests] = useState<SymbolicTest[]>(db.getTests);
  const [timeline, setTimeline] = useState<LoreEvent[]>(db.getTimeline);
  const [runs, setRuns] = useState<SimulationRun[]>(db.getRuns);
  
  const [activeSimulation, setActiveSimulation] = useState<ActiveSimulation | null>(null);
  const [safetyTriggered, setSafetyTriggered] = useState<{ triggered: boolean; term?: string; suggestion?: string } | null>(null);
  const [isVaultEncrypted, setIsVaultEncrypted] = useState<boolean>(db.isVaultEncrypted);
  
  const timerRef = useRef<any | null>(null);
  const typewriterRef = useRef<any | null>(null);

  // Monitor active simulation changes to auto-save
  useEffect(() => {
    if (activeSimulation) {
      localStorage.setItem('jigsaw_active_sim', JSON.stringify(activeSimulation));
    } else {
      localStorage.removeItem('jigsaw_active_sim');
    }
  }, [activeSimulation]);

  // Sync state helpers
  const refreshState = () => {
    setSettings(db.getSettings());
    setCampaigns(db.getCampaigns());
    setCharacters(db.getCharacters());
    setTests(db.getTests());
    setTimeline(db.getTimeline());
    setRuns(db.getRuns());
    setIsVaultEncrypted(db.isVaultEncrypted());
  };

  const setView = (view: string, id: string | null = null) => {
    setCurrentViewState(view);
    setSelectedId(id);
    addLog(`NAVIGATE: Shifted console view to [${view.toUpperCase()}]`);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    db.saveSettings(updated);
    addLog("SETTINGS: Updated system configurations.");
    if (newSettings.theme) {
      addLog(`SETTINGS: Theme shifted to [${newSettings.theme.toUpperCase()}]`);
    }
  };

  // --- Campaign CRUD ---
  const addCampaign = (c: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (settings.strictSafetyMode) {
      const safetyCheck = checkTextSafety(c.title + ' ' + c.objective + ' ' + c.fictionalLocation);
      if (!safetyCheck.isSafe) {
        setSafetyTriggered({
          triggered: true,
          term: safetyCheck.blockedTerm,
          suggestion: safetyCheck.suggestedRewrite
        });
        addLog(`SAFETY: Sanitized title/description containing unsafe word [${safetyCheck.blockedTerm}]`);
        c.title = autoRewrite(c.title);
        c.objective = autoRewrite(c.objective);
        c.fictionalLocation = autoRewrite(c.fictionalLocation);
      }
    }

    const id = `camp-${Math.random().toString(36).substr(2, 9)}`;
    const newCampaign: Campaign = {
      ...c,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...campaigns, newCampaign];
    setCampaigns(updated);
    db.saveCampaigns(updated);
    addLog(`ARCHITECT: Initialized campaign schematic: [${newCampaign.title}]`);
    return id;
  };

  const updateCampaign = (id: string, c: Partial<Campaign>) => {
    const updated = campaigns.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...c, updatedAt: new Date().toISOString() };
        if (settings.strictSafetyMode) {
          const safetyCheck = checkTextSafety(merged.title + ' ' + merged.objective + ' ' + merged.fictionalLocation);
          if (!safetyCheck.isSafe) {
            setSafetyTriggered({
              triggered: true,
              term: safetyCheck.blockedTerm,
              suggestion: safetyCheck.suggestedRewrite
            });
            addLog(`SAFETY: Sanitized modifications containing unsafe word [${safetyCheck.blockedTerm}]`);
            merged.title = autoRewrite(merged.title);
            merged.objective = autoRewrite(merged.objective);
            merged.fictionalLocation = autoRewrite(merged.fictionalLocation);
          }
        }
        return merged;
      }
      return item;
    });
    setCampaigns(updated);
    db.saveCampaigns(updated);
    addLog(`ARCHITECT: Modified campaign schematic ID [${id}]`);
  };

  const deleteCampaign = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    db.saveCampaigns(updated);
    addLog(`ARCHITECT: Purged campaign schematic ID [${id}]`);
  };

  // --- Character CRUD ---
  const addCharacter = (char: Omit<CharacterProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (settings.strictSafetyMode) {
      const safetyCheck = checkTextSafety(char.name + ' ' + char.moralFlaw + ' ' + char.symbolicFear);
      if (!safetyCheck.isSafe) {
        setSafetyTriggered({
          triggered: true,
          term: safetyCheck.blockedTerm,
          suggestion: safetyCheck.suggestedRewrite
        });
        addLog(`SAFETY: Sanitized character traits containing unsafe word [${safetyCheck.blockedTerm}]`);
        char.name = autoRewrite(char.name);
        char.moralFlaw = autoRewrite(char.moralFlaw);
        char.symbolicFear = autoRewrite(char.symbolicFear);
      }
    }

    const id = `char-${Math.random().toString(36).substr(2, 9)}`;
    const newChar: CharacterProfile = {
      ...char,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...characters, newChar];
    setCharacters(updated);
    db.saveCharacters(updated);
    addLog(`DOSSIERS: Logged new subject profile: [${newChar.name}]`);
    return id;
  };

  const updateCharacter = (id: string, char: Partial<CharacterProfile>) => {
    const updated = characters.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...char, updatedAt: new Date().toISOString() };
        if (settings.strictSafetyMode) {
          const safetyCheck = checkTextSafety(merged.name + ' ' + merged.moralFlaw + ' ' + merged.symbolicFear);
          if (!safetyCheck.isSafe) {
            setSafetyTriggered({
              triggered: true,
              term: safetyCheck.blockedTerm,
              suggestion: safetyCheck.suggestedRewrite
            });
            addLog(`SAFETY: Sanitized character edits containing unsafe word [${safetyCheck.blockedTerm}]`);
            merged.name = autoRewrite(merged.name);
            merged.moralFlaw = autoRewrite(merged.moralFlaw);
            merged.symbolicFear = autoRewrite(merged.symbolicFear);
          }
        }
        return merged;
      }
      return item;
    });
    setCharacters(updated);
    db.saveCharacters(updated);
    addLog(`DOSSIERS: Updated subject profile ID [${id}]`);
  };

  const deleteCharacter = (id: string) => {
    const updated = characters.filter(c => c.id !== id);
    setCharacters(updated);
    db.saveCharacters(updated);
    addLog(`DOSSIERS: Removed subject profile ID [${id}]`);
  };

  // --- Tests CRUD ---
  const addTest = (t: Omit<SymbolicTest, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (settings.strictSafetyMode) {
      const safetyCheck = checkTextSafety(t.title + ' ' + t.openingTape + ' ' + t.rules);
      if (!safetyCheck.isSafe) {
        setSafetyTriggered({
          triggered: true,
          term: safetyCheck.blockedTerm,
          suggestion: safetyCheck.suggestedRewrite
        });
        addLog(`SAFETY: Sanitized test rules containing unsafe word [${safetyCheck.blockedTerm}]`);
        t.title = autoRewrite(t.title);
        t.openingTape = autoRewrite(t.openingTape);
        t.rules = autoRewrite(t.rules);
      }
    }

    const id = `test-${Math.random().toString(36).substr(2, 9)}`;
    const newTest: SymbolicTest = {
      ...t,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...tests, newTest];
    setTests(updated);
    db.saveTests(updated);
    
    // Automatically associate test to campaign if not already there
    const campaign = campaigns.find(c => c.id === t.campaignId);
    if (campaign && !campaign.testIds.includes(id)) {
      updateCampaign(campaign.id, { testIds: [...campaign.testIds, id] });
    }

    addLog(`TEST CHAMBER: Compiled test config: [${newTest.title}]`);
    return id;
  };

  const updateTest = (id: string, t: Partial<SymbolicTest>) => {
    const updated = tests.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...t, updatedAt: new Date().toISOString() };
        if (settings.strictSafetyMode) {
          const safetyCheck = checkTextSafety(merged.title + ' ' + merged.openingTape + ' ' + merged.rules);
          if (!safetyCheck.isSafe) {
            setSafetyTriggered({
              triggered: true,
              term: safetyCheck.blockedTerm,
              suggestion: safetyCheck.suggestedRewrite
            });
            addLog(`SAFETY: Sanitized test edits containing unsafe word [${safetyCheck.blockedTerm}]`);
            merged.title = autoRewrite(merged.title);
            merged.openingTape = autoRewrite(merged.openingTape);
            merged.rules = autoRewrite(merged.rules);
          }
        }
        return merged;
      }
      return item;
    });
    setTests(updated);
    db.saveTests(updated);
    addLog(`TEST CHAMBER: Updated test config ID [${id}]`);
  };

  const deleteTest = (id: string) => {
    const updated = tests.filter(t => t.id !== id);
    setTests(updated);
    db.saveTests(updated);
    addLog(`TEST CHAMBER: Deleted test config ID [${id}]`);
  };

  // --- Timeline CRUD ---
  const addLoreEvent = (e: Omit<LoreEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `lore-${Math.random().toString(36).substr(2, 9)}`;
    const newEvent: LoreEvent = {
      ...e,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...timeline, newEvent];
    setTimeline(updated);
    db.saveTimeline(updated);
    addLog(`ARCHIVES: Logged custom lore event: [${newEvent.title}]`);
    return id;
  };

  const updateLoreEvent = (id: string, e: Partial<LoreEvent>) => {
    const updated = timeline.map((item) => {
      if (item.id === id) {
        return { ...item, ...e, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    setTimeline(updated);
    db.saveTimeline(updated);
    addLog(`ARCHIVES: Modified lore event ID [${id}]`);
  };

  const deleteLoreEvent = (id: string) => {
    const updated = timeline.filter(e => e.id !== id);
    setTimeline(updated);
    db.saveTimeline(updated);
    addLog(`ARCHIVES: Deleted lore event ID [${id}]`);
  };

  // --- Simulation (Theatre Mode) state machine ---
  const startSimulation = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    // Filter tests that belong to this campaign
    const campaignTests = tests.filter(t => t.campaignId === campaignId);
    if (campaignTests.length === 0) {
      alert("No symbolic tests found for this campaign. Please create one in the Test Designer first.");
      return;
    }

    const firstTest = campaignTests[0];

    addLog(`SIMULATION: Initiated campaign context [${campaign.title.toUpperCase()}]`);
    sound.startTapeHum();

    setActiveSimulation({
      campaign,
      tests: campaignTests,
      currentTestIndex: 0,
      scores: { ...INITIAL_MORAL_SCORES },
      decisions: [],
      timerLeft: firstTest.timerSeconds,
      isPlayingTape: true,
      isFinished: false,
      textPrinted: '',
      isPuzzleSolved: false,
      puzzleInput: '',
      puzzleAttempts: 0,
      isPuzzleActive: firstTest.puzzleType !== 'choice',
      revealedCluesIndices: []
    });

    setView('theatre');
  };

  const submitChoice = (choiceId: string) => {
    if (!activeSimulation) return;

    const { campaign, tests: simTests, currentTestIndex, scores, decisions } = activeSimulation;
    const currentTest = simTests[currentTestIndex];
    const choice = currentTest.choices.find(c => c.id === choiceId);
    if (!choice) return;

    sound.playBeep();

    // Compute next scores
    const nextScores = calculateNextScores(scores, choice.scoresEffect);
    
    // Log decision
    const decisionLog: DecisionLog = {
      testId: currentTest.id,
      choiceId: choice.id,
      choiceText: choice.text,
      timestamp: new Date().toISOString(),
      scoresAfter: nextScores
    };
    
    const nextDecisions = [...decisions, decisionLog];
    addLog(`SIMULATION: Branch decision committed [${choice.text}]`);

    // Check if ending is triggered immediately or if we reached the end of the tests
    const isEndingTriggered = choice.endingType || currentTestIndex === simTests.length - 1;

    if (isEndingTriggered) {
      // End simulation
      const finalEndingType = choice.endingType || determineEnding(nextScores).type;
      const endingDetails = determineEnding(nextScores);
      
      const finishedSim: ActiveSimulation = {
        ...activeSimulation,
        scores: nextScores,
        decisions: nextDecisions,
        isPlayingTape: false,
        isFinished: true,
        ending: endingDetails,
        timerLeft: 0
      };
      
      setActiveSimulation(finishedSim);
      addLog(`SIMULATION: Resolved campaign. Ending categorized: [${endingDetails.type}]`);

      // Save report in runs
      const reportText = generateReportContent(campaign, nextDecisions, nextScores, endingDetails);
      const newRun: SimulationRun = {
        id: `run-${Math.random().toString(36).substr(2, 9)}`,
        campaignId: campaign.id,
        startedAt: new Date(Date.now() - 300000).toISOString(),
        endedAt: new Date().toISOString(),
        decisions: nextDecisions,
        finalScores: nextScores,
        endingType: finalEndingType,
        report: reportText
      };

      const updatedRuns = [newRun, ...runs];
      setRuns(updatedRuns);
      db.saveRuns(updatedRuns);

      // Set campaign status as simulated
      updateCampaign(campaign.id, { status: 'simulated' });
      
    } else {
      // Advance to next test
      const nextIndex = currentTestIndex + 1;
      const nextTest = simTests[nextIndex];
      
      sound.startTapeHum();
      setActiveSimulation({
        ...activeSimulation,
        currentTestIndex: nextIndex,
        scores: nextScores,
        decisions: nextDecisions,
        timerLeft: nextTest.timerSeconds,
        isPlayingTape: true,
        textPrinted: '',
        isPuzzleSolved: false,
        puzzleInput: '',
        puzzleAttempts: 0,
        isPuzzleActive: nextTest.puzzleType !== 'choice',
        revealedCluesIndices: []
      });
      addLog(`SIMULATION: Advancing to test layer #${nextIndex + 1}: [${nextTest.title}]`);
    }
  };

  // Generate structural report in Markdown
  const generateReportContent = (
    c: Campaign,
    decs: DecisionLog[],
    sc: MoralScores,
    end: EndingDetails
  ): string => {
    let report = `# CASE REPORT: ${c.title.toUpperCase()}\n`;
    report += `Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}\n`;
    report += `Location: ${c.fictionalLocation}\n`;
    report += `Narrative Theme: ${c.moralTheme}\n`;
    report += `===========================================\n\n`;
    report += `## MORAL EVOLUTION OUTCOME\n`;
    report += `Ending Obtained: **${end.title}**\n\n`;
    report += `${end.description}\n\n`;
    report += `## DECISIONS LOGGED\n`;
    decs.forEach((d, idx) => {
      const relatedTest = tests.find(t => t.id === d.testId);
      report += `${idx + 1}. **Test**: ${relatedTest?.title || 'Unknown Test'}\n`;
      report += `   - **Selected Choice**: ${d.choiceText}\n`;
    });
    report += `\n## FINAL PROFILE BALANCES\n`;
    report += `- Responsibility: ${sc.responsibility}/100\n`;
    report += `- Truth: ${sc.truth}/100\n`;
    report += `- Empathy: ${sc.empathy}/100\n`;
    report += `- Courage: ${sc.courage}/100\n`;
    report += `- Denial: ${sc.denial}/100\n`;
    report += `- Cooperation: ${sc.cooperation}/100\n`;
    report += `- Acceptance: ${sc.acceptance}/100\n`;
    return report;
  };

  const toggleTapePlayback = (playing: boolean) => {
    if (!activeSimulation) return;
    if (playing) {
      sound.startTapeHum();
      addLog("SIMULATION: Audio transcript deck spinning.");
    } else {
      sound.stopTapeHum();
      addLog("SIMULATION: Audio transcript deck paused.");
    }
    setActiveSimulation({
      ...activeSimulation,
      isPlayingTape: playing
    });
  };

  const exitSimulation = () => {
    sound.stopTapeHum();
    addLog("SIMULATION: Aborted campaign console session.");
    setActiveSimulation(null);
    setView('dashboard');
  };

  const setPuzzleInput = (input: string) => {
    if (!activeSimulation) return;
    setActiveSimulation({
      ...activeSimulation,
      puzzleInput: input
    });
  };

  const submitPuzzleAnswer = (answer: string) => {
    if (!activeSimulation) return;
    const { tests: simTests, currentTestIndex, puzzleAttempts, timerLeft } = activeSimulation;
    const currentTest = simTests[currentTestIndex];
    
    const isCorrect = currentTest.puzzleData.correctAnswer?.toLowerCase().trim() === answer.toLowerCase().trim();
    
    if (isCorrect) {
      sound.playChime();
      addLog("SIMULATION: Puzzle calibrated successfully.");
      setActiveSimulation({
        ...activeSimulation,
        isPuzzleSolved: true,
        isPuzzleActive: false
      });
    } else {
      sound.playAlarm();
      const newAttempts = puzzleAttempts + 1;
      const penaltyTime = 15;
      const nextTimer = Math.max(1, timerLeft - penaltyTime);
      
      addLog(`SIMULATION: Incorrect calibration attempt #${newAttempts}. Penalty: -${penaltyTime}s.`);
      
      setActiveSimulation({
        ...activeSimulation,
        puzzleAttempts: newAttempts,
        timerLeft: nextTimer,
        puzzleInput: ''
      });
      
      if (newAttempts >= 3) {
        addLog("SIMULATION: Maximum attempts exceeded. Forcing failure path.");
        const fallbackChoice = currentTest.choices[1] || currentTest.choices[0];
        setTimeout(() => {
          submitChoice(fallbackChoice.id);
        }, 500);
      }
    }
  };

  const revealClue = (clueIndex: number) => {
    if (!activeSimulation) return;
    const { revealedCluesIndices, scores } = activeSimulation;
    if (revealedCluesIndices.includes(clueIndex)) return;
    
    sound.playBeep();
    const penalizedScores = calculateNextScores(scores, { denial: 5, courage: -5 });
    addLog(`SIMULATION: Decrypted clue index #${clueIndex + 1}. Applied delta values (+5 Denial, -5 Courage).`);
    
    setActiveSimulation({
      ...activeSimulation,
      revealedCluesIndices: [...revealedCluesIndices, clueIndex],
      scores: penalizedScores
    });
  };

  // Timer tick effect
  useEffect(() => {
    if (activeSimulation && !activeSimulation.isFinished && !activeSimulation.isPlayingTape) {
      timerRef.current = setInterval(() => {
        sound.playTick(activeSimulation.timerLeft <= 30);
        
        setActiveSimulation(prev => {
          if (!prev) return null;
          if (prev.timerLeft <= 1) {
            clearInterval(timerRef.current!);
            
            const currentTest = prev.tests[prev.currentTestIndex];
            const fallbackChoice = currentTest.choices[1] || currentTest.choices[0];
            
            addLog("SIMULATION: Nixie timer expired. Forced failure calibration.");
            sound.playAlarm();
            
            setTimeout(() => {
              submitChoice(fallbackChoice.id);
            }, 0);

            return { ...prev, timerLeft: 0 };
          }
          return { ...prev, timerLeft: prev.timerLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSimulation?.currentTestIndex, activeSimulation?.isFinished, activeSimulation?.isPlayingTape, activeSimulation?.timerLeft]);

  // Typewriter effect for tapes
  useEffect(() => {
    if (activeSimulation && activeSimulation.isPlayingTape) {
      const currentTest = activeSimulation.tests[activeSimulation.currentTestIndex];
      const tapeText = currentTest.openingTape;
      let currentIndex = 0;
      
      const speed = settings.narrativeIntensity === 'light' ? 10 : 35;

      setActiveSimulation(prev => prev ? { ...prev, textPrinted: '' } : null);

      typewriterRef.current = setInterval(() => {
        setActiveSimulation(prev => {
          if (!prev) return null;
          if (currentIndex >= tapeText.length) {
            clearInterval(typewriterRef.current!);
            sound.stopTapeHum();
            return { ...prev, isPlayingTape: false, textPrinted: tapeText };
          }
          currentIndex += 2;
          sound.playClick();
          return {
            ...prev,
            textPrinted: tapeText.substring(0, currentIndex)
          };
        });
      }, speed);
    } else {
      sound.stopTapeHum();
    }

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, [activeSimulation?.currentTestIndex, activeSimulation?.isPlayingTape]);

  const dismissSafetyAlert = () => {
    setSafetyTriggered(null);
  };

  // Backups and encrypt
  const exportDatabase = () => {
    return db.exportBackupJSON();
  };

  const importDatabase = (jsonStr: string) => {
    const success = db.importBackupJSON(jsonStr);
    if (success) {
      refreshState();
      return true;
    }
    return false;
  };

  const encryptLocalVault = async (passphrase: string) => {
    const success = await db.encryptVault(passphrase);
    if (success) {
      refreshState();
    }
    return success;
  };

  const decryptLocalVault = async (passphrase: string) => {
    const success = await db.decryptVault(passphrase);
    if (success) {
      refreshState();
    }
    return success;
  };

  const resetAll = () => {
    db.clearAllData();
    refreshState();
    setView('dashboard');
  };

  return (
    <AppContext.Provider value={{
      currentView,
      selectedId,
      setView,
      settings,
      updateSettings,
      campaigns,
      characters,
      tests,
      timeline,
      runs,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      addCharacter,
      updateCharacter,
      deleteCharacter,
      addTest,
      updateTest,
      deleteTest,
      addLoreEvent,
      updateLoreEvent,
      deleteLoreEvent,
      activeSimulation,
      startSimulation,
      submitChoice,
      toggleTapePlayback,
      exitSimulation,
      submitPuzzleAnswer,
      setPuzzleInput,
      revealClue,
      safetyTriggered,
      dismissSafetyAlert,
      exportDatabase,
      importDatabase,
      encryptVault: encryptLocalVault,
      decryptVault: decryptLocalVault,
      isVaultEncrypted,
      resetAll,
      logs,
      addLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
