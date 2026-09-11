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

// meta elements store their value in the content attribute
function elementText(el: Element): string | undefined {
  if (el.tagName === 'META') {
    return el.getAttribute('content') ?? undefined;
  }
  return el.textContent?.trim() || undefined;
}

function applyCssSelector(selector: string, doc: Document): string[] | undefined {
  const values = Array.from(doc.querySelectorAll(selector))
    .map((el) => elementText(el))
    .filter((v): v is string => v !== undefined);
  return values.length > 0 ? values : undefined;
}

function applyMetaSelector(attribute: string, doc: Document): string | undefined {
  const byName     = doc.querySelector(`meta[name="${attribute}"]`);
  const byProperty = doc.querySelector(`meta[property="${attribute}"]`);
  return (byName ?? byProperty)?.getAttribute('content') ?? undefined;
}

function applyXPathSelector(expression: string, doc: Document): string[] | undefined {
  const result = doc.evaluate(expression, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  const values: string[] = [];
  for (let i = 0; i < result.snapshotLength; i++) {
    const text = result.snapshotItem(i)?.textContent?.trim();
    if (text) values.push(text);
  }
  return values.length > 0 ? values : undefined;
}

export function applySelector(selector: PageSelector, doc: Document): string | string[] | undefined {
  switch (selector.type) {
    case PageSelectorType.CSS:   return applyCssSelector(selector.value, doc);
    case PageSelectorType.META:  return applyMetaSelector(selector.value, doc);
    case PageSelectorType.XPATH: return applyXPathSelector(selector.value, doc);
  }
}

// A <meta> selector still gives one comma-separated string (split here); a
// CSS/XPath selector already gives one DOM element per tag (used as-is).
function toTagArray(raw: string | string[]): string[] {
  const parts = Array.isArray(raw) ? raw : raw.split(',');
  return parts.map((t) => t.trim()).filter(Boolean);
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
      meta.tags = toTagArray(raw);
    } else if (EXTRACTABLE_STRING_FIELDS.has(name)) {
      // These PageMeta fields are plain strings — a CSS/XPath multi-match
      // just takes its first (non-empty) element.
      meta[name as ExtractableStringKey] = Array.isArray(raw) ? raw[0] : raw;
    } else {
      extras[name] = raw;
    }
  }

  if (Object.keys(extras).length > 0) {
    meta.extras = extras;
  }

  return meta;
}
