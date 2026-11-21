# Jigsaw Mastermind — Registre des références

**Consultation du 20 novembre 2026 · 10 films et 2 jeux vidéo officiels**

Ce registre documente titres, sorties, continuité et motifs utiles à la [bible du jeu](BIBLE_DU_JEU.md). Les motifs sont des lectures éditoriales que l’équipe peut traduire dans une création originale. Un relevé visuel détaillé se rattache à une édition, un point de vue et un plan précis.

## Films · ordre de sortie

Les dates de la table sont celles du catalogue Lionsgate. Pour *Spiral*, l’année est donnée par les intitulés des vidéos officielles sur la fiche. Les dix fiches ont livré le titre et le contenu propres à chaque film dans leur représentation publique JSON. Les éditions d’exploitation, de projection ou de distribution locale peuvent porter d’autres dates.

| ID | Film | Date du catalogue | Fait retenu et motif d’adaptation | Source primaire consultée |
| --- | --- | --- | --- | --- |
| F01 | *Saw* | 29 octobre 2004 | **Fait** · Adam, Lawrence Gordon et Tapp. Le synopsis associe une pièce souterraine et des instructions sur microcassette. **Motif** · Faire observer un même lieu depuis des points de vue complémentaires et donner une fonction à la bande audio. | [Lionsgate · Saw](https://www.lionsgate.com/movies/saw?_api=true) |
| F02 | *Saw II* | 28 octobre 2005 | **Fait** · Eric Matthews et un groupe de personnes isolées structurent deux fils du récit. **Motif** · Alterner enquête et progression dans un lieu, avec une information distribuée entre participants. | [Lionsgate · Saw II](https://www.lionsgate.com/movies/saw-2?_api=true) |
| F03 | *Saw III* | 27 octobre 2006 | **Fait** · Le synopsis nomme Amanda, Lynn Denlon et Jeff. **Motif** · Rendre lisibles une relation d’apprentissage et les conséquences des décisions de proximité. | [Lionsgate · Saw III](https://www.lionsgate.com/movies/saw-3?_api=true) |
| F04 | *Saw IV* | 26 octobre 2007 | **Fait** · Rigg suit une enquête et un parcours à durée limitée. **Motif** · Chaque seuil modifie ce que le joueur sait. Établir explicitement comment les lieux se raccordent. | [Lionsgate · Saw IV](https://www.lionsgate.com/movies/saw-4?_api=true) |
| F05 | *Saw V* | 24 octobre 2008 | **Fait** · Hoffman est associé à un héritage et à un secret après la mort de John. **Motif** · Employer dossiers, traces et états de classement pour rendre une continuité vérifiable. | [Lionsgate · Saw V](https://www.lionsgate.com/movies/saw-5?_api=true) |
| F06 | *Saw VI* | 23 octobre 2009 | **Fait** · La fiche mentionne Hoffman, Strahm et le FBI. **Motif** · Faire comprendre des choix institutionnels et leurs effets par des consignes, des dossiers et un bilan. | [Lionsgate · Saw VI](https://www.lionsgate.com/movies/saw-6?_api=true) |
| F07 | *Saw: The Final Chapter* (*Saw 3D*) | 29 octobre 2010 | **Fait** · Bobby Dagen et le groupe de survivants structurent le synopsis. Le catalogue emploie *The Final Chapter*. **Motif** · Explorer la différence entre un témoignage public, sa provenance et les traces qui le corroborent. | [Lionsgate · The Final Chapter](https://www.lionsgate.com/movies/saw-7?_api=true) |
| F08 | *Jigsaw* | 27 octobre 2017 | **Fait** · L’enquête du synopsis survient plus d’une décennie après la mort de John. **Motif** · Faire relire une trace à plusieurs moments et marquer clairement le temps de chaque scène. | [Lionsgate · Jigsaw](https://www.lionsgate.com/movies/jigsaw?_api=true) |
| F09 | *Spiral: From the Book of Saw* | 2021 | **Fait** · Zeke Banks et son partenaire enquêtent sur des événements liés au passé de la ville. **Motif** · Appuyer l’enquête sur le regard du personnage, la mémoire d’une institution et la ville. | [Lionsgate · Spiral](https://www.lionsgate.com/movies/spiral?_api=true) |
| F10 | *Saw X* | 29 septembre 2023 | **Fait** · John Kramer voyage au Mexique, dans un épisode placé entre *Saw* et *Saw II*. **Motif** · Donner au changement de lieu et d’éclairage le rôle de traduire l’espoir, puis la désillusion. | [Lionsgate · Saw X](https://www.lionsgate.com/movies/saw-x?_api=true) |

## Roster jouable · situations transposées

Le Théâtre consacre une salle de lecture à une situation de chaque film (`src/services/rosterData.ts`). Le registre ne décrit ni matériel ni procédure : il fixe la situation de référence, la lecture jouée et le statut de la preuve. Chaque salle affiche sa fiche de fidélité dans l’application.

| Salle | Référence | Lecture jouée | Statut |
| --- | --- | --- | --- |
| Le bain | `F01` *Saw* | Registre d’entretien, dalle `C-2`, partage de la clé | **Interprétation** |
| La maison au gaz | `F02` *Saw II* | Plan de ventilation, 540 m³ à 30 m³/min | **Interprétation** |
| Le congélateur | `F03` *Saw III* | Chambre froide, 12 °C à −3 °C | **Interprétation** |
| Le mausolée | `F04` *Saw IV* | Registre funéraire, dernier lundi de février 2031 | **Interprétation** |
| Le cube d’eau | `F05` *Saw V* | Réservoir de 1 080 L, pompe à 15 L/min | **Interprétation** |
| Le manège | `F06` *Saw VI* | Grille de six sièges et registre de sélection | **Interprétation** |
| La cage publique | `F07` *Saw VII* | Relevé de vote, quorum et publication | **Interprétation** |
| Le silo | `F08` *Jigsaw* | Trois trémies, pesée et bordereau | **Interprétation** |
| Le faux témoin | `F09` *Spiral* | Référence d’origine et réserve d’archive | **Interprétation** |
| La machine | `F10` *Saw X* | Compteur de verrous et porte laissée ouverte | **Interprétation** |

**Portée.** Le statut **Interprétation** signifie que la situation est retenue comme motif de conception, pas qu’un plan précis a été relevé. Avant toute publication, chaque salle demande sa fiche de preuve visuelle : édition, timecode ou capture, point de vue et ce que le cadre permet réellement de lire. Aucune ligne ne décrit de geste, d’outil ou de procédure.

**Films fondateurs convertis.** Les treize situations de `F01` et `F02` sont désormais couvertes une par une, avec salle, cassette, énigme et fiche de fidélité : sept salles pour *Saw* (2004) et six pour *Saw II* (2005). La couverture est éditoriale et jouable ; elle ne constitue pas un relevé plan par plan. Les statuts restent **Interprétation** jusqu’à la fiche de preuve visuelle de chaque salle.

**Deuxième passage.** `F03` et `F04` suivent avec douze salles : six pour *Saw III* (2006) et six pour *Saw IV* (2007). Les mêmes limites s’appliquent : situation et dilemme sont joués, aucun geste n’est décrit, et chaque salle attend sa fiche de preuve visuelle.

**Troisième passage.** `F05` à `F07` ajoutent vingt-deux salles : sept pour *Saw V* (2008), sept pour *Saw VI* (2009) et huit pour *Saw VII* (2010). La couverture reste éditoriale ; aucun geste, aucun dispositif et aucune blessure ne sont décrits, et chaque salle attend sa fiche de preuve visuelle.

**Quatrième passage.** `F08` à `F10` ajoutent vingt et une salles : huit pour *Jigsaw* (2017), six pour *Spiral* (2021) et sept pour *Saw X* (2023). La salle de *Saw X* suit son placement dans l’intervalle I–II, sans déplacer le voyage de John Kramer dans l’ordre de sortie. Mêmes limites : situation et dilemme sont joués, aucun geste n’est décrit, et chaque salle attend sa fiche de preuve visuelle.

## Continuité du récit

Les dates de sortie s’enregistrent avec leur territoire ou leur catalogue. La continuité se documente par relations entre scènes. L’ordre de révélation, le présent du récit et l’événement montré dans un souvenir peuvent recevoir trois repères distincts.

| Relation | État de la preuve | Application dans un dossier |
| --- | --- | --- |
| `F01 → F10 → F02` | Position de *Saw X* explicitement donnée par le synopsis officiel. | Indexer la sortie en 2023 et situer le voyage dans l’intervalle narratif I–II. [Lionsgate · Saw X](https://www.lionsgate.com/movies/saw-x?_api=true) |
| `F03 ↔ F04` | Chevauchement des événements décrit dans une analyse éditoriale de la fin. | Sur un événement partagé, consigner les deux points de vue et les repères de montage. [/Film · Saw III](https://www.slashfilm.com/1420034/saw-3-ending-explained-jigsaw-legacy/) |
| Cadre posthume de `F05`, succession dans `F06` | Les synopsis situent l’héritage de John et le rôle de Hoffman. | Indexer la situation principale et dater les retours en arrière scène par scène. [Lionsgate · Saw V](https://www.lionsgate.com/movies/saw-5?_api=true) · [Lionsgate · Saw VI](https://www.lionsgate.com/movies/saw-6?_api=true) |
| Enquête de `F08` | Le synopsis place cette enquête plus de dix ans après la mort de John. | Relier ce repère au fil d’enquête. Le placement d’une scène antérieure demande sa propre preuve. [Lionsgate · Jigsaw](https://www.lionsgate.com/movies/jigsaw?_api=true) |
| Position de `F09` par rapport à `F08` | À vérifier. La fiche de *Spiral* documente l’enquête et le passé de la ville. | Conserver 2021 dans l’ordre de sortie et laisser la relation interne ouverte. [Lionsgate · Spiral](https://www.lionsgate.com/movies/spiral?_api=true) |

Les crédits de *Saw X* demandent une vérification séparée sur l’édition. La fiche publique contient un bloc de crédits dont les noms correspondent à une autre production. Le titre, la date et le synopsis de la fiche sont les champs exploités ici. [Lionsgate · Saw X](https://www.lionsgate.com/movies/saw-x?_api=true)

## Jeux officiels

Les jeux portent leurs propres entrées de continuité et d’édition. Une observation du HUD, du cadrage ou de l’enchaînement des salles doit donner la version et la plateforme d’où elle provient. Pour Jigsaw Mastermind, les observations servent à cadrer le rythme, la lisibilité et la pression. Le prototype approuvé fixe la forme de l’interface, de la caméra et des niveaux produits.

| ID | Jeu et édition | Faits et degré de preuve | Sources consultées |
| --- | --- | --- | --- |
| G01 | *Saw* · 2009 | **Source primaire** · Valve annonce le 22 octobre 2009 la disponibilité Steam en Amérique du Nord. Elle nomme Konami et le détective David Tapp. **Catalogue éditorial** · Zombie Studios, Konami, PC, PlayStation 3 et Xbox 360. Le 6 octobre 2009 est la date de catalogue GameSpot, distincte de l’annonce Steam. | [Valve · annonce Steam](https://store.steampowered.com/oldnews/2978) · [GameSpot · fiche Saw](https://www.gamespot.com/games/saw/) |
| G02 | *Saw II: Flesh & Blood* · 2010 | **Catalogue éditorial** · GameSpot indique Zombie Studios, Konami, PlayStation 3 et Xbox 360, avec la date du 19 octobre 2010. L’entrée décrit le jeu de 2010. Le film *Saw II* possède l’entrée `F02`. | [GameSpot · fiche Saw II](https://www.gamespot.com/games/saw-ii-flesh-and-blood/) · [Bibliographie secondaire du jeu](https://en.wikipedia.org/wiki/Saw_II:_Flesh_%26_Blood) |

- **Perspective.** Les descriptions secondaires indiquent une présentation principale à la troisième personne dans les deux jeux. La Station utilise sa propre caméra à la première personne. Consigner un changement de perspective ponctuel uniquement avec sa séquence et sa version. [Description de G01](https://en.wikipedia.org/wiki/Saw_(video_game)) · [Description de G02](https://en.wikipedia.org/wiki/Saw_II:_Flesh_%26_Blood)
- **Médias repérés.** Les index GameSpot consultés recensent une démo du *Konami Gamers Night 2009* pour `G01`, et une bande-annonce E3 et une bande-annonce de lancement pour `G02`. Les index certifient l’existence des entrées. Les comparaisons plan par plan du cadrage, des timings et du HUD restent à consigner à partir du média joué. [Index vidéo de G01](https://www.gamespot.com/games/saw/videos/) · [Index vidéo de G02](https://www.gamespot.com/games/saw-ii-flesh-and-blood/videos/)
- **Langues et versions.** Les manuels Xbox anglais ont été repérés, avec accès refusé lors de la consultation. Audio, sous-titres, texte et disponibilité par région demandent vérification pour chaque édition. [Manuel indexé de G01](https://download-ssl.xbox.com/content/4b4e0802/0/SAW_manual_ENG.pdf) · [Manuel indexé de G02](https://download-ssl.xbox.com/content/4b4e0822/0/SAW2_manual_ENG.pdf)
- **Usage en conception.** L’équipe peut étudier la lisibilité de l’objectif, le temps accordé à l’observation et le rythme de transition. Une fiche d’adaptation transforme chaque motif retenu en une décision de jeu originale, validée dans sa version jouable. La continuité entre un événement de jeu et un événement du film reste une relation à sourcer séparément.

## Fiche de preuve visuelle à renseigner

| Champ | Exemple ou valeur attendue |
| --- | --- |
| Œuvre et édition | `F10`, édition consultée, langue, montage, source, date d’accès. Pour un jeu, fournir plateforme, région et version. |
| Repère de lecture | Chapitre et timecode, ou numéro de capture d’un press kit. Préciser si l’image vient d’une page de catalogue, d’une bande-annonce ou du jeu lancé. |
| Point de vue | Plan large, détail, face, profil ou autre angle utile. Indiquer ce que le cadre permet réellement de lire. |
| Sujet | Identité attestée, nom ou repère de lieu, époque, état visible et élément distinctif. Si un détail reste masqué, condition de la prochaine observation. |
| Portée de la preuve | Fait confirmé, détail observé, motif d’interprétation ou état encore à vérifier. Ajouter une seconde source si un témoignage ou une traduction diverge. |
| Traitement dans le jeu | ID de la fiche de production, motif retenu et décision originale correspondante. Relier le dessin ou le modèle approuvé et la vue de recette du build. |

**Exemple confirmé.** `F10 / position du récit` · synopsis Lionsgate, bloc de présentation du film. Le texte place l’action entre les événements des films I et II. Le registre du jeu affiche l’entrée à sa place dans la liste de sorties et l’intervalle I–II dans sa fiche de chronologie. [Lionsgate · Saw X](https://www.lionsgate.com/movies/saw-x?_api=true)

**Prochains relevés à consigner.** Édition, timecode, vue large et détail pour les lieux ou accessoires retenus. Pour les deux jeux, version de console ou de PC, chapitre et captures de l’interface en action. Le registre présent atteste la provenance éditoriale des informations qu’il cite. La fiche visuelle fait foi pour une validation plan par plan.
