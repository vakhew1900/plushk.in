import type { CssIconSource, XPathIconSource } from '../icon-rule';

export const IconExtractMessageType = { REQUEST: 'iconExtract/request' } as const;
export type IconExtractMessageType = typeof IconExtractMessageType[keyof typeof IconExtractMessageType];

// Sent from `useQuickSave.ts` (popup, has `activeTab` access) to the
// on-demand-injected `content.ts` in the active tab, to resolve a matched
// IconRule's css/xpath source against the live page — see RULE-13. Mirrors
// `page-extract-message.ts`'s request/content-script round trip.
export interface IconExtractRequestMessage {
  type: IconExtractMessageType;
  source: CssIconSource | XPathIconSource;
}

export function isIconExtractRequestMessage(message: unknown): message is IconExtractRequestMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as Record<string, unknown>).type === IconExtractMessageType.REQUEST
  );
}
