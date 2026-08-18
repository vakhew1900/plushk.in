import type { PageMatchGroup } from '../../types/page-match';
import type { PageMeta } from '../../types/page-meta';

/**
 * Runs every saved `PageMatchGroup` against the given tab's DOM (via an
 * on-demand-injected content script) and returns the merged overlay to lay
 * on top of a base `PageMeta`. `undefined` on any failure — restricted page,
 * closed tab, no response in time — callers fall back to the base meta.
 * Only usable where a `tabId` is available under `activeTab` (quick-save
 * flow) — see RULE-5.
 */
export interface IPageExtrasService {
  extract(tabId: number, groups: PageMatchGroup[]): Promise<Partial<PageMeta> | undefined>;
}
