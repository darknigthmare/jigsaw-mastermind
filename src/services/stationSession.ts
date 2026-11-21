import type { StationProgress } from './stationProgress';

// The Godot scene cannot be serialized from the web page, so a reload cannot
// restore the player's position or door states. What survives is the run report
// itself, kept locally and shown explicitly instead of pretending the crossing
// never happened.
export const STATION_SESSION_KEY = 'jigsaw_station_session';
const VERSION = 1;

const STATUSES = ['en-cours', 'sortie-validee', 'delai-expire'] as const;
const MODES = ['visite', 'defi'] as const;

export interface StationSession {
  version: 1;
  status: (typeof STATUSES)[number];
  mode: (typeof MODES)[number];
  completed: StationProgress['completed'];
  recordedAt: string;
}

/** The report of a started run, or null while no run has begun. */
export function toStationSession(progress: StationProgress, recordedAt = new Date().toISOString()): StationSession | null {
  if (!progress.started || !progress.mode) return null;
  return {
    version: VERSION,
    status: progress.outcome ?? 'en-cours',
    mode: progress.mode,
    completed: progress.completed,
    recordedAt,
  };
}

function isStationSession(value: unknown): value is StationSession {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  const status = candidate.status;
  const completed = candidate.completed;
  return candidate.version === VERSION
    && typeof status === 'string' && (STATUSES as readonly string[]).includes(status)
    && typeof candidate.mode === 'string' && (MODES as readonly string[]).includes(candidate.mode)
    && typeof completed === 'number' && Number.isInteger(completed) && completed >= 0 && completed <= 5
    // A validated exit always records all five objectives.
    && !(status === 'sortie-validee' && completed !== 5)
    && typeof candidate.recordedAt === 'string' && Number.isFinite(Date.parse(candidate.recordedAt));
}

/** Read the last report; corrupt, outdated or foreign data is ignored. */
export function readStationSession(): StationSession | null {
  try {
    const raw = localStorage.getItem(STATION_SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStationSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStationSession(session: StationSession): void {
  try {
    localStorage.setItem(STATION_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage unavailable: the report is lost, the run keeps working.
  }
}

export function clearStationSession(): void {
  try {
    localStorage.removeItem(STATION_SESSION_KEY);
  } catch {
    // Nothing to clear.
  }
}
