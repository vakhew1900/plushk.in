export interface QuickSaveLinks {
  bookmarkId: string;
  tagIds: string[];
  entityTypeId: string | undefined;
  statusId: string | undefined;
}

/**
 * Writes a freshly quick-saved bookmark's tag/category links in one Dexie
 * transaction — the two rows (bookmarkTags, bookmarkEntityLinks) either both
 * land or neither does. `browser.bookmarks.create()` itself can't join this
 * transaction (it's a different store entirely, not IndexedDB), so this only
 * covers the two Dexie writes that follow it.
 */
export interface IBookmarkQuickSaveLinksRepository {
  save(links: QuickSaveLinks): Promise<void>;
}
