export const PageSelectorType = {
  CSS:   'css',
  META:  'meta',
  XPATH: 'xpath',
} as const;
export type PageSelectorType = typeof PageSelectorType[keyof typeof PageSelectorType];

// CSS/XPath always collect every matching element (querySelectorAll /
// ORDERED_NODE_SNAPSHOT_TYPE, see page-extractor.ts) — a <meta> selector
// stays single-value, it targets one specific tag by name/property.
export type CssSelector   = { type: typeof PageSelectorType.CSS;   value: string };
export type MetaSelector  = { type: typeof PageSelectorType.META;  value: string };
export type XPathSelector = { type: typeof PageSelectorType.XPATH; value: string };

export type PageSelector = CssSelector | MetaSelector | XPathSelector;

export type PageMatch = {
  name: string;
  selector: PageSelector;
};

export const PageMatchField = {
  NAME:     'name',
  SELECTOR: 'selector',
} as const;
export type PageMatchField = typeof PageMatchField[keyof typeof PageMatchField];

export type PageMatchGroup = {
  id: string;
  aliasId: string;
  pageMatches: Map<string, PageMatch>;
};

export const PageMatchGroupField = {
  ID:           'id',
  ALIAS_ID:     'aliasId',
  PAGE_MATCHES: 'pageMatches',
} as const;
export type PageMatchGroupField = typeof PageMatchGroupField[keyof typeof PageMatchGroupField];
