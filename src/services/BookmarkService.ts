import type { IBookmarkTagLinkRepository } from '../repository/interfaces/IBookmarkTagLinkRepository';
import type { IBookmarkEntityLinkRepository } from '../repository/interfaces/IBookmarkEntityLinkRepository';
import type { IBookmarkService } from './interfaces/IBookmarkService';

export class BookmarkService implements IBookmarkService {
  constructor(
    private readonly bookmarkTagLinkRepository: IBookmarkTagLinkRepository,
    private readonly bookmarkEntityLinkRepository: IBookmarkEntityLinkRepository,
  ) {}

  async removeAllLinksForBookmark(bookmarkId: string): Promise<void> {
    await Promise.all([
      this.bookmarkTagLinkRepository.remove(bookmarkId),
      this.bookmarkEntityLinkRepository.remove(bookmarkId),
    ]);
  }
}
