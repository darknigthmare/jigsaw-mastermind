import type { UserSettings, Campaign, CharacterProfile, SymbolicTest, LoreEvent, SimulationRun } from '../types';
import {
  PRELOADED_CAMPAIGNS,
  PRELOADED_CHARACTERS,
  PRELOADED_TESTS,
  PRELOADED_LORE_EVENTS
} from './preloadedData';

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
  return getFromStorage<Campaign>(KEYS.CAMPAIGNS, PRELOADED_CAMPAIGNS);
}

export function saveCampaigns(campaigns: Campaign[]): void {
  saveToStorage(KEYS.CAMPAIGNS, campaigns);
}

// Characters CRUD
export function getCharacters(): CharacterProfile[] {
  return getFromStorage<CharacterProfile>(KEYS.CHARACTERS, PRELOADED_CHARACTERS);
}

export function saveCharacters(characters: CharacterProfile[]): void {
  saveToStorage(KEYS.CHARACTERS, characters);
}

// Tests CRUD
export function getTests(): SymbolicTest[] {
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
}

export function exportBackupJSON(): string {
  const backup: BackupData = {
    settings: getSettings(),
    campaigns: getCampaigns(),
    characters: getCharacters(),
    tests: getTests(),
    timeline: getTimeline(),
    runs: getRuns()
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const backup: BackupData = JSON.parse(jsonStr);
    if (backup.settings && backup.campaigns && backup.characters && backup.tests && backup.timeline) {
      saveSettings(backup.settings);
      saveCampaigns(backup.campaigns);
      saveCharacters(backup.characters);
      saveTests(backup.tests);
      saveTimeline(backup.timeline);
      saveRuns(backup.runs || []);
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
    const base64Str = btoa(String.fromCharCode(...result));
    
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
