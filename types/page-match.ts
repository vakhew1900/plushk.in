export const PageSelectorType = {
  CSS:   'css',
  META:  'meta',
  XPATH: 'xpath',
} as const;
export type PageSelectorType = typeof PageSelectorType[keyof typeof PageSelectorType];

export type CssSelector   = { type: typeof PageSelectorType.CSS;   selector: string   };
export type MetaSelector  = { type: typeof PageSelectorType.META;  attribute: string  };
export type XPathSelector = { type: typeof PageSelectorType.XPATH; expression: string };

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
