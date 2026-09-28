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
import { QuickAddService } from '@/services/QuickAddService';
import { DomainAliasService } from '@/services/DomainAliasService';
import { PageMatchGroupService } from '@/services/PageMatchGroupService';
import { QuickAddKind, QuickAddOpenMessageType, isQuickAddSaveMessage } from '@/types/messages/quick-add-message';
import { resolveQuickAddMenuTitles } from '@/lib/quick-add-menu-titles';
import { debugLog } from '@/lib/debug-log';

// Native context-menu item ids (RULE-14) — literal strings compared in two
// places (create + onClicked), so pulled into a named const per CLAUDE.md.
const QuickAddMenuId = {
  VARIABLE: 'plushkin-quick-add-variable',
  ICON: 'plushkin-quick-add-icon',
} as const;
type QuickAddMenuId = typeof QuickAddMenuId[keyof typeof QuickAddMenuId];

// chrome.contextMenus.ContextType values we actually use — the full set also
// includes 'link', 'video', 'audio', 'frame', etc.
const ContextMenuContext = {
  PAGE: 'page',
  SELECTION: 'selection',
  EDITABLE: 'editable',
  IMAGE: 'image',
} as const;

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

  const localeSettingsRepository = new LocaleSettingsRepository();

  // RULE-14 — right-click "add variable"/"add domain icon". Menu items are
  // (re)created on every install/update (not gated on reason === 'install'
  // like the seeding listener above) — chrome.contextMenus.create() calls
  // aren't safe to repeat with the same id without removeAll() first, but the
  // service worker only reliably gets a fresh, empty menu state right after
  // onInstalled fires, not on every wake from idle.
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.removeAll(() => {
      void localeSettingsRepository.get().then((locale) => {
        const titles = resolveQuickAddMenuTitles(locale);
        browser.contextMenus.create({
          id: QuickAddMenuId.VARIABLE,
          title: titles.variable,
          contexts: [ContextMenuContext.SELECTION, ContextMenuContext.EDITABLE, ContextMenuContext.PAGE],
        });
        browser.contextMenus.create({
          id: QuickAddMenuId.ICON,
          title: titles.icon,
          contexts: [ContextMenuContext.IMAGE],
        });
      });
    });
  });

  // Keeps the menu titles in sync if the user changes the UI language while
  // the extension is running (options page "Язык"/"Language" toggle) — that
  // setting lives in `chrome.storage` (via LocaleSettingsRepository), not
  // Dexie, so it's reachable from the service worker, unlike PageMatchGroup/
  // IconRule (see specs/tasks/RULE-14-context-menu-quick-add/description.md).
  localeSettingsRepository.watch((locale) => {
    debugLog('[quick-add] locale changed, updating context menu titles ->', locale);
    const titles = resolveQuickAddMenuTitles(locale);
    browser.contextMenus.update(QuickAddMenuId.VARIABLE, { title: titles.variable })
      .catch((err: unknown) => debugLog('[quick-add] failed to update the variable menu title', err));
    browser.contextMenus.update(QuickAddMenuId.ICON, { title: titles.icon })
      .catch((err: unknown) => debugLog('[quick-add] failed to update the icon menu title', err));
  });

  // chrome.contextMenus.onClicked has no DOM access — the target element and
  // its computed CSS selector are already cached client-side by
  // quick-add.content.ts's own `contextmenu` listener (fired just before this
  // one, on the same click). This just tells that tab which panel to open.
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab?.id) return;

    const kind = info.menuItemId === QuickAddMenuId.VARIABLE
      ? QuickAddKind.VARIABLE
      : info.menuItemId === QuickAddMenuId.ICON
      ? QuickAddKind.ICON
      : undefined;
    if (!kind) return;

    void browser.tabs.sendMessage(tab.id, { type: QuickAddOpenMessageType, kind });
  });

  const quickAddService = new QuickAddService(
    new DomainAliasService(new DomainAliasRepository()),
    new PageMatchGroupService(new PageMatchGroupRepository()),
    new IconRuleRepository(),
  );

  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- same pattern as content.ts: the async return is how onMessage delivers a response.
  browser.runtime.onMessage.addListener((message: unknown) => {
    if (!isQuickAddSaveMessage(message)) return;

    return (async () => {
      return message.kind === QuickAddKind.VARIABLE
        ? quickAddService.saveVariable(message)
        : quickAddService.saveIcon(message);
    })();
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
