import type { Campaign, CharacterProfile, DecisionLog, SymbolicTest } from '../types';
import type { EndingDetails } from './moralEngine';

const recordedAt = '2026-11-20T12:00:00.000Z';
const dates = { createdAt: recordedAt, updatedAt: recordedAt };
export const DERNIER_RELAIS_CONTENT_ID = 'dernier-relais-v1';

export const DERNIER_RELAIS_CHARACTERS: CharacterProfile[] = [
  {
    id: 'char-dernier-relais-noe', name: 'Noé Delcourt', role: 'Responsable de passation',
    archetype: 'Le gardien des dossiers', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A repoussé le classement des décisions jusqu’au dernier service.',
    symbolicFear: 'Partir en laissant un récit incomplet du travail de l’équipe.',
    redemptionGoal: 'Transmettre un registre vérifiable plutôt qu’un souvenir commode.',
    denialPattern: 'Se promet que le prochain service trouvera bien les pièces manquantes.',
    relationships: 'Inès tient l’inventaire ; Samir représente les équipes qui reprennent le matériel.',
    notes: 'Personnage original de « Le Dernier Relais ». Il rejoint les archives depuis le centre de contrôle.', ...dates,
  },
  {
    id: 'char-dernier-relais-ines', name: 'Inès Morel', role: 'Gestionnaire de l’atelier',
    archetype: 'La mémoire du matériel', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A longtemps compensé seule les écarts entre les listes et les objets.',
    symbolicFear: 'Voir son travail disparaître derrière une dernière signature pressée.',
    redemptionGoal: 'Faire reconnaître les vérifications et les réserves de l’atelier.',
    denialPattern: 'Préfère refaire une vérification plutôt que signaler un désaccord.',
    relationships: 'Reçoit le bordereau de Noé puis prépare la caisse attendue par Samir.',
    notes: 'Personnage original de « Le Dernier Relais ». L’atelier est à droite du couloir vitré, après les archives.', ...dates,
  },
  {
    id: 'char-dernier-relais-samir', name: 'Samir Aubert', role: 'Coordinateur des équipes',
    archetype: 'Le dernier interlocuteur', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A laissé l’urgence décider à sa place de plusieurs répartitions.',
    symbolicFear: 'Fermer un lieu sans avoir réglé ce qui reste dû aux autres.',
    redemptionGoal: 'Rendre les dossiers, le matériel et le solde aux équipes concernées.',
    denialPattern: 'Présente une préférence personnelle comme une simple économie de temps.',
    relationships: 'Attend le dossier de Noé et la caisse préparée par Inès au comptoir de restitution.',
    notes: 'Personnage original de « Le Dernier Relais ». Il revient dans la salle de contrôle par le couloir commun.', ...dates,
  },
];

export const DERNIER_RELAIS_CAMPAIGN: Campaign = {
  id: 'camp-dernier-relais', title: 'Le Dernier Relais', timelinePeriod: 'fan-campaigns',
  tone: 'Crépusculaire, tendu, solidaire', moralTheme: 'Transmettre sans effacer le travail des autres',
  fictionalLocation: 'Centre de contrôle des Aulnes — archives, atelier et comptoir de restitution',
  objective: 'Avant le départ du dernier véhicule d’archives, retrouver le bordereau, associer la bonne caisse puis répartir le solde de clôture entre les équipes.',
  status: 'ready', characterIds: DERNIER_RELAIS_CHARACTERS.map(character => character.id),
  testIds: ['test-dernier-relais-archive', 'test-dernier-relais-atelier', 'test-dernier-relais-restitution'], ...dates,
};

export const DERNIER_RELAIS_TESTS: SymbolicTest[] = [
  {
    id: 'test-dernier-relais-archive', campaignId: DERNIER_RELAIS_CAMPAIGN.id,
    characterId: 'char-dernier-relais-noe', title: '01 — Le calendrier des archives',
    moralTheme: 'Vérifier avant de transmettre',
    openingTape: 'Noé, ici Inès. Le centre des Aulnes ferme ce soir ; le dernier véhicule d’archives part à dix-neuf heures. Les installations de service sont déjà arrêtées : il reste nos dossiers et nos affaires. Depuis la salle de contrôle, prends le couloir vitré jusqu’au bureau d’archives, au fond. Le bordereau de la caisse d’équipe porte la date du deuxième mardi du mois qui suit septembre 2028. Le calendrier joint donne les mardis du mois : 3, 10, 17, 24 et 31. Retrouve sa date avant de me rejoindre à l’atelier.',
    rules: 'Déduisez la date du bordereau puis saisissez-la dans le calendrier. La validation ouvre les décisions de passation.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Le mois suit septembre 2028. Ses mardis sont les 3, 10, 17, 24 et 31. Le bordereau porte la date du deuxième mardi. Quelle est cette date ?',
      correctAnswer: '2028-10-10',
    },
    clues: ['Le mois suivant septembre est octobre.', 'Le deuxième mardi est le deuxième nombre de la liste, pas la deuxième semaine complète.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-dernier-relais-joindre', text: 'Joindre le bordereau au dossier d’équipe', scoresEffect: { truth: 10, responsibility: 10, cooperation: 10 }, narrativeImpact: 'Noé conserve la référence et les réserves du registre. Il ressort dans le couloir vitré : l’atelier d’Inès est la première porte à droite.' },
      { id: 'choice-dernier-relais-resumer', text: 'Ne transmettre qu’un résumé signé', scoresEffect: { denial: 15, responsibility: -5 }, narrativeImpact: 'Le dossier partira avec moins de détails. Noé note la réserve sur l’enveloppe puis rejoint Inès à la première porte à droite du couloir.' },
    ],
    safetyNote: 'Fiction originale. Énigme de calendrier et de classement ; aucune intervention sur une installation réelle.', ...dates,
  },
  {
    id: 'test-dernier-relais-atelier', campaignId: DERNIER_RELAIS_CAMPAIGN.id,
    characterId: 'char-dernier-relais-ines', title: '02 — La caisse de l’atelier',
    moralTheme: 'Reconnaître un travail précis',
    openingTape: 'Inès à Noé : tu as trouvé l’atelier. Le couloir continue derrière toi vers la salle de contrôle ; Samir nous y attendra pour la restitution. Le bordereau des archives demande une seule caisse réunissant une radio portative et quatre carnets. Les étiquettes de l’inventaire sont lisibles dans la console. Associe les deux objets au bon casier : choisir une caisse qui ne contient que l’un des deux ferait repartir l’équipe avec un dossier incomplet.',
    rules: 'Comparez les deux objets demandés avec l’inventaire, puis validez la coordonnée de l’unique casier qui les réunit.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Caisse demandée : une radio portative ET quatre carnets. Ligne A : A-1 = radio seule ; A-2 = lampe et deux carnets ; A-3 = dossiers vides. Ligne B : B-1 = radio et deux carnets ; B-2 = lampe et quatre carnets ; B-3 = étiquettes. Ligne C : C-1 = quatre carnets seuls ; C-2 = radio et quatre carnets ; C-3 = pochettes. Quel casier correspond aux deux objets ?',
      correctAnswer: 'C-2',
    },
    clues: ['Écartez les casiers qui n’ont pas de radio, même s’ils contiennent quatre carnets.', 'Parmi les casiers avec une radio, comparez le nombre de carnets.'],
    timerSeconds: 210,
    choices: [
      { id: 'choice-dernier-relais-verifier', text: 'Signer la caisse avec la vérification d’Inès', scoresEffect: { cooperation: 15, empathy: 10, truth: 10 }, narrativeImpact: 'La caisse complète porte les deux noms. Inès et Noé reprennent le couloir vers la salle de contrôle, puis déposent la caisse sur le comptoir de Samir.' },
      { id: 'choice-dernier-relais-anonyme', text: 'Expédier la caisse sans conserver la vérification', scoresEffect: { denial: 15, cooperation: -5 }, narrativeImpact: 'Les objets sont transmis, mais le soin apporté à l’inventaire n’apparaîtra pas au registre. La caisse rejoint tout de même le comptoir de restitution dans la salle de contrôle.' },
    ],
    safetyNote: 'Fiction originale. Association d’objets usuels à des coordonnées ; aucune manipulation technique.', ...dates,
  },
  {
    id: 'test-dernier-relais-restitution', campaignId: DERNIER_RELAIS_CAMPAIGN.id,
    characterId: 'char-dernier-relais-samir', title: '03 — Le solde à restituer',
    moralTheme: 'Arbitrer ce qui reste à partager',
    openingTape: 'Samir, dernier point de passage. Depuis l’atelier, le couloir t’a ramené à la salle de contrôle. Le bordereau et la caisse sont sur le comptoir ; il reste le solde de clôture. L’enveloppe contient 540 euros. Le transport des dossiers coûte 90 euros et leur numérisation 180 euros. Calcule ce qui reste avant de choisir son attribution. Les trois équipes ont travaillé le même nombre de services. Le véhicule approche : une somme juste ne dit pas encore à qui tu la rendras.',
    rules: 'Soustrayez les deux frais du fonds de clôture. Saisissez le solde restant, en euros et sans symbole, puis choisissez son attribution.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Fonds de clôture : 540 €. Frais déjà engagés : 90 € de transport et 180 € de numérisation. Quel montant reste à attribuer aux trois équipes ? Saisissez uniquement le nombre d’euros.',
      correctAnswer: '270',
    },
    clues: ['Additionnez les deux frais avant de les retirer de l’enveloppe.', 'Le montant demandé est le solde total, pas encore la part de chaque équipe.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-dernier-relais-partager', text: 'Répartir le solde également entre les trois équipes', scoresEffect: { empathy: 15, cooperation: 15, responsibility: 10 }, narrativeImpact: 'Chaque équipe reçoit 90 euros. Le bordereau, la caisse et la répartition sont remis ensemble ; le dernier véhicule part avec une passation que les autres pourront vérifier.' },
      { id: 'choice-dernier-relais-reserver', text: 'Réserver tout le solde au bureau de coordination', scoresEffect: { denial: 25, empathy: -20, cooperation: -15 }, narrativeImpact: 'Le compte est exact, mais les équipes ne reçoivent aucune part. La fermeture peut être signée ; Samir inscrit le désaccord au registre pour qu’il ne disparaisse pas avec le site.' },
    ],
    safetyNote: 'Fiction originale. Calcul et arbitrage d’un fonds fictif ; aucune transaction réelle.', ...dates,
  },
];

export interface OrionDossierPiece {
  title: string;
  body: string;
  /** Free clue handed to the workshop chapter once the detour is confirmed. */
  clue: { testId: string; text: string } | null;
}

const ORION_TEST_ID = 'test-dernier-relais-atelier';

/** What the Relais case file says about the Station workshop detour. It never
 * replaces the inventory puzzle: a confirmed detour only adds a free clue. */
export function getOrionDossierPiece(confirmed: boolean): OrionDossierPiece {
  if (!confirmed) return {
    title: 'Repère ORION — absent du dossier',
    body: 'Aucun relevé ORION n’accompagne le dossier des Aulnes. L’atelier de la station de contrôle en conserve un exemplaire : le détour facultatif, registre puis témoin, verse cette pièce au dossier avant l’enquête.',
    clue: null,
  };
  return {
    title: 'Repère ORION — confirmé à la station',
    body: 'Le relevé de la station a comparé le registre de l’atelier au témoin : le même repère ORION y figurait deux fois. Inès retrouve cette double mention sur l’étiquette de l’atelier des Aulnes et la tient pour une vérification, pas pour une erreur de saisie. Un indice est versé à l’étape 02, « La caisse de l’atelier ».',
    clue: {
      testId: ORION_TEST_ID,
      text: 'Repère ORION confirmé à la station : l’étiquette du casier porte bien deux mentions, une radio portative et quatre carnets. La double mention vient d’un contrôle, pas d’une faute de saisie.',
    },
  };
}

export function getDernierRelaisEnding(campaignId: string, decisions: DecisionLog[]): EndingDetails | undefined {
  if (campaignId !== DERNIER_RELAIS_CAMPAIGN.id) return undefined;
  const finalChoice = decisions.at(-1)?.choiceId;
  if (finalChoice !== 'choice-dernier-relais-partager' && finalChoice !== 'choice-dernier-relais-reserver') return undefined;
  const shared = finalChoice === 'choice-dernier-relais-partager';
  const completeRecord = decisions.some(decision => decision.choiceId === 'choice-dernier-relais-joindre')
    && decisions.some(decision => decision.choiceId === 'choice-dernier-relais-verifier');
  if (shared && completeRecord) return {
    type: 'Dernier Relais — Transmission', title: 'Le relais est transmis',
    description: 'Le véhicule quitte les Aulnes avec le bordereau, la caisse vérifiée et une part égale pour chaque équipe. Noé, Inès et Samir éteignent la lampe du comptoir. Le centre ferme ; ce qui y a été fait reste lisible pour celles et ceux qui prennent la suite.',
  };
  if (shared) return {
    type: 'Dernier Relais — Réserve', title: 'Une transmission sous réserve',
    description: 'Les trois équipes reçoivent leur part, mais une partie des vérifications n’a pas été conservée. Samir joint une réserve au dernier envoi. Le centre ferme sans effacer ce qui devra encore être éclairci.',
  };
  return {
    type: 'Dernier Relais — Désaccord', title: 'La clôture laisse une dette',
    description: 'Les dossiers et le matériel quittent le site, mais le solde reste au bureau de coordination. Le désaccord des équipes demeure écrit dans le registre. La porte peut se fermer ; la passation n’est pas pour autant achevée.',
  };
}
