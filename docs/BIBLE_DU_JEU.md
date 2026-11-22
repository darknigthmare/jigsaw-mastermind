# Jigsaw Mastermind — Bible du jeu

**Version 2.0 · 21 novembre 2026 · Référence jouable `86280ba`**

> **Note de version.** Cette bible remplace la v1.0 commitée le 20 novembre 2026 et la v3 locale restée non commitée. Elle décrit d’abord le **build réellement livré** : la Station de contrôle en FPS et le Théâtre d’enquête. L’Architecte, la Régie et la Victime sont conservés comme **extension de conception**, clairement séparée de ce qui est jouable aujourd’hui.

## 0. Comment lire cette bible

Chaque élément porte l’un des trois statuts suivants :

| Statut | Signification | Preuve attendue |
| --- | --- | --- |
| **LIVRÉ** | Présent dans le build de référence `86280ba`. | Fichier, scène, test ou parcours vérifiable. |
| **PROTOTYPE** | Présent dans l’application React, mais pas encore au niveau de finition du build. | Code, écran, test partiel. |
| **EXTENSION** | Direction de conception non implémentée. | Fiche, backlog, critère d’acceptation. |

**Règle :** une idée EXTENSION ne doit jamais être présentée comme une fonction LIVRÉE. Une promesse de communication, une page de vente ou un trailer doivent citer le statut réel.

**Sources de vérité, dans l’ordre :**

1. Le code et les tests du commit `86280ba`.
2. La présente bible.
3. Le [registre des références](REFERENCES_FRANCHISE.md) pour les faits documentaires.
4. Les archives et notes de production, datées.

---

## 1. Vision et promesse

**Jigsaw Mastermind** est un jeu d’énigmes et de décisions dans des espaces industriels fictionnels. Le joueur observe un lieu, recoupe les indications qu’il contient et agit. Le lieu répond par un changement visible, et le bilan conserve ses choix.

Le build livré repose sur **deux piliers complémentaires** :

| Pilier | Forme | Ce que le joueur fait | Ce qu’il ressent |
| --- | --- | --- | --- |
| **Station de contrôle** | FPS d’exploration | Se déplacer, examiner, déverrouiller des accès, choisir un protocole | La pression d’un lieu qui réagit et d’une horloge |
| **Théâtre** | Enquête illustrée, choix et énigmes | Lire une cassette, inspecter une salle, répondre, décider | Le poids d’une décision et la vérification des traces |

**Promesse :** un jeu de tension lisible, sans course à l’armement, où comprendre le lieu vaut mieux que cliquer vite.

### 1.1 Les sept chiffres du build

| Élément | Valeur |
| --- | ---: |
| Campagnes préchargées | 14 |
| Épreuves préchargées | 87 |
| Dossiers de personnages | 29 |
| Entrées de chronologie | 8 |
| Salles dédiées du Théâtre | 66 |
| Environnements partagés | 5 |
| Objectifs de la Station | 5 |

### 1.2 Ce que le jeu n’est pas

- Pas un shooter : aucune arme à feu, aucun combat.
- Pas un monde ouvert : des lieux fermés, des parcours lisibles.
- Pas un multijoueur compétitif.
- Pas un manuel de fabrication : aucune instruction réelle, aucun plan, aucune cote, aucune procédure.
- Pas un outil de surveillance : les caméras et les constantes vitales du Théâtre sont fictives.
- Pas un jeu qui reproduit un mécanisme physique de film : les épreuves sont transposées en enquête, choix, séquence fictive ou décor inerte.

---

## 2. Piliers de conception

| Pilier | Règle | Observable en jeu |
| --- | --- | --- |
| **Tension lisible** | Une échéance, un enjeu compréhensible, un retour après l’action. | Le HUD nomme l’objectif ; la console réagit ; le bilan indique la cause de la fin. |
| **Enquête par l’espace** | La fonction d’une pièce guide son plan, ses objets et ses informations. | Le joueur repère l’entrée, le poste utile et la sortie. Une zone d’inspection décrit l’objet désigné. |
| **Conséquence** | Un choix se répercute sur l’accès suivant, le dossier ou l’issue. | Le jeu mémorise l’index, le diagnostic de l’atelier et les décisions du Théâtre. |
| **Contrôles cohérents** | Les mêmes intentions restent disponibles sur clavier, souris, manette et tactile. | Examiner, marcher, regarder, mettre en pause et rejouer sont accessibles. |
| **Double lecture** | Le lieu se comprend à hauteur des yeux et dans ses documents. | La Station montre l’espace ; le Théâtre montre les traces et les dossiers. |
| **Rituel sobre** | La mise en scène suggère sans imiter un film. | Cassette, silence, lumière, bilan. Aucun dialogue recopié. |

### 2.1 Boucle de la Station

```text
Tableau de bord → Lancer l’exploration → Visite ou Défi
  → Sas (badge) → Galerie (relais) → Archives (index)
  → Poste d’évacuation (protocole) → Terminal de sortie
  → Bilan → Rejouer ou revenir au tableau de bord
```

**Boucle optionnelle :** Galerie → Atelier (registre + témoin) → Archives, pour un détour qui ouvre un passage intérieur et laisse une trace au bilan.

### 2.2 Boucle du Théâtre

```text
Tableau de bord → Campagne prête → Simulate
  → Étape : lieu + participant + cassette
  → Inspecter → Lire les indices → Répondre
  → Décision → Étape suivante
  → Fin → Rapport local
```

### 2.3 Boucle de l’extension Jigsaw

```text
Repérage → Preuve → Conception → Cassette → Enlèvement abstrait
  → Lancement → Régie → Récupération de la pièce → Chapitre suivant
```

Cette boucle n’est pas dans le build. Elle est décrite au §7.

---

## 3. Fidélité, continuité et sécurité

### 3.1 Deux fidélités distinctes

Le mot « 1:1 » ne veut pas dire « reproduire un mécanisme de film ». Il désigne deux contrôles différents :

| Fidélité | Ce qu’elle vérifie | Exemple |
| --- | --- | --- |
| **Documentaire** | Un fait, un nom, une chronologie, un lieu ou un accessoire correspond à l’édition citée. | « Saw X se situe entre Saw et Saw II » avec le synopsis officiel. |
| **De production** | Un livrable original correspond à son propre modèle approuvé. | Une silhouette, une échelle, une couleur et un cadrage conformes à la fiche validée. |

**Conséquence :** une épreuve physique vue dans un film devient, dans le jeu, une **lecture d’indices**, un **choix**, une **séquence fictive** ou un **accessoire de décor inerte**. Le jeu ne fournit jamais de plan, de cote, de matériau ou de procédure.

### 3.2 Statuts de preuve

| Statut | Ce qu’il établit | Preuve minimale |
| --- | --- | --- |
| **Confirmé** | Un fait d’identité, de chronologie, de lieu ou de présentation. | Titre, édition ou plateforme, passage précis, source consultable. |
| **Observé** | Un détail relevé dans un plan ou une capture publiée. | Repère temporel ou numéro de capture, point de vue, lecture du visible. |
| **Interprétation** | Une règle ou une transposition pour le jeu. | Lien vers le motif documenté et choix de conception explicite. |
| **Original** | Un contenu propre à Jigsaw Mastermind. | Identifiant, dessin ou scène source, version du build, contrôle en jeu. |
| **À vérifier** | Un nom, une variante ou une continuité encore incertaine. | Hypothèse formulée comme telle et prochaine preuve recherchée. |

L’ordre de consultation est : film ou version jouée, communiqué ou manuel d’éditeur, puis source éditoriale datée. En cas d’écart entre un film et un jeu, les deux observations restent rattachées à leur média.

### 3.3 Sécurité et cadre fan game

- Fan game **gratuit et non commercial**.
- Aucun asset extrait d’un film, d’un jeu officiel ou d’un site de rips.
- Aucune instruction de fabrication, de surveillance, d’enlèvement ou de blessure.
- Aucune adresse, aucun nom de personne réelle, aucune cible réelle.
- Les contenus sensibles sont signalés avant l’épreuve.
- Le registre des assets consigne source, licence, auteur et date.

**Test de sécurité éditoriale :** si un texte permet à un lecteur de reproduire une action réelle, il est refusé, même s’il est fictif.

### 3.4 Références

Le [registre des références](REFERENCES_FRANCHISE.md) couvre les dix films et les deux jeux officiels. Il distingue les faits confirmés, les observations, les interprétations et les points à vérifier. La présente bible n’a pas à recopier les synopsis : elle renvoie au registre.

---

## 4. Périmètre du build de référence

### 4.1 Contenu livré

| Ensemble | Contenu | Source de vérité |
| --- | --- | --- |
| Bibliothèque du Théâtre | 14 campagnes, 87 épreuves, 29 dossiers, 8 entrées de chronologie. Dix campagnes sont indexées par film, quatre sont originales. | `src/services/preloadedData.ts` |
| Décors du Théâtre | Quatre-vingt-sept salles dédiées, une par épreuve ; cinq environnements partagés restent le repli d’une épreuve créée par le joueur. | `src/components/common/TheatreScene.tsx`, `theatreWorkspaceData.ts` |
| Station FPS | Une carte Godot avec quatre espaces principaux, un atelier facultatif, onze pupitres et quatre portes. | `godot-fps/station.tscn`, `station_layout.gd`, `station_run.gd` |
| Campagne de référence | *Le Dernier Relais* : trois salles, trois épreuves, trois issues. | `src/services/dernierRelaisData.ts` |
| Seconde campagne originale | *La Une de minuit* : trois salles illustrées, trois épreuves, trois issues. | `src/services/laUneDeMinuitData.ts` |
| Roster jouable | *Le Roster — dix pièges* : dix salles illustrées, une par film, une fiche de fidélité par salle et trois issues. | `src/services/rosterData.ts` |
| Films fondateurs réécrits | *Saw I Trials* et *Saw II Trials* : treize situations converties en salles de lecture, cassette, énigme et fiche de fidélité. | `src/services/sawOneTwoData.ts` |
| Deuxième passage | *Saw III Trials* et *Saw IV Trials* : douze situations converties au même gabarit. | `src/services/sawThreeFourData.ts` |
| Troisième passage | *Saw V Trials*, *Saw VI Trials* et *Saw VII Trials* : vingt-deux situations converties. | `src/services/sawFiveSevenData.ts` |
| Quatrième passage | *Jigsaw*, *Spiral* et *Saw X* : vingt et une situations converties au même gabarit. | `src/services/sawLegacyData.ts` |
| Cinquième passage | Campagne fictive *Gideon* : les trois entrées originales de Victor Hale, Mara Voss et Elias Crowe converties en salles de lecture. | `src/services/fictionalArchitectData.ts` |
| Archives | Deux jeux officiels dans le registre documentaire. | `REFERENCES_FRANCHISE.md` |

Les quantités décrivent la bibliothèque fournie avec cette révision. Les ajouts, suppressions et sauvegardes du joueur peuvent faire varier son contenu local.

### 4.2 Écrans de l’application

| Écran | Rôle | Statut |
| --- | --- | --- |
| Tableau de bord | Accès aux campagnes, à la Station et aux archives | LIVRÉ |
| Campagnes | Création et édition d’une campagne | LIVRÉ |
| Dossiers | Personnages, failles, peurs, relations | LIVRÉ |
| Atelier des épreuves | Édition des énigmes, indices, choix, chrono | LIVRÉ |
| Chronologie | Repères de continuité | LIVRÉ |
| Salle d’écriture | Modèles de rédaction locale | LIVRÉ |
| Réglages | Thème, intensité, sauvegarde, chiffrement | LIVRÉ |
| Théâtre | Enquête, cassette, énigme, décisions, bilan | LIVRÉ |
| Station | FPS Godot intégré en iframe | LIVRÉ |

### 4.3 Ce qui n’est pas dans le build

- Le mode **Architecte** (planification d’un test par le joueur).
- Le mode **Régie** (bascule de caméras et interventions).
- Le mode **Victime** autonome, distinct de la Station.
- La reproduction mécanique 1:1 d’un piège de film (geste, matériel, procédure). Le roster livré au §6.7 est une transposition documentée, pas une exécution.
- Le multijoueur, le cloud obligatoire, la VR.
- Un éditeur de blueprints exportable.

Ces éléments restent des EXTENSIONS au §7 et au §13. Ils ne doivent pas apparaître dans une description du build actuel sans le mot « prévu ».

---

## 5. Station de contrôle — FPS

### 5.1 Entrée et modes

**Entrée :** Tableau de bord → Lancer l’exploration → **Commencer la visite** ou **Défi · 3 min**.

| Mode | Chrono | Objectif | Fin |
| --- | --- | --- | --- |
| **Visite** | Temps écoulé | Explorer, comprendre, sortir | Bilan libre |
| **Défi** | 180 s de temps actif | Valider les cinq objectifs avant l’expiration | Sortie validée ou délai écoulé |

En défi, la pause suspend la mesure. Une nouvelle traversée remet à zéro badge, portes, décisions et diagnostic.

### 5.2 Les cinq objectifs

1. Récupérer le badge au pupitre du sas.
2. Choisir un relais dans la galerie technique.
3. Restaurer l’index dans les archives.
4. Rejoindre le poste d’évacuation et valider le protocole correspondant au choix d’index.
5. Activer le terminal de sortie.

**Atelier facultatif :** relevé du registre ORION, vérification du témoin correspondant, ouverture du passage intérieur. Le bilan conserve la trace du détour.

### 5.3 Les espaces

| Lieu | État à l’entrée | Action et conséquence | Repère de décor |
| --- | --- | --- | --- |
| **Sas d’accueil** | Aucun accès acquis. | Prendre le badge à gauche. Consulter le plan à droite. Le badge libère la galerie. | Accueil bleu gris, mobilier de service, axe central. |
| **Galerie technique** | Badge validé. | Choisir stabilité ou économie. Les pupitres réagissent. Le relais ouvre les archives. | Vert sourd, panneau technique, racks et conduits. |
| **Archives** | Relais actif. | Restaurer l’index par salle ou par fonction. Le choix ouvre l’évacuation et détermine le protocole juste. | Ambre, classement, desserte, tiroirs. |
| **Poste d’évacuation** | Index restauré. | Choisir le protocole concordant, puis valider au pupitre du fond. | Ardoise et ivoire, supervision, réserve, signalétique. |
| **Atelier** | Accessible par la galerie et les archives. | Relever le registre ORION, vérifier le témoin, ouvrir le passage. | Ardoise mauve, cuivre assourdi, établi, baie latérale. |

### 5.4 Plan, HUD et retours

- Le plan React écoute les événements passifs de l’iframe de même origine.
- Ordre principal : `badge → relais → index → evacuation → finished`.
- Progression de l’atelier : `registre → atelier` après le relais.
- Le HUD nomme l’objectif courant, l’état des portes et le temps.
- Sous 720 px de haut, le HUD passe en bandeau compact ; lorsqu’un pupitre est visé, il s’efface à 12 % pour laisser lire l’écran.
- Un message de confirmation affiché pendant qu’un pupitre reste visé garde le HUD à pleine opacité ; le fondu revient à l’expiration du message.
- Une erreur de protocole est refusée avec un retour lisible ; elle ne bloque pas la sortie.
- Le bilan reprend le résultat, les objectifs atteints et le temps.
- En cas d’expiration, le bilan conserve les objectifs acquis et permet de rejouer dans le même mode.
- Le bilan de la dernière traversée est conservé localement : après un rechargement, un bandeau l’annonce et la reprise repart explicitement du sas.

### 5.5 Commandes

| Support | Commandes |
| --- | --- |
| Clavier | ZQSD ou WASD pour marcher ; souris ou flèches pour regarder ; E pour interagir ; P ou Échap pour la pause. |
| Tactile | Glisser à gauche pour se déplacer, à droite pour regarder ; boutons Examiner et Pause. |
| Manette | Supportée par le moteur ; à vérifier sur le build publié. |

**Ciblage :** un pupitre exige une distance maximale de 2,7 m, un regard suffisamment aligné et une ligne de vue dégagée. Texte, position et forme portent l’état d’accès en plus de la couleur.

### 5.6 Architecture du niveau

- Sol de référence à `y = 0`, trajet principal vers `−Z`, axe central libre.
- Capsule de 0,28 m de rayon et 1,72 m de hauteur ; caméra à 1,62 m ; FOV de 76°.
- Cloisons principales avec passage libre de 2,4 × 2,8 m lorsque la porte est ouverte.
- Baies de l’atelier à l’est.
- Le sol et le dégagement sont conservés aux jonctions et autour des approches de pupitres.

### 5.7 Intégration web

- Godot porte l’état de la partie.
- `StationMode` charge `public/godot-station/index.html` dans une iframe.
- Les messages sont acceptés uniquement si l’origine et la source correspondent à l’iframe.
- Le canal est `jigsaw-station`.
- `stationProgress` valide les transitions : badge, relais, index, évacuation, registre, atelier, fin.
- Un état incohérent est ignoré, jamais appliqué à l’envers.
- Quitter ou recharger la Station ramène au départ ; seule la dernière traversée laisse son bilan (mode, objectifs, issue, date), pas la position ni l’état des portes.

### 5.8 Chargement et erreurs

| État | Comportement |
| --- | --- |
| `loading` | Message « Chargement de la station… » |
| `delayed` | Après 45 s, message « Chargement prolongé » et bouton Réessayer |
| `error` | Message « Ouverture impossible », bouton Réessayer |
| `ready` | Message « Station prête » |

Le plein écran est proposé ; s’il échoue, un message l’explique sans bloquer la partie.

### 5.9 Continuité Station → Le Dernier Relais

L’atelier de la station est l’unique détour facultatif : le registre ORION y est relevé, puis comparé au témoin. Ce relevé survit à la fermeture de l’iframe et devient une **pièce du dossier** de *Le Dernier Relais*.

| Détour | Pièce du dossier | Effet dans l’enquête |
| --- | --- | --- |
| Registre **et** témoin comparés | « Repère ORION — confirmé à la station » | Indice supplémentaire gratuit à l’étape 02, « La caisse de l’atelier ». |
| Non effectué, ou registre seul | « Repère ORION — absent du dossier » | Explique où se fait le relevé et ce qu’il verserait au dossier. |

- Un seul drapeau est conservé, `jigsaw_orion_confirmed` : le registre seul ne prouve rien, seule la comparaison au témoin compte.
- Le plan de la Station annonce la pièce dès la confirmation du témoin (« pièce versée au dossier du Relais ») et relit le drapeau après un rechargement : il ne redemande jamais un atelier déjà versé au dossier.
- Le drapeau est idempotent : une nouvelle traversée ne peut que le laisser posé, et un stockage indisponible ne bloque pas la partie.
- L’indice versé ne nomme jamais la coordonnée attendue : l’énigme d’inventaire reste à résoudre.
- Le détour reste facultatif : sans lui, le dossier s’ouvre, l’enquête se joue et les trois fins restent atteignables.

---

## 6. Théâtre — enquête et décisions

### 6.1 Entrée et structure d’une épreuve

**Entrée :** Tableau de bord → campagne prête → **Simulate**, ou campagne sélectionnée dans l’éditeur → lecture.

Chaque étape présente :

- un lieu illustré ;
- le participant concerné ;
- un message ou une cassette ;
- des indices consultables ;
- une énigme ou des branches de décision ;
- un chrono ;
- un retour après validation.

Une réponse valide déverrouille les décisions. Une réponse refusée coûte du temps et laisse un retour lisible. Le compteur de tentatives et l’échéance déterminent le passage dans la branche de repli.

### 6.2 Les sept contrôles d’énigme

| Forme | Contrôle attendu | Exigence d’écriture |
| --- | --- | --- |
| **Date** | Calendrier natif pour une date valide. | Déduire une seule date à partir des informations montrées. |
| **Réponse libre** | Saisie clavier pour une valeur ou un mot. | Montrer le format et la précision attendue. |
| **Confession** | Options de déclaration et validation. | Donner les éléments permettant de distinguer une option conforme. |
| **Coordonnées** | Grille A-1 à C-3 et confirmation. | Définir les axes et les entrées ; relier les libellés au décor. |
| **Engrenages** | Deux réglages et un total. | Choisir une cible atteignable avec les plages du contrôle. |
| **Allocation** | Curseur et valeur numérique exacte. | Afficher unités, borne et consigne de validation. |
| **Décision directe** | Choix narratifs immédiats. | Consigner les effets et la conséquence de chaque branche. |

Les valeurs de référence restent dans la configuration d’épreuve. Les images, points d’inspection et messages guident vers l’information qui permet de raisonner ; la réponse est validée par la console.

### 6.3 Scores et fins

Sept axes bornés :

- responsabilité ;
- vérité ;
- empathie ;
- courage ;
- déni ;
- coopération ;
- acceptation.

Une fin peut découler :

1. d’une branche explicite ;
2. d’une fin dédiée à la campagne ;
3. d’un calcul de scores.

Le rapport local enregistre les décisions, les scores et l’issue. Le champ `startedAt` des rapports vaut actuellement la date de fin moins cinq minutes : les mesures de durée de recette se font depuis le lancement réel du parcours.

### 6.4 Mise en scène

- Illustration carrée ou panoramique selon la salle.
- Points d’inspection reliés à un objet, un dossier ou une archive.
- Les points d’inspection ne soumettent jamais une réponse à la place du joueur.
- La console de l’étape reste la seule source de validation.
- Le décor ne contient ni combinaison cachée ni cible supplémentaire.
- Une salle documentée affiche sa **fiche de fidélité** : référence au film, lecture jouée et éléments non reproduits.

### 6.5 Campagne de référence — *Le Dernier Relais*

Le centre des Aulnes ferme au crépuscule. Noé retrouve le bordereau aux archives. Inès fait vérifier la bonne caisse dans l’atelier. Samir calcule et attribue au comptoir le solde de clôture. Le couloir vitré relie les trois étapes.

| Étape | Objectif | Transformation du dossier | Signe visuel |
| --- | --- | --- | --- |
| **Bureau des archives** | Déduire la date du bordereau. | Transmettre le document vérifiable ou un résumé. | Agenda, boîte, poste d’écoute, dossiers. |
| **Atelier du couloir vitré** | Identifier le casier à partir d’un inventaire. | Conserver la vérification d’Inès ou transmettre la caisse seule. | Grille de casiers, radio, armoire, établi. |
| **Comptoir de restitution** | Calculer le solde avant son attribution. | Répartir le solde ou le réserver. | Bacs, dossiers, radio, vitres sombres. |

**Trois issues :**

| Issue | Condition | Sens |
| --- | --- | --- |
| **Le relais est transmis** | Partager le solde + conserver bordereau et vérification. | Passation complète et vérifiable. |
| **Une transmission sous réserve** | Partager le solde sans conserver toutes les vérifications. | La transmission existe, mais une réserve reste. |
| **La clôture laisse une dette** | Réserver le solde au bureau de coordination. | Le compte est exact, la passation ne l’est pas. |

**Parcours de recette :** valider `2028-10-10` aux archives, `C-2` à l’atelier et `270` au comptoir. Joindre le bordereau, conserver la vérification d’Inès et répartir le solde également doit produire « Le relais est transmis » avec trois décisions consignées.

### 6.6 Seconde campagne originale — *La Une de minuit*

L’imprimerie des Passages boucle sa dernière édition. Camille Roux doit retrouver la date du bon de tirage, rapprocher le registre d’envoi de l’édition publiée, puis décider ce que la une du matin corrige avant le départ du véhicule d’archives. Walid tient les traces de fabrication ; Hélène tient l’archive voisine.

**Mise en scène.** L’imprimerie est condamnée : les portes se verrouillent à vingt-trois heures, des bâches plastique couvrent les machines, un chronomètre de chantier compte au-dessus de la rotative et une marionnette de bois sans visage reste assise près du marbre. Les cassettes sont portées par une voix anonyme qui nomme la faute de Camille, donne la règle et rappelle l’heure de départ. La marionnette est un accessoire original, sans ressemblance avec un personnage de film ; aucune blessure n’est montrée et aucune instruction réelle n’est donnée. L’identité sonore de la campagne ouvre sur le rire de la franchise, puis laisse le bourdonnement de la bande et le tic-tac du chronomètre.

| Étape | Objectif | Transformation du dossier | Signe visuel |
| --- | --- | --- | --- |
| **Atelier de composition** | Déduire la date de l’édition du 8 mars 2029. | Conserver le bon de tirage ou une simple recopie. | Casiers de plomb, marbre, épreuves punaisées. |
| **Salle de la rotative** | Rapprocher 480 exemplaires sortis, 75 revenus et 400 annoncés. | Inscrire la mention exacte ou reprendre le chiffre publié. | Rotative, cartons, registre d’envoi. |
| **Bureau de la une** | Calculer les 60 minutes nécessaires à la correction. | Publier avec provenance, protéger la source ou boucler sans correction. | Chevalet vide, téléphone, horloge arrêtée. |

**Trois issues :**

| Issue | Condition | Sens |
| --- | --- | --- |
| **La une porte les deux noms** | Publier ou protéger la source avec le bon de tirage et la mention exacte. | La provenance reste vérifiable. |
| **La correction reste sous réserve** | Corriger sans l’une des deux vérifications. | La une dit moins que ce que l’atelier savait. |
| **La une sans témoin** | Boucler sans correction. | La trace existe, les lecteurs ne la voient pas. |

**Parcours de recette :** valider `2029-03-08`, puis `B-2`, puis `60` ; joindre le bon, inscrire la mention et publier avec les deux noms doit produire « La une porte les deux noms » avec trois décisions consignées.

**Motifs documentés et transposition :** la cassette qui porte la consigne reprend le motif audio de `F01` ; les seuils qui modifient ce que le joueur sait suivent `F04` ; les bons, registres et états de classement reprennent la vérification des traces de `F05` ; la différence entre témoignage public et provenance suit `F07` ; la lampe chaude de l’atelier puis la lumière froide du bureau traduisent le rôle du changement de lieu et d’éclairage de `F10`. Ce sont des interprétations de conception : aucune mécanique physique de film n’est reproduite et la campagne ne contient aucune instruction réelle.

### 6.7 Roster jouable — dix pièges, dix films

Le dépôt des épreuves réunit dix salles de lecture, une par film. Chaque salle reprend la situation documentée du film et la transforme en lecture, calcul ou arbitrage. Cinq sujets originaux traversent deux salles chacun ; aucun personnage de film n’est joué.

| Salle | Film | Épreuve jouée | Contrôle |
| --- | --- | --- | --- |
| **Le bain** | Saw (2004) | Dalle du registre d’entretien, partage de la clé | Coordonnées `C-2` |
| **La maison au gaz** | Saw II (2005) | 540 m³ renouvelés à 30 m³/min | Réponse `18` |
| **Le congélateur** | Saw III (2006) | De 12 °C à −3 °C, 1 °C toutes les 3 min | Réponse `45` |
| **Le mausolée** | Saw IV (2007) | Dernier lundi de février 2031 | Date `2031-02-24` |
| **Le cube d’eau** | Saw V (2008) | 1 080 L remplis à 15 L/min | Réponse `72` |
| **Le manège** | Saw VI (2009) | Grille A-1 à C-3, ligne B et colonnes 1–2 éliminées | Coordonnées `A-3` |
| **La cage publique** | Saw VII (2010) | Relevé exact des votes et quorum | Confession `B-2` |
| **Le silo** | Jigsaw (2017) | 3 × 9 sacs de 12 kg pour 432 kg attendus | Réponse `9` |
| **Le faux témoin** | Spiral (2021) | Référence d’origine et réserve d’archive | Confession `C-3` |
| **La machine** | Saw X (2023) | Neuf verrous, un toutes les quatre minutes | Réponse `36` |

**Fiche de fidélité.** Chaque salle affiche, sous le décor, sa référence documentaire, ce qui est joué et ce qui n’est pas reproduit : le geste, la blessure, le matériel et la procédure. La fiche est rendue depuis le champ `sourceNote` ; elle ne contient aucune instruction et ne remplace pas la console de l’étape.

**Trois issues :**

| Issue | Condition | Sens |
| --- | --- | --- |
| **Les dix salles ont un témoin** | Au moins huit salles rendues avec leur pièce. | Le registre est complet et vérifiable. |
| **La rotonde garde une réserve** | Quatre à sept salles rendues avec leur pièce. | Le registre existe, mais des réserves restent ouvertes. |
| **Le dixième siège reste vide** | Trois salles ou moins rendues avec leur pièce. | Les pièces existent, la lecture commune manque. |

**Parcours de recette :** valider `C-2`, `18`, `45`, `2031-02-24`, `72`, `A-3`, `B-2`, `9`, `C-3`, `36` en choisissant l’option de partage à chaque salle ; le bilan doit afficher « Les dix salles ont un témoin » avec dix décisions consignées. Les dix références sont consignées au registre des références ; leur statut reste **Interprétation** jusqu’à recontrôle sur l’édition citée.

### 6.8 Sauvegarde et rapports

- Sauvegarde locale, sans cloud obligatoire.
- Import/export JSON.
- Coffre chiffré optionnel.
- Les identifiants assurent reprise, déduplication et compatibilité.
- Une partie reprise conserve le contenu instantané qu’elle avait chargé.
- Une ancienne sauvegarde reste lisible ; les suppressions choisies sont préservées.

### 6.9 Migration film par film — *Saw I* à *Saw X*, puis les trois entrées fictives

Les deux films fondateurs passent les premiers de la formule « salle illustrée, cassette, énigme, fiche de fidélité ». Les treize entrées anglaises d’une ligne sont remplacées à identifiant constant ; les campagnes `camp-saw-i` et `camp-saw-ii` gardent leur ordre et leurs dossiers, mais chaque étape devient une lecture de la situation documentée.

| Film | Salles | Contrôles |
| --- | ---: | --- |
| *Saw* (2004) | 7 | `B-3` · arbres `15` · `2004-03-18` · `55` · `300` · `C-1` · confession `B-2` |
| *Saw II* (2005) | 6 | `18` · confession `B-2` · `28` · `56` · `C-3` · `30` |
| *Saw III* (2006) | 6 | `50` · arbres `15` · `336` · `1296` · `B-3` · confession `B-2` |
| *Saw IV* (2007) | 6 | `B-2` · `120` · `9` · confession `C-3` · `15840` · `60` |
| *Saw V* (2008) | 7 | `150000` · `1` · `16` · `3` · `6` · `2024-04-12` · `C-1` |
| *Saw VI* (2009) | 7 | `24` · confession `B-2` · arbres `24` · `1800` · `C-2` · `150000` · arbres `21` |
| *Saw VII* (2010) | 8 | `600` · `2024-04-15` · `150000` · `20` · confession `C-3` · arbres `24` · `60` · `2024-04-12` |
| *Jigsaw* (2017) | 8 | `36` · confession `B-2` · `C-2` · `6` · `2024-04-18` · arbres `15` · `13` · `C-1` |
| *Spiral* (2021) | 6 | `10` · `2021-05-23` · `30` · `2021-02-23` · `C-2` · confession `B-2` |
| *Saw X* (2023) | 7 | `2400` · `540` · `2023-05-22` · `2023-09-08` · `384` · `C-1` · confession `C-3` |

**Deuxième, troisième et quatrième passages.** *Saw III* et *Saw IV* suivent avec six salles chacun ; *Saw V*, *Saw VI* et *Saw VII* ajoutent vingt-deux salles, puis *Jigsaw*, *Spiral* et *Saw X* vingt et une. Même gabarit, mêmes contrôles, mêmes fiches de fidélité, et une migration unique par film limitée aux titres d’origine.

**Cinquième passage — les entrées fictives.** La campagne *Gideon* ferme la bibliothèque. Les trois épreuves originales (`test-ledger-room-1`, `test-glass-confession-1`, `test-quiet-scale-1`) deviennent *Le bureau des registres*, *La salle des miroirs* et *La salle de la balance* : trois décors dédiés, trois cassettes, trois énigmes sur les contrôles existants (date `2024-03-22`, confession `B-2`, curseur `150000`) et trois fiches de fidélité. Ces salles ne renvoient à aucun film : leur fiche commence par « Fiction originale » et borne la situation au bâtiment Gideon. Les identifiants, les sujets et leurs fautes sont conservés ; le joueur reçoit la réécriture une seule fois, et seulement si l’entrée porte encore son titre d’origine. L’instruction du curseur est écrite en français ; le moteur continue de lire la formulation anglaise d’origine et comprend désormais « à … ou plus », « au moins », « au minimum », « à partir de » et « plus de », ce qui maintient le seuil de 150 000 $ des anciennes sauvegardes.

**Ce qui disparaît.** Les textes qui décrivaient un geste, un outil ou une blessure sont retirés du contenu préchargé ; le filtre de sécurité est passé sur chaque cassette, règle, indice, choix et fiche. Les salles ne montrent ni ne décrivent d’exécution. Une bibliothèque existante reçoit la réécriture une seule fois, uniquement pour les entrées qui portent encore leur titre d’origine : une étape éditée par le joueur n’est jamais remplacée.

**Ce qui reste.** La situation, le lieu, la faute du sujet et le dilemme. Chaque salle porte sa fiche de fidélité (`sourceNote`) avec la référence au film et la mention des éléments non reproduits. Les issues restent calculées par le moteur moral, la dernière décision de chaque campagne déclenchant le bilan.

**Ordre de la suite.** La conversion est terminée : *Jigsaw* (huit situations), *Spiral* (six), *Saw X* (sept), puis les trois entrées fictives. Chaque salle demande une cassette, une énigme sur un contrôle existant, deux choix et une fiche de fidélité. Une campagne n’est déclarée convertie que lorsque ses identifiants sont tous couverts et que le parcours complet passe ; les sept campagnes filmiques et la campagne *Gideon* remplissent cette condition.

---

## 7. Extension Jigsaw — Architecte, Régie, Victime

> **Statut : EXTENSION.** Aucun des trois modes n’est livré dans `86280ba`. Cette section fixe la direction, les points d’accroche et les critères d’acceptation avant toute implémentation.

### 7.1 Pourquoi cette extension

Le build livré fait vivre le **lieu** et l’**enquête**. L’extension ajoute la **double perspective** propre à Jigsaw : concevoir un test, l’observer, puis en incarner un autre. Elle ne remplace pas la Station ni le Théâtre ; elle les relie.

**Règle de campagne :** le joueur ne joue jamais le test qu’il vient de concevoir.

```text
Planifier pour un sujet fictif
  → Observer en Régie
  → Incarner un autre sujet
  → Récupérer la pièce
  → Chapitre suivant
```

### 7.2 Les trois modes

| Mode | Rôle | Boucle | Base existante |
| --- | --- | --- | --- |
| **Architecte** | Concevoir un test juste et lisible | Repérage → preuve → conception → cassette → lancement | Campagnes, dossiers, atelier des épreuves |
| **Régie** | Observer et influencer modérément | Caméras, signaux, interventions préparées | Théâtre, constantes physiologiques simulées |
| **Victime** | S’échapper d’un test séparé | Explorer, comprendre, agir, sortir | Station FPS |

### 7.3 Les six phases de l’Architecte

| Phase | Objectif | Sortie | Échec |
| --- | --- | --- | --- |
| **1. Repérage et preuve** | Choisir un sujet fictif et démontrer sa faille. | Dossier de test | Mauvaise cible, preuve insuffisante |
| **2. Conception** | Transformer le dossier en test jouable et juste. | Blueprint | Test impossible, budget dépassé, test injuste |
| **3. Cassette et vidéo** | Énoncer la règle sans donner la solution. | Script, voix, montage | Règle incohérente |
| **4. Enlèvement** | Créer la rupture narrative. | Séquence abstraite | Témoin, complication |
| **5. Lancement** | Armer le test et choisir le créneau. | Test lancé | Sortie bloquée, témoin |
| **6. Récupération** | Récupérer la pièce et refermer le dossier. | Pièce, preuves | Pièce perdue, attention accrue |

**Ressources :** temps, argent fictif, accès, preuve, discrétion, interventions, réputation. Aucune ressource ne s’achète avec de l’argent réel.

**Règle d’équité :** un test doit avoir une solution, un indice, un temps suffisant et une issue. Un test sans issue n’est pas difficile : il est cassé.

### 7.4 La Régie

La Régie est une salle de contrôle fictive :

- mur de caméras ;
- signaux de progression ;
- constantes vitales simulées ;
- journal des directives ;
- interventions préparées, limitées et coûteuses ;
- aucune action ne joue à la place de la victime.

**Ce qu’elle n’est pas :**

- pas un outil de surveillance réelle ;
- pas un mode « Dieu » ;
- pas une excuse pour retirer l’agence du sujet ;
- pas un moyen de contourner la règle du test.

### 7.5 La Victime

La Victime réutilise le socle FPS de la Station :

- déplacement, regard, interaction ;
- objectifs lisibles ;
- chrono ;
- échec et reprise ;
- bilan.

Elle ajoute :

- une règle de test ;
- des indices diégétiques ;
- des mini-jeux paramétrés ;
- une issue canonique ou alternative ;
- un débrief comparé au test planifié.

### 7.6 Information asymétrique

| Savoir | Architecte | Régie | Victime |
| --- | --- | --- | --- |
| La faille du sujet | Oui | Oui | Non |
| La règle complète | Oui | Oui | Oui |
| La solution | Oui | Oui | Non |
| Les interventions prévues | Oui | Oui | Non |
| L’état réel du sujet | Non | Oui | Oui |

### 7.7 Points d’accroche techniques

| Brique existante | Réutilisation | Travail à faire |
| --- | --- | --- |
| `CampaignBuilder` | Dossier, lieu, thème | Ajouter les ressources et le dossier de preuve |
| `TestDesigner` | Épreuves, indices, choix | Devenir éditeur de blueprint |
| `TheatreScene` / `TheatreWorkspace` | Salles illustrées, inspection | Ajouter la Régie et les caméras |
| `StationMode` / Godot | FPS, interaction, chrono | Ajouter un test Victime paramétré |
| `AppContext` | Simulation, timers, sauvegarde | Ajouter l’état de campagne partagé |
| `moralEngine` | Sept axes | Devenir un jugement de fin, pas une survie |

### 7.8 Règles de contenu de l’extension

- Aucun plan, cote, matériau ou procédure réelle.
- Aucune méthode d’enlèvement, de filature ou de surveillance.
- Aucune adresse, aucun nom de personne réelle.
- L’enlèvement reste une **ellipse** : fenêtre, lieu fictif, conséquence.
- Les interventions de Régie sont préparées avant le test, jamais improvisées.
- Un test doit rester compréhensible sans wiki.

### 7.9 Critères d’acceptation de l’extension

- [ ] Le joueur planifie un test complet sans voir de méthode réelle.
- [ ] Le blueprint est jouable et exportable.
- [ ] La Régie applique une intervention une seule fois et coûte son budget.
- [ ] Le joueur incarne un autre test que celui qu’il a conçu.
- [ ] La victime peut réussir par le chemin canonique.
- [ ] Le débrief explique l’issue et l’équité.
- [ ] La pièce est récupérée et le chapitre suivant se débloque.
- [ ] Aucune instruction réelle n’est affichée.

---

## 8. Direction artistique et sonore

### 8.1 Volumes et échelle

- Donner une fonction à chaque zone utile avant son habillage.
- Grouper les lignes de fuite, le pupitre et l’éclairage autour de l’objectif.
- Dimensionner poignées, assises, tiroirs et dossiers par rapport au corps du joueur.
- Faire lire l’objet de face, de trois quarts et à la distance d’action.

### 8.2 Matières et lumière

- Réserver le point lumineux principal à l’objet à examiner ou au prochain seuil.
- Les surfaces portent des variations de rugosité et d’usure aux contacts.
- Les repères de pièce combinent valeur, matière, texte et couleur.
- Les trois salles des Aulnes partagent un bleu de fin de journée, du cuivre assourdi et des lampes chaudes à hauteur de travail.

### 8.3 Interface

- Hiérarchie : objectif, retour d’action, progression, commandes.
- Vue subjective avec viseur libre, HUD compact et plan consultable.
- Au Théâtre, le raccourci ouvre la console de l’étape ; les zones restent accessibles via leur liste de boutons.
- Les éléments importants conservent un libellé et un accès clavier.

### 8.4 Son

- Le message et son texte sont la première source d’information.
- Appuyer l’écoute, la validation et l’urgence par des sons distincts.
- Une décision doit rester compréhensible son coupé.
- Utiliser les synthèses et lecteurs du projet comme base, avec une identité sonore par campagne.

### 8.5 Personnages

- La fiche relie ce que l’on sait du personnage à son rôle jouable.
- Pour un protagoniste original : silhouette, tenue et posture liées à sa fonction, son environnement et l’état de la scène.
- Le dossier distingue un fait biographique, une motivation d’écriture et un choix du joueur.

---

## 9. UX, UI et accessibilité

### 9.1 Parcours

```text
Boot
 └─ Tableau de bord
     ├─ Campagnes → édition → Théâtre
     ├─ Dossiers
     ├─ Atelier des épreuves
     ├─ Chronologie
     ├─ Salle d’écriture
     ├─ Station → visite ou défi
     ├─ Réglages
     └─ Mentions légales
```

### 9.2 Règles d’interface

- Un objectif à la fois, formulé simplement.
- Le plan de la Station reste consultable sans quitter la partie.
- Le Théâtre garde la console de réponse visible et focusable.
- Les points d’inspection ont un libellé, un état et un accès clavier.
- Les messages d’erreur expliquent l’action et la sortie de secours.
- Aucune information critique n’est uniquement sonore.
- Aucune information critique n’est uniquement colorée.

### 9.3 Accessibilité

| Risque | Mesure |
| --- | --- |
| Mal des transports | FOV, head bob, motion blur, vignette, vitesse de rotation |
| Clignotements | Réduction, plafond de fréquence, avertissement |
| Audio indispensable | Sous-titres + indices visuels |
| QTE | Alternative maintien, fenêtre élargie, pause |
| Chrono | Multiplicateur, pause, avertissement vocal |
| Couleur | Formes + texte, pas de code couleur seul |
| Lecture | Taille de police, contraste, espacement |
| Motricité | Remapping, une main, sensibilité, auto-maintien |
| Tactile | Zones larges, boutons Examiner et Pause visibles |

**Cible :** parcours complet au clavier, à la manette et au tactile ; sous-titres complets ; aucune information critique uniquement sonore.

---

## 10. Architecture technique

### 10.1 Vue d’ensemble

```text
jigsaw-mastermind/
├── src/                       # React 19 + TypeScript + Vite 8
│   ├── components/common/     # CRT, cassette, scène, workspace
│   ├── context/AppContext.tsx # état, simulation, timers, sauvegarde
│   ├── services/              # données, règles, moral, son, DB
│   ├── views/                 # Dashboard, Station, Theatre, éditeurs
│   └── __tests__/             # tests web
├── godot-fps/                 # projet Godot 4.6.3
│   ├── scripts/               # layout, player, run, dressing
│   ├── station.tscn
│   └── tests/                 # tests natifs
├── public/
│   ├── godot-station/         # build Web (WASM + PCK)
│   └── theatre/               # illustrations WebP
├── docs/                      # bible et registre
└── scripts/                   # export et test Station
```

### 10.2 Technologies

| Couche | Technologie | Rôle |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite 8 | Interface, état, éditeurs |
| Style | Tailwind CSS 4, CSS dédié | Thème, Station, Théâtre |
| Icônes | Lucide React | Repères d’interface |
| Stockage | `localStorage` | Données locales |
| Chiffrement | PBKDF2 + AES-GCM | Coffre optionnel |
| Tests web | Vitest 4, Testing Library | Règles, parcours, composants |
| FPS | Godot 4.6.3 | Station, niveau, physique |
| Export web | Godot Web + iframe | Build jouable dans le navigateur |

### 10.3 État et messages

- `StationProgress` : `started`, `completed`, `workshop`, `mode`, `outcome`.
- Transitions valides uniquement dans l’ordre.
- Messages acceptés seulement depuis l’iframe de même origine.
- Canal `jigsaw-station`.
- Un message incohérent est ignoré.
- L’état FPS n’est pas persisté en cours de traversée ; le bilan de la dernière session est conservé (`jigsaw_station_session`, versionné et validé à la lecture) et le Théâtre a sa propre reprise.
- Seule exception persistée en jeu : le diagnostic ORION de l’atelier (`jigsaw_orion_confirmed`), versé au dossier du Relais comme pièce consultable.

### 10.4 Build et commandes

```sh
npm install
npm run dev
npm test
npm run lint
npm run build
npm run station:test
npm run station:export
```

`station:export` reconstruit `public/godot-station` depuis `godot-fps/`. `station:test` vérifie les deux routes, les jonctions de sol, le passage, le protocole, le chrono, la pause et le rejeu.

### 10.5 Budgets et tailles

| Élément | Valeur de référence |
| --- | ---: |
| Dossier Web Godot | 38,21 Mo |
| WASM | 37,70 Mo |
| PCK | 80 392 octets |
| Illustrations du Théâtre | 13 Mo (8 WebP, 83 JPEG) |
| Tests web | 149 |
| Contrôles natifs Godot | 86 |

Les temps de frame et la mémoire graphique demandent des relevés sur appareil identifié. Les tailles sont des valeurs brutes de build ; le transfert dépend de la compression serveur.

---

## 11. Production de contenu

### 11.1 Méthode en six étapes

1. **Indexer.** Choisir l’édition de référence, capturer les observations utiles, établir le rôle de l’objet ou de l’espace.
2. **Bloquer le parcours.** Placer départ, repère visuel, aire d’interaction, portes et retour. Vérifier sol, capsule et lignes de vue.
3. **Construire.** Livrer proportions, silhouette puis détails visibles à la distance réelle. Séparer collision, visuel et état interactif.
4. **Comparer.** Capturer la vue à hauteur des yeux, le détail près du pupitre et les approches latérales. Aligner pose, angle, cadrage et lumière.
5. **Intégrer.** Jouer la scène à l’entrée habituelle. Vérifier portées, navigation, rejet, victoire, expiration et remise à zéro.
6. **Livrer.** Mettre à jour la fiche et le registre. Reporter la révision, la version d’export et la preuve de recette.

### 11.2 Fiche reproductible

| Champ | À renseigner |
| --- | --- |
| **Identité** | ID stable, nom affiché, famille, niveau, propriétaire. |
| **Provenance** | Média et édition, URL, plan ou timecode, date, statut, origine et droits. |
| **Fonction** | Ce que le joueur voit, fait et comprend. États prêts, refusés, accomplis. |
| **Dimensions** | Unités, axes, pivot, échelle, volumes réservés, points d’interaction. |
| **Rendu** | Vue de référence, silhouette, matière, éclairage, format, résolution, UV, triangles. |
| **Intégration** | Chemin source, chemin runtime, collision, regroupement, budget, visibilité. |
| **Recette** | Vue attendue et capture en jeu, clavier et tactile, mesures, taille, temps de frame. |

Une fiche de **niveau** ajoute l’arrivée, le chemin critique, le chemin optionnel, les portes, les lieux de lecture, le chrono et les issues. Une fiche d’**épreuve** ajoute l’indice, la réponse, les essais de refus, l’embranchement de repli et le bilan. Une fiche d’**interface** ajoute le focus, la taille active, le contraste et les états de chargement/reprise.

### 11.3 Exemple rempli — `evac_inventory`

- Pupitre original du protocole par fonction.
- Position Godot : `Vector3(2.45, 0, -26.2)`.
- Corps : 0,82 × 1,50 × 0,56 m ; collider : 0,84 × 1,52 × 0,60 m.
- Le panneau oriente la lecture vers l’allée.
- Recette : capsule à `Vector3(0.5, 0.04, -26.2)`, vérifier l’accès, le refus après index par salle, la validation après index par fonction.

### 11.4 Règles d’assets

- Modèles, textures, sons, musiques et polices originaux.
- Pas de scan, de rip ou d’extraction d’une œuvre protégée.
- Registre : source, licence, auteur, date, empreinte.
- Formats : glTF 2.0 pour la 3D, WebP/PNG pour les illustrations, 48 kHz pour l’audio.
- Toute image du Théâtre est vérifiée sur fichier, affichage, texte alternatif et points d’inspection.

---

## 12. QA et définition de terminé

### 12.1 Matrice de tests

| Domaine | Tests | Critère |
| --- | --- | --- |
| Station, trajet direct | Badge, relais, index, protocole, sortie | Enchaînement complet, refus aux mauvais états |
| Station, atelier | Registre, témoin, passage, archives | Ouverture, atteignabilité, remise à zéro |
| Station, défi | 180 s, pause, expiration, bilan | Temps actif, pause qui fige, bilan conservé |
| Station, commandes | Clavier, tactile, pause, retour, rejeu | Toutes les intentions disponibles |
| Théâtre, épreuve | Prompt, réponse, contrôle, indices | Concordance, retour lisible, validation |
| Théâtre, mise en scène | Images, repères, ordre, bilan | Chargement, focus, pas de débordement |
| Théâtre, sauvegarde | Reprise, import/export, coffre | État exact, compatibilité |
| Théâtre, scores | Bornes, branches, fins | Aucune valeur hors 0–100 |
| Migration | Ancienne sauvegarde, suppression, chiffrement | Idempotence, préservation |
| Légal | Assets, disclaimer, registre | Complétude |
| Accessibilité | Clavier, manette, tactile, sous-titres | Parcours complet |

### 12.2 Scénarios E2E

1. Boot → tableau de bord → Station → visite → sortie.
2. Station → défi → pause → reprise → expiration → bilan.
3. Station → atelier → registre → témoin → passage → archives.
4. Station → mauvais protocole → refus → correction → sortie.
5. Théâtre → *Le Dernier Relais* → trois étapes → « Le relais est transmis ».
5 bis. Théâtre → *La Une de minuit* → trois étapes → « La une porte les deux noms ».
5 ter. Théâtre → *Le Roster — dix pièges* → dix salles → « Les dix salles ont un témoin ».
6. Théâtre → mauvaise réponse → retour → nouvelle tentative → fin.
7. Théâtre → réserver le solde → « La clôture laisse une dette ».
8. Sauvegarde → quitter → recharger → état exact.
9. Import/export → coffre chiffré → restauration.
10. Clavier, manette, tactile, sous-titres.
11. Ancienne sauvegarde → migration → aucune perte choisie.
12. Écran étroit 320/390 px et embed 1024×700 → plan, HUD compact, bilan.

### 12.3 Critères d’acceptation du build

| Cas | Critère | Preuve de référence |
| --- | --- | --- |
| Station, trajet direct | Les cinq objectifs s’enchaînent ; les refus restent aux états prévus. | Test natif avec interactions et balayages de capsule. |
| Station, atelier | Registre et témoin suivent le relais ; le passage s’ouvre ; le reset efface le détour. | Test natif + parcours Chromium. |
| Station, défi | Départ à 03:00, temps actif, pause, expiration, bilan. | Test natif + mesure réelle à 180,15 s. |
| Station, commandes | Déplacement, regard, interaction, pause, retour, rejeu. | Tests natifs + plan web à 320/390/1440 px. |
| Théâtre, épreuve | Prompt, réponse, contrôle et indices concordent. | Tests de contrôle + trois formes jusqu’à la fin. |
| Théâtre, mise en scène | Trois illustrations, repères utilisables, ordre et bilan. | Parcours réel + écran final à 390 px. |
| Migration | Installation additive idempotente ; restauration preserve les choix. | Tests de stockage et d’écritures interrompues. |
| Référence | Chaque affirmation exacte renvoie à une édition et une preuve. | Relecture des fiches et du registre. |

### 12.4 Definition of Done

**Pour une salle :**

1. Fiche de référence validée.
2. Blockout jouable de bout en bout.
3. Art pass original.
4. Collisions et lignes de vue vérifiées.
5. Aucun softlock.
6. 60 FPS sur la scène de référence.
7. Accessibilité clavier/tactile.
8. Recette et capture.

**Pour une épreuve du Théâtre :**

1. Lieu, participant, cassette et indices cohérents.
2. Contrôle capable d’exprimer la réponse.
3. Mauvaise réponse avec retour lisible.
4. Branche de repli et fin définies.
5. Rapport et reprise vérifiés.
6. Aucun débordement à 320/390 px.

**Pour une campagne :**

1. Trois épreuves minimum ou une structure explicite.
2. Trois issues ou une fin dédiée.
3. Personnages et continuité indexés.
4. Parcours de recette complet.
5. Aucune instruction réelle.

### 12.5 Commandes de vérification

```sh
npm test
npm run lint
npm run build
npm run station:test
```

Sur la base `8641af1`, les vérifications du 22 novembre 2026 donnent **149 tests web** et **86 contrôles natifs Godot**. Le PCK final mesure 80 392 octets et porte l’empreinte SHA-256 `f3f9621c5df9007ae692249517a8dc1f54da3b094cc9bc8900f98a4b9faa11f1`. `npm run lint` retourne 0 erreur et 5 avertissements ; `npm run build` produit un bundle de 704,04 kB (187,52 kB gzip).

Le setup `src/test/setup.ts` fournit un `Storage` mémoire quand Node 26 n’expose pas `localStorage` dans l’environnement jsdom. Il ne modifie pas l’application ; il permet aux tests de sauvegarde, de reprise et de chiffrement de s’exécuter.

**Limites connues :**

- La Station conserve le bilan de la dernière traversée, pas la position ni l’état des portes : la reprise repart du sas.
- `startedAt` du Théâtre est approché (fin moins cinq minutes).
- Les temps de frame et la mémoire graphique ne sont pas mesurés sur appareil identifié.
- Le support manette est déclaré par le moteur ; il doit être vérifié sur le build publié.
- Aucun audit d’accessibilité outillé complet n’est joint.

---

## 13. Feuille de route et backlog

### 13.1 P0 — Stabiliser le build livré

| ID | Sujet | Critère |
| --- | --- | --- |
| P0-01 | Aligner la branche de travail sur `master` (`86280ba`) | **Fait** : fast-forward effectué le 21/11/2026 |
| P0-02 | Rejouer `npm test`, `npm run lint`, `npm run build`, `npm run station:test` | **Fait** : 149 tests, 0 erreur lint, build OK, 86 contrôles Godot |
| P0-03 | Vérifier le parcours *Le Dernier Relais* de bout en bout | Tests automatisés OK ; parcours navigateur à refaire |
| P0-04 | Vérifier la Station en visite et en défi | Tests natifs OK ; parcours navigateur à refaire |
| P0-05 | Corriger les limites connues de sauvegarde/reprise | **Fait** : bilan conservé et annoncé, reprise explicite du sas |

### 13.2 P1 — Consolidation

| ID | Sujet | Critère |
| --- | --- | --- |
| P1-01 | Accessibilité complète | Clavier, manette, tactile, sous-titres, contraste |
| P1-02 | Localisation FR/EN | Aucun texte en dur |
| P1-03 | Nouvelles campagnes originales | **En cours** : 2 / 3 livrées (*La Une de minuit*, *Le Roster — dix pièges*) |
| P1-04 | Nouvelles salles dédiées | **Fait** : trois salles pour *La Une de minuit*, dix pour *Le Roster*, treize pour *Saw I* et *Saw II*, douze pour *Saw III* et *Saw IV*, vingt-deux pour *Saw V* à *Saw VII*, vingt et une pour *Jigsaw*, *Spiral* et *Saw X*, trois pour les entrées fictives |
| P1-05 | Optimisation Web Godot | Budget de transfert et temps de frame mesurés |
| P1-06 | Sauvegarde de la Station | **Fait** : bilan persistant, reprise explicite |
| P1-07 | Registre d’assets complet | Source, licence, empreinte |
| P1-08 | Pages légales | Disclaimer, retrait, confidentialité |

### 13.3 P2 — Extension Jigsaw

| ID | Sujet | Critère |
| --- | --- | --- |
| P2-01 | Blueprint de test | Étapes, objets, mini-jeux, issue, validation |
| P2-02 | Mode Architecte | Six phases, ressources, dossier de preuve |
| P2-03 | Mode Régie | Caméras, signaux, interventions préparées |
| P2-04 | Mode Victime | Test paramétré, FPS, issue, débrief |
| P2-05 | Campagne alternée | Planifier → observer → incarner un autre test |
| P2-06 | Pièce et chapitre | Récupération, déblocage, jugement |
| P2-07 | IA de sujet | Profil, réaction à la cassette, issue lisible |
| P2-08 | Filtre anti-instructions | Refus des plans, cotes, procédures, adresses |

### 13.4 Risques

| Risque | Impact | Mitigation |
| --- | --- | --- |
| Confusion build/extension | Promesse non tenue | Statuts LIVRÉ/PROTOTYPE/EXTENSION |
| Scope de l’extension | Projet inachevé | P2 après stabilisation du build |
| Fidélité documentaire | Contestation | Registre sourcé, statuts de preuve |
| Assets | Production lente | Blockout, kits, réutilisation |
| Web Godot | Poids et compatibilité | Mesures, compression, fallback |
| Solo/small team | Épuisement | Scope strict, pas de multijoueur |
| Sauvegarde | Perte de données | Versionnement, tests de migration |

---

## 14. Décisions ouvertes

| # | Décision | Options | Recommandation | Bloque |
| --- | --- | --- | --- | --- |
| D1 | Périmètre canonique | Station + Théâtre / ajouter l’extension | **Station + Théâtre d’abord** | Communication |
| D2 | Doctrine 1:1 | Mécanique de film / documentaire + production | **Documentaire + production** | Écriture, assets |
| D3 | Priorité de l’extension | Maintenant / après P1 | **Après stabilisation** | Backlog |
| D4 | Sauvegarde Station | Session seule / reprise | **Reprise explicite** | UX |
| D5 | Langues | FR / FR+EN | **FR+EN** | Textes, VO |
| D6 | Distribution | Web / desktop | **Web d’abord**, desktop ensuite | Build |
| D7 | Assets 3D | Procédural / externe | **Procédural pour la Station**, externe original ensuite | Pipeline |
| D8 | Cloud | Local / cloud | **Local**, export manuel | Données |

---

## 15. Annexes

### A. Glossaire

| Terme | Définition |
| --- | --- |
| **Station** | Mode FPS d’exploration dans un centre de contrôle fictif. |
| **Théâtre** | Mode d’enquête illustré, cassette, énigme et décisions. |
| **Épreuve** | Unité de contenu du Théâtre : lieu, sujet, énigme, choix, issue. |
| **Campagne** | Ensemble ordonné d’épreuves avec une ou plusieurs fins. |
| **Blueprint** | Données complètes d’un test de l’extension (étapes, objets, issue). |
| **Architecte** | Extension : le joueur conçoit un test. |
| **Régie** | Extension : le joueur observe et influence un test. |
| **Victime** | Extension : le joueur incarne un sujet dans un test. |
| **1:1 documentaire** | Correspondance vérifiable entre un fait et l’édition citée. |
| **1:1 de production** | Concordance entre un livrable original et son modèle approuvé. |
| **PCK** | Archive de ressources du build Godot Web. |
| **Softlock** | État où le joueur ne peut plus progresser. |

### B. Carte des fichiers

| Fichier | Rôle |
| --- | --- |
| `src/views/StationMode.tsx` | Intégration iframe, chargement, plein écran, bilan |
| `src/views/StationPlan.tsx` | Plan des quatre espaces et de l’atelier |
| `src/services/stationProgress.ts` | Machine d’état des objectifs |
| `src/services/orionMarker.ts` | Drapeau ORION confirmé à la Station, lu par le Relais |
| `src/services/stationSession.ts` | Bilan de la dernière traversée, validé et relu au chargement |
| `godot-fps/scripts/station_run.gd` | Logique de partie, interactions, chrono |
| `godot-fps/scripts/station_layout.gd` | Architecture, collisions, lumières |
| `godot-fps/scripts/station_player.gd` | Contrôleur FPS |
| `src/views/TheatreMode.tsx` | Enquête, cassette, énigme, décisions |
| `src/components/common/TheatreScene.tsx` | Salle illustrée et points d’inspection |
| `src/components/common/TheatreWorkspace.tsx` | Espace de travail partagé |
| `src/services/simulationRules.ts` | Contrôles d’énigme et validation |
| `src/services/dernierRelaisData.ts` | Campagne *Le Dernier Relais* |
| `src/services/laUneDeMinuitData.ts` | Campagne *La Une de minuit* et ses trois fins |
| `src/services/rosterData.ts` | Roster des dix pièges, fiches de fidélité et trois fins |
| `src/services/sawOneTwoData.ts` | Treize situations de *Saw I* et *Saw II* réécrites en salles de lecture |
| `src/services/sawThreeFourData.ts` | Douze situations de *Saw III* et *Saw IV* réécrites en salles de lecture |
| `src/services/sawFiveSevenData.ts` | Vingt-deux situations de *Saw V* à *Saw VII* réécrites en salles de lecture |
| `src/services/sawLegacyData.ts` | Vingt et une situations de *Jigsaw*, *Spiral* et *Saw X* réécrites en salles de lecture |
| `src/services/fictionalArchitectData.ts` | Trois entrées fictives de la campagne *Gideon* réécrites en salles de lecture, avec leurs fiches de fidélité |
| `src/services/moralEngine.ts` | Sept axes et fins |
| `src/services/db.ts` | Stockage local, migration, chiffrement |
| `src/test/setup.ts` | `Storage` mémoire pour les tests sous Node 26 |

### C. Sources

- [Registre des références](REFERENCES_FRANCHISE.md)
- [Bible v1.0 commitée](https://github.com/darknigthmare/jigsaw-mastermind/blob/86280ba/docs/BIBLE_DU_JEU.md)
- [Build de référence `86280ba`](https://github.com/darknigthmare/jigsaw-mastermind/tree/86280ba)
- [Documentation Godot 4.6](https://docs.godotengine.org/en/stable/)

### D. Journal des versions

| Version | Date | Référence | Changement |
| --- | --- | --- | --- |
| 1.0 | 20/11/2026 | `574bb61` | Bible documentaire, Station, Théâtre, *Le Dernier Relais* |
| 2.0 | 21/11/2026 | `86280ba` | Réécriture : build livré + extension Jigsaw séparée |

---

## Prochaines actions

1. **Aligner la branche** sur `master` (`86280ba`) pour que la Station et le Théâtre soient présents localement.
2. **Rejouer les vérifications** : `npm test`, `npm run lint`, `npm run build`, `npm run station:test`.
3. **Valider le parcours** *Le Dernier Relais* et la Station en visite/défi.
4. **Trancher D1–D3** : périmètre canonique, doctrine 1:1, priorité de l’extension.
5. **Ne pas présenter l’Architecte/la Régie/la Victime comme livrés** avant leur implémentation.
