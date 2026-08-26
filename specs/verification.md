# Verification

Manual correctness checklist — things to verify by hand in the running extension (dev build, both `npm run dev` and `npm run dev:firefox`) since they aren't covered by unit tests (React components aren't tested per `CLAUDE.md`). Grouped by task category (see `specification.md`'s task-categories table). Check an item after confirming it in both browsers unless noted otherwise.

## SEARCH

- [ ] Favicon display in search results: real site icon shown on Chrome (via the `_favicon` endpoint, `src/lib/browser-constants/faviconUrl.ts`); letter fallback shown on Firefox (no native favicon API available — see `FaviconUrl.FIREFOX`) and on Chrome whenever a site truly has no icon.
- [ ] `SEARCH-3` new "Tags" sidebar tab: create a tag, rename it, change its color via the swatch picker (selected swatch shows the text-colored border), delete it — list updates immediately and survives an options-page reload (Dexie `tags` table, `db.version(2)`). Check both themes: all 8 palette colors stay legible against `--bg3` in dark and light.
- [ ] `SEARCH-9` Library tab `BookmarkCard`: wide favicon fills the full card height on the left (letter fallback or real favicon, just bigger — no behavior change); category badge (top-right) now tints its label text with the category's palette color, not just the dot; clicking the new info icon (bottom-right of the tags/status row) opens a popover with the folder path and full URL, and the card itself doesn't navigate when that icon or popover is clicked.
- [ ] `SEARCH-9` popup "Поиск" tab `CompactBookmarkCard`: favicon is noticeably smaller than the Library card's; category (colored, same as above) and tags show under the title, but are read-only — clicking them does nothing (no dropdown/popover opens, no `EntitySegment`/`TagPicker`); no status pill and no full URL row; a bookmark with no category and no tags shows no second row at all.
- [ ] `SEARCH-9` both cards, long folder path or long URL in the info popover: popover content wraps/scrolls instead of overflowing the popup/options window.
- [ ] `SEARCH-10` Library tab and popup "Поиск" filters row: new dashed-border "Папка" trigger opens a `Popover` (not a `DropdownMenu` like Tags/Category/Status); on the narrow 360px popup, Tags/Category/Status stay on one line and "Папка" wraps to its own line rather than any of the four getting dropped.
- [ ] `SEARCH-10` inside the folder popover, type a substring of a folder's name: non-matching folders disappear, matches plus their full ancestor chain stay visible; clearing the search box restores the full tree; typing something that matches nothing shows the "no matches" message instead of an empty popover.
- [ ] `SEARCH-10` click a folder node: popover closes immediately, the trigger shows the folder's path and a × next to it; results narrow to bookmarks in that folder **and its subfolders**.
- [ ] `SEARCH-10` click the × on the folder trigger: only the folder filter clears (Tags/Category/Status stay as they were); "Сбросить всё" still clears all four including the folder.
- [ ] `SEARCH-10` select a folder filter together with a tag/category filter: results satisfy both (AND), not either.
- [ ] `SEARCH-10` click one of the three top-level root containers (Bookmarks Toolbar/Other/Mobile) in the folder popover: filter clears back to "no folder selected" instead of applying a filter that matches nothing.
- [ ] `SEARCH-10` `FolderPicker` (popup quick-save screen, unrelated flow reusing the same `FolderTree`): still behaves exactly as before — no search box, no regression from the new `tree` override prop.
- [ ] `SEARCH-10` inside the folder popover, type a query that matches a deeply nested folder (e.g. two levels down): the matching folder and its ancestor chain show up already expanded — no need to manually click carets to reveal it.
- [ ] `SEARCH-10` popup main search ("Поиск"/`SearchBar`, not the folder popover): typing in the main search box (results count changing) does not resize or flicker the popup window; there's a brief (~200ms) lag before results actually update, but the input itself never feels laggy — old results stay visible during that lag instead of the whole list blanking out and reappearing.
- [ ] `SEARCH-10` "Библиотека" tab, same main search: the results list doesn't flash/blank while typing either (same fix, not a popup-resize issue there, but the same unmount-on-loading bug applied).

## RULE

- [ ] `RULE-5` quick-save Auto mode, matching selector: import `configs/social-extras/settings.json`, open `old.reddit.com` (a subreddit page), quick-save via popup in Auto mode → bookmark lands in `Social/Reddit/Programming` (rule matches on `extras.subreddit`).
- [ ] `RULE-5` quick-save Hint mode, same page/rule set: popup shows the suggested folder already reflecting the `extras.subreddit`-based rule, before saving.
- [ ] `RULE-5` no matching `PageMatchGroup` selector on the current page (e.g. quick-save a random article with `social-extras` imported): save succeeds normally, no error, no extras-based rule fires.
- [ ] `RULE-5` no `PageMatchGroup` saved at all: quick-save works exactly as before (no content-script injection attempted — check via `dev:firefox`/dev console that `PageExtrasService.extract` short-circuits).
- [ ] `RULE-5` quick-save on a restricted page (e.g. `chrome://extensions`, Chrome Web Store): save doesn't hang or error out — falls back to base `PageMeta` (no extras).
- [ ] `RULE-5` native save (star icon/Ctrl+D, not through popup) on a page with a matching `PageMatchGroup`: bookmark is still sorted by domain/title/url rules as before; extras-based rules do **not** fire (expected — native flow is out of scope, see `specs/tasks/RULE-5-page-extractor-quick-save/description.md`).
- [ ] `RULE-11` visual rule builder (`ConsView`, `RuleEditor` → Visual tab): add a leaf condition, add a nested group, switch its type AND→OR→NOT via the header switcher, remove a condition/group, save — no lost focus/id-related glitches, and the JSON tab shows the saved condition using `"nodes"` (not `"and"`/`"or"`/`"not"`).
- [ ] `RULE-12` Variables section, zero `DomainAlias` saved yet: "Add group" button is disabled with a hint, doesn't create a broken/empty group on click.
- [ ] `RULE-12` Variables section, add a `DomainAlias` then add a group: new group is created scoped to that alias (no free-text name field anymore — a `Select` dropdown showing the alias).
- [ ] `RULE-12` add a second group while only one alias exists: "Add group" is disabled again (no unclaimed alias left) until another alias is added.
- [ ] `RULE-12` two groups, each on a different alias: opening either group's alias dropdown does not offer the other group's alias, but does still show its own currently-assigned alias.
- [ ] `RULE-12` delete a `DomainAlias` that has a group linked to it (Aliases section): the linked group disappears from the Variables section too, without a manual page refresh.
- [ ] `RULE-12` quick-save on a page whose domain resolves to an alias with a linked `PageMatchGroup`: only that group's selectors run (check via `dev:firefox`/dev console — `PageExtrasService.extract` is called with a single-element array, not every saved group).
- [ ] `RULE-12` quick-save on a page whose domain resolves to an alias with **no** linked group, or to no alias at all: extraction is skipped entirely (no content-script injection), same as the existing `RULE-5` "no `PageMatchGroup` saved at all" case above.
- [ ] `RULE-12` import `configs/social-extras/settings.json` (now on `version: 3`, `pageMatchGroups[].aliasId`): import succeeds, Reddit/DTF groups show up in the Variables section each bound to their respective alias via the dropdown.
- [ ] `RULE-13` Mappings tab, new "Иконки" section: add a `domain`-type rule (e.g. `youtube.com`) with a `static` source pointing at a real image URL — save persists, reload keeps it.
- [ ] `RULE-13` add a `url`-type rule with a `css` source (e.g. a page's `.logo img` selector) — quick-save that exact page: the "Дополнительно" section's icon swatch shows the extracted image and the "Подобрано правилом «X»" caption, without opening dev tools.
- [ ] `RULE-13` same as above but the css selector matches nothing on the page: icon swatch falls back to the plain favicon/letter, no error, no stuck loading state.
- [ ] `RULE-13` in the popup's "Дополнительно" section, click the pencil next to the icon, type a custom image URL, click "Готово": the swatch updates to the typed URL; saving the bookmark and reopening the Library card shows that same custom icon (not the rule-matched one) — confirms the manual override persists and wins.
- [ ] `RULE-13` two `url`-type rules where one's value is a prefix of the other (e.g. `https://habr.com` and `https://habr.com/ru/posts`) — quick-save a page under the longer path: the more specific (longer-prefix) rule's icon is used, not the shorter one.
- [ ] `RULE-13` add an `alias`-type rule bound to an existing `DomainAlias`, then delete that alias from the Aliases section: the icon rule disappears from the Иконки section too, without a manual page refresh (cascade, mirrors `RULE-12`'s alias→group cascade).
- [ ] `RULE-13` Library tab `BookmarkCard`: a bookmark saved with a resolved/overridden icon shows that icon (not the default favicon/letter) after a full options-page reload — confirms `IconBookmark` is actually read back, not just held in popup-session state.
- [ ] `RULE-13` delete a bookmark that has a custom icon (native delete or a future manager, whichever is available) and re-save the exact same URL fresh: no stale icon reappears — confirms `IconBookmark` cleanup on `bookmarks.onRemoved` (`BookmarkService.removeAllLinksForBookmark`) actually fired.
- [ ] `UI-15` Library tab `BookmarkCard`: a thin gear rail with a vertical divider line shows on the right edge of every card, separate from the existing tags/status/info-icon row; clicking it opens a settings popover without also opening the bookmark (no navigation, no card-click side effect).
- [ ] `UI-15` settings popover: left icon-only tab rail shows two tabs — "Настройки" highlighted/active with an accent indicator bar, "Заметки" visibly muted; clicking "Заметки" does nothing (no content change, "Настройки" stays shown).
- [ ] `UI-15` settings popover: large (~80px) icon preview on the left matches whatever the card itself currently shows (rule-matched icon, manual override, or plain favicon/letter) — not a different/stale image.
- [ ] `RULE-8` create a rule with `targetFolder: "$$__year$$/$$domain$$"`, quick-save a matching page: popup's folder tree pre-selects the resolved literal path (e.g. `2026/example.com`), not the raw `$$...$$` template, and saving actually creates that folder.
- [ ] `RULE-8` same rule, but the page's domain resolves to a saved `DomainAlias` — use `$$alias$$` instead of `$$domain$$`: resolved folder uses the alias's display name.
- [ ] `RULE-8` a rule whose `targetFolder` has no `$$...$$` tokens at all: behaves exactly as before (no regression for existing rules).
- [ ] `UI-15` click "Изменить" under the big icon: focus moves to the icon-link text field below (no popover-in-popover, no page scroll jump).
- [ ] `UI-15` type a custom icon URL into the settings popover's icon field, then click elsewhere (blur) or press Enter: the card's icon updates immediately (same tab, no reload) to the typed URL, and outlives closing/reopening the popover.
- [ ] `UI-15` clear that same field back to empty and blur: the card's icon reverts to whatever `IconRule`/favicon would show without an override — not a blank/broken image.
- [ ] `UI-15` category/status segmented controls and tags inside the settings popover: changing them there updates the same card's inline `EntitySegment`/`StatusSegment`/tag chips immediately, and vice versa (edit inline, reopen the popover — it reflects the change) — confirms both surfaces share the same underlying hooks, not two independent copies.
- [ ] `UI-15` popup "Поиск" tab `CompactBookmarkCard`: no gear icon appears there — unchanged from `SEARCH-9`.
- [ ] `UI-16` Library tab `BookmarkCard`: the settings rail now shows two stacked cells separated by a thin line — a trash icon on top, the existing gear below. Clicking the trash opens the delete-confirmation dialog directly, **without** opening the settings dialog.
- [ ] `UI-16` delete-confirmation dialog (either entry point): shows the bookmark's title in the heading, a generic body (no enumerated tag/category list), "Отмена"/"Удалить" buttons. "Отмена" closes it with no effect; "Удалить" removes the bookmark from `chrome://bookmarks` (or Firefox's Library) and it disappears from the "Библиотека" list without a manual reload.
- [ ] `UI-16` after deleting a bookmark that had tags/a category/a custom icon: those Dexie-side links are gone too — re-saving the exact same URL doesn't resurrect the old tags/category/icon (same `BG-1` cascade check as `RULE-13`'s equivalent item above, now exercised via the new UI path instead of native delete).
- [ ] `UI-16` settings dialog → "Расположение" block: pencil icon next to the label, plus a "Удалить закладку" text link with a trash icon — clicking the link opens the same confirmation dialog as the rail's trash icon.
- [ ] `UI-16` click the pencil: the block expands in place into an accent-bordered box with a path input (pre-filled with the current folder) and a `FolderTree` — no popover, no second dialog on top of the settings dialog.
- [ ] `UI-16` in the expanded box, click a different folder in the tree (or type a new path) then "Переместить": the box collapses back to the read-only view showing the new path, and the bookmark's folder actually changed in the browser's native bookmarks (check via `chrome://bookmarks`/Firefox Library).
- [ ] `UI-16` in the expanded box, click "Отмена" instead: box collapses, path is unchanged — no `move()` call happened (folder in the browser stayed the same).
- [ ] `UI-16` move to a folder path that doesn't exist yet (type a new nested path by hand): missing folder segments get created, same as the popup quick-save flow's existing behavior.
- [ ] `UI-16` popup "Поиск" tab `CompactBookmarkCard`: unchanged — no trash icon, no pencil, no delete/move affordance anywhere (there's no settings rail there to begin with).

## UI

- [ ] `UI-9` set theme to Light (or System while OS is Light), reload the options page: stays Light, doesn't reset to Dark.
- [ ] `UI-9` in Light theme, open a tag-assignment popover and an entity/status dropdown on a bookmark card: both render with light colors, not the old always-dark look.
- [ ] `UI-9` Categories tab: try to create a tag/category/workflow status/domain alias and leave the name empty, then click elsewhere (blur) — the blank row disappears instead of saving; typing a name and blurring saves normally.
- [ ] `UI-9` Rules tab: create a new rule, leave the name empty — "Save" stays disabled until a name is entered (in addition to a valid condition).
- [ ] `UI-9` assign a very long tag name to a bookmark: the chip truncates with an ellipsis instead of stretching the row.
- [ ] `UI-9` options page sidebar (tab list) reaches the full height of the window, no gap/short square at the bottom, at various window heights.
- [ ] `UI-9` body text and Russian labels render in Manrope (not a fallback system font) throughout the options page and popup; domain/URL/folder-path/JSON render in IBM Plex Mono.
- [ ] `UI-9` "+ Тег"/"+ Категория"/"+ Правило" buttons: taller and less rounded than before.
- [ ] `UI-9` bookmark card with an assigned category and workflow status: category pill top-right of the card, status pill on the same line as the tags row, bottom-right — check both themes and a long category/status name doesn't overlap the title.
- [ ] `UI-9` bookmark card tag row: "Теги" button (icon + label) opens the tag popover, replacing the old icon-only pencil button.

## NOTE

- [ ] `NOTE-1` bookmark settings popup, "Заметки" tab is now clickable (not the old disabled/greyed-out placeholder) and shows the active-tab accent bar same as "Настройки".
- [ ] `NOTE-1` popup is noticeably wider than before (`60rem`) on both the "Настройки" and "Заметки" tabs — check the Settings tab's icon+fields layout still looks fine at the new width, not stretched oddly.
- [ ] `NOTE-1` bookmark with zero notes: "Заметки" tab shows an empty-state message, not a blank area.
- [ ] `NOTE-1` click "+ Заметка": a new empty note opens immediately in the detail view, title field focused and ready to type.
- [ ] `NOTE-1` type a title and some text, click "← Все заметки" to go back: the grid shows the new card with that title/snippet — reopen the card, the text is still there (round-trips through Dexie, not just local state).
- [ ] `NOTE-1` two or more notes: grid lays out as a 2-column masonry (Google Keep style, uneven card heights), sorted by most-recently-edited first.
- [ ] `NOTE-1` trash icon on a card: note disappears immediately, no confirmation dialog.
- [ ] `NOTE-1` trash icon inside the detail view: note is deleted and the view returns to the grid.
- [ ] `NOTE-1` delete the bookmark itself (gear icon rail's trash, or the panel's "Удалить закладку", per `UI-16`): reopening a bookmark card for a *different* bookmark still shows its own notes untouched; the deleted bookmark's notes don't reappear anywhere (cascade via `BG-1`).
- [ ] `NOTE-1` check both themes (dark/light) — card background/border/text colors read correctly in Light theme too, not just the dark default.
