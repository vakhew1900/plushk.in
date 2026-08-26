import type { CssIconSource, XPathIconSource } from '../../types/icon-rule';

export interface IIconExtractorService {
  extract(source: CssIconSource | XPathIconSource): string | undefined;
}
