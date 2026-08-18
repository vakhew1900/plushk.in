import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Locale } from '../../locale';
import { LocaleSettingsRepository } from '../LocaleSettingsRepository';

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

describe('LocaleSettingsRepository', () => {
  it('falls back to RU when nothing was ever set', async () => {
    const repo = new LocaleSettingsRepository();
    expect(await repo.get()).toBe(Locale.RU);
  });

  it('round-trips a locale written with set()', async () => {
    const repo = new LocaleSettingsRepository();
    await repo.set(Locale.EN);
    expect(await repo.get()).toBe(Locale.EN);
  });
});
