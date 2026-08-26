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

Rule matching and folder resolution happen **only** in the extension's own popup quick-save flow (`components/popup/` → `hooks/useQuickSave.ts` → `IBookmarkRepository.create()`, called directly — no message round-trip through the service worker). Bookmarks created or edited the native way (star icon, Ctrl+D, import, sync from another device) are **not** touched — no rule evaluation, no move. This is a deliberate choice (see `UI-4` in `specs/tasks.md`), not a gap: auto-sorting native saves is a deferred idea, see `specs/ideas.md`.

| Event | Action |
|---|---|
| `bookmarks.onRemoved` | Cascade-removes the bookmark's Dexie links (tags, category/status, icon override) via `BookmarkService.removeAllLinksForBookmark()` — see `BG-1` |

`bookmarks.onCreated`/`onImportBegan`/`onChanged` are intentionally not handled — see above. The extension only **creates** bookmarks directly in the resolved target folder — it never moves or duplicates bookmarks it didn't itself just create.

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
{ "type": "and", "nodes": [ <rule>, <rule>, ... ] }
{ "type": "or",  "nodes": [ <rule>, <rule>, ... ] }
{ "type": "not", "nodes": [ <rule>, <rule>, ... ] }
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
  "type": "and",
  "nodes": [
    { "term":  { "domain": "youtube.com" } },
    { "type": "or",
      "nodes": [
        { "terms":    { "tags": ["tutorial", "course"] } },
        { "wildcard": { "title": "*tutorial*" } }
      ]
    }
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
- **SVG icons must be extracted as components.** Never write `<svg>` inline in component JSX. Create a named component in `components/icons/` (e.g. `IconPlus`, `IconFolder`) and import it. Inline SVG is allowed only inside the icon component file itself. **This also bans raw Unicode/text glyphs standing in for an icon** — a bare `×`/`+`/`→`/etc. as a button's entire text content (e.g. `<button>×</button>` for a remove/close action) is the same problem as inline `<svg>`: it can't take a `size` prop, its stroke weight comes from whatever the surrounding font renders and won't match the rest of the icon set, and it silently drifts out of sync with every other icon on screen. If the glyph represents an action (remove, add, close, navigate), use the matching icon component (`IconX`, `IconPlus`, `IconArrowRight`, ...) instead. A glyph used as plain inline punctuation in running text (e.g. a `→` separating a "key" field from a "value" field, not sitting inside a `<button>`/`onClick` element) is not an icon and is fine as text. **Size is a semantic `size` prop, never a raw number.** Every icon component takes `size?: IconSize` (`'sm' | 'md' | 'lg'`, from `components/icons/icon-size.ts`, default `'md'`) — resolved internally to px via the shared `ICON_SIZE_PX` map. Don't pass a numeric literal (`size={13}`) at a call site; pick the closest semantic tier instead. Changing an icon's actual pixel size project-wide means editing `icon-size.ts` (and the matching `--icon-size-*` tokens in `assets/globals.css`), not touching call sites.
- **Text follows the same rule: use `<Text>` from `components/ui/text.tsx`, never a raw `font-size` in a new `.module.css`.** `Text` takes `size` (`'heading' | 'subheading' | 'body' | 'caption' | 'code'`, backed by the `--fs-*` tokens in `assets/globals.css`), `weight` (`'regular' | 'medium' | 'bold'`, defaults per size — bold for heading/subheading, regular otherwise), `tone` (`'default' | 'muted' | 'accent'`, backed by the existing `--text`/`--muted`/`--accent` color tokens), and `as` to override the rendered tag (e.g. `<Text as="h2" size="subheading">` keeps semantic heading level independent of visual size). Existing `.module.css` files with their own `font-size` are not required to migrate immediately — convert a file wholesale only when you're already rewriting it for other reasons, same as the `rem`-units rule above.
- **An icon-only action button (a `<button>` whose entire content is one icon) uses `IconButton`/`RemoveIconButton` from `components/ui/`, never a hand-rolled `<button className={styles.whatever}><IconX size="sm" /></button>`.** Found ~10 copies of the exact same `display:inline-flex; align-items:center; justify-content:center; color:var(--faint); transition:color .15s;` + `:hover{color:var(--red)}` shape scattered across `tags/`/`aliases/`/`entities`/rule-condition `.module.css` files before this was extracted — a new one is another copy waiting to drift. `IconButton` takes `icon` (an icon component) and `variant` (`'default'` → hover `var(--accent)`, `'danger'` → hover `var(--red)`); `RemoveIconButton` is `IconButton` pre-configured with `icon={IconX}` and `variant="danger"` for the by-far most common case (a small "×" that removes a row/chip/condition) — override `icon` only for a genuinely different glyph on the same destructive action (e.g. `IconTrash` for a cascading delete, see `RuleTreeRow`). Layout that's specific to one call site (`margin-left: auto`, extra padding, an additional hover background for a dense cluster of adjacent icon buttons) stays in that component's own `.module.css`, composed in via the `className` prop — not baked into the shared component.
- **Prefer Radix UI primitives** for interactive patterns: `RadioGroup` for segmented controls, `Switch` for toggles, `Slot` for `asChild` composition. Check `@radix-ui/*` packages before writing custom interactive elements.
- **`components/ui/`** holds thin wrappers around Radix primitives (Button, Badge, Switch, Input, Textarea, IconButton) plus the shared `Text` typography component. Check there before creating new elements.
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
| `specs/cancelled.md` | Tasks that won't be done — superseded, obsolete, or explicitly out of scope |
| `specs/ideas.md` | Unconfirmed, not-yet-scoped ideas — lighter than a task, no ID/priority required |
| `specs/verification.md` | Manual correctness checklist — things to verify by hand in the running extension, grouped by task category |

A task lives in exactly one of `backlog.md` / `tasks.md` / `changelog.md` / `cancelled.md` at a time. When work on a task begins, move it from `backlog.md` to `tasks.md`. When it's finished, move it from `tasks.md` to `changelog.md`, adding a **Completed:** date — don't delete it. (Before this convention, finished tasks were deleted outright and relied on git history alone; that made completed work invisible unless someone went digging through commits, so now the entry itself is kept.)

**Cancelling a task.** When a task becomes obsolete — superseded by what another task ended up implementing, the scenario it was designed for stops existing, or it's explicitly decided out of scope — move it from `backlog.md` or `tasks.md` to `cancelled.md` instead of deleting it, adding **Cancelled:**/**Reason:** fields (see below). Same reasoning as `changelog.md`: the entry (and why it died) stays discoverable instead of silently vanishing. Don't cancel a task just because it looks stale or low-priority — cancel it because the described work genuinely doesn't need doing; if unsure, ask rather than deciding unilaterally.

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

`cancelled.md` entries have the same four fields plus two more, added when the task is moved there:

| Field | Description |
|---|---|
| Cancelled | Date the task was cancelled (`YYYY-MM-DD`) |
| Reason | Why — what superseded it, what changed, or why it's out of scope |

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

## Release process

`.github/workflows/release.yml` builds a GitHub Release on every push to `main`, gated on `src/package.json`'s `version` actually having changed — it compares against existing `vX.Y.Z` git tags, so a merge that doesn't bump `version` builds nothing. Two zips are produced (Chrome MV3 and Firefox MV2 — they're not the same artifact: `wxt.config.ts` adds the `favicon` permission for Chrome only, since Firefox's manifest schema rejects it), plus Firefox's `-sources.zip` for AMO review.

**`CHANGELOG.md`** (repo root) is the source of the Release's description — not `specs/changelog.md`, which is the internal task-completion log. `CHANGELOG.md` itself stays user-facing only (Keep a Changelog style); this process lives here, not there. Add entries under `## [Unreleased]` as you go, grouped under `### Добавлено`/`### Исправлено`/`### Изменено` — include only the subsections a given release actually needs, no empty headers. When prepping a release, bump `version` in `src/package.json` and rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` in the same PR. The workflow's `scripts/extract-changelog.mjs` pulls that section as the release body and **fails the build if it's missing or empty** — a version bump without a matching changelog entry won't ship.

The release job also runs `lint`/`compile`/`test` as a gate before building — a merge to `main` with a version bump only produces a release if all three pass.

## Testing

**Vitest** is the test runner. Mock `chrome.*` APIs via `vitest-chrome`.

Rules:
- Service classes and functions in `lib/` must have unit tests.
- Tests live next to the source file in a `__tests__/` subfolder.
- React components are not tested.
- **A `Fake*` test double used by 2+ test files gets extracted, not copy-pasted.** A single-file `class FakeXRepository implements IXRepository { ... }` inline in one `*.test.ts` is fine — no abstraction needed for a one-off. The moment a second test file needs the same fake (verbatim or near-verbatim), move it to `<layer>/__tests__/fakes/FakeX.ts` (e.g. `repository/__tests__/fakes/FakeBookmarkRuleRepository.ts`) and have both tests import it. Keeps the fake in sync with its real interface in one place instead of drifting between copies (see RULE-10's `removeWithDescendants` — added to the interface, would've meant patching two copies by hand instead of one).

```bash
npm test        # Run all tests
npm run test:watch  # Watch mode
```

**`configs/*/settings.json`** are `SettingsExport`-shaped fixtures (`src/types/settings-export.ts`) the user feeds into the real Export/Import dialog (Main tab) for manual, in-browser testing of rules/tags/categories — not just Vitest fixtures. Keep them in sync whenever `BookmarkRule`/`Tag`/`EntityType`/`DomainAlias`/`PageMatchGroup` shapes change, the same way `isSettingsExport` (`src/lib/settings-export-mapping.ts`) needs to. See `configs/README.md` for what each set demonstrates.

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

### Sizing tokens

Also in `assets/globals.css`, theme-independent (same in dark/light). Change here, not per call site:

```css
--font-mono: 'JetBrains Mono', monospace;

--icon-size-sm: 0.875rem;  /* 14px — matches components/icons/icon-size.ts ICON_SIZE_PX */
--icon-size-md: 1rem;      /* 16px */
--icon-size-lg: 1.25rem;   /* 20px */

--fs-heading: 1.375rem;    /* 22px */
--fs-subheading: 1rem;     /* 16px */
--fs-body: 0.875rem;       /* 14px */
--fs-caption: 0.75rem;     /* 12px */
--fs-code: 0.8125rem;      /* 13px */

--fw-regular: 400;
--fw-medium: 500;
--fw-bold: 700;
```

Icon width/height are set via SVG attributes (can't read CSS vars), so `icon-size.ts`'s `ICON_SIZE_PX` mirrors the `--icon-size-*` rem values in px — keep both in sync if the scale changes. Typography tokens are consumed directly in CSS through `components/ui/text.tsx` (see Code rules above).
