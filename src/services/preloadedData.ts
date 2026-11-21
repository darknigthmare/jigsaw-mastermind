import type { Campaign, CharacterProfile, SymbolicTest, LoreEvent } from '../types';
import { DERNIER_RELAIS_CAMPAIGN, DERNIER_RELAIS_CHARACTERS, DERNIER_RELAIS_TESTS } from './dernierRelaisData';
import { UNE_DE_MINUIT_CAMPAIGN, UNE_DE_MINUIT_CHARACTERS, UNE_DE_MINUIT_TESTS } from './laUneDeMinuitData';
import { ROSTER_CAMPAIGN, ROSTER_CHARACTERS, ROSTER_TESTS } from './rosterData';
import { SAW_ONE_TWO_TESTS } from './sawOneTwoData';
import { SAW_THREE_FOUR_TESTS } from './sawThreeFourData';
import { SAW_FIVE_SEVEN_TESTS } from './sawFiveSevenData';
import { SAW_LEGACY_TESTS } from './sawLegacyData';

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
  },
  {
    id: 'canon-adam-stanheight',
    name: 'Adam Stanheight',
    role: 'Photographer / First Victim',
    archetype: 'The Passive Observer',
    timelinePeriod: 'saw-i',
    moralFlaw: 'Taking paid under-the-table photos of others, hiding behind his lens.',
    symbolicFear: 'Being observed and forgotten in the dark.',
    redemptionGoal: 'Escape chains by cooperating and finding key.',
    denialPattern: 'Claims "I just take the pictures, I don\'t make the news."',
    relationships: 'Dr. Lawrence Gordon (fellow captive), John Kramer (captor)',
    canonStatus: 'canon',
    notes: 'Adam is the classic counterweight to Dr. Gordon. He is left to die in the bathroom.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-eric-matthews',
    name: 'Eric Matthews',
    role: 'Police Detective',
    archetype: 'The Violent Cop',
    timelinePeriod: 'saw-ii',
    moralFlaw: 'Falsifying evidence and brutalizing suspects.',
    symbolicFear: 'Losing control and being helpless to save his son.',
    redemptionGoal: 'Patience and negotiation with Kramer.',
    denialPattern: 'Believes physical force is the only way to get answers.',
    relationships: 'Daniel Matthews (son), Amanda Young (captor)',
    canonStatus: 'canon',
    notes: 'Main target of Saw II, tested in the Bathroom in Saw III, dies in Saw IV.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-daniel-rigg',
    name: 'SWAT Commander',
    role: 'Officer Daniel Rigg',
    archetype: 'The Obsessive Savior',
    timelinePeriod: 'saw-iii-iv',
    moralFlaw: 'Inability to let others save themselves, saving people who don\'t want to be saved.',
    symbolicFear: 'Failing to protect his team and friends.',
    redemptionGoal: 'Learn to wait and let the clock run out.',
    denialPattern: 'Insists "I have to save them, it\'s my job."',
    relationships: 'Eric Matthews (friend), Detective Hoffman (friend/adversary)',
    canonStatus: 'canon',
    notes: 'Tested throughout the city in Saw IV.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-peter-strahm',
    name: 'Peter Strahm',
    role: 'FBI Special Agent',
    archetype: 'The Untrusting Investigator',
    timelinePeriod: 'saw-v',
    moralFlaw: 'Single-minded obsession with hunting Jigsaw accomplices, ignoring warnings.',
    symbolicFear: 'Being trapped and crushed by the system.',
    redemptionGoal: 'Trust Jigsaw\'s final tape warning and enter the glass coffin.',
    denialPattern: 'Convinced Hoffman is a simple target he can take down alone.',
    relationships: 'Lindsey Perez (partner), Detective Hoffman (target)',
    canonStatus: 'canon',
    notes: 'Tested in the water cube, crushed in the compaction room.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-william-easton',
    name: 'William Easton',
    role: 'Insurance Executive',
    archetype: 'The Cold Actuary',
    timelinePeriod: 'saw-vi',
    moralFlaw: 'Using an actuarial formula to reject healthcare claims for profits.',
    symbolicFear: 'Being audited by his own criteria and failing.',
    redemptionGoal: 'Empathize with those he previously discarded.',
    denialPattern: 'Maintains that "it\'s just the corporate formula, not personal."',
    relationships: 'John Kramer (former applicant), Brent & Pamela (victims)',
    canonStatus: 'canon',
    notes: 'Main test subject of Saw VI.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-bobby-dagen',
    name: 'Bobby Dagen',
    role: 'Self-Help Author',
    archetype: 'The False Survivor',
    timelinePeriod: 'saw-vii',
    moralFlaw: 'Fabricating a fake Jigsaw escape story for wealth and fame.',
    symbolicFear: 'Exposure of his lies and losing his wife\'s respect.',
    redemptionGoal: 'Prove his claims by surviving real traps.',
    denialPattern: 'Claims his lie "helped people heal from trauma."',
    relationships: 'Joyce Dagen (wife), Cale & Nina (accomplices)',
    canonStatus: 'canon',
    notes: 'Main subject tested in Saw VII.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'canon-zeke-banks',
    name: 'Ezekiel Banks',
    role: 'Metro Police Detective',
    archetype: 'The Clean Cop in a Dirty System',
    timelinePeriod: 'legacy-era',
    moralFlaw: 'Alienating his colleagues by reporting a corrupt officer, acting as a lone wolf.',
    symbolicFear: 'Failing to live up to his father\'s legacy.',
    redemptionGoal: 'Solve the copycat case and decide his father\'s fate.',
    denialPattern: 'Convinced he can fix the entire department by himself.',
    relationships: 'Marcus Banks (father), William Schenk (partner)',
    canonStatus: 'canon',
    notes: 'Tested in Spiral (2021).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  ...DERNIER_RELAIS_CHARACTERS,
  ...UNE_DE_MINUIT_CHARACTERS,
  ...ROSTER_CHARACTERS
];

export const PRELOADED_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-saw-i',
    title: 'Saw I Trials',
    timelinePeriod: 'saw-i',
    tone: 'Claustrophobic, dirty, initial',
    moralTheme: 'Value of Breath & Time',
    fictionalLocation: 'Subterranean Bathroom & Gideon Warehouses',
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
    fictionalLocation: 'Nerve Gas House (237 S. Leonard Street)',
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
    fictionalLocation: 'Gideon Meat Packing Plant (Industrial Facility)',
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
    testIds: ['test-s5-pendulum', 'test-s5-collar-keys', 'test-s5-ceiling-jars', 'test-s5-electric-bathtub', 'test-s5-blood-saws', 'test-s5-water-cube', 'test-s5-glass-coffin'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-vi',
    title: 'Saw VI Trials',
    timelinePeriod: 'posthumous',
    tone: 'Corporate, healthcare, steam',
    moralTheme: 'Actuarial Decisions vs. Empathy',
    fictionalLocation: 'Rowan Zoological Institute (Abandoned Zoo)',
    objective: 'Bypass the Oxygen Crusher, Actuary Gallows, Steam Maze, Carousel, and Acid Injection.',
    status: 'ready',
    characterIds: ['canon-john-kramer'],
    testIds: ['test-s6-oxygen', 'test-s6-gallows', 'test-s6-carousel', 'test-s6-steam-maze', 'test-s6-acid-latch', 'test-s6-pound-flesh', 'test-s6-bear-trap-2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-saw-vii',
    title: 'Saw VII Trials',
    timelinePeriod: 'posthumous',
    tone: 'Public, violent, loud',
    moralTheme: 'Deceit vs. Integrity',
    fictionalLocation: 'Public Square (Downtown Window Cage) & Oakhaven Psychiatric Hospital',
    objective: 'Bypass the Horsepower trap, Silence lock, Lawnmower trap, Spike Cage, and Public Circular Saws.',
    status: 'ready',
    characterIds: ['canon-lawrence-gordon', 'canon-mark-hoffman'],
    testIds: ['test-s7-horsepower', 'test-s7-silence', 'test-s7-lawnmower', 'test-s7-spike-cage', 'test-s7-public-exec', 'test-s7-brazen-bull', 'test-s7-impalement-wheel', 'test-s7-wisdom-teeth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'camp-jigsaw',
    title: 'Jigsaw (2017) Trials',
    timelinePeriod: 'legacy-era',
    tone: 'Sunny barn, modern, high-tech',
    moralTheme: 'Responsibility for the Dead',
    fictionalLocation: 'Tuck Family Barn (Agricultural Facility)',
    objective: 'Solve the Bucket Heads scanner, Leg Wire cut, Grain Silo, Cycle trap, and the final Laser Collars.',
    status: 'ready',
    characterIds: ['canon-logan-nelson'],
    testIds: ['test-jg-bucket-heads', 'test-jg-chain-hangers', 'test-jg-poison-syringes', 'test-jg-leg-wire', 'test-jg-silo', 'test-jg-cycle', 'test-jg-shotgun-keys', 'test-jg-laser-collars'],
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
    testIds: ['test-sp-tongue', 'test-sp-finger', 'test-sp-skinning', 'test-sp-wax', 'test-sp-shredder', 'test-sp-puppet-strings'],
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
    testIds: ['test-sx-vacuum', 'test-sx-gigli', 'test-sx-pipebomb', 'test-sx-radiation', 'test-sx-bone-crusher', 'test-sx-blood-pit', 'test-sx-gas-room'],
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
  },
  DERNIER_RELAIS_CAMPAIGN,
  UNE_DE_MINUIT_CAMPAIGN,
  ROSTER_CAMPAIGN
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

  // Saw II Trials

  // Saw III Trials

  // Saw IV Trials

  // Saw V Trials

  // Saw VI Trials

  // Saw VII Trials

  // Jigsaw (2017), Spiral (2021) and Saw X are delivered by sawLegacyData.ts.
  ...DERNIER_RELAIS_TESTS,
  ...UNE_DE_MINUIT_TESTS,
  ...ROSTER_TESTS,
  ...SAW_ONE_TWO_TESTS,
  ...SAW_THREE_FOUR_TESTS,
  ...SAW_FIVE_SEVEN_TESTS,
  ...SAW_LEGACY_TESTS
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

