---
name: scaffold
description: Create a new React component, or a new service/repository (interface + implementation + test), following this project's layered architecture and coding conventions. Use when asked to add/create a component, add/create a service, add/create a repository, or scaffold new code under src/components, src/services, or src/repository.
---

# Scaffold

Generates new code that follows the project's layer order (`components/ → hooks/ → context/ → services/ → repository/ → chrome.* / IndexedDB`, see `CLAUDE.md`).

## Step 1 — Read CLAUDE.md's Architecture and Code rules sections

Both reference files below assume that context: layer order, `any` forbidden, CSS Modules, Radix UI, SVG-as-component rule, `as const` string constants.

## Step 2 — Pick what's being created

| Asked for | Read |
|---|---|
| A component, row, card, panel, icon, or any UI element under `src/components/` | [reference/component.md](reference/component.md) |
| A service (business logic) or repository (Dexie/`browser.*` data access) under `src/services/` or `src/repository/` | [reference/service.md](reference/service.md) |

If it's ambiguous which one is meant, ask the user before generating anything.

## Step 3 — Follow the referenced file's rules and output format exactly

Don't skip the test-file step for services/repositories, and don't skip asking about the subfolder if it wasn't specified.
