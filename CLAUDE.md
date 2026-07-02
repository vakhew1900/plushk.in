# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Manifest V3 browser extension that automatically sorts bookmarks using user-defined rules, with Markdown export and optional Obsidian integration.

**Stack:** WXT · React · TypeScript · Tailwind CSS · shadcn/ui  
**Storage:** IndexedDB via Dexie.js (all persistent data)  
**Parsing:** `@mozilla/readability` + `turndown`  
**Obsidian:** Local REST API plugin (optional)

## Commands

```bash
npm run dev        # Dev mode with hot reload (WXT)
npm run build      # Production build
npm run zip        # Package extension (.zip for store submission)
npm run typecheck  # Type check without building
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

### Storage

| Store | What | Library |
|---|---|---|
| IndexedDB | `BookmarkRule`, `DomainAlias`, `PageMatchGroup`, bookmark metadata | **Dexie.js** |

**Never call Dexie directly from components or hooks.** All IndexedDB access goes through service classes implementing interfaces in `src/services/interfaces/`. The service layer is the only place that knows Dexie exists.

### Service Worker (`src/entrypoints/background.ts`)

| Event | Action |
|---|---|
| `bookmarks.onCreated` | Apply rules → `chrome.bookmarks.move()` |
| `bookmarks.onImportBegan` | Pause processing until import finishes |
| `bookmarks.onChanged` | Re-evaluate rules if title/URL changed |
| `bookmarks.onRemoved` | Remove metadata from IndexedDB |

The extension only **moves** bookmarks via `chrome.bookmarks.move()` — never duplicates them.

### Rule system

Rules are evaluated against a **`PageMeta`** object — the data extracted from the bookmarked page:

| Field | Type | Source |
|---|---|---|
| `url` | `string` | Browser bookmark |
| `domain` | `string` | Derived from URL |
| `title` | `string` | Page `<title>` |
| `description` | `string?` | `<meta name="description">` |
| `author` | `string?` | `<meta name="author">` / og |
| `language` | `string?` | `<html lang>` |
| `ogType` | `string?` | `og:type` |
| `tags` | `string[]?` | `<meta name="keywords">` / og |
| `publishedAt` | `string?` | Article date |
| `content` | `string?` | Full text via Readability |
| `extras` | `Record<string, string \| string[]>?` | User-defined custom fields |

#### Rule DSL (Elasticsearch-inspired)

Rules are stored as JSON. The evaluator recursively resolves them against `PageMeta`.

**Compound rules** — combine arrays of sub-rules:

```json
{ "and": [ <rule>, <rule>, ... ] }
{ "or":  [ <rule>, <rule>, ... ] }
{ "not": [ <rule>, <rule>, ... ] }
```

**Leaf rules** — match a single field:

```json
{ "term":     { "domain": "youtube.com" } }
{ "terms":    { "tags": ["tutorial", "lecture"] } }
{ "regex":    { "url": ".*\\/watch\\?v=.*" } }
{ "wildcard": { "domain": "*.edu" } }
```

Any field from `PageMeta` (including `extras.*`) can be used as the key.

**Full example:**

```json
{
  "and": [
    { "term":  { "domain": "youtube.com" } },
    { "or": [
        { "terms":    { "tags": ["tutorial", "course"] } },
        { "wildcard": { "title": "*tutorial*" } }
    ]}
  ]
}
```

**Bookmark rule** (wraps the DSL condition):

```ts
interface BookmarkRule {
  id: string;
  name: string;
  condition: RuleNode;   // the JSON DSL tree
  targetFolder: string;
  priority: number;      // higher = evaluated first
}
```

Fallback: if no rule matches → folder `Uncategorized`.

## Code rules

- **`any` is forbidden.** Use `unknown` + type guard for uncertain types.
- **Strict component decomposition.** Table rows, cards, any reusable element — each gets its own component. All components are functional.
- **Prefer shadcn/ui over custom components.** Check `src/components/ui/` before writing new UI.
- All public service contracts must have an interface in `src/services/interfaces/`.
- **String constants use `as const` objects, never `enum`.** Derive the union type with `typeof Obj[keyof typeof Obj]`. Use the same name for the object and the type (e.g. `RuleType` object + `type RuleType`).

```ts
// correct
export const RuleType = { AND: 'and', OR: 'or' } as const;
export type RuleType = typeof RuleType[keyof typeof RuleType];

// forbidden
enum RuleType { AND = 'and' }
```

## Git conventions

### Commit message format

```
<type>: [<block>] <description>
```

**Types:**

| Type | When to use |
|---|---|
| `add` | New file, type, component, or feature from scratch |
| `feat` | Enhancement to existing functionality |
| `fix` | Bug fix |
| `refactor` | Code change with no behaviour change |
| `noref` | Non-code change (docs, config, CLAUDE.md, README) |

**Blocks** — the area of the codebase being changed:

| Block | Covers |
|---|---|
| `[rule]` | Rule DSL, RuleEngine, rule types |
| `[ui]` | React components, styles |
| `[storage]` | Dexie schema, DB services |
| `[import/export]` | Markdown export, bookmark import |
| `[ai]` | AI/LLM integration |
| `[bg]` | Service worker / background script |
| `[dev]` | Dev tooling, build config |
| `[setup]` | Initial project setup |

**Examples:**

```
add: [rule] wildcard rule type
fix: [ui] rule list not re-rendering on priority change
feat: [storage] index BookmarkRule by priority
noref: [dev] update CLAUDE.md storage section
```

### Pull request title

Same format as the commit, or a short summary if the PR spans multiple blocks:

```
feat: [rule] Elasticsearch-inspired DSL with AND/OR/NOT support
```

## Testing

**Vitest** is the test runner. Mock `chrome.*` APIs via `vitest-chrome`.

Rules:
- Service classes and functions in `lib/` must have unit tests.
- Tests live next to the source file in a `__tests__/` subfolder.
- React components are not tested.

```bash
npm test        # Run all tests
npm run test:watch  # Watch mode
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
