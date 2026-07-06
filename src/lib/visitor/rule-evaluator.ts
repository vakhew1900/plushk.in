import type { PageMeta } from '../../types/page-meta';
import { getMetaField } from '../../types/page-meta';
import type {
  AndRule,
  BookmarkRule,
  NotRule,
  OrRule,
  RegexRule,
  RuleNode,
  TermRule,
  TermsRule,
  WildcardRule,
} from '../../types/rule';
import { RuleType } from '../../types/rule';
import type { RuleVisitor } from './rule-visitor';
import { visitRule } from './rule-visitor';

function wildcardToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const regexStr = escaped.replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${regexStr}$`, 'i');
}

class EvaluatorVisitor implements RuleVisitor<boolean> {
  constructor(private readonly meta: PageMeta) {}

  and(r: AndRule): boolean  { return r.and.every((sub) => visitRule(sub, this)); }
  or(r: OrRule): boolean    { return r.or.some((sub) => visitRule(sub, this)); }
  not(r: NotRule): boolean  { return r.not.every((sub) => !visitRule(sub, this)); }

  term(r: TermRule) {
    const val = getMetaField(this.meta, r.field);
    if (Array.isArray(val)) return val.includes(r.value);
    return val === r.value;
  }

  terms(r: TermsRule) {
    const val = getMetaField(this.meta, r.field);
    if (Array.isArray(val)) return val.some((v) => r.values.includes(v));
    return val !== undefined && r.values.includes(val);
  }

  regex(r: RegexRule) {
    const val = getMetaField(this.meta, r.field);
    const pattern = new RegExp(r.pattern);
    if (Array.isArray(val)) return val.some((v) => pattern.test(v));
    return val !== undefined && pattern.test(val);
  }

  wildcard(r: WildcardRule) {
    const val = getMetaField(this.meta, r.field);
    const pattern = wildcardToRegex(r.pattern);
    if (Array.isArray(val)) return val.some((v) => pattern.test(v));
    return val !== undefined && pattern.test(val);
  }
}

export function evaluate(rule: RuleNode, meta: PageMeta): boolean {
  return visitRule(rule, new EvaluatorVisitor(meta));
}

// Rules are expected pre-sorted by descending priority (e.g. via
// IBookmarkRuleRepository.getAll()) — the first enabled match wins.
export function findMatchingRule(rules: BookmarkRule[], meta: PageMeta): BookmarkRule | undefined {
  return rules.find((rule) => rule.enabled && evaluate(rule.condition, meta));
}

class LeafCounterVisitor implements RuleVisitor<number> {
  and(r: AndRule): number { return r.and.reduce((sum, sub) => sum + visitRule(sub, this), 0); }
  or(r: OrRule): number   { return r.or.reduce((sum, sub) => sum + visitRule(sub, this), 0); }
  not(r: NotRule): number { return r.not.reduce((sum, sub) => sum + visitRule(sub, this), 0); }
  term(): number     { return 1; }
  terms(): number    { return 1; }
  regex(): number    { return 1; }
  wildcard(): number { return 1; }
}

export function countLeafRules(rule: RuleNode): number {
  return visitRule(rule, new LeafCounterVisitor());
}

function isRuleNode(value: unknown): value is RuleNode {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;

  switch (v.type) {
    case RuleType.AND:
      return Array.isArray(v.and) && v.and.every(isRuleNode);
    case RuleType.OR:
      return Array.isArray(v.or) && v.or.every(isRuleNode);
    case RuleType.NOT:
      return Array.isArray(v.not) && v.not.every(isRuleNode);
    case RuleType.TERM:
      return typeof v.field === 'string' && typeof v.value === 'string';
    case RuleType.TERMS:
      return (
        typeof v.field === 'string' &&
        Array.isArray(v.values) &&
        v.values.every((x) => typeof x === 'string')
      );
    case RuleType.REGEX:
    case RuleType.WILDCARD:
      return typeof v.field === 'string' && typeof v.pattern === 'string';
    default:
      return false;
  }
}

export function parseRuleNode(raw: string): RuleNode | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  return isRuleNode(parsed) ? parsed : null;
}
