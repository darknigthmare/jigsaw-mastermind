import { useId, useState } from 'react';
import { ArrowDownRight, Eye, FileText, Headphones, Layers, NotebookTabs } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { Campaign, SymbolicTest } from '../../types';
import { getTheatreWorkspaceFamily } from './theatreWorkspaceData';

interface TheatreWorkspaceProps {
  campaign: Campaign;
  test: SymbolicTest;
  subjectName?: string;
  isFinished: boolean;
  isPlayingTape: boolean;
  isPuzzleActive: boolean;
}

type StationId = 'console' | 'dossier' | 'audio' | 'clues';

const stations: { id: StationId; label: string }[] = [
  { id: 'console', label: 'Stage console' },
  { id: 'dossier', label: 'Case dossier' },
  { id: 'audio', label: 'Listening desk' },
  { id: 'clues', label: 'Clue archive' },
];

// Reuse the visible theatre controls. These links never change a response,
// reveal a clue, play audio or submit a branch on the player's behalf.
function visitTheatreControl(event: MouseEvent<HTMLAnchorElement>, targetId: string) {
  const target = document.getElementById(targetId) ?? document.getElementById('theatre-stage-console');
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
  const focusTarget = target.matches('button, a, input, select, textarea, [tabindex]')
    ? target
    : target.querySelector<HTMLElement>('button, a, input, select, textarea, [tabindex]');
  (focusTarget ?? document.getElementById('theatre-stage-console'))?.focus({ preventScroll: true });
}

export function TheatreWorkspace({ campaign, test, subjectName, isFinished, isPlayingTape, isPuzzleActive }: TheatreWorkspaceProps) {
  const family = getTheatreWorkspaceFamily(test.puzzleType);
  const [selectedId, setSelectedId] = useState<StationId>('console');
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const detailId = useId();
  const selectedStation = stations.find(station => station.id === selectedId)!;
  const clueCount = test.clues?.length ?? 0;
  const responseCount = test.puzzleType === 'confession'
    ? test.puzzleData?.confessionOptions?.length ?? 0
    : test.choices?.length ?? 0;
  const target = selectedId === 'audio' ? 'theatre-audio'
    : selectedId === 'clues' ? 'theatre-clues-trigger'
    : !isFinished && isPuzzleActive ? 'theatre-puzzle' : 'theatre-stage-console';

  return (
    <div className={`theatre-scene__room theatre-workspace theatre-workspace--${family.id}`} data-workspace-family={family.id}>
      <div className={`theatre-workspace__environment ${imageUnavailable ? 'is-image-unavailable' : ''}`}>
        {!imageUnavailable && <img src={`${import.meta.env.BASE_URL}${family.image}`} alt={family.imageDescription} className="theatre-workspace__image" onError={() => setImageUnavailable(true)} />}
        {imageUnavailable && <div className="theatre-workspace__unavailable"><Layers size={38} aria-hidden="true" /><span>{family.room}</span><span>The current dossier and stage controls are available alongside.</span></div>}
        <div className="theatre-workspace__caption"><span>Original theatre environment</span><strong>{family.label}</strong></div>
        {stations.map((station, index) => (
          <button
            key={station.id}
            type="button"
            className={`theatre-workspace__point ${selectedId === station.id ? 'is-selected' : ''} ${family.points[station.id][0] > 75 ? 'theatre-workspace__point--end' : family.points[station.id][0] < 25 ? 'theatre-workspace__point--start' : ''}`}
            style={{ left: `${family.points[station.id][0]}%`, top: `${family.points[station.id][1]}%` }}
            aria-label={`Inspect ${station.label.toLowerCase()}`}
            aria-pressed={selectedId === station.id}
            aria-controls={detailId}
            onClick={() => setSelectedId(station.id)}
          >
            <span className="theatre-workspace__point-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="theatre-workspace__point-label">{station.id === 'console' ? family.object : station.label}</span>
          </button>
        ))}
        <div className="theatre-workspace__floor-label" aria-hidden="true">{family.room} / {test.title}</div>
      </div>

      <div className="theatre-scene__inspection theatre-workspace__inspection">
        <div>
          <span className="theatre-scene__eyebrow"><Eye size={15} aria-hidden="true" /> Explore the workspace</span>
          <h3>{family.object}</h3>
          <p>{family.description}</p>
        </div>
        <div className="theatre-workspace__record-label"><FileText size={14} aria-hidden="true" /><span>{test.title}</span></div>
        <div className="theatre-scene__zone-list" role="group" aria-label="Workspace inspection points">
          {stations.map((station, index) => (
            <button key={station.id} type="button" aria-pressed={selectedId === station.id} aria-controls={detailId} className={selectedId === station.id ? 'is-selected' : ''} onClick={() => setSelectedId(station.id)}>
              <span className="theatre-scene__zone-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{station.id === 'console' ? family.object : station.label}</span>
              {selectedId === station.id && <Eye size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div id={detailId} className="theatre-scene__detail theatre-workspace__detail" aria-live="polite" aria-atomic="true">
          <span className="theatre-scene__eyebrow">In this stage</span>
          <h4>{selectedId === 'console' ? family.object : selectedStation.label}</h4>
          {selectedId === 'dossier' ? (
            <dl className="theatre-workspace__dossier">
              <div><dt>Subject</dt><dd>{subjectName || 'Campaign participant'}</dd></div>
              <div><dt>Setting</dt><dd>{campaign.fictionalLocation || 'Authored campaign setting'}</dd></div>
              <div><dt>Theme</dt><dd>{test.moralTheme || campaign.moralTheme || 'Authored stage'}</dd></div>
              <div><dt>Response format</dt><dd>{family.label}{responseCount > 0 ? ` · ${responseCount} ${test.puzzleType === 'confession' ? 'statements' : 'branches'}` : ''}</dd></div>
            </dl>
          ) : selectedId === 'audio' ? (
            <><p>The listening desk contains the current stage’s tape for {subjectName || 'the campaign participant'}. Playback stays in the audio controls below.</p><span className="theatre-workspace__state"><Headphones size={14} aria-hidden="true" />{isFinished ? 'Stage recorded' : isPlayingTape ? 'Tape playing' : 'Tape paused or complete'}</span></>
          ) : selectedId === 'clues' ? (
            <><p>{clueCount ? `${clueCount} saved ${clueCount === 1 ? 'clue belongs' : 'clues belong'} to this stage. The clue archive keeps its existing reveal controls.` : 'This stage has no saved clues. You can continue using its tape and response console.'}</p><span className="theatre-workspace__state"><NotebookTabs size={14} aria-hidden="true" />{clueCount ? 'Clue text stays in the archive' : 'No clue records'}</span></>
          ) : (
            <><p>{family.consoleDescription}</p><span className="theatre-workspace__state"><Layers size={14} aria-hidden="true" />{isFinished ? 'Run complete' : isPlayingTape ? 'Listen before responding' : isPuzzleActive ? 'Response console ready' : 'Decision branches ready'}</span></>
          )}
          {selectedId !== 'dossier' && (selectedId !== 'clues' || (clueCount > 0 && !isFinished)) && (
            <a href={`#${target}`} className="theatre-workspace__control-link" onClick={event => visitTheatreControl(event, target)}>
              {selectedId === 'audio' ? 'Go to audio controls' : selectedId === 'clues' ? 'Go to clue archive' : isFinished ? 'View stage outcome' : 'Go to response console'}<ArrowDownRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
        <p className="theatre-scene__inspection-note">Inspect freely. Respond using the existing stage controls.</p>
      </div>
    </div>
  );
}
