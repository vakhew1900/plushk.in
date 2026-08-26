import { describe, expect, it } from 'vitest';
import { IconRuleBindingType, IconSourceType, type IconRule } from '../../types/icon-rule';
import { findMatchingIconRule } from '../icon-rule-matcher';

function rule(overrides: Partial<IconRule> & Pick<IconRule, 'id' | 'bindingType'>): IconRule {
  return {
    name: overrides.id,
    source: { type: IconSourceType.STATIC, value: 'https://x/icon.png' },
    enabled: true,
    ...overrides,
  };
}

describe('findMatchingIconRule', () => {
  it('matches a domain rule by exact domain', () => {
    const rules = [rule({ id: 'r1', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'youtube.com' })];
    const result = findMatchingIconRule(rules, { url: 'https://youtube.com/watch?v=1', domain: 'youtube.com' });
    expect(result?.id).toBe('r1');
  });

  it('does not match a domain rule for a different domain', () => {
    const rules = [rule({ id: 'r1', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'youtube.com' })];
    const result = findMatchingIconRule(rules, { url: 'https://vimeo.com/1', domain: 'vimeo.com' });
    expect(result).toBeUndefined();
  });

  it('matches a url rule by prefix', () => {
    const rules = [rule({ id: 'r1', bindingType: IconRuleBindingType.URL, bindingValue: 'https://habr.com/ru/posts' })];
    const result = findMatchingIconRule(rules, { url: 'https://habr.com/ru/posts/12345', domain: 'habr.com' });
    expect(result?.id).toBe('r1');
  });

  it('picks the longest matching url prefix among several candidates', () => {
    const rules = [
      rule({ id: 'short', bindingType: IconRuleBindingType.URL, bindingValue: 'https://habr.com' }),
      rule({ id: 'long', bindingType: IconRuleBindingType.URL, bindingValue: 'https://habr.com/ru/posts' }),
    ];
    const result = findMatchingIconRule(rules, { url: 'https://habr.com/ru/posts/123', domain: 'habr.com' });
    expect(result?.id).toBe('long');
  });

  it('matches an alias rule by aliasId', () => {
    const rules = [rule({ id: 'r1', bindingType: IconRuleBindingType.ALIAS, aliasId: 'alias-1' })];
    const result = findMatchingIconRule(rules, { url: 'https://x.com/1', domain: 'x.com', aliasId: 'alias-1' });
    expect(result?.id).toBe('r1');
  });

  it('does not match an alias rule when no aliasId is resolved', () => {
    const rules = [rule({ id: 'r1', bindingType: IconRuleBindingType.ALIAS, aliasId: 'alias-1' })];
    const result = findMatchingIconRule(rules, { url: 'https://x.com/1', domain: 'x.com' });
    expect(result).toBeUndefined();
  });

  it('prefers a url match over an alias match for the same page', () => {
    const rules = [
      rule({ id: 'by-alias', bindingType: IconRuleBindingType.ALIAS, aliasId: 'alias-1' }),
      rule({ id: 'by-url', bindingType: IconRuleBindingType.URL, bindingValue: 'https://x.com' }),
    ];
    const result = findMatchingIconRule(rules, { url: 'https://x.com/1', domain: 'x.com', aliasId: 'alias-1' });
    expect(result?.id).toBe('by-url');
  });

  it('prefers an alias match over a domain match for the same page', () => {
    const rules = [
      rule({ id: 'by-domain', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'x.com' }),
      rule({ id: 'by-alias', bindingType: IconRuleBindingType.ALIAS, aliasId: 'alias-1' }),
    ];
    const result = findMatchingIconRule(rules, { url: 'https://x.com/1', domain: 'x.com', aliasId: 'alias-1' });
    expect(result?.id).toBe('by-alias');
  });

  it('ignores disabled rules', () => {
    const rules = [rule({ id: 'r1', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'youtube.com', enabled: false })];
    const result = findMatchingIconRule(rules, { url: 'https://youtube.com/1', domain: 'youtube.com' });
    expect(result).toBeUndefined();
  });

  it('returns undefined when nothing matches', () => {
    const result = findMatchingIconRule([], { url: 'https://x.com/1', domain: 'x.com' });
    expect(result).toBeUndefined();
  });
});
