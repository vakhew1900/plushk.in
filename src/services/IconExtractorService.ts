import { applyIconSelector } from '../lib/icon-extractor';
import type { CssIconSource, XPathIconSource } from '../types/icon-rule';
import type { IIconExtractorService } from './interfaces/IIconExtractorService';

export class IconExtractorService implements IIconExtractorService {
  constructor(private readonly doc: Document = window.document) {}

  extract(source: CssIconSource | XPathIconSource): string | undefined {
    return applyIconSelector(source, this.doc);
  }
}
