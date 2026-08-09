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
import { RuleType, isCompoundRule, isLeafRule } from '../../types/rule';
import type { RuleVisitor } from './rule-visitor';
import { visitRule } from './rule-visitor';

// Client-only mirror of `RuleNode`, decorated with a stable `id` for React
// keys/focus while editing. Derived from the existing `RuleNode` member
// types (Omit + intersection) instead of hand-duplicated interfaces, so a
// new leaf/compound type added to `RuleType` only needs one new union member
// here, not a parallel class hierarchy.

export type CompoundRuleType = typeof RuleType.AND | typeof RuleType.OR | typeof RuleType.NOT;
export type LeafRuleType =
  | typeof RuleType.TERM
  | typeof RuleType.TERMS
  | typeof RuleType.REGEX
  | typeof RuleType.WILDCARD;

export type LeafRuleNode = TermRule | TermsRule | RegexRule | WildcardRule;

export type DraftAndRule = { id: string } & Omit<AndRule, 'and'> & { and: DraftRuleNode[] };
export type DraftOrRule = { id: string } & Omit<OrRule, 'or'> & { or: DraftRuleNode[] };
export type DraftNotRule = { id: string } & Omit<NotRule, 'not'> & { not: DraftRuleNode[] };
export type DraftTermRule = { id: string } & TermRule;
export type DraftTermsRule = { id: string } & TermsRule;
export type DraftRegexRule = { id: string } & RegexRule;
export type DraftWildcardRule = { id: string } & WildcardRule;

export type DraftGroupNode = DraftAndRule | DraftOrRule | DraftNotRule;
export type DraftLeafNode = DraftTermRule | DraftTermsRule | DraftRegexRule | DraftWildcardRule;
export type DraftRuleNode = DraftGroupNode | DraftLeafNode;

// Delegates to `isCompoundRule`/`isLeafRule` (`types/rule.ts`) rather than
// re-checking `node.type` here — a `DraftRuleNode` is structurally a
// `RuleNode` plus `id`, so the existing runtime check is reusable as-is;
// only the type predicate needs to be Draft-specific.
export const isDraftGroup = (node: DraftRuleNode): node is DraftGroupNode => isCompoundRule(node);

export const isDraftLeaf = (node: DraftRuleNode): node is DraftLeafNode => isLeafRule(node);

export function getDraftChildren(node: DraftGroupNode): DraftRuleNode[] {
  switch (node.type) {
    case RuleType.AND: return node.and;
    case RuleType.OR: return node.or;
    case RuleType.NOT: return node.not;
  }
}

export function withDraftChildren(node: DraftGroupNode, children: DraftRuleNode[]): DraftGroupNode {
  switch (node.type) {
    case RuleType.AND: return { ...node, and: children };
    case RuleType.OR: return { ...node, or: children };
    case RuleType.NOT: return { ...node, not: children };
  }
}

// Changes only the discriminant — children carry over as-is, since
// `AndRule`/`OrRule`/`NotRule` all just hold a `RuleNode[]` under a
// differently-named key.
export function withDraftGroupType(node: DraftGroupNode, type: CompoundRuleType): DraftGroupNode {
  const children = getDraftChildren(node);
  switch (type) {
    case RuleType.AND: return { id: node.id, type: RuleType.AND, and: children };
    case RuleType.OR: return { id: node.id, type: RuleType.OR, or: children };
    case RuleType.NOT: return { id: node.id, type: RuleType.NOT, not: children };
  }
}

export function makeDraftGroup(type: CompoundRuleType): DraftGroupNode {
  const id = crypto.randomUUID();
  switch (type) {
    case RuleType.AND: return { id, type, and: [] };
    case RuleType.OR: return { id, type, or: [] };
    case RuleType.NOT: return { id, type, not: [] };
  }
}

export function makeDraftLeaf(type: LeafRuleType): DraftLeafNode {
  const id = crypto.randomUUID();
  switch (type) {
    case RuleType.TERM: return { id, type, field: '', value: '' };
    case RuleType.TERMS: return { id, type, field: '', values: [''] };
    case RuleType.REGEX: return { id, type, field: '', pattern: '' };
    case RuleType.WILDCARD: return { id, type, field: '', pattern: '' };
  }
}

// ─── Conversion ──────────────────────────────────────────────────────────
// `toDraftNode` dispatches from a plain `RuleNode`, so it *can* go through
// `RuleVisitor<DraftRuleNode>` like the rest of this codebase's recursive
// traversals (`EvaluatorVisitor`/`LeafCounterVisitor` in rule-evaluator.ts).
// `fromDraftNode` can't follow the same route: its input is `DraftRuleNode`,
// and `visitRule`/`RuleVisitor<T>` are typed on `RuleNode` — inside a
// dispatched method, a compound's children are statically `RuleNode[]`, so
// `id` is invisible even though the runtime objects have it, and recursing
// via `fromDraftNode` on those children wouldn't type-check without a cast.
// Kept as a plain recursive function, same `switch (node.type)` shape.

class ToDraftVisitor implements RuleVisitor<DraftRuleNode> {
  and(r: AndRule): DraftRuleNode { return { id: crypto.randomUUID(), type: r.type, and: r.and.map((c) => visitRule(c, this)) }; }
  or(r: OrRule): DraftRuleNode { return { id: crypto.randomUUID(), type: r.type, or: r.or.map((c) => visitRule(c, this)) }; }
  not(r: NotRule): DraftRuleNode { return { id: crypto.randomUUID(), type: r.type, not: r.not.map((c) => visitRule(c, this)) }; }
  term(r: TermRule): DraftRuleNode { return { id: crypto.randomUUID(), type: r.type, field: r.field, value: r.value }; }
  terms(r: TermsRule): DraftRuleNode { return { id: crypto.randomUUID(), type: r.type, field: r.field, values: r.values }; }
  regex(r: RegexRule): DraftRuleNode { return { id: crypto.randomUUID(), type: r.type, field: r.field, pattern: r.pattern }; }
  wildcard(r: WildcardRule): DraftRuleNode { return { id: crypto.randomUUID(), type: r.type, field: r.field, pattern: r.pattern }; }
}

export function toDraftNode(rule: RuleNode): DraftRuleNode {
  return visitRule(rule, new ToDraftVisitor());
}

export function fromDraftNode(draft: DraftRuleNode): RuleNode {
  switch (draft.type) {
    case RuleType.AND: return { type: draft.type, and: draft.and.map(fromDraftNode) };
    case RuleType.OR: return { type: draft.type, or: draft.or.map(fromDraftNode) };
    case RuleType.NOT: return { type: draft.type, not: draft.not.map(fromDraftNode) };
    case RuleType.TERM: return { type: draft.type, field: draft.field, value: draft.value };
    case RuleType.TERMS: return { type: draft.type, field: draft.field, values: draft.values };
    case RuleType.REGEX: return { type: draft.type, field: draft.field, pattern: draft.pattern };
    case RuleType.WILDCARD: return { type: draft.type, field: draft.field, pattern: draft.pattern };
  }
}

// ─── Validation ──────────────────────────────────────────────────────────
// Error codes, not translated strings — this is `lib/`, it doesn't know
// about `src/locale/`. The UI maps a code to text where it's displayed.

export const DraftRuleError = {
  FIELD_REQUIRED: 'fieldRequired',
  VALUE_REQUIRED: 'valueRequired',
  VALUES_REQUIRED: 'valuesRequired',
  PATTERN_REQUIRED: 'patternRequired',
} as const;
export type DraftRuleError = (typeof DraftRuleError)[keyof typeof DraftRuleError];

// Takes the plain (non-draft) leaf shape — a `DraftLeafNode` is structurally
// assignable to it (the extra `id` is simply ignored) — so both the draft
// tree (per-row inline errors) and a parsed `RuleNode` (save-button gating,
// see `hasRuleErrors`) share this one implementation.
export function validateLeafNode(node: LeafRuleNode): DraftRuleError[] {
  const errors: DraftRuleError[] = [];
  if (!node.field.trim()) errors.push(DraftRuleError.FIELD_REQUIRED);

  switch (node.type) {
    case RuleType.TERM:
      if (!node.value.trim()) errors.push(DraftRuleError.VALUE_REQUIRED);
      break;
    case RuleType.TERMS:
      if (node.values.length === 0 || node.values.every((v) => !v.trim())) {
        errors.push(DraftRuleError.VALUES_REQUIRED);
      }
      break;
    case RuleType.REGEX:
    case RuleType.WILDCARD:
      if (!node.pattern.trim()) errors.push(DraftRuleError.PATTERN_REQUIRED);
      break;
  }

  return errors;
}

// Whether this draft node or any of its descendants is invalid — used to
// mark a group card as "contains an error" even without expanding into it.
export function subtreeHasErrors(node: DraftRuleNode): boolean {
  if (isDraftGroup(node)) {
    const children = getDraftChildren(node);
    return children.length === 0 || children.some(subtreeHasErrors);
  }
  return validateLeafNode(node).length > 0;
}

class ErrorVisitor implements RuleVisitor<boolean> {
  and(r: AndRule): boolean { return r.and.length === 0 || r.and.some((c) => visitRule(c, this)); }
  or(r: OrRule): boolean { return r.or.length === 0 || r.or.some((c) => visitRule(c, this)); }
  not(r: NotRule): boolean { return r.not.length === 0 || r.not.some((c) => visitRule(c, this)); }
  term(r: TermRule): boolean { return validateLeafNode(r).length > 0; }
  terms(r: TermsRule): boolean { return validateLeafNode(r).length > 0; }
  regex(r: RegexRule): boolean { return validateLeafNode(r).length > 0; }
  wildcard(r: WildcardRule): boolean { return validateLeafNode(r).length > 0; }
}

// Save-button gating in `RuleEditor` — operates on the parsed `RuleNode`
// directly (no ids needed), so it reuses `visitRule`/`RuleVisitor<T>` same
// as `rule-evaluator.ts` does, rather than the draft-only helpers above.
export function hasRuleErrors(rule: RuleNode): boolean {
  return visitRule(rule, new ErrorVisitor());
}
