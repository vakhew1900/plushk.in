import type { PageMeta } from '../types/page-meta';
import type { IPageMetaFiller, PageMetaFillerInput } from './interfaces/IPageMetaFiller';

/**
 * Base `url`/`domain`/`title` only — cheap and DOM-free, safe to call from
 * any context (`onCreated`, quick-save). Shared by every `PageMeta`
 * construction site instead of each building it inline. Extras/DOM
 * enrichment is a separate, optional layer on top (`IPageExtrasService`),
 * only usable where a tab is available (quick-save/popup) — see RULE-5.
 */
export class PageMetaFiller implements IPageMetaFiller {
  async fillPageMeta({ url = '', title }: PageMetaFillerInput): Promise<PageMeta> {
    return {
      url,
      domain: url ? new URL(url).hostname : '',
      title,
    };
  }
}
