import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PageMeta } from '../../types/page-meta';
import { IconRuleBindingType, IconSourceType, type IconRule } from '../../types/icon-rule';
import type { IconBookmark } from '../../types/icon-bookmark';
import type { IIconRuleRepository } from '../../repository/interfaces/IIconRuleRepository';
import type { IIconBookmarkRepository } from '../../repository/interfaces/IIconBookmarkRepository';
import type { IIconExtrasService } from '../interfaces/IIconExtrasService';
import { IconLinkService } from '../IconLinkService';

const resolveFaviconUrlMock = vi.hoisted(() => vi.fn());
vi.mock('../../lib/browser-constants/faviconUrl', () => ({
  resolveFaviconUrl: resolveFaviconUrlMock,
}));

class FakeIconRuleRepository implements IIconRuleRepository {
  constructor(public rules: IconRule[] = []) {}
  async getAll(): Promise<IconRule[]> { return this.rules; }
  async getById(id: string): Promise<IconRule | undefined> { return this.rules.find((r) => r.id === id); }
  async save(rule: IconRule): Promise<void> { this.rules = [...this.rules.filter((r) => r.id !== rule.id), rule]; }
  async remove(id: string): Promise<void> { this.rules = this.rules.filter((r) => r.id !== id); }
}

class FakeIconBookmarkRepository implements IIconBookmarkRepository {
  constructor(public rows: IconBookmark[] = []) {}
  async getAll(): Promise<IconBookmark[]> { return this.rows; }
  async getById(id: string): Promise<IconBookmark | undefined> { return this.rows.find((r) => r.bookmarkId === id); }
  async save(row: IconBookmark): Promise<void> { this.rows = [...this.rows.filter((r) => r.bookmarkId !== row.bookmarkId), row]; }
  async remove(id: string): Promise<void> { this.rows = this.rows.filter((r) => r.bookmarkId !== id); }
}

function fakeExtras(result: string | undefined) {
  const extract = vi.fn(async () => result);
  const service: IIconExtrasService = { extract };
  return { service, extract };
}

const meta: PageMeta = { url: 'https://youtube.com/watch?v=1', domain: 'youtube.com', title: 'A video' };

beforeEach(() => {
  resolveFaviconUrlMock.mockReset();
  resolveFaviconUrlMock.mockReturnValue('https://fallback/favicon.png');
});

describe('IconLinkService.resolveForSave', () => {
  it('resolves a static-source rule match without touching the tab', async () => {
    const rule: IconRule = {
      id: 'r1', name: 'YouTube', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'youtube.com',
      source: { type: IconSourceType.STATIC, value: 'https://x/icon.png' }, enabled: true,
    };
    const extras = fakeExtras(undefined);
    const service = new IconLinkService(new FakeIconRuleRepository([rule]), new FakeIconBookmarkRepository(), extras.service);

    const result = await service.resolveForSave(meta, undefined, 7);

    expect(result).toEqual({ type: 'rule', url: 'https://x/icon.png', ruleName: 'YouTube' });
    expect(extras.extract).not.toHaveBeenCalled();
  });

  it('resolves a css-source rule match via the content script', async () => {
    const rule: IconRule = {
      id: 'r1', name: 'YouTube', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'youtube.com',
      source: { type: IconSourceType.CSS, value: '.logo img' }, enabled: true,
    };
    const extras = fakeExtras('https://cdn/logo.png');
    const service = new IconLinkService(new FakeIconRuleRepository([rule]), new FakeIconBookmarkRepository(), extras.service);

    const result = await service.resolveForSave(meta, undefined, 7);

    expect(result).toEqual({ type: 'rule', url: 'https://cdn/logo.png', ruleName: 'YouTube' });
    expect(extras.extract).toHaveBeenCalledWith(7, rule.source);
  });

  it('falls back to the default favicon when the matched rule\'s source resolves to nothing', async () => {
    const rule: IconRule = {
      id: 'r1', name: 'YouTube', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'youtube.com',
      source: { type: IconSourceType.CSS, value: '.missing' }, enabled: true,
    };
    const service = new IconLinkService(new FakeIconRuleRepository([rule]), new FakeIconBookmarkRepository(), fakeExtras(undefined).service);

    expect(await service.resolveForSave(meta, undefined, 7)).toEqual({ type: 'default', url: 'https://fallback/favicon.png' });
  });

  it('falls back to the default favicon when no rule matches', async () => {
    const service = new IconLinkService(new FakeIconRuleRepository([]), new FakeIconBookmarkRepository(), fakeExtras(undefined).service);

    expect(await service.resolveForSave(meta, undefined, 7)).toEqual({ type: 'default', url: 'https://fallback/favicon.png' });
    expect(resolveFaviconUrlMock).toHaveBeenCalledWith(meta.url);
  });
});

describe('IconLinkService.resolveForBookmark', () => {
  it('returns the cached icon url for a saved bookmark', async () => {
    const cache = new FakeIconBookmarkRepository([{ bookmarkId: 'b1', iconUrl: 'https://cached/icon.png' }]);
    const service = new IconLinkService(new FakeIconRuleRepository(), cache, fakeExtras(undefined).service);

    expect(await service.resolveForBookmark('b1', meta.url)).toEqual({ type: 'rule', url: 'https://cached/icon.png' });
  });

  it('falls back to the default favicon when nothing is cached', async () => {
    const service = new IconLinkService(new FakeIconRuleRepository(), new FakeIconBookmarkRepository(), fakeExtras(undefined).service);

    expect(await service.resolveForBookmark('missing', meta.url)).toEqual({ type: 'default', url: 'https://fallback/favicon.png' });
  });
});
