export interface StationProgress {
  started: boolean;
  completed: 0 | 1 | 2 | 3 | 4;
  workshop: 'unvisited' | 'registered' | 'open';
}

export const initialStationProgress: StationProgress = {
  started: false,
  completed: 0,
  workshop: 'unvisited',
};

export function updateStationProgress(progress: StationProgress, message: unknown): StationProgress {
  if (typeof message !== 'object' || message === null || Array.isArray(message)) return progress;
  if (!('channel' in message) || message.channel !== 'jigsaw-station' || !('type' in message)) return progress;

  if (message.type === 'restarted' || (message.type === 'started' && !progress.started)) {
    return { ...initialStationProgress, started: true };
  }
  if (!progress.started || progress.completed === 4) return progress;
  if (message.type === 'finished' && 'issue' in message && message.issue === 'sortie-validee' && progress.completed === 3) {
    return { ...progress, completed: 4 };
  }
  if (message.type !== 'progress' || !('stage' in message)) return progress;

  switch (message.stage) {
    case 'badge': return progress.completed === 0 ? { ...progress, completed: 1 } : progress;
    case 'relais': return progress.completed === 1 ? { ...progress, completed: 2 } : progress;
    case 'index': return progress.completed === 2 ? { ...progress, completed: 3 } : progress;
    case 'registre':
      return progress.completed >= 2 && progress.workshop === 'unvisited' ? { ...progress, workshop: 'registered' } : progress;
    case 'atelier':
      return progress.completed >= 2 && progress.workshop === 'registered' ? { ...progress, workshop: 'open' } : progress;
    default: return progress;
  }
}
