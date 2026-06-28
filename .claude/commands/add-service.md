Create a new service: an interface in `src/services/interfaces/` and a concrete implementation class.

Arguments: $ARGUMENTS
Expected format: `<ServiceName> [storage|rules|parser|obsidian]`
Examples:
- `BookmarkStorage storage` → `IBookmarkStorage.ts` + `ChromeStorageRepository.ts`
- `RuleEngine rules` → `IRuleEngine.ts` + `RuleEngine.ts`
- `ArticleParser parser` → `IArticleParser.ts` + `ArticleParser.ts`

## Rules to follow

1. **Interface first** — create `I<ServiceName>.ts` in `src/services/interfaces/` with all public methods typed. Method signatures must use explicit return types (e.g. `Promise<BookmarkMeta | null>`), no `any`.
2. **Implementation** — create the class in the appropriate subfolder under `src/services/`. The class must implement the interface.
3. **No React imports** — services are framework-agnostic. Never import from `react`, hooks, or context.
4. **No `any`** — use `unknown` + type guard if the type is uncertain.
5. If the service needs types that don't exist yet in `src/types/`, create them there and import.
6. Add the new service to `src/context/ServicesContext.tsx` if it needs to be injected — show the diff but do not apply it automatically, ask the user first.

## Output

1. Interface file
2. Implementation file
3. A short note on what to wire up in `ServicesContext` to make the service available via hooks.

If the subfolder is not provided, ask which subfolder under `src/services/` before generating.
