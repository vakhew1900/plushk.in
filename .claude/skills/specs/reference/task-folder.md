# Deep task spec — `specs/tasks/<CATEGORY>-<N>-<slug>/`

Optional, per-task, created only when a task is complex or ambiguous enough to warrant a preliminary interview (see `SKILL.md`). `specs/tasks/` is gitignored — local only.

## Structure

```
specs/tasks/<CATEGORY>-<N>-<slug>/
  description.md
  reference.md
  reference/
```

`<CATEGORY>-<N>` matches the task's ID in `backlog.md`/`tasks.md`/`changelog.md` exactly. `<slug>` is a short kebab-case hint, e.g. `DEV-1-specs-tasks-folder`.

These section names are the required structure of the deep spec itself — write the actual `description.md`/`reference.md` content in whatever language the rest of this project's specs already use (this project's `backlog.md`/`tasks.md`/`changelog.md` are in Russian, so a real deep spec here would be too).

## `description.md` — required sections, in this order

1. **Context** — why this task exists; link back to the backlog/tasks.md entry and, if relevant, `specification.md`.
2. **Constraints** — what was resolved during the preliminary interview: what's expected, what isn't, any decisions the interview settled.
3. **Test cases** — concrete cases that must hold once the task is done (inputs → expected outcome), not vague acceptance criteria.
4. **Out of scope** — explicit non-goals, so scope doesn't silently creep during implementation.
5. **Preliminary interview answers** — a question/answer table capturing exactly what was asked and answered, so the reasoning behind sections 2–4 stays traceable.

## `reference.md` — required sections

1. **Related tasks** — a table: `Task | Relation type | Comment`.
2. **Relation type vocabulary** — the fixed (but extensible) vocabulary below; add a new type here first if none fits, rather than inventing an ad-hoc label inline.

| Type | Meaning |
|---|---|
| `continuation` | Direct continuation of another task |
| `logic-change` | Changes logic/behavior another task established |
| `refinement` | Polishes/extends another task without changing its core logic |
| `fix` | Fixes a bug or oversight from another task |
| `depends-on` | Can't start until another task finishes |
| `supersedes` / `superseded-by` | Replaces another task's approach / is replaced by one |

## `reference/` — free-form

Supporting files that don't belong in prose: mockups, sample API/config payloads, screenshots, dumps of external docs. No required structure — name files descriptively.

## Example

Task `UI-2 — Settings tab "Shelf"` (see `backlog.md`), if promoted to a deep spec at `specs/tasks/UI-2-settings-shelf-tab/`. Written here in English for the template's sake — a real one for this project would be in Russian, matching `backlog.md`:

**`description.md`:**

```markdown
# UI-2 — Settings tab "Shelf"

## Context
See `specs/backlog.md` — the "Shelf" non-goal in `specification.md` is now being picked up.
Adds a separate Settings tab: a search box + a list of saved bookmarks.

## Constraints (resolved during the preliminary interview)
- Data source for the list: live `chrome.bookmarks.getTree()`, not IndexedDB metadata
- Card fields shown: title, url, domain, folder (path)
- No read/watched/to read/to watch statuses — stays a non-goal, as before
- Search matches title and url only, no domain/folder filtering in the MVP

## Test cases
- Empty bookmark list → shows a placeholder, not a blank screen
- Search filters the list by substring (case-insensitive)
- A bookmark with no favicon → shows a default icon, not a broken image

## Out of scope
- Bookmark statuses (read/watched/...)
- Bulk operations (delete/move multiple at once)
- List sorting (always in `getTree()` order)

## Preliminary interview answers
| Question | Answer |
|---|---|
| Data source — IndexedDB metadata or live `chrome.bookmarks.getTree()`? | Live getTree() |
| Does it need pagination for large bookmark counts? | No, list virtualization (react-window) if it turns out to be needed — not in the MVP |
```

**`reference.md`:**

```markdown
# Related tasks

| Task | Relation type | Comment |
|---|---|---|
| UI-1 | continuation | "Shelf" reuses the same bookmark-card pattern as the UI-1 toast |
| RULE-3 | depends-on | Needs `IBookmarkRepository.getByTitle`, added in RULE-3 |

## Relation type vocabulary
(see the table above in this file — the same fixed set used project-wide)
```

`reference/` in this example might hold `shelf-mock.png` or `getTree-sample.json` — whatever's useful for implementation but doesn't fit prose.
