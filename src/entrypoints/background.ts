import { browser } from 'wxt/browser';
import { BookmarkRepository } from '@/repository/BookmarkRepository';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { DefaultFolderSettingsRepository } from '@/repository/DefaultFolderSettingsRepository';
import { ModeSettingsRepository } from '@/repository/ModeSettingsRepository';
import { PendingHintRepository } from '@/repository/PendingHintRepository';
import { BookmarkService } from '@/services/BookmarkService';
import { createModeHandler } from '@/services/handler/createModeHandler';
import { BookmarkDecisionStatus } from '@/services/handler/interfaces/IBookmarkModeHandler';
import { PageMetaFiller } from '@/services/PageMetaFiller';
import { debugLog } from '@/lib/debug-log';
import { isQuickSaveMessage } from '@/types/messages/quick-save-message';
import { Mode } from '@/types/mode';
import type { PageMeta } from '@/types/page-meta';

export default defineBackground(() => {
  const ruleRepository = new BookmarkRuleRepository();
  const bookmarkRepository = new BookmarkRepository();
  const modeSettingsRepository = new ModeSettingsRepository();
  const defaultFolderSettingsRepository = new DefaultFolderSettingsRepository();
  const pendingHintRepository = new PendingHintRepository();
  const pageMetaFiller = new PageMetaFiller();

  // Chrome-only events — Firefox's `browser.bookmarks` doesn't implement
  // onImportBegan/onImportEnded, so guard with optional chaining instead of
  // crashing the background script on startup there.
  let importing = false;
  browser.bookmarks.onImportBegan?.addListener(() => {
    importing = true;
  });
  browser.bookmarks.onImportEnded?.addListener(() => {
    importing = false;
  });

  // Set right before a quick-save-triggered `bookmarkRepository.create()` and
  // cleared right after: the resulting `onCreated` fires within that same
  // window, so the listener below skips it instead of re-suggesting/re-moving
  // a bookmark the quick-save popup already placed.
  let suppressNextCreated = false;

  // Deprecated (not removed): sorts bookmarks created outside the popup
  // (native star icon/Ctrl+D, import, sync from another browser/device) —
  // still the only mechanism that handles those, so it keeps working exactly
  // as before, on domain/title/url only. It does NOT get `extras` — that
  // requires a tab reference (`activeTab`), which quick-save alone has. See
  // RULE-5 in specs/tasks.md; may be revisited later.
  browser.bookmarks.onCreated.addListener(async (_id, bookmark) => {
    if (suppressNextCreated || importing || !bookmark.url) return; // skip folders (no url) and bulk imports

    const mode = await modeSettingsRepository.get();
    const modeHandler = createModeHandler(mode, ruleRepository);
    const bookmarkService = new BookmarkService(modeHandler, bookmarkRepository, pageMetaFiller, defaultFolderSettingsRepository);

    const decision = await bookmarkService.handleBookmarkCreated(bookmark);

    if (decision.status === BookmarkDecisionStatus.PENDING_CONFIRMATION && decision.targetFolder) {
      await pendingHintRepository.set({ bookmarkId: bookmark.id, targetFolder: decision.targetFolder });
    }
  });

  browser.runtime.onMessage.addListener((message: unknown) => {
    if (!isQuickSaveMessage(message)) return;

    return (async () => {
      debugLog('[quick-save-debug] background: received message', message);

      const modeHandler = createModeHandler(message.mode, ruleRepository);
      let targetFolder = message.targetFolder;

      if (modeHandler.status === BookmarkDecisionStatus.PLACED) {
        const baseMeta = await pageMetaFiller.fillPageMeta({ url: message.url, title: message.title });
        const meta: PageMeta = { ...baseMeta, ...message.metaOverlay };
        const decision = await modeHandler.onBookmarkSelected(meta);
        targetFolder = decision.targetFolder ?? (await defaultFolderSettingsRepository.get());
        debugLog('[quick-save-debug] background: recomputed targetFolder for PLACED mode', targetFolder);
      }

      debugLog('[quick-save-debug] background: final targetFolder passed to bookmarkRepository.create', targetFolder);

      suppressNextCreated = true;
      try {
        const created = await bookmarkRepository.create(message.title, message.url, targetFolder);
        debugLog('[quick-save-debug] background: bookmark created', created);
      } finally {
        suppressNextCreated = false;
      }
    })();
  });
});
