import { browser } from 'wxt/browser';
import { BookmarkRepository } from '@/repository/BookmarkRepository';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { ModeSettingsRepository } from '@/repository/ModeSettingsRepository';
import { PendingHintRepository } from '@/repository/PendingHintRepository';
import { BookmarkService } from '@/services/BookmarkService';
import { createModeHandler } from '@/services/createModeHandler';
import { BookmarkDecisionStatus } from '@/services/interfaces/IBookmarkModeHandler';
import { PageMetaFiller } from '@/services/PageMetaFiller';

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

  browser.bookmarks.onCreated.addListener(async (_id, bookmark) => {
    if (importing || !bookmark.url) return; // skip folders (no url) and bulk imports

    const mode = await modeSettingsRepository.get();
    const modeHandler = createModeHandler(mode, ruleRepository);
    const bookmarkService = new BookmarkService(modeHandler, bookmarkRepository, pageMetaFiller);

    const decision = await bookmarkService.handleBookmarkCreated(bookmark);

    if (decision.status === BookmarkDecisionStatus.PENDING_CONFIRMATION && decision.targetFolder) {
      await pendingHintRepository.set({ bookmarkId: bookmark.id, targetFolder: decision.targetFolder });
    }
  });
});
