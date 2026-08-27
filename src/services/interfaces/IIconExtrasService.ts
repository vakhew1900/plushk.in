import type { CssIconSource, XPathIconSource } from '../../types/icon-rule';

/**
 * Runs a matched `IconRule`'s css/xpath source against the given tab's DOM
 * (via an on-demand-injected content script) and returns the resolved icon
 * URL. `undefined` on any failure — restricted page, closed tab, no response
 * in time, selector found nothing — callers fall back to the default favicon.
 * Only usable where a `tabId` is available under `activeTab` (quick-save
 * flow) — see RULE-13, mirrors `IPageExtrasService`.
 */
export interface IIconExtrasService {
  extract(tabId: number, source: CssIconSource | XPathIconSource): Promise<string | undefined>;
}
