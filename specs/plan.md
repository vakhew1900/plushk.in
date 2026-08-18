# Plan

## Components (what will be used)

**Stack**
- WXT — MV3 build tooling, dev server, entrypoint bundling
- React 19 + TypeScript (strict, no `any`)
- CSS Modules — no global utility classes, no Tailwind
- Radix UI primitives — `RadioGroup`, `Switch`, `Slot` (wrapped by `components/ui/`)
- Dexie.js — IndexedDB access, never called directly outside `services/data/`
- `@mozilla/readability` + `turndown` — article extraction → Markdown
- `@uiw/react-codemirror` + `@codemirror/lang-json` — JSON view for the compiled rule condition
- `clsx` — conditional class names

**Existing building blocks** (already implemented, reused going forward)
- `components/ui/*` — Button, Badge, Switch, Input, Textarea
- `components/icons/*` — SVG icon components (`IconPlus`, `IconFolder`, ...)
- `components/options/TabHeader` — shared tab title + lead
- `context/LocaleContext` + `hooks/useTranslation` — i18n (`locale/ru.json`, `locale/en.json`)
- `context/ThemeContext` + `hooks/useTheme` — dark/light/system theme, resolved to `data-theme` on the root element
- `lib/visitor/{rule-visitor,rule-evaluator}` — Visitor-pattern rule DSL evaluation (unit-tested)
- `lib/page-extractor` — `PageMeta` extraction from a `Document` via css/meta/xpath selectors (unit-tested)
- `services/data/{BookmarkRuleRepository,DomainAliasRepository,PageMatchGroupRepository}` + interfaces — Dexie-backed CRUD, built but not yet wired into the UI
- `services/PageExtractorService` — wraps `lib/page-extractor` behind `IPageExtractorService`

**Not built yet, needed for MVP**
- `context/ServicesContext` — DI so components/hooks get repositories via `useContext` instead of importing repository classes directly
- Real event handling in `entrypoints/background.ts` (currently the default WXT stub) — `bookmarks.onCreated / onImportBegan / onChanged / onRemoved`
- `entrypoints/content.ts` (currently the default stub) — will host the DOM-side extraction that feeds `PageExtractorService`

## Data model

Types live in `types/`, storage schema in `db/index.ts`.

- `PageMeta` (`types/page-meta.ts`) — `url, domain, title, description?, author?, language?, ogType?, tags?, publishedAt?, content?, extras?`
- `RuleNode` (`types/rule.ts`) — Elasticsearch-inspired DSL: `AndRule | OrRule | NotRule | TermRule | TermsRule | RegexRule | WildcardRule`, discriminated by `RuleType` (`as const` object, not `enum`)
- `BookmarkRule` (`types/rule.ts`) — `{ id, name, condition: RuleNode, targetFolder, priority }`
- `DomainAlias` (`types/domain-alias.ts`) — `{ id, name, domain_names: string[] }`
- `PageMatchGroup` / `PageMatch` / `PageSelector` (`types/page-match.ts`) — extraction config: `{ id, alias_name, pageMatches: Map<string, PageMatch> }`, each `PageMatch` = `{ name, selector: CssSelector | MetaSelector | XPathSelector }`

**Dexie schema** (`db/index.ts`, database `book-manager`, version 1)

| Table | Row type | Indexes |
|---|---|---|
| `rules` | `BookmarkRule` | `id, priority, targetFolder` |
| `domainAliases` | `DomainAlias` | `id, name` |
| `pageMatchGroups` | `StoredPageMatchGroup` (`pageMatches` stored as a `Record`, converted to/from `Map` at the repository boundary) | `id, alias_name` |

## Key decisions

- **Layer order is one-directional**: `components/ → hooks/ → context/ → services/ → chrome.* / IndexedDB`. No component or hook imports Dexie or a repository class directly — only through a hook that reads from `ServicesContext`.
- **Rule evaluation uses the Visitor pattern** (`RuleVisitor<T>` + `visitRule`) instead of a switch scattered across the codebase — adding a new rule type means adding one visitor method, not hunting down every place rules get interpreted.
- **The extension only ever moves bookmarks** (`chrome.bookmarks.move()`) — never duplicates. Fallback folder is always `Uncategorized` when no rule matches.
- **Storage is IndexedDB via Dexie only** — no `chrome.storage.*` for rules/aliases/variables. Each entity gets an interface + a Dexie-backed class; components/hooks never touch Dexie directly.

