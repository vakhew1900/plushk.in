import { browser } from 'wxt/browser';
import { PageExtractorService } from '@/services/PageExtractorService';
import { isPageExtractRequestMessage } from '@/types/messages/page-extract-message';
import type { PageMeta } from '@/types/page-meta';

export default defineContentScript({
  // No static matches — this script is never auto-injected. Only quick-save
  // (RULE-3, via `PageExtrasService`) injects it on demand into the active
  // tab through `browser.scripting.executeScript`, scoped by `activeTab`.
  // See RULE-5 in specs/tasks.md for why the native `bookmarks.onCreated`
  // flow doesn't get this (no tab access without a broader host permission).
  matches: [],
  registration: 'runtime',
  main() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- returning a Promise here is intentional: it's how browser.runtime.onMessage delivers an async response (see OnMessageListenerAsync in the webextension-polyfill types).
    browser.runtime.onMessage.addListener((message: unknown) => {
      if (!isPageExtractRequestMessage(message)) return;

      return (async () => {
        const extractor = new PageExtractorService();
        const merged: Partial<PageMeta> = {};
        for (const group of message.groups) {
          Object.assign(merged, extractor.extract(group));
        }
        return merged;
      })();
    });
  },
});
