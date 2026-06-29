# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Manifest V3 browser extension that automatically sorts bookmarks using user-defined rules, with Markdown export and optional Obsidian integration.

**Stack:** WXT · React · TypeScript · Tailwind CSS · shadcn/ui  
**Storage:** `chrome.storage.local` (rules) + IndexedDB (bookmark metadata)  
**Parsing:** `@mozilla/readability` + `turndown`  
**Obsidian:** Local REST API plugin (optional)

## Commands

```bash
pnpm dev        # Dev mode with hot reload (WXT)
pnpm build      # Production build
pnpm zip        # Package extension (.zip for store submission)
pnpm typecheck  # Type check without building
```

## Architecture

### Layer order (top-down only)

```
components/ → hooks/ → context/ → services/ → chrome.* / IndexedDB
```

No reverse dependencies. Components have no knowledge of concrete service implementations.

### Services

Each service is a class implementing an interface from `src/services/interfaces/`. Dependency injection via React Context (`src/context/ServicesContext.tsx`). Services never import from React.

Example chain: `useRules()` (hook) → `ServicesContext` → `RuleEngine` (class) → `chrome.storage.local`.

### Service Worker (`src/entrypoints/background.ts`)

| Event | Action |
|---|---|
| `bookmarks.onCreated` | Apply rules → `chrome.bookmarks.move()` |
| `bookmarks.onImportBegan` | Pause processing until import finishes |
| `bookmarks.onChanged` | Re-evaluate rules if title/URL changed |
| `bookmarks.onRemoved` | Remove metadata from IndexedDB |

The extension only **moves** bookmarks via `chrome.bookmarks.move()` — never duplicates them.

### Rule system

A rule consists of: conditions (`domain` / `title` / `url` regex) combined with AND/OR operators, a target folder, and a priority (higher number = evaluated first).  
Fallback: if no rule matches → folder `Uncategorized`.

## Code rules

- **`any` is forbidden.** Use `unknown` + type guard for uncertain types.
- **Strict component decomposition.** Table rows, cards, any reusable element — each gets its own component. All components are functional.
- **Prefer shadcn/ui over custom components.** Check `src/components/ui/` before writing new UI.
- All public service contracts must have an interface in `src/services/interfaces/`.

## Testing

**Vitest** is the test runner. Mock `chrome.*` APIs via `vitest-chrome`.

Rules:
- Service classes and functions in `lib/` must have unit tests.
- Tests live next to the source file in a `__tests__/` subfolder.
- React components are not tested.

```bash
pnpm test        # Run all tests
pnpm test:watch  # Watch mode
```

## Theme (Obsidian-style)

Dark/light toggle via `class="dark"` on `<html>`. Variables defined in `src/assets/globals.css`:

```css
/* Dark */               /* Light */
--background: #1e1e2e;  --background: #f5f5f5;
--surface:    #2a2a3d;  --surface:    #ffffff;
--border:     #3d3d5c;  --border:     #dddde0;
--foreground: #cdd6f4;  --foreground: #2e2e3e;
--muted:      #6c7086;  --muted:      #8c8c9e;
--accent:     #7c6af7;  --accent:     #7c6af7;
```
