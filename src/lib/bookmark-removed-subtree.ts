import type { Browser } from 'wxt/browser';

type BookmarkTreeNode = Browser.bookmarks.BookmarkTreeNode;

/**
 * `bookmarks.onRemoved` fires once for a removed folder, not once per
 * descendant — `removeInfo.node` carries the whole removed subtree. Walks it
 * and returns every leaf bookmark id inside (folders carry no tag/category
 * links of their own, only their bookmark descendants do).
 */
export function collectRemovedBookmarkIds(id: string, node: BookmarkTreeNode): string[] {
  if (node.url !== undefined) return [id];
  return (node.children ?? []).flatMap((child) => collectRemovedBookmarkIds(child.id, child));
}
