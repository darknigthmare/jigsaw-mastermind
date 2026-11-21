import type { Campaign, CharacterProfile, DecisionLog, SymbolicTest } from '../types';
import type { EndingDetails } from './moralEngine';

const recordedAt = '2026-11-21T21:00:00.000Z';
const dates = { createdAt: recordedAt, updatedAt: recordedAt };
export const UNE_DE_MINUIT_CONTENT_ID = 'une-de-minuit-v1';

export const UNE_DE_MINUIT_CHARACTERS: CharacterProfile[] = [
  {
    id: 'char-une-minuit-camille', name: 'Camille Roux', role: 'Secrétaire de rédaction mise à l’épreuve',
    archetype: 'La testeuse qui doit rendre la provenance', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A retiré le nom d’une source sans consigner la coupe.',
    symbolicFear: 'Que la correction publique expose celle qu’elle voulait protéger.',
    redemptionGoal: 'Rendre la provenance du témoignage vérifiable sans livrer la source.',
    denialPattern: 'Se répète qu’une coupe n’est pas un mensonge tant que la pièce existe.',
    relationships: 'Walid garde les bons de tirage ; Hélène tient l’archive municipale voisine.',
    notes: 'Personnage original de « La Une de minuit ». La voix du test la rappelle à la coupe qu’elle n’a pas consignée.', ...dates,
  },
  {
    id: 'char-une-minuit-walid', name: 'Walid Bensaïd', role: 'Conducteur de rotative',
    archetype: 'Le gardien des traces de fabrication', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A imprimé une édition incomplète sans inscrire de réserve.',
    symbolicFear: 'Voir l’atelier fermer sur une faute qui n’est pas la sienne.',
    redemptionGoal: 'Que les bons de tirage et le registre d’envoi restent lisibles après la fermeture.',
    denialPattern: 'Estime que relire la copie n’est pas le rôle de la machine.',
    relationships: 'Reçoit les bons de Camille et prévient Hélène dès qu’un tirage change.',
    notes: 'Personnage original de « La Une de minuit ». Sa rotative porte le chronomètre du test ; il connaît la salle des presses et refuse de la quitter avant le dernier carton.', ...dates,
  },
  {
    id: 'char-une-minuit-helene', name: 'Hélène Vasseur', role: 'Archiviste municipale',
    archetype: 'La mémoire des dossiers voisins', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A classé la pièce du témoignage sous un autre nom pour éviter un conflit.',
    symbolicFear: 'Perdre la confiance des lecteurs qui viennent consulter les dossiers.',
    redemptionGoal: 'Rendre la pièce consultable avec ses réserves plutôt que la retirer.',
    denialPattern: 'Soutient que classer n’est pas choisir.',
    relationships: 'Attend le registre d’envoi pour rapprocher la pièce de l’édition publiée.',
    notes: 'Personnage original de « La Une de minuit ». Son archivage décide de ce que le dossier peut encore prouver ; l’archive communique avec l’imprimerie par le bureau de la une.', ...dates,
  },
];

export const UNE_DE_MINUIT_CAMPAIGN: Campaign = {
  id: 'camp-une-de-minuit', title: 'La Une de minuit', timelinePeriod: 'fan-campaigns',
  tone: 'Test de nuit dans une imprimerie condamnée — plomb, plastique et néons', moralTheme: 'Ce qu’une coupe retire au lecteur',
  fictionalLocation: 'Imprimerie des Passages condamnée — atelier de composition, salle de la rotative et bureau de la une',
  objective: 'Rétablir la provenance d’un témoignage avant le départ du véhicule, dans l’imprimerie verrouillée jusqu’à zéro heure quarante.',
  status: 'ready', characterIds: UNE_DE_MINUIT_CHARACTERS.map(character => character.id),
  testIds: ['test-une-minuit-tirage', 'test-une-minuit-envoi', 'test-une-minuit-une'], ...dates,
};

export const UNE_DE_MINUIT_TESTS: SymbolicTest[] = [
  {
    id: 'test-une-minuit-tirage', campaignId: UNE_DE_MINUIT_CAMPAIGN.id,
    characterId: 'char-une-minuit-camille', title: '01 — Le bon de tirage',
    moralTheme: 'Vérifier la provenance avant de publier',
    openingTape: 'Camille. La porte s’est verrouillée à vingt-trois heures et le véhicule part à zéro heure quarante. Tu as retiré un nom d’un témoignage sans inscrire pourquoi. Ce soir, tu ne corriges pas une page : tu rétablis une provenance. Sur le marbre, le bon de tirage de l’édition qui a publié ce témoignage. Le comité de lecture s’est réuni le lundi 5 mars 2029 ; l’édition qui en rend compte paraît le jeudi suivant. Trouve cette date, puis descends à la rotative. Une enveloppe ne prouvera rien : seule la pièce compte.',
    rules: 'Déduisez la date de l’édition à partir de la réunion du comité et du jour de parution. Le compte à rebours continue pendant la lecture.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Le comité de lecture s’est réuni le lundi 5 mars 2029. L’édition hebdomadaire paraît le jeudi. Quelle est la date de l’édition qui rend compte de cette réunion ?',
      correctAnswer: '2029-03-08',
    },
    clues: ['Le 5 mars 2029 est un lundi.', 'Le jeudi qui suit le lundi 5 mars tombe le 8 mars.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-une-minuit-joindre', text: 'Joindre le bon de tirage au dossier', scoresEffect: { truth: 10, responsibility: 10, cooperation: 10 }, narrativeImpact: 'Le bon rejoint la chemise de l’édition. Sous la lampe, Walid inscrit l’heure de passage sur le marbre ; la marionnette de bois n’a pas bougé.' },
      { id: 'choice-une-minuit-noter', text: 'Recopier seulement la date sur une enveloppe', scoresEffect: { denial: 15, responsibility: -5 }, narrativeImpact: 'La date est notée, mais le bon reste sous la lampe. La provenance reposera sur une recopie, et le dossier gardera cette différence.' },
    ],
    safetyNote: 'Fiction originale. Épreuve de calendrier dans une imprimerie condamnée ; aucune intervention réelle.', ...dates,
  },
  {
    id: 'test-une-minuit-envoi', campaignId: UNE_DE_MINUIT_CAMPAIGN.id,
    characterId: 'char-une-minuit-walid', title: '02 — Le registre d’envoi',
    moralTheme: 'Rapprocher un chiffre publié de sa trace',
    openingTape: 'La rotative tourne au ralenti. Douze cartons de quarante exemplaires sont sortis pour l’édition du 8 mars ; trois cartons de vingt-cinq sont revenus du dépôt. La une annonce quatre cents exemplaires en circulation. Le registre et la une ne disent pas la même chose. Choisis la phrase qui rend le compte exact et inscris-la au dossier. Hélène ne classera rien tant que la réserve n’est pas écrite. Le temps que tu passes ici, Camille, est celui que tu n’as pas pris avant de publier.',
    rules: 'Comparez le tirage, les retours et le chiffre publié, puis choisissez la seule mention conforme au registre. Le compte à rebours ne pardonne pas les approximations.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Douze cartons de quarante exemplaires sont sortis ; trois cartons de vingt-cinq exemplaires sont revenus. L’édition annonce 400 exemplaires en circulation. Quelle mention du registre faut-il inscrire au dossier ?',
      confessionOptions: [
        { id: 'A-1', text: 'Le registre confirme les 400 exemplaires annoncés par l’édition.', truthScore: 10 },
        { id: 'B-2', text: '480 exemplaires sortis, 75 revenus, 405 en circulation ; l’édition annonce 400.', truthScore: 90 },
        { id: 'C-3', text: '480 exemplaires sont en circulation et 75 ont été retirés du dépôt.', truthScore: 20 },
      ],
    },
    clues: ['Le tirage complet est de 12 × 40 exemplaires.', 'Les retours se retirent du tirage ; ils ne s’y ajoutent pas.'],
    timerSeconds: 210,
    choices: [
      { id: 'choice-une-minuit-mention', text: 'Inscrire la mention exacte et la réserve de l’atelier', scoresEffect: { truth: 10, cooperation: 10, empathy: 10 }, narrativeImpact: 'Le registre porte le compte exact et la réserve de Walid. Hélène peut rapprocher le chiffre publié de la trace de fabrication sans effacer l’écart. Dans le bureau de la une, le magnétophone attend la suite.' },
      { id: 'choice-une-minuit-chiffre', text: 'Reprendre le chiffre publié pour alléger la correction', scoresEffect: { denial: 15, truth: -5 }, narrativeImpact: 'Le dossier reprend les 400 exemplaires de l’édition. L’écart du registre reste dans l’atelier, sans mention qui permette de le retrouver.' },
    ],
    safetyNote: 'Fiction originale. Rapprochement d’un tirage et d’un registre fictifs dans un lieu condamné ; aucune vérification réelle.', ...dates,
  },
  {
    id: 'test-une-minuit-une', campaignId: UNE_DE_MINUIT_CAMPAIGN.id,
    characterId: 'char-une-minuit-helene', title: '03 — La dernière une',
    moralTheme: 'Choisir ce que la dernière édition transmet',
    openingTape: 'Le bon de tirage et le registre sont sur le comptoir. Le véhicule part à zéro heure quarante. La correction demande vingt-cinq minutes de composition, quinze minutes de tirage et vingt minutes de séchage. Trouve le temps qu’il te reste, puis décide ce que la une emporte : les deux noms et la provenance, une correction qui protège la source, ou le silence. Quelle que soit ta sortie, le dossier gardera ce que tu as choisi de rendre lisible.',
    rules: 'Calculez le temps nécessaire à la correction, puis choisissez ce que la dernière une transmet. La presse s’arrêtera à l’heure dite.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Le véhicule part à 00 h 40. La correction demande 25 minutes de composition, 15 minutes de tirage et 20 minutes de séchage. Combien de minutes avant le départ faut-il lancer la correction au plus tard ?',
      correctAnswer: '60',
    },
    clues: ['Additionnez les trois durées avant de retirer le total de l’heure de départ.', 'La question ne demande que le total des minutes, pas l’heure exacte.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-une-minuit-publier', text: 'Publier la correction avec les deux noms et la provenance', scoresEffect: { truth: 15, responsibility: 10, courage: 10, cooperation: 10 }, narrativeImpact: 'La une porte la correction, les deux noms et la provenance. Le véhicule part avec le bon et le registre ; à l’aube, les lecteurs pourront vérifier chaque changement.' },
      { id: 'choice-une-minuit-proteger', text: 'Publier la correction en protégeant la source, réserve comprise', scoresEffect: { truth: 10, empathy: 15, courage: 5 }, narrativeImpact: 'La correction paraît sans le nom de la source, avec la réserve de l’atelier. La provenance reste consultable au dossier ; la une dit moins, mais elle ne livre personne.' },
      { id: 'choice-une-minuit-boucler', text: 'Boucler la une et verser la réserve au dossier', scoresEffect: { denial: 25, truth: -15, courage: -10 }, narrativeImpact: 'La une part telle qu’elle a été composée. La réserve rejoint le dossier sans mention publique ; la marionnette de bois est restée assise près du marbre, et les lecteurs du matin ne sauront pas ce que l’atelier avait relevé.' },
    ],
    safetyNote: 'Fiction originale. Calcul de délai et choix éditorial dans une imprimerie condamnée ; aucune opération réelle.', ...dates,
  },
];

export function getUneDeMinuitEnding(campaignId: string, decisions: DecisionLog[]): EndingDetails | undefined {
  if (campaignId !== UNE_DE_MINUIT_CAMPAIGN.id) return undefined;
  const finalChoice = decisions.at(-1)?.choiceId;
  if (!finalChoice) return undefined;
  if (finalChoice === 'choice-une-minuit-boucler') return {
    type: 'La Une de minuit — Bouclage', title: 'La une sans témoin',
    description: 'Les presses s’arrêtent sur l’édition composée avant la correction. La réserve est versée au dossier, sans mention publique. Le véhicule part avec un récit complet en apparence ; les lecteurs du matin ne sauront pas ce que l’atelier avait relevé. Dans l’atelier, la marionnette de bois est toujours assise près du marbre.',
  };
  if (finalChoice !== 'choice-une-minuit-publier' && finalChoice !== 'choice-une-minuit-proteger') return undefined;
  const completeRecord = decisions.some(decision => decision.choiceId === 'choice-une-minuit-joindre')
    && decisions.some(decision => decision.choiceId === 'choice-une-minuit-mention');
  if (completeRecord) return {
    type: 'La Une de minuit — Provenance', title: 'La une porte les deux noms',
    description: 'Le bon de tirage, le registre d’envoi et la correction partent ensemble. La une du matin porte la provenance du témoignage ; les lecteurs peuvent vérifier ce qui a changé et ce qui a été conservé. À zéro heure quarante, la presse s’arrête. L’imprimerie ferme, mais ce qui a été publié reste lisible.',
  };
  return {
    type: 'La Une de minuit — Réserve', title: 'La correction reste sous réserve',
    description: 'La correction paraît, mais une partie des vérifications reste au dossier. Hélène inscrit la réserve en marge de la pièce ; la une dit moins que ce que l’atelier savait. La presse s’arrête à l’heure dite, sans effacer le doute laissé au lecteur.',
  };
}
