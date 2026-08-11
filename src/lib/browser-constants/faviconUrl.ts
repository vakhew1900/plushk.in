import { browser } from 'wxt/browser';
import type { PublicPath } from 'wxt/browser';
import { debugLog } from '../debug-log';
import { BrowserTarget } from './browserTarget';

// Chrome exposes a `_favicon` internal endpoint that returns a cached
// favicon (or a generic placeholder) for an arbitrary page URL. Requires the
// `favicon` permission (see wxt.config.ts).
// https://developer.chrome.com/docs/extensions/how-to/ui/favicons
//
// `_favicon` is a Chrome-internal virtual endpoint, not a file WXT ever
// bundles, so it can never appear in WXT's generated `PublicPath` union
// (.wxt/types/paths.d.ts, built from actual output files). The cast below
// is a permanent, intentional escape hatch for this one Chrome-only path —
// not a TODO to remove once WXT "adds typing" for it.
function chromeFaviconUrl(pageUrl: string): string {
  const query = new URLSearchParams({ pageUrl, size: '32' });
  return browser.runtime.getURL(`/_favicon/?${query}` as PublicPath);
}

// Firefox has no WebExtensions-accessible favicon lookup for arbitrary
// URLs. A `page-icon:` protocol exists internally but is restricted to
// privileged browser contexts (about: pages) and is unreachable from
// extension pages like options.html — exposing it would let extensions
// probe browsing history. Still open after almost a decade:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1315616
const FIREFOX_FAVICON_URL = undefined;

export const FaviconUrl = {
  CHROME: chromeFaviconUrl,
  FIREFOX: FIREFOX_FAVICON_URL,
} as const;

/** Resolves a real favicon URL for the current browser, or `undefined` when none is available. */
export function resolveFaviconUrl(pageUrl: string): string | undefined {
  debugLog('[favicon-debug] resolveFaviconUrl: pageUrl', pageUrl);
  const iconUrl =
    import.meta.env.BROWSER === BrowserTarget.FIREFOX ? FaviconUrl.FIREFOX : FaviconUrl.CHROME(pageUrl);
  debugLog('[favicon-debug] resolveFaviconUrl: iconUrl', iconUrl);
  return iconUrl;
}
