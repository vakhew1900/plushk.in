import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Mode } from '../../types/mode';
import { ModeSettingsRepository } from '../ModeSettingsRepository';

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

describe('ModeSettingsRepository', () => {
  it('falls back to On when nothing was ever set', async () => {
    const repo = new ModeSettingsRepository();
    expect(await repo.get()).toBe(Mode.ON);
  });

  it('round-trips a mode written with set()', async () => {
    const repo = new ModeSettingsRepository();
    await repo.set(Mode.OFF);
    expect(await repo.get()).toBe(Mode.OFF);
  });
});
