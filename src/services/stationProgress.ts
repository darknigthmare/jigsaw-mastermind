export interface StationProgress {
  started: boolean;
  completed: 0 | 1 | 2 | 3 | 4 | 5;
  workshop: 'unvisited' | 'registered' | 'open';
  mode: 'visite' | 'defi' | null;
  outcome: 'sortie-validee' | 'delai-expire' | null;
}

export const initialStationProgress: StationProgress = {
  started: false,
  completed: 0,
  workshop: 'unvisited',
  mode: null,
  outcome: null,
};

export function updateStationProgress(progress: StationProgress, message: unknown): StationProgress {
  if (typeof message !== 'object' || message === null || Array.isArray(message)) return progress;
  if (!('channel' in message) || message.channel !== 'jigsaw-station' || !('type' in message)) return progress;

  if (message.type === 'menu') {
    return progress.outcome ? { ...initialStationProgress } : progress;
  }
  if (message.type === 'started' && !progress.started && 'mode' in message && (message.mode === 'visite' || message.mode === 'defi')) {
    return { ...initialStationProgress, started: true, mode: message.mode };
  }
  if (message.type === 'restarted' && progress.started && progress.mode) {
    if ('mode' in message && message.mode !== progress.mode) return progress;
    return { ...initialStationProgress, started: true, mode: progress.mode };
  }
  if (!progress.started || progress.outcome) return progress;
  if (message.type === 'finished' && 'issue' in message) {
    if (message.issue === 'sortie-validee' && progress.completed === 4) {
      return { ...progress, completed: 5, outcome: message.issue };
    }
    if (message.issue === 'delai-expire' && progress.mode === 'defi') {
      return { ...progress, outcome: message.issue };
    }
    return progress;
  }
  if (message.type !== 'progress' || !('stage' in message)) return progress;

  switch (message.stage) {
    case 'badge': return progress.completed === 0 ? { ...progress, completed: 1 } : progress;
    case 'relais': return progress.completed === 1 ? { ...progress, completed: 2 } : progress;
    case 'index': return progress.completed === 2 ? { ...progress, completed: 3 } : progress;
    case 'evacuation': return progress.completed === 3 ? { ...progress, completed: 4 } : progress;
    case 'registre':
      return progress.completed >= 2 && progress.workshop === 'unvisited' ? { ...progress, workshop: 'registered' } : progress;
    case 'atelier':
      return progress.completed >= 2 && progress.workshop === 'registered' ? { ...progress, workshop: 'open' } : progress;
    default: return progress;
  }
}
