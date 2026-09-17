import type { PageMatch, PageMatchGroup } from '../page-match';

export const PageExtractMessageType = { REQUEST: 'pageExtract/request' } as const;
export type PageExtractMessageType = typeof PageExtractMessageType[keyof typeof PageExtractMessageType];

// A wire-safe stand-in for `PageMatchGroup`: `pageMatches` travels as
// `[string, PageMatch][]` instead of a `Map`. Chrome's extension messaging
// (`chrome.runtime`/`chrome.tabs` — what `browser.tabs.sendMessage` calls
// into on Chromium) JSON-serializes the message, which silently turns a
// `Map` into `{}` on the receiving end; Firefox's messaging uses structured
// clone and preserves `Map` fine, which is why this only broke on Chromium
// browsers (Chrome, Yandex, Edge, ...) and not Firefox. See `PageExtrasService`
// (sender, converts Map -> entries) and `content.ts` (receiver, converts back).
export interface PageExtractGroup {
  id: string;
  aliasId: string;
  pageMatches: [string, PageMatch][];
}

// Sent from `useQuickSave.ts` (popup, has `activeTab` access) to the
// on-demand-injected `content.ts` in the active tab. Carries every saved
// `PageMatchGroup` — the content script has no IndexedDB access of its own
// (it runs in the page's origin, not the extension's), so the caller reads
// them via `IPageMatchGroupRepository` and forwards them here.
export interface PageExtractRequestMessage {
  type: PageExtractMessageType;
  groups: PageExtractGroup[];
}

export function toPageExtractGroup(group: PageMatchGroup): PageExtractGroup {
  return { id: group.id, aliasId: group.aliasId, pageMatches: Array.from(group.pageMatches.entries()) };
}

export function fromPageExtractGroup(group: PageExtractGroup): PageMatchGroup {
  return { id: group.id, aliasId: group.aliasId, pageMatches: new Map(group.pageMatches) };
}

export function isPageExtractRequestMessage(message: unknown): message is PageExtractRequestMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as Record<string, unknown>).type === PageExtractMessageType.REQUEST
  );
}
