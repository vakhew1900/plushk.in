# scaffold — skill for generating components and services/repositories

> This file is for humans only. The agent doesn't read it — all agent-facing logic lives in [SKILL.md](SKILL.md) and the files in `reference/`.

## What this is

Merges what used to be two separate commands (`add-component`, `add-service`) into one skill with routing:

- Asked for a component → the agent reads [reference/component.md](reference/component.md).
- Asked for a service or repository → the agent reads [reference/service.md](reference/service.md).

If it's unclear which one is meant, the agent must ask, not guess.

## Why merged

Both tasks are structurally the same (interface/props → implementation → where to wire it up), differing only in the rules of the specific layer. Keeping them as one skill with separate reference files is easier to maintain than two nearly-identical command files.

## What's new compared to the old commands

- **component**: current rules added — CSS Modules instead of shadcn/Tailwind, Radix UI instead of custom interactive elements, mandatory extraction of SVG icons into `src/components/icons/`.
- **service**: **service** (business logic, `src/services/`) and **repository** (Dexie/`browser.*` access, `src/repository/`) are now explicitly separated — this split didn't exist in the old `add-service` command, but does in the current `CLAUDE.md`. Added the rule for `as const` instead of `enum` for string constants.

Exact rules and output format — see the matching file in `reference/`.
