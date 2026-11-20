import { Cable, KeyRound, Library, Wrench } from 'lucide-react';
import type { StationProgress } from '../services/stationProgress';

const objectives = [
  'Récupérez le badge au pupitre du sas.',
  'Choisissez un relais dans la galerie technique.',
  'Restaurez l’index dans les archives.',
  'Validez la sortie au fond des archives.',
  'Sortie validée.',
] as const;

const rooms = [
  { id: 'entry', icon: KeyRound, name: 'Sas', action: 'Badge', first: 0, end: 1 },
  { id: 'gallery', icon: Cable, name: 'Galerie', action: 'Relais', first: 1, end: 2 },
  { id: 'archive', icon: Library, name: 'Archives', action: 'Index et sortie', first: 2, end: 4 },
] as const;

export function StationPlan({ progress }: { progress: StationProgress }) {
  const workshopState = progress.workshop === 'open' ? 'Passage ouvert'
    : progress.workshop === 'registered' ? 'Registre relevé'
      : progress.completed >= 2 ? 'Diagnostic disponible' : 'Après le relais';

  return (
    <section id="station-plan" className="station-plan" aria-labelledby="station-plan-heading">
      <header className="station-plan-header">
        <h2 id="station-plan-heading">Plan de la station</h2>
        <span>{progress.completed} / 4 objectifs</span>
      </header>
      <div className="station-plan-layout">
        <ol className="station-plan-main" aria-label="Parcours principal du sas aux archives">
          {rooms.map(({ id, icon: Icon, name, action, first, end }) => {
            const active = progress.started && progress.completed >= first && progress.completed < end;
            const complete = progress.completed >= end;
            return (
              <li key={id} data-room={id} data-state={complete ? 'done' : active ? 'active' : 'pending'} aria-current={active ? 'step' : undefined}>
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
      <p className="station-plan-objective">{progress.started ? objectives[progress.completed] : 'Traversez le sas, la galerie et les archives. L’atelier est facultatif.'}</p>
    </section>
  );
}
