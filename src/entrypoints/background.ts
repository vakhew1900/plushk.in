import { browser } from 'wxt/browser';
import { BookmarkRepository } from '@/repository/BookmarkRepository';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { ModeSettingsRepository } from '@/repository/ModeSettingsRepository';
import { PendingHintRepository } from '@/repository/PendingHintRepository';
import { BookmarkService } from '@/services/BookmarkService';
import { createModeHandler } from '@/services/createModeHandler';
import { BookmarkDecisionStatus } from '@/services/interfaces/IBookmarkModeHandler';
import { PageMetaFiller } from '@/services/PageMetaFiller';
import { isQuickSaveMessage } from '@/types/quick-save-message';
import { Mode } from '@/types/mode';
import type { PageMeta } from '@/types/page-meta';

export default defineBackground(() => {
  const ruleRepository = new BookmarkRuleRepository();
  const bookmarkRepository = new BookmarkRepository();
  const modeSettingsRepository = new ModeSettingsRepository();
  const pendingHintRepository = new PendingHintRepository();
  const pageMetaFiller = new PageMetaFiller();

  let importing = false;
  browser.bookmarks.onImportBegan.addListener(() => {
    importing = true;
  });
  browser.bookmarks.onImportEnded.addListener(() => {
    importing = false;
  });

  // Set right before a quick-save-triggered `bookmarkRepository.create()` and
  // cleared right after: the resulting `onCreated` fires within that same
  // window, so the listener below skips it instead of re-suggesting/re-moving
  // a bookmark the quick-save popup already placed.
  let suppressNextCreated = false;

  browser.bookmarks.onCreated.addListener(async (_id, bookmark) => {
    if (suppressNextCreated || importing || !bookmark.url) return; // skip folders (no url) and bulk imports

    const mode = await modeSettingsRepository.get();
    const modeHandler = createModeHandler(mode, ruleRepository);
    const bookmarkService = new BookmarkService(modeHandler, bookmarkRepository, pageMetaFiller);

    const decision = await bookmarkService.handleBookmarkCreated(bookmark);

    if (decision.status === BookmarkDecisionStatus.PENDING_CONFIRMATION && decision.targetFolder) {
      await pendingHintRepository.set({ bookmarkId: bookmark.id, targetFolder: decision.targetFolder });
    }
  });

  browser.runtime.onMessage.addListener((message: unknown) => {
    if (!isQuickSaveMessage(message)) return;

    return (async () => {
      let targetFolder = message.targetFolder;

      if (message.mode === Mode.AUTO) {
        const meta: PageMeta = { url: message.url, domain: new URL(message.url).hostname, title: message.title };
        const decision = await createModeHandler(Mode.AUTO, ruleRepository).onBookmarkSelected(meta);
        targetFolder = decision.targetFolder;
      }

      suppressNextCreated = true;
      try {
        await bookmarkRepository.create(message.title, message.url, targetFolder);
      } finally {
        suppressNextCreated = false;
      }
    })();
  });
});
