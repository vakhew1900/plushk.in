import { findMatchingIconRule } from '../lib/icon-rule-matcher';
import { resolveFaviconUrl } from '../lib/browser-constants/faviconUrl';
import { IconSourceType, type IconSource } from '../types/icon-rule';
import type { PageMeta } from '../types/page-meta';
import type { IIconRuleRepository } from '../repository/interfaces/IIconRuleRepository';
import type { IIconBookmarkRepository } from '../repository/interfaces/IIconBookmarkRepository';
import type { IIconExtrasService } from './interfaces/IIconExtrasService';
import type { IIconLinkService, IconLinkResult } from './interfaces/IIconLinkService';

export class IconLinkService implements IIconLinkService {
  constructor(
    private readonly iconRuleRepository: IIconRuleRepository,
    private readonly iconBookmarkRepository: IIconBookmarkRepository,
    private readonly iconExtrasService: IIconExtrasService,
  ) {}

  async resolveForSave(meta: PageMeta, aliasId: string | undefined, tabId: number): Promise<IconLinkResult> {
    const rules = await this.iconRuleRepository.getAll();
    const matched = findMatchingIconRule(rules, { url: meta.url, domain: meta.domain, aliasId });

    if (matched) {
      const url = await this.resolveSourceUrl(matched.source, tabId);
      if (url) return { type: 'rule', url, ruleName: matched.name };
    }

    return { type: 'default', url: resolveFaviconUrl(meta.url) };
  }

  async resolveForBookmark(bookmarkId: string, url: string): Promise<IconLinkResult> {
    const cached = await this.iconBookmarkRepository.getById(bookmarkId);
    if (cached) return { type: 'rule', url: cached.iconUrl };

    return { type: 'default', url: resolveFaviconUrl(url) };
  }

  private async resolveSourceUrl(source: IconSource, tabId: number): Promise<string | undefined> {
    if (source.type === IconSourceType.STATIC) return source.value || undefined;
    return this.iconExtrasService.extract(tabId, source);
  }
}
