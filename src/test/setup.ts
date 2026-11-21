// Node 26 exposes an experimental `localStorage` getter that returns
// undefined when no --localstorage-file is provided. In this Vitest/jsdom
// combination the getter also leaves `window.localStorage` undefined, so the
// tests that use localStorage directly fail before they can run.
//
// This is a test-only Storage implementation. It keeps keys as own
// enumerable properties, like the browser Storage interface, so code that
// iterates `Object.keys(localStorage)` keeps working. Methods live on the
// prototype so tests can still spy on `Storage.prototype.setItem`.
class MemoryStorage {
  [name: string]: unknown;

  get length(): number {
    return Object.keys(this).length;
  }

  clear(): void {
    for (const key of Object.keys(this)) delete this[key];
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this, key) ? String(this[key]) : null;
  }

  key(index: number): string | null {
    return Object.keys(this)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this[key];
  }

  setItem(key: string, value: string): void {
    this[key] = String(value);
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  const storage = new MemoryStorage() as unknown as Storage;

  Object.defineProperty(globalThis, 'Storage', {
    configurable: true,
    value: MemoryStorage,
  });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });

  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'Storage', {
      configurable: true,
      value: MemoryStorage,
    });
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: storage,
    });
  }
}
