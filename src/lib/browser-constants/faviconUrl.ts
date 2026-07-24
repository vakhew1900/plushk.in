import { browser } from 'wxt/browser';
import { debugLog } from '../debug-log';
import { BrowserTarget } from './browserTarget';

// Chrome exposes a `_favicon` internal endpoint that returns a cached
// favicon (or a generic placeholder) for an arbitrary page URL. Requires the
// `favicon` permission (see wxt.config.ts) and WXT's built-in typing for
// `/_favicon/?...` paths.
// https://developer.chrome.com/docs/extensions/how-to/ui/favicons
function chromeFaviconUrl(pageUrl: string): string {
  const query = new URLSearchParams({ pageUrl, size: '32' });
  return browser.runtime.getURL(`/_favicon/?${query}`);
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
