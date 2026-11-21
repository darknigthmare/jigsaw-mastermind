import type { UserSettings, Campaign, CharacterProfile, SymbolicTest, LoreEvent, SimulationRun } from '../types';
import {
  PRELOADED_CAMPAIGNS,
  PRELOADED_CHARACTERS,
  PRELOADED_TESTS,
  PRELOADED_LORE_EVENTS
} from './preloadedData';
import { DERNIER_RELAIS_CAMPAIGN, DERNIER_RELAIS_CHARACTERS, DERNIER_RELAIS_CONTENT_ID, DERNIER_RELAIS_TESTS } from './dernierRelaisData';
import { UNE_DE_MINUIT_CAMPAIGN, UNE_DE_MINUIT_CHARACTERS, UNE_DE_MINUIT_CONTENT_ID, UNE_DE_MINUIT_TESTS } from './laUneDeMinuitData';
import { ROSTER_CAMPAIGN, ROSTER_CHARACTERS, ROSTER_CONTENT_ID, ROSTER_TESTS } from './rosterData';
import { SAW_ONE_TWO_TESTS } from './sawOneTwoData';
import { SAW_THREE_FOUR_TESTS } from './sawThreeFourData';
import { SAW_FIVE_SEVEN_TESTS } from './sawFiveSevenData';
import { SAW_LEGACY_TESTS } from './sawLegacyData';

export const CONTENT_INSTALLATIONS_KEY = 'jigsaw_content_installed';
export const CONTENT_UPGRADES_KEY = 'jigsaw_content_upgraded';

/** One-time rewrites of shipped content. A record is only replaced while it
 * still carries its original title, so a player's edit is never overwritten. */
interface ContentUpgrade {
  id: string;
  legacyTitles: Record<string, string>;
  replacements: SymbolicTest[];
}

const CONTENT_UPGRADES: ContentUpgrade[] = [
  { id: 'saw-one-two-rewrite-v1', replacements: SAW_ONE_TWO_TESTS, legacyTitles: {
  'test-s1-bathroom': 'Bathroom Padlock Key',
  'test-s1-bear-trap': 'The Reverse Bear Lockway',
  'test-s1-razor-wire': 'Razor Wire Exit Lock',
  'test-s1-flammable-jelly': 'Flammable Jelly Code',
  'test-s1-drill-chair': 'Drill Chair Latch',
  'test-s1-shotgun-hallway': 'Shotgun Hallway Breaker',
  'test-s1-zep-hostage': 'Zep\'s Hostage Poison',
  'test-s2-death-mask': 'The Death Mask Scale',
  'test-s2-needle-pit': 'The Needle Pit Confession',
  'test-s2-razor-box': 'The Razor Hand Box',
  'test-s2-furnace': 'Furnace Regulator Lock',
  'test-s2-shotgun-peephole': 'Shotgun Peephole Bypass',
  'test-s2-gas-house': 'Nerve Gas House Vent',
  } },
  { id: 'saw-three-four-rewrite-v1', replacements: SAW_THREE_FOUR_TESTS, legacyTitles: {
    'test-s3-freezer': 'Freezer Water Valve Lock',
    'test-s3-angel': 'The Angel Lockway Gears',
    'test-s3-rack': 'The Rack Torque Mesh',
    'test-s3-classroom': 'Classroom Trap Chains',
    'test-s3-pig-vat': 'Pig Vat Acid Latch',
    'test-s3-shotgun-collar': 'Lynn\'s Shotgun Collar',
    'test-s4-mausoleum': 'Mausoleum Key Coordinates',
    'test-s4-knife-chair': 'The Knife Chair Scale',
    'test-s4-hair': 'The Hair Scalp Lock',
    'test-s4-spikes': 'Rex & Morgan Spikes',
    'test-s4-bedroom': 'Ivan\'s Bedroom Harness',
    'test-s4-ice-blocks': 'Eric Matthews Ice Blocks',
  } },
  { id: 'saw-five-seven-rewrite-v1', replacements: SAW_FIVE_SEVEN_TESTS, legacyTitles: {
    'test-s5-pendulum': 'The Pendulum Bypass',
    'test-s5-blood-saws': 'The 10 Pints of Blood',
    'test-s5-collar-keys': 'Collar Key coordinates',
    'test-s5-water-cube': 'Peter Strahm Water Cube',
    'test-s5-ceiling-jars': 'The Ceiling Jars Grid',
    'test-s5-electric-bathtub': 'The Electric Bathtub',
    'test-s5-glass-coffin': 'The Glass Coffin',
    'test-s6-oxygen': 'The Oxygen Crusher',
    'test-s6-gallows': 'The Gallows Selection',
    'test-s6-carousel': 'The Shotgun Carousel',
    'test-s6-steam-maze': "Debbie's Steam Maze",
    'test-s6-acid-latch': "Brent's Acid Injection",
    'test-s6-pound-flesh': 'The Pound of Flesh',
    'test-s6-bear-trap-2': 'Reverse Bear Trap 2.0',
    'test-s7-horsepower': 'Horsepower Chain Release',
    'test-s7-silence': 'The Silence Latch Lock',
    'test-s7-lawnmower': 'The Lawnmower Latch',
    'test-s7-spike-cage': "Bobby's Spike Cage",
    'test-s7-public-exec': 'Public Circular Saws',
    'test-s7-brazen-bull': 'The Brazen Bull harness',
    'test-s7-impalement-wheel': 'The Impalement Wheel',
    'test-s7-wisdom-teeth': 'Wisdom Teeth Combination',
  } },
  { id: 'saw-legacy-rewrite-v1', replacements: SAW_LEGACY_TESTS, legacyTitles: {
    'test-jg-bucket-heads': 'The Bucket Head Scanner',
    'test-jg-chain-hangers': 'The Chain Hangers',
    'test-jg-poison-syringes': "Carly's Poison Syringe",
    'test-jg-leg-wire': "Ryan's Leg Wire Cut",
    'test-jg-silo': 'The Grain Silo Dials',
    'test-jg-cycle': "Mitch's Cycle Trap",
    'test-jg-shotgun-keys': 'Shotgun Keys Latch',
    'test-jg-laser-collars': 'Laser Collar Frequency',
    'test-sp-tongue': 'The Tongue Subway Release',
    'test-sp-finger': 'The Finger Latch Override',
    'test-sp-skinning': 'The Skinning Latch',
    'test-sp-wax': 'Kara Wax Face override',
    'test-sp-shredder': 'Glass Shredder coordinates',
    'test-sp-puppet-strings': 'Marcus Banks Chains',
    'test-sx-vacuum': 'Eyeball Vacuum scale',
    'test-sx-gigli': 'Gigli Saw Voltage',
    'test-sx-pipebomb': 'Pipe Bomb Safe Override',
    'test-sx-radiation': 'Radiation Mask Key',
    'test-sx-bone-crusher': "Gabriela's Radiation Gasket",
    'test-sx-blood-pit': 'Blood Pit Coordinates',
    'test-sx-gas-room': 'Poison Gas Room',
  } },
];

/** Public packs delivered additively. Each pack is installed once by ID, so an
 * existing library receives it without losing edits or deliberate deletions. */
const CONTENT_PACKS = [
  { id: DERNIER_RELAIS_CONTENT_ID, campaigns: [DERNIER_RELAIS_CAMPAIGN], characters: DERNIER_RELAIS_CHARACTERS, tests: DERNIER_RELAIS_TESTS },
  { id: UNE_DE_MINUIT_CONTENT_ID, campaigns: [UNE_DE_MINUIT_CAMPAIGN], characters: UNE_DE_MINUIT_CHARACTERS, tests: UNE_DE_MINUIT_TESTS },
  { id: ROSTER_CONTENT_ID, campaigns: [ROSTER_CAMPAIGN], characters: ROSTER_CHARACTERS, tests: ROSTER_TESTS },
];

function contentInstallations(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CONTENT_INSTALLATIONS_KEY) || '[]');
    return Array.isArray(value) && value.every(item => typeof item === 'string') ? value : [];
  } catch {
    return [];
  }
}

function contentUpgrades(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CONTENT_UPGRADES_KEY) || '[]');
    return Array.isArray(value) && value.every(item => typeof item === 'string') ? value : [];
  } catch {
    return [];
  }
}

function applyContentUpgrades(): void {
  const applied = contentUpgrades();
  const stored = storedCollection<SymbolicTest>(KEYS.TESTS);
  let upgraded = stored;
  let changed = false;
  for (const upgrade of CONTENT_UPGRADES) {
    if (!upgraded || applied.includes(upgrade.id)) continue;
    const replacements = new Map(upgrade.replacements.map(test => [test.id, test]));
    upgraded = upgraded.map(test => {
      if (test.title !== upgrade.legacyTitles[test.id]) return test;
      const replacement = replacements.get(test.id);
      if (!replacement) return test;
      changed = true;
      return replacement;
    });
    applied.push(upgrade.id);
  }
  if (changed && upgraded) localStorage.setItem(KEYS.TESTS, JSON.stringify(upgraded));
  if (applied.length) localStorage.setItem(CONTENT_UPGRADES_KEY, JSON.stringify(applied));
}

function storedCollection<T>(key: string): T[] | undefined {
  const raw = localStorage.getItem(key);
  if (raw === null) return undefined;
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error(`Invalid saved collection: ${key}`);
  return value as T[];
}

// Storage keys
const KEYS = {
  SETTINGS: 'jigsaw_settings',
  CAMPAIGNS: 'jigsaw_campaigns',
  CHARACTERS: 'jigsaw_characters',
  TESTS: 'jigsaw_tests',
  TIMELINE: 'jigsaw_timeline',
  RUNS: 'jigsaw_runs',
  ENCRYPTED_VAULT: 'jigsaw_encrypted_vault',
  IS_ENCRYPTED: 'jigsaw_is_encrypted'
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'industrial-dark',
  visualNoise: true,
  narrativeIntensity: 'dark',
  strictSafetyMode: true,
  localEncryptionEnabled: false
};

// Initialize DB with preloaded data if not exists
export function initializeDB(): void {
  // A locked vault is not a writable content library. Defer the new public
  // content until the existing decrypt/import flow has restored the lists.
  if (isVaultEncrypted()) return;
  const installed = contentInstallations();
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.CAMPAIGNS)) {
    localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(PRELOADED_CAMPAIGNS));
  }
  if (!localStorage.getItem(KEYS.CHARACTERS)) {
    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(PRELOADED_CHARACTERS));
  }
  if (!localStorage.getItem(KEYS.TESTS)) {
    localStorage.setItem(KEYS.TESTS, JSON.stringify(PRELOADED_TESTS));
  }
  if (!localStorage.getItem(KEYS.TIMELINE)) {
    localStorage.setItem(KEYS.TIMELINE, JSON.stringify(PRELOADED_LORE_EVENTS));
  }
  if (!localStorage.getItem(KEYS.RUNS)) {
    localStorage.setItem(KEYS.RUNS, JSON.stringify([]));
  }
  for (const pack of CONTENT_PACKS) {
    if (installed.includes(pack.id)) continue;
    const additions: [string, { id: string }[]][] = [
      [KEYS.CAMPAIGNS, pack.campaigns],
      [KEYS.CHARACTERS, pack.characters],
      [KEYS.TESTS, pack.tests],
    ];
    for (const [key, records] of additions) {
      const current = storedCollection<{ id: string }>(key) ?? [];
      const ids = new Set(current.map(item => item.id));
      const missing = records.filter(item => !ids.has(item.id));
      if (missing.length) localStorage.setItem(key, JSON.stringify([...current, ...missing]));
    }
    // Commit last. If a storage write fails, a later read can finish the pack
    // by ID without replacing records already written or edited by the user.
    installed.push(pack.id);
    localStorage.setItem(CONTENT_INSTALLATIONS_KEY, JSON.stringify(installed));
  }
  applyContentUpgrades();
}

// Settings
export function getSettings(): UserSettings {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// General CRUD helpers
export function getFromStorage<T>(key: string, defaultValue: T[] = []): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Campaign CRUD
export function getCampaigns(): Campaign[] {
  initializeDB();
  return getFromStorage<Campaign>(KEYS.CAMPAIGNS, PRELOADED_CAMPAIGNS);
}

export function saveCampaigns(campaigns: Campaign[]): void {
  saveToStorage(KEYS.CAMPAIGNS, campaigns);
}

// Characters CRUD
export function getCharacters(): CharacterProfile[] {
  initializeDB();
  return getFromStorage<CharacterProfile>(KEYS.CHARACTERS, PRELOADED_CHARACTERS);
}

export function saveCharacters(characters: CharacterProfile[]): void {
  saveToStorage(KEYS.CHARACTERS, characters);
}

// Tests CRUD
export function getTests(): SymbolicTest[] {
  initializeDB();
  return getFromStorage<SymbolicTest>(KEYS.TESTS, PRELOADED_TESTS);
}

export function saveTests(tests: SymbolicTest[]): void {
  saveToStorage(KEYS.TESTS, tests);
}

// Timeline CRUD
export function getTimeline(): LoreEvent[] {
  return getFromStorage<LoreEvent>(KEYS.TIMELINE, PRELOADED_LORE_EVENTS);
}

export function saveTimeline(events: LoreEvent[]): void {
  saveToStorage(KEYS.TIMELINE, events);
}

// Runs CRUD
export function getRuns(): SimulationRun[] {
  return getFromStorage<SimulationRun>(KEYS.RUNS, []);
}

export function saveRuns(runs: SimulationRun[]): void {
  saveToStorage(KEYS.RUNS, runs);
}

// Export / Import entire state
export interface BackupData {
  settings: UserSettings;
  campaigns: Campaign[];
  characters: CharacterProfile[];
  tests: SymbolicTest[];
  timeline: LoreEvent[];
  runs: SimulationRun[];
  contentInstallations?: string[];
  contentUpgrades?: string[];
}

export function exportBackupJSON(): string {
  const backup: BackupData = {
    settings: getSettings(),
    campaigns: getCampaigns(),
    characters: getCharacters(),
    tests: getTests(),
    timeline: getTimeline(),
    runs: getRuns(),
    contentInstallations: contentInstallations(),
    contentUpgrades: contentUpgrades()
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const backup: BackupData = JSON.parse(jsonStr);
    if (backup.settings && backup.campaigns && backup.characters && backup.tests && backup.timeline) {
      if (backup.contentInstallations !== undefined && (!Array.isArray(backup.contentInstallations)
        || !backup.contentInstallations.every(item => typeof item === 'string'))) return false;
      if (backup.contentUpgrades !== undefined && (!Array.isArray(backup.contentUpgrades)
        || !backup.contentUpgrades.every(item => typeof item === 'string'))) return false;
      saveSettings(backup.settings);
      saveCampaigns(backup.campaigns);
      saveCharacters(backup.characters);
      saveTests(backup.tests);
      saveTimeline(backup.timeline);
      saveRuns(backup.runs || []);
      // Replace rather than merge: an older backup must receive the new pack,
      // while a newer backup's deliberate deletions must remain deleted.
      localStorage.setItem(CONTENT_INSTALLATIONS_KEY, JSON.stringify(backup.contentInstallations ?? []));
      localStorage.setItem(CONTENT_UPGRADES_KEY, JSON.stringify(backup.contentUpgrades ?? []));
      initializeDB();
      return true;
    }
  } catch (e) {
    console.error('Failed to parse backup JSON', e);
  }
  return false;
}

// Web Crypto Encryption Helpers (AES-GCM 256-bit)
// Derived key from passphrase using PBKDF2

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptVault(passphrase: string): Promise<boolean> {
  try {
    const backupStr = exportBackupJSON();
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(backupStr);
    
    // Generate salt and IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const key = await deriveKey(passphrase, salt);
    const encryptedBytes = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBytes
    );
    
    // Package into a single array: [SALT_16_BYTES][IV_12_BYTES][ENCRYPTED_DATA]
    const result = new Uint8Array(salt.byteLength + iv.byteLength + encryptedBytes.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.byteLength);
    result.set(new Uint8Array(encryptedBytes), salt.byteLength + iv.byteLength);
    
    // Convert to Base64
    let binary = '';
    for (let offset = 0; offset < result.length; offset += 32768) {
      binary += String.fromCharCode(...result.subarray(offset, offset + 32768));
    }
    const base64Str = btoa(binary);
    
    // Save to local storage and clear plaintext
    localStorage.setItem(KEYS.ENCRYPTED_VAULT, base64Str);
    localStorage.setItem(KEYS.IS_ENCRYPTED, 'true');
    
    // Update settings
    const currentSettings = getSettings();
    currentSettings.localEncryptionEnabled = true;
    saveSettings(currentSettings);
    
    return true;
  } catch (e) {
    console.error('Encryption failed', e);
    return false;
  }
}

export async function decryptVault(passphrase: string): Promise<boolean> {
  try {
    const base64Str = localStorage.getItem(KEYS.ENCRYPTED_VAULT);
    if (!base64Str) return false;
    
    // Convert Base64 back to bytes
    const binaryStr = atob(base64Str);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    
    // Extract Salt, IV, and encrypted data
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const encryptedData = bytes.slice(28);
    
    const key = await deriveKey(passphrase, salt);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedData
    );
    
    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decryptedBuffer);
    
    // Import back into database
    const success = importBackupJSON(plaintext);
    if (success) {
      localStorage.removeItem(KEYS.ENCRYPTED_VAULT);
      localStorage.setItem(KEYS.IS_ENCRYPTED, 'false');
      
      const currentSettings = getSettings();
      currentSettings.localEncryptionEnabled = false;
      saveSettings(currentSettings);
      return true;
    }
  } catch (e) {
    console.error('Decryption failed. Wrong passphrase?', e);
  }
  return false;
}

export function isVaultEncrypted(): boolean {
  return localStorage.getItem(KEYS.IS_ENCRYPTED) === 'true';
}

export function clearAllData(): void {
  localStorage.clear();
  initializeDB();
}
