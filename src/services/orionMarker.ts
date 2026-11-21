// The Station workshop's ORION detour is optional, so the only proof of it is
// what the player carries into Le Dernier Relais. The register alone proves
// nothing: only the witness comparison completes the diagnostic. One local flag
// is therefore enough, and it is written by the Station, read by the Relais.

export const ORION_CONFIRMED_KEY = 'jigsaw_orion_confirmed';
const CONFIRMED = 'confirmed';

/** True when the Station workshop register and witness were both verified. */
export function isOrionConfirmed(): boolean {
  try {
    return localStorage.getItem(ORION_CONFIRMED_KEY) === CONFIRMED;
  } catch {
    return false;
  }
}

/** Record the completed detour. A replay or a full storage never breaks a run. */
export function recordOrionConfirmed(): void {
  try {
    localStorage.setItem(ORION_CONFIRMED_KEY, CONFIRMED);
  } catch {
    // Storage unavailable: only the Relais dossier piece is lost.
  }
}
