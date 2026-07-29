import type { PageMatchGroup } from '../page-match';

export const PageExtractMessageType = { REQUEST: 'pageExtract/request' } as const;
export type PageExtractMessageType = typeof PageExtractMessageType[keyof typeof PageExtractMessageType];

// Sent from `useQuickSave.ts` (popup, has `activeTab` access) to the
// on-demand-injected `content.ts` in the active tab. Carries every saved
// `PageMatchGroup` — the content script has no IndexedDB access of its own
// (it runs in the page's origin, not the extension's), so the caller reads
// them via `IPageMatchGroupRepository` and forwards them here.
export interface PageExtractRequestMessage {
  type: PageExtractMessageType;
  groups: PageMatchGroup[];
}

export function isPageExtractRequestMessage(message: unknown): message is PageExtractRequestMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as Record<string, unknown>).type === PageExtractMessageType.REQUEST
  );
}
