import type { Campaign, CharacterProfile, SymbolicTest, LoreEvent } from '../types';

export const PRELOADED_CHARACTERS: CharacterProfile[] = [
  // Fictional Campaign Characters
  {
    id: 'char-victor-hale',
    name: 'Victor Hale',
    role: 'Corporate Archivist',
    archetype: 'The Shielded Bureaucrat',
    timelinePeriod: 'fan-campaigns',
    moralFlaw: 'Falsified property logs to cover up safety violations at the Gideon building to secure his career.',
    symbolicFear: 'Public exposure of professional failure.',
    redemptionGoal: 'Acknowledge responsibility for his teammate\'s dismissal.',
    denialPattern: 'Convinces himself that "sacrifices are necessary for team survival."',
    relationships: 'Dismissed coworker (Evelyn Carter, estranged)',
    canonStatus: 'custom',
    notes: 'Primary subject in "The Ledger Room". Highly defensive.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'char-mara-voss',
    name: 'Mara Voss',
    role: 'Social Media PR Director',
    archetype: 'The Image Architect',
    timelinePeriod: 'fan-campaigns',
    moralFlaw: 'Ran the PR cover-up discrediting inspectors who flagged fire hazards in Kramer\'s workshop.',
    symbolicFear: 'Being seen as ordinary, flawed, or guilty.',
    redemptionGoal: 'Confront a painful truth about a product safety cover-up.',
    denialPattern: 'Claims "perception is reality; if they believe it, it is true."',
    relationships: 'Company stakeholders (allies), whistleblowers (adversaries)',
    canonStatus: 'custom',
    notes: 'Primary subject in "The Glass Confession". Speaks in corporate buzzwords.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'char-elias-crowe',
    name: 'Elias Crowe',
    role: 'Industrial Subcontractor',
    archetype: 'The Blind Profit Maximizer',
    timelinePeriod: 'fan-campaigns',
    moralFlaw: 'Subcontracted structural work, diluting concrete reinforcements in the Gideon building to pocket bonuses.',
    symbolicFear: 'Financial ruin and loss of control.',
    redemptionGoal: 'Forfeit a major financial bonus to compensate workers\' medical funds.',
    denialPattern: 'Believes "everyone signs the contract willingly; it\'s just business."',
    relationships: 'Subcontractors (exploited), investors (demanding)',
    canonStatus: 'custom',
    notes: 'Primary subject in "The Quiet Scale". Very pragmatic.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Canonical Reference Characters
  {
    id: 'canon-john-kramer',
    name: 'John Kramer',
    role: 'Civil Engineer & Game Architect',
    archetype: 'The Mastermind (Jigsaw)',
    timelinePeriod: 'pre-saw-i to saw-iii',
    moralFlaw: 'Obsession with testing the survival instinct of others due to his own terminal cancer.',
    symbolicFear: 'Wasted human life and unappreciated existence.',
    redemptionGoal: 'Forcing subjects to value their lives through symbolic struggles.',
    denialPattern: 'Maintains that he has never killed anyone, as he provides choice.',
    relationships: 'Amanda Young (protege), Mark Hoffman (apprentice), Jill Tuck (former wife), Lawrence Gordon (secret helper)',
    canonStatus: 'canon',
    notes: 'Philosophy: "Those who do not appreciate life do not deserve to live." Uses puppets and tape recorders.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-amanda-young',
    name: 'Amanda Young',
    role: 'First Survivor / Apprentice',
    archetype: 'The Devoted Disciple',
    timelinePeriod: 'saw-i to saw-iii',
    moralFlaw: 'Severe emotional instability and creation of inescapable tests.',
    symbolicFear: 'Relapse into addiction and abandonment by her mentor.',
    redemptionGoal: 'To carry on the legacy of John Kramer.',
    denialPattern: 'Claims that humanity is fundamentally beyond redemption, making tests useless.',
    relationships: 'John Kramer (mentor/father-figure), Mark Hoffman (rival)',
    canonStatus: 'canon',
    notes: 'Survived the reverse bear trap. Later builds rigged, unwinnable tests.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-mark-hoffman',
    name: 'Mark Hoffman',
    role: 'Forensic Detective / Apprentice',
    archetype: 'The Executioner',
    timelinePeriod: 'saw-v to saw-vii',
    moralFlaw: 'Ruthless vengefulness, cruelty, and blackmail.',
    symbolicFear: 'Exposure as Jigsaw\'s accomplice.',
    redemptionGoal: 'Self-preservation and elimination of all threats to his freedom.',
    denialPattern: 'Believes his brutal tests represent pure justice.',
    relationships: 'John Kramer (recruiter), Amanda Young (rival), Peter Strahm (nemesis)',
    canonStatus: 'canon',
    notes: 'More mechanical and less philosophical than John. Focuses heavily on engineering lethal situations.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-jill-tuck',
    name: 'Jill Tuck',
    role: 'Rehabilitation Clinic Owner',
    archetype: 'The Conflicted Enabler',
    timelinePeriod: 'saw-iv to saw-vii',
    moralFlaw: 'Complicity through silence regarding John\'s vigilante work.',
    symbolicFear: 'Violent retribution and loss of normal life.',
    redemptionGoal: 'Fulfill John\'s final request while separating herself from Hoffman.',
    denialPattern: 'Convinces herself she was merely a passive observer.',
    relationships: 'John Kramer (ex-husband), Mark Hoffman (adversary)',
    canonStatus: 'canon',
    notes: 'Given a box by John Kramer containing the test for Hoffman.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-lawrence-gordon',
    name: 'Dr. Lawrence Gordon',
    role: 'Oncologist & Secret Apprentice',
    archetype: 'The Medical Specialist',
    timelinePeriod: 'posthumous',
    moralFlaw: 'Clinical detachment, neglecting family, and compliance in John\'s medical operations.',
    symbolicFear: 'Loss of family and failing his patients.',
    redemptionGoal: 'Survive the bathroom test by amputating his foot, then become the final guardian of John\'s legacy.',
    denialPattern: 'Believes he was helping a patient and protecting Jill Tuck under John\'s last wishes.',
    relationships: 'John Kramer (former patient/mentor), Jill Tuck (protected target), Lynn Denlon (colleague)',
    canonStatus: 'canon',
    notes: 'The surgeon who chained himself in the bathroom in Saw I. Later revealed as the final secret apprentice who performed key surgical procedures for Jigsaw.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-cecilia-pederson',
    name: 'Cecilia Pederson',
    role: 'Medical Scam Organizer',
    archetype: 'The Arrogant Sociopath',
    timelinePeriod: 'saw-x',
    moralFlaw: 'Extorting life savings from terminal patients with a fake cancer cure.',
    symbolicFear: 'Poverty, loss of authority, and public humiliation.',
    redemptionGoal: 'Survive the test in Mexico through raw cunning.',
    denialPattern: 'Believes that dying people are simple assets to be harvested.',
    relationships: 'John Kramer (mark who turned into tester)',
    canonStatus: 'canon',
    notes: 'Extremely clever and devoid of remorse. Tested in Mexico.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const PRELOADED_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-ledger-room',
    title: 'The Ledger Room',
    timelinePeriod: 'saw-x-interquel',
    tone: 'Clinical, oppressive, archival',
    moralTheme: 'Truth vs. Reputation',
    fictionalLocation: 'Basement of the City Archives building, Gideon zoning vault',
    objective: 'To make Victor Hale confess to falsifying property registry records of the Gideon Building to cover up zoning fraud.',
    status: 'ready',
    characterIds: ['char-victor-hale'],
    testIds: ['test-ledger-room-1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-glass-confession',
    title: 'The Glass Confession',
    timelinePeriod: 'saw-i-ii-interval',
    tone: 'Disorienting, sterile, reflective',
    moralTheme: 'Social Image vs. Responsibility',
    fictionalLocation: 'An abandoned mirror studio, near Kramer\'s electrical workshop',
    objective: 'To force Mara Voss to choose raw accountability over the PR cover-up discrediting inspectors who flagged fire hazards in John\'s workshop.',
    status: 'ready',
    characterIds: ['char-mara-voss'],
    testIds: ['test-glass-confession-1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-quiet-scale',
    title: 'The Quiet Scale',
    timelinePeriod: 'apprentice-arcs',
    tone: 'Industrial, rusted, heavy',
    moralTheme: 'Exploitation vs. Empathy',
    fictionalLocation: 'Gideon Building decommissioned weighing station, rusty iron balances',
    objective: 'To evaluate whether Elias Crowe will forfeit his financial bonus to compensate workers\' medical funds, correcting his concrete shortcuts at Gideon.',
    status: 'ready',
    characterIds: ['char-elias-crowe'],
    testIds: ['test-quiet-scale-1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const PRELOADED_TESTS: SymbolicTest[] = [
  {
    id: 'test-ledger-room-1',
    campaignId: 'camp-ledger-room',
    characterId: 'char-victor-hale',
    title: 'The Ledger Calibration',
    moralTheme: 'Truth vs. Reputation',
    openingTape: 'Hello, Victor. You spent your life measuring the value of others with a weighted ledger. In this room, the archives will not lie. You falsified a structural safety report, allowing Evelyn Carter to take the blame for zoning violations at the Gideon Building. Yes, Victor, the building where my unborn child was lost. You protected the developer\'s reputation to secure your bonus. Now, the files are locked. You must submit the correct date of your override forgery on the terminal. Option A is truth: submit it and audit logs go to inspectors. Option B is denial: type any other date and remain locked. Make your choice.',
    rules: 'Enter the exact override signature date "2024-04-12" to unlock Option A.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Enter the manual override date (YYYY-MM-DD) to retrieve safety file #B:',
      correctAnswer: '2024-04-12',
      items: [
        'File #A (Dated 2024-03-08) - "Standard maintenance logs"',
        'File #B (Dated 2024-04-12) - "Override: Victor Hale - user login #4"',
        'File #C (Dated 2024-05-19) - "Evelyn Carter - login logs"'
      ]
    },
    clues: [
      'The manual override occurred exactly 4 days before Evelyn was fired.',
      'Evelyn\'s dismissal letter was dated 2024-04-16.',
      'Check the date format YYYY-MM-DD.'
    ],
    timerSeconds: 120,
    choices: [
      {
        id: 'choice-victor-confess',
        text: 'Select File #B (Submit the truth and notify auditors)',
        scoresEffect: { truth: 30, responsibility: 30, denial: -25, acceptance: 20 },
        narrativeImpact: 'Victor presses the button for File #B. The vault door clicks open. A printer whirs to life, sending the confession to the audit board. His face is pale, but the burden has lifted.'
      },
      {
        id: 'choice-victor-lie',
        text: 'Select File #A or #C (Maintain the lie to protect his reputation)',
        scoresEffect: { truth: -30, responsibility: -30, denial: 35, courage: -20 },
        narrativeImpact: 'Victor attempts to select File #A. The terminal flashes a red error. The archive cabinets lock shut. The door remains sealed. Victor has chosen his pride, and in doing so, locked himself in his own web.',
        endingType: 'Denial Ending'
      }
    ],
    safetyNote: 'Fictional test. The "lock" is a local text-based narrative ending. No physical restraint.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-glass-confession-1',
    campaignId: 'camp-glass-confession',
    characterId: 'char-mara-voss',
    title: 'The Reflection of Deceit',
    moralTheme: 'Social Image vs. Responsibility',
    openingTape: 'Mara. You look in mirrors to adjust your brand. But you never look at what lies behind the glass. In this chamber, you face three mirrors. Behind each is a statement about the electrical fault cover-up you orchestrated. You ran the public relations smear campaign that discredited the inspectors who flagged safety violations at my engineering workshop. You called their reports "insignificant anomalies" to protect the company\'s market stock. You must select the mirror that reflects the absolute truth. If you choose denial, you walk out but the inspector\'s career remains ruined. If you choose confession, you must select B-2 and read the statement aloud.',
    rules: 'Select B-2 (Option B) in the confession grid to unlock the confession option.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Select the statement that details the company\'s prior knowledge:',
      confessionOptions: [
        { id: 'A-1', text: 'Option A-1: "The defects were minor and caused by user error."', truthScore: 10 },
        { id: 'B-2', text: 'Option B-2: "We knew of the electrical short-circuit hazard in August 2025 and suppressed the reports."', truthScore: 90 },
        { id: 'C-3', text: 'Option C-3: "A supplier anomaly occurred, but no internal logs were modified."', truthScore: 30 }
      ]
    },
    clues: [
      'August 2025 was when the safety engineering report was filed.',
      'The code refers to the middle folder, index 2.'
    ],
    timerSeconds: 150,
    choices: [
      {
        id: 'choice-mara-confess',
        text: 'Select Option B-2 (Admit prior knowledge and read confession)',
        scoresEffect: { truth: 40, responsibility: 25, courage: 25, denial: -30 },
        narrativeImpact: 'Mara presses the sensor on Mirror B. The glass becomes transparent, revealing the original safety report. She reads the text into the mic. Her voice trembles, but the reflection is finally honest.'
      },
      {
        id: 'choice-mara-deflect',
        text: 'Select Option C-3 (Blame the external suppliers)',
        scoresEffect: { truth: -10, responsibility: -20, denial: 20, empathy: -20 },
        narrativeImpact: 'Mara selects Option C. The screens flash "DEFLECTION REGISTERED." The mirror shatters safely. The simulation concludes with the whistleblower taking the fall. Mara retains her status, but her image is forever cracked.'
      }
    ],
    safetyNote: 'Fictional test. The mirror shattering is a narrative visual effect. No real mirrors or glass present.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-quiet-scale-1',
    campaignId: 'camp-quiet-scale',
    characterId: 'char-elias-crowe',
    title: 'The Balance of Ledger',
    moralTheme: 'Exploitation vs. Empathy',
    openingTape: 'Elias. You have weighed gold and copper, subtracting from the workers to add to your treasury. You were the subcontractor who diluted concrete reinforcements at the Gideon Building. You saved pennies, Elias. And when the clinic walls collapsed during structural settling, you pocketed a bonus, while my family lay buried in the dust. Now, the scales are set. On one side of this digital scale is your personal bonus vault worth $250,000. On the other is the compensation fund. To exit, you must balance the scales. You cannot keep both. Move the slider to allocate at least $150,000 to the compensation fund. What is the value of a human life, Elias? Let us balance the accounts.',
    rules: 'Adjust the slider to allocate at least $150,000 to the Workers Medical Fund.',
    puzzleType: 'sacrifice',
    puzzleData: {
      question: 'Determine the amount to transfer from the Bonus Ledger ($250,000 max):',
      gridItems: [
        { id: 'item-bonus', name: 'Personal Bonus Account', score: 250000 },
        { id: 'item-medical', name: 'Workers Medical Fund', score: 20000 }
      ]
    },
    clues: [
      'The minimum needed for worker operations is $150,000.',
      'Check the ledger deficit.'
    ],
    timerSeconds: 180,
    choices: [
      {
        id: 'choice-elias-generous',
        text: 'Transfer $180,000 to the Workers Medical Fund',
        scoresEffect: { empathy: 40, cooperation: 35, acceptance: 20, denial: -20 },
        narrativeImpact: 'Elias keys in $180,000 on the terminal. The digits transfer. The scale balances. The exit light turns green. Elias walks out with a lighter wallet, but a heavier heart for those who labor for him.'
      },
      {
        id: 'choice-elias-greedy',
        text: 'Transfer only $10,000 (Keep $240,000)',
        scoresEffect: { empathy: -40, cooperation: -30, denial: 30, responsibility: -20 },
        narrativeImpact: 'Elias enters $10,000. The scales slide into red. "BALANCE FAILED. OUTOFBALANCE." The bonus ledger deletes itself. The doors unlock, but Elias is ruined, having lost both the cash and the loyalty of his workforce.',
        endingType: 'Collapse of Persona'
      }
    ],
    safetyNote: 'Fictional test. The $250,000 is simulated currency within the campaign script.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const PRELOADED_LORE_EVENTS: LoreEvent[] = [
  {
    id: 'lore-pre-saw-i',
    title: 'The Tragedy at Gideon Building',
    period: 'pre-saw-i',
    summary: 'John Kramer, a successful civil engineer, suffers the loss of his unborn child after an incident at the Gideon Clinic. Shortly after, he is diagnosed with terminal frontal lobe cancer. These twin events shatter his worldview, leading him to construct his first moral tests.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-jill-tuck'],
    notes: 'Origin point for the Jigsaw philosophy. John attempts suicide by driving off a cliff but survives, leading to his epiphany regarding the will to live.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-i',
    title: 'The Bathroom Ordeal',
    period: 'saw-i',
    summary: 'Two men wake up chained to pipes in an abandoned subterranean bathroom. Dr. Lawrence Gordon must cut off his foot to survive. He does so, and is subsequently recruited by Kramer as a secret assistant.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-amanda-young', 'canon-lawrence-gordon'],
    notes: 'The bathroom test marks Gordon\'s survival and his recruitment.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-x',
    title: 'The Pederson Medical Scam Test',
    period: 'saw-x-interquel',
    summary: 'Seeking a miraculous cure for his cancer, John Kramer travels to Mexico for a highly expensive experimental procedure, only to discover it is a elaborate scam targeting vulnerable terminal patients. John gathers the scammers for a series of moral challenges.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-cecilia-pederson', 'canon-amanda-young'],
    notes: 'Chronologically placed between Saw I and Saw II. Showcases John\'s tactical planning and Amanda\'s developing mentorship.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-ii',
    title: 'The Nerve Gas House',
    period: 'saw-ii',
    summary: 'John Kramer is apprehended by detective Eric Matthews. However, the detective discovers that his son is locked inside a house with several past convicts, inhaling toxic gas. The detective must sit and converse with John to retrieve his son.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-amanda-young'],
    notes: 'Highlights Jigsaw\'s use of psychological manipulation over physical force. Establishes Amanda\'s transition to full apprentice.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-iii-iv',
    title: 'The Succession Conflict',
    period: 'saw-iii-iv',
    summary: 'As John Kramer\'s health fails, Amanda Young struggles to maintain the purity of the tests, building rigged, inescapable scenarios due to her growing cynicism. Simultaneously, Detective Hoffman works secretly to position himself as the sole successor.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-amanda-young', 'canon-mark-hoffman', 'canon-jill-tuck'],
    notes: 'Results in the death of John Kramer and Amanda Young. Hoffman inherits the console, initiating a darker, more brutal era.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-posthumous',
    title: 'The Trial of Hoffman',
    period: 'posthumous',
    summary: 'Jill Tuck receives John\'s final instructions to test Detective Hoffman. Dr. Lawrence Gordon steps out of the shadows to execute John\'s final request, locking Hoffman in the bathroom forever.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-mark-hoffman', 'canon-jill-tuck', 'canon-lawrence-gordon'],
    notes: 'The end of the original continuity line, sealing the archives.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
