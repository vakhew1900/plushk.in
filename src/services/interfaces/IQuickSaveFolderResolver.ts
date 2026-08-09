import type { PageMeta } from '../../types/page-meta';

/**
 * Resolves the folder to pre-select in the popup's quick-save folder tree:
 * the highest-priority matching rule's `targetFolder`, or the user-configured
 * default folder when nothing matches.
 */
export interface IQuickSaveFolderResolver {
  resolve(meta: PageMeta): Promise<string>;
}
