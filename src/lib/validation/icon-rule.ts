import { IconRuleBindingType, type IconRule } from '../../types/icon-rule';
import { hasValidName } from './named-entity';

// XOR between bindingValue/aliasId per binding type (RULE-13) — a rule bound
// to `alias` must carry an aliasId and no bindingValue, and vice versa for
// `url`/`domain`. A non-empty source value is required regardless of type —
// an IconRule that can never resolve to anything isn't worth persisting.
export function isValidIconRule(rule: IconRule): boolean {
  if (!hasValidName(rule.name)) return false;
  if (!rule.source.value.trim()) return false;

  switch (rule.bindingType) {
    case IconRuleBindingType.ALIAS:
      return Boolean(rule.aliasId) && rule.bindingValue === undefined;
    case IconRuleBindingType.URL:
    case IconRuleBindingType.DOMAIN:
      return Boolean(rule.bindingValue?.trim()) && rule.aliasId === undefined;
  }
}
