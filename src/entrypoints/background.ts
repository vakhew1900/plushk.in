// Rule matching and folder resolution happen only in the extension's own
// popup quick-save flow (see hooks/useQuickSave.ts) — bookmarks created or
// edited the native way (star icon, Ctrl+D, import, sync) are intentionally
// left untouched. See UI-4 in specs/tasks.md and specs/ideas.md.
import { browser } from 'wxt/browser';
import { collectRemovedBookmarkIds } from '@/lib/bookmark-removed-subtree';
import { BookmarkTagLinkRepository } from '@/repository/BookmarkTagLinkRepository';
import { BookmarkEntityLinkRepository } from '@/repository/BookmarkEntityLinkRepository';
import { BookmarkService } from '@/services/BookmarkService';

export default defineBackground(() => {
  // No ServicesContext in the service worker (React isn't available) —
  // instantiated directly, as elsewhere in background.ts pre-UI-4.
  const bookmarkService = new BookmarkService(new BookmarkTagLinkRepository(), new BookmarkEntityLinkRepository());

  browser.bookmarks.onRemoved.addListener((id, removeInfo) => {
    const bookmarkIds = collectRemovedBookmarkIds(id, removeInfo.node);
    void Promise.all(bookmarkIds.map((bookmarkId) => bookmarkService.removeAllLinksForBookmark(bookmarkId)));
  });
});
