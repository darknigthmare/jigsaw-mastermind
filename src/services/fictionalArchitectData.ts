import type { SymbolicTest } from '../types';

const recordedAt = '2026-11-22T10:05:00.000Z';
const dates = { createdAt: recordedAt, updatedAt: recordedAt };

/**
 * Fifth pass: the three fictional entries of the Gideon campaign.
 *
 * "The Ledger Calibration", "The Reflection of Deceit" and "The Balance of
 * Ledger" become reading rooms like the film campaigns. They keep their ids,
 * their subjects and their faults, and turn the original situation into a
 * reading, a calculation or an arbitration. No gesture, equipment or procedure
 * is described; the fidelity note under each room states it.
 */

const fidelity = (situation: string, played: string) =>
  `Fiction originale : ${situation}. Lecture jouée : ${played}. Non reproduits : le geste, la blessure, le matériel et la procédure — la salle se lit, elle ne s’exécute pas.`;

export const FICTIONAL_ARCHITECT_TEST_IDS = [
  'test-ledger-room-1', 'test-glass-confession-1', 'test-quiet-scale-1',
] as const;

export const FICTIONAL_ARCHITECT_TESTS: SymbolicTest[] = [
  {
    id: 'test-ledger-room-1', campaignId: 'camp-fictional-architect', characterId: 'char-victor-hale',
    title: '01 — Le bureau des registres', moralTheme: 'La signature antidatée',
    openingTape: 'Victor. Tu as antidaté le registre de zonage pour couvrir une inspection manquée. Le bureau des registres conserve les dossiers du bâtiment Gideon ; la signature ouvre sur le 12 avril 2024, et l’inspection qu’elle devait suivre a eu lieu vingt et un jours plus tôt. Retrouve cette date, puis décide ce que tu laisses au registre. Une date déplacée ne change pas ce qui a été constaté.',
    rules: 'Déduisez la date de l’inspection, puis choisissez la pièce conservée au registre.',
    puzzleType: 'logic',
    puzzleData: { question: 'La signature est datée du 12 avril 2024 ; l’inspection a eu lieu 21 jours plus tôt. Quelle est cette date (AAAA-MM-JJ) ?', correctAnswer: '2024-03-22' },
    clues: ['Avril compte trente jours : du 12 avril au 31 mars, il y a douze jours.', 'Il reste neuf jours à retirer depuis le 31 mars.'],
    timerSeconds: 105,
    choices: [
      { id: 'choice-vic-confess', text: 'Inscrire la date et laisser les deux pièces ensemble', scoresEffect: { truth: 20, responsibility: 15, courage: 10 }, narrativeImpact: 'L’inspection et la signature restent liées par leur date. Le registre peut être relu sans reconstituer l’écart de mémoire.' },
      { id: 'choice-vic-lie', text: 'Corriger la date et retirer l’avis d’inspection', scoresEffect: { denial: 25, responsibility: -15 }, narrativeImpact: 'Le registre ne porte plus qu’une signature. L’écart existe encore, mais il n’a plus de trace.' },
    ],
    safetyNote: 'Fiction originale. Calcul de date sur un registre fictif ; aucun document ni geste réel.',
    sourceNote: fidelity('le bureau des registres du bâtiment Gideon et la signature antidatée de Victor Hale', 'les dossiers de zonage, les 21 jours et la date d’inspection'), ...dates,
  },
  {
    id: 'test-glass-confession-1', campaignId: 'camp-fictional-architect', characterId: 'char-mara-voss',
    title: '02 — La salle des miroirs', moralTheme: 'L’image publique opposée au rapport',
    openingTape: 'Mara. Tu as publié un démenti alors que le rapport d’inspection était sur ton bureau. La salle des miroirs affiche trois versions de ce rapport. Une seule nomme la personne qui l’a reçu, la date de réception et le témoin présent. Choisis-la, puis décide ce qui reste affiché. Un démenti ne supprime pas ce qui a été reçu.',
    rules: 'Comparez les trois versions et choisissez celle qui donne le destinataire, la date et le témoin, puis décidez de son affichage.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Trois versions sont proposées. Laquelle donne le destinataire du rapport, la date de réception et le témoin présent ?',
      correctAnswer: 'B-2',
      confessionOptions: [
        { id: 'A-1', text: 'Le rapport a été transmis sans nom ; personne ne l’a reçu en main propre.', truthScore: 10 },
        { id: 'B-2', text: 'Mara Voss a reçu le rapport le 14 août 2025, devant la responsable des inspections, et a publié un démenti le lendemain.', truthScore: 90 },
        { id: 'C-3', text: 'Le rapport a été classé par un service non identifié, sans date de réception.', truthScore: 20 },
      ],
    },
    clues: ['Une version sans destinataire ne peut pas être confrontée au démenti.', 'Le destinataire, la date et le témoin doivent tous figurer.'],
    timerSeconds: 140,
    choices: [
      { id: 'choice-m-c', text: 'Afficher la version complète avec sa date et son témoin', scoresEffect: { truth: 25, responsibility: 20, courage: 10 }, narrativeImpact: 'La salle porte le destinataire, la date et le témoin. Le démenti peut être confronté à la pièce qu’il contestait.' },
      { id: 'choice-m-d', text: 'Afficher la version sans destinataire', scoresEffect: { denial: 25, truth: -20 }, narrativeImpact: 'Une seule version reste affichée. Le rapport devient une rumeur, et le démenti une version comme une autre.' },
    ],
    safetyNote: 'Fiction originale. Comparaison de rapports fictifs ; aucun fait ni personne réelle.',
    sourceNote: fidelity('la salle des miroirs et le rapport de sécurité reçu par Mara Voss le 14 août 2025', 'les trois versions, le destinataire, la date et le témoin'), ...dates,
  },
  {
    id: 'test-quiet-scale-1', campaignId: 'camp-fictional-architect', characterId: 'char-elias-crowe',
    title: '03 — La salle de la balance', moralTheme: 'Le béton dilué et la prime',
    openingTape: 'Elias. Tu as dilué les renforts du bâtiment Gideon et gardé la prime du marché. La balance du vestiaire d’entreprise attend une répartition : la prime s’élève à deux cent cinquante mille dollars, et le fonds médical des ouvriers en attend au moins cent cinquante mille. Règle la part versée au fonds, puis décide ce qui reste affiché. Une balance ne rend pas le béton qui manque.',
    rules: 'Réglez le curseur de la balance à 150 000 $ ou plus.',
    puzzleType: 'sacrifice',
    puzzleData: { question: 'Part de la prime versée au fonds médical des ouvriers (250 000 $ au maximum) :' },
    clues: ['Le fonds demande au moins 150 000 dollars.', 'La prime entière ne couvre pas les réparations, mais la part versée reste une décision.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-el-g', text: 'Verser 180 000 dollars au fonds et laisser le reçu affiché', scoresEffect: { empathy: 25, responsibility: 15 }, narrativeImpact: 'Le reçu porte la somme, le fonds et la date. Les ouvriers peuvent connaître la part qui leur revient sans passer par la parole d’Elias.' },
      { id: 'choice-el-k', text: 'Garder la prime et retirer le reçu', scoresEffect: { denial: 25, responsibility: -20 }, narrativeImpact: 'Le reçu disparaît. La prime reste intacte, et le manque de béton avec elle.' },
    ],
    safetyNote: 'Fiction originale. Arbitrage d’une somme fictive ; aucun versement ni personne réelle.',
    sourceNote: fidelity('la salle de la balance et la prime du marché d’Elias Crowe', 'la prime de 250 000 $, la part versée au fonds et le reçu'), ...dates,
  },
];
