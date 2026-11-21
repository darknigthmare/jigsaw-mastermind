import type { Campaign, CharacterProfile, DecisionLog, SymbolicTest } from '../types';
import type { EndingDetails } from './moralEngine';

const recordedAt = '2026-11-21T22:00:00.000Z';
const dates = { createdAt: recordedAt, updatedAt: recordedAt };
export const ROSTER_CONTENT_ID = 'roster-dix-pieges-v1';

/**
 * A playable roster of ten documented franchise situations, one per film.
 *
 * Each chapter keeps the film's setting and dilemma and turns them into a
 * reading, a calculation or an arbitration. The physical act, the equipment
 * and any procedure are deliberately absent: the bible's documentary 1:1
 * doctrine (§3.1) is what makes these rooms playable in a fan game.
 */

export const ROSTER_CHARACTERS: CharacterProfile[] = [
  {
    id: 'char-roster-nadia', name: 'Nadia Belkacem', role: 'Inspectrice du travail',
    archetype: 'La signature qui a précédé la visite', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A clos un rapport de site sans s’y rendre, sur la foi d’un formulaire rempli par l’employeur.',
    symbolicFear: 'Qu’une signature survive à la visite qu’elle n’a pas faite.',
    redemptionGoal: 'Rendre chaque conclusion vérifiable par la pièce qui la soutient.',
    denialPattern: 'Répète qu’un dossier clos n’est pas un dossier faux.',
    relationships: 'Théo Marchand a signé l’air du même site ; Malik Ouedraogo conserve les rapports voisins.',
    notes: 'Personnage original du « Roster ». Deux salles lui sont confiées : le bain et le manège.', ...dates,
  },
  {
    id: 'char-roster-theo', name: 'Théo Marchand', role: 'Contremaître de nuit',
    archetype: 'L’air signé sans essai', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A validé la ventilation d’un atelier sans mettre le réseau en essai.',
    symbolicFear: 'Que l’équipe de nuit paie une signature qu’il n’a pas vérifiée.',
    redemptionGoal: 'Rétablir le registre d’essai avant la reprise du service.',
    denialPattern: 'Affirme que personne n’est tombé malade, donc que l’air était bon.',
    relationships: 'Nadia a contrôlé le même site ; Suzanne Kessler a repris ses déclarations sans les recouper.',
    notes: 'Personnage original du « Roster ». Deux salles lui sont confiées : la maison au gaz et la cage publique.', ...dates,
  },
  {
    id: 'char-roster-suzanne', name: 'Suzanne Kessler', role: 'Journaliste d’enquête',
    archetype: 'La reconstitution sans provenance', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A publié une reconstitution d’incident sans joindre la source qui la contredisait.',
    symbolicFear: 'Que la correction efface l’enquête au lieu de la rendre lisible.',
    redemptionGoal: 'Attacher à chaque affirmation la pièce et la réserve qui la bornent.',
    denialPattern: 'Soutient qu’une reconstitution n’est pas une invention.',
    relationships: 'Théo lui a parlé hors registre ; Malik détient la pièce qu’elle n’a pas citée.',
    notes: 'Personnage original du « Roster ». Deux salles lui sont confiées : le congélateur et le silo.', ...dates,
  },
  {
    id: 'char-roster-malik', name: 'Malik Ouedraogo', role: 'Archiviste du dépôt',
    archetype: 'Le classement qui déplace le sens', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A reclassé une déposition sous la référence d’une affaire voisine pour éviter un conflit.',
    symbolicFear: 'Que l’ordre du dépôt devienne plus important que ce qu’il conserve.',
    redemptionGoal: 'Rendre la déposition consultable sous sa référence d’origine, avec sa réserve.',
    denialPattern: 'Explique que classer n’est pas choisir.',
    relationships: 'Suzanne attend la pièce ; Nadia lui a confié les rapports de site.',
    notes: 'Personnage original du « Roster ». Deux salles lui sont confiées : le mausolée et le faux témoin.', ...dates,
  },
  {
    id: 'char-roster-claire', name: 'Claire Fontaine', role: 'Cadre d’assurance',
    archetype: 'Le refus rendu par le protocole', timelinePeriod: 'fan-campaigns', canonStatus: 'custom',
    moralFlaw: 'A refusé un dossier sans le lire, au motif que le protocole l’avait classé sans suite.',
    symbolicFear: 'Que le protocole ait raison contre elle, et qu’il ne change jamais d’avis.',
    redemptionGoal: 'Rouvrir le dossier et rendre la décision lisible pour la personne concernée.',
    denialPattern: 'Assure que le protocole n’a pas d’opinion, donc qu’il ne peut pas se tromper.',
    relationships: 'Suzanne a publié son refus ; Malik conserve la pièce qui l’aurait rouvert.',
    notes: 'Personnage original du « Roster ». Deux salles lui sont confiées : le cube d’eau et la machine.', ...dates,
  },
];

export const ROSTER_CAMPAIGN: Campaign = {
  id: 'camp-roster-dix', title: 'Le Roster — dix pièges', timelinePeriod: 'fan-campaigns',
  tone: 'Rotonde d’archive, néons fatigués, métal et bandes magnétiques',
  moralTheme: 'Ce qu’une épreuve révèle à qui la traverse sans la subir',
  fictionalLocation: 'Dépôt des épreuves — dix salles de lecture autour d’une rotonde',
  objective: 'Traverser les dix salles, résoudre chaque épreuve et rendre au registre une lecture vérifiable de ce qui s’y est joué.',
  status: 'ready', characterIds: ROSTER_CHARACTERS.map(character => character.id),
  testIds: [
    'test-roster-01-bain', 'test-roster-02-maison', 'test-roster-03-congelateur', 'test-roster-04-mausolee',
    'test-roster-05-cube', 'test-roster-06-manege', 'test-roster-07-cage', 'test-roster-08-silo',
    'test-roster-09-temoin', 'test-roster-10-machine',
  ], ...dates,
};

const fidelity = (film: string, situation: string, played: string) =>
  `Référence documentaire : ${film}, ${situation}. Lecture jouée : ${played}. Non reproduits : le geste, la blessure, le matériel et la procédure — la salle se lit, elle ne s’exécute pas.`;

export const ROSTER_TESTS: SymbolicTest[] = [
  {
    id: 'test-roster-01-bain', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-nadia',
    title: '01 — Le bain', moralTheme: 'La pièce qui prouve la visite',
    openingTape: 'Nadia. Tu as clos un rapport de site sans y entrer. La salle carrelée est la première du dépôt : une grille de neuf dalles, un registre d’entretien détrempé, et une clé laissée là pour être retrouvée. Le registre ne mentionne qu’une dalle rouverte après la fermeture. Lis-le, puis décide ce que tu fais de la clé. Le dépôt n’ouvre pas la porte suivante avant que la pièce soit nommée.',
    rules: 'Lisez la dalle indiquée par le registre, puis choisissez ce que vous faites de la clé. Le compte à rebours continue pendant la lecture.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Le registre d’entretien ne mentionne qu’une dalle rouverte après la fermeture : ligne C, colonne 2. La grille va de A à C et de 1 à 3. Quelle dalle faut-il ouvrir ?',
      correctAnswer: 'C-2', gridLabel: 'GRILLE DES DALLES :',
    },
    clues: ['Le registre ne mentionne qu’une intervention après la fermeture.', 'La ligne est donnée avant la colonne.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-roster-01-partager', text: 'Ouvrir la dalle et laisser la clé sur le rebord, à portée de tous', scoresEffect: { truth: 10, cooperation: 10, courage: 10 }, narrativeImpact: 'La clé reste sur le rebord. Personne ne peut plus prétendre qu’elle était introuvable, et la salle suivante s’ouvre sur une pièce que deux personnes ont vue.' },
      { id: 'choice-roster-01-garder', text: 'Ouvrir la dalle et garder la clé pour négocier sa sortie', scoresEffect: { denial: 15, cooperation: -10 }, narrativeImpact: 'La clé disparaît dans une poche. Le registre garde la trace de la dalle, pas de la main qui l’a ouverte.' },
    ],
    safetyNote: 'Fiction originale. Lecture d’un registre d’entretien fictif dans une salle carrelée ; aucune intervention réelle.',
    sourceNote: fidelity('Saw (2004)', 'l’épreuve du bain', 'le registre d’entretien, la dalle et le choix de partager la clé'), ...dates,
  },
  {
    id: 'test-roster-02-maison', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-theo',
    title: '02 — La maison au gaz', moralTheme: 'L’air signé sans essai',
    openingTape: 'Théo. Tu as validé une ventilation sans mettre le réseau en essai. La deuxième salle est une maison scellée : des grilles, des volets, et un plan punaisé qui donne le volume de chaque pièce. Le réseau traite trente mètres cubes par minute. Calcule le temps de renouvellement, puis choisis ce que tu inscris au registre. Le dépôt ne te demande pas de traverser la maison : il te demande de la lire.',
    rules: 'Calculez le temps nécessaire pour renouveler une fois l’air de la salle, puis choisissez la mention à porter au registre.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'La salle de lecture mesure 540 m³. Le réseau d’extraction traite 30 m³ par minute. En combien de minutes l’air de la salle est-il entièrement renouvelé une fois ?',
      correctAnswer: '18',
    },
    clues: ['Le temps cherché est le volume divisé par le débit.', 'Le résultat s’exprime en minutes, sans unité dans la réponse.'],
    timerSeconds: 210,
    choices: [
      { id: 'choice-roster-02-partager', text: 'Inscrire le temps exact et laisser le plan visible pour l’équipe suivante', scoresEffect: { truth: 10, responsibility: 10, cooperation: 10 }, narrativeImpact: 'Le plan reste punaisé avec le calcul en marge. L’équipe qui reprend le service peut vérifier le débit avant de signer à son tour.' },
      { id: 'choice-roster-02-garder', text: 'Inscrire seulement « conforme » sans reporter le calcul', scoresEffect: { denial: 15, truth: -5 }, narrativeImpact: 'Le registre ne dit plus rien du débit. La mention suffit à fermer la salle, pas à comprendre ce qui y a été vérifié.' },
    ],
    safetyNote: 'Fiction originale. Calcul de renouvellement d’air sur un plan fictif ; aucune manipulation d’installation réelle.',
    sourceNote: fidelity('Saw II (2005)', 'la maison au gaz', 'le plan de ventilation, le débit et la mention portée au registre'), ...dates,
  },
  {
    id: 'test-roster-03-congelateur', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-suzanne',
    title: '03 — Le congélateur', moralTheme: 'La reconstitution qui refroidit le récit',
    openingTape: 'Suzanne. Tu as publié une reconstitution sans joindre la pièce qui la contredisait. La troisième salle est une chambre froide : douze degrés au départ, moins trois à l’arrivée, et un groupe qui retire un degré toutes les trois minutes. Calcule le temps que la salle mettra à descendre, puis décide ce que tu fais du manteau laissé sur le crochet. La reconstitution est un récit ; la pièce, elle, a une température.',
    rules: 'Calculez la durée de descente en température, puis choisissez ce que vous faites du manteau et de la mention au dossier.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'La chambre froide doit passer de 12 °C à −3 °C. Le groupe retire 1 °C toutes les 3 minutes. Combien de minutes faut-il ?',
      correctAnswer: '45',
    },
    clues: ['Comptez d’abord le nombre de degrés à retirer.', 'Multipliez ce nombre par trois minutes.'],
    timerSeconds: 210,
    choices: [
      { id: 'choice-roster-03-partager', text: 'Laisser le manteau au crochet et inscrire la durée exacte au dossier', scoresEffect: { truth: 10, empathy: 10, responsibility: 10 }, narrativeImpact: 'Le manteau reste à la disposition de la personne suivante, et le dossier porte la durée réelle. La reconstitution peut être confrontée à la pièce.' },
      { id: 'choice-roster-03-garder', text: 'Prendre le manteau et publier la durée arrondie', scoresEffect: { denial: 15, empathy: -10 }, narrativeImpact: 'Le crochet est vide. La durée publiée ne correspond plus à celle de la salle, et personne ne peut retrouver d’où venait l’écart.' },
    ],
    safetyNote: 'Fiction originale. Calcul de descente en température dans une chambre froide fictive ; aucune intervention réelle.',
    sourceNote: fidelity('Saw III (2006)', 'la chambre froide', 'la température, la durée et le manteau laissé au crochet'), ...dates,
  },
  {
    id: 'test-roster-04-mausolee', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-malik',
    title: '04 — Le mausolée', moralTheme: 'La référence qu’on déplace',
    openingTape: 'Malik. Tu as reclassé une déposition sous la référence d’une affaire voisine. La quatrième salle est un mausolée de pierre : des plaques scellées, des chaînes, et un registre funéraire ouvert sur le banc. Le registre porte la date du dernier lundi de février 2031. Retrouve-la avant de toucher au lien qui retient les deux plaques. Classer n’est pas choisir, disais-tu ; le registre, lui, garde les deux.',
    rules: 'Déduisez la date du dernier lundi de février 2031, puis choisissez ce que vous faites des deux plaques.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Le registre funéraire porte la date du dernier lundi de février 2031. Quelle est cette date ?',
      correctAnswer: '2031-02-24',
    },
    clues: ['Février 2031 commence un samedi.', 'Le dernier lundi précède le 1er mars.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-roster-04-partager', text: 'Lire les deux plaques et laisser le registre ouvert entre elles', scoresEffect: { truth: 10, responsibility: 10, cooperation: 10 }, narrativeImpact: 'Les deux noms restent lisibles côte à côte. Le registre ouvert ne tranche pas à la place de la personne qui viendra le consulter.' },
      { id: 'choice-roster-04-garder', text: 'Ne relever que la plaque qui arrange le classement', scoresEffect: { denial: 15, truth: -10 }, narrativeImpact: 'Une plaque reste dans l’ombre. Le registre porte une date juste, mais la salle ne dit plus ce qu’elle conservait.' },
    ],
    safetyNote: 'Fiction originale. Lecture d’un registre funéraire fictif et d’un calendrier ; aucune exhumation ni intervention réelle.',
    sourceNote: fidelity('Saw IV (2007)', 'le mausolée', 'les plaques, le registre et la date qui relie deux noms'), ...dates,
  },
  {
    id: 'test-roster-05-cube', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-claire',
    title: '05 — Le cube d’eau', moralTheme: 'Le refus rendu par le protocole',
    openingTape: 'Claire. Tu as refusé un dossier sans le lire, parce que le protocole l’avait classé sans suite. La cinquième salle est une chambre de pompes : un cube de verre, une arrivée d’eau, un drain et un compteur. Le cube contient mille quatre-vingts litres ; la pompe le remplit à quinze litres par minute. Calcule le temps avant le débordement, puis décide qui peut ouvrir le drain. Un protocole n’a pas d’opinion ; il a une durée.',
    rules: 'Calculez le temps de remplissage, puis choisissez qui peut ouvrir le drain.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Le cube contient 1 080 litres. La pompe le remplit à 15 litres par minute. Combien de minutes faut-il avant le débordement ?',
      correctAnswer: '72',
    },
    clues: ['Le temps cherché est le volume divisé par le débit.', 'Le résultat s’exprime en minutes, sans unité dans la réponse.'],
    timerSeconds: 210,
    choices: [
      { id: 'choice-roster-05-partager', text: 'Laisser le drain ouvert et inscrire le calcul au dossier pour la personne suivante', scoresEffect: { truth: 10, empathy: 10, cooperation: 10 }, narrativeImpact: 'Le drain reste ouvert. Le calcul au dossier permet de vérifier le débit sans refaire l’essai, et la salle suivante trouve la chambre déjà lisible.' },
      { id: 'choice-roster-05-garder', text: 'Fermer le drain et garder le calcul pour justifier le refus', scoresEffect: { denial: 20, empathy: -10 }, narrativeImpact: 'Le cube se remplit sans témoin. Le calcul devient une pièce à charge, pas une explication offerte à la personne concernée.' },
    ],
    safetyNote: 'Fiction originale. Calcul de remplissage sur une installation fictive ; aucune manœuvre réelle.',
    sourceNote: fidelity('Saw V (2008)', 'la chambre du cube d’eau', 'le volume, le débit, le drain et le temps avant débordement'), ...dates,
  },
  {
    id: 'test-roster-06-manege', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-nadia',
    title: '06 — Le manège', moralTheme: 'La sélection par le score',
    openingTape: 'Nadia. La sixième salle est un manège : six sièges numérotés, une plateforme qui tourne au ralenti, et un registre de sélection posé sur le garde-corps. Le registre élimine la ligne B ainsi que les colonnes 1 et 2. Il ne reste qu’un siège de la ligne A. Trouve-le, puis décide qui doit l’occuper. Une grille n’est pas un jugement ; elle attend qu’on lui en donne un.',
    rules: 'Déduisez le seul siège restant de la ligne A, puis choisissez son occupant.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Six sièges sont numérotés A-1 à C-3. Le registre élimine la ligne B ainsi que les colonnes 1 et 2. Quel siège de la ligne A reste disponible ?',
      correctAnswer: 'A-3', gridLabel: 'GRILLE DES SIÈGES :',
    },
    clues: ['La ligne A contient trois sièges.', 'Deux colonnes sont éliminées : il ne reste qu’une colonne.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-roster-06-partager', text: 'Laisser le siège à la personne dont le dossier porte le moins de vérifications', scoresEffect: { empathy: 15, cooperation: 10, responsibility: 10 }, narrativeImpact: 'Le siège revient à celle dont le dossier était le plus fragile. Le registre de sélection porte la raison du choix, et le manège s’arrête sur une place qui n’est plus anonyme.' },
      { id: 'choice-roster-06-garder', text: 'Prendre le siège et laisser la grille décider pour les autres', scoresEffect: { denial: 20, empathy: -15 }, narrativeImpact: 'Le siège est occupé sans mention. La grille garde son apparence d’objectivité, et la sélection ne s’explique plus à personne.' },
    ],
    safetyNote: 'Fiction originale. Déduction sur une grille de sièges et arbitrage d’attribution ; aucune sélection réelle.',
    sourceNote: fidelity('Saw VI (2009)', 'le manège', 'la grille des places, le registre de sélection et le choix de l’occupant'), ...dates,
  },
  {
    id: 'test-roster-07-cage', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-theo',
    title: '07 — La cage publique', moralTheme: 'La décision prise par la salle',
    openingTape: 'Théo. Tu as laissé l’urgence décider à ta place. La septième salle est une cage derrière une vitre, avec une galerie vide et des moniteurs. Trois relevés du vote public sont affichés ; un seul rend le compte exact. Choisis-le avant de décider ce que la galerie verra. Une majorité n’est pas une vérification : c’est un nombre qu’il faut savoir lire.',
    rules: 'Comparez les trois relevés et choisissez celui qui rend le compte exact du vote, puis décidez de sa publication.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Trois relevés sont proposés. Lequel rend le compte exact de la salle publique ?',
      correctAnswer: 'B-2',
      confessionOptions: [
        { id: 'A-1', text: 'La cage s’est ouverte après 42 votes pour la sortie.', truthScore: 10 },
        { id: 'B-2', text: '38 votes pour la sortie, 12 contre, 4 abstentions ; la cage s’est ouverte à 38.', truthScore: 90 },
        { id: 'C-3', text: 'La cage s’est ouverte à la majorité des votants, sans quorum.', truthScore: 20 },
      ],
    },
    clues: ['Additionnez les votes pour, les votes contre et les abstentions.', 'La cage s’est ouverte au nombre de votes pour, pas au total des inscrits.'],
    timerSeconds: 210,
    choices: [
      { id: 'choice-roster-07-partager', text: 'Afficher le relevé exact et la réserve de la galerie', scoresEffect: { truth: 15, courage: 10, cooperation: 10 }, narrativeImpact: 'Le relevé complet reste affiché derrière la vitre. La galerie peut vérifier le quorum, et la décision cesse d’appartenir à la seule urgence.' },
      { id: 'choice-roster-07-garder', text: 'Afficher seulement le chiffre des votes pour', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'Le chiffre suffit à justifier l’ouverture. Les abstentions et le quorum disparaissent, et la salle garde une décision qui ne s’explique plus.' },
    ],
    safetyNote: 'Fiction originale. Rapprochement de trois relevés de vote fictifs ; aucune décision réelle.',
    sourceNote: fidelity('Saw VII (2010)', 'la cage publique', 'le relevé de vote, le quorum et la décision rendue visible'), ...dates,
  },
  {
    id: 'test-roster-08-silo', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-suzanne',
    title: '08 — Le silo', moralTheme: 'La livraison signée sans compter',
    openingTape: 'Suzanne. Tu as cité une livraison sans vérifier le compte. La huitième salle est un silo : trois trémies, des sacs empilés, une échelle et un registre de pesée. Chaque trémie a versé neuf sacs de douze kilos ; le registre attend quatre cent trente-deux kilos. Trouve le nombre de sacs manquants, puis décide ce que tu inscris au bordereau. Un chiffre cité n’est pas un chiffre vérifié.',
    rules: 'Calculez le nombre de sacs manquants, puis choisissez la mention portée au bordereau.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'Trois trémies versent chacune 9 sacs de 12 kg. Le registre attend 432 kg. Combien de sacs manquent ?',
      correctAnswer: '9',
    },
    clues: ['Calculez d’abord la masse déjà versée.', 'Chaque sac manquant pèse douze kilos.'],
    timerSeconds: 210,
    choices: [
      { id: 'choice-roster-08-partager', text: 'Inscrire le nombre exact de sacs manquants et laisser le bordereau ouvert', scoresEffect: { truth: 15, responsibility: 10, cooperation: 10 }, narrativeImpact: 'Le bordereau porte l’écart et la pesée. La livraison suivante peut être vérifiée sans refaire le calcul, et la citation ne repose plus sur une estimation.' },
      { id: 'choice-roster-08-garder', text: 'Signer la livraison complète et corriger le chiffre dans l’article', scoresEffect: { denial: 15, truth: -10 }, narrativeImpact: 'Le bordereau est signé sans réserve. L’article corrige le chiffre, mais la pièce qui permettrait de le prouver reste fermée.' },
    ],
    safetyNote: 'Fiction originale. Calcul de pesée et lecture d’un bordereau fictifs ; aucune manutention réelle.',
    sourceNote: fidelity('Jigsaw (2017)', 'le silo à grains', 'les trémies, la pesée et le bordereau de livraison'), ...dates,
  },
  {
    id: 'test-roster-09-temoin', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-malik',
    title: '09 — Le faux témoin', moralTheme: 'La provenance d’une déposition',
    openingTape: 'Malik. Tu as rangé une déposition sous une autre référence. La neuvième salle est un local de maintenance du métro : un magnétophone, des dossiers et un tableau de signalisation. Trois références sont proposées pour la déposition ; une seule conserve sa provenance et sa réserve. Choisis-la, puis décide si la pièce retourne à son affaire. Une archive qui déplace un nom ne protège personne : elle déplace la responsabilité.',
    rules: 'Choisissez la référence qui conserve la provenance et la réserve de la déposition, puis décidez de son classement.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Trois références sont proposées pour la déposition. Laquelle conserve la provenance exacte ?',
      correctAnswer: 'C-3',
      confessionOptions: [
        { id: 'A-1', text: 'Déposition classée sous la référence de l’affaire voisine, sans mention.', truthScore: 10 },
        { id: 'B-2', text: 'Déposition classée sous un nom d’emprunt, sans réserve.', truthScore: 20 },
        { id: 'C-3', text: 'Déposition classée sous sa référence d’origine, avec la réserve de l’archiviste.', truthScore: 90 },
      ],
    },
    clues: ['Une référence d’origine ne remplace pas le nom de la personne qui a parlé.', 'La réserve dit ce que la pièce ne prouve pas.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-roster-09-partager', text: 'Rétablir la référence d’origine et joindre la réserve au dossier', scoresEffect: { truth: 15, courage: 10, responsibility: 10 }, narrativeImpact: 'La déposition retrouve sa référence et sa réserve. La personne qui la consultera saura ce qu’elle établit et ce qu’elle laisse ouvert.' },
      { id: 'choice-roster-09-garder', text: 'Laisser le classement d’emprunt et retirer la réserve', scoresEffect: { denial: 20, truth: -15 }, narrativeImpact: 'Le dossier reste rangeable, mais la déposition ne mène plus à son affaire. La réserve retirée fait passer une réserve pour une preuve.' },
    ],
    safetyNote: 'Fiction originale. Choix d’une référence d’archive fictive ; aucune déposition réelle.',
    sourceNote: fidelity('Spiral (2021)', 'l’épreuve du témoin', 'la déposition, sa référence d’origine et la réserve d’archive'), ...dates,
  },
  {
    id: 'test-roster-10-machine', campaignId: ROSTER_CAMPAIGN.id, characterId: 'char-roster-claire',
    title: '10 — La machine', moralTheme: 'La porte ouverte pour soi',
    openingTape: 'Claire. Dernière salle. La machine est un appareil de laiton et d’acier, sans mode d’emploi : un compteur, neuf verrous, et une porte qui ne s’ouvre qu’une fois. Un verrou se libère toutes les quatre minutes. Calcule le temps d’ouverture, puis décide si la porte reste ouverte derrière toi. Le dépôt ne juge pas le calcul ; il regarde ce que tu fais du temps que tu viens de gagner.',
    rules: 'Calculez le temps d’ouverture des neuf verrous, puis choisissez ce que vous faites de la porte.',
    puzzleType: 'logic',
    puzzleData: {
      question: 'La machine libère un verrou toutes les 4 minutes. Neuf verrous retiennent la porte. Combien de minutes faut-il avant l’ouverture ?',
      correctAnswer: '36',
    },
    clues: ['Le temps total est le nombre de verrous multiplié par quatre minutes.', 'Le premier verrou se libère après quatre minutes, pas à zéro.'],
    timerSeconds: 180,
    choices: [
      { id: 'choice-roster-10-partager', text: 'Bloquer la porte ouverte et inscrire l’heure au registre', scoresEffect: { courage: 10, empathy: 15, cooperation: 15, responsibility: 10 }, narrativeImpact: 'La porte reste ouverte derrière toi. Le registre porte l’heure et le calcul ; la salle suivante n’aura pas à refaire le temps que tu as déjà payé.' },
      { id: 'choice-roster-10-garder', text: 'Refermer la porte et garder le calcul pour toi', scoresEffect: { denial: 20, empathy: -15, cooperation: -10 }, narrativeImpact: 'La porte se referme sur un compteur remis à zéro. Le temps gagné n’est inscrit nulle part, et la personne suivante recommence sans savoir ce que la salle demandait.' },
    ],
    safetyNote: 'Fiction originale. Calcul de délai et choix d’ouverture sur un appareil fictif ; aucune intervention réelle.',
    sourceNote: fidelity('Saw X (2023)', 'la machine de la dernière salle', 'le compteur, les verrous et la porte laissée ouverte'), ...dates,
  },
];

/** Three authored outcomes for the roster, decided by how many rooms were read
 * with their record intact rather than by the final score alone. */
export function getRosterEnding(campaignId: string, decisions: DecisionLog[]): EndingDetails | undefined {
  if (campaignId !== ROSTER_CAMPAIGN.id) return undefined;
  const finalChoice = decisions.at(-1)?.choiceId;
  if (!finalChoice?.startsWith('choice-roster-10-')) return undefined;
  const readWithRecord = decisions.filter(decision => decision.choiceId.endsWith('-partager')).length;
  if (readWithRecord >= 8) return {
    type: 'Le Roster — Registre', title: 'Les dix salles ont un témoin',
    description: 'Les dix salles rendent leurs pièces : dalles, plans, registres, bordereaux. Le dépôt peut être fermé sans que ce qui y a été lu disparaisse. La rotonde s’éteint sur un registre complet, où chaque décision porte la trace de ce qu’elle a laissé ouvert.',
  };
  if (readWithRecord >= 4) return {
    type: 'Le Roster — Réserve', title: 'La rotonde garde une réserve',
    description: 'Une partie des salles rend ses pièces, l’autre garde ses raccourcis. Le registre est lisible, mais il porte des réserves que personne n’a prises en charge. La porte se ferme sur un dépôt qui pourra encore être rouvert.',
  };
  return {
    type: 'Le Roster — Impasse', title: 'Le dixième siège reste vide',
    description: 'Les salles se sont refermées sur leurs compteurs. Les pièces existent encore, mais les décisions qui les reliaient n’ont pas été inscrites. Le dépôt garde dix épreuves et aucune lecture commune ; la rotonde s’éteint sans témoin.',
  };
}
