// The general home for bookmark business logic that spans more than one
// repository — starting with link cleanup, growing over time to cover
// bookmark CRUD orchestration (e.g. deleting a bookmark from a future
// manager UI: chrome.bookmarks removal + link cleanup together). Deliberately
// not a 1:1 wrapper over IBookmarkRepository — that stays the thin gateway to
// chrome.bookmarks; this is where operations that also touch the Dexie link
// tables belong.
export interface IBookmarkService {
  /**
   * Deletes every cross-table link tied to one bookmark id — tag links,
   * category+status link, icon override, notes, and any future link table —
   * not just one of them. Safe to call for a bookmark with no links at all
   * (a no-op).
   */
  removeAllLinksForBookmark(bookmarkId: string): Promise<void>;
}
