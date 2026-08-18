import { describe, expect, it } from 'vitest';
import type { IBookmarkRepository } from '../../repository/interfaces/IBookmarkRepository';
import type { BookmarkSearchEntry } from '../../types/bookmark-search-entry';
import { BookmarkSearchService } from '../BookmarkSearchService';

const entries: BookmarkSearchEntry[] = [
  { id: 'bm-1', title: 'r/webdev — Show your project', url: 'https://reddit.com/r/webdev', folderPath: ['Bookmarks bar', 'Social'] },
  { id: 'bm-2', title: 'Habr article', url: 'https://habr.com/ru/articles/1', folderPath: ['Bookmarks bar', 'Reading'] },
  { id: 'bm-3', title: 'Dribbble shots', url: 'https://dribbble.com/shots/1', folderPath: ['Bookmarks bar', 'Inspiration'] },
];

function fakeRepository(): IBookmarkRepository {
  return {
    create: async () => { throw new Error('not implemented'); },
    move: async () => { throw new Error('not implemented'); },
    getByTitle: async () => { throw new Error('not implemented'); },
    listAll: async () => entries,
    getFolderTree: async () => { throw new Error('not implemented'); },
  };
}

describe('BookmarkSearchService.search', () => {
  it('returns every bookmark for an empty query', async () => {
    const service = new BookmarkSearchService(fakeRepository());

    const results = await service.search('');

    expect(results).toEqual(entries);
  });

  it('returns every bookmark for a whitespace-only query', async () => {
    const service = new BookmarkSearchService(fakeRepository());

    const results = await service.search('   ');

    expect(results).toEqual(entries);
  });

  it('matches case-insensitively against the title', async () => {
    const service = new BookmarkSearchService(fakeRepository());

    const results = await service.search('WEBDEV');

    expect(results).toEqual([entries[0]]);
  });

  it('matches against the URL', async () => {
    const service = new BookmarkSearchService(fakeRepository());

    const results = await service.search('habr.com');

    expect(results).toEqual([entries[1]]);
  });

  it('matches against a folder path segment', async () => {
    const service = new BookmarkSearchService(fakeRepository());

    const results = await service.search('inspiration');

    expect(results).toEqual([entries[2]]);
  });

  it('returns no results when nothing matches', async () => {
    const service = new BookmarkSearchService(fakeRepository());

    const results = await service.search('nonexistent');

    expect(results).toEqual([]);
  });
});
