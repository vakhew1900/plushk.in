import { storage } from 'wxt/utils/storage';
import type { PendingBookmarkHint } from '../types/pending-hint';
import type { IPendingHintRepository } from './interfaces/IPendingHintRepository';

const pendingHintItem = storage.defineItem<PendingBookmarkHint | null>('local:pendingHint', { fallback: null });

export class PendingHintRepository implements IPendingHintRepository {
  async get(): Promise<PendingBookmarkHint | undefined> {
    return (await pendingHintItem.getValue()) ?? undefined;
  }

  set(hint: PendingBookmarkHint): Promise<void> {
    return pendingHintItem.setValue(hint);
  }

  clear(): Promise<void> {
    return pendingHintItem.removeValue();
  }
}
