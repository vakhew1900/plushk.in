# Verification

Manual correctness checklist — things to verify by hand in the running extension (dev build, both `npm run dev` and `npm run dev:firefox`) since they aren't covered by unit tests (React components aren't tested per `CLAUDE.md`). Grouped by task category (see `specification.md`'s task-categories table). Check an item after confirming it in both browsers unless noted otherwise.

## SEARCH

- [ ] Favicon display in search results: real site icon shown on Chrome (via the `_favicon` endpoint, `src/lib/browser-constants/faviconUrl.ts`); letter fallback shown on Firefox (no native favicon API available — see `FaviconUrl.FIREFOX`) and on Chrome whenever a site truly has no icon.
- [ ] `SEARCH-3` new "Tags" sidebar tab: create a tag, rename it, change its color via the swatch picker (selected swatch shows the text-colored border), delete it — list updates immediately and survives an options-page reload (Dexie `tags` table, `db.version(2)`). Check both themes: all 8 palette colors stay legible against `--bg3` in dark and light.

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
