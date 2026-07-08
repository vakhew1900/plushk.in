import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Browser } from 'wxt/browser';
import { BookmarkRepository } from '../BookmarkRepository';

const bookmarksApi = vi.hoisted(() => ({
  create: vi.fn(),
  move: vi.fn(),
  search: vi.fn(),
  getChildren: vi.fn(),
  getTree: vi.fn(),
}));

vi.mock('wxt/browser', () => ({
  browser: { bookmarks: bookmarksApi },
}));

type Node = Browser.bookmarks.BookmarkTreeNode;

const rootTree: Node[] = [
  {
    id: '0',
    title: '',
    syncing: false,
    children: [
      { id: '1', title: 'Bookmarks bar', syncing: false },
      { id: '2', title: 'Other bookmarks', syncing: false },
    ],
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('BookmarkRepository.create', () => {
  it('creates without a parentId when no target folder is given', async () => {
    bookmarksApi.create.mockResolvedValueOnce({ id: 'bm-1', title: 'Foo', url: 'https://foo.com', syncing: false });
    const repo = new BookmarkRepository();

    const result = await repo.create('Foo', 'https://foo.com');

    expect(bookmarksApi.create).toHaveBeenCalledWith({ title: 'Foo', url: 'https://foo.com' });
    expect(result.id).toBe('bm-1');
  });

  it('resolves an existing single-segment folder before creating', async () => {
    bookmarksApi.getTree.mockResolvedValueOnce(rootTree);
    bookmarksApi.search.mockResolvedValueOnce([{ id: 'folder-videos', title: 'Videos', parentId: '2', syncing: false }]);
    bookmarksApi.create.mockResolvedValueOnce({ id: 'bm-2', title: 'Bar', url: 'https://bar.com', syncing: false });

    const repo = new BookmarkRepository();
    await repo.create('Bar', 'https://bar.com', 'Videos');

    expect(bookmarksApi.search).toHaveBeenCalledWith({ title: 'Videos' });
    expect(bookmarksApi.create).toHaveBeenCalledWith({ title: 'Bar', url: 'https://bar.com', parentId: 'folder-videos' });
  });

  it('creates missing folders segment by segment for a nested path', async () => {
    bookmarksApi.getTree.mockResolvedValueOnce(rootTree);
    bookmarksApi.search.mockResolvedValueOnce([]); // no "Social" folder yet
    bookmarksApi.create.mockResolvedValueOnce({ id: 'social-id', title: 'Social', syncing: false }); // creates "Social"
    bookmarksApi.getChildren.mockResolvedValueOnce([]); // no "Reddit" under Social
    bookmarksApi.create.mockResolvedValueOnce({ id: 'reddit-id', title: 'Reddit', syncing: false }); // creates "Reddit"
    bookmarksApi.create.mockResolvedValueOnce({ id: 'bm-3', title: 'Post', url: 'https://reddit.com/post', syncing: false });

    const repo = new BookmarkRepository();
    await repo.create('Post', 'https://reddit.com/post', 'Social/Reddit');

    expect(bookmarksApi.create).toHaveBeenNthCalledWith(1, { title: 'Social' });
    expect(bookmarksApi.getChildren).toHaveBeenCalledWith('social-id');
    expect(bookmarksApi.create).toHaveBeenNthCalledWith(2, { title: 'Reddit', parentId: 'social-id' });
    expect(bookmarksApi.create).toHaveBeenNthCalledWith(3, {
      title: 'Post',
      url: 'https://reddit.com/post',
      parentId: 'reddit-id',
    });
  });
});

describe('BookmarkRepository.move', () => {
  it('resolves the target folder and moves the bookmark there', async () => {
    bookmarksApi.getTree.mockResolvedValueOnce(rootTree);
    bookmarksApi.search.mockResolvedValueOnce([{ id: 'folder-videos', title: 'Videos', parentId: '2', syncing: false }]);

    const repo = new BookmarkRepository();
    await repo.move('bm-1', 'Videos');

    expect(bookmarksApi.move).toHaveBeenCalledWith('bm-1', { parentId: 'folder-videos' });
  });
});

describe('BookmarkRepository.getByTitle', () => {
  it('returns only bookmarks (not folders) matching the title exactly', async () => {
    bookmarksApi.search.mockResolvedValueOnce([
      { id: 'bm-1', title: 'React Tutorial', url: 'https://youtube.com/1', syncing: false },
      { id: 'folder-1', title: 'React Tutorial', syncing: false }, // folder, no url
    ]);

    const repo = new BookmarkRepository();
    const results = await repo.getByTitle('React Tutorial');

    expect(bookmarksApi.search).toHaveBeenCalledWith({ title: 'React Tutorial' });
    expect(results).toEqual([{ id: 'bm-1', title: 'React Tutorial', url: 'https://youtube.com/1', syncing: false }]);
  });
});
