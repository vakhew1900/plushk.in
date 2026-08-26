import { IconSourceType, type CssIconSource, type XPathIconSource } from '../types/icon-rule';

type DomIconSource = CssIconSource | XPathIconSource;

function findFirstCssElement(selector: string, doc: Document): Element | undefined {
  return doc.querySelector(selector) ?? undefined;
}

function findFirstXPathElement(expression: string, doc: Document): Element | undefined {
  const result = doc.evaluate(expression, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return (result.singleNodeValue as Element | null) ?? undefined;
}

// <meta> tags are deliberately not special-cased here (unlike page-extractor.ts's
// applyCssSelector) — icon rules only ever read src/href, see RULE-13.
function readIconAttribute(el: Element): string | undefined {
  return el.getAttribute('src') ?? el.getAttribute('href') ?? undefined;
}

function toAbsoluteUrl(value: string, doc: Document): string {
  try {
    return new URL(value, doc.baseURI).href;
  } catch {
    return value;
  }
}

export function applyIconSelector(selector: DomIconSource, doc: Document): string | undefined {
  const el = selector.type === IconSourceType.CSS
    ? findFirstCssElement(selector.value, doc)
    : findFirstXPathElement(selector.value, doc);
  if (!el) return undefined;

  const raw = readIconAttribute(el);
  if (!raw) return undefined;

  return toAbsoluteUrl(raw, doc);
}
