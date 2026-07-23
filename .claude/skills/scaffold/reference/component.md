# Creating a component

Expected input: `<ComponentName> [subfolder]`, e.g.:
- `RuleListRow rules` → creates `src/components/rules/RuleListRow.tsx`
- `ThemeToggle layout` → creates `src/components/layout/ThemeToggle.tsx`
- `BookmarkCard bookmarks` → creates `src/components/bookmarks/BookmarkCard.tsx`

If the subfolder isn't given, ask the user which subfolder under `src/components/` to use before generating.

Before placing the file, check whether the target subfolder already has (or would gain) 2+ components that only make sense together — if so, put the new component in a nested cluster folder instead of dropping it flat (e.g. `popup/quick-save/ConfirmFolderView.tsx`, following the existing `options/tabs/{aliases,main,rules}/` pattern). Don't invent a cluster folder for a single, standalone component.

## Rules to follow

1. Functional component only — no classes.
2. `any` is forbidden — all props must be explicitly typed.
3. Define props as a TypeScript interface named `<ComponentName>Props` in the same file.
4. If the component renders a list, ask whether the row/item should also be a separate component (strict decomposition — see `CLAUDE.md`).
5. Styling: CSS Modules only. Create `<ComponentName>.module.css` alongside the component. No inline `style=` except for genuinely dynamic values (e.g. a color from props). No global utility classes.
6. CSS units: `rem` is the default — use it for `font-size`, `padding`, `margin`, `gap`, `width`/`height`, and `border-radius` (1rem = 16px). Other units are fine with a concrete reason (hairline strokes like `border-width: 1px`, matching a fixed external asset size, sub-pixel alignment), but `rem` is the priority, not just one option among several. This applies to the new file only — don't touch units in unrelated existing `.module.css` files.
7. Prefer Radix UI primitives for interactive patterns (`RadioGroup`, `Switch`, `Slot`/`asChild`, etc.) and check `src/components/ui/` (thin Radix wrappers: Button, Badge, Switch, Input, Textarea) before writing a custom interactive element.
8. Never write inline `<svg>` in the component's JSX. If an icon is needed, create or reuse a named component in `src/components/icons/` (e.g. `IconPlus`, `IconFolder`) and import it.
9. No business logic — components receive data and callbacks via props, nothing more.
10. No direct calls to `chrome.*`, `browser.*`, Dexie, or any service/repository — use hooks from `src/hooks/` instead.

## Output

Generate the component file (and its `.module.css`) at the correct path. After creating it, show the file path and a one-line summary of what the component does.
