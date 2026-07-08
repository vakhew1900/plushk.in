import type { PendingBookmarkHint } from '../../types/pending-hint';

export interface IPendingHintRepository {
  get(): Promise<PendingBookmarkHint | undefined>;
  set(hint: PendingBookmarkHint): Promise<void>;
  clear(): Promise<void>;
}
