import type { PageMeta } from '../../types/page-meta';

export const IconResultType = { DEFAULT: 'default', RULE: 'rule' } as const;
export type IconResultType = (typeof IconResultType)[keyof typeof IconResultType];

export type IconLinkResult =
  | { type: typeof IconResultType.DEFAULT; url: string | undefined }
  | { type: typeof IconResultType.RULE; url: string; ruleName?: string };

/**
 * Resolves the icon to show for a bookmark — see RULE-13. Two methods, not
 * one, because css/xpath `IconRule` sources need a live tab's DOM (via a
 * content script) that only exists at save time; a saved bookmark's card has
 * no tab to re-extract from, so it can only read back what was cached then.
 */
export interface IIconLinkService {
  /** Save-time: full `IconRule` matching, including DOM extraction against `tabId`. */
  resolveForSave(meta: PageMeta, aliasId: string | undefined, tabId: number): Promise<IconLinkResult>;

  /** Display-time: reads the `IconBookmark` cache for an already-saved bookmark. */
  resolveForBookmark(bookmarkId: string, url: string): Promise<IconLinkResult>;
}
