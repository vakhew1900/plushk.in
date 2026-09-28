/** Case-insensitive substring filter over `items` by a derived name. An empty/whitespace-only `query` returns `items` unchanged. */
export function filterByName<T>(items: readonly T[], query: string, getName: (item: T) => string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...items];
  return items.filter((item) => getName(item).toLowerCase().includes(q));
}
