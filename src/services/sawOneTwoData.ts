import type { SymbolicTest } from '../types';

const recordedAt = '2026-11-21T23:00:00.000Z';
const dates = { createdAt: recordedAt, updatedAt: recordedAt };

/**
 * Rewritten situations for the two founding films.
 *
 * These replace the earlier one-line English entries. Each room keeps the
 * film's documented situation and the subject's fault, and turns the physical
 * test into a reading, a calculation or an arbitration. No gesture, equipment
 * or procedure is described; the fidelity note under each room says so.
 */

const fidelity = (film: string, situation: string, played: string) =>
  `Référence documentaire : ${film}, ${situation}. Lecture jouée : ${played}. Non reproduits : le geste, la blessure, le matériel et la procédure — la salle se lit, elle ne s’exécute pas.`;

export const SAW_ONE_TWO_TEST_IDS = [
  'test-s1-bathroom', 'test-s1-bear-trap', 'test-s1-razor-wire', 'test-s1-flammable-jelly',
  'test-s1-drill-chair', 'test-s1-shotgun-hallway', 'test-s1-zep-hostage',
  'test-s2-death-mask', 'test-s2-needle-pit', 'test-s2-razor-box',
  'test-s2-furnace', 'test-s2-shotgun-peephole', 'test-s2-gas-house',
] as const;

export const SAW_ONE_TWO_TESTS: SymbolicTest[] = [
  {
    id: 'test-s1-bathroom', campaignId: 'camp-saw-i', characterId: 'canon-lawrence-gordon',
    title: '01 — Le bain', moralTheme: 'La distance que prend un praticien',
    openingTape: 'Lawrence. Tu écoutes les gens sans les regarder. La salle carrelée est la première du dépôt : deux baignoires, une grille de neuf dalles et un registre d’entretien posé sur un tabouret. Une seule dalle a été rouverte après la fermeture. Lis-la, puis décide ce que tu laisses à portée de la deuxième personne. Le temps que tu passes à hésiter est déjà compté.',
    rules: 'Lisez la dalle indiquée par le registre, puis choisissez ce que vous faites de la clé trouvée.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Le registre d’entretien ne mentionne qu’une dalle rouverte après la fermeture : ligne B, colonne 3. La grille va de A à C et de 1 à 3. Quelle dalle faut-il ouvrir ?',
      correctAnswer: 'B-3', gridLabel: 'GRILLE DES DALLES :',
    },
    clues: ['Le registre ne mentionne qu’une intervention après la fermeture.', 'La ligne est donnée avant la colonne.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-gordon-k', text: 'Laisser la clé sur le rebord, visible des deux côtés', scoresEffect: { truth: 15, courage: 10, cooperation: 10 }, narrativeImpact: 'La clé reste sur le rebord. Le registre garde la dalle, la salle garde une issue que personne ne peut accaparer.' },
      { id: 'choice-gordon-f', text: 'Emporter la clé et négocier seul la sortie', scoresEffect: { denial: 20, cooperation: -15 }, narrativeImpact: 'La clé quitte la salle dans une poche. La dalle est ouverte, mais la preuve de ce qu’elle contenait a disparu.' },
    ],
    safetyNote: 'Fiction originale. Lecture d’un registre et partage d’une clé dans une salle carrelée fictive ; aucun geste réel.',
    sourceNote: fidelity('Saw (2004)', 'la salle carrelée et la clé dissimulée', 'le registre d’entretien, la dalle et le partage de la clé'), ...dates,
  },
  {
    id: 'test-s1-bear-trap', campaignId: 'camp-saw-i', characterId: 'canon-amanda-young',
    title: '02 — Le masque', moralTheme: 'La survie qui ne regarde pas derrière',
    openingTape: 'Amanda. Tu as survécu en laissant les autres décider à ta place. La chambre scellée contient un banc, un magnétophone et une console à deux arbres. Les index des arbres doivent totaliser exactement quinze pour libérer le verrou. Trouve l’alignement, puis décide si le dégagement reste visible après ton passage. Le masque n’est pas dans la salle : seule la serrure l’est.',
    rules: 'Faites tourner les deux arbres pour obtenir un total de 15, puis choisissez ce que vous laissez derrière vous.',
    puzzleType: 'maze',
    puzzleData: { question: 'Alignez les deux arbres pour que leurs index totalisent exactement 15 :', correctAnswer: '15' },
    clues: ['L’arbre de gauche ajoute 3 par cran, celui de droite 2.', 'Plusieurs combinaisons atteignent 15 ; une seule est demandée.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-amanda-s', text: 'Libérer le verrou et laisser la combinaison affichée', scoresEffect: { courage: 15, cooperation: 10, truth: 10 }, narrativeImpact: 'Le verrou cède et la combinaison reste lisible sur la console. La personne suivante n’aura pas à refaire l’alignement dans le noir.' },
      { id: 'choice-amanda-f', text: 'Libérer le verrou puis effacer la combinaison', scoresEffect: { denial: 20, cooperation: -10 }, narrativeImpact: 'La console revient à zéro. Le verrou est ouvert, mais la salle ne dit plus comment elle l’a été.' },
    ],
    safetyNote: 'Fiction originale. Alignement d’index sur une console fictive ; aucun dispositif ni geste réel.',
    sourceNote: fidelity('Saw (2004)', 'la chambre du masque et le compte à rebours', 'les deux arbres, le total de 15 et la combinaison laissée visible'), ...dates,
  },
  {
    id: 'test-s1-razor-wire', campaignId: 'camp-saw-i', characterId: 'canon-john-kramer',
    title: '03 — Le grillage', moralTheme: 'L’attention cherchée au mauvais endroit',
    openingTape: 'Paul. Tu as mis en scène ta propre blessure pour qu’on te regarde. Le passage condamné descend vers une grille et un clavier. Le registre de fermeture porte la date du troisième jeudi de mars 2004. Trouve cette date, puis décide si la sortie reste signalée. Un passage n’est pas un spectacle : il demande une date vérifiable.',
    rules: 'Déduisez la date du troisième jeudi de mars 2004, puis choisissez la signalisation de la sortie.',
    puzzleType: 'logic',
    puzzleData: { question: 'Le registre de fermeture porte la date du troisième jeudi de mars 2004. Quelle est cette date ?', correctAnswer: '2004-03-18' },
    clues: ['Le 1er mars 2004 est un lundi.', 'Les jeudis de mars 2004 sont les 4, 11, 18 et 25.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-paul-s', text: 'Ouvrir la grille et laisser la date et la sortie inscrites', scoresEffect: { truth: 15, courage: 10, responsibility: 10 }, narrativeImpact: 'La grille reste ouverte avec sa date de fermeture. Le passage devient une issue documentée, pas un récit.' },
      { id: 'choice-paul-f', text: 'Ouvrir la grille et refermer le registre', scoresEffect: { denial: 20, responsibility: -10 }, narrativeImpact: 'La grille cède, le registre se referme. La sortie existe, mais plus personne ne peut dater la décision.' },
    ],
    safetyNote: 'Fiction originale. Lecture d’un registre daté dans un passage fictif ; aucune intervention réelle.',
    sourceNote: fidelity('Saw (2004)', 'le passage grillagé et le clavier de sortie', 'le registre de fermeture, la date et la signalisation de la sortie'), ...dates,
  },
  {
    id: 'test-s1-flammable-jelly', campaignId: 'camp-saw-i', characterId: 'canon-john-kramer',
    title: '04 — La chambre chaude', moralTheme: 'La maladie inventée pour ne pas venir',
    openingTape: 'Mark. Tu as simulé la maladie pour éviter le travail. La quatrième salle est un local de chauffe : dix-huit degrés au départ, un thermostat qui coupe à quarante, et un groupe qui monte de deux degrés toutes les cinq minutes. Calcule le temps avant la coupure, puis décide ce que tu fais du registre de température. La chaleur ne juge pas ; elle compte.',
    rules: 'Calculez le temps avant la coupure du thermostat, puis choisissez la mention portée au registre.',
    puzzleType: 'logic',
    puzzleData: { question: 'Le local passe de 18 °C à 40 °C. Le groupe monte de 2 °C toutes les 5 minutes. Combien de minutes faut-il ?', correctAnswer: '55' },
    clues: ['Comptez d’abord les degrés à gagner.', 'Multipliez le nombre de paliers par cinq minutes.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-jelly-s', text: 'Inscrire la courbe exacte et laisser le registre ouvert', scoresEffect: { truth: 15, responsibility: 10 }, narrativeImpact: 'Le registre porte la courbe et l’heure de coupure. La salle suivante peut vérifier le calcul sans refaire chauffer le local.' },
      { id: 'choice-jelly-f', text: 'Inscrire « conforme » sans reporter la courbe', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'Le local est déclaré conforme. La courbe disparaît, et la mention ne dit plus ce qui a été mesuré.' },
    ],
    safetyNote: 'Fiction originale. Calcul de montée en température dans un local fictif ; aucune intervention réelle.',
    sourceNote: fidelity('Saw (2004)', 'la chambre chaude et le thermostat', 'la montée en température, le seuil de coupure et le registre'), ...dates,
  },
  {
    id: 'test-s1-drill-chair', campaignId: 'camp-saw-i', characterId: 'canon-john-kramer',
    title: '05 — L’atelier', moralTheme: 'Le risque laissé aux autres',
    openingTape: 'Jeff. Tu as laissé d’autres prendre les risques que tu évitais. L’atelier contient une presse, une courroie et une plaque de vitesse. La presse doit tourner à neuf cents tours par minute ; la courroie donne trois tours de machine pour un tour moteur. Trouve le régime moteur, puis décide si la plaque reste lisible. Un chiffre juste ne vaut rien s’il n’est pas transmissible.',
    rules: 'Calculez le régime moteur demandé par la presse, puis choisissez la mention portée à la plaque.',
    puzzleType: 'logic',
    puzzleData: { question: 'La presse doit tourner à 900 tr/min. La courroie donne 3 tours de machine pour 1 tour moteur. Quel régime moteur faut-il ?', correctAnswer: '300' },
    clues: ['Le rapport divise le régime de la presse.', 'Le résultat s’exprime en tours par minute, sans unité dans la réponse.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-drill-s', text: 'Inscrire le régime exact et laisser la plaque en place', scoresEffect: { truth: 15, cooperation: 10, responsibility: 10 }, narrativeImpact: 'La plaque porte le régime moteur et le rapport de courroie. L’atelier devient vérifiable pour celui qui prend le service.' },
      { id: 'choice-drill-f', text: 'Retirer la plaque et retenir le chiffre', scoresEffect: { denial: 20, cooperation: -10 }, narrativeImpact: 'La presse tourne, la plaque est vide. Le réglage dépend d’une mémoire qui ne laisse aucune trace.' },
    ],
    safetyNote: 'Fiction originale. Calcul de transmission dans un atelier fictif ; aucune manipulation de machine.',
    sourceNote: fidelity('Saw (2004)', 'l’atelier et la presse', 'le régime moteur, le rapport de courroie et la plaque de vitesse'), ...dates,
  },
  {
    id: 'test-s1-shotgun-hallway', campaignId: 'camp-saw-i', characterId: 'canon-john-kramer',
    title: '06 — Le couloir', moralTheme: 'La procédure contournée',
    openingTape: 'Tapp. Toi et Sing, vous avez contourné les mandats pour aller plus vite. Le couloir compte neuf portes, un tableau de service et un verrou central. Le tableau condamne la ligne B ainsi que les colonnes 2 et 3. Il ne reste qu’une porte de la ligne C. Trouve-la, puis décide si le tableau reste affiché. Une porte choisie sans trace n’est qu’une intuition.',
    rules: 'Déduisez la seule porte restante de la ligne C, puis choisissez la conservation du tableau de service.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Neuf portes sont numérotées A-1 à C-3. Le tableau condamne la ligne B ainsi que les colonnes 2 et 3. Quelle porte de la ligne C reste disponible ?',
      correctAnswer: 'C-1', gridLabel: 'GRILLE DES PORTES :',
    },
    clues: ['La ligne C contient trois portes.', 'Deux colonnes sont condamnées : une seule reste.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-hall-s', text: 'Ouvrir C-1 et laisser le tableau affiché dans le couloir', scoresEffect: { truth: 15, courage: 10, cooperation: 10 }, narrativeImpact: 'La porte reste ouverte avec le tableau. La prochaine équipe peut refaire la déduction sans tâtonner.' },
      { id: 'choice-hall-f', text: 'Ouvrir C-1 et décrocher le tableau', scoresEffect: { denial: 20, cooperation: -10 }, narrativeImpact: 'La porte cède, le tableau disparaît. Le couloir garde une issue, pas la raison de son choix.' },
    ],
    safetyNote: 'Fiction originale. Déduction sur un plan de portes fictif ; aucune intrusion ni intervention réelle.',
    sourceNote: fidelity('Saw (2004)', 'le couloir aux portes numérotées', 'la grille des portes, les condamnations et le tableau de service'), ...dates,
  },
  {
    id: 'test-s1-zep-hostage', campaignId: 'camp-saw-i', characterId: 'canon-john-kramer',
    title: '07 — L’appartement', moralTheme: 'L’ordre suivi sans vérification',
    openingTape: 'Zep. Tu as obéi à une voix sans vérifier qui parlait. L’appartement contient un téléphone, un magnétophone et trois transcriptions de l’appel. Une seule rend la durée, l’heure et l’absence de nom. Choisis-la, puis décide ce que tu fais de l’original. Obéir n’est pas transmettre : encore faut-il que la pièce survive à l’ordre.',
    rules: 'Comparez les trois transcriptions et choisissez celle qui rend exactement l’appel, puis décidez du sort de l’original.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Trois transcriptions sont proposées. Laquelle rend exactement la durée, l’heure et l’absence de nom ?',
      correctAnswer: 'B-2',
      confessionOptions: [
        { id: 'A-1', text: 'L’appel a duré deux minutes et demandait de ne rien dire.', truthScore: 10 },
        { id: 'B-2', text: 'L’appel a duré quatre minutes ; il donnait une heure et une adresse, sans nom.', truthScore: 90 },
        { id: 'C-3', text: 'L’appel venait d’un poste interne et ne donnait aucune heure.', truthScore: 20 },
      ],
    },
    clues: ['La bande indique la durée et l’heure avant la voix.', 'Aucune transcription ne doit ajouter un nom que l’appel ne donne pas.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-zep-s', text: 'Conserver l’original avec la transcription exacte et sa réserve', scoresEffect: { truth: 15, courage: 10, responsibility: 10 }, narrativeImpact: 'L’original reste avec la transcription. La réserve indique ce que l’appel ne prouve pas, et la pièce peut être confrontée à d’autres.' },
      { id: 'choice-zep-f', text: 'Garder la version la plus courte et effacer la bande', scoresEffect: { denial: 20, truth: -15 }, narrativeImpact: 'La version courte suffit à justifier l’ordre. La bande effacée ne permettra plus de vérifier ni la durée ni l’heure.' },
    ],
    safetyNote: 'Fiction originale. Comparaison de transcriptions fictives ; aucun appel ni aucune contrainte réelle.',
    sourceNote: fidelity('Saw (2004)', 'l’appartement et l’appel qui donne un ordre', 'les trois transcriptions, la durée, l’heure et la réserve'), ...dates,
  },

  {
    id: 'test-s2-death-mask', campaignId: 'camp-saw-ii', characterId: 'canon-john-kramer',
    title: '01 — L’entrée', moralTheme: 'Le témoin qui ne bouge pas',
    openingTape: 'Michael. Tu as regardé sans intervenir. L’entrée de la maison est scellée : une porte chaînée, un téléviseur et un registre d’intake. Le verrou demande la somme des chiffres de la date d’entrée, le 28 octobre 2005. Calcule-la, puis décide ce que tu inscris au registre. La maison n’ouvre pas sur une opinion : elle ouvre sur un compte.',
    rules: 'Calculez la somme des chiffres de la date d’entrée, puis choisissez la mention du registre.',
    puzzleType: 'logic',
    puzzleData: { question: 'La date d’entrée est le 2005-10-28. Quelle est la somme de ses chiffres ?', correctAnswer: '18' },
    clues: ['Additionnez chaque chiffre de l’année, du mois et du jour.', 'Le résultat est un nombre entier, sans unité.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-michael-s', text: 'Inscrire le compte exact et la date au registre', scoresEffect: { truth: 15, responsibility: 10 }, narrativeImpact: 'Le registre porte la date et le compte. Le verrou s’ouvre sur une entrée vérifiable, pas sur une supposition.' },
      { id: 'choice-michael-f', text: 'Forcer le verrou sans reporter le compte', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'La porte cède. Le registre reste vide, et la maison ne garde aucune trace de la date qui l’a ouverte.' },
    ],
    safetyNote: 'Fiction originale. Calcul de somme et lecture d’un registre fictifs ; aucune intrusion réelle.',
    sourceNote: fidelity('Saw II (2005)', 'l’entrée scellée de la maison', 'le registre d’intake, la date et le compte qui ouvre le verrou'), ...dates,
  },
  {
    id: 'test-s2-needle-pit', campaignId: 'camp-saw-ii', characterId: 'canon-amanda-young',
    title: '02 — La réserve', moralTheme: 'Le retour à la salle plutôt qu’aux gens',
    openingTape: 'Amanda. Tu es revenue dans la salle au lieu de revenir vers les autres. La réserve du sous-sol contient trois bacs, un bordereau de stérilisation et une clé de service. Un seul bac réunit la clé et le bordereau signé. Choisis-le, puis décide si le bac reste étiqueté. Une pièce sans bordereau ne prouve rien, même quand elle est au bon endroit.',
    rules: 'Comparez les trois bacs et choisissez celui qui contient la clé et son bordereau, puis décidez de l’étiquetage.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Trois bacs sont proposés. Lequel réunit la clé de service et le bordereau de stérilisation signé ?',
      correctAnswer: 'B-2',
      confessionOptions: [
        { id: 'A-1', text: 'Bac A-1 : instruments vides, étiquette illisible.', truthScore: 10 },
        { id: 'B-2', text: 'Bac B-2 : une clé de service et le bordereau de stérilisation signé.', truthScore: 90 },
        { id: 'C-3', text: 'Bac C-3 : instruments mélangés, sans bordereau.', truthScore: 20 },
      ],
    },
    clues: ['La clé peut être présente sans que le bac soit vérifiable.', 'Le bordereau signé est ce qui distingue les trois bacs.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-needle-s', text: 'Laisser le bac étiqueté avec son bordereau', scoresEffect: { truth: 15, cooperation: 10, responsibility: 10 }, narrativeImpact: 'Le bac reste étiqueté. La clé et le bordereau sont visibles ensemble, et la réserve peut être contrôlée sans fouille.' },
      { id: 'choice-needle-f', text: 'Vider le bac dans le drain et emporter la clé', scoresEffect: { denial: 20, truth: -15 }, narrativeImpact: 'La clé sort de la réserve, le bordereau avec elle. Le bac vide ne dit plus ce qu’il contenait ni qui l’avait vérifié.' },
    ],
    safetyNote: 'Fiction originale. Rapprochement de bacs et d’un bordereau fictifs ; aucune manipulation réelle.',
    sourceNote: fidelity('Saw II (2005)', 'la réserve et la recherche de la clé', 'les trois bacs, la clé de service et le bordereau de stérilisation'), ...dates,
  },
  {
    id: 'test-s2-razor-box', campaignId: 'camp-saw-ii', characterId: 'canon-john-kramer',
    title: '03 — La boîte', moralTheme: 'La main qui va trop vite',
    openingTape: 'Addison. Tu tends la main sans regarder. La salle de bain contient une boîte métallique, huit cellules de trois virgule cinq volts et une étiquette de série. Trouve la tension totale, puis décide si l’étiquette reste sur la boîte. Une boîte ouverte sans lecture ne rend service à personne.',
    rules: 'Calculez la tension totale des cellules en série, puis choisissez la conservation de l’étiquette.',
    puzzleType: 'logic',
    puzzleData: { question: 'La boîte contient huit cellules de 3,5 V montées en série. Quelle est la tension totale, en volts ?', correctAnswer: '28' },
    clues: ['En série, les tensions s’additionnent.', 'Huit fois trois virgule cinq.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-razor-s', text: 'Inscrire la tension et laisser l’étiquette sur la boîte', scoresEffect: { truth: 15, courage: 10 }, narrativeImpact: 'La boîte porte sa tension et son nombre de cellules. La salle suivante peut la contrôler sans l’ouvrir.' },
      { id: 'choice-razor-f', text: 'Forcer le couvercle et retirer l’étiquette', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'Le couvercle cède. La boîte n’a plus d’étiquette, et le calcul ne peut plus être rattaché à la pièce.' },
    ],
    safetyNote: 'Fiction originale. Calcul de tension sur une boîte fictive ; aucun montage ni essai réel.',
    sourceNote: fidelity('Saw II (2005)', 'la boîte métallique et la salle de bain', 'les huit cellules, la tension totale et l’étiquette de série'), ...dates,
  },
  {
    id: 'test-s2-furnace', campaignId: 'camp-saw-ii', characterId: 'canon-john-kramer',
    title: '04 — La chaudière', moralTheme: 'Le verrou posé sur les autres',
    openingTape: 'Obi. Tu as aidé à enfermer les autres sans poser de question. La chaufferie contient une chaudière, un cadran et une courbe de montée. La salle doit passer de quinze à quatre-vingt-cinq degrés ; le groupe monte de cinq degrés toutes les quatre minutes. Calcule le temps, puis décide si la courbe reste affichée. Un verrou n’est pas une preuve.',
    rules: 'Calculez le temps de montée en température, puis choisissez la conservation de la courbe.',
    puzzleType: 'logic',
    puzzleData: { question: 'La chaufferie passe de 15 °C à 85 °C. Le groupe monte de 5 °C toutes les 4 minutes. Combien de minutes faut-il ?', correctAnswer: '56' },
    clues: ['Comptez les paliers de cinq degrés.', 'Quatorze paliers de quatre minutes.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-obi-s', text: 'Inscrire la courbe et laisser le cadran visible', scoresEffect: { truth: 15, responsibility: 10, cooperation: 10 }, narrativeImpact: 'La courbe reste affichée près du cadran. La chaufferie peut être lue par celui qui reprend le service, sans refaire l’essai.' },
      { id: 'choice-obi-f', text: 'Effacer la courbe et fermer la chaufferie', scoresEffect: { denial: 20, cooperation: -15 }, narrativeImpact: 'La porte se ferme sur un cadran remis à zéro. La mesure existe encore, mais plus personne ne peut la retrouver.' },
    ],
    safetyNote: 'Fiction originale. Calcul de montée en température dans une chaufferie fictive ; aucune manœuvre réelle.',
    sourceNote: fidelity('Saw II (2005)', 'la chaufferie', 'le cadran, la courbe et les quatorze paliers'), ...dates,
  },
  {
    id: 'test-s2-shotgun-peephole', campaignId: 'camp-saw-ii', characterId: 'canon-john-kramer',
    title: '05 — Le palier', moralTheme: 'Le regard qui précède la porte',
    openingTape: 'Gus. Tu as regardé avant qu’on te le demande. Le palier compte neuf portes et un plan de service. Le plan condamne la ligne A ainsi que les colonnes 1 et 2. Il ne reste qu’une porte de la ligne C. Trouve-la, puis décide si le plan reste affiché. Une porte ne s’ouvre pas parce qu’on y a collé l’œil.',
    rules: 'Déduisez la seule porte restante de la ligne C, puis choisissez la conservation du plan.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Neuf portes sont numérotées A-1 à C-3. Le plan condamne la ligne A ainsi que les colonnes 1 et 2. Quelle porte de la ligne C reste disponible ?',
      correctAnswer: 'C-3', gridLabel: 'GRILLE DES PORTES :',
    },
    clues: ['La ligne C contient trois portes.', 'Une seule colonne reste après les deux condamnations.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-gus-s', text: 'Ouvrir C-3 et laisser le plan affiché sur le palier', scoresEffect: { truth: 15, courage: 10, cooperation: 10 }, narrativeImpact: 'La porte reste ouverte avec le plan. Le palier devient lisible pour ceux qui montent après toi.' },
      { id: 'choice-gus-f', text: 'Ouvrir C-3 et décrocher le plan', scoresEffect: { denial: 20, cooperation: -10 }, narrativeImpact: 'La porte cède, le plan disparaît. La sortie est trouvée, mais le palier ne l’explique plus.' },
    ],
    safetyNote: 'Fiction originale. Déduction sur un plan de portes fictif ; aucune effraction réelle.',
    sourceNote: fidelity('Saw II (2005)', 'le palier et la porte à œilleton', 'le plan de service, les portes condamnées et la porte C-3'), ...dates,
  },
  {
    id: 'test-s2-gas-house', campaignId: 'camp-saw-ii', characterId: 'canon-john-kramer',
    title: '06 — La maison', moralTheme: 'L’enquête qui laisse le lieu décider',
    openingTape: 'Matthews. Tu as laissé l’enquête choisir à ta place. Le salon est scellé : sept cent vingt mètres cubes, un réseau d’extraction de vingt-quatre mètres cubes par minute et un registre de ventilation. Calcule le temps de renouvellement, puis décide ce que tu inscris. Une maison ne se sauve pas avec une intuition ; elle se lit avec un débit.',
    rules: 'Calculez le temps de renouvellement de l’air, puis choisissez la mention portée au registre.',
    puzzleType: 'logic',
    puzzleData: { question: 'Le salon mesure 720 m³. Le réseau extrait 24 m³ par minute. Combien de minutes faut-il pour renouveler l’air une fois ?', correctAnswer: '30' },
    clues: ['Divisez le volume par le débit.', 'Le résultat s’exprime en minutes, sans unité dans la réponse.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-vent-s', text: 'Inscrire le débit et le temps exacts, registre ouvert', scoresEffect: { truth: 15, responsibility: 10, cooperation: 10 }, narrativeImpact: 'Le registre porte le volume, le débit et le temps. La maison peut être rouverte sur une mesure, pas sur un ordre.' },
      { id: 'choice-vent-f', text: 'Fermer les volets et inscrire « ventilé »', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'Les volets restent clos. La mention suffit à clore le dossier, pas à savoir ce qui a été renouvelé.' },
    ],
    safetyNote: 'Fiction originale. Calcul de renouvellement d’air dans une maison fictive ; aucune intervention réelle.',
    sourceNote: fidelity('Saw II (2005)', 'la maison au gaz', 'le volume du salon, le débit d’extraction et le registre de ventilation'), ...dates,
  },
];
