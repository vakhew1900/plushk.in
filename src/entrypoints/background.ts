// Rule matching and folder resolution happen only in the extension's own
// popup quick-save flow (see hooks/useQuickSave.ts) — bookmarks created or
// edited the native way (star icon, Ctrl+D, import, sync) are intentionally
// left untouched. See UI-4 in specs/tasks.md and specs/ideas.md.
export default defineBackground(() => {});
