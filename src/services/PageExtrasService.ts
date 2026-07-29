import { browser } from 'wxt/browser';
import { debugLog } from '../lib/debug-log';
import { PageExtractMessageType } from '../types/messages/page-extract-message';
import type { PageMatchGroup } from '../types/page-match';
import type { PageMeta } from '../types/page-meta';
import type { IPageExtrasService } from './interfaces/IPageExtrasService';

const EXTRACTION_TIMEOUT_MS = 800;
const CONTENT_SCRIPT_PATH = '/content-scripts/content.js';

function timeout(ms: number): Promise<undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
}

export class PageExtrasService implements IPageExtrasService {
  async extract(tabId: number, groups: PageMatchGroup[]): Promise<Partial<PageMeta> | undefined> {
    if (groups.length === 0) return undefined;

    try {
      await browser.scripting.executeScript({ target: { tabId }, files: [CONTENT_SCRIPT_PATH] });
      const response = await Promise.race([
        browser.tabs.sendMessage(tabId, { type: PageExtractMessageType.REQUEST, groups }),
        timeout(EXTRACTION_TIMEOUT_MS),
      ]);
      return response as Partial<PageMeta> | undefined;
    } catch (err) {
      debugLog('[page-extras] extraction failed, falling back to base meta', err);
      return undefined;
    }
  }
}
