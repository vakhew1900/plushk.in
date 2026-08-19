import { describe, expect, it } from 'vitest';
import type { IBookmarkTagLinkRepository } from '../../repository/interfaces/IBookmarkTagLinkRepository';
import type { IBookmarkEntityLinkRepository } from '../../repository/interfaces/IBookmarkEntityLinkRepository';
import { BookmarkService } from '../BookmarkService';

function fakeTagLinkRepository(remove: IBookmarkTagLinkRepository['remove']): IBookmarkTagLinkRepository {
  return {
    getAll: async () => { throw new Error('not implemented'); },
    getById: async () => { throw new Error('not implemented'); },
    save: async () => { throw new Error('not implemented'); },
    getBookmarkIdsByTagIds: async () => { throw new Error('not implemented'); },
    remove,
  };
}

function fakeEntityLinkRepository(remove: IBookmarkEntityLinkRepository['remove']): IBookmarkEntityLinkRepository {
  return {
    getAll: async () => { throw new Error('not implemented'); },
    getById: async () => { throw new Error('not implemented'); },
    save: async () => { throw new Error('not implemented'); },
    getBookmarkIdsByEntityType: async () => { throw new Error('not implemented'); },
    remove,
  };
}

describe('BookmarkService.removeAllLinksForBookmark', () => {
  it('removes the bookmark id from both the tag-link and category/status-link tables', async () => {
    const removedFromTags: string[] = [];
    const removedFromEntities: string[] = [];
    const service = new BookmarkService(
      fakeTagLinkRepository(async (id) => {
        removedFromTags.push(id);
      }),
      fakeEntityLinkRepository(async (id) => {
        removedFromEntities.push(id);
      }),
    );

    await service.removeAllLinksForBookmark('bm-1');

    expect(removedFromTags).toEqual(['bm-1']);
    expect(removedFromEntities).toEqual(['bm-1']);
  });

  it('does not swallow a failure from one repository — the caller sees it', async () => {
    const service = new BookmarkService(
      fakeTagLinkRepository(async () => { throw new Error('tag link table unavailable'); }),
      fakeEntityLinkRepository(async () => {}),
    );

    await expect(service.removeAllLinksForBookmark('bm-1')).rejects.toThrow('tag link table unavailable');
  });
});
