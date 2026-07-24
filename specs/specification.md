# Specification

## Context

The extension automatically sorts new bookmarks into folders based on **user-defined rules** (domain, title, URL, regular expressions). Where needed, it exports article content to **Markdown** and integrates with **Obsidian**.

It solves the problem of bookmark chaos and lets users keep important articles in an offline knowledge base instead of losing them in a flat "Favorites" list.

## Goals (MVP)

- Automatically sort bookmarks the moment they're created
- Flexible rules with priorities (AND / OR / Regex)
- Rules and metadata stored inside the extension
- Bookmarks are saved in **standard browser folders** (not a proprietary store) — the extension only moves them (`chrome.bookmarks.move()`), never duplicates
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

1. **Auto-sort ("Auto" mode).** The user saves a page as a bookmark. The extension checks rules in descending priority order; the first rule whose conditions all match decides the folder — the bookmark is moved there immediately. If no rule matches, the bookmark is moved into the user-configured default folder instead (empty by default, meaning the Bookmarks Bar).
2. **"Hint" mode.** The user saves a bookmark; the extension computes the matching folder using the same rules, but shows the result in the popup and lets the user change the folder before it's saved.
3. **"Off" mode.** The extension doesn't interfere — the bookmark is saved the normal browser way.
4. **Editing rules.** The user opens the "Rules" tab in settings and creates or edits a rule: sets conditions (domain / title / URL, including regex), combines them via AND / OR, and specifies a target folder and priority.
5. **Domain aliases.** The user groups multiple domains (e.g. regional mirrors of the same site) under one alias, so it can be used in rules instead of listing every domain individually.
6. **Exporting an article to Markdown / Obsidian.** The user exports a saved page; the extension extracts the content (Readability + Turndown) and optionally sends the note to Obsidian via the Local REST API.
7. **Editing an existing bookmark.** The user edits a bookmark's title or URL in the browser; the extension re-evaluates the rules and moves it to a different folder if needed.
8. **Removing a bookmark.** The user deletes a bookmark; the extension removes the associated metadata from IndexedDB.
9. **Importing bookmarks.** The user imports a batch of bookmarks (e.g. from another browser); the extension pauses rule processing during the import instead of sorting them one by one.

## Business rules

- A rule consists of conditions (domain / title / URL, including regex) combined via **AND / OR**, a target folder, and a priority.
- A target folder is a `/`-separated path (e.g. `"Social/Reddit"`); intermediate folders are created if they don't exist yet.
- Rules are checked in descending priority order — **the higher the number, the earlier the rule is checked**.
- The first rule whose conditions all match wins; the rest are not checked.
- If no rule matches (Auto mode), the bookmark is moved into a user-configured default folder — a `/`-separated path, empty by default, which resolves to the Bookmarks Bar.
- Importing bookmarks (`bookmarks.onImportBegan`) pauses rule processing until the import finishes.
- The extension only **moves** bookmarks (`chrome.bookmarks.move()`) — it never duplicates them.
- Changing an existing bookmark's title/URL re-triggers rule evaluation (`bookmarks.onChanged`).

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

More categories are added as new areas of the project need one.
