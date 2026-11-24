import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

/**
 * A fresh in-memory Storage for every test. Node 25 ships an experimental
 * global `localStorage` that is unusable without `--localstorage-file` and
 * shadows jsdom's, so tests must not rely on either.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
});
