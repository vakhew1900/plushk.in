import { describe, expect, it } from 'vitest';
import type { Browser } from 'wxt/browser';
import type { BookmarkSearchEntry } from '../../types/bookmark-search-entry';
import type { FolderNode } from '../../types/folder-node';
import type { AdvancedSelection } from '../../types/quick-save';
import type { IBookmarkRepository } from '../../repository/interfaces/IBookmarkRepository';
import type { IBookmarkQuickSaveLinksRepository, QuickSaveLinks } from '../../repository/interfaces/IBookmarkQuickSaveLinksRepository';
import { QuickSaveBookmarkCreator } from '../QuickSaveBookmarkCreator';

class FakeBookmarkRepository implements IBookmarkRepository {
  public created: { title: string; url: string; targetFolder?: string }[] = [];
  private nextId = 1;

  async create(title: string, url: string, targetFolder?: string): Promise<Browser.bookmarks.BookmarkTreeNode> {
    this.created.push({ title, url, targetFolder });
    return { id: `bookmark-${this.nextId++}`, title, url } as Browser.bookmarks.BookmarkTreeNode;
  }
  async move(): Promise<void> {}
  async getByTitle(): Promise<Browser.bookmarks.BookmarkTreeNode[]> { return []; }
  async listAll(): Promise<BookmarkSearchEntry[]> { return []; }
  async getFolderTree(): Promise<FolderNode[]> { return []; }
}

class FakeBookmarkQuickSaveLinksRepository implements IBookmarkQuickSaveLinksRepository {
  public saved: QuickSaveLinks[] = [];
  async save(links: QuickSaveLinks): Promise<void> {
    this.saved.push(links);
  }
}

const noSelection: AdvancedSelection = { tagIds: [], entityTypeId: undefined, statusId: undefined };

describe('QuickSaveBookmarkCreator.create', () => {
  it('creates the bookmark and writes its tag/entity links using the id the repository returned', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const linksRepository = new FakeBookmarkQuickSaveLinksRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, linksRepository);

    const advanced: AdvancedSelection = { tagIds: ['tag-1', 'tag-2'], entityTypeId: 'entity-1', statusId: 'status-1' };
    await creator.create('React Tutorial', 'https://youtube.com/watch?v=abc', 'Videos', advanced);

    expect(bookmarkRepository.created).toEqual([{ title: 'React Tutorial', url: 'https://youtube.com/watch?v=abc', targetFolder: 'Videos' }]);
    expect(linksRepository.saved).toEqual([
      { bookmarkId: 'bookmark-1', tagIds: ['tag-1', 'tag-2'], entityTypeId: 'entity-1', statusId: 'status-1' },
    ]);
  });

  it('skips writing links entirely when nothing was selected, without an empty write', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const linksRepository = new FakeBookmarkQuickSaveLinksRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, linksRepository);

    await creator.create('Untitled', 'https://example.com', '', noSelection);

    expect(bookmarkRepository.created).toHaveLength(1);
    expect(linksRepository.saved).toEqual([]);
  });

  it('writes links when only a category (no tags) was selected', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const linksRepository = new FakeBookmarkQuickSaveLinksRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, linksRepository);

    await creator.create('A Book', 'https://oreilly.com/book', 'IT/Books', {
      tagIds: [],
      entityTypeId: 'entity-book',
      statusId: undefined,
    });

    expect(linksRepository.saved).toEqual([
      { bookmarkId: 'bookmark-1', tagIds: [], entityTypeId: 'entity-book', statusId: undefined },
    ]);
  });
});
