import type { PageMeta } from '../../types/page-meta';

export interface PageMetaFillerInput {
  url?: string;
  title: string;
}

export interface PageMetaFillerResult {
  meta: PageMeta;
  // The resolved DomainAlias's id, if the page's domain matched one — used
  // to look up the PageMatchGroup scoped to that alias (RULE-12). Separate
  // from `meta.alias` (the alias's display name, used by the rule engine).
  aliasId?: string;
}

export interface IPageMetaFiller {
  fillPageMeta(input: PageMetaFillerInput): Promise<PageMetaFillerResult>;
}
