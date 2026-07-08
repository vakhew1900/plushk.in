import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PendingHintRepository } from '../PendingHintRepository';

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

describe('PendingHintRepository', () => {
  it('returns undefined when nothing is pending', async () => {
    const repo = new PendingHintRepository();
    expect(await repo.get()).toBeUndefined();
  });

  it('round-trips a hint written with set()', async () => {
    const repo = new PendingHintRepository();
    await repo.set({ bookmarkId: 'bm-1', targetFolder: 'Videos' });
    expect(await repo.get()).toEqual({ bookmarkId: 'bm-1', targetFolder: 'Videos' });
  });

  it('clears the pending hint', async () => {
    const repo = new PendingHintRepository();
    await repo.set({ bookmarkId: 'bm-1', targetFolder: 'Videos' });
    await repo.clear();
    expect(await repo.get()).toBeUndefined();
  });
});
