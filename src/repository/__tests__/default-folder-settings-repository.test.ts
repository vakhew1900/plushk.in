import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DefaultFolderSettingsRepository } from '../DefaultFolderSettingsRepository';

const store = vi.hoisted(() => new Map<string, unknown>());

vi.mock('wxt/utils/storage', () => ({
  storage: {
    defineItem: (key: string, opts?: { fallback?: unknown }) => ({
      getValue: async () => (store.has(key) ? store.get(key) : opts?.fallback),
      setValue: async (value: unknown) => {
        store.set(key, value);
      },
      removeValue: async () => {
        store.delete(key);
      },
    }),
  },
}));

beforeEach(() => {
  store.clear();
});

describe('DefaultFolderSettingsRepository', () => {
  it('falls back to an empty path (Bookmarks Toolbar) when nothing was ever set', async () => {
    const repo = new DefaultFolderSettingsRepository();
    expect(await repo.get()).toBe('');
  });

  it('round-trips a path written with set()', async () => {
    const repo = new DefaultFolderSettingsRepository();
    await repo.set('Reading/Later');
    expect(await repo.get()).toBe('Reading/Later');
  });
});
