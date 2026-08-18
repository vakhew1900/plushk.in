import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Theme } from '../../types/theme';
import { ThemeSettingsRepository } from '../ThemeSettingsRepository';

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

describe('ThemeSettingsRepository', () => {
  it('falls back to Dark when nothing was ever set', async () => {
    const repo = new ThemeSettingsRepository();
    expect(await repo.get()).toBe(Theme.DARK);
  });

  it('round-trips a theme written with set()', async () => {
    const repo = new ThemeSettingsRepository();
    await repo.set(Theme.LIGHT);
    expect(await repo.get()).toBe(Theme.LIGHT);
  });
});
