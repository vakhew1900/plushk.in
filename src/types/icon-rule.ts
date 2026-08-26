export const IconRuleBindingType = {
  URL:    'url',
  ALIAS:  'alias',
  DOMAIN: 'domain',
} as const;
export type IconRuleBindingType = typeof IconRuleBindingType[keyof typeof IconRuleBindingType];

export const IconSourceType = {
  STATIC: 'static',
  CSS:    'css',
  XPATH:  'xpath',
} as const;
export type IconSourceType = typeof IconSourceType[keyof typeof IconSourceType];

export type StaticIconSource = { type: typeof IconSourceType.STATIC; value: string };
export type CssIconSource    = { type: typeof IconSourceType.CSS;    value: string };
export type XPathIconSource  = { type: typeof IconSourceType.XPATH;  value: string };

export type IconSource = StaticIconSource | CssIconSource | XPathIconSource;

export type IconRule = {
  id: string;
  name: string;
  bindingType: IconRuleBindingType;
  bindingValue?: string;
  aliasId?: string;
  source: IconSource;
  enabled: boolean;
};

export const IconRuleField = {
  ID:            'id',
  NAME:          'name',
  BINDING_TYPE:  'bindingType',
  BINDING_VALUE: 'bindingValue',
  ALIAS_ID:      'aliasId',
  SOURCE:        'source',
  ENABLED:       'enabled',
} as const;
export type IconRuleField = typeof IconRuleField[keyof typeof IconRuleField];
