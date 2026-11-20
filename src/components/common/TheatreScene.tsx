import { useId, useState } from 'react';
import { ArrowDown, Check, Eye, MapPin, ScanSearch } from 'lucide-react';
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
          <span className="theatre-scene__eyebrow">{french ? 'Fiction originale · Le Dernier Relais' : scene ? 'Original fiction · Scene study' : workspaceFamily ? `Original theatre environment · ${workspaceFamily.label}` : 'Campaign theatre'}</span>
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

      <div className="theatre-scene__context">
        <div><span className="theatre-scene__eyebrow">{french ? 'Étape en cours' : 'Active stage'}</span><h2>{currentTest?.title ?? (isFinished ? 'Run complete' : 'No stage available')}</h2></div>
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
