import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PageExtractMessageType } from '../../types/messages/page-extract-message';
import type { PageMatchGroup } from '../../types/page-match';
import { PageExtrasService } from '../PageExtrasService';

const scriptingApi = vi.hoisted(() => ({
  executeScript: vi.fn(),
}));
const tabsApi = vi.hoisted(() => ({
  sendMessage: vi.fn(),
}));

vi.mock('wxt/browser', () => ({
  browser: { scripting: scriptingApi, tabs: tabsApi },
}));

const groups: PageMatchGroup[] = [{ id: 'g1', aliasId: 'reddit-alias-id', pageMatches: new Map() }];

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('PageExtrasService.extract', () => {
  it('returns undefined without injecting anything when there are no saved groups', async () => {
    const service = new PageExtrasService();

    const result = await service.extract(1, []);

    expect(result).toBeUndefined();
    expect(scriptingApi.executeScript).not.toHaveBeenCalled();
  });

  it('injects the content script and returns the merged extraction result', async () => {
    scriptingApi.executeScript.mockResolvedValueOnce(undefined);
    tabsApi.sendMessage.mockResolvedValueOnce({ extras: { subreddit: 'programming' } });
    const service = new PageExtrasService();

    const result = await service.extract(7, groups);

    expect(scriptingApi.executeScript).toHaveBeenCalledWith({
      target: { tabId: 7 },
      files: ['/content-scripts/content.js'],
    });
    expect(tabsApi.sendMessage).toHaveBeenCalledWith(7, { type: PageExtractMessageType.REQUEST, groups });
    expect(result).toEqual({ extras: { subreddit: 'programming' } });
  });

  it('returns undefined when injection fails (e.g. a restricted page)', async () => {
    scriptingApi.executeScript.mockRejectedValueOnce(new Error('Cannot access a chrome:// URL'));
    const service = new PageExtrasService();

    const result = await service.extract(7, groups);

    expect(result).toBeUndefined();
  });

  it('returns undefined when the content script does not respond in time', async () => {
    vi.useFakeTimers();
    scriptingApi.executeScript.mockResolvedValueOnce(undefined);
    tabsApi.sendMessage.mockReturnValueOnce(new Promise(() => {}));
    const service = new PageExtrasService();

    const resultPromise = service.extract(7, groups);
    await vi.runAllTimersAsync();

    expect(await resultPromise).toBeUndefined();
  });
});
