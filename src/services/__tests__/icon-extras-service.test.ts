import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IconExtractMessageType } from '../../types/messages/icon-extract-message';
import { IconSourceType, type CssIconSource } from '../../types/icon-rule';
import { IconExtrasService } from '../IconExtrasService';

const scriptingApi = vi.hoisted(() => ({
  executeScript: vi.fn(),
}));
const tabsApi = vi.hoisted(() => ({
  sendMessage: vi.fn(),
}));

vi.mock('wxt/browser', () => ({
  browser: { scripting: scriptingApi, tabs: tabsApi },
}));

const source: CssIconSource = { type: IconSourceType.CSS, value: '.logo img' };

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('IconExtrasService.extract', () => {
  it('injects the content script and returns the resolved icon url', async () => {
    scriptingApi.executeScript.mockResolvedValueOnce(undefined);
    tabsApi.sendMessage.mockResolvedValueOnce('https://cdn.example.com/logo.png');
    const service = new IconExtrasService();

    const result = await service.extract(7, source);

    expect(scriptingApi.executeScript).toHaveBeenCalledWith({
      target: { tabId: 7 },
      files: ['/content-scripts/content.js'],
    });
    expect(tabsApi.sendMessage).toHaveBeenCalledWith(7, { type: IconExtractMessageType.REQUEST, source });
    expect(result).toBe('https://cdn.example.com/logo.png');
  });

  it('returns undefined when injection fails (e.g. a restricted page)', async () => {
    scriptingApi.executeScript.mockRejectedValueOnce(new Error('Cannot access a chrome:// URL'));
    const service = new IconExtrasService();

    expect(await service.extract(7, source)).toBeUndefined();
  });

  it('returns undefined when the content script does not respond in time', async () => {
    vi.useFakeTimers();
    scriptingApi.executeScript.mockResolvedValueOnce(undefined);
    tabsApi.sendMessage.mockReturnValueOnce(new Promise(() => {}));
    const service = new IconExtrasService();

    const resultPromise = service.extract(7, source);
    await vi.runAllTimersAsync();

    expect(await resultPromise).toBeUndefined();
  });
});
