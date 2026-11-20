import type { SymbolicTest } from '../../types';

export interface TheatreWorkspaceFamily {
  id: string;
  label: string;
  room: string;
  object: string;
  image: string;
  imageDescription: string;
  description: string;
  consoleDescription: string;
  points: Record<'console' | 'dossier' | 'audio' | 'clues', [number, number]>;
}

const families: Record<SymbolicTest['puzzleType'], TheatreWorkspaceFamily> = {
  logic: {
    id: 'archive',
    label: 'Archive',
    room: 'Archive studio',
    object: 'Index terminal',
    image: 'theatre/archive-room.webp',
    imageDescription: 'An original archive workspace with a central index terminal, paper files and an audio desk.',
    description: 'A quiet records room. The terminal, case files and listening desk bring the current stage into one workspace.',
    consoleDescription: 'The index terminal leads to this stage’s existing response controls. Enter and validate your answer there.',
    points: { console: [53, 44], dossier: [90, 40], audio: [13, 58], clues: [88, 58] },
  },
  confession: {
    id: 'confession',
    label: 'Statement',
    room: 'Statement studio',
    object: 'Statement lectern',
    image: 'theatre/confession-room.webp',
    imageDescription: 'An original statement workspace with a central lectern, translucent panels, case files and a listening desk.',
    description: 'Light falls across a statement lectern and translucent panels. The saved dossier gives the room its subject.',
    consoleDescription: 'The lectern leads to the saved statement options in the stage console. Inspecting this room does not select or rank them.',
    points: { console: [51, 53], dossier: [89, 41], audio: [13, 59], clues: [88, 65] },
  },
  sacrifice: {
    id: 'allocation',
    label: 'Allocation',
    room: 'Allocation studio',
    object: 'Allocation counter',
    image: 'theatre/allocation-room.webp',
    imageDescription: 'An original allocation workspace with two empty sorting trays on a central counter, an audio desk and case files.',
    description: 'Two empty trays share a planning counter. The stage’s allocation stays in its response console, ready to review.',
    consoleDescription: 'The counter leads to this stage’s saved allocation controls. Use the slider and validation button in the console below.',
    points: { console: [46, 51], dossier: [86, 47], audio: [13, 57], clues: [86, 66] },
  },
  maze: {
    id: 'workshop',
    label: 'Workshop',
    room: 'Alignment workshop',
    object: 'Alignment bench',
    image: 'theatre/workshop-room.webp',
    imageDescription: 'An original workshop with inert gear sculptures on an assembly bench, a listening desk and a case cabinet.',
    description: 'Inert gear studies sit on a broad workbench. The room frames an alignment task while the working controls remain in the console.',
    consoleDescription: 'The bench leads to this stage’s existing alignment controls. The illustration contains no additional combination or target.',
    points: { console: [60, 48], dossier: [86, 42], audio: [11, 56], clues: [88, 63] },
  },
  choice: {
    id: 'choice',
    label: 'Decision',
    room: 'Decision gallery',
    object: 'Dispatch desk',
    image: 'theatre/choice-room.webp',
    imageDescription: 'An original decision workspace with a central dispatch desk, two display bays, a listening desk and case files.',
    description: 'A dispatch desk anchors two open display bays. Review the current dossier, listen, then return to the stage’s response controls.',
    consoleDescription: 'The dispatch desk leads to this stage’s existing controls and decision branches. Room inspection does not submit a choice.',
    points: { console: [51, 54], dossier: [91, 44], audio: [15, 54], clues: [89, 61] },
  },
};

export function getTheatreWorkspaceFamily(type?: SymbolicTest['puzzleType']): TheatreWorkspaceFamily {
  return type && Object.hasOwn(families, type) ? families[type] : families.choice;
}
