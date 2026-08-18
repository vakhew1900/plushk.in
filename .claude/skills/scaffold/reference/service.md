# Creating a service or repository

First decide which layer this belongs to (see `CLAUDE.md` → Architecture):

- **Repository** — raw data access only (Dexie tables, `browser.*` APIs). Lives in `src/repository/`, interface in `src/repository/interfaces/`. Nothing above the repository layer may call Dexie or `browser.*` directly.
- **Service** — business logic. Lives in `src/services/<subfolder>/`, interface in `src/services/interfaces/`. Depends on repositories (injected the same way as services), never on Dexie/`browser.*` directly.

Expected input: `<Name> [subfolder]`, e.g.:
- `BookmarkRepository` (repository) → `src/repository/interfaces/IBookmarkRepository.ts` + `src/repository/BookmarkRepository.ts`
- `RuleEngine rules` (service) → `src/services/interfaces/IRuleEngine.ts` + `src/services/rules/RuleEngine.ts`
- `ArticleParser parser` (service) → `src/services/interfaces/IArticleParser.ts` + `src/services/parser/ArticleParser.ts`

If the subfolder isn't given, ask which subfolder under `src/services/` (or confirm `src/repository/` for a repository) before generating.

## Rules to follow

1. **Interface first** — create `I<Name>.ts` in `src/services/interfaces/` or `src/repository/interfaces/` (matching the layer) with all public methods typed. Explicit return types (e.g. `Promise<BookmarkMeta | null>`), no `any`.
2. **Implementation** — create the class in the appropriate subfolder. The class must implement the interface.
3. **No React imports** — services and repositories are framework-agnostic. Never import from `react`, hooks, or context.
4. **No `any`** — use `unknown` + type guard if a type is uncertain.
5. **String constants use `as const` objects, never `enum`** — derive the union type with `typeof Obj[keyof typeof Obj]`, same name for object and type. See `CLAUDE.md` → Code rules for the exact pattern.
6. A **service** must not call Dexie or `browser.*` directly — it depends on a repository interface, injected via context, not on the concrete implementation.
7. A **repository** must not contain business logic (rule evaluation, folder resolution, etc.) — only data access and shape mapping.
8. If new types are needed and don't exist yet in `src/types/`, create them there and import.
9. Add the new service/repository to `src/context/ServicesContext.tsx` if it needs to be injected — show the diff but do not apply it automatically, ask the user first.

## Output

1. Interface file.
2. Implementation file.
3. Test file at `src/services/<subfolder>/__tests__/<Name>.test.ts` (or `src/repository/__tests__/<Name>.test.ts`) — cover every public method with at least one happy-path and one edge-case test. Use `vitest`, and `vitest-chrome` for `chrome.*`/`browser.*` mocks. No `any`.
4. A short note on what to wire up in `ServicesContext` to make it available via hooks.
