import { describe, expect, it } from 'vitest';
import type { Browser } from 'wxt/browser';
import { collectRemovedBookmarkIds } from '../bookmark-removed-subtree';

type Node = Browser.bookmarks.BookmarkTreeNode;

describe('collectRemovedBookmarkIds', () => {
  it('returns the id itself when a single bookmark (not a folder) is removed', () => {
    const node: Node = { id: 'bm-1', title: 'Post', url: 'https://reddit.com/post', syncing: false };

    expect(collectRemovedBookmarkIds('bm-1', node)).toEqual(['bm-1']);
  });

  it('returns an empty list for an empty removed folder', () => {
    const node: Node = { id: 'folder-1', title: 'Empty', syncing: false, children: [] };

    expect(collectRemovedBookmarkIds('folder-1', node)).toEqual([]);
  });

  it('collects every bookmark leaf id from a removed folder, ignoring nested folder ids themselves', () => {
    const node: Node = {
      id: 'folder-social',
      title: 'Social',
      syncing: false,
      children: [
        { id: 'bm-1', title: 'Reddit post', url: 'https://reddit.com/post', syncing: false },
        {
          id: 'folder-reddit',
          title: 'Reddit',
          syncing: false,
          children: [
            { id: 'bm-2', title: 'Thread', url: 'https://reddit.com/thread', syncing: false },
            { id: 'bm-3', title: 'Comment', url: 'https://reddit.com/comment', syncing: false },
          ],
        },
      ],
    };

    expect(collectRemovedBookmarkIds('folder-social', node)).toEqual(['bm-1', 'bm-2', 'bm-3']);
  });

  it('treats a folder with no children field (not just an empty array) the same as empty', () => {
    const node: Node = { id: 'folder-1', title: 'No children field', syncing: false };

    expect(collectRemovedBookmarkIds('folder-1', node)).toEqual([]);
  });
});
