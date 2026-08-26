import { browser } from 'wxt/browser';
import { debugLog } from '../lib/debug-log';
import { IconExtractMessageType } from '../types/messages/icon-extract-message';
import type { CssIconSource, XPathIconSource } from '../types/icon-rule';
import type { IIconExtrasService } from './interfaces/IIconExtrasService';

const EXTRACTION_TIMEOUT_MS = 800;
const CONTENT_SCRIPT_PATH = '/content-scripts/content.js';

function timeout(ms: number): Promise<undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
}

export class IconExtrasService implements IIconExtrasService {
  async extract(tabId: number, source: CssIconSource | XPathIconSource): Promise<string | undefined> {
    try {
      await browser.scripting.executeScript({ target: { tabId }, files: [CONTENT_SCRIPT_PATH] });
      const response = (await Promise.race([
        browser.tabs.sendMessage(tabId, { type: IconExtractMessageType.REQUEST, source }),
        timeout(EXTRACTION_TIMEOUT_MS),
      ])) as string | undefined;
      return response;
    } catch (err) {
      debugLog('[icon-extras] extraction failed, falling back to default favicon', err);
      return undefined;
    }
  }
}
