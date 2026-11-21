import type { SymbolicTest } from '../types';

const recordedAt = '2026-11-21T23:30:00.000Z';
const dates = { createdAt: recordedAt, updatedAt: recordedAt };

/**
 * Second film-by-film migration: Saw III and Saw IV.
 *
 * The twelve one-line English entries become reading rooms. Each keeps the
 * film's documented situation and the subject's fault, and turns the physical
 * test into a reading, a calculation or an arbitration. No gesture, equipment
 * or procedure is described; the fidelity note under each room states it.
 */

const fidelity = (film: string, situation: string, played: string) =>
  `Référence documentaire : ${film}, ${situation}. Lecture jouée : ${played}. Non reproduits : le geste, la blessure, le matériel et la procédure — la salle se lit, elle ne s’exécute pas.`;

export const SAW_THREE_FOUR_TEST_IDS = [
  'test-s3-freezer', 'test-s3-angel', 'test-s3-rack', 'test-s3-classroom', 'test-s3-pig-vat', 'test-s3-shotgun-collar',
  'test-s4-mausoleum', 'test-s4-knife-chair', 'test-s4-hair', 'test-s4-spikes', 'test-s4-bedroom', 'test-s4-ice-blocks',
] as const;

export const SAW_THREE_FOUR_TESTS: SymbolicTest[] = [
  {
    id: 'test-s3-freezer', campaignId: 'camp-saw-iii', characterId: 'canon-john-kramer',
    title: '01 — La chambre froide', moralTheme: 'Le ressentiment qui choisit qui écouter',
    openingTape: 'Jeff. Tu as laissé le ressentiment décider qui méritait ton attention. La chambre froide est la première salle : huit degrés au départ, moins douze à l’arrivée, et un groupe qui retire deux degrés toutes les cinq minutes. Calcule le temps de descente, puis décide ce que tu fais du manteau laissé au crochet. Le froid ne juge pas ; il compte.',
    rules: 'Calculez le temps de descente en température, puis choisissez ce que vous faites du manteau et de la courbe.',
    puzzleType: 'logic',
    puzzleData: { question: 'La chambre doit passer de 8 °C à −12 °C. Le groupe retire 2 °C toutes les 5 minutes. Combien de minutes faut-il ?', correctAnswer: '50' },
    clues: ['Comptez le nombre de paliers de deux degrés.', 'Multipliez ce nombre par cinq minutes.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-danica-s', text: 'Laisser le manteau au crochet et inscrire la courbe exacte', scoresEffect: { truth: 15, empathy: 10, responsibility: 10 }, narrativeImpact: 'Le manteau reste à la disposition de la personne suivante, et la courbe au dossier. La salle peut être lue sans refaire l’essai.' },
      { id: 'choice-danica-f', text: 'Prendre le manteau et retirer la courbe du dossier', scoresEffect: { denial: 20, empathy: -15 }, narrativeImpact: 'Le crochet est vide et le dossier muet. Le froid a été mesuré, mais plus personne ne peut retrouver comment.' },
    ],
    safetyNote: 'Fiction originale. Calcul de descente en température dans une chambre froide fictive ; aucune intervention réelle.',
    sourceNote: fidelity('Saw III (2006)', 'la chambre froide', 'la température, les paliers et le manteau laissé au crochet'), ...dates,
  },
  {
    id: 'test-s3-angel', campaignId: 'camp-saw-iii', characterId: 'canon-john-kramer',
    title: '02 — Le harnais', moralTheme: 'Documenter sans intervenir',
    openingTape: 'Kerry. Tu photographies les lieux sans demander qui est encore vivant. La salle du harnais contient un cadre suspendu, deux arbres et une console. Les index des arbres doivent totaliser quinze pour libérer le cadre. Trouve l’alignement, puis décide si le dégagement reste visible. Une photo prouve ce qu’on a vu ; elle ne remplace pas ce qu’on a fait.',
    rules: 'Faites tourner les deux arbres pour obtenir un total de 15, puis choisissez ce que vous laissez derrière vous.',
    puzzleType: 'maze',
    puzzleData: { question: 'Alignez les deux arbres pour que leurs index totalisent exactement 15 :', correctAnswer: '15' },
    clues: ['L’arbre de gauche ajoute 3 par cran, celui de droite 2.', 'Le cadre ne se libère qu’au total exact.'],
    timerSeconds: 120,
    choices: [
      { id: 'choice-kerry-s', text: 'Libérer le cadre et laisser la combinaison affichée', scoresEffect: { courage: 15, cooperation: 10, truth: 10 }, narrativeImpact: 'Le cadre cède et la combinaison reste lisible. La salle suivante n’aura pas à refaire l’alignement dans le noir.' },
      { id: 'choice-kerry-f', text: 'Libérer le cadre puis remettre la console à zéro', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'La console revient à zéro. Le cadre est libre, mais la salle ne dit plus comment elle l’a été.' },
    ],
    safetyNote: 'Fiction originale. Alignement d’index sur une console fictive ; aucun dispositif ni geste réel.',
    sourceNote: fidelity('Saw III (2006)', 'la salle du harnais suspendu', 'les deux arbres, le total de 15 et la combinaison laissée visible'), ...dates,
  },
  {
    id: 'test-s3-rack', campaignId: 'camp-saw-iii', characterId: 'canon-john-kramer',
    title: '03 — Le chevalet', moralTheme: 'La vengeance qui prend son temps',
    openingTape: 'Jeff. Tu as laissé la vengeance décider du temps que tu accordais aux autres. La salle du chevalet contient un treuil, un réducteur et une plaque de régime. Le treuil doit tourner à quatre-vingt-quatre tours par minute ; le réducteur divise par quatre. Trouve le régime moteur, puis décide si la plaque reste lisible. Un rapport juste ne vaut rien s’il n’est pas transmissible.',
    rules: 'Calculez le régime moteur demandé par le treuil, puis choisissez la mention portée à la plaque.',
    puzzleType: 'logic',
    puzzleData: { question: 'Le treuil doit tourner à 84 tr/min. Le réducteur divise le régime par 4. Quel régime moteur faut-il ?', correctAnswer: '336' },
    clues: ['Le réducteur divise : le moteur tourne plus vite que le treuil.', 'Multipliez le régime du treuil par quatre.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-rack-s', text: 'Inscrire le régime exact et laisser la plaque en place', scoresEffect: { truth: 15, responsibility: 10, cooperation: 10 }, narrativeImpact: 'La plaque porte le régime moteur et le rapport du réducteur. La salle devient vérifiable pour celui qui prend le service.' },
      { id: 'choice-rack-f', text: 'Retirer la plaque et retenir le chiffre', scoresEffect: { denial: 20, cooperation: -10 }, narrativeImpact: 'Le treuil tourne, la plaque est vide. Le réglage dépend d’une mémoire qui ne laisse aucune trace.' },
    ],
    safetyNote: 'Fiction originale. Calcul de transmission dans une salle de treuil fictive ; aucune manipulation de machine.',
    sourceNote: fidelity('Saw III (2006)', 'le chevalet et son treuil', 'le régime du treuil, le rapport du réducteur et la plaque'), ...dates,
  },
  {
    id: 'test-s3-classroom', campaignId: 'camp-saw-iii', characterId: 'canon-john-kramer',
    title: '04 — La salle de classe', moralTheme: 'L’évitement qui laisse les autres payer',
    openingTape: 'Troy. Tu as passé ta vie à éviter les conséquences en laissant les autres les porter. La salle de classe compte neuf luminaires de trente-six watts, allumés quatre heures, et un compteur divisionnaire. Calcule l’énergie consommée, puis décide ce que tu inscris au registre. Une salle vide continue de consommer ; c’est peut-être la seule chose qu’elle fait sans témoin.',
    rules: 'Calculez l’énergie consommée par les neuf luminaires, puis choisissez la mention du registre.',
    puzzleType: 'logic',
    puzzleData: { question: 'Neuf luminaires de 36 W restent allumés pendant 4 heures. Quelle énergie consomment-ils, en wattheures ?', correctAnswer: '1296' },
    clues: ['Multipliez la puissance d’un luminaire par leur nombre.', 'Multipliez ensuite par la durée en heures.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-troy-s', text: 'Inscrire l’énergie exacte et laisser le compteur visible', scoresEffect: { truth: 15, responsibility: 10 }, narrativeImpact: 'Le registre porte la puissance, la durée et le total. La salle peut être contrôlée sans rallumer les luminaires.' },
      { id: 'choice-troy-f', text: 'Signer « conforme » sans relever le compteur', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'La salle est déclarée conforme. Le compteur reste tourné vers le mur, et la mention ne dit plus ce qui a été mesuré.' },
    ],
    safetyNote: 'Fiction originale. Calcul de consommation électrique dans une salle fictive ; aucun branchement réel.',
    sourceNote: fidelity('Saw III (2006)', 'la salle de classe', 'les neuf luminaires, la durée et le compteur divisionnaire'), ...dates,
  },
  {
    id: 'test-s3-pig-vat', campaignId: 'camp-saw-iii', characterId: 'canon-john-kramer',
    title: '05 — La cuve', moralTheme: 'La sentence prononcée sans le dossier',
    openingTape: 'Halden. Tu as prononcé une peine légère sans lire ce que le dossier contenait encore. La salle des cuves compte neuf emplacements et un registre de service. Le registre condamne la ligne A ainsi que les colonnes 1 et 2. Il ne reste qu’une cuve de la ligne B. Trouve-la, puis décide si le registre reste affiché. Une peine n’est pas une lecture.',
    rules: 'Déduisez la seule cuve restante de la ligne B, puis choisissez la conservation du registre.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Neuf cuves sont numérotées A-1 à C-3. Le registre condamne la ligne A ainsi que les colonnes 1 et 2. Quelle cuve de la ligne B reste disponible ?',
      correctAnswer: 'B-3', gridLabel: 'GRILLE DES CUVES :',
    },
    clues: ['La ligne B contient trois cuves.', 'Deux colonnes sont condamnées : une seule reste.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-halden-s', text: 'Ouvrir B-3 et laisser le registre affiché près de la cuve', scoresEffect: { truth: 15, courage: 10, responsibility: 10 }, narrativeImpact: 'La cuve reste ouverte avec le registre. La prochaine équipe peut refaire la déduction sans tâtonner.' },
      { id: 'choice-halden-f', text: 'Ouvrir B-3 et refermer le registre', scoresEffect: { denial: 20, responsibility: -10 }, narrativeImpact: 'La cuve cède, le registre se referme. L’emplacement existe, mais plus personne ne peut dater la décision.' },
    ],
    safetyNote: 'Fiction originale. Déduction sur un plan de cuves fictif ; aucune manipulation réelle.',
    sourceNote: fidelity('Saw III (2006)', 'la salle des cuves', 'le registre de service, les emplacements condamnés et la cuve B-3'), ...dates,
  },
  {
    id: 'test-s3-shotgun-collar', campaignId: 'camp-saw-iii', characterId: 'canon-john-kramer',
    title: '06 — Le bureau', moralTheme: 'Maintenir en vie sans demander pourquoi',
    openingTape: 'Lynn. Tu as maintenu un patient en vie sans demander ce qu’il faisait de cette vie. Le bureau contient un moniteur, trois relevés et une bande d’alarme. Une seule version rend l’heure d’arrêt, l’heure de l’alarme et l’état du verrou. Choisis-la, puis décide ce que tu archives. Un relevé incomplet ne protège personne, pas même celle qui l’a écrit.',
    rules: 'Comparez les trois relevés et choisissez celui qui rend exactement l’arrêt, l’alarme et le verrou, puis décidez de l’archivage.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Trois relevés sont proposés. Lequel rend exactement l’heure d’arrêt, l’heure de l’alarme et l’état du verrou ?',
      correctAnswer: 'B-2',
      confessionOptions: [
        { id: 'A-1', text: 'Le moniteur s’est arrêté à 21 h 04, sans alarme.', truthScore: 10 },
        { id: 'B-2', text: 'Le moniteur s’est arrêté à 21 h 04 ; l’alarme a retenti à 21 h 06 ; le verrou est resté fermé.', truthScore: 90 },
        { id: 'C-3', text: 'Le moniteur a été coupé manuellement à 21 h 10.', truthScore: 20 },
      ],
    },
    clues: ['La bande donne l’heure d’arrêt avant l’alarme.', 'L’état du verrou ne se déduit pas de l’alarme : il doit être relevé.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-collar-d-s', text: 'Archiver le relevé exact avec sa réserve', scoresEffect: { truth: 15, courage: 10, responsibility: 10 }, narrativeImpact: 'Le relevé complet reste au dossier avec sa réserve. L’arrêt, l’alarme et le verrou peuvent être confrontés sans reconstituer la nuit.' },
      { id: 'choice-collar-d-f', text: 'Garder la version la plus courte et retirer la réserve', scoresEffect: { denial: 20, truth: -15 }, narrativeImpact: 'La version courte suffit à clore le bureau. Le verrou et l’alarme disparaissent du dossier, et la nuit ne s’explique plus.' },
    ],
    safetyNote: 'Fiction originale. Comparaison de relevés de moniteur fictifs ; aucun soin ni appareil réel.',
    sourceNote: fidelity('Saw III (2006)', 'le bureau et le moniteur de la dernière salle', 'les trois relevés, l’heure d’arrêt, l’alarme et l’état du verrou'), ...dates,
  },

  {
    id: 'test-s4-mausoleum', campaignId: 'camp-saw-iv', characterId: 'canon-john-kramer',
    title: '01 — Le mausolée', moralTheme: 'La force avant la vérification',
    openingTape: 'Art. Tu es entré en forçant avant de vérifier ce que tu avais devant toi. Le mausolée compte neuf plaques et un registre de sépulture. Le registre condamne la ligne A ainsi que les colonnes 1 et 3. Il ne reste qu’une plaque de la ligne B. Trouve-la, puis décide si le registre reste ouvert. Une plaque lue vaut mieux qu’une porte forcée.',
    rules: 'Déduisez la seule plaque restante de la ligne B, puis choisissez la conservation du registre.',
    puzzleType: 'choice',
    puzzleData: {
      question: 'Neuf plaques sont numérotées A-1 à C-3. Le registre condamne la ligne A ainsi que les colonnes 1 et 3. Quelle plaque de la ligne B reste disponible ?',
      correctAnswer: 'B-2', gridLabel: 'GRILLE DES PLAQUES :',
    },
    clues: ['La ligne B contient trois plaques.', 'Une seule colonne reste après les deux condamnations.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-maus-s', text: 'Lire B-2 et laisser le registre ouvert entre les plaques', scoresEffect: { truth: 15, cooperation: 10, responsibility: 10 }, narrativeImpact: 'La plaque reste lisible avec le registre. Les deux noms peuvent être rapprochés sans déplacer la pierre.' },
      { id: 'choice-maus-f', text: 'Ne relever que la plaque qui arrange la démarche', scoresEffect: { denial: 20, truth: -10 }, narrativeImpact: 'Une plaque reste dans l’ombre. Le registre porte un emplacement juste, mais la salle ne dit plus ce qu’elle conservait.' },
    ],
    safetyNote: 'Fiction originale. Lecture d’un registre de sépulture fictif ; aucune exhumation ni intervention réelle.',
    sourceNote: fidelity('Saw IV (2007)', 'le mausolée', 'les plaques, le registre et la plaque B-2'), ...dates,
  },
  {
    id: 'test-s4-knife-chair', campaignId: 'camp-saw-iv', characterId: 'canon-john-kramer',
    title: '02 — L’atelier', moralTheme: 'La douleur infligée sans mesure',
    openingTape: 'Cecil. Tu as causé une perte que tu n’as jamais mesurée. L’atelier contient un levier, un plateau et une plaque de couple. Le levier mesure un mètre cinquante ; la force appliquée est de quatre-vingts newtons. Calcule le couple, puis décide si la plaque reste lisible. Une mesure ne répare rien, mais elle empêche de recommencer sans savoir.',
    rules: 'Calculez le couple appliqué, puis choisissez la mention portée à la plaque.',
    puzzleType: 'logic',
    puzzleData: { question: 'Le levier mesure 1,5 m et la force appliquée est de 80 N. Quel couple obtient-on, en N·m ?', correctAnswer: '120' },
    clues: ['Le couple est le produit de la force par la longueur du levier.', 'Quatre-vingts fois un virgule cinq.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-cecil-s', text: 'Inscrire le couple exact et la limite du plateau', scoresEffect: { truth: 15, responsibility: 10 }, narrativeImpact: 'La plaque porte le couple et la limite. L’atelier devient vérifiable, et la mesure survit à celui qui l’a demandée.' },
      { id: 'choice-cecil-f', text: 'Forcer le plateau sans inscrire la mesure', scoresEffect: { denial: 20, responsibility: -10 }, narrativeImpact: 'Le plateau cède. La plaque reste vide, et l’atelier ne garde aucune trace de la force qu’il a reçue.' },
    ],
    safetyNote: 'Fiction originale. Calcul de couple dans un atelier fictif ; aucune manipulation d’outil ou de machine.',
    sourceNote: fidelity('Saw IV (2007)', 'l’atelier et le siège', 'le levier, la force, le couple et la plaque de limite'), ...dates,
  },
  {
    id: 'test-s4-hair', campaignId: 'camp-saw-iv', characterId: 'canon-john-kramer',
    title: '03 — La chambre', moralTheme: 'L’exploitation qui se présente comme un service',
    openingTape: 'Brenda. Tu as exploité des personnes en appelant cela une protection. La chambre contient un treuil, une poulie et un compteur de câble. Le treuil enroule deux mètres par minute ; il reste dix-huit mètres. Calcule le temps, puis décide si le compteur reste visible. Un service rendu sans mesure ressemble vite à une dette.',
    rules: 'Calculez le temps d’enroulement, puis choisissez la conservation du compteur.',
    puzzleType: 'logic',
    puzzleData: { question: 'Le treuil enroule 2 m de câble par minute. Il reste 18 m. Combien de minutes faut-il ?', correctAnswer: '9' },
    clues: ['Divisez la longueur restante par la vitesse d’enroulement.', 'Le résultat s’exprime en minutes, sans unité dans la réponse.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-hair-s', text: 'Laisser le compteur visible avec la longueur et le temps', scoresEffect: { truth: 15, empathy: 10 }, narrativeImpact: 'Le compteur reste lisible. La chambre peut être reprise sans remettre le treuil en tension pour comprendre.' },
      { id: 'choice-hair-f', text: 'Couper le câble et effacer le compteur', scoresEffect: { denial: 20, empathy: -10 }, narrativeImpact: 'Le câble tombe, le compteur revient à zéro. La chambre est libre, mais plus personne ne sait ce qu’elle retenait.' },
    ],
    safetyNote: 'Fiction originale. Calcul d’enroulement dans une chambre fictive ; aucun geste ni appareil réel.',
    sourceNote: fidelity('Saw IV (2007)', 'la chambre et le treuil', 'le compteur de câble, la longueur restante et le temps'), ...dates,
  },
  {
    id: 'test-s4-spikes', campaignId: 'camp-saw-iv', characterId: 'canon-john-kramer',
    title: '04 — La chambre d’hôtel', moralTheme: 'Le récit qui protège celui qui parle',
    openingTape: 'Morgan. Tu as raconté la nuit de manière à ce que personne ne puisse te contredire. La chambre d’hôtel contient un standard, trois comptes rendus et un registre de porte. Un seul récit donne l’heure de l’appel, l’état de la porte et la provenance de l’heure. Choisis-le, puis décide ce que tu en fais. Un récit vérifiable n’est pas un récit arrangeant.',
    rules: 'Comparez les trois comptes rendus et choisissez celui qui donne l’heure, la porte et la provenance, puis décidez de sa conservation.',
    puzzleType: 'confession',
    puzzleData: {
      question: 'Trois comptes rendus sont proposés. Lequel donne exactement l’heure de l’appel, l’état de la porte et la provenance de l’heure ?',
      correctAnswer: 'C-3',
      confessionOptions: [
        { id: 'A-1', text: 'La porte était ouverte ; personne n’a appelé.', truthScore: 10 },
        { id: 'B-2', text: 'La porte était fermée ; un appel a été passé à 23 h 10, sans nom.', truthScore: 20 },
        { id: 'C-3', text: 'La porte était fermée de l’intérieur ; un appel a été passé à 23 h 10 ; l’heure vient du standard.', truthScore: 90 },
      ],
    },
    clues: ['L’état de la porte figure au registre, pas dans le récit.', 'L’heure du standard est une provenance : elle doit être nommée.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-spike-s', text: 'Conserver le compte rendu exact avec sa provenance', scoresEffect: { truth: 15, courage: 10, responsibility: 10 }, narrativeImpact: 'Le compte rendu reste avec le registre de porte et la source de l’heure. La nuit peut être vérifiée sans dépendre d’une seule parole.' },
      { id: 'choice-spike-f', text: 'Garder le récit le plus court et retirer la provenance', scoresEffect: { denial: 20, truth: -15 }, narrativeImpact: 'Le récit court suffit à clore la chambre. La porte et l’heure ne peuvent plus être confrontées à rien.' },
    ],
    safetyNote: 'Fiction originale. Comparaison de comptes rendus fictifs ; aucun fait ni personne réelle.',
    sourceNote: fidelity('Saw IV (2007)', 'la chambre d’hôtel', 'les trois comptes rendus, le registre de porte et la provenance de l’heure'), ...dates,
  },
  {
    id: 'test-s4-bedroom', campaignId: 'camp-saw-iv', characterId: 'canon-john-kramer',
    title: '05 — La chambre filmée', moralTheme: 'L’image prise sans le consentement',
    openingTape: 'Ivan. Tu as filmé des personnes sans leur accord et tu as appelé cela un travail. La chambre contient un projecteur, une bobine et une étiquette de provenance. Le projecteur tourne à vingt-quatre images par seconde ; la bobine dure onze minutes. Calcule le nombre d’images, puis décide si l’étiquette reste sur la bobine. Une image sans provenance ne prouve rien, même quand elle montre tout.',
    rules: 'Calculez le nombre d’images de la bobine, puis choisissez la conservation de l’étiquette.',
    puzzleType: 'logic',
    puzzleData: { question: 'Le projecteur tourne à 24 images par seconde. La bobine dure 11 minutes. Combien d’images contient-elle ?', correctAnswer: '15840' },
    clues: ['Convertissez les minutes en secondes.', 'Multipliez par vingt-quatre images par seconde.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-ivan-s', text: 'Inscrire la durée et la provenance sur l’étiquette, bobine conservée', scoresEffect: { truth: 15, responsibility: 10, empathy: 10 }, narrativeImpact: 'La bobine porte sa durée et sa provenance. Ce qu’elle montre peut être contesté, et ce qu’elle ne montre pas reste visible.' },
      { id: 'choice-ivan-f', text: 'Effacer l’étiquette et garder la bobine sans mention', scoresEffect: { denial: 20, truth: -15 }, narrativeImpact: 'La bobine tourne encore, mais sans durée ni origine. L’image devient une preuve impossible à situer.' },
    ],
    safetyNote: 'Fiction originale. Calcul de durée d’une bobine fictive ; aucune diffusion ni prise de vue réelle.',
    sourceNote: fidelity('Saw IV (2007)', 'la chambre filmée', 'le projecteur, la bobine, la durée et l’étiquette de provenance'), ...dates,
  },
  {
    id: 'test-s4-ice-blocks', campaignId: 'camp-saw-iv', characterId: 'canon-john-kramer',
    title: '06 — La plateforme', moralTheme: 'L’obsession qui ne vérifie pas la charge',
    openingTape: 'Matthews. Tu as laissé l’obsession de l’enquête décider de ce que tu pouvais encore porter. La plateforme supporte quatre cents kilos ; quatre blocs de quatre-vingt-cinq kilos y sont posés. Calcule ce qui reste disponible, puis décide si la charge est inscrite. Une plateforme ne cède pas par conviction : elle cède par excès.',
    rules: 'Calculez la charge restante sur la plateforme, puis choisissez la mention portée au registre.',
    puzzleType: 'logic',
    puzzleData: { question: 'La plateforme supporte 400 kg. Quatre blocs de 85 kg y sont posés. Combien de kilos reste-t-il disponibles ?', correctAnswer: '60' },
    clues: ['Calculez d’abord la masse des quatre blocs.', 'Retirez-la de la charge maximale.'],
    timerSeconds: 150,
    choices: [
      { id: 'choice-ice-s', text: 'Inscrire la charge et laisser la plateforme lisible', scoresEffect: { truth: 15, responsibility: 10, courage: 10 }, narrativeImpact: 'Le registre porte la charge et la marge. La plateforme peut être reprise sans refaire l’essai, et l’excès devient visible avant d’arriver.' },
      { id: 'choice-ice-f', text: 'Surcharger sans inscrire la marge', scoresEffect: { denial: 20, responsibility: -15 }, narrativeImpact: 'La plateforme tient encore, mais le registre ne dit plus à quelle limite. La marge disparaît avec la mention.' },
    ],
    safetyNote: 'Fiction originale. Calcul de charge sur une plateforme fictive ; aucune manœuvre ni essai réel.',
    sourceNote: fidelity('Saw IV (2007)', 'la plateforme et les blocs', 'la charge maximale, la masse posée et la marge restante'), ...dates,
  },
];
