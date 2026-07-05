import type { AndRule, NotRule, OrRule, RegexRule, RuleNode, TermRule, TermsRule, WildcardRule } from '../../types/rule';
import { RuleType } from '../../types/rule';

export interface RuleVisitor<T> {
  and(rule: AndRule): T;
  or(rule: OrRule): T;
  not(rule: NotRule): T;
  term(rule: TermRule): T;
  terms(rule: TermsRule): T;
  regex(rule: RegexRule): T;
  wildcard(rule: WildcardRule): T;
}

export function visitRule<T>(rule: RuleNode, visitor: RuleVisitor<T>): T {
  switch (rule.type) {
    case RuleType.AND:      return visitor.and(rule);
    case RuleType.OR:       return visitor.or(rule);
    case RuleType.NOT:      return visitor.not(rule);
    case RuleType.TERM:     return visitor.term(rule);
    case RuleType.TERMS:    return visitor.terms(rule);
    case RuleType.REGEX:    return visitor.regex(rule);
    case RuleType.WILDCARD: return visitor.wildcard(rule);
  }
}
