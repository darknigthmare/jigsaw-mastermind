import { Cable, DoorOpen, KeyRound, Library, Wrench } from 'lucide-react';
import type { StationProgress } from '../services/stationProgress';

const objectives = [
  'Récupérez le badge au pupitre du sas.',
  'Choisissez un relais dans la galerie technique.',
  'Restaurez l’index dans les archives.',
  'Rejoignez le poste d’évacuation et validez le protocole correspondant à votre choix d’index.',
  'Activez le terminal de sortie du poste d’évacuation.',
  'Sortie validée.',
] as const;

const rooms = [
  { id: 'entry', icon: KeyRound, name: 'Sas', action: 'Badge', first: 0, end: 1 },
  { id: 'gallery', icon: Cable, name: 'Galerie', action: 'Relais', first: 1, end: 2 },
  { id: 'archive', icon: Library, name: 'Archives', action: 'Index', first: 2, end: 3 },
  { id: 'evacuation', icon: DoorOpen, name: 'Poste d’évacuation', action: 'Protocole et sortie', first: 3, end: 5 },
] as const;

export function StationPlan({ progress }: { progress: StationProgress }) {
  const workshopState = progress.workshop === 'open' ? 'Passage ouvert'
    : progress.workshop === 'registered' ? 'Registre relevé'
      : progress.outcome ? 'Détour non effectué'
      : progress.completed >= 2 ? 'Diagnostic disponible' : 'Après le relais';

  return (
    <section id="station-plan" className="station-plan" aria-labelledby="station-plan-heading">
      <header className="station-plan-header">
        <h2 id="station-plan-heading">Plan de la station</h2>
        <span>{progress.completed} / 5 objectifs</span>
      </header>
      <div className="station-plan-layout">
        <ol className="station-plan-main" aria-label="Parcours principal du sas au poste d’évacuation">
          {rooms.map(({ id, icon: Icon, name, action, first, end }) => {
            const active = progress.started && !progress.outcome && progress.completed >= first && progress.completed < end;
            const stopped = progress.outcome === 'delai-expire' && progress.completed >= first && progress.completed < end;
            const complete = progress.completed >= end;
            return (
              <li key={id} data-room={id} data-state={complete ? 'done' : stopped ? 'stopped' : active ? 'active' : 'pending'} aria-current={active ? 'step' : undefined}>
                <Icon size={16} aria-hidden="true" />
                <div><strong>{name}</strong><span>{action}{complete ? ' · validé' : ''}</span></div>
              </li>
            );
          })}
        </ol>
        <div className="station-plan-workshop" data-open={progress.workshop === 'open'}>
          <Wrench size={16} aria-hidden="true" />
          <strong>Atelier</strong>
          <span>Galerie → Archives</span>
          <span>{workshopState}</span>
        </div>
      </div>
      <p className="station-plan-objective">{progress.outcome === 'delai-expire'
        ? 'Le délai du défi est écoulé. Votre bilan conserve les objectifs atteints ; rejouez pour ouvrir une nouvelle fenêtre de sortie.'
        : progress.started ? objectives[progress.completed]
          : 'Traversez le sas, la galerie, les archives et le poste d’évacuation. L’atelier est facultatif.'}</p>
    </section>
  );
}
