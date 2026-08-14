import type { IBookmarkRepository } from '../repository/interfaces/IBookmarkRepository';
import type { IBookmarkQuickSaveLinksRepository } from '../repository/interfaces/IBookmarkQuickSaveLinksRepository';
import type { AdvancedSelection } from '../types/quick-save';
import type { IQuickSaveBookmarkCreator } from './interfaces/IQuickSaveBookmarkCreator';

export class QuickSaveBookmarkCreator implements IQuickSaveBookmarkCreator {
  constructor(
    private readonly bookmarkRepository: IBookmarkRepository,
    private readonly bookmarkQuickSaveLinksRepository: IBookmarkQuickSaveLinksRepository,
  ) {}

  async create(title: string, url: string, targetFolder: string, advanced: AdvancedSelection): Promise<void> {
    const created = await this.bookmarkRepository.create(title, url, targetFolder);

    if (advanced.tagIds.length === 0 && advanced.entityTypeId === undefined) return;

    await this.bookmarkQuickSaveLinksRepository.save({
      bookmarkId: created.id,
      tagIds: advanced.tagIds,
      entityTypeId: advanced.entityTypeId,
      statusId: advanced.statusId,
    });
  }
}
