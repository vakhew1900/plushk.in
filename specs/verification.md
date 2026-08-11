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
