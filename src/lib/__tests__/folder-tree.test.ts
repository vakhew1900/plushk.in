import { describe, expect, it } from 'vitest';
import type { FolderNode } from '../../types/folder-node';
import { collectAncestorIds, resolveToolbarPath, withPendingPath } from '../folder-tree';

function node(overrides: Partial<FolderNode> & Pick<FolderNode, 'id' | 'title' | 'path'>): FolderNode {
  return { children: [], ...overrides };
}

// Mirrors BookmarkRepository.parseFolderTree's convention: a container's own
// path is its title, but its descendants' paths reset (container-agnostic),
// matching how BookmarkRule.targetFolder is written ("Social/Reddit", never
// "Bookmarks bar/Social/Reddit").
const tree: FolderNode[] = [
  node({
    id: '1',
    title: 'Bookmarks bar',
    path: 'Bookmarks bar',
    children: [
      node({
        id: 'social',
        title: 'Social',
        path: 'Social',
        children: [node({ id: 'reddit', title: 'Reddit', path: 'Social/Reddit' })],
      }),
    ],
  }),
  node({ id: '2', title: 'Other bookmarks', path: 'Other bookmarks' }),
];

describe('collectAncestorIds', () => {
  it('returns an empty set for an empty target path', () => {
    expect(collectAncestorIds(tree, '')).toEqual(new Set());
  });

  it('collects every ancestor id on the way to a nested path, inclusive, across a container path-reset boundary', () => {
    // "Social/Reddit" is nested two tree levels below "Bookmarks bar" (id '1'),
    // even though its path string doesn't carry the container's prefix — a
    // matched rule's targetFolder for a folder that already exists under some
    // container must still resolve/expand correctly.
    expect(collectAncestorIds(tree, 'Social/Reddit')).toEqual(new Set(['1', 'social', 'reddit']));
  });

  it('collects just the top-level id for a top-level (container) target', () => {
    expect(collectAncestorIds(tree, 'Other bookmarks')).toEqual(new Set(['2']));
  });

  it('returns an empty set when the path matches nothing', () => {
    expect(collectAncestorIds(tree, 'Nowhere/Nothing')).toEqual(new Set());
  });
});

describe('resolveToolbarPath', () => {
  it('resolves the Chrome-style toolbar id', () => {
    expect(resolveToolbarPath(tree)).toBe('Bookmarks bar');
  });

  it('resolves the Firefox-style toolbar id', () => {
    const firefoxTree: FolderNode[] = [
      node({ id: 'menu________', title: 'Bookmarks Menu', path: 'Bookmarks Menu' }),
      node({ id: 'toolbar_____', title: 'Bookmarks Toolbar', path: 'Bookmarks Toolbar' }),
      node({ id: 'unfiled_____', title: 'Other Bookmarks', path: 'Other Bookmarks' }),
    ];
    expect(resolveToolbarPath(firefoxTree)).toBe('Bookmarks Toolbar');
  });

  it('returns undefined when no toolbar container is present', () => {
    expect(resolveToolbarPath([node({ id: 'weird', title: 'Weird', path: 'Weird' })])).toBeUndefined();
  });
});

describe('withPendingPath', () => {
  it('returns the tree unchanged for an empty target path', () => {
    expect(withPendingPath(tree, '')).toBe(tree);
  });

  it('returns the tree unchanged when the full path already exists', () => {
    expect(withPendingPath(tree, 'Social/Reddit')).toBe(tree);
  });

  it('appends a single pending leaf under an existing parent nested under a container', () => {
    const result = withPendingPath(tree, 'Social/NewTopic');
    const social = result[0].children[0];
    expect(social.children).toHaveLength(2);
    expect(social.children[1]).toEqual({
      id: 'pending:Social/NewTopic',
      title: 'NewTopic',
      path: 'Social/NewTopic',
      pending: true,
      children: [],
    });
  });

  it('appends a whole pending chain under an existing container when both trailing segments are missing', () => {
    const result = withPendingPath(tree, 'Learning/Videos');
    // Neither "Learning" nor "Learning/Videos" exists anywhere in the tree,
    // so this is a brand new top-level pending branch, not nested under
    // "Bookmarks bar" — matching how BookmarkRepository would actually create
    // it (browser-default placement, not necessarily the Toolbar).
    expect(result).toHaveLength(3);
    expect(result[2]).toEqual({
      id: 'pending:Learning',
      title: 'Learning',
      path: 'Learning',
      pending: true,
      children: [
        { id: 'pending:Learning/Videos', title: 'Videos', path: 'Learning/Videos', pending: true, children: [] },
      ],
    });
  });

  it('appends a new top-level pending chain when even the first segment does not exist', () => {
    const result = withPendingPath(tree, 'Reading/Later');
    expect(result).toHaveLength(3);
    expect(result[2]).toEqual({
      id: 'pending:Reading',
      title: 'Reading',
      path: 'Reading',
      pending: true,
      children: [
        { id: 'pending:Reading/Later', title: 'Later', path: 'Reading/Later', pending: true, children: [] },
      ],
    });
  });

  it('does not mutate the original tree', () => {
    const original = JSON.parse(JSON.stringify(tree)) as FolderNode[];
    withPendingPath(tree, 'Social/NewTopic');
    expect(tree).toEqual(original);
  });
});
