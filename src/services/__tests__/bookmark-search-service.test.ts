import { describe, expect, it, vi } from 'vitest';
import type { IBookmarkRepository } from '../../repository/interfaces/IBookmarkRepository';
import type { IBookmarkTagLinkRepository } from '../../repository/interfaces/IBookmarkTagLinkRepository';
import type { IBookmarkEntityLinkRepository } from '../../repository/interfaces/IBookmarkEntityLinkRepository';
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

function fakeTagLinkRepository(getBookmarkIdsByTagIds: IBookmarkTagLinkRepository['getBookmarkIdsByTagIds']): IBookmarkTagLinkRepository {
  return {
    getAll: async () => { throw new Error('not implemented'); },
    getById: async () => { throw new Error('not implemented'); },
    save: async () => { throw new Error('not implemented'); },
    remove: async () => { throw new Error('not implemented'); },
    getBookmarkIdsByTagIds,
  };
}

function fakeEntityLinkRepository(getBookmarkIdsByEntityType: IBookmarkEntityLinkRepository['getBookmarkIdsByEntityType']): IBookmarkEntityLinkRepository {
  return {
    getAll: async () => { throw new Error('not implemented'); },
    getById: async () => { throw new Error('not implemented'); },
    save: async () => { throw new Error('not implemented'); },
    remove: async () => { throw new Error('not implemented'); },
    getBookmarkIdsByEntityType,
  };
}

function buildService(opts?: {
  getBookmarkIdsByTagIds?: IBookmarkTagLinkRepository['getBookmarkIdsByTagIds'];
  getBookmarkIdsByEntityType?: IBookmarkEntityLinkRepository['getBookmarkIdsByEntityType'];
}) {
  const tagLinkRepository = fakeTagLinkRepository(opts?.getBookmarkIdsByTagIds ?? (async () => []));
  const entityLinkRepository = fakeEntityLinkRepository(opts?.getBookmarkIdsByEntityType ?? (async () => []));
  return new BookmarkSearchService(fakeRepository(), tagLinkRepository, entityLinkRepository);
}

describe('BookmarkSearchService.search', () => {
  it('returns every bookmark for an empty query', async () => {
    const service = buildService();

    const results = await service.search('');

    expect(results).toEqual(entries);
  });

  it('returns every bookmark for a whitespace-only query', async () => {
    const service = buildService();

    const results = await service.search('   ');

    expect(results).toEqual(entries);
  });

  it('matches case-insensitively against the title', async () => {
    const service = buildService();

    const results = await service.search('WEBDEV');

    expect(results).toEqual([entries[0]]);
  });

  it('matches against the URL', async () => {
    const service = buildService();

    const results = await service.search('habr.com');

    expect(results).toEqual([entries[1]]);
  });

  it('matches against a folder path segment', async () => {
    const service = buildService();

    const results = await service.search('inspiration');

    expect(results).toEqual([entries[2]]);
  });

  it('returns no results when nothing matches', async () => {
    const service = buildService();

    const results = await service.search('nonexistent');

    expect(results).toEqual([]);
  });

  it('returns every bookmark when filters are given but nothing is selected', async () => {
    const service = buildService();

    const results = await service.search('', { tagIds: [], entityTypeId: undefined, statusId: undefined });

    expect(results).toEqual(entries);
  });

  it('does not query the tag-link repository when no tags are selected', async () => {
    const getBookmarkIdsByTagIds = vi.fn(async () => []);
    const service = buildService({ getBookmarkIdsByTagIds });

    await service.search('', { tagIds: [], entityTypeId: undefined, statusId: undefined });

    expect(getBookmarkIdsByTagIds).not.toHaveBeenCalled();
  });

  it('filters by tag ids with OR semantics within the tag facet', async () => {
    const service = buildService({
      getBookmarkIdsByTagIds: async (tagIds) => (tagIds.includes('t-web') ? ['bm-1', 'bm-3'] : []),
    });

    const results = await service.search('', { tagIds: ['t-web'], entityTypeId: undefined, statusId: undefined });

    expect(results).toEqual([entries[0], entries[2]]);
  });

  it('combines a tag filter and a category filter with AND semantics', async () => {
    const service = buildService({
      getBookmarkIdsByTagIds: async () => ['bm-1', 'bm-2'],
      getBookmarkIdsByEntityType: async () => ['bm-2', 'bm-3'],
    });

    const results = await service.search('', { tagIds: ['t-web'], entityTypeId: 'article', statusId: undefined });

    expect(results).toEqual([entries[1]]);
  });

  it('passes the status id through to the category facet query', async () => {
    const getBookmarkIdsByEntityType = vi.fn(async () => ['bm-2']);
    const service = buildService({ getBookmarkIdsByEntityType });

    await service.search('', { tagIds: [], entityTypeId: 'article', statusId: 'done' });

    expect(getBookmarkIdsByEntityType).toHaveBeenCalledWith('article', 'done');
  });

  it('combines a text query with an active filter', async () => {
    const service = buildService({
      getBookmarkIdsByTagIds: async () => ['bm-1', 'bm-2'],
    });

    const results = await service.search('habr', { tagIds: ['t-it'], entityTypeId: undefined, statusId: undefined });

    expect(results).toEqual([entries[1]]);
  });
});
