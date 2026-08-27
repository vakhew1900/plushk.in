import { describe, expect, it } from 'vitest';
import { IconRuleBindingType, IconSourceType, type IconRule } from '../../../types/icon-rule';
import { isValidIconRule } from '../icon-rule';

function rule(overrides: Partial<IconRule> = {}): IconRule {
  return {
    id: 'r1',
    name: 'YouTube',
    bindingType: IconRuleBindingType.DOMAIN,
    bindingValue: 'youtube.com',
    source: { type: IconSourceType.STATIC, value: 'https://x/icon.png' },
    enabled: true,
    ...overrides,
  };
}

describe('isValidIconRule', () => {
  it('accepts a well-formed domain rule', () => {
    expect(isValidIconRule(rule())).toBe(true);
  });

  it('rejects an empty name', () => {
    expect(isValidIconRule(rule({ name: '' }))).toBe(false);
  });

  it('rejects an empty source value', () => {
    expect(isValidIconRule(rule({ source: { type: IconSourceType.STATIC, value: '  ' } }))).toBe(false);
  });

  it('accepts a well-formed url rule', () => {
    expect(isValidIconRule(rule({ bindingType: IconRuleBindingType.URL, bindingValue: 'https://habr.com/ru' }))).toBe(true);
  });

  it('rejects a url rule with no bindingValue', () => {
    expect(isValidIconRule(rule({ bindingType: IconRuleBindingType.URL, bindingValue: undefined }))).toBe(false);
  });

  it('rejects a domain rule that also carries an aliasId', () => {
    expect(isValidIconRule(rule({ aliasId: 'alias-1' }))).toBe(false);
  });

  it('accepts a well-formed alias rule', () => {
    expect(isValidIconRule(rule({ bindingType: IconRuleBindingType.ALIAS, bindingValue: undefined, aliasId: 'alias-1' }))).toBe(true);
  });

  it('rejects an alias rule with no aliasId', () => {
    expect(isValidIconRule(rule({ bindingType: IconRuleBindingType.ALIAS, bindingValue: undefined, aliasId: undefined }))).toBe(false);
  });

  it('rejects an alias rule that also carries a bindingValue', () => {
    expect(isValidIconRule(rule({ bindingType: IconRuleBindingType.ALIAS, aliasId: 'alias-1' }))).toBe(false);
  });
});
