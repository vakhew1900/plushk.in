# Ideas

Unconfirmed, not-yet-scoped ideas for future work — lighter than a `backlog.md` task. No ID, no priority, no required fields. When an idea is picked up, promote it to a proper entry in `backlog.md` (assign it an ID/priority/added date per `CLAUDE.md`) and remove it from here.

### Interactive menu on bookmark card click

Right now (see `SEARCH-1` in `tasks.md`) clicking a bookmark card in search results just navigates to the bookmark's URL. Later, clicking (or a secondary interaction — right-click, long-press, a dedicated affordance on the card) could instead open a quick-action menu: open, change folder/rule, add a tag, etc. Not worked out: what actions belong in the menu, how it coexists with "just open the page" as the common case, whether it needs a different trigger than plain click to avoid surprising users.

### Auto-sort for natively created bookmarks (star icon / Ctrl+D / import / cross-device sync)

`UI-4` (see `tasks.md`) removes automatic sorting for bookmarks created outside the extension's own popup — `bookmarks.onCreated` no longer applies rules or moves anything, in any mode. The user explicitly wants sorting to stay scoped to their own quick-save popup for now ("за сохранение отвечаю только в своём попапе"). Bringing native auto-sort back later is a real possibility, but not designed: it would need its own answer to the echo-suppression problem that `suppressNextCreated` used to solve (the old flag/mechanism is deleted along with `UI-4`, not preserved for reuse), a decision on whether it's silent (old `Auto`) or confirm-first (old `Hint`) again, and whether `bookmarks.onChanged` (re-sorting on title/url edits — never actually implemented, only documented) is in scope too. Don't assume the old three-mode design is the right starting point if this gets picked up — reconsider from scratch given whatever the popup-only model looks like by then.
