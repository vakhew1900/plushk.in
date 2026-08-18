import { buildPartialMeta } from '../lib/page-extractor';
import type { PageMatchGroup } from '../types/page-match';
import type { PageMeta } from '../types/page-meta';
import type { IPageExtractorService } from './interfaces/IPageExtractorService';

export class PageExtractorService implements IPageExtractorService {
  constructor(private readonly doc: Document = window.document) {}

  extract(group: PageMatchGroup): Partial<PageMeta> {
    return buildPartialMeta(group, this.doc);
  }
}
