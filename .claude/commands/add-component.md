Create a new React component following the project conventions.

Arguments: $ARGUMENTS
Expected format: `<ComponentName> [subfolder]`
Examples:
- `RuleListRow rules` → creates `src/components/rules/RuleListRow.tsx`
- `ThemeToggle layout` → creates `src/components/layout/ThemeToggle.tsx`
- `BookmarkCard bookmarks` → creates `src/components/bookmarks/BookmarkCard.tsx`

## Rules to follow

1. Functional component only — no classes.
2. `any` is forbidden — all props must be explicitly typed.
3. Define props as a TypeScript interface named `<ComponentName>Props` in the same file.
4. If the component renders a list, ask whether the row/item should also be a separate component.
5. Prefer shadcn/ui primitives (`Button`, `Input`, `Badge`, etc. from `src/components/ui/`) over custom HTML elements.
6. No business logic — components receive data and callbacks via props, nothing more.
7. No direct calls to `chrome.*` or any service — use hooks from `src/hooks/` instead.

## Output

Generate the component file at the correct path. After creating it, show the file path and a one-line summary of what the component does.

If the subfolder is not provided, ask the user which subfolder under `src/components/` to use before generating.
