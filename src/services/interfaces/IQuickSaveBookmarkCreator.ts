import type { QuickSaveSelection } from '../../types/quick-save';

/**
 * Creates a quick-saved bookmark and, if the user picked any, its tag/category
 * links — one call from the popup's "Сохранить" instead of the hook
 * orchestrating three separate repositories itself.
 */
export interface IQuickSaveBookmarkCreator {
  create(title: string, url: string, selection: QuickSaveSelection): Promise<void>;
}
