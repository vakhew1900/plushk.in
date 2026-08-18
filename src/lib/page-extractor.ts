import { PageSelectorType, type PageMatchGroup, type PageSelector } from '../types/page-match';
import { PageMetaField, type PageMeta } from '../types/page-meta';

type ExtractableStringKey = Exclude<keyof PageMeta, 'url' | 'domain' | 'tags' | 'extras'>;

const EXTRACTABLE_STRING_FIELDS: ReadonlySet<string> = new Set<ExtractableStringKey>([
  PageMetaField.TITLE,
  PageMetaField.DESCRIPTION,
  PageMetaField.AUTHOR,
  PageMetaField.LANGUAGE,
  PageMetaField.OG_TYPE,
  PageMetaField.PUBLISHED_AT,
  PageMetaField.CONTENT,
]);

function applyCssSelector(selector: string, doc: Document): string | undefined {
  const el = doc.querySelector(selector);
  if (!el) return undefined;
  // meta elements store their value in the content attribute
  if (el.tagName === 'META') {
    return el.getAttribute('content') ?? undefined;
  }
  return el.textContent?.trim() || undefined;
}

function applyMetaSelector(attribute: string, doc: Document): string | undefined {
  const byName     = doc.querySelector(`meta[name="${attribute}"]`);
  const byProperty = doc.querySelector(`meta[property="${attribute}"]`);
  return (byName ?? byProperty)?.getAttribute('content') ?? undefined;
}

function applyXPathSelector(expression: string, doc: Document): string | undefined {
  const result = doc.evaluate(expression, doc, null, XPathResult.STRING_TYPE, null);
  return result.stringValue || undefined;
}

export function applySelector(selector: PageSelector, doc: Document): string | undefined {
  switch (selector.type) {
    case PageSelectorType.CSS:   return applyCssSelector(selector.value, doc);
    case PageSelectorType.META:  return applyMetaSelector(selector.value, doc);
    case PageSelectorType.XPATH: return applyXPathSelector(selector.value, doc);
  }
}

export function buildPartialMeta(group: PageMatchGroup, doc: Document): Partial<PageMeta> {
  const meta: Partial<PageMeta> = {
    url:    doc.URL,
    domain: new URL(doc.URL).hostname,
  };
  const extras: Record<string, string | string[]> = {};

  for (const [name, pageMatch] of group.pageMatches) {
    const raw = applySelector(pageMatch.selector, doc);
    if (raw === undefined) continue;

    if (name === PageMetaField.TAGS) {
      meta.tags = raw.split(',').map(t => t.trim()).filter(Boolean);
    } else if (EXTRACTABLE_STRING_FIELDS.has(name)) {
      meta[name as ExtractableStringKey] = raw;
    } else {
      extras[name] = raw;
    }
  }

  if (Object.keys(extras).length > 0) {
    meta.extras = extras;
  }

  return meta;
}
