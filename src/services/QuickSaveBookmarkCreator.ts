import type { IBookmarkRepository } from '../repository/interfaces/IBookmarkRepository';
import type { IBookmarkQuickSaveLinksRepository } from '../repository/interfaces/IBookmarkQuickSaveLinksRepository';
import type { QuickSaveSelection } from '../types/quick-save';
import type { IQuickSaveBookmarkCreator } from './interfaces/IQuickSaveBookmarkCreator';

export class QuickSaveBookmarkCreator implements IQuickSaveBookmarkCreator {
  constructor(
    private readonly bookmarkRepository: IBookmarkRepository,
    private readonly bookmarkQuickSaveLinksRepository: IBookmarkQuickSaveLinksRepository,
  ) {}

  async create(title: string, url: string, selection: QuickSaveSelection): Promise<void> {
    const created = await this.bookmarkRepository.create(title, url, selection.targetFolder);

    if (selection.tagIds.length === 0 && selection.entityTypeId === undefined) return;

    await this.bookmarkQuickSaveLinksRepository.save({
      bookmarkId: created.id,
      tagIds: selection.tagIds,
      entityTypeId: selection.entityTypeId,
      statusId: selection.statusId,
    });
  }
}
