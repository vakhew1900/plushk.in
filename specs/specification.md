# Specification

## Context

The extension automatically sorts new bookmarks into folders based on **user-defined rules** (domain, title, URL, regular expressions). Where needed, it exports article content to **Markdown** and integrates with **Obsidian**.

It solves the problem of bookmark chaos and lets users keep important articles in an offline knowledge base instead of losing them in a flat "Favorites" list.

## Goals (MVP)

- Automatically sort bookmarks saved through the extension's own popup action the moment they're created (see `UI-4` in `specs/tasks.md` — native browser saves, star icon/Ctrl+D/import/sync, are deliberately left untouched for now; bringing auto-sort to those too is a deferred idea, see `specs/ideas.md`)
- Flexible rules with priorities (AND / OR / Regex)
- Rules and metadata stored inside the extension
- Bookmarks are saved in **standard browser folders** (not a proprietary store) — the extension creates them directly in the resolved target folder, never duplicates
- Export selected bookmarks to **Markdown** + Obsidian integration (optional)

## Non-goals (not MVP yet)

The directions below have been discussed but are deliberately out of scope for the current MVP. Each may eventually become its own task in `backlog.md`:

- Import/export of all extension settings (rules, aliases, variables) as a single file
- Import/export of individual pages to Obsidian (beyond the plain Markdown article export)
- Tags for bookmarks
- A separate settings tab, **"Shelf"** — search across saved bookmarks, statuses (read / watched / to read / to watch)
- Telegram integration
- Other similar integrations that come up as the project grows

## User scenarios

1. **"On" mode.** A single toggle, no separate Auto/Hint split (see `UI-4` in `specs/tasks.md` for the migration from the old three-mode model). Sorting only happens for bookmarks saved via the extension's own popup (quick-save, bypassing the native star): the popup immediately shows a folder tree with the matching rule's folder pre-selected (falling back to the user-configured default folder if no rule matches), the user can pick a different folder before confirming, and a single "Save" button creates the bookmark directly in the chosen folder. Bookmarks saved the native way (star icon / Ctrl+D / import / sync) are **not** touched — see the next point.
2. **Native saves are left alone.** Whether "On" or "Off", a bookmark created the browser's own way (star icon, Ctrl+D, import, sync from another device) is never rule-matched or moved by the extension — it stays exactly where the browser put it. Auto-sorting native saves is a deferred idea (`specs/ideas.md`), not current behavior.
3. **"Off" mode.** The extension doesn't interfere with its own popup either — the bookmark is saved the normal browser way, no rule evaluation at all.
4. **Editing rules.** The user opens the "Rules" tab in settings and creates or edits a rule: sets conditions (domain / title / URL, including regex), combines them via AND / OR, and specifies a target folder and priority.
5. **Domain aliases.** The user groups multiple domains (e.g. regional mirrors of the same site) under one alias, so it can be used in rules instead of listing every domain individually.
6. **Exporting an article to Markdown / Obsidian.** The user exports a saved page; the extension extracts the content (Readability + Turndown) and optionally sends the note to Obsidian via the Local REST API.
7. **Removing a bookmark.** The user deletes a bookmark; the extension removes the associated metadata from IndexedDB.

## Business rules

- A rule consists of conditions (domain / title / URL, including regex) combined via **AND / OR**, a target folder, and a priority.
- A target folder is a `/`-separated path (e.g. `"Social/Reddit"`); intermediate folders are created if they don't exist yet.
- Rules are checked in descending priority order — **the higher the number, the earlier the rule is checked**.
- The first rule whose conditions all match wins; the rest are not checked.
- If no rule matches (On mode, popup quick-save), the bookmark tree pre-selects a user-configured default folder instead — a `/`-separated path, empty by default, which resolves to the Bookmarks Bar.
- Rule evaluation and folder resolution only happen for the extension's own popup quick-save action — never for bookmarks created or edited the native way (star icon, Ctrl+D, import, sync, or editing an existing bookmark's title/URL in the browser). See `UI-4`/`specs/ideas.md` — native auto-sort is a deferred idea, not current behavior.
- The extension only **creates** bookmarks directly in the resolved target folder (`chrome.bookmarks.create()` with the right `parentId`) — it never duplicates or moves bookmarks it didn't itself just create.

Example rule (human-readable form; the technical JSON DSL is in `CLAUDE.md`):

```
IF (domain = youtube.com AND title contains "tutorial")
THEN folder = "Learning/Videos"
PRIORITY = 50
```

Fallback (no rule matched):

```
IF nothing matched → moved to the default folder (Bookmarks Bar unless changed in settings)
```

## Task categories

Every backlog/task ID starts with a category tag (see the entry format in `CLAUDE.md`). Categories so far:

| Tag | Covers |
|---|---|
| `RULE` | Rule DSL, rule matching/evaluation, the rule editor UI (name/desc, condition groups, JSON view) |
| `AI` | AI/LLM integration |
| `UI` | UI/UX work not specific to rules or AI — layout, theming, localization, shared components |
| `ARCH` | Cross-cutting architecture decisions not tied to a single feature — state management, dependency injection, data-layer patterns |
| `SETTINGS` | Import/export of extension settings (rules, domain aliases, page match groups) as a single file — backup/portability of the auto-sorter's configuration |
| `EXPORT` | Article content extraction and Markdown export, Obsidian integration (Local REST API) |
| `DEV` | Dev tooling and process — build config, Claude Code skills, specs workflow itself, non-product infrastructure |
| `TEST` | Test data/fixtures for manual or automated testing — example rule sets, sample bookmark trees, import/export test cases |
| `INTEGR` | Integrations with external services beyond the Obsidian export flow (`EXPORT`) — e.g. Telegram |
| `SEARCH` | Search across sorted bookmarks — the search tab/UI, simple + fuzzy search, tag storage & tag search (rules for auto-assigning tags live under `RULE`) |
| `SHELF` | User-defined content-type entities (Книга/Видео/...) and their optional workflow (ordered status list, e.g. to-read/reading/done/abandoned), the per-bookmark entity+status assignment, and the "Shelf" settings tab that manages both — distinct from tag storage/search (`SEARCH`) |
| `BG` | Service worker (`entrypoints/background.ts`) event handling — `bookmarks.onRemoved`/`onChanged` and cross-cutting cleanup of records in other tables when a bookmark disappears or changes |

More categories are added as new areas of the project need one.
