import type { Mode } from '../mode';
import type { PageMeta } from '../page-meta';

export const QuickSaveMessageType = { CREATE: 'quickSave/create' } as const;
export type QuickSaveMessageType = typeof QuickSaveMessageType[keyof typeof QuickSaveMessageType];

export interface QuickSaveMessage {
  type: QuickSaveMessageType;
  title: string;
  url: string;
  mode: Mode;
  // Resolved/edited folder for Hint mode. Ignored for Auto (recomputed from rules
  // in the background, the only context that can safely suppress its own
  // bookmarks.onCreated re-processing).
  targetFolder?: string;
  // Extraction result from `IPageExtrasService.extract()`, already computed in
  // the popup (only context with `activeTab`/tabId). Laid on top of the
  // background's own base `PageMeta` for the Auto-mode recompute below,
  // instead of re-extracting. See RULE-5.
  metaOverlay?: Partial<PageMeta>;
}

export function isQuickSaveMessage(message: unknown): message is QuickSaveMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as Record<string, unknown>).type === QuickSaveMessageType.CREATE
  );
}
