# Book Manager

A Manifest V3 browser extension that automatically sorts bookmarks using user-defined rules, with Markdown export and optional Obsidian integration.

**Stack:** WXT · React · TypeScript · Tailwind CSS · shadcn/ui

## Getting started

```bash
pnpm install
pnpm dev        # Dev mode with hot reload
pnpm build      # Production build
pnpm zip        # Package for store submission
pnpm typecheck  # Type check without building
pnpm test       # Run tests
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
| `noref` | Non-code change (docs, config, README) |

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
noref: [dev] update README
``` 

### Pull request title

Same format as the commit, or a short summary if the PR spans multiple blocks:

```
feat: [rule] Elasticsearch-inspired DSL with AND/OR/NOT support
```
