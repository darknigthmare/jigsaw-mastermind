import { useId, useState } from 'react';
import { ArrowDown, Check, Eye, FileText, MapPin, ScanSearch } from 'lucide-react';
import type { Campaign, SymbolicTest } from '../../types';
import { TheatreWorkspace } from './TheatreWorkspace';
import { getTheatreWorkspaceFamily } from './theatreWorkspaceData';
import './TheatreScene.css';

interface InspectionZone {
  id: string;
  label: string;
  position: [number, number];
  description: string;
}

interface OriginalScene {
  locale?: 'fr';
  room: string;
  image: string;
  imageDescription: string;
  object: string;
  atmosphere: string;
  zones: InspectionZone[];
}

// These are original scene illustrations. Match the active test, since the
// three rooms belong to the same campaign and can be reordered by the author.
const originalScenes: Record<string, OriginalScene> = {
  'test-dernier-relais-archive': {
    locale: 'fr', room: 'Le bureau des archives', image: '/theatre/dernier-relais-archive.webp',
    imageDescription: 'Bureau d’archives original au crépuscule : agenda ouvert au centre, poste d’écoute à gauche, boîte de passation et dossiers à droite.',
    object: 'Le calendrier de passation',
    atmosphere: 'Au fond du couloir vitré, Noé retrouve le dernier registre du centre des Aulnes. La lumière du soir baisse ; l’atelier d’Inès se trouve sur le chemin du retour.',
    zones: [
      { id: 'calendrier', label: 'Calendrier', position: [51, 65], description: 'L’agenda accompagne le bordereau. Les indications utiles sont réunies dans la question de la console ; aucune date cachée dans l’illustration n’est nécessaire.' },
      { id: 'ecoute', label: 'Poste d’écoute', position: [12, 44], description: 'Inès explique ce qui doit quitter les archives avant le dernier départ. La cassette reste disponible dans les commandes audio.' },
      { id: 'boite', label: 'Boîte de passation', position: [74, 59], description: 'La boîte attend le bordereau et ses réserves. Elle rejoindra la caisse de l’équipe au comptoir de restitution.' },
      { id: 'dossiers', label: 'Dossiers du centre', position: [88, 39], description: 'Les anciens relevés restent classés ici. La clôture ne doit pas effacer les décisions et les vérifications de l’équipe.' },
    ],
  },
  'test-dernier-relais-atelier': {
    locale: 'fr', room: 'L’atelier du couloir vitré', image: '/theatre/dernier-relais-atelier.webp',
    imageDescription: 'Atelier original du centre : neuf casiers au mur, radio sur un établi et armoire de rangement à droite, fenêtres donnant sur la station au crépuscule.',
    object: 'L’inventaire de la caisse',
    atmosphere: 'Première porte à droite en sortant des archives. Inès rapproche la liste des objets attendus. Une fois la caisse vérifiée, le couloir ramène à la salle de contrôle.',
    zones: [
      { id: 'casiers', label: 'Neuf casiers', position: [51, 30], description: 'La console associe chaque coordonnée à son inventaire. Il faut réunir les deux objets demandés, pas simplement reconnaître l’un d’entre eux.' },
      { id: 'radio', label: 'Radio d’équipe', position: [26, 52], description: 'La radio fait partie des objets usuels à restituer. Il n’est demandé ni de la régler ni de la remettre en service.' },
      { id: 'armoire', label: 'Armoire de rangement', position: [89, 41], description: 'L’armoire conserve les fournitures qui ne sont pas incluses dans la caisse recherchée. Les observations décisives sont inscrites dans l’inventaire de la console.' },
      { id: 'etabli', label: 'Établi de vérification', position: [54, 58], description: 'Le bordereau des archives et la caisse peuvent être rapprochés ici. Inès demande que sa vérification reste attachée à l’envoi.' },
    ],
  },
  'test-dernier-relais-restitution': {
    locale: 'fr', room: 'Le comptoir de restitution', image: '/theatre/dernier-relais-restitution.webp',
    imageDescription: 'Comptoir original dans la salle de contrôle : deux bacs vides, radio à gauche, dossiers et étagère à droite, vitres sombres derrière la table.',
    object: 'Le dernier solde',
    atmosphere: 'Le couloir rejoint la salle de contrôle. Samir a préparé le comptoir : les dossiers et les objets sont prêts, mais la somme qui reste doit encore être calculée puis attribuée.',
    zones: [
      { id: 'bacs', label: 'Bacs de restitution', position: [52, 52], description: 'Les deux bacs matérialisent la remise des dossiers et des objets. Le calcul du solde et son arbitrage se font dans la console, sans opération réelle.' },
      { id: 'radio', label: 'Message de l’équipe', position: [16, 52], description: 'La dernière cassette rappelle les frais engagés et les trois équipes concernées. Le départ approche ; l’écoute reste disponible.' },
      { id: 'dossier', label: 'Dossier à signer', position: [78, 59], description: 'Le registre réunit la passation des archives, la vérification d’Inès et l’attribution finale. Une signature ne remplace pas le choix de sa répartition.' },
      { id: 'etagere', label: 'Pièces conservées', position: [91, 44], description: 'Les pièces utiles à la reprise sont mises à part. Le centre fermera, mais celles et ceux qui suivent doivent pouvoir comprendre le dernier service.' },
    ],
  },
  'test-une-minuit-tirage': {
    locale: 'fr', room: 'L’atelier de composition', image: '/theatre/une-de-minuit-composition.jpg',
    imageDescription: 'Atelier de composition original, la nuit : bâches plastique tendues sous les conduits, marionnette de bois sans visage assise au marbre, casiers de plomb, épreuves punaisées et lampe de laiton dans une salle verdie par l’humidité.',
    object: 'Le bon de tirage',
    atmosphere: 'Les portes sont verrouillées depuis vingt-trois heures. Une bâche plastique couvre le fond de l’atelier ; la lampe de laiton éclaire le bon de tirage et la marionnette de bois, immobile au bout du marbre.',
    zones: [
      { id: 'marbre', label: 'Le marbre', position: [55, 65], description: 'Le bon de tirage repose près de la composition du 8 mars. La console reprend la question du calendrier ; le marbre ne cache aucune date.' },
      { id: 'silhouette', label: 'Marionnette de bois', position: [30, 55], description: 'Une marionnette de bois sans visage est assise au bout du marbre. Elle ne parle pas ; la cassette, si. Elle ne valide aucune réponse.' },
      { id: 'epreuves', label: 'Épreuves punaisées', position: [65, 30], description: 'Les épreuves de l’édition publiée gardent la trace des coupes sous le plastique. La correction se saisit dans la console de l’étape.' },
      { id: 'lampe', label: 'Lampe de l’atelier', position: [78, 35], description: 'La lampe de laiton éclaire la dernière composition. Les conduits et les câbles disparaissent dans le noir au-dessus d’elle.' },
    ],
  },
  'test-une-minuit-envoi': {
    locale: 'fr', room: 'La salle de la rotative', image: '/theatre/une-de-minuit-rotative.jpg',
    imageDescription: 'Salle des presses originale : rotative rouillée sous deux horloges suspendues, bâches plastique, cartons empilés, registre ouvert sur une table métallique, lumière verte d’urgence et sol détrempé.',
    object: 'Le registre d’envoi',
    atmosphere: 'La rotative tourne au ralenti sous les horloges du chronomètre. Les cartons revenus du dépôt attendent près du registre ; l’écart entre le tirage et la mention publiée est déjà inscrit.',
    zones: [
      { id: 'rotative', label: 'La rotative', position: [32, 52], description: 'La machine a sorti douze cartons de quarante exemplaires. Elle ne décide pas de la mention portée au dossier.' },
      { id: 'cartons', label: 'Cartons et retours', position: [80, 55], description: 'Trois cartons de vingt-cinq exemplaires sont revenus du dépôt. Les retours se retirent du tirage ; ils ne s’ajoutent pas.' },
      { id: 'registre', label: 'Registre d’envoi', position: [72, 66], description: 'Le registre rapproche le tirage, les retours et le chiffre de l’édition. C’est la pièce que la console demande de vérifier.' },
      { id: 'chronometre', label: 'Chronomètre suspendu', position: [40, 15], description: 'Deux horloges comptent au-dessus de la presse. Le temps de la lecture est déjà retiré ; la console reste la seule à valider une réponse.' },
    ],
  },
  'test-une-minuit-une': {
    locale: 'fr', room: 'Le bureau de la une', image: '/theatre/une-de-minuit-bureau.jpg',
    imageDescription: 'Bureau de la une original transformé en salle de contrôle : une de punaisée sous plastique, deux moniteurs montrant la rotative, compteur rouge, magnétophone, ampoule nue, horloge et volets rouillés.',
    object: 'La dernière une',
    atmosphere: 'Une ampoule nue pend au-dessus des moniteurs. Les écrans montrent la rotative ; le magnétophone tourne encore et l’horloge murale s’est arrêtée à sept heures sept. Le chevalet attend la correction.',
    zones: [
      { id: 'chevalet', label: 'La une punaisée', position: [28, 30], description: 'La dernière une est punaisée sous un film plastique. Rien n’est encore composé pour la correction ; la console demande d’abord le temps nécessaire avant le départ.' },
      { id: 'moniteur', label: 'Moniteurs du test', position: [58, 60], description: 'Les écrans montrent la rotative et l’atelier. Ils ne cachent aucune réponse : la décision se prend dans la console.' },
      { id: 'magnetophone', label: 'Magnétophone', position: [10, 73], description: 'La cassette tourne encore. Sa voix a donné l’heure du départ et la règle ; elle ne répétera pas ce que tu choisis.' },
      { id: 'horloge', label: 'Horloge arrêtée', position: [76, 22], description: 'L’horloge s’est arrêtée à sept heures sept. Le bouclage se règle sur le compteur des moniteurs : le véhicule part à zéro heure quarante.' },
    ],
  },
  'test-roster-01-bain': {
    locale: 'fr', room: 'La salle carrelée', image: '/theatre/roster-01-bain.jpg',
    imageDescription: 'Salle carrelée originale du dépôt : dalle centrale, grille de neuf carreaux, chaîne fixée à un tuyau, registre d’entretien détrempé et néon unique.',
    object: 'Le registre d’entretien',
    atmosphere: 'L’eau stagne entre les carreaux. Le registre est ouvert près du drain ; une seule dalle porte la trace d’un joint refait après la fermeture.',
    zones: [
      { id: 'registre', label: 'Registre d’entretien', position: [22, 72], description: 'Le registre ne mentionne qu’une dalle rouverte après la fermeture : ligne C, colonne 2. La grille de la console reprend les neuf coordonnées.' },
      { id: 'dalle', label: 'Dalle centrale', position: [52, 82], description: 'La dalle est légèrement plus claire que les autres. Le registre seul permet de la nommer ; l’illustration ne cache aucune réponse.' },
      { id: 'chaine', label: 'Chaîne au tuyau', position: [82, 52], description: 'La chaîne est fixée au tuyau, pas à une personne. Elle rappelle que la salle a été fermée avant l’arrivée du dépôt.' },
      { id: 'neon', label: 'Néon de service', position: [50, 12], description: 'Le néon grésille au-dessus de la grille. La lumière ne change pas la lecture du registre.' },
    ],
  },
  'test-roster-02-maison': {
    locale: 'fr', room: 'La maison scellée', image: '/theatre/roster-02-maison.jpg',
    imageDescription: 'Pièce scellée originale : grilles de ventilation, volets métalliques, plan punaisé, chaises renversées et lampe d’urgence rouge.',
    object: 'Le plan de ventilation',
    atmosphere: 'L’air reste immobile. Le plan punaisé donne le volume de la pièce et le débit du réseau ; les volets sont clos depuis la fermeture.',
    zones: [
      { id: 'plan', label: 'Plan de ventilation', position: [30, 30], description: 'Le plan indique 540 m³ et un réseau de 30 m³ par minute. La console reprend ces deux valeurs pour le calcul.' },
      { id: 'grille', label: 'Grille d’extraction', position: [58, 40], description: 'La grille est propre, mais aucune étiquette d’essai ne l’accompagne. C’est précisément ce que le registre doit rendre visible.' },
      { id: 'volet', label: 'Volets clos', position: [80, 55], description: 'Les volets sont fermés depuis la condamnation. Ils ne s’ouvrent pas dans cette salle : la décision se prend au registre.' },
      { id: 'lampe', label: 'Lampe d’urgence', position: [15, 20], description: 'La lampe rouge signale que l’alimentation de service a été coupée. Elle n’éclaire aucune commande.' },
    ],
  },
  'test-roster-03-congelateur': {
    locale: 'fr', room: 'La chambre froide', image: '/theatre/roster-03-congelateur.jpg',
    imageDescription: 'Chambre froide originale : parois givrées, porte isolée avec thermomètre à cadran, manteaux suspendus, caisses et lumière bleu-vert.',
    object: 'Le thermomètre de porte',
    atmosphere: 'Le givre couvre les parois. Le thermomètre affiche encore douze degrés ; le groupe doit descendre à moins trois, un degré toutes les trois minutes.',
    zones: [
      { id: 'thermometre', label: 'Thermomètre', position: [52, 34], description: 'Le cadran donne la température de départ et la consigne. La durée se calcule dans la console, pas sur le cadran.' },
      { id: 'manteau', label: 'Manteau au crochet', position: [25, 45], description: 'Un manteau de travail est resté au crochet. Le prendre ou le laisser est un choix de la salle, pas une condition de l’énigme.' },
      { id: 'caisse', label: 'Caisses de réserve', position: [78, 65], description: 'Les caisses sont inventoriées sur une feuille de comptage. Elles ne contiennent aucun objet utile à la sortie.' },
      { id: 'porte', label: 'Porte isolée', position: [58, 70], description: 'La porte se ferme de l’extérieur. La salle se lit comme une chambre froide de service, jamais comme une installation à reproduire.' },
    ],
  },
  'test-roster-04-mausolee': {
    locale: 'fr', room: 'Le mausolée', image: '/theatre/roster-04-mausolee.jpg',
    imageDescription: 'Mausolée original : plaques scellées, chaînes suspendues, banc de pierre, lampe de laiton, cierges et poussière dans le faisceau.',
    object: 'Le registre funéraire',
    atmosphere: 'La pierre garde le froid. Deux plaques se font face ; le registre ouvert sur le banc porte la date du dernier lundi de février 2031.',
    zones: [
      { id: 'plaques', label: 'Plaques scellées', position: [30, 35], description: 'Deux noms, deux dates, une même allée. Le registre permet de les rapprocher sans déplacer aucune pierre.' },
      { id: 'registre', label: 'Registre funéraire', position: [55, 68], description: 'Le registre donne le mois et le jour cherchés. La date se saisit dans la console ; le banc ne porte aucune inscription cachée.' },
      { id: 'chaines', label: 'Chaînes suspendues', position: [72, 25], description: 'Les chaînes retiennent les plaques, pas des personnes. Elles font partie du décor et ne demandent aucune manœuvre.' },
      { id: 'lampe', label: 'Lampe de laiton', position: [22, 72], description: 'La lampe éclaire le registre sans atteindre les noms du fond. La provenance se lit au dossier, pas dans l’ombre.' },
    ],
  },
  'test-roster-05-cube': {
    locale: 'fr', room: 'La chambre des pompes', image: '/theatre/roster-05-cube.jpg',
    imageDescription: 'Salle des pompes originale : cube de verre à paroi d’eau, tuyaux corrodés, vannes, échelle et lumière verte sous l’eau.',
    object: 'Le compteur du cube',
    atmosphere: 'L’eau monte derrière le verre. Le compteur indique mille quatre-vingts litres ; la pompe débite quinze litres par minute.',
    zones: [
      { id: 'cube', label: 'Cube de verre', position: [50, 45], description: 'Le cube est un réservoir de lecture. Le volume et le débit sont affichés ; le débordement se calcule sans toucher aux vannes.' },
      { id: 'pompe', label: 'Pompe d’alimentation', position: [22, 65], description: 'La pompe porte une plaque de débit. Elle n’est pas à manœuvrer : la console demande seulement le temps de remplissage.' },
      { id: 'drain', label: 'Drain de fond', position: [70, 78], description: 'Le drain est ouvert ou fermé par le choix de fin, pas par l’énigme. Il décide de ce que la salle laisse à la personne suivante.' },
      { id: 'echelle', label: 'Échelle de service', position: [82, 40], description: 'L’échelle rejoint la passerelle. Elle sert au décor et à la maintenance, jamais à reproduire une installation réelle.' },
    ],
  },
  'test-roster-06-manege': {
    locale: 'fr', room: 'Le manège', image: '/theatre/roster-06-manege.jpg',
    imageDescription: 'Manège original : plateforme tournante, six chaises boulonnées, plaques numérotées, projecteur à cage et câbles au sol.',
    object: 'Le registre de sélection',
    atmosphere: 'La plateforme tourne au ralenti. Six chaises numérotées passent devant le garde-corps ; le registre de sélection est posé à hauteur de main.',
    zones: [
      { id: 'plateforme', label: 'Plateforme', position: [50, 60], description: 'La plateforme tourne sans s’arrêter. Elle rend visible l’attribution des places, sans jamais désigner elle-même un occupant.' },
      { id: 'sieges', label: 'Six sièges', position: [38, 45], description: 'Les sièges sont numérotés de A-1 à C-3. La grille de la console reprend ces coordonnées et les éliminations du registre.' },
      { id: 'registre', label: 'Registre de sélection', position: [78, 66], description: 'Le registre élimine la ligne B et les colonnes 1 et 2. Il ne reste qu’un siège de la ligne A ; l’attribution, elle, reste à décider.' },
      { id: 'projecteur', label: 'Projecteur à cage', position: [50, 12], description: 'Le projecteur éclaire la plateforme par intermittence. La lumière ne modifie ni la grille ni le choix.' },
    ],
  },
  'test-roster-07-cage': {
    locale: 'fr', room: 'La galerie publique', image: '/theatre/roster-07-cage.jpg',
    imageDescription: 'Galerie publique originale : vitre épaisse, cage vide aux barreaux, rangées de sièges vides, moniteurs sur pieds et rubalise.',
    object: 'Le relevé du vote',
    atmosphere: 'La galerie est vide, mais les moniteurs affichent encore trois relevés. Derrière la vitre, la cage attend une décision qui n’a pas été prise par elle.',
    zones: [
      { id: 'cage', label: 'Cage vide', position: [50, 55], description: 'La cage est vide. Elle matérialise la salle publique du film, sans personne et sans mécanisme à reproduire.' },
      { id: 'vitre', label: 'Vitre de la galerie', position: [42, 38], description: 'La vitre sépare la décision de ceux qui la regardent. Le relevé exact est ce qui permet de comprendre ce qui a été vu.' },
      { id: 'moniteurs', label: 'Moniteurs', position: [78, 40], description: 'Trois relevés défilent sur les écrans. Un seul additionne les votes pour, les votes contre et les abstentions.' },
      { id: 'sieges', label: 'Sièges de la galerie', position: [20, 72], description: 'Les sièges sont vides. La salle n’a pas de public : elle garde seulement la trace de ce qu’un public aurait vu.' },
    ],
  },
  'test-roster-08-silo': {
    locale: 'fr', room: 'Le silo à grains', image: '/theatre/roster-08-silo.jpg',
    imageDescription: 'Silo original : trois trémies métalliques, sacs de jute empilés, échelle d’acier, poussière en suspension et trappe usée.',
    object: 'Le bordereau de pesée',
    atmosphere: 'La poussière reste en suspension dans le faisceau. Trois trémies ont versé neuf sacs chacune ; le bordereau attend quatre cent trente-deux kilos.',
    zones: [
      { id: 'tremies', label: 'Trois trémies', position: [45, 22], description: 'Chaque trémie a versé neuf sacs de douze kilos. Le compte se fait sur le bordereau, pas en manipulant les sacs.' },
      { id: 'sacs', label: 'Sacs empilés', position: [24, 70], description: 'Les sacs portent un poids marqué. Ils servent au calcul et ne demandent aucune manutention.' },
      { id: 'echelle', label: 'Échelle d’acier', position: [78, 50], description: 'L’échelle rejoint la trappe. Elle reste un élément de décor : la salle se lit depuis le sol.' },
      { id: 'lucarne', label: 'Lucarne', position: [62, 10], description: 'La lucarne laisse passer un trait de lumière. La poussière y rend visible le volume du silo, sans révéler de chiffre.' },
    ],
  },
  'test-roster-09-temoin': {
    locale: 'fr', room: 'Le local de maintenance', image: '/theatre/roster-09-metro.jpg',
    imageDescription: 'Local de maintenance original : magnétophone à bobines, dossiers, tableau de signalisation, murs carrelés et lampe ambre.',
    object: 'La déposition',
    atmosphere: 'Le magnétophone tourne encore. Trois références sont posées près des dossiers ; une seule conserve la provenance et la réserve de la déposition.',
    zones: [
      { id: 'magnetophone', label: 'Magnétophone', position: [28, 60], description: 'La bande porte la voix et la date, pas la référence de classement. Celle-ci se choisit dans la console.' },
      { id: 'dossiers', label: 'Dossiers', position: [62, 68], description: 'Les chemises voisines appartiennent à d’autres affaires. Déplacer la déposition changerait ce que le dossier peut encore prouver.' },
      { id: 'tableau', label: 'Tableau de signalisation', position: [80, 32], description: 'Les lignes du tableau indiquent les correspondances de service. Elles ne remplacent pas la référence d’origine.' },
      { id: 'lampe', label: 'Lampe ambre', position: [48, 12], description: 'La lampe éclaire la table de montage. La réserve de l’archiviste doit rester attachée à la pièce, même sous une lumière flatteuse.' },
    ],
  },
  'test-roster-10-machine': {
    locale: 'fr', room: 'La dernière salle', image: '/theatre/roster-10-machine.jpg',
    imageDescription: 'Dernière salle originale : appareil de laiton et d’acier à cadrans, porte lourde, bâche plastique, drain au sol et lampe unique.',
    object: 'Le compteur de la machine',
    atmosphere: 'L’appareil occupe le centre de la salle. Neuf verrous retiennent la porte ; le compteur libère un verrou toutes les quatre minutes.',
    zones: [
      { id: 'machine', label: 'Appareil de laiton', position: [50, 45], description: 'L’appareil est un compteur de lecture. Il ne demande ni geste ni mode d’emploi : seulement le temps d’ouverture.' },
      { id: 'compteur', label: 'Compteur', position: [42, 30], description: 'Le compteur affiche neuf verrous et un intervalle de quatre minutes. Le calcul se fait dans la console.' },
      { id: 'porte', label: 'Porte lourde', position: [78, 55], description: 'La porte s’ouvre une fois. La laisser ouverte ou la refermer est le dernier choix du roster, pas une condition du calcul.' },
      { id: 'bache', label: 'Bâche plastique', position: [22, 72], description: 'La bâche recouvre du matériel rangé. Elle n’est pas à soulever : la salle ne contient aucun objet utile à la sortie.' },
    ],
  },
  'test-s1-bathroom': {
    locale: 'fr', room: 'La salle carrelée', image: '/theatre/saw-i-bathroom.jpg',
    imageDescription: 'Salle carrelée originale : deux baignoires de fonte, chaînes fixées aux tuyaux, grille de neuf dalles, registre sur un tabouret et néon unique.',
    object: 'Le registre d’entretien',
    atmosphere: 'L’eau stagne entre les carreaux. Le registre ouvert près du drain ne mentionne qu’une dalle rouverte après la fermeture.',
    zones: [
      { id: 'registre', label: 'Registre d’entretien', position: [20, 74], description: 'Le registre donne la ligne et la colonne de la dalle rouverte. La grille de la console reprend les neuf coordonnées.' },
      { id: 'dalles', label: 'Grille de dalles', position: [52, 84], description: 'Les dalles forment une grille de A à C et de 1 à 3. Une seule est nommée par le registre ; l’image ne cache aucun chiffre.' },
      { id: 'chaine', label: 'Chaîne au tuyau', position: [82, 48], description: 'La chaîne est fixée à la tuyauterie, pas à une personne. Elle rappelle que la salle a été condamnée avant l’arrivée du dépôt.' },
      { id: 'neon', label: 'Néon', position: [50, 10], description: 'Le néon grésille au-dessus des baignoires. La lumière ne modifie pas la lecture du registre.' },
    ],
  },
  'test-s1-bear-trap': {
    locale: 'fr', room: 'La chambre scellée', image: '/theatre/saw-i-apartment.jpg',
    imageDescription: 'Chambre scellée originale : magnétophone sur une table, console à deux arbres, une chaise, fenêtre condamnée et ampoule nue.',
    object: 'La console à deux arbres',
    atmosphere: 'La pièce est vide de tout public. Sur la table, un magnétophone et une console dont les deux index doivent totaliser quinze.',
    zones: [
      { id: 'console', label: 'Console à deux arbres', position: [52, 55], description: 'L’arbre de gauche ajoute trois par cran, celui de droite deux. La console valide un total, jamais un geste.' },
      { id: 'magnetophone', label: 'Magnétophone', position: [24, 62], description: 'La bande donne la règle et le temps. Elle ne répétera pas la combinaison après la décision.' },
      { id: 'chaise', label: 'Chaise', position: [74, 72], description: 'La chaise est vide. La salle se lit comme une chambre de dépôt, sans personne à libérer.' },
      { id: 'fenetre', label: 'Fenêtre condamnée', position: [78, 24], description: 'Le volet est vissé. Aucune issue ne passe par la fenêtre : la seule sortie est la console.' },
    ],
  },
  'test-s1-razor-wire': {
    locale: 'fr', room: 'Le passage grillagé', image: '/theatre/saw-i-razor.jpg',
    imageDescription: 'Passage de sous-sol original : rideaux de plastique et de grillage, grille métallique au fond, clavier et sol détrempé.',
    object: 'Le registre de fermeture',
    atmosphere: 'Les rideaux de plastique pendent au-dessus du passage. Au fond, la grille et son clavier attendent la date de fermeture.',
    zones: [
      { id: 'registre', label: 'Registre de fermeture', position: [22, 70], description: 'Le registre porte le mois et le rang du jeudi cherchés. La date se saisit dans la console.' },
      { id: 'grille', label: 'Grille de sortie', position: [70, 42], description: 'La grille est fermée par un clavier. Le passage ne demande ni effort ni outil : une date suffit.' },
      { id: 'rideaux', label: 'Rideaux de plastique', position: [38, 30], description: 'Les rideaux masquent la tuyauterie, pas une réponse. Les indices utiles sont au registre.' },
      { id: 'lampes', label: 'Lampe de service', position: [50, 8], description: 'La lampe éclaire le clavier et laisse le fond du passage dans l’ombre. Aucune inscription n’y est cachée.' },
    ],
  },
  'test-s1-flammable-jelly': {
    locale: 'fr', room: 'Le local de chauffe', image: '/theatre/saw-i-heat.jpg',
    imageDescription: 'Local de chauffe original : chaudière de fonte, grand thermomètre mural, volant de vanne, bâches plastique et ampoule nue.',
    object: 'Le thermostat',
    atmosphere: 'Le local est sec et immobile. Le thermomètre affiche dix-huit degrés ; le groupe doit couper à quarante.',
    zones: [
      { id: 'thermostat', label: 'Thermomètre mural', position: [58, 30], description: 'Le cadran donne la température de départ et le seuil de coupure. La durée se calcule dans la console.' },
      { id: 'vanne', label: 'Volant de vanne', position: [30, 58], description: 'Le volant est bloqué en position de service. Il n’est pas à manœuvrer : la salle se lit, elle ne s’exécute pas.' },
      { id: 'chaudiere', label: 'Chaudière', position: [52, 66], description: 'La chaudière porte la plaque du groupe et le pas de montée. Aucune commande réelle n’y est décrite.' },
      { id: 'bache', label: 'Bâche plastique', position: [78, 62], description: 'La bâche recouvre du matériel rangé. Elle ne contient aucun objet utile à l’épreuve.' },
    ],
  },
  'test-s1-drill-chair': {
    locale: 'fr', room: 'L’atelier de la presse', image: '/theatre/saw-i-workshop.jpg',
    imageDescription: 'Atelier original : presse sous housse, établi métallique, tiroirs numérotés, plaque de vitesse et lampe suspendue.',
    object: 'La plaque de vitesse',
    atmosphere: 'La presse est à l’arrêt sous sa housse. La plaque indique neuf cents tours par minute et un rapport de courroie de trois pour un.',
    zones: [
      { id: 'plaque', label: 'Plaque de vitesse', position: [56, 40], description: 'La plaque donne le régime de la presse et le rapport de la courroie. Le régime moteur se calcule dans la console.' },
      { id: 'presse', label: 'Presse', position: [50, 62], description: 'La presse est immobilisée pour la lecture. Aucune manipulation ni mise en route n’est demandée.' },
      { id: 'etabli', label: 'Établi', position: [26, 66], description: 'L’établi réunit les fiches de maintenance. Elles ne contiennent pas la réponse, seulement les valeurs de départ.' },
      { id: 'tiroirs', label: 'Tiroirs numérotés', position: [80, 55], description: 'Les tiroirs sont fermés et inventoriés. Ils font partie du décor, pas d’une cachette.' },
    ],
  },
  'test-s1-shotgun-hallway': {
    locale: 'fr', room: 'Le couloir aux portes', image: '/theatre/saw-i-corridor.jpg',
    imageDescription: 'Couloir de service original : portes métalliques numérotées, tableau de service, rideaux de plastique, conduits et lampe grillagée.',
    object: 'Le tableau de service',
    atmosphere: 'Neuf portes se font face sous les conduits. Le tableau de service condamne une ligne et deux colonnes.',
    zones: [
      { id: 'tableau', label: 'Tableau de service', position: [26, 38], description: 'Le tableau donne les portes condamnées. La grille de la console reprend les neuf coordonnées.' },
      { id: 'portes', label: 'Portes numérotées', position: [62, 52], description: 'Les portes vont de A-1 à C-3. Le couloir ne cache aucune ouverture : la déduction se fait sur le tableau.' },
      { id: 'rideaux', label: 'Rideaux de plastique', position: [44, 22], description: 'Les rideaux masquent les conduits. Ils ne dissimulent ni porte ni indice.' },
      { id: 'lampe', label: 'Lampe grillagée', position: [50, 8], description: 'La lampe éclaire le milieu du couloir. Les extrémités restent dans l’ombre, sans réponse cachée.' },
    ],
  },
  'test-s1-zep-hostage': {
    locale: 'fr', room: 'L’appartement', image: '/theatre/saw-i-zep.jpg',
    imageDescription: 'Appartement original : téléphone sur un buffet, magnétophone, dessin d’enfant sur le réfrigérateur, fenêtre sous la pluie et lampe de table.',
    object: 'La transcription de l’appel',
    atmosphere: 'Le téléphone est posé près du magnétophone. Trois transcriptions de l’appel sont étalées sur le buffet.',
    zones: [
      { id: 'transcriptions', label: 'Trois transcriptions', position: [54, 40], description: 'Les trois feuilles donnent des durées, des heures et des détails différents. Une seule correspond à la bande.' },
      { id: 'telephone', label: 'Téléphone', position: [30, 56], description: 'Le téléphone ne sonne plus. La pièce conserve l’appel, pas la voix qui l’a passé.' },
      { id: 'magnetophone', label: 'Magnétophone', position: [44, 66], description: 'La bande porte la durée et l’heure avant la voix. Elle reste la pièce de référence.' },
      { id: 'fenetre', label: 'Fenêtre', position: [78, 28], description: 'La pluie glisse sur la vitre. L’appartement est un décor de lecture, sans issue à forcer.' },
    ],
  },
  'test-s2-death-mask': {
    locale: 'fr', room: 'L’entrée scellée', image: '/theatre/saw-ii-entry.jpg',
    imageDescription: 'Entrée de maison originale : porte chaînée, téléviseur sur un meuble, escalier, manteaux aux patères et plafonnier unique.',
    object: 'Le registre d’intake',
    atmosphere: 'La porte est chaînée de l’intérieur. Le téléviseur est éteint ; le registre d’intake est ouvert sur la dernière marche.',
    zones: [
      { id: 'registre', label: 'Registre d’intake', position: [56, 62], description: 'Le registre porte la date d’entrée et la consigne du verrou. La somme des chiffres se calcule dans la console.' },
      { id: 'porte', label: 'Porte chaînée', position: [30, 48], description: 'La chaîne et le cadenas ferment l’entrée. La salle ne demande ni effraction ni outil.' },
      { id: 'televiseur', label: 'Téléviseur', position: [74, 44], description: 'L’écran est noir. Il fait partie du décor de la maison, pas de l’énigme.' },
      { id: 'escalier', label: 'Escalier', position: [86, 24], description: 'L’escalier monte vers les chambres. La suite du parcours passe par le registre, pas par les marches.' },
    ],
  },
  'test-s2-needle-pit': {
    locale: 'fr', room: 'La réserve du sous-sol', image: '/theatre/saw-ii-basement.jpg',
    imageDescription: 'Réserve de sous-sol originale : chaudière ancienne, caisses empilées, drain au sol, tuyaux corrodés et ampoule suspendue.',
    object: 'Le bac étiqueté',
    atmosphere: 'Trois bacs sont posés entre les caisses. Un seul réunit la clé de service et le bordereau de stérilisation signé.',
    zones: [
      { id: 'bacs', label: 'Trois bacs', position: [42, 64], description: 'Les bacs sont étiquetés A-1, B-2 et C-3. La console reprend leur contenu ; aucun bac n’est à fouiller.' },
      { id: 'bordereau', label: 'Bordereau', position: [62, 52], description: 'Le bordereau signé distingue le bac vérifiable des deux autres. Il reste lisible sur la table.' },
      { id: 'chaudiere', label: 'Chaudière', position: [78, 40], description: 'La chaudière est hors service. Elle fait partie du décor et ne demande aucune manœuvre.' },
      { id: 'drain', label: 'Drain', position: [50, 84], description: 'Le drain recueille l’eau du sol. Il ne contient aucune pièce et ne sert qu’au choix de fin.' },
    ],
  },
  'test-s2-razor-box': {
    locale: 'fr', room: 'La salle de bain', image: '/theatre/saw-ii-bath.jpg',
    imageDescription: 'Salle de bain originale : baignoire, miroir de pharmacie, boîte métallique sur le lavabo et carreaux fendus.',
    object: 'L’étiquette de série',
    atmosphere: 'La baignoire est vide. Sur le lavabo, une boîte métallique porte huit cellules et une étiquette de série.',
    zones: [
      { id: 'boite', label: 'Boîte métallique', position: [50, 62], description: 'La boîte est fermée. L’étiquette donne le nombre de cellules et leur tension ; le total se calcule dans la console.' },
      { id: 'etiquette', label: 'Étiquette de série', position: [40, 48], description: 'L’étiquette indique huit cellules de trois virgule cinq volts montées en série. Elle doit rester attachée à la pièce.' },
      { id: 'baignoire', label: 'Baignoire', position: [74, 66], description: 'La baignoire est sèche et vide. Elle situe la salle, sans proposer d’action.' },
      { id: 'miroir', label: 'Miroir de pharmacie', position: [24, 30], description: 'Le miroir est fêlé. La pharmacie ne contient aucun objet utile à l’épreuve.' },
    ],
  },
  'test-s2-furnace': {
    locale: 'fr', room: 'La chaufferie', image: '/theatre/saw-ii-basement.jpg',
    imageDescription: 'Chaufferie originale : chaudière, cadran de montée, caisses, drain et ampoule unique ; le même sous-sol que la réserve, vu depuis la chaudière.',
    object: 'La courbe de montée',
    atmosphere: 'Le cadran est revenu à quinze degrés. La courbe affichée indique cinq degrés toutes les quatre minutes jusqu’à quatre-vingt-cinq.',
    zones: [
      { id: 'cadran', label: 'Cadran', position: [50, 38], description: 'Le cadran donne la température de départ et la consigne. La durée se calcule dans la console.' },
      { id: 'courbe', label: 'Courbe de montée', position: [30, 56], description: 'La courbe indique le pas de montée et l’intervalle. Elle doit rester affichée après la lecture.' },
      { id: 'chaudiere', label: 'Chaudière', position: [72, 50], description: 'La chaudière est consignée. Aucune vanne n’est à manœuvrer pour résoudre l’épreuve.' },
      { id: 'caisses', label: 'Caisses', position: [24, 74], description: 'Les caisses sont inventoriées. Elles ne contiennent pas la réponse, seulement du matériel rangé.' },
    ],
  },
  'test-s2-shotgun-peephole': {
    locale: 'fr', room: 'Le palier', image: '/theatre/saw-ii-hall.jpg',
    imageDescription: 'Palier original : trois portes numérotées, une porte à œilleton, console, moquette usée et applique murale.',
    object: 'Le plan de service',
    atmosphere: 'Le palier dessert neuf portes. Le plan de service condamne la ligne A et les colonnes 1 et 2.',
    zones: [
      { id: 'plan', label: 'Plan de service', position: [56, 44], description: 'Le plan donne les portes condamnées. La grille de la console reprend les neuf coordonnées.' },
      { id: 'oeilleton', label: 'Porte à œilleton', position: [78, 50], description: 'L’œilleton ne montre que le couloir. Il ne remplace pas la lecture du plan.' },
      { id: 'portes', label: 'Portes numérotées', position: [30, 44], description: 'Les portes vont de A-1 à C-3. Une seule reste disponible après les condamnations.' },
      { id: 'console', label: 'Console de palier', position: [44, 70], description: 'La console affiche l’état des portes. Elle ne s’ouvre pas par effraction.' },
    ],
  },
  'test-s2-gas-house': {
    locale: 'fr', room: 'Le salon scellé', image: '/theatre/saw-ii-living.jpg',
    imageDescription: 'Salon scellé original : fenêtres condamnées, canapé usé, téléviseur, grille de ventilation, papiers épars et lumière verte.',
    object: 'Le registre de ventilation',
    atmosphere: 'Les fenêtres sont scellées. La grille de ventilation ronronne ; le registre posé sur le canapé donne le volume et le débit.',
    zones: [
      { id: 'registre', label: 'Registre de ventilation', position: [46, 62], description: 'Le registre indique sept cent vingt mètres cubes et vingt-quatre mètres cubes par minute. Le temps se calcule dans la console.' },
      { id: 'grille', label: 'Grille d’extraction', position: [78, 56], description: 'La grille fonctionne au ralenti. Elle n’est pas à démonter : la salle se lit au registre.' },
      { id: 'fenetres', label: 'Fenêtres scellées', position: [26, 34], description: 'Les fenêtres sont condamnées par des planches. Aucune issue ne passe par le salon.' },
      { id: 'televiseur', label: 'Téléviseur', position: [60, 30], description: 'L’écran diffuse une image fixe. Il fait partie du décor et ne donne aucun chiffre.' },
    ],
  },
  'test-s3-freezer': {
    locale: 'fr', room: 'La chambre froide', image: '/theatre/saw-iii-freezer.jpg',
    imageDescription: 'Chambre froide originale : parois givrées, porte isolée, cadran de température, manteaux suspendus, caisses et lumière bleu-vert.',
    object: 'La courbe de descente',
    atmosphere: 'Le givre couvre les parois. Le cadran affiche huit degrés ; le groupe doit descendre à moins douze, deux degrés toutes les cinq minutes.',
    zones: [
      { id: 'cadran', label: 'Cadran', position: [54, 32], description: 'Le cadran donne la température de départ et la consigne. La durée se calcule dans la console.' },
      { id: 'courbe', label: 'Courbe de descente', position: [30, 54], description: 'La courbe indique le pas et l’intervalle. Elle doit rester lisible après la lecture.' },
      { id: 'manteau', label: 'Manteau au crochet', position: [78, 48], description: 'Le manteau est resté au crochet. Le prendre ou le laisser est un choix de la salle, pas une condition de l’énigme.' },
      { id: 'caisses', label: 'Caisses', position: [24, 74], description: 'Les caisses sont inventoriées. Elles ne contiennent aucun objet utile à la sortie.' },
    ],
  },
  'test-s3-angel': {
    locale: 'fr', room: 'La salle du harnais', image: '/theatre/saw-iii-harness.jpg',
    imageDescription: 'Salle du harnais originale : cadre métallique suspendu, poulies, chaînes au sol, console et lampe de travail ; aucune personne.',
    object: 'La console à deux arbres',
    atmosphere: 'Le cadre pend au-dessus du sol. Deux arbres et une console attendent un total de quinze, sans personne dans le cadre.',
    zones: [
      { id: 'console', label: 'Console à deux arbres', position: [54, 52], description: 'L’arbre de gauche ajoute trois par cran, celui de droite deux. La console valide un total, jamais un geste.' },
      { id: 'cadre', label: 'Cadre suspendu', position: [58, 26], description: 'Le cadre est vide. Il matérialise la salle du film sans représenter de personne.' },
      { id: 'poulies', label: 'Poulies', position: [30, 22], description: 'Les poulies et les chaînes font partie du décor. Aucune manœuvre n’est demandée hors de la console.' },
      { id: 'lampe', label: 'Lampe de travail', position: [80, 62], description: 'La lampe éclaire la console. Elle ne cache aucune inscription.' },
    ],
  },
  'test-s3-rack': {
    locale: 'fr', room: 'La salle du treuil', image: '/theatre/saw-iii-rack.jpg',
    imageDescription: 'Salle du treuil originale : treuil à engrenages, console de couple, arbres apparents, établi métallique et lampe industrielle.',
    object: 'La plaque de régime',
    atmosphere: 'Le treuil est à l’arrêt. La plaque indique quatre-vingt-quatre tours par minute et un réducteur qui divise par quatre.',
    zones: [
      { id: 'plaque', label: 'Plaque de régime', position: [58, 38], description: 'La plaque donne le régime du treuil et le rapport du réducteur. Le régime moteur se calcule dans la console.' },
      { id: 'treuil', label: 'Treuil', position: [50, 62], description: 'Le treuil est consigné pour la lecture. Aucune mise en route n’est demandée.' },
      { id: 'etabli', label: 'Établi', position: [24, 66], description: 'L’établi réunit les fiches de maintenance. Elles donnent les valeurs de départ, pas la réponse.' },
      { id: 'engrenages', label: 'Engrenages', position: [80, 52], description: 'Les engrenages sont visibles mais immobiles. Ils situent le rapport, sans proposer de manipulation.' },
    ],
  },
  'test-s3-classroom': {
    locale: 'fr', room: 'La salle de classe', image: '/theatre/saw-iii-classroom.jpg',
    imageDescription: 'Salle de classe originale : rangées de pupitres, tableau noir, papiers au sol, neuf luminaires et lampe de bureau.',
    object: 'Le compteur divisionnaire',
    atmosphere: 'Les neuf luminaires sont allumés au-dessus des pupitres vides. Le compteur divisionnaire attend une puissance et une durée.',
    zones: [
      { id: 'luminaires', label: 'Neuf luminaires', position: [50, 16], description: 'Chaque luminaire porte trente-six watts. Le nombre et la durée sont donnés dans la question.' },
      { id: 'compteur', label: 'Compteur divisionnaire', position: [78, 58], description: 'Le compteur affiche la puissance et la durée. L’énergie se calcule dans la console.' },
      { id: 'pupitres', label: 'Pupitres', position: [40, 66], description: 'Les pupitres sont vides et alignés. Ils font partie du décor, sans indice caché.' },
      { id: 'tableau', label: 'Tableau noir', position: [24, 34], description: 'Le tableau porte un relevé de cours effacé. Aucune valeur utile à l’épreuve n’y est écrite.' },
    ],
  },
  'test-s3-pig-vat': {
    locale: 'fr', room: 'La salle des cuves', image: '/theatre/saw-iii-vat.jpg',
    imageDescription: 'Salle des cuves originale : trois cuves d’acier, passerelle, grille au sol, tuyaux enroulés et lumière unique.',
    object: 'Le registre de service',
    atmosphere: 'Trois cuves occupent la salle. Le registre de service condamne la ligne A et les colonnes 1 et 2.',
    zones: [
      { id: 'registre', label: 'Registre de service', position: [26, 40], description: 'Le registre donne les emplacements condamnés. La grille de la console reprend les neuf coordonnées.' },
      { id: 'cuves', label: 'Cuves', position: [56, 54], description: 'Les cuves sont numérotées A-1 à C-3. Une seule reste disponible après les condamnations.' },
      { id: 'passerelle', label: 'Passerelle', position: [50, 22], description: 'La passerelle surplombe les cuves. Elle sert au décor, pas à une manœuvre.' },
      { id: 'grille', label: 'Grille au sol', position: [76, 76], description: 'La grille recueille l’eau de service. Elle ne cache aucune pièce.' },
    ],
  },
  'test-s3-shotgun-collar': {
    locale: 'fr', room: 'Le bureau', image: '/theatre/saw-iii-office.jpg',
    imageDescription: 'Bureau original : moniteur cardiaque sur pied, câbles enroulés, bureau avec sous-main, armoire métallique et lampe de bureau.',
    object: 'Les trois relevés',
    atmosphere: 'Le moniteur est éteint. Trois relevés sont posés sur le bureau, avec la bande d’alarme et le registre du verrou.',
    zones: [
      { id: 'releves', label: 'Trois relevés', position: [54, 46], description: 'Les feuilles donnent des heures et des états différents. Une seule correspond à la bande.' },
      { id: 'moniteur', label: 'Moniteur', position: [76, 40], description: 'Le moniteur ne fonctionne plus. La salle conserve ses relevés, pas le soin qui les a produits.' },
      { id: 'cables', label: 'Câbles', position: [28, 56], description: 'Les câbles sont enroulés et étiquetés. Ils font partie du décor.' },
      { id: 'armoire', label: 'Armoire', position: [84, 64], description: 'L’armoire contient des classeurs vides. Elle ne cache aucune réponse.' },
    ],
  },
  'test-s4-mausoleum': {
    locale: 'fr', room: 'Le mausolée', image: '/theatre/saw-iv-mausoleum.jpg',
    imageDescription: 'Mausolée original : plaques scellées, chaînes suspendues, banc de pierre, lampe de laiton et cierges.',
    object: 'Le registre de sépulture',
    atmosphere: 'La pierre garde le froid. Le registre ouvert sur le banc condamne la ligne A et les colonnes 1 et 3.',
    zones: [
      { id: 'registre', label: 'Registre de sépulture', position: [54, 68], description: 'Le registre donne les plaques condamnées. La grille de la console reprend les neuf coordonnées.' },
      { id: 'plaques', label: 'Plaques', position: [32, 34], description: 'Les plaques sont numérotées A-1 à C-3. Une seule reste disponible après les condamnations.' },
      { id: 'chaines', label: 'Chaînes', position: [74, 24], description: 'Les chaînes retiennent les plaques, pas des personnes. Elles ne demandent aucune manœuvre.' },
      { id: 'lampe', label: 'Lampe de laiton', position: [22, 72], description: 'La lampe éclaire le registre sans atteindre les plaques du fond.' },
    ],
  },
  'test-s4-knife-chair': {
    locale: 'fr', room: 'L’atelier', image: '/theatre/saw-iv-workshop.jpg',
    imageDescription: 'Atelier original : cadre de chaise métallique, planche d’outils, évier inox, armoire et lampe de travail ; aucune personne.',
    object: 'La plaque de couple',
    atmosphere: 'Le levier et le plateau sont immobiles. La plaque donne la longueur du levier et la force appliquée.',
    zones: [
      { id: 'levier', label: 'Levier', position: [52, 58], description: 'Le levier mesure un mètre cinquante. Le couple se calcule dans la console, sans manœuvre.' },
      { id: 'plaque', label: 'Plaque de couple', position: [30, 40], description: 'La plaque donne la force appliquée et la limite du plateau. Elle doit rester lisible après la lecture.' },
      { id: 'planche', label: 'Planche d’outils', position: [80, 36], description: 'Les outils sont rangés et inventoriés. Aucun n’est à utiliser pour l’épreuve.' },
      { id: 'evier', label: 'Évier', position: [24, 72], description: 'L’évier est sec. Il situe l’atelier, sans proposer d’action.' },
    ],
  },
  'test-s4-hair': {
    locale: 'fr', room: 'La chambre', image: '/theatre/saw-iv-bedroom.jpg',
    imageDescription: 'Chambre originale : armoire, grand miroir, chaîne de porte, lampe de chevet, moquette usée et rideaux lourds.',
    object: 'Le compteur de câble',
    atmosphere: 'La chambre est silencieuse. Le treuil et son compteur sont visibles près de l’armoire ; il reste dix-huit mètres de câble.',
    zones: [
      { id: 'compteur', label: 'Compteur de câble', position: [62, 52], description: 'Le compteur donne la longueur restante et la vitesse d’enroulement. Le temps se calcule dans la console.' },
      { id: 'treuil', label: 'Treuil', position: [78, 44], description: 'Le treuil est consigné. Aucune mise en tension n’est demandée.' },
      { id: 'miroir', label: 'Miroir', position: [30, 40], description: 'Le miroir reflète la pièce vide. Il ne cache aucune inscription.' },
      { id: 'armoire', label: 'Armoire', position: [24, 66], description: 'L’armoire est fermée et inventoriée. Elle fait partie du décor.' },
    ],
  },
  'test-s4-spikes': {
    locale: 'fr', room: 'La chambre d’hôtel', image: '/theatre/saw-iv-hotel.jpg',
    imageDescription: 'Chambre d’hôtel originale : valise ouverte, rideaux lourds, applique murale, chaise renversée, télévision et commode.',
    object: 'Les comptes rendus',
    atmosphere: 'La chambre est rangée comme après un départ. Trois comptes rendus et le registre de porte sont posés sur la commode.',
    zones: [
      { id: 'comptes', label: 'Trois comptes rendus', position: [56, 56], description: 'Les récits diffèrent sur l’heure, la porte et la provenance. Un seul correspond au registre.' },
      { id: 'registre', label: 'Registre de porte', position: [76, 48], description: 'Le registre donne l’état de la porte à l’heure de l’appel. Il ne donne pas l’heure elle-même.' },
      { id: 'telephone', label: 'Téléphone', position: [28, 64], description: 'Le téléphone est débranché. La chambre conserve l’heure du standard, pas la voix.' },
      { id: 'valise', label: 'Valise', position: [38, 76], description: 'La valise est ouverte et vide. Elle ne contient aucune pièce utile.' },
    ],
  },
  'test-s4-bedroom': {
    locale: 'fr', room: 'La chambre filmée', image: '/theatre/saw-iv-studio.jpg',
    imageDescription: 'Chambre filmée originale : projecteur, deux bobines, écran blanc, trépied, boîtes de pellicule et lampe de travail.',
    object: 'L’étiquette de bobine',
    atmosphere: 'Le projecteur est à l’arrêt. La bobine porte une étiquette de durée et de provenance ; l’écran reste blanc.',
    zones: [
      { id: 'projecteur', label: 'Projecteur', position: [50, 44], description: 'Le projecteur donne vingt-quatre images par seconde. Le nombre total se calcule dans la console.' },
      { id: 'etiquette', label: 'Étiquette de bobine', position: [30, 52], description: 'L’étiquette doit porter la durée et la provenance. Elle ne doit pas être effacée.' },
      { id: 'bobines', label: 'Bobines', position: [74, 60], description: 'Les bobines sont rangées dans leurs boîtes. Elles ne sont pas à projeter pour l’épreuve.' },
      { id: 'ecran', label: 'Écran', position: [58, 22], description: 'L’écran est vide. Aucune image n’est montrée ; la salle se lit par ses étiquettes.' },
    ],
  },
  'test-s4-ice-blocks': {
    locale: 'fr', room: 'La plateforme', image: '/theatre/saw-iv-platform.jpg',
    imageDescription: 'Plateforme originale : estrade de béton sur contrepoids, balances suspendues, câbles d’acier, console et lampe grillagée.',
    object: 'Le registre de charge',
    atmosphere: 'La plateforme est vide. Le registre affiche quatre cents kilos de charge maximale et quatre blocs de quatre-vingt-cinq kilos.',
    zones: [
      { id: 'registre', label: 'Registre de charge', position: [28, 44], description: 'Le registre donne la charge maximale et la masse posée. La marge se calcule dans la console.' },
      { id: 'plateforme', label: 'Plateforme', position: [54, 64], description: 'La plateforme est stable et vide de toute personne. Elle ne demande aucune manœuvre.' },
      { id: 'contrepoids', label: 'Contrepoids', position: [80, 56], description: 'Les contrepoids sont visibles mais immobiles. Ils situent la charge, sans proposer de réglage.' },
      { id: 'console', label: 'Console', position: [40, 32], description: 'La console affiche la charge et la marge. Elle valide une mention, jamais un geste.' },
    ],
  },
  'test-s5-pendulum': {
    locale: 'fr', room: 'La salle des scellés', image: '/theatre/saw-v-scelles.jpg',
    imageDescription: 'Salle des scellés originale : étagères d’archives numérotées, table de registre, armoires scellées, lampe suspendue et sol de béton.',
    object: 'Le registre des dommages',
    atmosphere: 'Les boîtes portent des numéros. Le registre ouvert additionne trois lignes de dommages et fixe un seuil de lecture.',
    zones: [
      { id: 'registre', label: 'Registre', position: [52, 60], description: 'Le registre donne trois lignes et un seuil. La somme se calcule dans la console.' },
      { id: 'boites', label: 'Boîtes numérotées', position: [26, 34], description: 'Les boîtes sont inventoriées. Elles situent l’affaire sans contenir d’indice caché.' },
      { id: 'armoires', label: 'Armoires scellées', position: [80, 46], description: 'Les scellés sont intacts. Aucune armoire n’est à ouvrir pour l’épreuve.' },
      { id: 'lampe', label: 'Lampe suspendue', position: [50, 12], description: 'La lampe éclaire la table. Le reste de la salle reste dans la pénombre.' },
    ],
  },
  'test-s5-collar-keys': {
    locale: 'fr', room: 'Le vestibule', image: '/theatre/saw-v-vestibule.jpg',
    imageDescription: 'Vestibule original : tiroirs numérotés, crochets à clés, comptoir étroit, carrelage et ampoule unique.',
    object: 'La règle des tiroirs',
    atmosphere: 'Cinq tiroirs, cinq crochets. La règle de décalage est affichée au-dessus du comptoir en lettres peintes.',
    zones: [
      { id: 'regle', label: 'Règle affichée', position: [50, 26], description: 'La règle donne le décalage de deux tiroirs et le retour à un après cinq.' },
      { id: 'tiroirs', label: 'Tiroirs numérotés', position: [52, 62], description: 'Les tiroirs vont de un à cinq. Le calcul désigne celui du collier quatre.' },
      { id: 'crochets', label: 'Crochets à clés', position: [22, 44], description: 'Les crochets sont vides et étiquetés. Aucune clé n’y est suspendue.' },
      { id: 'ampoule', label: 'Ampoule', position: [82, 16], description: 'L’ampoule grésille. Elle n’éclaire pas le fond du vestibule.' },
    ],
  },
  'test-s5-ceiling-jars': {
    locale: 'fr', room: 'La réserve', image: '/theatre/saw-v-reserve.jpg',
    imageDescription: 'Réserve originale : étagères métalliques, bocaux de verre vides, balance, caisses et néon nu.',
    object: 'Le relevé des bocaux',
    atmosphere: 'Six emplacements, quatre bocaux. Le relevé suspendu demande le volume restant, pas le volume habituel.',
    zones: [
      { id: 'bocaux', label: 'Bocaux', position: [48, 48], description: 'Quatre bocaux de quatre litres sont en place. Deux emplacements sont vides.' },
      { id: 'releve', label: 'Relevé', position: [76, 56], description: 'Le relevé attend un volume en litres. Il ne donne pas la réponse.' },
      { id: 'balance', label: 'Balance', position: [26, 66], description: 'La balance est à l’arrêt. Elle sert au décor et non à la mesure de l’épreuve.' },
      { id: 'etageres', label: 'Étagères', position: [70, 24], description: 'Les étagères portent des emplacements numérotés. Aucun bocal n’est caché derrière.' },
    ],
  },
  'test-s5-electric-bathtub': {
    locale: 'fr', room: 'La chaufferie', image: '/theatre/saw-v-chaufferie.jpg',
    imageDescription: 'Chaufferie originale : chaudière fonte, tuyaux isolés, manomètres, volants de vanne et lampe grillagée.',
    object: 'Le circuit de contrôle',
    atmosphere: 'Les manomètres sont stables. Le circuit de contrôle affiche une tension et une résistance, et attend une intensité.',
    zones: [
      { id: 'circuit', label: 'Circuit de contrôle', position: [58, 46], description: 'Le circuit donne 24 V et 8 Ω. L’intensité se calcule dans la console.' },
      { id: 'manometres', label: 'Manomètres', position: [28, 30], description: 'Les manomètres sont à l’arrêt. Ils ne donnent aucune valeur utile à l’épreuve.' },
      { id: 'chaudiere', label: 'Chaudière', position: [48, 70], description: 'La chaudière est consignée. Aucune manœuvre n’est demandée.' },
      { id: 'vanne', label: 'Volant de vanne', position: [80, 62], description: 'Le volant est bloqué par un plomb. Il fait partie du décor.' },
    ],
  },
  'test-s5-blood-saws': {
    locale: 'fr', room: 'La salle de collecte', image: '/theatre/saw-v-collecte.jpg',
    imageDescription: 'Salle de collecte originale : quatre supports d’acier, récipients gradués étiquetés, tableau de mesure, grille d’évacuation et lampe suspendue.',
    object: 'Le registre de collecte',
    atmosphere: 'Quatre récipients sont posés sur leurs supports. Le tableau indique dix unités attendues et quatre déjà versées.',
    zones: [
      { id: 'tableau', label: 'Tableau de mesure', position: [54, 42], description: 'Le tableau donne le total attendu et les unités déjà inscrites. Le manque se calcule.' },
      { id: 'recipients', label: 'Récipients', position: [50, 68], description: 'Les récipients sont vides et gradués. Ils matérialisent la collecte sans aucun prélèvement.' },
      { id: 'supports', label: 'Supports', position: [24, 56], description: 'Les supports sont numérotés. Ils situent chaque part de la collecte.' },
      { id: 'grille', label: 'Grille', position: [78, 80], description: 'La grille est sèche. Elle ne cache rien.' },
    ],
  },
  'test-s5-water-cube': {
    locale: 'fr', room: 'Le réservoir', image: '/theatre/saw-v-reservoir.jpg',
    imageDescription: 'Réservoir original : passerelle d’acier, jauges de niveau, porte étanche, débris flottants et projecteur unique.',
    object: 'Le mandat',
    atmosphere: 'L’eau noire occupe le centre. Le mandat est fixé à la rambarde, avec sa date d’intervention et le délai de signature.',
    zones: [
      { id: 'mandat', label: 'Mandat', position: [46, 38], description: 'Le mandat donne la date d’intervention et le délai de 72 heures. La signature se déduit.' },
      { id: 'jauges', label: 'Jauges', position: [78, 24], description: 'Les jauges indiquent le niveau sans donner d’heure.' },
      { id: 'passerelle', label: 'Passerelle', position: [50, 72], description: 'La passerelle est stable. Elle sert de lecture, pas de parcours.' },
      { id: 'porte', label: 'Porte étanche', position: [22, 52], description: 'La porte reste fermée. Aucune ouverture n’est demandée.' },
    ],
  },
  'test-s5-glass-coffin': {
    locale: 'fr', room: 'Le couloir bas', image: '/theatre/saw-v-couloir.jpg',
    imageDescription: 'Couloir bas original : piliers de béton, trappes numérotées, chemins de câbles, eau stagnante et lampe de service jaune.',
    object: 'Le plan des trappes',
    atmosphere: 'Neuf trappes s’alignent sur trois rangées. Le plan affiché indique les scellés et la consigne de C-3.',
    zones: [
      { id: 'plan', label: 'Plan', position: [50, 34], description: 'Le plan donne les neuf positions et les exclusions. La trappe libre se déduit.' },
      { id: 'trappes', label: 'Trappes', position: [52, 66], description: 'Les trappes sont numérotées A-1 à C-3. Une seule reste libre dans la rangée C.' },
      { id: 'cables', label: 'Câbles', position: [26, 22], description: 'Les câbles courent au plafond. Ils ne portent aucune inscription.' },
      { id: 'lampe', label: 'Lampe de service', position: [82, 18], description: 'La lampe jaune éclaire le plan sans atteindre le fond du couloir.' },
    ],
  },
  'test-s6-oxygen': {
    locale: 'fr', room: 'La salle d’attente', image: '/theatre/saw-vi-attente.jpg',
    imageDescription: 'Salle d’attente originale : rangées de chaises en plastique, horloge murale, classeur, affiches fanées et panneau lumineux vacillant.',
    object: 'Le tableau d’autonomie',
    atmosphere: 'Les chaises sont vides. Le tableau affiche trois bouteilles, un débit et une case pour la durée.',
    zones: [
      { id: 'tableau', label: 'Tableau', position: [52, 40], description: 'Le tableau donne le volume et le débit. La durée se calcule dans la console.' },
      { id: 'horloge', label: 'Horloge', position: [78, 22], description: 'L’horloge est arrêtée. Elle ne donne aucune heure utile.' },
      { id: 'chaises', label: 'Chaises', position: [46, 70], description: 'Les chaises sont alignées et vides. Elles font partie du décor.' },
      { id: 'classeur', label: 'Classeur', position: [22, 58], description: 'Le classeur contient des formulaires vierges. Aucune réponse n’y est rangée.' },
    ],
  },
  'test-s6-gallows': {
    locale: 'fr', room: 'Le bureau d’audit', image: '/theatre/saw-vi-audit.jpg',
    imageDescription: 'Bureau d’audit original : table de réunion, dossiers empilés, graphiques muraux, projecteur et stores filtrant la lumière.',
    object: 'Les trois notes',
    atmosphere: 'Deux dossiers sont ouverts côte à côte. Trois notes d’audit attendent sur la table, chacune avec sa signature.',
    zones: [
      { id: 'notes', label: 'Trois notes', position: [52, 56], description: 'Les notes diffèrent sur l’auteur du classement. Une seule assume la sélection.' },
      { id: 'dossiers', label: 'Deux dossiers', position: [30, 50], description: 'Les dossiers portent deux noms et deux situations. Ils ne disent pas lequel est prioritaire.' },
      { id: 'graphiques', label: 'Graphiques', position: [78, 28], description: 'Les graphiques classent des coûts. Ils ne nomment aucune personne.' },
      { id: 'stores', label: 'Stores', position: [24, 22], description: 'Les stores laissent passer des lamelles de lumière. Ils ne cachent aucun document.' },
    ],
  },
  'test-s6-carousel': {
    locale: 'fr', room: 'La rotonde', image: '/theatre/saw-vi-rotonde.jpg',
    imageDescription: 'Rotonde originale : six alcôves numérotées, sol carrelé, lustre de fer et bâches sur les murs.',
    object: 'L’index à deux arbres',
    atmosphere: 'Six alcôves vides entourent la salle. L’index à deux arbres attend un total de vingt-quatre.',
    zones: [
      { id: 'index', label: 'Index à deux arbres', position: [52, 50], description: 'L’arbre gauche ajoute trois par cran, le droit deux. Le total demandé est vingt-quatre.' },
      { id: 'alcoves', label: 'Six alcôves', position: [50, 24], description: 'Les alcôves sont numérotées et vides. Elles rappellent les six dossiers, sans représenter personne.' },
      { id: 'lustre', label: 'Lustre', position: [50, 10], description: 'Le lustre est éteint. Il ne porte aucun indice.' },
      { id: 'baches', label: 'Bâches', position: [80, 62], description: 'Les bâches recouvrent les murs. Elles ne cachent aucune issue.' },
    ],
  },
  'test-s6-steam-maze': {
    locale: 'fr', room: 'La chaufferie', image: '/theatre/saw-vi-chaufferie.jpg',
    imageDescription: 'Chaufferie originale : conduits de vapeur entourés de toile, manomètres rouillés, cloisons métalliques, mousse et lampe de travail.',
    object: 'Le registre des conduits',
    atmosphere: 'Trois conduits traversent la salle. Le registre donne le débit global et celui de deux conduits.',
    zones: [
      { id: 'registre', label: 'Registre', position: [52, 44], description: 'Le registre donne 3 600 m³/h au total et 900 m³/h par conduit ouvert. Le troisième se calcule.' },
      { id: 'conduits', label: 'Conduits', position: [50, 68], description: 'Les conduits sont froids et consignés. Aucune vanne n’est à manœuvrer.' },
      { id: 'manometres', label: 'Manomètres', position: [26, 28], description: 'Les manomètres sont à l’arrêt. Ils ne donnent pas la réponse.' },
      { id: 'cloisons', label: 'Cloisons', position: [80, 56], description: 'Les cloisons dessinent un parcours. Elles servent au décor, pas au déplacement.' },
    ],
  },
  'test-s6-acid-latch': {
    locale: 'fr', room: 'Le laboratoire', image: '/theatre/saw-vi-laboratoire.jpg',
    imageDescription: 'Laboratoire original : paillasses d’acier, bonbonnes étiquetées, sorbonne, carrelage et éclairage froid.',
    object: 'La grille des leviers',
    atmosphere: 'Neuf leviers sont alignés derrière la vitre. La grille affiche les exclusions et le dossier de William.',
    zones: [
      { id: 'grille', label: 'Grille des leviers', position: [52, 40], description: 'La grille donne les neuf positions et les exclusions. Un seul levier reste libre.' },
      { id: 'leviers', label: 'Leviers', position: [50, 64], description: 'Les leviers sont tous en position basse. Aucun n’est à manœuvrer.' },
      { id: 'bonbonnes', label: 'Bonbonnes', position: [26, 48], description: 'Les bonbonnes sont étiquetées et scellées. Aucune n’est à ouvrir.' },
      { id: 'dossier', label: 'Dossier', position: [80, 56], description: 'Le dossier de William est posé fermé. Il rappelle la faute, sans proposer de geste.' },
    ],
  },
  'test-s6-pound-flesh': {
    locale: 'fr', room: 'La salle des comptes', image: '/theatre/saw-vi-comptes.jpg',
    imageDescription: 'Salle des comptes originale : trois bureaux, balance mécanique, registres alignés, classeurs verts et lampe suspendue.',
    object: 'Le registre des prêts',
    atmosphere: 'Trois lignes sont inscrites au grand livre. La balance attend un total de cent cinquante mille.',
    zones: [
      { id: 'livre', label: 'Grand livre', position: [52, 54], description: 'Le grand livre donne trois lignes et un seuil. La somme se calcule.' },
      { id: 'balance', label: 'Balance', position: [28, 62], description: 'La balance est à l’équilibre. Elle sert au registre, pas à une pesée réelle.' },
      { id: 'bureaux', label: 'Bureaux', position: [50, 76], description: 'Les bureaux sont vides et rangés. Ils situent le service.' },
      { id: 'classeurs', label: 'Classeurs', position: [80, 36], description: 'Les classeurs portent des noms de dossiers. Aucun n’est à ouvrir.' },
    ],
  },
  'test-s6-bear-trap-2': {
    locale: 'fr', room: 'L’atelier', image: '/theatre/saw-vi-atelier.jpg',
    imageDescription: 'Atelier original : établi d’acier, planche d’outils, écran de soudure, copeaux métalliques et lampe suspendue.',
    object: 'L’index de sécurité',
    atmosphere: 'L’index de sécurité attend un total de vingt et un. Les outils restent à leur place.',
    zones: [
      { id: 'index', label: 'Index de sécurité', position: [56, 46], description: 'L’arbre gauche ajoute trois par cran, le droit deux. Le total demandé est vingt et un.' },
      { id: 'etabli', label: 'Établi', position: [48, 68], description: 'L’établi est dégagé. Aucune pièce n’est à assembler.' },
      { id: 'planche', label: 'Planche d’outils', position: [80, 34], description: 'Les outils sont rangés et inventoriés. Aucun n’est à prendre.' },
      { id: 'ecran', label: 'Écran de soudure', position: [24, 50], description: 'L’écran est replié. Il appartient au décor.' },
    ],
  },
  'test-s7-horsepower': {
    locale: 'fr', room: 'Le garage', image: '/theatre/saw-vii-garage.jpg',
    imageDescription: 'Garage original : pont élévateur, caisses à outils, pile de pneus, palan et lampe au sodium.',
    object: 'La plaque de réduction',
    atmosphere: 'Le pont est vide. La plaque donne le régime du moteur et le rapport du réducteur.',
    zones: [
      { id: 'plaque', label: 'Plaque de réduction', position: [58, 40], description: 'La plaque donne 1 800 tr/min et un rapport de trois. La sortie se calcule.' },
      { id: 'pont', label: 'Pont élévateur', position: [50, 68], description: 'Le pont est consigné et vide. Aucune manœuvre n’est demandée.' },
      { id: 'outils', label: 'Caisses à outils', position: [24, 58], description: 'Les caisses sont fermées et inventoriées. Aucun outil n’est à utiliser.' },
      { id: 'pneus', label: 'Pneus', position: [80, 66], description: 'Les pneus sont empilés. Ils font partie du décor.' },
    ],
  },
  'test-s7-silence': {
    locale: 'fr', room: 'Le théâtre', image: '/theatre/saw-vii-theatre.jpg',
    imageDescription: 'Théâtre original : fauteuils de velours, scène nue, rideau fermé, panneau d’affiche et lampe de service.',
    object: 'L’affiche d’audience',
    atmosphere: 'La salle est vide. L’affiche annonce une audience datée et une vérification soixante-douze heures plus tard.',
    zones: [
      { id: 'affiche', label: 'Affiche', position: [76, 34], description: 'L’affiche donne la date d’audience et le délai. La vérification se déduit.' },
      { id: 'scene', label: 'Scène', position: [50, 34], description: 'La scène est nue. Aucun spectacle n’y est donné.' },
      { id: 'fauteuils', label: 'Fauteuils', position: [46, 76], description: 'Les fauteuils sont vides et alignés. Ils font partie du décor.' },
      { id: 'rideau', label: 'Rideau', position: [50, 16], description: 'Le rideau est fermé. Il ne cache aucun document.' },
    ],
  },
  'test-s7-lawnmower': {
    locale: 'fr', room: 'La cour arrière', image: '/theatre/saw-vii-cour.jpg',
    imageDescription: 'Cour arrière originale : herbe haute, cabanon, grillage, corde à linge et projecteur unique.',
    object: 'Le registre de charges',
    atmosphere: 'Le projecteur éclaire le cabanon. Le registre affiche quatre-vingt-seize mille inscrits et un seuil de cent cinquante mille.',
    zones: [
      { id: 'registre', label: 'Registre', position: [54, 52], description: 'Le registre donne la charge inscrite et le seuil. Le manque se calcule.' },
      { id: 'cabanon', label: 'Cabanon', position: [76, 44], description: 'Le cabanon est fermé. Il n’est pas à ouvrir.' },
      { id: 'grillage', label: 'Grillage', position: [24, 40], description: 'Le grillage est intact. Il ferme la cour sans proposer de passage.' },
      { id: 'projecteur', label: 'Projecteur', position: [20, 16], description: 'Le projecteur éclaire le centre de la cour. Il ne cache rien.' },
    ],
  },
  'test-s7-spike-cage': {
    locale: 'fr', room: 'L’entrepôt', image: '/theatre/saw-vii-entrepot.jpg',
    imageDescription: 'Entrepôt original : rayonnages hauts, palettes, chaînes suspendues, cadre de cage en acier et fenêtre haute.',
    object: 'Le compteur de descente',
    atmosphere: 'Le cadre de la cage est vide et immobile. Le compteur indique trois mètres en douze secondes.',
    zones: [
      { id: 'compteur', label: 'Compteur', position: [56, 48], description: 'Le compteur donne la distance et la durée. La vitesse se calcule dans la console.' },
      { id: 'cadre', label: 'Cadre de cage', position: [50, 28], description: 'Le cadre est vide. Il matérialise la salle sans représenter de personne.' },
      { id: 'palettes', label: 'Palettes', position: [24, 66], description: 'Les palettes sont empilées et inventoriées. Elles ne cachent aucune issue.' },
      { id: 'chaînes', label: 'Chaînes', position: [80, 30], description: 'Les chaînes sont immobiles. Aucune n’est à manœuvrer.' },
    ],
  },
  'test-s7-public-exec': {
    locale: 'fr', room: 'La place', image: '/theatre/saw-vii-place.jpg',
    imageDescription: 'Place publique originale : pavés mouillés, vitrine fermée, réverbères, bancs publics et échafaudage.',
    object: 'Les trois dépositions',
    atmosphere: 'La place est déserte. Trois dépositions sont affichées côte à côte sur le panneau municipal.',
    zones: [
      { id: 'depositions', label: 'Trois dépositions', position: [52, 46], description: 'Les dépositions diffèrent sur l’ordre, le contenu et le témoin. Une seule donne les trois.' },
      { id: 'bancs', label: 'Bancs', position: [26, 62], description: 'Les bancs sont vides. Ils font partie du décor.' },
      { id: 'reverberes', label: 'Réverbères', position: [78, 24], description: 'Les réverbères éclairent le panneau. Ils ne cachent aucune inscription.' },
      { id: 'vitrine', label: 'Vitrine', position: [24, 30], description: 'La vitrine est fermée. Aucune pièce n’y est exposée.' },
    ],
  },
  'test-s7-brazen-bull': {
    locale: 'fr', room: 'Le hangar', image: '/theatre/saw-vii-hangar.jpg',
    imageDescription: 'Hangar original : parois ondulées, pont roulant, four de brique, caisses empilées et lampe grillagée.',
    object: 'L’index du four',
    atmosphere: 'Le four est froid. L’index à deux arbres attend un total de vingt-quatre.',
    zones: [
      { id: 'index', label: 'Index', position: [52, 42], description: 'L’arbre gauche ajoute trois par cran, le droit deux. Le total demandé est vingt-quatre.' },
      { id: 'four', label: 'Four', position: [76, 58], description: 'Le four est éteint et consigné. Aucune mise à feu n’est demandée.' },
      { id: 'caisses', label: 'Caisses', position: [26, 66], description: 'Les caisses sont empilées et inventoriées. Elles ne contiennent aucun indice.' },
      { id: 'pont', label: 'Pont roulant', position: [50, 16], description: 'Le pont est à l’arrêt. Il fait partie du décor.' },
    ],
  },
  'test-s7-impalement-wheel': {
    locale: 'fr', room: 'La galerie', image: '/theatre/saw-vii-galerie.jpg',
    imageDescription: 'Galerie originale : cadres numérotés tournés vers le mur, parquet, verrière et banc unique.',
    object: 'Le compteur de tours',
    atmosphere: 'Les cadres sont retournés. Le compteur affiche huit tours en deux minutes.',
    zones: [
      { id: 'compteur', label: 'Compteur', position: [52, 54], description: 'Le compteur donne huit tours en deux minutes. Le rythme se calcule.' },
      { id: 'cadres', label: 'Cadres', position: [50, 30], description: 'Les cadres sont tournés vers le mur. Ils ne montrent aucune image.' },
      { id: 'banc', label: 'Banc', position: [26, 72], description: 'Le banc est vide. Il fait partie du décor.' },
      { id: 'verriere', label: 'Verrière', position: [50, 10], description: 'La verrière laisse passer une lumière froide. Elle n’éclaire pas les cadres.' },
    ],
  },
  'test-s7-wisdom-teeth': {
    locale: 'fr', room: 'Le cabinet', image: '/theatre/saw-vii-cabinet.jpg',
    imageDescription: 'Cabinet original : fauteuil vide, plateau d’instruments, bras de lampe, meubles, lavabo et carrelage.',
    object: 'Le registre de séance',
    atmosphere: 'Le fauteuil est vide. Le registre de séance porte une date, sans heure ni commentaire.',
    zones: [
      { id: 'registre', label: 'Registre de séance', position: [52, 58], description: 'Le registre donne la date du 12 avril 2024. Le code attend cette date.' },
      { id: 'fauteuil', label: 'Fauteuil', position: [50, 70], description: 'Le fauteuil est vide et relevé. Il situe le cabinet, sans proposer de soin.' },
      { id: 'plateau', label: 'Plateau', position: [28, 46], description: 'Le plateau est rangé et compté. Aucun instrument n’est à prendre.' },
      { id: 'lavabo', label: 'Lavabo', position: [80, 52], description: 'Le lavabo est sec. Il appartient au décor.' },
    ],
  },
  'test-jg-bucket-heads': {
    locale: 'fr', room: 'La salle de tri', image: '/theatre/saw-jg-tri.jpg',
    imageDescription: 'Salle de tri originale dans une grange : huit casiers à étiquettes, deux casiers vidés et consignés, sacs de toile empilés et poussière dans un rai de lumière.',
    object: 'Le bordereau des casiers',
    atmosphere: 'La grange a été aménagée en salle de tri. Le bordereau indique huit casiers de six étiquettes et deux casiers vidés.',
    zones: [
      { id: 'casiers', label: 'Huit casiers', position: [52, 40], description: 'Les casiers portent chacun six étiquettes. Deux ont été vidés et consignés ; le reste se compte.' },
      { id: 'bordereau', label: 'Bordereau', position: [54, 60], description: 'Le bordereau reprend le nombre de casiers et les deux retraits. C’est la pièce que la console demande de vérifier.' },
      { id: 'sacs', label: 'Sacs empilés', position: [24, 68], description: 'Les sacs sont fermés et inventoriés. Aucun n’est à ouvrir.' },
      { id: 'etiquettes', label: 'Étiquettes', position: [80, 32], description: 'Les étiquettes restent en place sur les casiers. Elles ne cachent aucune date.' },
    ],
  },
  'test-jg-chain-hangers': {
    locale: 'fr', room: 'La grange', image: '/theatre/saw-jg-grange.jpg',
    imageDescription: 'Grange originale : poutres hautes, deux chaînes de levage immobiles, trois chaises pliantes, bottes de paille et lumière par les lames du bardage.',
    object: 'Les trois dépositions',
    atmosphere: 'La grange est vide. Trois chaises pliantes font face aux poutres ; trois dépositions sont affichées entre elles.',
    zones: [
      { id: 'depositions', label: 'Trois dépositions', position: [52, 46], description: 'Les dépositions diffèrent sur l’auteur, le moment et le témoin. Une seule donne les trois.' },
      { id: 'chaines', label: 'Chaînes de levage', position: [50, 20], description: 'Les chaînes sont immobiles et vides. Aucune n’est à manœuvrer.' },
      { id: 'chaises', label: 'Chaises pliantes', position: [46, 74], description: 'Les chaises sont vides et alignées. Elles situent la salle, sans désigner personne.' },
      { id: 'paille', label: 'Bottes de paille', position: [80, 64], description: 'La paille est empilée contre le mur. Elle fait partie du décor.' },
    ],
  },
  'test-jg-poison-syringes': {
    locale: 'fr', room: 'L’infirmerie', image: '/theatre/saw-jg-infirmerie.jpg',
    imageDescription: 'Infirmerie originale de ferme : armoire métallique à neuf tiroirs numérotés, lit d’examen au drap plié, mur carrelé et plateau de flacons vides.',
    object: 'La grille des tiroirs',
    atmosphere: 'L’infirmerie est rangée. La grille affiche neuf tiroirs, de A-1 à C-3, et les exclusions laissées par la consigne.',
    zones: [
      { id: 'grille', label: 'Grille des tiroirs', position: [52, 40], description: 'La grille donne les neuf positions et les exclusions. Un seul tiroir de la rangée C reste libre.' },
      { id: 'armoire', label: 'Armoire', position: [76, 50], description: 'Les tiroirs sont fermés et étiquetés. Aucun n’est à ouvrir.' },
      { id: 'lit', label: 'Lit d’examen', position: [30, 66], description: 'Le lit est vide et refait. Il situe la salle, sans proposer de soin.' },
      { id: 'plateau', label: 'Plateau', position: [24, 40], description: 'Le plateau est rangé et compté. Aucun flacon n’est à prendre.' },
    ],
  },
  'test-jg-leg-wire': {
    locale: 'fr', room: 'L’atelier de réparation', image: '/theatre/saw-jg-atelier.jpg',
    imageDescription: 'Atelier original de grange : établi d’acier, bobines de câble, outils rangés sur une planche, lampe de travail suspendue et poussière dans l’air.',
    object: 'Le bordereau des pièces',
    atmosphere: 'L’établi est dégagé. Le bordereau donne un câble de quarante-deux mètres à répartir en sept longueurs égales.',
    zones: [
      { id: 'bordereau', label: 'Bordereau', position: [56, 52], description: 'Le bordereau donne la longueur totale et le nombre de parts. La mesure se calcule.' },
      { id: 'etabli', label: 'Établi', position: [50, 68], description: 'L’établi est vide et essuyé. Aucune pièce n’est à découper.' },
      { id: 'cable', label: 'Bobines de câble', position: [26, 60], description: 'Les bobines sont enroulées et inventoriées. Elles servent au calcul, pas à une manœuvre.' },
      { id: 'planche', label: 'Planche d’outils', position: [82, 32], description: 'Les outils sont rangés à leur place. Aucun n’est à utiliser.' },
    ],
  },
  'test-jg-silo': {
    locale: 'fr', room: 'Le silo', image: '/theatre/saw-jg-silo.jpg',
    imageDescription: 'Silo original : trémies coniques, plateforme de pesée avec bordereau, échelles d’acier et poussière dans un faisceau de lumière.',
    object: 'Les deux bordereaux',
    atmosphere: 'Le silo est vide. La plateforme porte une pesée datée et le bordereau du contrôle précédent, à retrouver.',
    zones: [
      { id: 'bordereaux', label: 'Bordereaux', position: [52, 54], description: 'La pesée est datée du 9 mai 2024 et le contrôle précédent a eu lieu 21 jours plus tôt. La date se déduit.' },
      { id: 'tremies', label: 'Trémies', position: [50, 26], description: 'Les trémies sont vides et consignées. Aucune n’est à manœuvrer.' },
      { id: 'balance', label: 'Plateforme de pesée', position: [30, 70], description: 'La plateforme est à l’arrêt. Elle sert au relevé, pas à une pesée réelle.' },
      { id: 'echelle', label: 'Échelles', position: [80, 30], description: 'Les échelles montent vers les trappes. Elles font partie du décor.' },
    ],
  },
  'test-jg-cycle': {
    locale: 'fr', room: 'Le hangar à machines', image: '/theatre/saw-jg-machines.jpg',
    imageDescription: 'Hangar original : machine démontée sur un élévateur, deux index dentés sur un panneau de commande, bidons d’huile et parois ondulées.',
    object: 'L’index à deux arbres',
    atmosphere: 'La machine est à l’arrêt. L’index à deux arbres attend un total de quinze.',
    zones: [
      { id: 'index', label: 'Index à deux arbres', position: [56, 44], description: 'L’arbre gauche ajoute trois par cran, le droit deux. Le total demandé est quinze.' },
      { id: 'machine', label: 'Machine démontée', position: [50, 64], description: 'La machine est sur son élévateur, capot ouvert. Aucune pièce n’est à remonter.' },
      { id: 'bidons', label: 'Bidons d’huile', position: [24, 58], description: 'Les bidons sont fermés et inventoriés. Aucun n’est à ouvrir.' },
      { id: 'paroi', label: 'Paroi ondulée', position: [82, 34], description: 'La paroi laisse passer un jour gris. Elle ne cache aucune inscription.' },
    ],
  },
  'test-jg-shotgun-keys': {
    locale: 'fr', room: 'Le vestiaire', image: '/theatre/saw-jg-vestiaire.jpg',
    imageDescription: 'Vestiaire original de grange : cinq patères avec clés étiquetées, banc de bois, casiers numérotés et ampoule nue.',
    object: 'Le bordereau des clés',
    atmosphere: 'Le vestiaire est vide. Cinq portemanteaux portent trois clés chacun ; deux clés ont été retirées et consignées.',
    zones: [
      { id: 'patere', label: 'Cinq patères', position: [52, 36], description: 'Les patères portent trois clés chacune. Deux clés manquent et sont consignées au bordereau.' },
      { id: 'bordereau', label: 'Bordereau', position: [56, 56], description: 'Le bordereau demande le nombre de clés restées accrochées. Le compte se fait dans la console.' },
      { id: 'banc', label: 'Banc', position: [46, 74], description: 'Le banc est vide. Il situe le vestiaire, sans proposer de geste.' },
      { id: 'casiers', label: 'Casiers', position: [82, 40], description: 'Les casiers sont fermés et numérotés. Aucun n’est à forcer.' },
    ],
  },
  'test-jg-laser-collars': {
    locale: 'fr', room: 'La salle des dossiers', image: '/theatre/saw-jg-dossiers.jpg',
    imageDescription: 'Salle d’archives originales au crépuscule : neuf boîtes grises sur des rayonnages, plan de classement au mur, classeurs sombres et lumière froide.',
    object: 'Le plan de classement',
    atmosphere: 'La salle est froide. Le plan affiche neuf boîtes, de A-1 à C-3, avec les exclusions de la consigne.',
    zones: [
      { id: 'plan', label: 'Plan de classement', position: [52, 34], description: 'Le plan donne les neuf positions et les exclusions. Une seule boîte de la rangée C reste consultable.' },
      { id: 'boites', label: 'Neuf boîtes', position: [48, 56], description: 'Les boîtes sont fermées et étiquetées. Aucune n’est à ouvrir hors de la boîte désignée.' },
      { id: 'classeurs', label: 'Classeurs', position: [82, 52], description: 'Les classeurs portent des numéros de dossier. Ils ne donnent pas la réponse.' },
      { id: 'lampe', label: 'Lampe froide', position: [22, 26], description: 'La lampe éclaire le plan. Elle ne cache aucune inscription.' },
    ],
  },
  'test-sp-tongue': {
    locale: 'fr', room: 'Le quai', image: '/theatre/saw-sp-quai.jpg',
    imageDescription: 'Quai de métro original, la nuit : piliers carrelés, tableau des départs, ligne de sécurité jaune, lumières vertes et bouche du tunnel.',
    object: 'Le registre de fréquence',
    atmosphere: 'Le quai est vide. Le tableau annonce un départ toutes les six minutes ; le registre demande combien de départs s’inscrivent en une heure.',
    zones: [
      { id: 'registre', label: 'Registre', position: [52, 54], description: 'Le registre donne l’intervalle et la durée. Le nombre de départs se calcule.' },
      { id: 'tableau', label: 'Tableau des départs', position: [50, 24], description: 'Le tableau affiche un départ toutes les six minutes. Aucune autre ligne n’est à lire.' },
      { id: 'voie', label: 'Voie', position: [50, 78], description: 'La voie est vide et éclairée. Elle fait partie du décor.' },
      { id: 'tunnel', label: 'Tunnel', position: [82, 44], description: 'La bouche du tunnel reste sombre. Aucun train n’est attendu pour la réponse.' },
    ],
  },
  'test-sp-finger': {
    locale: 'fr', room: 'Le vestiaire du commissariat', image: '/theatre/saw-sp-vestiaire.jpg',
    imageDescription: 'Vestiaire de commissariat original : banc de bois, casiers gris, panneau de formulaires imprimés et néon au plafond.',
    object: 'Le rapport déposé',
    atmosphere: 'Le vestiaire est vide. Le rapport porte une date de dépôt et renvoie à une audience qui l’a précédé de onze jours.',
    zones: [
      { id: 'rapport', label: 'Rapport', position: [54, 44], description: 'Le rapport est daté du 3 juin 2021, onze jours après l’audience. La date de l’audience se déduit.' },
      { id: 'casiers', label: 'Casiers', position: [82, 44], description: 'Les casiers sont fermés. Aucun n’est à ouvrir.' },
      { id: 'banc', label: 'Banc', position: [44, 74], description: 'Le banc est vide. Il situe le vestiaire, sans proposer de geste.' },
      { id: 'horloge', label: 'Horloge de service', position: [24, 22], description: 'L’horloge donne l’heure du service. Elle ne remplace pas la date du rapport.' },
    ],
  },
  'test-sp-skinning': {
    locale: 'fr', room: 'La savonnerie', image: '/theatre/saw-sp-savonnerie.jpg',
    imageDescription: 'Savonnerie originale : rangées de pains de savon sur claies, cuves d’acier, registre de production sur une table et hautes fenêtres poussiéreuses.',
    object: 'Le relevé de production',
    atmosphere: 'L’atelier tourne au ralenti. Le relevé donne deux cent quarante pains produits en huit heures.',
    zones: [
      { id: 'releve', label: 'Relevé', position: [52, 56], description: 'Le relevé donne la production et la durée. Le rythme horaire se calcule.' },
      { id: 'pains', label: 'Pains de savon', position: [48, 74], description: 'Les pains sont rangés sur les claies et comptés. Aucun n’est à déplacer.' },
      { id: 'cuves', label: 'Cuves', position: [78, 44], description: 'Les cuves sont froides et consignées. Aucune n’est à ouvrir.' },
      { id: 'fenetres', label: 'Fenêtres hautes', position: [24, 20], description: 'Les fenêtres laissent passer une lumière pâle. Elles ne cachent aucun document.' },
    ],
  },
  'test-sp-wax': {
    locale: 'fr', room: 'Le dépôt de cire', image: '/theatre/saw-sp-cire.jpg',
    imageDescription: 'Dépôt de cire original : blocs pâles empilés, bon de livraison posé sur une caisse, palettes de bois, porte froide et lampe unique.',
    object: 'Le bon de livraison',
    atmosphere: 'Le dépôt est froid. Le bon porte une livraison datée du 18 février 2021, cinq jours avant la fermeture.',
    zones: [
      { id: 'bon', label: 'Bon de livraison', position: [52, 58], description: 'Le bon donne la livraison et le délai avant fermeture. La date se déduit.' },
      { id: 'blocs', label: 'Blocs de cire', position: [44, 72], description: 'Les blocs sont empilés et inventoriés. Aucun n’est à déplacer.' },
      { id: 'palettes', label: 'Palettes', position: [80, 60], description: 'Les palettes sont vides et rangées. Elles font partie du décor.' },
      { id: 'porte', label: 'Porte froide', position: [22, 36], description: 'La porte est fermée. Elle ne cache aucune date.' },
    ],
  },
  'test-sp-shredder': {
    locale: 'fr', room: 'Le hall du commissariat', image: '/theatre/saw-sp-hall.jpg',
    imageDescription: 'Hall de commissariat original : comptoir d’accueil, grille de casiers de scellés au mur, sol de marbre et lumière bleue d’urgence.',
    object: 'Le plan des casiers',
    atmosphere: 'Le hall est désert. Le plan affiche neuf casiers, de A-1 à C-3, avec les exclusions de la consigne.',
    zones: [
      { id: 'plan', label: 'Plan des casiers', position: [54, 34], description: 'Le plan donne les neuf positions et les exclusions. Un seul casier de la rangée C reste ouvert.' },
      { id: 'casiers', label: 'Casiers de scellés', position: [50, 54], description: 'Les casiers sont fermés. Aucun n’est à ouvrir hors du casier désigné.' },
      { id: 'comptoir', label: 'Comptoir', position: [26, 64], description: 'Le comptoir est vide et rangé. Il situe le hall, sans proposer de geste.' },
      { id: 'portes', label: 'Portes vitrées', position: [82, 44], description: 'Les portes laissent voir la rue. Elles ne cachent aucun document.' },
    ],
  },
  'test-sp-puppet-strings': {
    locale: 'fr', room: 'La salle des scellés', image: '/theatre/saw-sp-scelles.jpg',
    imageDescription: 'Salle des scellés originale : étagères de boîtes scellées, grille de casiers numérotés, dossier ouvert sur une table d’acier et lumière basse.',
    object: 'Les trois dépositions',
    atmosphere: 'La salle est silencieuse. Trois dépositions sur le passé de Marcus Banks sont posées côte à côte.',
    zones: [
      { id: 'depositions', label: 'Trois dépositions', position: [54, 50], description: 'Les dépositions diffèrent sur le fait, la date et le témoin. Une seule donne les trois.' },
      { id: 'etageres', label: 'Boîtes scellées', position: [26, 44], description: 'Les boîtes sont scellées et étiquetées. Aucune n’est à ouvrir.' },
      { id: 'grille', label: 'Grille de casiers', position: [80, 38], description: 'La grille porte des numéros. Elle situe les scellés, sans donner la réponse.' },
      { id: 'table', label: 'Table d’acier', position: [50, 74], description: 'La table est dégagée. Le dossier y reste lisible pour la suite.' },
    ],
  },
  'test-sx-vacuum': {
    locale: 'fr', room: 'La salle d’examen', image: '/theatre/saw-sx-examen.jpg',
    imageDescription: 'Salle d’examen originale dans une clinique mexicaine : table d’examen au papier propre, armoire à tiroirs numérotés, tensiomètre au mur et lumière chaude à travers les stores.',
    object: 'Le registre de stock',
    atmosphere: 'La salle est vide et propre. Le registre porte trois mille six cents unités livrées et mille deux cents rendues.',
    zones: [
      { id: 'registre', label: 'Registre de stock', position: [52, 56], description: 'Le registre donne les livraisons et les retours. Le stock restant se calcule.' },
      { id: 'armoire', label: 'Armoire à tiroirs', position: [78, 46], description: 'Les tiroirs sont fermés et numérotés. Aucun n’est à ouvrir.' },
      { id: 'table', label: 'Table d’examen', position: [44, 66], description: 'La table est vide et refaite. Elle situe la salle, sans proposer de soin.' },
      { id: 'stores', label: 'Stores', position: [24, 26], description: 'Les stores laissent passer une lumière chaude. Ils ne cachent aucune inscription.' },
    ],
  },
  'test-sx-gigli': {
    locale: 'fr', room: 'Le bloc opératoire', image: '/theatre/saw-sx-bloc.jpg',
    imageDescription: 'Bloc opératoire original : table d’acier aux draps pliés, plateau d’instruments recouvert, murs carrelés et plafonnier allumé.',
    object: 'Le planning du bloc',
    atmosphere: 'Le bloc est vide. Le planning réserve quatre-vingt-dix minutes par intervention et six interventions sont programmées.',
    zones: [
      { id: 'planning', label: 'Planning', position: [54, 46], description: 'Le planning donne la durée unitaire et le nombre d’interventions. Le total se calcule.' },
      { id: 'table', label: 'Table d’opération', position: [50, 68], description: 'La table est vide et drapée. Aucun geste n’y est demandé.' },
      { id: 'plateau', label: 'Plateau', position: [26, 52], description: 'Le plateau est recouvert et inventorié. Aucun instrument n’est à prendre.' },
      { id: 'lampe', label: 'Plafonnier', position: [66, 16], description: 'Le plafonnier est allumé. Il éclaire la salle sans rien révéler.' },
    ],
  },
  'test-sx-pipebomb': {
    locale: 'fr', room: 'Le vestiaire du personnel', image: '/theatre/saw-sx-vestiaire.jpg',
    imageDescription: 'Vestiaire du personnel original : casiers étroits, banc de bois, contrat et pince à linge sur une étagère, ventilateur au plafond et lumière poussiéreuse.',
    object: 'Le contrat et son dossier',
    atmosphere: 'Le vestiaire sent la poussière chaude. Le contrat est daté du 7 avril 2023 et l’ouverture a suivi quarante-cinq jours plus tard.',
    zones: [
      { id: 'dossier', label: 'Contrat', position: [54, 44], description: 'Le contrat donne la signature et le délai avant ouverture. La date se calcule.' },
      { id: 'casiers', label: 'Casiers', position: [80, 44], description: 'Les casiers sont fermés. Aucun n’est à ouvrir.' },
      { id: 'banc', label: 'Banc', position: [44, 74], description: 'Le banc est vide. Il situe le vestiaire, sans proposer de geste.' },
      { id: 'ventilateur', label: 'Ventilateur', position: [26, 18], description: 'Le ventilateur tourne lentement. Il ne cache aucun document.' },
    ],
  },
  'test-sx-radiation': {
    locale: 'fr', room: 'La salle d’imagerie', image: '/theatre/saw-sx-imagerie.jpg',
    imageDescription: 'Salle d’imagerie originale : table de scanner inoccupée, négatoscope aux films vierges, ordonnance sur un bureau et plafonniers froids.',
    object: 'La prescription',
    atmosphere: 'La salle est froide. L’examen est daté du 12 septembre 2023 et la prescription le précède de quatre-vingt-seize heures.',
    zones: [
      { id: 'prescription', label: 'Prescription', position: [52, 54], description: 'La prescription et l’examen sont séparés par 96 heures. La date se déduit.' },
      { id: 'scanner', label: 'Table de scanner', position: [50, 72], description: 'La table est vide et propre. Aucun examen n’est à lancer.' },
      { id: 'negatoscope', label: 'Négatoscope', position: [78, 34], description: 'Les films sont vierges et rangés. Ils ne donnent pas la réponse.' },
      { id: 'bureau', label: 'Bureau', position: [24, 58], description: 'Le bureau est dégagé. Il situe la salle, sans proposer de soin.' },
    ],
  },
  'test-sx-bone-crusher': {
    locale: 'fr', room: 'La pharmacie', image: '/theatre/saw-sx-pharmacie.jpg',
    imageDescription: 'Pharmacie originale de clinique : étagères de boîtes blanches identiques, table de comptage avec registre, deux cartons vides au sol et plafonnier unique.',
    object: 'Le registre de la pharmacie',
    atmosphere: 'La pharmacie est rangée. Le registre compte dix-huit boîtes de vingt-quatre flacons et deux boîtes retirées.',
    zones: [
      { id: 'registre', label: 'Registre', position: [54, 54], description: 'Le registre donne les boîtes, les retraits et le reste. Le nombre de flacons se calcule.' },
      { id: 'etageres', label: 'Étagères', position: [48, 34], description: 'Les boîtes sont alignées et étiquetées. Aucune n’est à déplacer.' },
      { id: 'cartons', label: 'Cartons vides', position: [26, 68], description: 'Les cartons sont ouverts et consignés. Ils ne contiennent aucun indice.' },
      { id: 'comptoir', label: 'Table de comptage', position: [78, 62], description: 'La table est dégagée. Le relevé y reste lisible pour la suite.' },
    ],
  },
  'test-sx-blood-pit': {
    locale: 'fr', room: 'La cuve', image: '/theatre/saw-sx-cuve.jpg',
    imageDescription: 'Salle de cuve originale : grande citerne cylindrique, volants de vannes disposés en grille numérotée, passerelle d’acier et humidité sur le sol.',
    object: 'Le plan des vannes',
    atmosphere: 'La salle résonne. Le plan affiche neuf vannes, de A-1 à C-3, avec les exclusions de la consigne.',
    zones: [
      { id: 'plan', label: 'Plan des vannes', position: [52, 34], description: 'Le plan donne les neuf positions et les exclusions. Une seule vanne de la rangée C reste accessible.' },
      { id: 'vannes', label: 'Vannes', position: [50, 52], description: 'Les vannes sont fermées et consignées. Aucune n’est à manœuvrer.' },
      { id: 'cuve', label: 'Citerne', position: [44, 74], description: 'La citerne est vide et froide. Elle sert au décor, pas à une manœuvre.' },
      { id: 'passerelle', label: 'Passerelle', position: [80, 44], description: 'La passerelle est déserte. Elle ne mène à aucune issue.' },
    ],
  },
  'test-sx-gas-room': {
    locale: 'fr', room: 'Le local technique', image: '/theatre/saw-sx-technique.jpg',
    imageDescription: 'Local technique original d’usine : conduits de ventilation, panneau de contrôle à cadrans, trois formulaires pincés sur un tableau et lumière froide par une fenêtre grillagée.',
    object: 'Les trois formulaires',
    atmosphere: 'Le local est étroit. Trois versions d’un formulaire de consentement sont affichées l’une sous l’autre.',
    zones: [
      { id: 'formulaires', label: 'Trois formulaires', position: [54, 44], description: 'Les formulaires diffèrent sur le signataire, la date et l’explication. Un seul donne les trois.' },
      { id: 'conduits', label: 'Conduits', position: [50, 22], description: 'Les conduits sont fermés et consignés. Aucun n’est à ouvrir.' },
      { id: 'panneau', label: 'Panneau de contrôle', position: [24, 50], description: 'Le panneau est hors tension. Il n’est pas à manœuvrer.' },
      { id: 'fenetre', label: 'Fenêtre grillagée', position: [82, 30], description: 'La fenêtre donne sur les cuves. Elle ne cache aucun document.' },
    ],
  },
  'test-ledger-room-1': {
    room: 'The Ledger Room',
    image: '/ledger_room_bg.png',
    imageDescription: 'An archive room with a green computer terminal on a desk, filing cabinets to the right and shelves of paper behind it.',
    object: 'Signature terminal',
    atmosphere: 'Paper trails fill the archive. At the desk, a single green screen waits for a record to be acknowledged.',
    zones: [
      { id: 'terminal', label: 'Signature terminal', position: [35, 53], description: 'The monitor and keyboard form the room’s point of interaction. Listen to the current tape, then enter your response in the stage console below.' },
      { id: 'files', label: 'Filing cabinets', position: [78, 55], description: 'Rows of worn drawers and stacked folders frame the desk. These are the records behind this stage’s question of accountability.' },
      { id: 'archive', label: 'Paper archive', position: [47, 36], description: 'The shelves are crowded with unfiled documents. The room surrounds the terminal with the consequences of a paper trail.' },
    ],
  },
  'test-glass-confession-1': {
    room: 'The Glass Confession',
    image: '/glass_confession_bg.png',
    imageDescription: 'A dim industrial room with tall cracked mirrors, a central reflection, a wooden crate and an empty chair.',
    object: 'Mirror array',
    atmosphere: 'Reflections break the room into competing views. The central mirror draws the eye through the empty floor.',
    zones: [
      { id: 'mirrors', label: 'Mirror array', position: [49, 53], description: 'The mirrors give this stage its setting. Review the report options in the existing confession console below; examining the room does not select an answer.' },
      { id: 'chair', label: 'Empty chair', position: [72, 69], description: 'A lone chair faces into the mirrors. Its position keeps the focus on what can be seen, admitted or avoided.' },
      { id: 'light', label: 'Overhead light', position: [62, 16], description: 'Cold daylight enters through the roof and repeats across the glass. The reflections are part of the illustration, rather than additional puzzle clues.' },
    ],
  },
  'test-quiet-scale-1': {
    room: 'The Quiet Scale',
    image: '/quiet_scale_bg.png',
    imageDescription: 'A large suspended balance with two empty pans in an abandoned workshop, with tools and a window behind it.',
    object: 'Allocation balance',
    atmosphere: 'Two empty pans hang over the workshop floor. The room turns an abstract allocation into something that carries visible weight.',
    zones: [
      { id: 'balance', label: 'Allocation balance', position: [50, 44], description: 'The central balance represents this stage’s allocation. Use the existing fund slider in the console below to make your response.' },
      { id: 'left-pan', label: 'Left scale pan', position: [29, 79], description: 'One broad, empty pan hangs in the foreground. Its weight is symbolic; inspecting it does not move the allocation slider.' },
      { id: 'workshop', label: 'Workshop bench', position: [84, 75], description: 'Tools and work surfaces line the room behind the scales, placing the decision in the setting of the people affected by it.' },
    ],
  },
};

interface TheatreSceneProps {
  campaign: Campaign;
  tests: SymbolicTest[];
  currentTestIndex: number;
  completedTestIds: string[];
  subjectName?: string;
  isFinished: boolean;
  isPlayingTape: boolean;
  isPuzzleActive: boolean;
}

function SceneView({ scene }: { scene: OriginalScene }) {
  const french = scene.locale === 'fr';
  const [selectedId, setSelectedId] = useState(scene.zones[0].id);
  const detailId = useId();
  const selectedZone = scene.zones.find(zone => zone.id === selectedId) ?? scene.zones[0];

  return (
    <>
      <div className="theatre-scene__visual">
        <img className="theatre-scene__image" src={`${import.meta.env.BASE_URL}${scene.image.replace(/^\//, '')}`} alt={scene.imageDescription} />
        <div className="theatre-scene__image-label" aria-hidden="true"><Eye size={14} /> {french ? 'Vue de la pièce' : 'Room overview'}</div>
        {scene.zones.map((zone, index) => (
          <button
            key={zone.id}
            type="button"
            className={`theatre-scene__hotspot ${selectedId === zone.id ? 'is-selected' : ''}`}
            style={{ left: `${zone.position[0]}%`, top: `${zone.position[1]}%` }}
            aria-label={`${french ? 'Examiner' : 'Examine'} ${zone.label}`}
            aria-pressed={selectedId === zone.id}
            aria-controls={detailId}
            onClick={() => setSelectedId(zone.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <div className="theatre-scene__inspection">
        <div>
          <span className="theatre-scene__eyebrow"><ScanSearch size={15} /> {french ? 'Explorer la pièce' : 'Examine the room'}</span>
          <h3>{scene.object}</h3>
          <p>{scene.atmosphere}</p>
        </div>
        <div className="theatre-scene__zone-list" role="group" aria-label={french ? 'Points d’inspection de la pièce' : 'Room inspection points'}>
          {scene.zones.map((zone, index) => (
            <button
              key={zone.id}
              type="button"
              aria-pressed={selectedId === zone.id}
              aria-controls={detailId}
              className={selectedId === zone.id ? 'is-selected' : ''}
              onClick={() => setSelectedId(zone.id)}
            >
              <span className="theatre-scene__zone-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{zone.label}</span>
              {selectedId === zone.id && <Eye size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <div id={detailId} className="theatre-scene__detail" role="status" aria-live="polite" aria-atomic="true">
          <span className="theatre-scene__eyebrow">{french ? 'À examiner' : 'In view'}</span>
          <h4>{selectedZone.label}</h4>
          <p>{selectedZone.description}</p>
        </div>
        <p className="theatre-scene__inspection-note">{french ? 'Explorez librement. La réponse se saisit dans la console de l’étape.' : 'Room inspection is optional. Your response is made in the stage console.'}</p>
      </div>
    </>
  );
}

export function TheatreScene({ campaign, tests, currentTestIndex, completedTestIds, subjectName, isFinished, isPlayingTape, isPuzzleActive }: TheatreSceneProps) {
  const currentTest = tests[currentTestIndex];
  const scene = currentTest ? originalScenes[currentTest.id] : undefined;
  const french = scene?.locale === 'fr';
  const workspaceFamily = currentTest && !scene ? getTheatreWorkspaceFamily(currentTest.puzzleType) : undefined;
  const recordedCount = tests.filter(test => completedTestIds.includes(test.id)).length;
  const headingId = useId();
  const status = french
    ? isFinished ? 'Passation terminée' : isPlayingTape ? 'Écoutez le message' : isPuzzleActive ? 'Console de l’étape disponible' : 'Arbitrage disponible'
    : isFinished ? 'Run complete' : isPlayingTape ? 'Listen to the tape' : isPuzzleActive ? 'Stage console ready' : 'Decision ready';

  return (
    <section className="theatre-scene" aria-labelledby={headingId}>
      <header className="theatre-scene__header">
        <div>
          <span className="theatre-scene__eyebrow">{french ? `Fiction originale · ${campaign.title}` : scene ? 'Original fiction · Scene study' : workspaceFamily ? `Original theatre environment · ${workspaceFamily.label}` : 'Campaign theatre'}</span>
          <h1 id={headingId} tabIndex={-1}>{scene?.room ?? currentTest?.title ?? campaign.title}</h1>
          <p className="theatre-scene__location"><MapPin size={14} aria-hidden="true" /> {campaign.fictionalLocation || 'Campaign setting'}{scene && <span> / {scene.room}</span>}</p>
        </div>
        <div className="theatre-scene__stage-status">
          <span>{isFinished ? french ? 'Passation terminée' : 'Run complete' : `${french ? 'Étape' : 'Stage'} ${Math.min(currentTestIndex + 1, tests.length)} / ${tests.length}`}</span>
          <strong>{status}</strong>
          <a href="#theatre-stage-console"><ArrowDown size={15} aria-hidden="true" /> {french ? isFinished ? 'Voir la fin' : 'Ouvrir la console' : isFinished ? 'View ending' : 'Go to stage console'}</a>
        </div>
      </header>

      {scene ? (
        <div className="theatre-scene__room"><SceneView key={currentTest.id} scene={scene} /></div>
      ) : currentTest ? (
        <TheatreWorkspace key={`${currentTest.id}-${currentTest.puzzleType}`} campaign={campaign} test={currentTest} subjectName={subjectName} isFinished={isFinished} isPlayingTape={isPlayingTape} isPuzzleActive={isPuzzleActive} />
      ) : (
        <div className="theatre-scene__fallback">
          <div>
            <span className="theatre-scene__eyebrow"><ScanSearch size={16} /> Stage brief</span>
            <p>{campaign.objective || 'Review the campaign record below.'}</p>
          </div>
        </div>
      )}

      {currentTest?.sourceNote && (
        <aside className="theatre-scene__fidelity" aria-label={french ? 'Fiche de fidélité' : 'Fidelity note'}>
          <span className="theatre-scene__eyebrow"><FileText size={15} aria-hidden="true" /> {french ? 'Fiche de fidélité' : 'Fidelity note'}</span>
          <p>{currentTest.sourceNote}</p>
        </aside>
      )}

      <div className="theatre-scene__context">
        <div><span className="theatre-scene__eyebrow">{french ? isFinished ? 'Passation terminée' : 'Étape en cours' : isFinished ? 'Run complete' : 'Active stage'}</span><h2>{currentTest?.title ?? (isFinished ? 'Run complete' : 'No stage available')}</h2></div>
        <div><span className="theatre-scene__eyebrow">{french ? 'Interlocuteur' : 'Subject'}</span><p>{subjectName || 'Campaign participant'}</p></div>
        <div><span className="theatre-scene__eyebrow">{french ? 'Objet à examiner' : scene || workspaceFamily ? 'Object to examine' : 'Focus'}</span><p>{scene?.object ?? workspaceFamily?.object ?? campaign.moralTheme}</p></div>
      </div>

      <nav className="theatre-scene__route" aria-label={french ? 'Parcours de la campagne' : 'Campaign stage route'}>
        <div className="theatre-scene__route-heading"><span className="theatre-scene__eyebrow">{french ? 'Votre parcours' : 'Your route'}</span><span>{french ? `${recordedCount} sur ${tests.length} étapes consignées` : `${recordedCount} of ${tests.length} stages recorded`}</span></div>
        <ol>
          {tests.map((test, index) => {
            const completed = completedTestIds.includes(test.id);
            const active = !isFinished && index === currentTestIndex;
            const stageScene = originalScenes[test.id];
            return (
              <li key={test.id} aria-current={active ? 'step' : undefined} className={active ? 'is-current' : completed ? 'is-complete' : ''}>
                <span className="theatre-scene__route-number" aria-hidden="true">{completed ? <Check size={15} /> : String(index + 1).padStart(2, '0')}</span>
                <div><span className="theatre-scene__route-state">{french ? active ? 'Vous êtes ici' : completed ? 'Consignée' : 'À venir' : active ? 'You are here' : completed ? 'Recorded' : 'Ahead'}</span><strong>{test.title}</strong><span className="theatre-scene__route-room">{stageScene?.room ?? getTheatreWorkspaceFamily(test.puzzleType).room}</span></div>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
}
