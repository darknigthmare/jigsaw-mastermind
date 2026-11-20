# Jigsaw Mastermind — Bible du jeu

**Version 1.0 · 20 novembre 2026 · Référence jouable `574bb61`**

Cette bible fixe les règles de continuité, de conception des niveaux, de direction artistique et de recette du jeu. Elle s’adresse aux personnes qui écrivent une campagne, produisent un décor, intègrent un asset ou valident un build. Le [registre de la franchise](REFERENCES_FRANCHISE.md) donne les éditions et les sources de consultation des dix films et des deux jeux officiels.

## Vision

Jigsaw Mastermind est un jeu d’énigmes et de décisions dans des espaces industriels fictionnels. Le joueur observe un lieu, recoupe les indications qu’il contient et agit. Le lieu répond à son action par un changement visible et le bilan conserve ses choix. La Station met le joueur à hauteur des yeux. Le Théâtre lui donne le temps de lire, d’enquêter et de décider, avec une présentation illustrée.

| Pilier | Règle de conception | Observable en jeu |
| --- | --- | --- |
| Tension lisible | Une échéance, un enjeu compréhensible et un retour après l’action. | Le HUD nomme l’objectif. La console réagit. Le bilan indique la cause de la fin. |
| Enquête par l’espace | La fonction d’une pièce guide son plan, ses objets et les informations qu’on y trouve. | Le joueur repère l’entrée, le poste utile et la sortie. Une zone d’inspection décrit l’objet qu’elle désigne. |
| Conséquence | Un choix se répercute sur l’accès suivant, le dossier ou l’issue. | Le jeu mémorise le classement d’index, le diagnostic de l’atelier et les décisions du Théâtre. |
| Contrôles cohérents | Les mêmes intentions sont disponibles sur les commandes prises en charge. | Examiner, marcher, regarder, mettre en pause et rejouer restent accessibles sur clavier/souris et tactile. |

## Fidélité et continuité

Le **1:1 documentaire** exige une correspondance vérifiable entre un fait et l’édition de référence identifiée. Pour un personnage, cela couvre l’identité, le rôle observable, la tenue ou l’état dans la scène citée. Pour un lieu ou un accessoire, cela couvre le nom attesté, la fonction narrative, l’époque et les indices visuels visibles dans le plan. Une description adopte le point de vue et l’état de la scène. Par exemple, une apparition en souvenir reçoit le repère de l’événement remémoré et le repère du film qui le montre.

Le **1:1 de production** mesure la concordance entre un livrable original et son propre modèle approuvé. À caméra, pose et lumière comparables, la silhouette, l’échelle, les attaches visibles, les couleurs, le cadrage et la lisibilité suivent la fiche approuvée. La direction de jeu transpose les motifs documentés dans des décors, personnages, objets et interfaces originaux. Une épreuve physique représentée à l’écran devient en jeu une lecture d’indices, un choix, une séquence fictive ou un accessoire de décor inerte.

| Statut | Ce qu’il établit | Preuve minimale |
| --- | --- | --- |
| **Confirmé** | Un fait d’identité, de chronologie, de lieu ou de présentation. | Titre, édition ou plateforme, passage précis et source consultable. |
| **Observé** | Un détail relevé dans un plan ou une capture publiée. | Repère temporel ou numéro de capture, point de vue et lecture de ce qui est visible. |
| **Interprétation** | Une règle, une lecture ou une transposition pour le jeu. | Lien vers le motif documenté et choix de conception explicite. |
| **Original** | Un contenu propre à Jigsaw Mastermind. | Identifiant, dessin ou scène source, version du build et contrôle en jeu. |
| **À vérifier** | Un nom, une variante, un détail masqué ou une continuité encore incertaine. | Hypothèse formulée comme telle et prochaine preuve recherchée. |

Pour annoter un fait, utiliser dans l’ordre le film ou la version jouée, un communiqué ou manuel d’éditeur, puis une source éditoriale datée. Pour un lieu récurrent, relever au moins les vues qui expliquent une différence d’éclairage, d’état ou de point de vue. En cas d’écart entre un film et un jeu, garder les deux observations rattachées à leur média. Le libellé `canonStatus` dans un dossier local sert à son classement dans l’application. La preuve d’un fait réside dans le registre sourcé. [Types du projet](../src/types/index.ts) · [Registre de la franchise](REFERENCES_FRANCHISE.md)

## Périmètre jouable de référence

| Ensemble | Contenu au commit `574bb61` | Source de vérité |
| --- | --- | --- |
| Bibliothèque du Théâtre | 12 campagnes, 74 épreuves, 21 dossiers et 8 entrées de chronologie préchargés. Dix campagnes sont indexées par film et deux sont originales. | [Données préchargées](../src/services/preloadedData.ts) |
| Décors du Théâtre | Six salles dédiées. Les 68 autres épreuves préchargées emploient cinq environnements partagés selon leur famille d’énigme. | [Salles dédiées](../src/components/common/TheatreScene.tsx) · [Environnements partagés](../src/components/common/theatreWorkspaceData.ts) |
| Station FPS | Une carte Godot avec quatre espaces principaux, un atelier facultatif, onze pupitres et quatre portes d’accès. Visite et défi se jouent sur le même plan. | [Scène native](../godot-fps/station.tscn) · [Architecture](../godot-fps/scripts/station_layout.gd) · [Contrôleur de partie](../godot-fps/scripts/station_run.gd) |
| Archives des jeux officiels | Deux œuvres dans le registre documentaire. | [Fiches des jeux officiels](REFERENCES_FRANCHISE.md#jeux-officiels) |

Les quantités décrivent la bibliothèque fournie avec cette révision. Les ajouts, suppressions, réordonnancements et sauvegardes du joueur peuvent faire varier son contenu local. Le Théâtre consulte les épreuves de la campagne active. Une partie reprise conserve le contenu instantané qu’elle avait déjà chargé. [Résolution des parcours](../src/services/simulationRules.ts) · [État de la simulation](../src/context/AppContext.tsx)

## Station de contrôle · boucle FPS

**Entrée** · Tableau de bord → Lancer l’exploration → Commencer la visite ou Défi · 3 min.

Le trajet enchaîne quatre pièces. Les portes matérialisent les conditions d’accès. Le joueur peut revenir à un pupitre déjà visité pour relire son état. Le protocole d’évacuation demande de reconnaître la décision prise aux archives. Le joueur peut rejoindre le terminal de sortie dès que le protocole concordant est validé.

| Lieu | État à l’entrée | Action et conséquence | Repère de décor |
| --- | --- | --- | --- |
| Sas d’accueil | Aucun accès acquis. | Prendre le badge à gauche. Le plan se consulte à droite. Le badge libère la galerie. | Accueil bleu gris, mobilier de service et axe central. |
| Galerie technique | Badge validé. | Choisir stabilité ou économie. Les pupitres réagissent au choix. Le relais ouvre les archives. | Vert sourd, panneau technique, rack et conduits en périphérie. |
| Archives | Relais actif. | Restaurer l’index par salle ou par fonction. Le choix ouvre le poste d’évacuation et détermine le protocole juste. | Ambre, classement, desserte et tiroirs. |
| Poste d’évacuation | Index restauré. | Choisir le protocole correspondant, puis valider au pupitre du fond. Le bilan reprend le résultat et le temps de jeu. | Ardoise et ivoire, mobilier de supervision, réserve, signalétique suivant l’axe de sortie. |
| Atelier facultatif | Accessible par la galerie et les archives. Le relais autorise le diagnostic. | Relever le registre ORION, puis vérifier le témoin correspondant. Le passage intérieur s’ouvre et le bilan garde la trace du détour. | Ardoise mauve, cuivre assourdi, établi et baie latérale. |

En visite, le chronomètre affiche le temps écoulé. En défi, l’échéance de 180 secondes de jeu actif est mesurée sur une horloge monotone. La pause suspend le temps. À l’expiration, le bilan conserve les objectifs acquis et permet de rejouer dans le même mode ou de revenir au choix du mode. Une nouvelle traversée remet à zéro badge, portes, décisions et diagnostic. [Gestion de la partie](../godot-fps/scripts/station_run.gd)

L’état et le bilan FPS restent en mémoire pendant la session. Quitter ou recharger la Station ramène au départ. Le Théâtre dispose de sa propre reprise et de ses rapports locaux. [Intégration de la Station](../src/views/StationMode.tsx) · [État du Théâtre](../src/context/AppContext.tsx)

**Interactions** · ZQSD ou WASD pour marcher, souris ou flèches pour regarder, E pour examiner, P ou Échap pour mettre en pause. Au toucher, la partie gauche de la vue sert au déplacement, la droite au regard. Les boutons Examiner et Pause restent visibles en jeu. Un pupitre exige une distance maximale de 2,7 m, un regard suffisamment aligné et une ligne de vue dégagée. Texte, position et forme portent l’état d’accès en plus de la couleur. [Contrôleur du joueur](../godot-fps/scripts/station_player.gd) · [Ciblage](../godot-fps/scripts/station_run.gd)

**Plan du niveau** · Sol de référence à `y=0`, trajet principal vers `−Z`, axe central libre. Capsule de 0,28 m de rayon et 1,72 m de hauteur, caméra à 1,62 m et FOV de 76°. Cloisons principales avec passage libre de 2,4 × 2,8 m lorsque leur porte est ouverte. Les baies de l’atelier sont à l’est. La construction conserve le sol et le dégagement aux jonctions de pièces et autour des approches de pupitres. [Implantation](../godot-fps/scripts/station_layout.gd) · [Contrôleur du joueur](../godot-fps/scripts/station_player.gd)

**Intégration web** · Godot porte l’état de la partie. Le plan React écoute les événements passifs de l’iframe de même origine. L’ordre principal est `badge → relais → index → evacuation → finished`. La progression de l’atelier suit `registre → atelier` après le relais. Vérifier le compteur, le résultat, l’ancienne iframe après rechargement et le retour au bouton de lancement. [Service de progression](../src/services/stationProgress.ts) · [Vue d’intégration](../src/views/StationMode.tsx)

## Théâtre · boucle enquête et décisions

**Entrée** · Tableau de bord → campagne prête → Simulate, ou campagne sélectionnée dans l’éditeur → lecture.

Chaque étape présente un lieu, le participant concerné et un message. Le joueur peut examiner le décor et lire les indices, puis donner sa réponse dans la console. Une réponse valide déverrouille les décisions. Une réponse refusée coûte du temps et laisse un retour lisible. Le compteur de tentatives et l’échéance déterminent le passage dans la branche de repli. Les décisions affectent les scores bornés de responsabilité, vérité, empathie, courage, déni, coopération et acceptation. La fin peut découler d’une branche explicite, d’une fin dédiée à la campagne ou d’un calcul de scores. Le rapport enregistre les décisions et l’issue. [Simulation et sauvegarde](../src/context/AppContext.tsx) · [Calcul des scores](../src/services/moralEngine.ts)

Le champ `startedAt` des rapports du Théâtre vaut actuellement la date de fin moins cinq minutes. Les mesures de durée pour la recette se font depuis le lancement réel du parcours. Les constantes physiologiques affichées dans le Théâtre appartiennent à la simulation. [Construction des rapports](../src/context/AppContext.tsx)

| Forme d’épreuve | Contrôle attendu | Exigence d’écriture |
| --- | --- | --- |
| Date | Calendrier natif pour une date valide. | Déduire une seule date à partir des informations montrées. |
| Réponse libre | Saisie au clavier pour une valeur ou un mot. | Montrer le format d’entrée et la précision attendue. |
| Confession | Options de déclaration et validation. | Donner les éléments permettant de distinguer une option conforme. |
| Coordonnées | Grille de A-1 à C-3 et confirmation. | Définir les axes et les entrées. Relier les libellés au décor de l’étape. |
| Engrenages symboliques | Deux réglages et un total. | Choisir une cible atteignable avec les plages du contrôle. |
| Allocation | Curseur et valeur numérique exacte lorsque l’épreuve les emploie. | Afficher les unités, la borne et la consigne de validation. |
| Décision directe | Choix narratifs disponibles immédiatement. | Consigner les effets et la conséquence de chaque branche. Une réponse configurée impose d’abord sa résolution. |

Les valeurs de référence restent dans la configuration d’épreuve. Les images, points d’inspection et messages guident vers l’information qui permet de raisonner. La réponse est validée par la console. Les éditeurs conservent les ID, les effets, les indices, le type de contrôle et l’ordre des étapes. Les preuves de compatibilité couvrent une bibliothèque précédente, une interruption de mise à jour, les suppressions choisies et la restauration d’une bibliothèque chiffrée complète. [Moteur d’énigmes](../src/services/simulationRules.ts) · [Éditeur](../src/views/TestDesigner.tsx) · [Sauvegarde locale](../src/services/db.ts) · [Tests du Dernier Relais](../src/__tests__/dernierRelais.test.tsx)

### Campagne de référence · Le Dernier Relais

Le centre des Aulnes ferme au crépuscule. Noé retrouve le bordereau aux archives. Inès fait vérifier la bonne caisse dans l’atelier. Samir calcule et attribue au comptoir le solde de clôture. Le couloir vitré raccorde les trois étapes, dont les éclairages, la signalétique et les objets suivent la même identité de lieu.

| Étape | Objectif | Transformation du dossier | Signe visuel |
| --- | --- | --- | --- |
| Bureau des archives | Déduire la date du bordereau. | Transmettre le document vérifiable ou un résumé. | Agenda, boîte, poste d’écoute et dossiers. |
| Atelier du couloir vitré | Identifier le casier à partir d’un inventaire. | Conserver la vérification d’Inès ou transmettre la caisse seule. | Grille de casiers, radio, armoire et établi. |
| Comptoir de restitution | Calculer le solde avant son attribution. | Répartir le solde ou le réserver. | Bacs, dossiers, radio et vitres sombres. |

Les trois issues de référence sont **Le relais est transmis**, **Une transmission sous réserve** et **La clôture laisse une dette**. Les choix des deux premières étapes déterminent ce que le dossier final permet de vérifier. Les trois salles disposent d’une illustration carrée et de quatre points d’inspection chacune. [Campagne et fins](../src/services/dernierRelaisData.ts) · [Points d’inspection](../src/components/common/TheatreScene.tsx)

**Parcours de recette.** Valider `2028-10-10` aux archives, `C-2` à l’atelier et `270` au comptoir. Joindre le bordereau, conserver la vérification d’Inès et répartir le solde également doit produire « Le relais est transmis » avec trois décisions consignées. Contrôler ensuite le rapport local et le retour vers le Tableau de bord. [Scénario automatisé](../src/__tests__/dernierRelais.test.tsx)

## Direction artistique et sonore

- **Volumes et échelle.** Donner une fonction à chaque zone utile avant son habillage. Grouper les lignes de fuite, le pupitre et l’éclairage autour de l’objectif. Dimensionner poignées, assises, tiroirs et dossiers par rapport au corps du joueur. Faire lire l’objet de face, de trois quarts et à la distance d’action. [Mobilier de la Station](../godot-fps/scripts/station_dressing.gd) · [Mobilier d’évacuation](../godot-fps/scripts/station_evacuation_dressing.gd)
- **Matières et lumière.** Réserver le point lumineux principal à l’objet à examiner ou au prochain seuil. Les surfaces portent des variations de rugosité et d’usure aux contacts. Les repères de pièce combinent valeur, matière, texte et couleur. Les trois salles des Aulnes partagent un bleu de fin de journée, du cuivre assourdi et des lampes chaudes à hauteur de travail. [Décors du Théâtre](../public/theatre/) · [Palette et lumières Godot](../godot-fps/scripts/station_layout.gd)
- **Interface.** Hiérarchie dans l’ordre objectif, retour d’action, progression, commandes. Vue subjective avec viseur libre, HUD compact et plan consultable. Au Théâtre, le raccourci ouvre la console de l’étape et les zones restent accessibles via leur liste de boutons. Les éléments importants conservent un libellé et un accès clavier. [Styles du Théâtre](../src/components/common/TheatreScene.css) · [Styles Station](../src/views/StationMode.css)
- **Son.** Le message et son texte sont la première source d’information. Appuyer l’écoute, la validation et l’urgence par des sons distincts. Une décision doit rester compréhensible son coupé. Utiliser les synthèses et lecteurs du projet comme base, avec une identité sonore adaptée à chaque campagne. [Lecteur de bande](../src/components/common/TapePlayer.tsx) · [Synthèse sonore](../src/services/sound.ts)
- **Personnages.** La fiche relie ce que l’on sait du personnage à son rôle jouable. Pour un protagoniste original, donner une silhouette, une tenue et une posture liées à sa fonction, son environnement et l’état de la scène. Le dossier distingue un fait biographique, une motivation d’écriture et un choix du joueur. [Schéma des dossiers](../src/types/index.ts) · [Dossiers des Aulnes](../src/services/dernierRelaisData.ts)

## Production des niveaux et des assets

1. **Indexer.** Choisir l’édition de référence et capturer les observations utiles sur fiche. Établir le rôle de l’objet ou de l’espace dans le parcours. Fixer les éléments originaux dans un dessin ou un modèle interne daté.
2. **Bloquer le parcours.** Placer départ, repère visuel, aire d’interaction, portes et retour. Dessiner le chemin direct, les embranchements et les zones de reprise. Vérifier sol, capsule et lignes de vue avant habillage.
3. **Construire.** Livrer proportions, silhouette puis détails visibles à la distance réelle du joueur. Séparer collision, visuel et état interactif. Employer des matériaux partagés et regrouper les objets répétitifs. Pour les imports 3D futurs, conserver la source d’édition et l’export reproductible.
4. **Comparer.** Capturer la vue à hauteur des yeux, le détail près du pupitre et les approches latérales. Aligner la pose, l’angle, le cadrage et la lumière sur le concept approuvé. Relever pour chaque dimension sa valeur de référence, sa valeur mesurée et la tolérance convenue. Corriger les écarts qui affectent l’échelle, la silhouette, la lecture ou l’interaction.
5. **Intégrer.** Jouer la scène à l’entrée habituelle. Vérifier les portées, la navigation, l’état après rejet, victoire, expiration et remise à zéro. Pour les images du Théâtre, vérifier fichier, affichage, texte de remplacement, points d’inspection et étape suivante.
6. **Livrer.** Mettre à jour la fiche et le registre. Reporter la révision du code, la version d’export et la preuve de recette. Inscrire les zones d’incertitude avec la prochaine mesure.

### Fiche reproductible

| Champ | À renseigner |
| --- | --- |
| Identité | ID stable, nom affiché, famille, niveau et propriétaire. |
| Provenance | Média et édition, URL, plan ou timecode, date de consultation, statut, origine et droits de l’asset. Pour une création, lien vers le concept ou le fichier maître. |
| Fonction | Ce que le joueur voit, fait et comprend. États prêts, refusés et accomplis. Dépendances et retour en arrière. |
| Dimensions | Unités, axes, pivot, échelle, volumes réservés, points d’interaction et d’observation. |
| Rendu | Vue de référence approuvée, silhouette avant et profil, matière et éclairage. Format, résolution, matériaux, UV et nombre de triangles ou d’instances mesurés lorsque pertinent. |
| Intégration | Chemin source et chemin runtime, collision, regroupement, budget de scène, visibilité et état animé. Version et empreinte si export binaire. |
| Recette | Vue attendue et capture en jeu, clavier et tactile, mesures de géométrie, taille de fichier et temps de frame sur environnement déclaré. Les chiffres cibles et constatés ont leur propre valeur. |

Une fiche de **niveau** complète ces champs par l’arrivée, le chemin critique, le chemin optionnel, les portes et prérequis, les lieux de lecture, le chronomètre et les issues. Une fiche d’**épreuve** ajoute son indice, la réponse et les essais de refus, son embranchement de repli et le bilan. Une fiche d’**interface** ajoute le focus, la taille de la zone active, le contraste et les états au chargement et à la reprise.

**Fiche remplie · `evac_inventory`.** Pupitre original du protocole par fonction. Dans le repère Godot, son implantation en mètres est `Vector3(2.45, 0, -26.2)`. Son corps mesure 0,82 × 1,50 × 0,56 m et son collider 0,84 × 1,52 × 0,60 m. Le panneau oriente la lecture vers l’allée. La recette place la capsule à `Vector3(0.5, 0.04, -26.2)`, vérifie l’accès à la cible, puis le refus après index par salle et la validation après index par fonction. [Source du pupitre](../godot-fps/scripts/station_run.gd) · [Recette native](../godot-fps/tests/station_route_test.gd)

### Contrats techniques du projet

| Support | Source et format livrés | Contrôles |
| --- | --- | --- |
| Godot 4.6.3 | Scène et GDScript dans `godot-fps/`. Architecture, habillage, joueur et logique de partie ont des sources dédiées. Le build Web charge le PCK et le moteur compilé de `public/godot-station/`. | Recompiler après modification native, comparer le PCK servi, contrôler l’export dans le navigateur. |
| Géométrie native | Maillages procéduraux, chanfreins et matériaux Godot partagés. Le béton utilise un grain 64 × 64 généré en mémoire et projeté en triplanaire. Les répétitions d’habillage se regroupent en MultiMesh. L’évacuation ajoute 228 pièces en 8 lots d’instances. | Examiner les faces près de la caméra et la collision au rayon du joueur. Pour une modification lourde, mesurer appels de rendu, mémoire et temps de frame sur la scène concernée. |
| Théâtre | Illustrations WebP ou PNG d’origine conservées dans `public/`. Les trois images du Dernier Relais livrées mesurent 1254 × 1254 px. La scène associe image, texte et points d’inspection à l’ID de l’épreuve. | Tester le chargement vers le chemin de base configuré. Vérifier le centrage du repère sur l’objet et l’absence de débordement. |
| État web | React, données de campagne et réglages locaux. Import/export JSON et coffre chiffré dans le navigateur. Les identifiants assurent reprise, déduplication et compatibilité. | Ouvrir une ancienne sauvegarde, reprendre une partie, exporter puis réimporter et vérifier les branches et suppressions. |

Les valeurs du build de référence servent de mesures initiales. L’acceptation d’un nouvel asset repose sur sa lisibilité et sur le coût de la scène complète aux appareils et réglages déclarés. Les budgets de géométrie et de rendu sont à chiffrer selon le nombre d’objets visibles, le format cible et les mesures prises. [Export](../scripts/export-station.sh) · [Presets Godot](../godot-fps/export_presets.cfg) · [Build Web](../package.json)

Le dossier du moteur Web pèse 38,21 Mo sur disque, dont 37,70 Mo pour le WASM. Les huit illustrations WebP du Théâtre pèsent 2,05 Mo au total. Ces tailles sont les valeurs brutes du build de référence. Le transfert réel dépend du serveur et de sa compression. Les temps de frame et la mémoire graphique demandent des relevés sur appareil identifié. [Moteur Web livré](../public/godot-station/) · [Images du Théâtre](../public/theatre/)

## Recette et définition de terminé

| Cas | Critère d’acceptation | Preuve du build de référence |
| --- | --- | --- |
| Station, trajet direct | Badge, relais, index, bon protocole et sortie s’enchaînent. Sortie et mauvais protocole restent refusés aux états prévus. | Test natif avec interactions et balayages de capsule. |
| Station, atelier | Registre et témoin suivent le relais, la porte intérieure s’ouvre, les archives restent atteignables. La remise à zéro efface le détour. | Test natif. Le passage et le reset ont aussi été parcourus dans Chromium sur l’export précédent. |
| Station, défi | Départ à 03:00, temps actif, pause qui fige la mesure, expiration à 0 et bilan conservant les objectifs. | Test natif de la machine d’états. En Chromium, départ tactile et expiration réelle mesurée à 180,15 s sur le PCK final. |
| Station, commandes | Déplacement, regard, interaction, pause, retour et redémarrage restent opérables. Le HUD laisse le viseur dégagé. | Tests natifs à tailles contraintes, plan web vérifié à 320/390/1440 px et écran d’expiration à 390 px. |
| Théâtre, épreuve | Prompt, réponse, contrôle et indices concordent. Une mauvaise réponse donne un retour et une validation autorise la décision. | Tests de contrôle et de contexte. Trois formes testées jusqu’à la fin dans Chromium sur Le Dernier Relais. |
| Théâtre, mise en scène | Les trois illustrations chargent, les repères sont utilisables, l’ordre des étapes et les décisions apparaissent au bilan. | Parcours réel jusqu’à « Le relais est transmis », trois étapes consignées et écran final à 390 px. |
| Migration et sauvegarde | L’installation additive est idempotente. La restauration préserve les modifications et suppressions choisies, avec coffre chiffré complet inclus. | Tests de stockage, écritures interrompues et aller-retour chiffré. |
| Référence documentaire | Chaque affirmation exacte renvoie à une édition et à une preuve. Les adaptations et les cas incertains gardent leur statut visible. | Relecture des fiches et du registre à chaque livraison concernée. |

Commandes depuis la racine du dépôt.

```sh
npm test
npm run lint
npm run build
npm run station:test
GODOT_RUNTIME_DIR=/chemin/vers/runtime-godot npm run station:export
```

Le build `574bb61` a passé **95 tests web** et **83 contrôles natifs Godot**. Le PCK final mesure 79 912 octets et porte l’empreinte SHA-256 `899b5643f946b8bdb2d20dafa8301f69a226fbc966d408cbef8182105d1186a0`. Les tests Godot placent le joueur près des cibles et vérifient collisions, ordre des interactions et états. Les parcours navigateur s’effectuent par les commandes du jeu, avec mesure et captures de l’export servi. Une prochaine recette archivera pour chaque cas la révision, l’export, l’appareil ou le viewport, le parcours et le résultat observé. [Tests natifs](../godot-fps/tests/station_route_test.gd) · [Tests web](../src/__tests__/) · [Guide de lancement](../README.md)
