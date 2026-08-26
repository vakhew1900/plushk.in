import { IconRuleBindingType, type IconRule } from '../types/icon-rule';

export interface IconRuleMatchParams {
  url: string;
  domain: string;
  /** Id of the `DomainAlias` resolved for `domain`, if any — see IIconLinkService. */
  aliasId?: string;
}

// Specificity across binding types is implicit (no explicit `priority` field,
// see RULE-13): url > alias > domain. Within `url`, the longest matching
// prefix wins (e.g. "/ru/posts" beats "/" for the same page).
export function findMatchingIconRule(rules: IconRule[], params: IconRuleMatchParams): IconRule | undefined {
  const enabled = rules.filter((r) => r.enabled);

  const urlMatches = enabled.filter(
    (r) => r.bindingType === IconRuleBindingType.URL && r.bindingValue !== undefined && params.url.startsWith(r.bindingValue),
  );
  if (urlMatches.length > 0) {
    return urlMatches.reduce((longest, r) => (r.bindingValue!.length > longest.bindingValue!.length ? r : longest));
  }

  if (params.aliasId !== undefined) {
    const aliasMatch = enabled.find((r) => r.bindingType === IconRuleBindingType.ALIAS && r.aliasId === params.aliasId);
    if (aliasMatch) return aliasMatch;
  }

  return enabled.find((r) => r.bindingType === IconRuleBindingType.DOMAIN && r.bindingValue === params.domain);
}
