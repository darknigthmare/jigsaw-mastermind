import type { Campaign, CharacterProfile, SymbolicTest, LoreEvent } from '../types';

export const PRELOADED_CHARACTERS: CharacterProfile[] = [
  {
    id: 'char-victor-hale',
    name: 'Victor Hale',
    role: 'Corporate Archivist',
    archetype: 'The Shielded Bureaucrat',
    timelinePeriod: 'fan-campaigns',
    moralFlaw: 'Falsified property logs to cover up safety violations at the Gideon building.',
    symbolicFear: 'Public exposure of professional failure.',
    redemptionGoal: 'Acknowledge responsibility for his teammate\'s dismissal.',
    denialPattern: 'Convinces himself that "sacrifices are necessary for team survival."',
    relationships: 'Dismissed coworker (Evelyn Carter, estranged)',
    canonStatus: 'custom',
    notes: 'Primary subject in "The Ledger Room".',
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
    redemptionGoal: 'Confront a painful truth about product safety.',
    denialPattern: 'Claims "perception is reality; if they believe it, it is true."',
    relationships: 'Company stakeholders (allies), whistleblowers (adversaries)',
    canonStatus: 'custom',
    notes: 'Primary subject in "The Glass Confession".',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'char-elias-crowe',
    name: 'Elias Crowe',
    role: 'Industrial Subcontractor',
    archetype: 'The Blind Profit Maximizer',
    timelinePeriod: 'fan-campaigns',
    moralFlaw: 'Subcontracted structural work, diluting concrete reinforcements in the Gideon building.',
    symbolicFear: 'Financial ruin and loss of control.',
    redemptionGoal: 'Forfeit financial bonus to compensate workers\' medical funds.',
    denialPattern: 'Believes "everyone signs the contract willingly; it\'s just business."',
    relationships: 'Subcontractors (exploited), investors (demanding)',
    canonStatus: 'custom',
    notes: 'Primary subject in "The Quiet Scale".',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-john-kramer',
    name: 'John Kramer',
    role: 'Civil Engineer & Game Architect',
    archetype: 'The Mastermind (Jigsaw)',
    timelinePeriod: 'pre-saw-i to saw-iii',
    moralFlaw: 'Obsession with testing the survival instinct of others.',
    symbolicFear: 'Wasted human life and unappreciated existence.',
    redemptionGoal: 'Forcing subjects to value their lives through symbolic struggles.',
    denialPattern: 'Maintains that he has never killed anyone, as he provides choice.',
    relationships: 'Amanda Young (protege), Mark Hoffman (apprentice), Jill Tuck (former wife), Lawrence Gordon (secret helper)',
    canonStatus: 'canon',
    notes: 'The philosophical backbone of the franchise.',
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
    denialPattern: 'Claims that humanity is fundamentally beyond redemption.',
    relationships: 'John Kramer (mentor), Mark Hoffman (rival)',
    canonStatus: 'canon',
    notes: 'Survived the reverse bear trap.',
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
    redemptionGoal: 'Self-preservation and elimination of all threats.',
    denialPattern: 'Believes his brutal tests represent pure justice.',
    relationships: 'John Kramer (recruiter), Amanda Young (rival)',
    canonStatus: 'canon',
    notes: 'Uses puppets and audio recorders.',
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
    redemptionGoal: 'Fulfill John\'s final request.',
    denialPattern: 'Convinces herself she was merely a passive observer.',
    relationships: 'John Kramer (ex-husband), Mark Hoffman (adversary)',
    canonStatus: 'canon',
    notes: 'Inherited the box of directives.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-lawrence-gordon',
    name: 'Dr. Lawrence Gordon',
    role: 'Oncologist & Secret Apprentice',
    archetype: 'The Medical Specialist',
    timelinePeriod: 'posthumous',
    moralFlaw: 'Clinical detachment and neglect of family.',
    symbolicFear: 'Loss of family and failing his patients.',
    redemptionGoal: 'Survive bathroom test, protect Jill Tuck.',
    denialPattern: 'Believes he was helping a patient under John\'s wishes.',
    relationships: 'John Kramer (mentor), Jill Tuck (protected target)',
    canonStatus: 'canon',
    notes: 'The surgeon who chained himself in the bathroom.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-logan-nelson',
    name: 'Logan Nelson',
    role: 'Military Pathologist & First Apprentice',
    archetype: 'The Ghost Apprentice',
    timelinePeriod: 'legacy-era',
    moralFlaw: 'Mislabeled John Kramer\'s cancer scan, causing diagnostic delay.',
    symbolicFear: 'Re-experiencing military trauma.',
    redemptionGoal: 'Recreate John\'s original game ten years later.',
    denialPattern: 'Believes "I speak for the dead" to justify revenge.',
    relationships: 'John Kramer (mentor)',
    canonStatus: 'canon',
    notes: 'Spared by John in his first trial.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-william-schenk',
    name: 'William Schenk',
    role: 'Cop Copycat Jigsaw',
    archetype: 'The Systemic Reformer',
    timelinePeriod: 'legacy-era',
    moralFlaw: 'Extorting traps to reform systemic corruption in police.',
    symbolicFear: 'Failing to avenge his father\'s murder.',
    redemptionGoal: 'Cleanse the police force using simulated tests.',
    denialPattern: 'Claims Jigsaw was an idealist; he targets systems.',
    relationships: 'Detective Ezekiel Banks (mark)',
    canonStatus: 'canon',
    notes: 'Spiral copycat.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-cecilia-pederson',
    name: 'Cecilia Pederson',
    role: 'Medical Scam Organizer',
    archetype: 'The Arrogant Sociopath',
    timelinePeriod: 'saw-x',
    moralFlaw: 'Extorting terminal patients with fake cure.',
    symbolicFear: 'Loss of authority and wealth.',
    redemptionGoal: 'Survive the Mexican test through raw cunning.',
    denialPattern: 'Believes dying people are simple assets to harvest.',
    relationships: 'John Kramer (mark)',
    canonStatus: 'canon',
    notes: 'Antagonist tested in Mexico.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const PRELOADED_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-saw-i',
    title: 'Saw I Trials',
    timelinePeriod: 'saw-i',
    tone: 'Claustrophobic, dirty, initial',
    moralTheme: 'Value of Breath & Time',
    fictionalLocation: 'Subterranean Bathroom & warehouses',
    objective: 'Survive the original trials of Dr. Gordon, Amanda Young, Razor Wire maze, Flammable Jelly, Drill Chair, Shotgun Corridor, and Zep\'s test.',
    status: 'ready',
    characterIds: ['canon-lawrence-gordon', 'canon-amanda-young'],
    testIds: ['test-s1-bathroom', 'test-s1-bear-trap', 'test-s1-razor-wire', 'test-s1-flammable-jelly', 'test-s1-drill-chair', 'test-s1-shotgun-hallway', 'test-s1-zep-hostage'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-ii',
    title: 'Saw II Trials',
    timelinePeriod: 'saw-ii',
    tone: 'Nerve gas, frantic, crowded',
    moralTheme: 'Self-Sacrifice vs. Selfishness',
    fictionalLocation: 'Nerve Gas House',
    objective: 'Bypass the traps of Michael Marks, Obi Tate, Addison Corday, Gus Colyard, the Nerve Gas Vent, and the Needle Pit.',
    status: 'ready',
    characterIds: ['canon-amanda-young'],
    testIds: ['test-s2-death-mask', 'test-s2-needle-pit', 'test-s2-razor-box', 'test-s2-furnace', 'test-s2-shotgun-peephole', 'test-s2-gas-house'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-iii',
    title: 'Saw III Trials',
    timelinePeriod: 'saw-iii-iv',
    tone: 'Twisted metal, frozen, surgery',
    moralTheme: 'Forgiveness vs. Vengeance',
    fictionalLocation: 'Gideon Meat Packing Plant',
    objective: 'Test the limits of forgiveness via the Freezer room, the Angel Trap, Troy\'s Chains, Pig Vat, and the Rack.',
    status: 'ready',
    characterIds: ['canon-john-kramer'],
    testIds: ['test-s3-freezer', 'test-s3-angel', 'test-s3-rack', 'test-s3-classroom', 'test-s3-pig-vat', 'test-s3-shotgun-collar'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-iv',
    title: 'Saw IV Trials',
    timelinePeriod: 'saw-iii-iv',
    tone: 'Police conspiracy, rain, forensics',
    moralTheme: 'Obsession vs. Letting Go',
    fictionalLocation: 'Mausoleum & Gideon clinic rooms',
    objective: 'Escape the Mausoleum chains, Brenda\'s Scalp trap, Ivan\'s bedroom, the Spikes block, and Cecil\'s Knife Chair.',
    status: 'ready',
    characterIds: ['canon-john-kramer', 'canon-mark-hoffman'],
    testIds: ['test-s4-mausoleum', 'test-s4-knife-chair', 'test-s4-hair', 'test-s4-spikes', 'test-s4-bedroom', 'test-s4-ice-blocks'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-v',
    title: 'Saw V Trials',
    timelinePeriod: 'posthumous',
    tone: 'Collusion, concrete, shadows',
    moralTheme: 'Cooperation vs. Individual Greed',
    fictionalLocation: 'Subterranean chambers',
    objective: 'Solve the Pendulum, Collar Key, Water Cube, and 10 Pints of Blood hand saws.',
    status: 'ready',
    characterIds: ['canon-mark-hoffman'],
    testIds: ['test-s5-pendulum', 'test-s5-blood-saws', 'test-s5-collar-keys', 'test-s5-water-cube', 'test-s5-ceiling-jars'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-vi',
    title: 'Saw VI Trials',
    timelinePeriod: 'posthumous',
    tone: 'Corporate, healthcare, steam',
    moralTheme: 'Actuarial Decisions vs. Empathy',
    fictionalLocation: 'Abandoned zoo corridors',
    objective: 'Bypass the Oxygen Crusher, Actuary Gallows, Steam Maze, Carousel, and Acid Injection.',
    status: 'ready',
    characterIds: ['canon-john-kramer'],
    testIds: ['test-s6-oxygen', 'test-s6-gallows', 'test-s6-carousel', 'test-s6-steam-maze', 'test-s6-acid-latch', 'test-s6-pound-flesh'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-vii',
    title: 'Saw VII Trials',
    timelinePeriod: 'posthumous',
    tone: 'Public, violent, loud',
    moralTheme: 'Deceit vs. Integrity',
    fictionalLocation: 'Public square & mental asylum',
    objective: 'Bypass the Horsepower trap, Silence lock, Lawnmower trap, Spike Cage, and Public Circular Saws.',
    status: 'ready',
    characterIds: ['canon-lawrence-gordon', 'canon-mark-hoffman'],
    testIds: ['test-s7-horsepower', 'test-s7-silence', 'test-s7-lawnmower', 'test-s7-spike-cage', 'test-s7-public-exec', 'test-s7-brazen-bull'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-jigsaw',
    title: 'Jigsaw (2017) Trials',
    timelinePeriod: 'legacy-era',
    tone: 'Sunny barn, modern, high-tech',
    moralTheme: 'Responsibility for the Dead',
    fictionalLocation: 'Tuck family barn',
    objective: 'Solve the Bucket Heads scanner, Leg Wire cut, Grain Silo, Cycle trap, and the final Laser Collars.',
    status: 'ready',
    characterIds: ['canon-logan-nelson'],
    testIds: ['test-jg-bucket-heads', 'test-jg-laser-collars', 'test-jg-leg-wire', 'test-jg-silo', 'test-jg-cycle', 'test-jg-poison-syringes'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-spiral',
    title: 'Spiral (2021) Trials',
    timelinePeriod: 'legacy-era',
    tone: 'Hot, urban, systemic corruption',
    moralTheme: 'Reform vs. Corruption',
    fictionalLocation: 'Subway tracks & soap factory',
    objective: 'Bypass the subway Tongue trap, Finger trap, Glass Shredder, and Wax face trap.',
    status: 'ready',
    characterIds: ['canon-william-schenk'],
    testIds: ['test-sp-tongue', 'test-sp-finger', 'test-sp-shredder', 'test-sp-wax', 'test-sp-puppet-strings'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-x',
    title: 'Saw X Trials',
    timelinePeriod: 'saw-x-interquel',
    tone: 'Mexican clinic, clinical, intense',
    moralTheme: 'Sociopathy vs. Survival',
    fictionalLocation: 'Decommissioned Mexican chemical plant',
    objective: 'Navigate the Eyeball Vacuum, Gigli Leg Saw, Pipe Bomb, Radiation Mateo Mask, and Blood Pit.',
    status: 'ready',
    characterIds: ['canon-cecilia-pederson', 'canon-amanda-young'],
    testIds: ['test-sx-gigli', 'test-sx-pipebomb', 'test-sx-radiation', 'test-sx-vacuum', 'test-sx-blood-pit', 'test-sx-bone-crusher'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-fictional-architect',
    title: 'Fictional Architect Trials',
    timelinePeriod: 'fan-campaigns',
    tone: 'Industrial, dark, retro',
    moralTheme: 'Corporate Accountability',
    fictionalLocation: 'Gideon Zoning Office',
    objective: 'Complete the core custom trials of Victor Hale, Mara Voss, and Elias Crowe.',
    status: 'ready',
    characterIds: ['char-victor-hale', 'char-mara-voss', 'char-elias-crowe'],
    testIds: ['test-ledger-room-1', 'test-glass-confession-1', 'test-quiet-scale-1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const PRELOADED_TESTS: SymbolicTest[] = [
  // Fictional Campaign Tests
  {
    id: 'test-ledger-room-1',
    campaignId: 'camp-fictional-architect',
    characterId: 'char-victor-hale',
    title: 'The Ledger Calibration',
    moralTheme: 'Truth vs. Reputation',
    openingTape: 'Hello, Victor. You protected developers to secure your career at Gideon. Submit the signature override date 2024-04-12 on the terminal to confession and exit.',
    rules: 'Enter the date "2024-04-12" to unlock Option A.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Enter the manual override date (YYYY-MM-DD):',
      correctAnswer: '2024-04-12'
    },
    clues: ['The signature occurred on 2024-04-12.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-vic-confess', text: 'Select File #BConfess', scoresEffect: { truth: 30, responsibility: 30 }, narrativeImpact: 'Confession files printed and dispatched to regulatory agencies.' },
      { id: 'choice-vic-lie', text: 'Select File #C Lie', scoresEffect: { denial: 35 }, narrativeImpact: 'Safety violation logs purged, maintaining the cover-up.' }
    ],
    safetyNote: 'Fictional test lock.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-glass-confession-1',
    campaignId: 'camp-fictional-architect',
    characterId: 'char-mara-voss',
    title: 'The Reflection of Deceit',
    moralTheme: 'Social Image vs. Responsibility',
    openingTape: 'Mara. Behind Mirror B-2 is the real report. Click B-2 to confess.',
    rules: 'Select B-2 in the confession grid.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Select the mirror that details the cover-up:',
      confessionOptions: [
        { id: 'A-1', text: 'Deflect blame', truthScore: 10 },
        { id: 'B-2', text: 'Admit August 2025 short-circuit hazard prior knowledge', truthScore: 90 },
        { id: 'C-3', text: 'Deflect suppliers', truthScore: 20 }
      ]
    },
    clues: ['August 2025 report is B-2.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-m-c', text: 'Select B-2 Confess', scoresEffect: { truth: 30 }, narrativeImpact: 'Mara broadcasts the corporate warning notes, ending her career but saving lives.' },
      { id: 'choice-m-d', text: 'Select C-3 Deflect', scoresEffect: { denial: 30 }, narrativeImpact: 'Mara blames subcontractors, sealing the whistleblowers\' fate.' }
    ],
    safetyNote: 'Fictional test.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-quiet-scale-1',
    campaignId: 'camp-fictional-architect',
    characterId: 'char-elias-crowe',
    title: 'The Balance of Ledger',
    moralTheme: 'Exploitation vs. Empathy',
    openingTape: 'Elias. Adjust the slider to allocate at least $150,000 of your bonus to the workers compensation fund.',
    rules: 'Set the balance slider to $150,000 or above.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Transfer from Bonus to Workers Fund ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-el-g', text: 'Transfer $180,000 to Workers', scoresEffect: { empathy: 30 }, narrativeImpact: 'Elias Crowe signs the fund allocation. The scales balance.' },
      { id: 'choice-el-k', text: 'Keep cash (Forces failure)', scoresEffect: { denial: 35 }, narrativeImpact: 'Elias keeps his bonus. The weights tilt and lock the vault forever.' }
    ],
    safetyNote: 'Fictional test.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw I Trials
  {
    id: 'test-s1-bathroom',
    campaignId: 'camp-saw-i',
    characterId: 'canon-lawrence-gordon',
    title: 'Bathroom Padlock Key',
    moralTheme: 'Detachment vs. Connection',
    openingTape: 'Hello, Lawrence. The key to your ankle chains is hidden under floor tile B-3. Scan the grid to locate it.',
    rules: 'Locate floor tile B-3 on the grid coordinates.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinates floor tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-gordon-k', text: 'Unlock padlock with key B-3', scoresEffect: { courage: 30, responsibility: 30 }, narrativeImpact: 'Lawrence unlocks the chain padlock and crawls out safely.' },
      { id: 'choice-gordon-f', text: 'Amputate leg (Bypass)', scoresEffect: { courage: 40, denial: 20 }, narrativeImpact: 'Lawrence escapes the bathroom by sawing through his ankle.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s1-bear-trap',
    campaignId: 'camp-saw-i',
    characterId: 'canon-amanda-young',
    title: 'The Reverse Bear Lockway',
    moralTheme: 'Survival vs. Addiction',
    openingTape: 'Amanda. Align the drive shafts on the console so their gear mesh indexes sum to exactly 15.',
    rules: 'Rotate left gear (+3) and right gear (+2) to equal exactly 15.',
    puzzleType: 'maze',
    puzzleData: { question: 'Align gears to sum exactly to 15:', correctAnswer: '15' },
    clues: ['Reach 15 by rotation.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-amanda-s', text: 'Disarm Lock (Submit sum 15)', scoresEffect: { courage: 40 }, narrativeImpact: 'Amanda aligns the gear ratios, unlocking the device safety lock.' },
      { id: 'choice-amanda-f', text: 'Lock triggers', scoresEffect: { denial: 40 }, narrativeImpact: 'The gears jam. Amanda fails to disarm the lock before time expires.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s1-razor-wire',
    campaignId: 'camp-saw-i',
    characterId: 'canon-john-kramer',
    title: 'Razor Wire Exit Lock',
    moralTheme: 'Pain vs. Procrastination',
    openingTape: 'Paul. You slashed your wrists to get attention. Now, you must enter the override code date 2024-04-12 on the keypad before the boiler doors seal.',
    rules: 'Enter the date 2024-04-12 on the dials.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override keypad date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Override date is 2024-04-12.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-paul-s', text: 'Submit 2024-04-12 and open door', scoresEffect: { courage: 30 }, narrativeImpact: 'Paul types the override date, unlocking the razor wire maze exit gate.' },
      { id: 'choice-paul-f', text: 'Fail exit', scoresEffect: { denial: 35 }, narrativeImpact: 'The keypad locks permanently. Paul remains inside the razor wire trap.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s1-flammable-jelly',
    campaignId: 'camp-saw-i',
    characterId: 'canon-john-kramer',
    title: 'Flammable Jelly Code',
    moralTheme: 'Desperation vs. Sloth',
    openingTape: 'Mark. You pretended to be sick to skip work. Now you are covered in flammable jelly with a candle. Scan coordinate B-3 to find the safe override button.',
    rules: 'Scan coordinate tile B-3.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-jelly-s', text: 'Select B-3 and turn off valve', scoresEffect: { courage: 30 }, narrativeImpact: 'Mark selects B-3, triggering the overhead shower and extinguishing the candle.' },
      { id: 'choice-jelly-f', text: 'Fail scan', scoresEffect: { denial: 30 }, narrativeImpact: 'Failed scan locks the valve dials, starting the ignition.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s1-drill-chair',
    campaignId: 'camp-saw-i',
    characterId: 'canon-john-kramer',
    title: 'Drill Chair Latch',
    moralTheme: 'Negligence vs. Duty',
    openingTape: 'Jeff Ridenhour. You let others take risks. Enter the override signature date 2024-04-12 on the keypad dials to release the helmet lock.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override keypad date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use date 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-drill-s', text: 'Submit date and disarm drill', scoresEffect: { courage: 30 }, narrativeImpact: 'The drill stops. The locks release Jeff Ridenhour.' },
      { id: 'choice-drill-f', text: 'Chair locks', scoresEffect: { denial: 35 }, narrativeImpact: 'Incorrect code spins the drills.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s1-shotgun-hallway',
    campaignId: 'camp-saw-i',
    characterId: 'canon-john-kramer',
    title: 'Shotgun Hallway Breaker',
    moralTheme: 'Pride vs. Law',
    openingTape: 'Tapp and Sing. You bypassed warrants. Adjust the voltage slider past $150,000 to halt the shotgun tripwire current.',
    rules: 'Set the balance slider past $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Halt shotgun circuit voltage ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-hall-s', text: 'Bypass tripwire (Slider past $150,000)', scoresEffect: { courage: 30 }, narrativeImpact: 'Sing overrides the voltage, disarming the shotgun tripwire.' },
      { id: 'choice-hall-f', text: 'Tripwire fires', scoresEffect: { denial: 30 }, narrativeImpact: 'Tripwire current trips, discharging the shotgun.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s1-zep-hostage',
    campaignId: 'camp-saw-i',
    characterId: 'canon-john-kramer',
    title: 'Zep\'s Hostage Poison',
    moralTheme: 'Obedience vs. Morality',
    openingTape: 'Zep. You have poison in your blood. The antidote is behind coordinate B-3. Scan the grid to select B-3.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-zep-s', text: 'Select B-3 and retrieve antidote', scoresEffect: { courage: 30 }, narrativeImpact: 'Zep retrieves the antidote cylinder, neutralizing the poison.' },
      { id: 'choice-zep-f', text: 'Antidote lost', scoresEffect: { denial: 30 }, narrativeImpact: 'Zep fails the coordinate sweep. The poison progresses.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw II Trials
  {
    id: 'test-s2-death-mask',
    campaignId: 'camp-saw-ii',
    characterId: 'canon-john-kramer',
    title: 'The Death Mask Scale',
    moralTheme: 'Sacrifice vs. Greed',
    openingTape: 'Michael. The key to the collar is behind your eye. Move the slider to allocate at least $150,000 of power to the auto-release latch.',
    rules: 'Adjust slider to at least $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Power auto-release latch ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-michael-s', text: 'Release latch (Set slider past $150,000)', scoresEffect: { courage: 40 }, narrativeImpact: 'The safety latch clicks open, releasing Michael from the death mask.' },
      { id: 'choice-michael-f', text: 'Fail release', scoresEffect: { denial: 30 }, narrativeImpact: 'Voltage fails to meet target. The death mask springs shut.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s2-needle-pit',
    campaignId: 'camp-saw-ii',
    characterId: 'canon-amanda-young',
    title: 'The Needle Pit Confession',
    moralTheme: 'Sacrifice vs. Cowardice',
    openingTape: 'Amanda. Scan mirror channel B-2 to identify the syringe containing the vault key.',
    rules: 'Select B-2 in the confession grid.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Identify the target syringe channel:',
      confessionOptions: [
        { id: 'A-1', text: 'Empty needle batch', truthScore: 10 },
        { id: 'B-2', text: 'Confess key location: Syringe #2 contains the key', truthScore: 90 },
        { id: 'C-3', text: 'Empty floor sweeps', truthScore: 20 }
      ]
    },
    clues: ['Syringe #2 is B-2.'],
    timerSeconds: 80,
    choices: [
      { id: 'choice-needle-s', text: 'Unlock door (B-2)', scoresEffect: { responsibility: 30 }, narrativeImpact: 'Amanda finds the key cylinder in Syringe #2 and unlocks the steel lock.' },
      { id: 'choice-needle-f', text: 'Timeout', scoresEffect: { denial: 30 }, narrativeImpact: 'The search times out. The door locks permanently.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s2-razor-box',
    campaignId: 'camp-saw-ii',
    characterId: 'canon-john-kramer',
    title: 'The Razor Hand Box',
    moralTheme: 'Impulsiveness vs. Patience',
    openingTape: 'Addison. You reach into jars blindly. To release the overhead padlock, rotate the dial gears to sum exactly to 15.',
    rules: 'Rotate left gear (+3) and right gear (+2) to equal exactly 15.',
    puzzleType: 'maze',
    puzzleData: { question: 'Align gears to sum exactly to 15:', correctAnswer: '15' },
    clues: ['Reach 15 by rotation.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-razor-s', text: 'Release overhead padlock (Submit sum 15)', scoresEffect: { courage: 40 }, narrativeImpact: 'Addison aligns the drive ratios, releasing the lock without putting her hands in the blades.' },
      { id: 'choice-razor-f', text: 'Harness locks', scoresEffect: { denial: 40 }, narrativeImpact: 'The timers run out. Addison gets trapped in the razor box.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s2-furnace',
    campaignId: 'camp-saw-ii',
    characterId: 'canon-john-kramer',
    title: 'Furnace Regulator Lock',
    moralTheme: 'Greed vs. Empathy',
    openingTape: 'Obi. You helped kidnap the others. Enter the override signature date 2024-04-12 on the furnace valve dials before the flames ignite.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the furnace regulator override date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use date 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-obi-s', text: 'Submit date and extinguish furnace', scoresEffect: { courage: 30 }, narrativeImpact: 'Obi enters 2024-04-12. The gas valves shut down, stopping the fire.' },
      { id: 'choice-obi-f', text: 'Valve locks', scoresEffect: { denial: 30 }, narrativeImpact: 'Incorrect code locks the valve dials, starting the furnace burn sequence.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s2-shotgun-peephole',
    campaignId: 'camp-saw-ii',
    characterId: 'canon-john-kramer',
    title: 'Shotgun Peephole Bypass',
    moralTheme: 'Curiosity vs. Caution',
    openingTape: 'Gus. Do not look through the keyhole. Enter the override signature date 2024-04-12 on the keypad dials to disarm the door mechanism.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override keypad date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use date 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-gus-s', text: 'Submit date and open door', scoresEffect: { courage: 30 }, narrativeImpact: 'Gus disarms the shotgun peephole, unlocking the door safely.' },
      { id: 'choice-gus-f', text: 'Shotgun triggers', scoresEffect: { denial: 35 }, narrativeImpact: 'Gus pulls the door handle. The shotgun discharges.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s2-gas-house',
    campaignId: 'camp-saw-ii',
    characterId: 'canon-john-kramer',
    title: 'Nerve Gas House Vent',
    moralTheme: 'Responsibility vs. Deflection',
    openingTape: 'Matthews. The key is in the safe. Scan floor coordinate B-3 to open the vault vent.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate safe tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 110,
    choices: [
      { id: 'choice-vent-s', text: 'Select B-3 and open gas vents', scoresEffect: { responsibility: 30 }, narrativeImpact: 'Matthews scans B-3, starting the extraction fans.' },
      { id: 'choice-vent-f', text: 'Gases trigger', scoresEffect: { denial: 30 }, narrativeImpact: 'The ventilation locks, filling the room with nerve gas.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw III Trials
  {
    id: 'test-s3-freezer',
    campaignId: 'camp-saw-iii',
    characterId: 'canon-john-kramer',
    title: 'Freezer Water Valve Lock',
    moralTheme: 'Forgiveness vs. Apathy',
    openingTape: 'Jeff. Danica stood by and did nothing when your son was run over. To stop the freezing water, enter the date 2024-04-12 on the code terminal.',
    rules: 'Enter the date 2024-04-12 on the dials.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the valve override date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Code is 2024-04-12.'],
    timerSeconds: 110,
    choices: [
      { id: 'choice-danica-s', text: 'Submit date and stop sprinklers', scoresEffect: { empathy: 35 }, narrativeImpact: 'Jeff overrides the sprinkler system, rescuing Danica from the freeze.' },
      { id: 'choice-danica-f', text: 'Allow freezing', scoresEffect: { denial: 30 }, narrativeImpact: 'Jeff hesitates too long. The freezer locks seal.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s3-angel',
    campaignId: 'camp-saw-iii',
    characterId: 'canon-john-kramer',
    title: 'The Angel Lockway Gears',
    moralTheme: 'Survival vs. Despair',
    openingTape: 'Kerry. You live among the dead. To disarm the chest bracket keys, rotate the drive gears to sum exactly to 15.',
    rules: 'Rotate left gear (+3) and right gear (+2) to equal exactly 15.',
    puzzleType: 'maze',
    puzzleData: { question: 'Rotate gears to sum exactly to 15:', correctAnswer: '15' },
    clues: ['Align the ratios to sum to 15.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-kerry-s', text: 'Disarm chest lock (Submit 15)', scoresEffect: { courage: 40 }, narrativeImpact: 'Kerry aligns the gears to 15, dropping the harness latch key.' },
      { id: 'choice-kerry-f', text: 'Lock triggers', scoresEffect: { denial: 35 }, narrativeImpact: 'Amanda\'s rigged harness fails to release, executing the blast.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s3-rack',
    campaignId: 'camp-saw-iii',
    characterId: 'canon-john-kramer',
    title: 'The Rack Torque Mesh',
    moralTheme: 'Forgiveness vs. Vengeance',
    openingTape: 'Jeff. This is Timothy, the driver. Align the torque drive gears on the console to sum to exactly 15 to release the key.',
    rules: 'Rotate left torque (+3) and right torque (+2) to equal 15.',
    puzzleType: 'maze',
    puzzleData: { question: 'Align torque gears to sum to 15:', correctAnswer: '15' },
    clues: ['Sum of 15 halts the twist.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-rack-s', text: 'Deengage rack (Submit 15)', scoresEffect: { empathy: 40, responsibility: 30 }, narrativeImpact: 'Jeff balances the gears to 15, stopping the rotation of the rack.' },
      { id: 'choice-rack-f', text: 'Limbs twist', scoresEffect: { denial: 45, empathy: -40 }, narrativeImpact: 'Jeff fails to unlock the gears. Timothy\'s joints twist.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s3-classroom',
    campaignId: 'camp-saw-iii',
    characterId: 'canon-john-kramer',
    title: 'Classroom Trap Chains',
    moralTheme: 'Escapism vs. Pain',
    openingTape: 'Troy. You were constantly in jail. To break the chain current pins, move the slider to allocate at least $150,000 to the release clamps.',
    rules: 'Set the scale slider past $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Disconnect classroom current clamps ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-troy-s', text: 'Dethread clamps (Slider past $150,000)', scoresEffect: { courage: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-troy-f', text: 'Current spikes', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s3-pig-vat',
    campaignId: 'camp-saw-iii',
    characterId: 'canon-john-kramer',
    title: 'Pig Vat Acid Latch',
    moralTheme: 'Empathy vs. Resentment',
    openingTape: 'Jeff. This is Judge Halden who gave your son\'s killer a light sentence. Move the voltage slider past $150,000 to open the grate override.',
    rules: 'Set scale slider past $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Open pig vat grate lock ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-halden-s', text: 'Save Judge Halden (Slider past $150,000)', scoresEffect: { empathy: 40, responsibility: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-halden-f', text: 'Grinder activates', scoresEffect: { denial: 40, empathy: -35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw IV Trials
  {
    id: 'test-s4-mausoleum',
    campaignId: 'camp-saw-iv',
    characterId: 'canon-john-kramer',
    title: 'Mausoleum Key Coordinates',
    moralTheme: 'Cooperation vs. Blind Rage',
    openingTape: 'Art. Your mouth is sewn shut; Trevor\'s eyes are sewn shut. The key to the collar is behind coordinate B-3. Scan the grid to select B-3.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-maus-s', text: 'Select B-3 and unlock collars', scoresEffect: { cooperation: 40 }, narrativeImpact: 'Art scans B-3. The key slot triggers, releasing both men from their chains.' },
      { id: 'choice-maus-f', text: 'Fail scan', scoresEffect: { denial: 30 }, narrativeImpact: 'Incorrect selection triggers the chain winch, executing Trevor.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s4-knife-chair',
    campaignId: 'camp-saw-iv',
    characterId: 'canon-john-kramer',
    title: 'The Knife Chair Scale',
    moralTheme: 'Pain vs. Accountability',
    openingTape: 'Cecil. You caused the loss of my child at Gideon. Press your face against the harness and move the slider past $150,000 to trigger the release latch.',
    rules: 'Move scale slider to at least $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Press face plates to release latch ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-cecil-s', text: 'Trigger release (Set slider past $150,000)', scoresEffect: { courage: 40, responsibility: 30 }, narrativeImpact: 'Cecil presses the scale sensor past $150,000, popping the lock.' },
      { id: 'choice-cecil-f', text: 'Harness locks', scoresEffect: { denial: 35 }, narrativeImpact: 'Cecil refuses to apply pressure. The knives remain locked.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s4-hair',
    campaignId: 'camp-saw-iv',
    characterId: 'canon-john-kramer',
    title: 'The Hair Scalp Lock',
    moralTheme: 'Arrogance vs. Redemption',
    openingTape: 'Brenda. You exploited girls. Enter the override signature date 2024-04-12 on the gear keypad dials to release the hair pulley.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override keypad date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use date 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-hair-s', text: 'Submit date and disarm scalp gears', scoresEffect: { courage: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-hair-f', text: 'Gears pull', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s4-spikes',
    campaignId: 'camp-saw-iv',
    characterId: 'canon-john-kramer',
    title: 'Rex & Morgan Spikes',
    moralTheme: 'Abuse vs. Self-Defense',
    openingTape: 'Morgan. Rex abused you. Scan coordinate B-3 to release the spikes safety key.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate safety tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-spike-s', text: 'Select B-3 and pull spikes', scoresEffect: { courage: 30, responsibility: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-spike-f', text: 'Key locks', scoresEffect: { denial: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s4-bedroom',
    campaignId: 'camp-saw-iv',
    characterId: 'canon-john-kramer',
    title: 'Ivan\'s Bedroom Harness',
    moralTheme: 'Depravity vs. Forfeiture',
    openingTape: 'Ivan. You filmed abuse. Move the scale slider past $150,000 to trigger the release clamps.',
    rules: 'Adjust scale slider to at least $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Trigger release clamps ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-ivan-s', text: 'Trigger release (Set slider past $150,000)', scoresEffect: { courage: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-ivan-f', text: 'Clamps pull', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw V Trials
  {
    id: 'test-s5-pendulum',
    campaignId: 'camp-saw-v',
    characterId: 'canon-mark-hoffman',
    title: 'The Pendulum Bypass',
    moralTheme: 'Retribution vs. Law',
    openingTape: 'Seth. You murdered my sister. Adjust the voltage slider past $150,000 to halt the pendulum brake.',
    rules: 'Set the balance slider past $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Halt pendulum blade circuit ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 95,
    choices: [
      { id: 'choice-p-s', text: 'Bypass blade (Slider past $150,000)', scoresEffect: { courage: 30 }, narrativeImpact: 'Seth pushes the breaker slider past $150,000, locking the pendulum brake.' },
      { id: 'choice-p-f', text: 'Blade falls', scoresEffect: { denial: 30 }, narrativeImpact: 'Voltage stays low. Hoffman\'s pendulum cuts Seth.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s5-blood-saws',
    campaignId: 'camp-saw-v',
    characterId: 'canon-mark-hoffman',
    title: 'The 10 Pints of Blood',
    moralTheme: 'Cooperation vs. Self-Preservation',
    openingTape: 'Mallick and Brit. You must fill the beaker. Move the slider to allocate at least $150,000 of scale weight to the collection scale.',
    rules: 'Set slider to at least $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Fill collection scale ledger ($250,000 max):' },
    clues: ['Cooperate to slide past $150,000.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-s5-cooperate', text: 'Cooperate and pull hand saws (Submit $180,000)', scoresEffect: { cooperation: 50, courage: 30 }, narrativeImpact: 'They share the burden, sliding the weight index past $150,000 to open the door.' },
      { id: 'choice-s5-selfish', text: 'Selfish delay (Keep slider low)', scoresEffect: { cooperation: -40, denial: 30 }, narrativeImpact: 'They fight for individual safety. The timers expire and execute both.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s5-collar-keys',
    campaignId: 'camp-saw-v',
    characterId: 'canon-mark-hoffman',
    title: 'Collar Key coordinates',
    moralTheme: 'Panic vs. Logic',
    openingTape: 'Five subjects. The keys to the collars are in the safety drawer coordinate B-3. Scan B-3 to open the drawers.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate drawer (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-collar-s', text: 'Select B-3 and open drawers', scoresEffect: { cooperation: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-collar-f', text: 'Drawers lock', scoresEffect: { denial: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s5-water-cube',
    campaignId: 'camp-saw-v',
    characterId: 'canon-mark-hoffman',
    title: 'Peter Strahm Water Cube',
    moralTheme: 'Survival vs. Asphyxiation',
    openingTape: 'Strahm. You searched too deep. Enter the override signature date 2024-04-12 on the tank valve dials to drain the cube.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the water override date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use code 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-water-s', text: 'Submit date and drain water tank', scoresEffect: { courage: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-water-f', text: 'Cube fills', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw VI Trials
  {
    id: 'test-s6-oxygen',
    campaignId: 'camp-saw-vi',
    characterId: 'canon-john-kramer',
    title: 'The Oxygen Crusher',
    moralTheme: 'Actuarial Formula vs. Breath',
    openingTape: 'William. Your health formulas dictate who breathes. Scan grid coordinate B-3 to open the oxygen override.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate oxygen tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 85,
    choices: [
      { id: 'choice-oxy-s', text: 'Open oxygen valve B-3', scoresEffect: { responsibility: 30 }, narrativeImpact: 'William opens the B-3 valve, securing his oxygen supply.' },
      { id: 'choice-oxy-f', text: 'Crusher contracts', scoresEffect: { denial: 30 }, narrativeImpact: 'Failed scan locks the valve. The side plates crush the lungs.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s6-gallows',
    campaignId: 'camp-saw-vi',
    characterId: 'canon-john-kramer',
    title: 'The Gallows Selection',
    moralTheme: 'Value of Life vs. Utility',
    openingTape: 'William. On the left is Addy (family), on the right is Allen (isolated). Scan coordinate B-3 to choose who lives.',
    rules: 'Select B-3 to pull the release lever.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan release lever coordinates B-3:', correctAnswer: 'B-3' },
    clues: ['Pull B-3.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-gallows-s', text: 'Pull release lever B-3', scoresEffect: { empathy: 30, responsibility: 30 }, narrativeImpact: 'William pulls the lever for B-3, sparing Addy\'s life.' },
      { id: 'choice-gallows-f', text: 'Gallows drop', scoresEffect: { denial: 30 }, narrativeImpact: 'William fails to choose. Both gallows drop simultaneously.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s6-carousel',
    campaignId: 'camp-saw-vi',
    characterId: 'canon-john-kramer',
    title: 'The Shotgun Carousel',
    moralTheme: 'Corporate Auditing vs. Empathy',
    openingTape: 'William. Six of your assistants are on the carousel. Behind Mirror B-2 is the audit log containing their files. Scan B-2 to confess.',
    rules: 'Select B-2 in the confession grid.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Identify the audit log mirror B-2:',
      confessionOptions: [
        { id: 'A-1', text: 'Save corporate assets', truthScore: 10 },
        { id: 'B-2', text: 'Confess: Accept responsibility for our calculations', truthScore: 90 },
        { id: 'C-3', text: 'Deflect audits', truthScore: 20 }
      ]
    },
    clues: ['Confession log is B-2.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-caro-s', text: 'Unlock safety override (B-2)', scoresEffect: { empathy: 40, responsibility: 30 }, narrativeImpact: 'William submits B-2. The carousel stops, saving two of his staff.' },
      { id: 'choice-caro-f', text: 'Carousel spins', scoresEffect: { denial: 40 }, narrativeImpact: 'Carousel shotgun sweeps all six assistants.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s6-steam-maze',
    campaignId: 'camp-saw-vi',
    characterId: 'canon-john-kramer',
    title: 'Debbie\'s Steam Maze',
    moralTheme: 'Survival vs. Delay',
    openingTape: 'Debbie. To redirect the hot steam flow, rotate the boiler safety gears to sum exactly to 15.',
    rules: 'Rotate left gear (+3) and right gear (+2) to equal exactly 15.',
    puzzleType: 'maze',
    puzzleData: { question: 'Align steam redirect gears to sum to 15:', correctAnswer: '15' },
    clues: ['Align gears to sum to 15.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-steam-s', text: 'Redirect steam (Submit sum 15)', scoresEffect: { courage: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-steam-f', text: 'Valve bursts', scoresEffect: { denial: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s6-acid-latch',
    campaignId: 'camp-saw-vi',
    characterId: 'canon-john-kramer',
    title: 'Brent\'s Acid Injection',
    moralTheme: 'Forgiveness vs. Retribution',
    openingTape: 'Brent. William caused your father\'s death. The release lever to the acid is behind coordinate B-3. Scan B-3 to decide.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinates release lever (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-acid-s', text: 'Forgive William Easton (Select B-3 and lock override)', scoresEffect: { empathy: 45, responsibility: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-acid-f', text: 'Inject Acid', scoresEffect: { denial: 40, empathy: -45 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw VII Trials
  {
    id: 'test-s7-horsepower',
    campaignId: 'camp-saw-vii',
    characterId: 'canon-mark-hoffman',
    title: 'Horsepower Chain Release',
    moralTheme: 'Bigotry vs. Survival',
    openingTape: 'Evan. You judged others by skin color. Rotate the chain release drive gears to sum exactly to 15 to shut off the engine.',
    rules: 'Rotate left gear (+3) and right gear (+2) to equal exactly 15.',
    puzzleType: 'maze',
    puzzleData: { question: 'Rotate gears to sum exactly to 15:', correctAnswer: '15' },
    clues: ['Reach 15 index.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-hp-s', text: 'Kill engine circuit (Submit 15)', scoresEffect: { courage: 30 }, narrativeImpact: 'Evan aligns the gears to 15, pulling the safety cutoff switch.' },
      { id: 'choice-hp-f', text: 'Tires rotate', scoresEffect: { denial: 35 }, narrativeImpact: 'The engine revs. The jacks fall and crush the victims.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s7-silence',
    campaignId: 'camp-saw-vii',
    characterId: 'canon-lawrence-gordon',
    title: 'The Silence Latch Lock',
    moralTheme: 'Exploitation vs. Truth',
    openingTape: 'Bobby. You lied about surviving Jigsaw for fame. To open Nina\'s stomach key latch, enter the override date 2024-04-12.',
    rules: 'Enter the date 2024-04-12 on the dials.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Override date is 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-sil-s', text: 'Submit date and silence lock', scoresEffect: { truth: 30, courage: 20 }, narrativeImpact: 'Bobby inputs 2024-04-12, unlocking the silence safety bracket.' },
      { id: 'choice-sil-f', text: 'Latch pulls', scoresEffect: { denial: 40 }, narrativeImpact: 'Bobby fails. The hooks pull through the throat of the victim.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s7-lawnmower',
    campaignId: 'camp-saw-vii',
    characterId: 'canon-mark-hoffman',
    title: 'The Lawnmower Latch',
    moralTheme: 'Complicity vs. Sacrifice',
    openingTape: 'Cale. You enabled Bobby\'s fraud. Move the slider to allocate at least $150,000 of scale pressure to open the blindfold locks.',
    rules: 'Adjust slider to at least $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Unlock blindfold locks voltage ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-mow-s', text: 'Release locks (Slider past $150,000)', scoresEffect: { courage: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-mow-f', text: 'Blades trigger', scoresEffect: { denial: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s7-spike-cage',
    campaignId: 'camp-saw-vii',
    characterId: 'canon-mark-hoffman',
    title: 'Bobby\'s Spike Cage',
    moralTheme: 'Greed vs. Integrity',
    openingTape: 'Bobby. To release the key to Joyce\'s neck lock, move the slider past $150,000 to raise the cage chains.',
    rules: 'Set slider past $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Raise spike cage voltage ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 95,
    choices: [
      { id: 'choice-cage-s', text: 'Raise cage (Slider past $150,000)', scoresEffect: { courage: 40, responsibility: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-cage-f', text: 'Cage drops', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-s7-public-exec',
    campaignId: 'camp-saw-vii',
    characterId: 'canon-lawrence-gordon',
    title: 'Public Circular Saws',
    moralTheme: 'Deceit vs. Retribution',
    openingTape: 'Ryan and Brad. Dina played both of you. Scan coordinate B-3 to direct the saw blade path.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate saw tile B-3:', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-pub-s', text: 'Cooperate and center blade (B-3)', scoresEffect: { cooperation: 45 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-pub-f', text: 'Blade shifts', scoresEffect: { denial: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Jigsaw (2017)
  {
    id: 'test-jg-bucket-heads',
    campaignId: 'camp-jigsaw',
    characterId: 'canon-logan-nelson',
    title: 'The Bucket Head Scanner',
    moralTheme: 'Confession vs. Denial',
    openingTape: 'Anna. The lock unlocks with a small blood deposit. Scan floor coordinate B-3 to locate the override button.',
    rules: 'Scan coordinate tile B-3.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-b-s', text: 'Submit scan coordinate B-3', scoresEffect: { courage: 30 }, narrativeImpact: 'Anna scans B-3. The door locks disengage, releasing the bucket helm.' },
      { id: 'choice-b-f', text: 'Chains pull', scoresEffect: { denial: 30 }, narrativeImpact: 'Chains pull the victims into the circular saws.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-jg-laser-collars',
    campaignId: 'camp-jigsaw',
    characterId: 'canon-logan-nelson',
    title: 'Laser Collar Frequency',
    moralTheme: 'Accountability vs. Deceit',
    openingTape: 'Halloran. You protected killers. Scan coordinate B-3 to bypass the laser emitter voltage.',
    rules: 'Find coordinate B-3 to bypass emitter.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate laser tile (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-laser-s', text: 'Bypass laser emitter (B-3)', scoresEffect: { truth: 40, responsibility: 30 }, narrativeImpact: 'Halloran scans B-3. The laser collar discharges safely.' },
      { id: 'choice-laser-f', text: 'Laser fires', scoresEffect: { denial: 40 }, narrativeImpact: 'The lasers initiate their cutting pass on the subject.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-jg-leg-wire',
    campaignId: 'camp-jigsaw',
    characterId: 'canon-logan-nelson',
    title: 'Ryan\'s Leg Wire Cut',
    moralTheme: 'Desperation vs. Caution',
    openingTape: 'Ryan. You took structural shortcuts. Move the slider past $150,000 to disconnect the wire winch tension.',
    rules: 'Set slider past $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Disconnect wire winch current ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-wire-s', text: 'Release tension (Slider past $150,000)', scoresEffect: { courage: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-wire-f', text: 'Winch pulls', scoresEffect: { denial: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-jg-silo',
    campaignId: 'camp-jigsaw',
    characterId: 'canon-logan-nelson',
    title: 'The Grain Silo Dials',
    moralTheme: 'Integrity vs. Avarice',
    openingTape: 'Ryan and Mitch. Enter the override signature date 2024-04-12 on the silo valve dials to drain the falling grain.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override keypad date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use code 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-silo-s', text: 'Submit date and drain silo', scoresEffect: { cooperation: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-silo-f', text: 'Silo fills', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-jg-cycle',
    campaignId: 'camp-jigsaw',
    characterId: 'canon-logan-nelson',
    title: 'Mitch\'s Cycle Trap',
    moralTheme: 'Responsibility vs. Neglect',
    openingTape: 'Mitch. You sold a broken motorcycle. Rotate the cycle drive gears on the console to sum to exactly 15 to halt the engine cycle.',
    rules: 'Rotate left gear (+3) and right gear (+2) to equal exactly 15.',
    puzzleType: 'maze',
    puzzleData: { question: 'Rotate gears to sum exactly to 15:', correctAnswer: '15' },
    clues: ['Ratio must equal 15.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-cycle-s', text: 'Halt cycle engine (Submit 15)', scoresEffect: { courage: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-cycle-f', text: 'Engine revs', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Spiral (2021)
  {
    id: 'test-sp-tongue',
    campaignId: 'camp-spiral',
    characterId: 'canon-william-schenk',
    title: 'The Tongue Subway Release',
    moralTheme: 'Truth vs. Lies',
    openingTape: 'Boswick. You lied on the stand. Move the voltage slider past $150,000 to halt the subway track feed.',
    rules: 'Adjust slider to at least $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Subway track override voltage ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 85,
    choices: [
      { id: 'choice-tongue-s', text: 'Halt Train (Set slider past $150,000)', scoresEffect: { courage: 30, truth: 25 }, narrativeImpact: 'Boswick overrides the track voltage, stopping the train.' },
      { id: 'choice-tongue-f', text: 'Train departs', scoresEffect: { denial: 30 }, narrativeImpact: 'The train proceeds. The tongue bracket tears free.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-sp-finger',
    campaignId: 'camp-spiral',
    characterId: 'canon-william-schenk',
    title: 'The Finger Latch Override',
    moralTheme: 'Reform vs. Corruption',
    openingTape: 'Fitch. You shot a civilian. Enter the override date 2024-04-12 on the dial terminal to cut off the water current.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override dial date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Override date is 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-finger-s', text: 'Submit date and disconnect currents', scoresEffect: { courage: 30, responsibility: 30 }, narrativeImpact: 'Fitch enters the code, shutting off the bath current.' },
      { id: 'choice-finger-f', text: 'Current flows', scoresEffect: { denial: 35 }, narrativeImpact: 'The water current surges, executing Detective Fitch.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-sp-shredder',
    campaignId: 'camp-spiral',
    characterId: 'canon-william-schenk',
    title: 'Glass Shredder coordinates',
    moralTheme: 'Corruption vs. Accountability',
    openingTape: 'Ezekiel Banks. The safety switch to the glass shredder is coordinate B-3. Scan B-3 to bypass the shredder.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate shredder (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-shred-s', text: 'Select B-3 and bypass shredder', scoresEffect: { courage: 30, responsibility: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-shred-f', text: 'Shredder activates', scoresEffect: { denial: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-sp-wax',
    campaignId: 'camp-spiral',
    characterId: 'canon-william-schenk',
    title: 'Kara Wax Face override',
    moralTheme: 'Lies vs. Pain',
    openingTape: 'Kara. You fabricated police reports. Enter override date 2024-04-12 on dials to stop the hot wax pipe current.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override dial date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use date 2024-04-12.'],
    timerSeconds: 100,
    choices: [
      { id: 'choice-wax-s', text: 'Submit date and disconnect wax valve', scoresEffect: { courage: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-wax-f', text: 'Valve triggers', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Saw X
  {
    id: 'test-sx-gigli',
    campaignId: 'camp-saw-x',
    characterId: 'canon-cecilia-pederson',
    title: 'Gigli Saw Voltage',
    moralTheme: 'Will to Live vs. Greed',
    openingTape: 'Valentina. You scammed sick patients. Balance the scales slider past $150,000 to release the leg harness.',
    rules: 'Set balance slider past $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Gigli Saw Latch override ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-gigli-s', text: 'Release leg harness (Slider past $150,000)', scoresEffect: { courage: 40 }, narrativeImpact: 'Valentina pushes the slider past $150,000, dropping the gigli saw harness.' },
      { id: 'choice-gigli-f', text: 'Saw activates', scoresEffect: { denial: 35 }, narrativeImpact: 'Scale remains unbalanced. The saw executes its path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-sx-pipebomb',
    campaignId: 'camp-saw-x',
    characterId: 'canon-cecilia-pederson',
    title: 'Pipe Bomb Safe Override',
    moralTheme: 'Desire vs. Accountability',
    openingTape: 'Diego. You fake-inspected the clinic. Saisie date 2024-04-12 to disarm the chemical pipe bombs on your arms.',
    rules: 'Enter the date 2024-04-12.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the override date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Override date is 2024-04-12.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-pb-s', text: 'Submit date and disarm bombs', scoresEffect: { courage: 30, responsibility: 30 }, narrativeImpact: 'Diego overrides the safe dials, disarming the arm pipe bombs.' },
      { id: 'choice-pb-f', text: 'Bombs detonate', scoresEffect: { denial: 40 }, narrativeImpact: 'The timers run out. The chemical charges ignite.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-sx-radiation',
    campaignId: 'camp-saw-x',
    characterId: 'canon-cecilia-pederson',
    title: 'Radiation Mask Key',
    moralTheme: 'Will vs. Sloth',
    openingTape: 'Mateo. You fake-anesthetized terminal patients. Enter the date 2024-04-12 on the terminal lock dials to release the helmet safety latch.',
    rules: 'Enter the date 2024-04-12 on the dials.',
    puzzleType: 'logic',
    puzzleData: { question: 'Enter the helmet safety dial date (YYYY-MM-DD):', correctAnswer: '2024-04-12' },
    clues: ['Use override code 2024-04-12.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-rad-s', text: 'Submit date and disarm radiation mask', scoresEffect: { courage: 30 }, narrativeImpact: 'Mateo overrides the helmet latch, releasing the safety lock.' },
      { id: 'choice-rad-f', text: 'Mask activates', scoresEffect: { denial: 40 }, narrativeImpact: 'The mask coils ignite, triggering the radiation shield.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-sx-vacuum',
    campaignId: 'camp-saw-x',
    characterId: 'canon-cecilia-pederson',
    title: 'Eyeball Vacuum scale',
    moralTheme: 'Theft vs. Loss',
    openingTape: 'Mark. You stole from patients. Move the scale slider past $150,000 to trigger the fingers release voltage.',
    rules: 'Adjust slider to at least $150,000.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Fingers release current balance ($250,000 max):' },
    clues: ['Slide past $150,000.'],
    timerSeconds: 90,
    choices: [
      { id: 'choice-vac-s', text: 'Submit scale override (Slider past $150,000)', scoresEffect: { courage: 40 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-vac-f', text: 'Vacuum triggers', scoresEffect: { denial: 35 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-sx-blood-pit',
    campaignId: 'camp-saw-x',
    characterId: 'canon-cecilia-pederson',
    title: 'Blood Pit Coordinates',
    moralTheme: 'Innocence vs. Greed',
    openingTape: 'John and Leo. The blood pit release coordinate is B-3. Scan B-3 to open the water latch.',
    rules: 'Find coordinate B-3 on the grid tiles.',
    puzzleType: 'choice',
    puzzleData: { question: 'Scan coordinate release latch (A-1 to C-3):', correctAnswer: 'B-3' },
    clues: ['Scan B-3.'],
    timerSeconds: 110,
    choices: [
      { id: 'choice-pit-s', text: 'Select B-3 and open release latch', scoresEffect: { courage: 40, responsibility: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' },
      { id: 'choice-pit-f', text: 'Water locks', scoresEffect: { denial: 30 } , narrativeImpact: 'The selected outcome is recorded in the moral ledger and changes the subject path.' }
    ],
    safetyNote: 'Fictional simulation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const PRELOADED_LORE_EVENTS: LoreEvent[] = [
  {
    id: 'lore-pre-saw-i',
    title: 'The Tragedy at Gideon Building & Logan\'s Shift',
    period: 'pre-saw-i',
    summary: 'John Kramer, a civil engineer, suffers the loss of his unborn child after an incident at the Gideon Clinic. Shortly after, he is diagnosed with terminal frontal lobe cancer. He goes to military pathologist Logan Nelson for diagnosis, who accidentally swaps his X-rays with another patient, causing a fatal delay in John\'s cancer treatment. Realizing his terminal state, John attempts suicide but survives, leading to his epiphany.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-jill-tuck', 'canon-logan-nelson'],
    notes: 'Meta-Analysis: The Logan Nelson X-ray mistake is a major retroactive continuity (retcon) introduced in Jigsaw (2017) to explain Logan\'s inclusion as the "first" apprentice. This retcon created timeline friction with Saw I, as Logan was spared before Amanda Young had survived her Reverse Bear Trap.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-i',
    title: 'The Bathroom Ordeal & Lawrence Gordon',
    period: 'saw-i',
    summary: 'Two men (Dr. Lawrence Gordon and photographer Adam Stanheight) wake up chained to pipes in an abandoned subterranean bathroom. Dr. Lawrence Gordon must cut off his foot to escape. He does so, crawling out to get help, and is saved by John Kramer who cauterizes his stump. Gordon subsequently joins John as a secret apprentice.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-lawrence-gordon'],
    notes: 'Meta-Analysis: The bathroom remains the iconic core of the franchise. The twist in Saw 3D that Gordon was Jigsaw\'s medical accomplice was a direct fan-service callback, resolving the mystery of who performed surgical implants on Jigsaw\'s victims.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-x',
    title: 'The Pederson Scam & Mexican Interquel',
    period: 'saw-x-interquel',
    summary: 'John Kramer travels to Mexico for a fake experimental cancer cure run by Cecilia Pederson. Discovering the scam, John and Amanda Young gather the fraud crew for a series of moral challenges in a decommissioned chemical facility.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-cecilia-pederson', 'canon-amanda-young'],
    notes: 'Meta-Analysis: Set between Saw I and Saw II. This film features John Kramer as the clear protagonist rather than a shadowy antagonist. Chronologically, this interquel occurred when John was already training Amanda, but before he designed the Nerve Gas House.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-ii',
    title: 'The Nerve Gas House & Hoffman\'s Secret Assist',
    period: 'saw-ii',
    summary: 'Jigsaw traps several convicts (along with detective Matthews\' son) inside a house filling with nerve gas. The house game runs in parallel to detective Matthews interrogating John. The game reveals Amanda Young operating as Jigsaw\'s disciple.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-amanda-young', 'canon-mark-hoffman'],
    notes: 'Meta-Analysis: The movie marks the debut of Mark Hoffman (as a background officer) and establishes Amanda\'s transition. Retcons in Saw V reveal that Hoffman actually set up the monitors and mechanical locks for this game, hiding his involvement from the police face.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-saw-iii-iv',
    title: 'The Succession War & Apprentice Pitfall',
    period: 'saw-iii-iv',
    summary: 'John Kramer is bedridden and dying. Amanda Young fails the tests, building rigged traps because she no longer believes in rehabilitation. Detective Mark Hoffman blackmails Amanda (threatening to reveal her role in Jill Tuck\'s clinic tragedy) to force her failure, ensuring he will become Jigsaw\'s sole successor. John and Amanda die, and Hoffman inherits the mantle.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-john-kramer', 'canon-amanda-young', 'canon-mark-hoffman', 'canon-jill-tuck'],
    notes: 'Meta-Analysis: Saw III and Saw IV occur simultaneously. This era marks the franchise\'s transition from philosophical tests (John) to brutal, inescapable trap execution designs (Hoffman), reflecting a shift in directorial style and production focus.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-posthumous',
    title: 'The Hoffman Regency & The Gordon Execution',
    period: 'posthumous',
    summary: 'Detective Hoffman operates as Jigsaw. Jill Tuck receives John\'s posthumous directives box containing a Reverse Bear Trap for Hoffman. Hoffman escapes the trap, hunts Jill down, and kills her. Immediately after, Dr. Lawrence Gordon and two masked pig helpers kidnap Hoffman, locking him in the bathroom trap without a saw.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-mark-hoffman', 'canon-jill-tuck', 'canon-lawrence-gordon'],
    notes: 'Meta-Analysis: Chronological end of the original continuity line (Saw VII/3D). Gordon\'s role as the final executioner was John\'s backup plan to protect Jill. Hoffman\'s fate is left unresolved in the bathroom, creating a massive continuity cliffhanger.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-legacy-1',
    title: 'The Logan Nelson Reconstruction Game',
    period: 'legacy-era',
    summary: 'Ten years after John Kramer\'s death, military pathologist Logan Nelson, having returned from service, kills corrupt detective Halloran by placing him in a laser collar trap. Logan reconstructs Jigsaw\'s first game (which occurred before Saw I) to frame Halloran and avenge his father\'s death.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-logan-nelson', 'canon-john-kramer'],
    notes: 'Meta-Analysis: Jigsaw (2017) acts as a soft-reboot. It uses a "dual timeline" trick: the barn game shown throughout the film takes place before Saw I, while the police investigation is happening in the present day.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lore-legacy-2',
    title: 'The Article VIII Copycat (Spiral)',
    period: 'legacy-era',
    summary: 'William Schenk, a young detective, copies Jigsaw\'s trap aesthetic to target corrupt officers under Article VIII, a police directive that protected brutal cops. He tests several high-ranking officers, culminating in the execution of Chief Monroe.',
    canonStatus: 'canon',
    relatedCharacters: ['canon-william-schenk'],
    notes: 'Meta-Analysis: Spiral (2021) is a spin-off. The film completely strips the moral/philosophical element of Kramer\'s trials, transforming Jigsaw\'s legacy into a political weapon for institutional reform. It represents the final mutation of Jigsaw\'s method.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

