export const PageSelectorType = {
  CSS:   'css',
  META:  'meta',
  XPATH: 'xpath',
} as const;
export type PageSelectorType = typeof PageSelectorType[keyof typeof PageSelectorType];

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
  alias_name: string;
  pageMatches: Map<string, PageMatch>;
};

export const PageMatchGroupField = {
  ID:           'id',
  ALIAS_NAME:   'alias_name',
  PAGE_MATCHES: 'pageMatches',
} as const;
export type PageMatchGroupField = typeof PageMatchGroupField[keyof typeof PageMatchGroupField];
