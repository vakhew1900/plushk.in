import type { PageMeta } from '../../types/page-meta';

export interface QuickSaveResolution {
  targetFolder: string;
  matchedRuleName?: string;
  tagIds?: string[];
  entityTypeId?: string;
  statusId?: string;
}

/**
 * Resolves the folder to pre-select in the popup's quick-save folder tree —
 * the highest-priority matching rule's `targetFolder`, or the user-configured
 * default folder when nothing matches — plus whatever tags/category that same
 * rule suggests, so the popup's "Дополнительно" section can pre-fill them.
 */
export interface IQuickSaveFolderResolver {
  resolve(meta: PageMeta): Promise<QuickSaveResolution>;
}
