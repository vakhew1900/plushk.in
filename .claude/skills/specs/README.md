# specs — skill for maintaining specs/

> This file is for humans only. The agent doesn't read it — all agent-facing logic lives in [SKILL.md](SKILL.md).

## What this is

Maintains the specification and task-tracking files in `specs/`: `specification.md`, `plan.md`, `backlog.md`, `tasks.md`, `changelog.md`, `cancelled.md`, `ideas.md`. Optionally, a deep spec for a single task in `specs/tasks/<id>/` (local only, not in git).

## When it fires

- A request to add/start/finish/cancel/remove/re-prioritize a task.
- A request to capture or promote an idea (`ideas.md`).
- A request to update `specs/specification.md` or `specs/plan.md`.
- A request to write a detailed spec for a specific task before implementation starts.
- The agent notices, on its own, that a chunk of current work should be split into its own task — in that case it must ask, not decide on its own.

## Key rules

1. Task ID — `<CATEGORY>-<N>`, sequential **within the category**, category comes from the table in `specs/specification.md`.
2. A new task always starts in `backlog.md`.
3. A task lives in exactly one file at a time (`backlog.md` / `tasks.md` / `changelog.md` / `cancelled.md`) — moving it is cut+paste, never a copy.
4. A finished task moves to `changelog.md` with a **Completed** field (`YYYY-MM-DD`), never deleted.
5. An obsolete task (superseded, out of scope, or no longer applicable) moves to `cancelled.md` with **Cancelled**/**Reason** fields, never deleted — and never just because it looks stale or low-priority; ask the user if it's unclear.
6. Before any change to tasks, read all six `specs/*.md` files — status and numbering depend on more than one of them at once.
7. A deep spec (`specs/tasks/<id>/`) isn't for every task — only when it's complex/ambiguous enough. Before writing it, the agent must interview the user first, not draft it from its own assumptions.
8. Every add/move/remove/cancel is mirrored the same turn onto the Obsidian Kanban board (`projects/plusk.in/mvp kanban.md`) via the `obsidian` MCP server — the board is a reflection of the files, never the other way around.

Details and exact wording — see [SKILL.md](SKILL.md); the deep-spec template — see [reference/task-folder.md](reference/task-folder.md).
