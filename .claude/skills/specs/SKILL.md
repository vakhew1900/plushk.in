---
name: specs
description: Maintain the project's specification and task-tracking files in specs/ (specification.md, plan.md, backlog.md, tasks.md, changelog.md, ideas.md), and optionally a deep per-task spec under specs/tasks/<id>/. Use when adding, starting, finishing, removing, or re-prioritizing a task, capturing or promoting an idea, updating the spec/plan, or writing a detailed specification for a specific task before implementation.
---

# Specs

Maintain the project's specification and task-tracking files in `specs/`.

## Files to read before making any change

- `CLAUDE.md` — the "Specs" section defines the task entry format (ID, priority, added date, description) and what belongs in each file.
- `specs/specification.md` — context, goals, non-goals, user scenarios, business rules, and the table of task categories (tag → what it covers).
- `specs/plan.md` — the implementation plan.
- `specs/backlog.md` — tasks not yet started.
- `specs/tasks.md` — tasks currently in progress.
- `specs/changelog.md` — finished tasks, kept for history.
- `specs/ideas.md` — unconfirmed, not-yet-scoped ideas. Lighter than a task: no ID, no priority, no required fields, just a short heading + description. Add an idea here when it's worth remembering but not yet worth a full backlog entry (e.g. surfaced in passing during unrelated work, or explicitly flagged as "just an idea" by the user). When an idea is picked up, promote it: write a proper `backlog.md` entry per the task entry format, then remove the idea from `ideas.md` — never leave it duplicated in both.
- `specs/tasks/<id>/` — deep spec for a specific task, if one exists (see below). Gitignored — local only, don't assume it exists after a fresh clone.

Read all five `specs/*.md` task-tracking files (`backlog.md`, `tasks.md`, `changelog.md`, `ideas.md`, `specification.md`) before adding, moving, or removing a task — a task's category, number, and status depend on the current content of more than one of them.

## Rules for managing tasks

1. Every task has an ID `<CATEGORY>-<N>`, where `<CATEGORY>` is one of the tags listed in the `specs/specification.md` task-categories table (`RULE`, `AI`, `UI`, ...) and `<N>` is sequential *within that category*. Check the highest existing `<N>` for the category across **all three** of `backlog.md`, `tasks.md`, and `changelog.md` before assigning the next number.
2. A new task always starts in `backlog.md` — never add a task directly to `tasks.md` or `changelog.md`.
3. A task lives in exactly one of `backlog.md` / `tasks.md` / `changelog.md` at a time. Moving it means cutting the entry from one file and pasting it into the other — never leave it in two places, never duplicate it.
4. When work on a task begins, move its entry from `backlog.md` to `tasks.md`.
5. When a task is finished, move its entry from `tasks.md` to `changelog.md`, appending a **Completed:** (`YYYY-MM-DD`) field — don't delete it. `changelog.md` is append-oriented: add new entries at the end, don't reorder older ones.
6. Every `backlog.md`/`tasks.md` entry has all four fields — ID, Priority (`low` / `medium` / `high` / `critical`), Added (`YYYY-MM-DD`), Description — in the exact format already used there (template in `CLAUDE.md`). `changelog.md` entries have those four plus `Completed`.
7. If a task needs a category that isn't in the `specs/specification.md` table yet, add the new tag with a short description there first, then use it.
8. Don't rewrite, reformat, or reorder existing entries beyond what the requested change actually requires.
9. Mirror every add/move/remove to the Obsidian Kanban board at `projects/plusk.in/mvp kanban.md` (via the `obsidian` MCP server — `vault_patch`/`vault_read` on that path) in the same turn as the `specs/*.md` edit, so the two never drift. `specs/*.md` stays the single source of truth; the board is a read-mostly reflection of it. Four lanes, exact heading text (needed verbatim for `vault_patch` heading targets — the trailing tag is part of the heading, not decoration): `## Backlog #status-backlog`, `## In Progress #status-in-progress`, `## In Testing #status-testing`, `## Done #status-done`. File mapping: **Backlog** ↔ `backlog.md`, **In Progress** and **In Testing** both ↔ `tasks.md`, **Done** ↔ `changelog.md`. **In Testing** is a board-only sub-status: a task moved there is still physically in `tasks.md` (implementation done, pending manual check against `specs/verification.md`) — moving a card into/out of it is a manual board action, not triggered by a `specs/*.md` edit; only Backlog↔In Progress↔Done transitions are driven by (and mirror) an actual file move. Card format: `- [ ] <ID> — <short title> #prio-<priority>` (`#prio-low` / `#prio-medium` / `#prio-high` / `#prio-critical`), checked (`- [x]`) only in **Done**; keep the title short — the full description stays in `specs/*.md`, not on the card. Colors are rendered by the user's locally-installed "Colored Tags Wrangler" community plugin off these exact tag strings (its color mapping is configured by the user in Obsidian's plugin settings, not from this repo) — always reuse the existing `#status-*`/`#prio-*` tags verbatim, never invent new ones. If the `obsidian` MCP server isn't connected (tools missing/erroring), skip the mirror and tell the user instead of failing the whole task update.

## Rules for a deep task spec (`specs/tasks/<CATEGORY>-<N>-<slug>/`)

A backlog/tasks.md entry is a one-liner index. For a task complex or ambiguous enough to need more — non-trivial constraints, several open questions, non-obvious test cases — it can additionally get a deep spec folder alongside it.

1. Not every task needs one. Create it only when the task warrants it; ask the user if it's unclear whether this task does.
2. Before writing `description.md`, run a preliminary interview with the user (clarifying questions — scope, constraints, test cases, non-goals, related tasks) and resolve every open question first. Never draft `description.md` from assumptions — the point of the interview is that implementation can then proceed autonomously, without asking again mid-task.
3. Follow the structure and required sections in [reference/task-folder.md](reference/task-folder.md) exactly — don't invent a different layout.
4. `specs/tasks/` is gitignored (local-only). Don't reference it from committed files (`specification.md`, `plan.md`, this skill's own committed output) as if it's guaranteed to exist — it's a local working aid, not part of the tracked spec history.

## When to use this skill

- The user asks to add, start, finish, remove, or re-prioritize a task.
- The user asks to update `specs/specification.md` or `specs/plan.md`.
- The user asks for a detailed/deep spec on a specific task before implementation starts.
- You notice, while doing unrelated work, that a chunk of it could reasonably be split out and tracked as its own task — per `CLAUDE.md`, flag it and ask the user whether it should become a separate backlog entry, rather than deciding this yourself.
