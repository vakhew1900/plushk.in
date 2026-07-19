---
name: specs
description: Maintain the project's specification and task-tracking files in specs/ (specification.md, plan.md, backlog.md, tasks.md, changelog.md). Use when adding, starting, finishing, removing, or re-prioritizing a task, or updating the spec/plan.
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

Read all five `specs/*.md` files before adding, moving, or removing a task — a task's category, number, and status depend on the current content of more than one of them.

## Rules for managing tasks

1. Every task has an ID `<CATEGORY>-<N>`, where `<CATEGORY>` is one of the tags listed in the `specs/specification.md` task-categories table (`RULE`, `AI`, `UI`, ...) and `<N>` is sequential *within that category*. Check the highest existing `<N>` for the category across **all three** of `backlog.md`, `tasks.md`, and `changelog.md` before assigning the next number.
2. A new task always starts in `backlog.md` — never add a task directly to `tasks.md` or `changelog.md`.
3. A task lives in exactly one of `backlog.md` / `tasks.md` / `changelog.md` at a time. Moving it means cutting the entry from one file and pasting it into the other — never leave it in two places, never duplicate it.
4. When work on a task begins, move its entry from `backlog.md` to `tasks.md`.
5. When a task is finished, move its entry from `tasks.md` to `changelog.md`, appending a **Completed:** (`YYYY-MM-DD`) field — don't delete it. `changelog.md` is append-oriented: add new entries at the end, don't reorder older ones.
6. Every `backlog.md`/`tasks.md` entry has all four fields — ID, Priority (`low` / `medium` / `high` / `critical`), Added (`YYYY-MM-DD`), Description — in the exact format already used there (template in `CLAUDE.md`). `changelog.md` entries have those four plus `Completed`.
7. If a task needs a category that isn't in the `specs/specification.md` table yet, add the new tag with a short description there first, then use it.
8. Don't rewrite, reformat, or reorder existing entries beyond what the requested change actually requires.

## When to use this skill

- The user asks to add, start, finish, remove, or re-prioritize a task.
- The user asks to update `specs/specification.md` or `specs/plan.md`.
- You notice, while doing unrelated work, that a chunk of it could reasonably be split out and tracked as its own task — per `CLAUDE.md`, flag it and ask the user whether it should become a separate backlog entry, rather than deciding this yourself.
