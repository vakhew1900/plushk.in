import { describe, expect, it, vi } from 'vitest';
import type {
  AndRule,
  NotRule,
  OrRule,
  RegexRule,
  RuleNode,
  TermRule,
  TermsRule,
  WildcardRule,
} from '../../../types/rule';
import { RuleType } from '../../../types/rule';
import type { RuleVisitor } from '../rule-visitor';
import { visitRule } from '../rule-visitor';

function createMockVisitor() {
  return {
    and: vi.fn(() => 'and-result'),
    or: vi.fn(() => 'or-result'),
    not: vi.fn(() => 'not-result'),
    term: vi.fn(() => 'term-result'),
    terms: vi.fn(() => 'terms-result'),
    regex: vi.fn(() => 'regex-result'),
    wildcard: vi.fn(() => 'wildcard-result'),
  } satisfies RuleVisitor<string>;
}

function otherMethodNames(called: keyof RuleVisitor<string>): (keyof RuleVisitor<string>)[] {
  return (['and', 'or', 'not', 'term', 'terms', 'regex', 'wildcard'] as const).filter((m) => m !== called);
}

describe('visitRule', () => {
  it('dispatches an AndRule to visitor.and with the rule itself', () => {
    const visitor = createMockVisitor();
    const rule: AndRule = { type: RuleType.AND, nodes: [] };

    const result = visitRule(rule, visitor);

    expect(visitor.and).toHaveBeenCalledExactlyOnceWith(rule);
    expect(result).toBe('and-result');
    otherMethodNames('and').forEach((m) => expect(visitor[m]).not.toHaveBeenCalled());
  });

  it('dispatches an OrRule to visitor.or with the rule itself', () => {
    const visitor = createMockVisitor();
    const rule: OrRule = { type: RuleType.OR, nodes: [] };

    const result = visitRule(rule, visitor);

    expect(visitor.or).toHaveBeenCalledExactlyOnceWith(rule);
    expect(result).toBe('or-result');
    otherMethodNames('or').forEach((m) => expect(visitor[m]).not.toHaveBeenCalled());
  });

  it('dispatches a NotRule to visitor.not with the rule itself', () => {
    const visitor = createMockVisitor();
    const rule: NotRule = { type: RuleType.NOT, nodes: [] };

    const result = visitRule(rule, visitor);

    expect(visitor.not).toHaveBeenCalledExactlyOnceWith(rule);
    expect(result).toBe('not-result');
    otherMethodNames('not').forEach((m) => expect(visitor[m]).not.toHaveBeenCalled());
  });

  it('dispatches a TermRule to visitor.term with the rule itself', () => {
    const visitor = createMockVisitor();
    const rule: TermRule = { type: RuleType.TERM, field: 'domain', value: 'youtube.com' };

    const result = visitRule(rule, visitor);

    expect(visitor.term).toHaveBeenCalledExactlyOnceWith(rule);
    expect(result).toBe('term-result');
    otherMethodNames('term').forEach((m) => expect(visitor[m]).not.toHaveBeenCalled());
  });

  it('dispatches a TermsRule to visitor.terms with the rule itself', () => {
    const visitor = createMockVisitor();
    const rule: TermsRule = { type: RuleType.TERMS, field: 'tags', values: ['a', 'b'] };

    const result = visitRule(rule, visitor);

    expect(visitor.terms).toHaveBeenCalledExactlyOnceWith(rule);
    expect(result).toBe('terms-result');
    otherMethodNames('terms').forEach((m) => expect(visitor[m]).not.toHaveBeenCalled());
  });

  it('dispatches a RegexRule to visitor.regex with the rule itself', () => {
    const visitor = createMockVisitor();
    const rule: RegexRule = { type: RuleType.REGEX, field: 'url', pattern: '.*watch.*' };

    const result = visitRule(rule, visitor);

    expect(visitor.regex).toHaveBeenCalledExactlyOnceWith(rule);
    expect(result).toBe('regex-result');
    otherMethodNames('regex').forEach((m) => expect(visitor[m]).not.toHaveBeenCalled());
  });

  it('dispatches a WildcardRule to visitor.wildcard with the rule itself', () => {
    const visitor = createMockVisitor();
    const rule: WildcardRule = { type: RuleType.WILDCARD, field: 'domain', pattern: '*.edu' };

    const result = visitRule(rule, visitor);

    expect(visitor.wildcard).toHaveBeenCalledExactlyOnceWith(rule);
    expect(result).toBe('wildcard-result');
    otherMethodNames('wildcard').forEach((m) => expect(visitor[m]).not.toHaveBeenCalled());
  });

  it('recurses into nested rules via the same visitor', () => {
    const visited: RuleNode[] = [];
    const collectingVisitor: RuleVisitor<void> = {
      and: (r) => { visited.push(r); r.nodes.forEach((sub) => visitRule(sub, collectingVisitor)); },
      or: (r) => { visited.push(r); r.nodes.forEach((sub) => visitRule(sub, collectingVisitor)); },
      not: (r) => { visited.push(r); r.nodes.forEach((sub) => visitRule(sub, collectingVisitor)); },
      term: (r) => { visited.push(r); },
      terms: (r) => { visited.push(r); },
      regex: (r) => { visited.push(r); },
      wildcard: (r) => { visited.push(r); },
    };

    const rule: AndRule = {
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.OR, nodes: [{ type: RuleType.TERM, field: 'tags', value: 'tutorial' }] },
      ],
    };

    visitRule(rule, collectingVisitor);

    expect(visited).toHaveLength(4);
    expect(visited.map((r) => r.type)).toEqual([RuleType.AND, RuleType.TERM, RuleType.OR, RuleType.TERM]);
  });
});
