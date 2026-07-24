# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Manifest V3 browser extension that automatically sorts bookmarks using user-defined rules, with Markdown export and optional Obsidian integration.

**Stack:** WXT · React · TypeScript · CSS Modules · Radix UI  
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
components/ → hooks/ → context/ → services/ → repository/ → chrome.* / IndexedDB
```

No reverse dependencies. Components have no knowledge of concrete service or repository implementations.

### Services

Each service is a class implementing an interface from `src/services/interfaces/`. Dependency injection via React Context (`src/context/ServicesContext.tsx`). Services never import from React.

Example chain: `useRules()` (hook) → `ServicesContext` → `RuleEngine` (class) → `chrome.storage.local`.

### Repositories

Data-access gateways (Dexie or `browser.*` APIs) are a separate layer from services: classes live in `src/repository/`, with their interfaces in `src/repository/interfaces/`. Services depend on repositories (via the same `ServicesContext` injection), never the other way around.

### Storage

| Store | What | Library |
|---|---|---|
| IndexedDB | `BookmarkRule`, `DomainAlias`, `PageMatchGroup`, bookmark metadata | **Dexie.js** |

**Never call Dexie directly from components or hooks.** All IndexedDB access goes through repository classes in `src/repository/` implementing interfaces in `src/repository/interfaces/`. The repository layer is the only place that knows Dexie exists.

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
  desc?: string;
  condition: RuleNode;   // the JSON DSL tree
  targetFolder: string;  // `/`-separated path, e.g. "Social/Reddit"
  priority: number;      // higher = evaluated first
  enabled: boolean;
}
```

Fallback: if no rule matches (Auto mode only), the bookmark is moved into the user-configured `defaultFolder` setting instead of wherever the browser placed it natively. `defaultFolder` is empty by default, which resolves to the Bookmarks Toolbar.

## Code rules

- **`any` is forbidden.** Use `unknown` + type guard for uncertain types.
- **Strict component decomposition.** Table rows, cards, page sections/blocks (e.g. a theme picker or an export/import panel within a tab), any reusable element — each gets its own component. All components are functional.
- **Group related components into subfolders once a logical cluster forms.** Don't let a `src/components/<area>/` folder grow flat indefinitely. When 2+ components only make sense together (a multi-step flow, an editor's sub-panels), move them into `src/components/<area>/<cluster>/`. See `options/tabs/{aliases,main,rules}/` for the existing pattern. Don't pre-create a subfolder for a single component — wait until the cluster is real.
- **Styling: CSS Modules only.** Every component has a `ComponentName.module.css` alongside it. No inline `style=` except for truly dynamic values (e.g. a color from props). No global utility classes.
- **CSS units: `rem` is the default for new code.** In newly created `.module.css` files, prefer `rem` for `font-size`, `padding`, `margin`, `gap`, `width`/`height`, and `border-radius` (1rem = 16px baseline). Other units are fine when there's a concrete reason — hairline strokes (`border-width: 1px`, `outline-width`), matching a fixed external asset size, sub-pixel alignment — but `rem` is the priority, reach for something else only when it's actually warranted. Existing `.module.css` files already written in `px` are not required to migrate — only convert a file's units wholesale if you're already rewriting it for other reasons.
- **SVG icons must be extracted as components.** Never write `<svg>` inline in component JSX. Create a named component in `components/icons/` (e.g. `IconPlus`, `IconFolder`) and import it. Inline SVG is allowed only inside the icon component file itself.
- **Prefer Radix UI primitives** for interactive patterns: `RadioGroup` for segmented controls, `Switch` for toggles, `Slot` for `asChild` composition. Check `@radix-ui/*` packages before writing custom interactive elements.
- **`components/ui/`** holds thin wrappers around Radix primitives (Button, Badge, Switch, Input, Textarea). Check there before creating new elements.
- All public service contracts must have an interface in `src/services/interfaces/`. Repositories are a separate layer: classes go in `src/repository/`, interfaces in `src/repository/interfaces/`.
- **String constants use `as const` objects, never `enum`.** Derive the union type with `typeof Obj[keyof typeof Obj]`. Use the same name for the object and the type (e.g. `RuleType` object + `type RuleType`).

```ts
// correct
export const RuleType = { AND: 'and', OR: 'or' } as const;
export type RuleType = typeof RuleType[keyof typeof RuleType];

// forbidden
enum RuleType { AND = 'and' }
```

  This also covers ad hoc literals, not just formal domain enums: if a string literal has a realistic chance of being compared/used more than once (e.g. a build-target check like `import.meta.env.BROWSER === 'firefox'`), pull it into an `as const` object at its first use — don't wait for the second usage to appear before extracting it. A true one-off literal (used in exactly one place, no plausible reuse) doesn't need this. See `src/lib/browser-constants/` for the pattern.

- **Debug logging: use `debugLog` from `src/lib/debug-log.ts`, never raw `console.log`, for temporary/tracing logs.** It only logs while running under `npm run dev:firefox` (or any `wxt dev` variant — checks `import.meta.env.COMMAND === 'serve'`) and is fully stripped from production output (`npm run build`/`build:firefox`/`zip`) by the minifier, since that check becomes a dead branch once WXT inlines `COMMAND` as `'build'`. Safe to leave tracing calls in place — they never ship.

## Specs

Planning and task tracking live in `specs/`, not in this file:

| File | Purpose |
|---|---|
| `specs/specification.md` | What we're building — product/feature spec |
| `specs/plan.md` | How we're building it — implementation plan |
| `specs/backlog.md` | Tasks not yet started |
| `specs/tasks.md` | Tasks currently in progress |
| `specs/changelog.md` | Finished tasks |
| `specs/ideas.md` | Unconfirmed, not-yet-scoped ideas — lighter than a task, no ID/priority required |
| `specs/verification.md` | Manual correctness checklist — things to verify by hand in the running extension, grouped by task category |

A task lives in exactly one of `backlog.md` / `tasks.md` / `changelog.md` at a time. When work on a task begins, move it from `backlog.md` to `tasks.md`. When it's finished, move it from `tasks.md` to `changelog.md`, adding a **Completed:** date — don't delete it. (Before this convention, finished tasks were deleted outright and relied on git history alone; that made completed work invisible unless someone went digging through commits, so now the entry itself is kept.)

**Surface candidate tasks as you go.** If, while doing unrelated work, you notice a piece of work that could reasonably be split out and tracked on its own, flag it to the user and ask whether it should become a separate `backlog.md` entry. Do not add it yourself without asking, and do not silently fold it into the task at hand.

Use the `specs` skill to read and update these files.

### Task entry format

Every backlog/task entry has:

| Field | Description |
|---|---|
| ID | `<CATEGORY>-<N>` — a category tag (`RULE`, `AI`, `UI`, more may be added; see `specs/specification.md` for what each covers) plus a number sequential within that category |
| Priority | `low` / `medium` / `high` / `critical` |
| Added | Date the task entered the backlog (`YYYY-MM-DD`) |
| Description | A sentence or two describing the task |

Example entry:

```md
### RULE-1 — Реализация ConsView
**Priority:** Low
**Added:** 2026-07-06

Подключить визуальный конструктор условий (ConsView → ConditionGroup → ConditionRow) к RuleEditor.
```

`changelog.md` entries have the same four fields plus a fifth, added when the task is moved there:

| Field | Description |
|---|---|
| Completed | Date the task was finished (`YYYY-MM-DD`) |

### Chat naming

When work in a Claude Code chat maps to a specs task, rename the chat so its title starts with that task's ID, e.g. `RULE-1 — ConsView integration`. Makes it possible to find the conversation for a given task later without digging through history.

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

Dark/light toggle via `data-theme="dark"/"light"` on the root element. CSS variables defined in `assets/globals.css`, used directly in CSS Modules as `var(--accent)` etc.

```css
/* Dark (default) */     /* Light */
--bg:       #1a1a1d;     --bg:       #fbfaf7;
--bg2:      #141416;     --bg2:      #f1eee8;
--border:   #2c2c31;     --border:   #e3ded4;
--text:     #d8d8dc;     --text:     #33312e;
--muted:    #8b8b94;     --muted:    #76716a;
--accent:   #7d6cf0;     --accent:   #6a57d6;
--green:    #5cba8f;     --green:    #3f9d6f;
--red:      #e0746e;     --red:      #cf5a52;
--blue:     #5c9ee0;     --blue:     #3f7fc4;
```
