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

// The shape a tree "slot" (the root, or a group's child) can be switched
// between in the visual builder: a bare leaf condition ("single" — not a
// `RuleType` value, there's no node for "not a group"), or one of the three
// compound types. See `StructureSwitcher` — lets a bare leaf be wrapped into
// a group, and a single-child group be collapsed back to its one leaf.
export const StructureType = {
  SINGLE: 'single',
  AND: RuleType.AND,
  OR: RuleType.OR,
  NOT: RuleType.NOT,
} as const;
export type StructureType = (typeof StructureType)[keyof typeof StructureType];
export type LeafRuleType =
  | typeof RuleType.TERM
  | typeof RuleType.TERMS
  | typeof RuleType.REGEX
  | typeof RuleType.WILDCARD;

export type LeafRuleNode = TermRule | TermsRule | RegexRule | WildcardRule;

// `AndRule`/`OrRule`/`NotRule` differ only by their `type` literal — the
// `nodes` array they carry is identically shaped — so unlike the leaf
// types below, one flat type covers all three instead of a per-variant
// `Omit`+intersection each.
export type DraftGroupNode = { id: string; type: CompoundRuleType; nodes: DraftRuleNode[] };
export type DraftTermRule = { id: string } & TermRule;
export type DraftTermsRule = { id: string } & TermsRule;
export type DraftRegexRule = { id: string } & RegexRule;
export type DraftWildcardRule = { id: string } & WildcardRule;

export type DraftLeafNode = DraftTermRule | DraftTermsRule | DraftRegexRule | DraftWildcardRule;
export type DraftRuleNode = DraftGroupNode | DraftLeafNode;

// Delegates to `isCompoundRule`/`isLeafRule` (`types/rule.ts`) rather than
// re-checking `node.type` here — a `DraftRuleNode` is structurally a
// `RuleNode` plus `id`, so the existing runtime check is reusable as-is;
// only the type predicate needs to be Draft-specific.
export const isDraftGroup = (node: DraftRuleNode): node is DraftGroupNode => isCompoundRule(node);

export const isDraftLeaf = (node: DraftRuleNode): node is DraftLeafNode => isLeafRule(node);

// Thin accessors kept (rather than inlined `node.nodes` at call sites) so
// `ConditionGroup`/`ConsView` stay decoupled from the draft tree's field
// layout, same reasoning as before the `and`/`or`/`not` → `nodes` unification.
export function getDraftChildren(node: DraftGroupNode): DraftRuleNode[] {
  return node.nodes;
}

export function withDraftChildren(node: DraftGroupNode, children: DraftRuleNode[]): DraftGroupNode {
  return { ...node, nodes: children };
}

export function withDraftGroupType(node: DraftGroupNode, type: CompoundRuleType): DraftGroupNode {
  return { ...node, type };
}

/**
 * Applies a `StructureSwitcher` selection to any node — leaf or group — in
 * one place, instead of `ConditionRow`/`ConditionGroup` each re-implementing
 * "single vs. AND/OR/NOT" with their own slightly different branching:
 *
 * - `SINGLE`: collapses a group with exactly one child down to that child.
 *   A leaf (already "single") or a group with 0/2+ children is returned
 *   unchanged — the UI disables the "single" option in the latter case (see
 *   `singleDisabled`), this is just the safe no-op if it's ever reached
 *   anyway.
 * - `AND`/`OR`/`NOT`: an existing group is relabeled in place (children
 *   untouched, same as `withDraftGroupType`); a leaf is wrapped into a new
 *   group containing just that leaf.
 */
export function withStructureType(node: DraftRuleNode, type: StructureType): DraftRuleNode {
  if (type === StructureType.SINGLE) {
    if (isDraftGroup(node) && getDraftChildren(node).length === 1) return getDraftChildren(node)[0];
    return node;
  }
  if (isDraftGroup(node)) return withDraftGroupType(node, type);
  return { id: crypto.randomUUID(), type, nodes: [node] };
}

export function makeDraftGroup(type: CompoundRuleType): DraftGroupNode {
  return { id: crypto.randomUUID(), type, nodes: [] };
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
  private group(r: AndRule | OrRule | NotRule): DraftRuleNode {
    return { id: crypto.randomUUID(), type: r.type, nodes: r.nodes.map((c) => visitRule(c, this)) };
  }

  and(r: AndRule): DraftRuleNode { return this.group(r); }
  or(r: OrRule): DraftRuleNode { return this.group(r); }
  not(r: NotRule): DraftRuleNode { return this.group(r); }
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
    case RuleType.AND: return { type: draft.type, nodes: draft.nodes.map(fromDraftNode) };
    case RuleType.OR: return { type: draft.type, nodes: draft.nodes.map(fromDraftNode) };
    case RuleType.NOT: return { type: draft.type, nodes: draft.nodes.map(fromDraftNode) };
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
  private group(r: AndRule | OrRule | NotRule): boolean {
    return r.nodes.length === 0 || r.nodes.some((c) => visitRule(c, this));
  }

  and(r: AndRule): boolean { return this.group(r); }
  or(r: OrRule): boolean { return this.group(r); }
  not(r: NotRule): boolean { return this.group(r); }
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
