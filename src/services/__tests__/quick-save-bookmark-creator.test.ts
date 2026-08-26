import { describe, expect, it } from 'vitest';
import type { Browser } from 'wxt/browser';
import type { BookmarkSearchEntry } from '../../types/bookmark-search-entry';
import type { FolderNode } from '../../types/folder-node';
import type { QuickSaveSelection } from '../../types/quick-save';
import type { IconBookmark } from '../../types/icon-bookmark';
import type { IBookmarkRepository } from '../../repository/interfaces/IBookmarkRepository';
import type { IBookmarkQuickSaveLinksRepository, QuickSaveLinks } from '../../repository/interfaces/IBookmarkQuickSaveLinksRepository';
import type { IIconBookmarkRepository } from '../../repository/interfaces/IIconBookmarkRepository';
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
  async removeWithCascade(): Promise<void> {}
}

class FakeBookmarkQuickSaveLinksRepository implements IBookmarkQuickSaveLinksRepository {
  public saved: QuickSaveLinks[] = [];
  async save(links: QuickSaveLinks): Promise<void> {
    this.saved.push(links);
  }
}

class FakeIconBookmarkRepository implements IIconBookmarkRepository {
  public rows: IconBookmark[] = [];
  async getAll(): Promise<IconBookmark[]> { return this.rows; }
  async getById(id: string): Promise<IconBookmark | undefined> { return this.rows.find((r) => r.bookmarkId === id); }
  async save(row: IconBookmark): Promise<void> { this.rows.push(row); }
  async remove(): Promise<void> {}
}

const noLinks: Pick<QuickSaveSelection, 'tagIds' | 'entityTypeId' | 'statusId' | 'iconUrl'> = {
  tagIds: [],
  entityTypeId: undefined,
  statusId: undefined,
  iconUrl: undefined,
};

describe('QuickSaveBookmarkCreator.create', () => {
  it('creates the bookmark and writes its tag/entity links using the id the repository returned', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const linksRepository = new FakeBookmarkQuickSaveLinksRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, linksRepository, new FakeIconBookmarkRepository());

    const selection: QuickSaveSelection = {
      targetFolder: 'Videos',
      tagIds: ['tag-1', 'tag-2'],
      entityTypeId: 'entity-1',
      statusId: 'status-1',
      iconUrl: undefined,
    };
    await creator.create('React Tutorial', 'https://youtube.com/watch?v=abc', selection);

    expect(bookmarkRepository.created).toEqual([{ title: 'React Tutorial', url: 'https://youtube.com/watch?v=abc', targetFolder: 'Videos' }]);
    expect(linksRepository.saved).toEqual([
      { bookmarkId: 'bookmark-1', tagIds: ['tag-1', 'tag-2'], entityTypeId: 'entity-1', statusId: 'status-1' },
    ]);
  });

  it('skips writing links entirely when nothing was selected, without an empty write', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const linksRepository = new FakeBookmarkQuickSaveLinksRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, linksRepository, new FakeIconBookmarkRepository());

    await creator.create('Untitled', 'https://example.com', { targetFolder: '', ...noLinks });

    expect(bookmarkRepository.created).toHaveLength(1);
    expect(linksRepository.saved).toEqual([]);
  });

  it('writes links when only a category (no tags) was selected', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const linksRepository = new FakeBookmarkQuickSaveLinksRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, linksRepository, new FakeIconBookmarkRepository());

    await creator.create('A Book', 'https://oreilly.com/book', {
      targetFolder: 'IT/Books',
      tagIds: [],
      entityTypeId: 'entity-book',
      statusId: undefined,
      iconUrl: undefined,
    });

    expect(linksRepository.saved).toEqual([
      { bookmarkId: 'bookmark-1', tagIds: [], entityTypeId: 'entity-book', statusId: undefined },
    ]);
  });

  it('writes an IconBookmark row when an icon url is present', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const iconBookmarkRepository = new FakeIconBookmarkRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, new FakeBookmarkQuickSaveLinksRepository(), iconBookmarkRepository);

    await creator.create('React Tutorial', 'https://youtube.com/watch?v=abc', {
      targetFolder: 'Videos',
      ...noLinks,
      iconUrl: 'https://cdn.example.com/icon.png',
    });

    expect(iconBookmarkRepository.rows).toEqual([{ bookmarkId: 'bookmark-1', iconUrl: 'https://cdn.example.com/icon.png' }]);
  });

  it('does not write an IconBookmark row when no icon url is present', async () => {
    const bookmarkRepository = new FakeBookmarkRepository();
    const iconBookmarkRepository = new FakeIconBookmarkRepository();
    const creator = new QuickSaveBookmarkCreator(bookmarkRepository, new FakeBookmarkQuickSaveLinksRepository(), iconBookmarkRepository);

    await creator.create('Untitled', 'https://example.com', { targetFolder: '', ...noLinks });

    expect(iconBookmarkRepository.rows).toEqual([]);
  });
});
