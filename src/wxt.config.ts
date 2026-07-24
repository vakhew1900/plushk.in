import { defineConfig } from 'wxt';
import { BrowserTarget } from './lib/browser-constants/browserTarget';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  // `favicon` is a Chrome-only manifest permission (powers the `_favicon`
  // endpoint) — Firefox's schema rejects it outright, so it's added
  // per-browser rather than unconditionally. See
  // src/lib/browser-constants/faviconUrl.ts for the matching runtime logic.
  manifest: (env) => ({
    permissions: [
      'bookmarks',
      'storage',
      'activeTab',
      ...(env.browser === BrowserTarget.FIREFOX ? [] : ['favicon']),
    ],
  }),
});
