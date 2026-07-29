import type { PageMeta } from '../../types/page-meta';

export interface PageMetaFillerInput {
  url?: string;
  title: string;
}

export interface IPageMetaFiller {
  fillPageMeta(input: PageMetaFillerInput): Promise<PageMeta>;
}
