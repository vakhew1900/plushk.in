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
      // Lets `PageExtrasService` inject `content.ts` on demand into the
      // active tab (quick-save flow only) via `browser.scripting.executeScript`.
      // Paired with `activeTab` — no `<all_urls>`/`host_permissions` needed,
      // since `content.ts` is registered with `registration: 'runtime'` and
      // an empty `matches`. See RULE-5 in specs/tasks.md.
      'scripting',
      ...(env.browser === BrowserTarget.FIREFOX ? [] : ['favicon']),
    ],
  }),
});
