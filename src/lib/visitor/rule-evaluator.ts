import type { PageMeta } from '../../types/page-meta';
import { getMetaField } from '../../types/page-meta';
import type {
  AndRule,
  NotRule,
  OrRule,
  RegexRule,
  RuleNode,
  TermRule,
  TermsRule,
  WildcardRule,
} from '../../types/rule';
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
