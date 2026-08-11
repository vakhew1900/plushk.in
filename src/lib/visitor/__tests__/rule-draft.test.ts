import { describe, expect, it } from 'vitest';
import { RuleType } from '../../../types/rule';
import type { RuleNode } from '../../../types/rule';
import {
  DraftRuleError,
  fromDraftNode,
  getDraftChildren,
  hasRuleErrors,
  isDraftGroup,
  isDraftLeaf,
  makeDraftGroup,
  makeDraftLeaf,
  subtreeHasErrors,
  toDraftNode,
  validateLeafNode,
  withDraftChildren,
  withDraftGroupType,
} from '../rule-draft';

const nested: RuleNode = {
  type: RuleType.AND,
  nodes: [
    { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
    {
      type: RuleType.OR,
      nodes: [
        { type: RuleType.TERMS, field: 'tags', values: ['tutorial', 'course'] },
        { type: RuleType.WILDCARD, field: 'title', pattern: '*tutorial*' },
      ],
    },
    { type: RuleType.NOT, nodes: [{ type: RuleType.TERM, field: 'extras.watched', value: 'true' }] },
  ],
};

describe('toDraftNode / fromDraftNode', () => {
  it('round-trips a deeply nested rule without losing structure', () => {
    expect(fromDraftNode(toDraftNode(nested))).toEqual(nested);
  });

  it('assigns a distinct id to every node, including nested ones', () => {
    const draft = toDraftNode(nested);
    const ids: string[] = [];
    const collect = (n: typeof draft): void => {
      ids.push(n.id);
      if (isDraftGroup(n)) getDraftChildren(n).forEach(collect);
    };
    collect(draft);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(7); // and, term, or, terms, wildcard, not, term
  });

  it('round-trips a single leaf rule', () => {
    const leaf: RuleNode = { type: RuleType.REGEX, field: 'url', pattern: '.*watch.*' };
    expect(fromDraftNode(toDraftNode(leaf))).toEqual(leaf);
  });
});

describe('isDraftGroup / isDraftLeaf', () => {
  it('classifies compound vs leaf nodes', () => {
    const draft = toDraftNode(nested);
    expect(isDraftGroup(draft)).toBe(true);
    expect(isDraftLeaf(draft)).toBe(false);

    const leaf = makeDraftLeaf(RuleType.TERM);
    expect(isDraftGroup(leaf)).toBe(false);
    expect(isDraftLeaf(leaf)).toBe(true);
  });
});

describe('getDraftChildren / withDraftChildren', () => {
  it('reads and writes children through the shared nodes field', () => {
    const group = makeDraftGroup(RuleType.AND);
    const leaf = makeDraftLeaf(RuleType.TERM);
    const withChild = withDraftChildren(group, [leaf]);
    expect(getDraftChildren(withChild)).toEqual([leaf]);
  });
});

describe('withDraftGroupType', () => {
  it('changes only the discriminant, keeping the same children and id', () => {
    const leaf = makeDraftLeaf(RuleType.TERM);
    const group = withDraftChildren(makeDraftGroup(RuleType.AND), [leaf, leaf]);

    const asOr = withDraftGroupType(group, RuleType.OR);

    expect(asOr.type).toBe(RuleType.OR);
    expect(asOr.id).toBe(group.id);
    expect(getDraftChildren(asOr)).toEqual(getDraftChildren(group));
  });
});

describe('validateLeafNode', () => {
  it('flags an empty field', () => {
    expect(validateLeafNode({ type: RuleType.TERM, field: '', value: 'x' }))
      .toContain(DraftRuleError.FIELD_REQUIRED);
  });

  it('flags an empty term value', () => {
    expect(validateLeafNode({ type: RuleType.TERM, field: 'domain', value: '' }))
      .toContain(DraftRuleError.VALUE_REQUIRED);
  });

  it('flags terms with no non-empty values', () => {
    expect(validateLeafNode({ type: RuleType.TERMS, field: 'tags', values: ['', '  '] }))
      .toContain(DraftRuleError.VALUES_REQUIRED);
  });

  it('accepts terms with at least one non-empty value', () => {
    expect(validateLeafNode({ type: RuleType.TERMS, field: 'tags', values: ['', 'course'] })).toEqual([]);
  });

  it('flags an empty regex/wildcard pattern', () => {
    expect(validateLeafNode({ type: RuleType.REGEX, field: 'url', pattern: '' }))
      .toContain(DraftRuleError.PATTERN_REQUIRED);
    expect(validateLeafNode({ type: RuleType.WILDCARD, field: 'url', pattern: '' }))
      .toContain(DraftRuleError.PATTERN_REQUIRED);
  });

  it('returns no errors for a fully filled-in leaf', () => {
    expect(validateLeafNode({ type: RuleType.TERM, field: 'domain', value: 'youtube.com' })).toEqual([]);
  });
});

describe('subtreeHasErrors', () => {
  it('is false for a fully valid tree', () => {
    expect(subtreeHasErrors(toDraftNode(nested))).toBe(false);
  });

  it('is true when a deeply nested leaf is invalid', () => {
    const broken: RuleNode = {
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.OR, nodes: [{ type: RuleType.TERM, field: '', value: 'x' }] },
      ],
    };
    expect(subtreeHasErrors(toDraftNode(broken))).toBe(true);
  });

  it('is true for a group with no children', () => {
    expect(subtreeHasErrors(makeDraftGroup(RuleType.OR))).toBe(true);
  });
});

describe('hasRuleErrors', () => {
  it('is false for a fully valid nested rule', () => {
    expect(hasRuleErrors(nested)).toBe(false);
  });

  it('is true when any leaf is invalid, however deep', () => {
    const broken: RuleNode = {
      type: RuleType.OR,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.NOT, nodes: [{ type: RuleType.TERMS, field: 'tags', values: [] }] },
      ],
    };
    expect(hasRuleErrors(broken)).toBe(true);
  });

  it('is true for an empty compound rule', () => {
    expect(hasRuleErrors({ type: RuleType.AND, nodes: [] })).toBe(true);
  });
});
