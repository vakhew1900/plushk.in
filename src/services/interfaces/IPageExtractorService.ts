import type { PageMatchGroup } from '../../types/page-match';
import type { PageMeta } from '../../types/page-meta';

export interface IPageExtractorService {
  extract(group: PageMatchGroup): Partial<PageMeta>;
}
