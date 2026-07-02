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

export type PageMatchGroup = {
  id: string;
  alias_name: string;
  pageMatches: Map<string, PageMatch>;
};
