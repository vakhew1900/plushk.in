// Rule matching and folder resolution happen only in the extension's own
// popup quick-save flow (see hooks/useQuickSave.ts) — bookmarks created or
// edited the native way (star icon, Ctrl+D, import, sync) are intentionally
// left untouched. See UI-4 in specs/tasks.md and specs/ideas.md.
import { browser } from 'wxt/browser';
import { collectRemovedBookmarkIds } from '@/lib/bookmark-removed-subtree';
import { resolveLocaleFromUiLanguage } from '@/lib/resolve-locale-from-ui-language';
import { getDefaultPresetForLocale } from '@/lib/default-presets';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { DomainAliasRepository } from '@/repository/DomainAliasRepository';
import { PageMatchGroupRepository } from '@/repository/PageMatchGroupRepository';
import { TagRepository } from '@/repository/TagRepository';
import { EntityTypeRepository } from '@/repository/EntityTypeRepository';
import { WorkflowRepository } from '@/repository/WorkflowRepository';
import { WorkflowStatusRepository } from '@/repository/WorkflowStatusRepository';
import { IconRuleRepository } from '@/repository/IconRuleRepository';
import { LocaleSettingsRepository } from '@/repository/LocaleSettingsRepository';
import { BookmarkTagLinkRepository } from '@/repository/BookmarkTagLinkRepository';
import { BookmarkEntityLinkRepository } from '@/repository/BookmarkEntityLinkRepository';
import { IconBookmarkRepository } from '@/repository/IconBookmarkRepository';
import { NoteRepository } from '@/repository/NoteRepository';
import { BookmarkService } from '@/services/BookmarkService';
import { SettingsExportImportService } from '@/services/SettingsExportImportService';
import { FileService } from '@/services/FileService';

export default defineBackground(() => {
  // No ServicesContext in the service worker (React isn't available) —
  // instantiated directly, as elsewhere in background.ts pre-UI-4.
  const bookmarkService = new BookmarkService(
    new BookmarkTagLinkRepository(),
    new BookmarkEntityLinkRepository(),
    new IconBookmarkRepository(),
    new NoteRepository(),
  );

  browser.bookmarks.onRemoved.addListener((id, removeInfo) => {
    const bookmarkIds = collectRemovedBookmarkIds(id, removeInfo.node);
    void Promise.all(bookmarkIds.map((bookmarkId) => bookmarkService.removeAllLinksForBookmark(bookmarkId)));
  });

  // First-launch only (SETTINGS-2) — `reason === 'install'` is itself the
  // one-shot signal, no separate "onboarding done" flag needed. Detects the
  // system UI language once, persists it, and seeds the default tags/entity
  // categories (with their reading/watching/playing workflow) for that
  // language — never on 'update', so a user's own edits are never overwritten.
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason !== 'install') return;

    const locale = resolveLocaleFromUiLanguage(browser.i18n.getUILanguage());
    void new LocaleSettingsRepository().set(locale);

    // FileService is only ever asked to save()/download during a manual
    // export from options — never called here, so its DOM-only implementation
    // (see FileService.ts) never actually runs in this service-worker context.
    const settingsExportImportService = new SettingsExportImportService(
      new BookmarkRuleRepository(),
      new DomainAliasRepository(),
      new PageMatchGroupRepository(),
      new TagRepository(),
      new EntityTypeRepository(),
      new WorkflowRepository(),
      new WorkflowStatusRepository(),
      new IconRuleRepository(),
      new FileService(),
    );
    void settingsExportImportService.importSettings(getDefaultPresetForLocale(locale));
  });
});
