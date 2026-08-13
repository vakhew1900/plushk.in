import type { IDomainAliasRepository } from '../repository/interfaces/IDomainAliasRepository';
import type { DomainAlias } from '../types/domain-alias';
import type { IPageMetaFiller, PageMetaFillerInput, PageMetaFillerResult } from './interfaces/IPageMetaFiller';

/**
 * Base `url`/`domain`/`alias`/`title` only — cheap and DOM-free, safe to call
 * from any context (`onCreated`, quick-save). Shared by every `PageMeta`
 * construction site instead of each building it inline. Extras/DOM
 * enrichment is a separate, optional layer on top (`IPageExtrasService`),
 * only usable where a tab is available (quick-save/popup) — see RULE-5.
 */
export class PageMetaFiller implements IPageMetaFiller {
  constructor(private readonly domainAliasRepository: IDomainAliasRepository) {}

  async fillPageMeta({ url = '', title }: PageMetaFillerInput): Promise<PageMetaFillerResult> {
    const domain = url ? new URL(url).hostname : '';
    const domainAlias = domain ? await this.resolveDomainAlias(domain) : undefined;

    return {
      meta: {
        url,
        domain,
        alias: domainAlias?.name,
        title,
      },
      aliasId: domainAlias?.id,
    };
  }

  private async resolveDomainAlias(domain: string): Promise<DomainAlias | undefined> {
    const aliases = await this.domainAliasRepository.getAll();
    return aliases.find((a) => a.domain_names.includes(domain));
  }
}
