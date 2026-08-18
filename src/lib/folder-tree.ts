import { isToolbarId } from './browser-constants/bookmarkRoots';
import type { FolderNode } from '../types/folder-node';

/**
 * Ids of every node on the way from a root to the node whose `path` exactly
 * equals `targetPath` (inclusive), so callers can expand exactly that chain.
 *
 * Walks the tree's actual nesting rather than comparing path strings as
 * prefixes — a fixed container (Bookmarks Toolbar/Other/Mobile) resets the
 * path namespace for its children (see BookmarkRepository.parseFolderTree),
 * so a descendant's path is not necessarily `${ancestor.path}/...`.
 */
export function collectAncestorIds(nodes: FolderNode[], targetPath: string): Set<string> {
  const ids = new Set<string>();
  if (!targetPath) return ids;

  function search(level: FolderNode[], trail: string[]): boolean {
    for (const node of level) {
      const nextTrail = [...trail, node.id];
      if (node.path === targetPath) {
        nextTrail.forEach((id) => ids.add(id));
        return true;
      }
      if (search(node.children, nextTrail)) return true;
    }
    return false;
  }

  search(nodes, []);
  return ids;
}

// The root containers' ids differ per browser (numeric in Chrome, GUID-like
// in Firefox — see BookmarkRootId) — resolve the actual Toolbar node instead
// of guessing an id, the same way BookmarkRepository.resolveToolbarId() does.
export function resolveToolbarPath(topLevel: FolderNode[]): string | undefined {
  return topLevel.find((node) => isToolbarId(node.id))?.path;
}

function findNodeByPath(nodes: FolderNode[], path: string): FolderNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    const found = findNodeByPath(node.children, path);
    if (found) return found;
  }
  return undefined;
}

function buildPendingChain(segments: string[], parentPath: string): FolderNode {
  const [segment, ...rest] = segments;
  const path = parentPath ? `${parentPath}/${segment}` : segment;
  return {
    id: `pending:${path}`,
    title: segment,
    path,
    pending: true,
    children: rest.length > 0 ? [buildPendingChain(rest, path)] : [],
  };
}

function replaceNode(nodes: FolderNode[], id: string, update: (node: FolderNode) => FolderNode): FolderNode[] {
  return nodes.map((node) => {
    if (node.id === id) return update(node);
    const updatedChildren = replaceNode(node.children, id, update);
    if (updatedChildren === node.children) return node;
    return { ...node, children: updatedChildren };
  });
}

/**
 * A rule's/default folder's `targetFolder` can point at a path that doesn't
 * exist in the live bookmark tree yet (`BookmarkRepository` creates missing
 * segments on save) — without this, that path is simply invisible in the
 * picker, with nothing to highlight and no way to tell it apart from "no
 * folder chosen". Inserts placeholder nodes (`pending: true`) for whichever
 * trailing segments of `targetPath` aren't real yet, so the tree can still
 * show and select the full path.
 *
 * Finds the longest existing prefix of `targetPath` anywhere in the tree
 * (not assuming one segment per tree level — see collectAncestorIds) and
 * appends the remaining segments under it. If not even the first segment
 * exists anywhere, nests the new pending chain under the Bookmarks Toolbar —
 * mirroring BookmarkRepository.findOrCreateFolder, which defaults a brand-new
 * root-level folder there instead of leaving it unparented.
 */
export function withPendingPath(tree: FolderNode[], targetPath: string): FolderNode[] {
  if (!targetPath) return tree;
  const segments = targetPath.split('/').filter(Boolean);
  if (segments.length === 0) return tree;

  let matchedNode: FolderNode | undefined;
  let matchedDepth = 0;
  for (let i = segments.length; i >= 1; i--) {
    const candidatePath = segments.slice(0, i).join('/');
    const found = findNodeByPath(tree, candidatePath);
    if (found) {
      matchedNode = found;
      matchedDepth = i;
      break;
    }
  }

  const remaining = segments.slice(matchedDepth);
  if (remaining.length === 0) return tree; // full path already exists

  if (!matchedNode) {
    const toolbar = tree.find((node) => isToolbarId(node.id));
    if (!toolbar) return [...tree, buildPendingChain(segments, '')];

    // Nested structurally under the Toolbar (for correct expand/collapse
    // grouping in the UI), but the path itself stays container-agnostic —
    // same convention as any other folder already under the Toolbar (see
    // BookmarkRepository.parseFolderTree's path-reset on container descent).
    return replaceNode(tree, toolbar.id, (node) => ({
      ...node,
      children: [...node.children, buildPendingChain(segments, '')],
    }));
  }

  const matchedPath = matchedNode.path;
  return replaceNode(tree, matchedNode.id, (node) => ({
    ...node,
    children: [...node.children, buildPendingChain(remaining, matchedPath)],
  }));
}
