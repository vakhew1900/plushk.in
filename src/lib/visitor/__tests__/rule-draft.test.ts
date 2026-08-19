import { describe, expect, it } from 'vitest';
import { RuleType } from '../../../types/rule';
import type { RuleNode } from '../../../types/rule';
import {
  DraftRuleError,
  StructureType,
  fromDraftNode,
  getDraftChildren,
  hasRuleErrors,
  isDraftGroup,
  isDraftLeaf,
  makeDraftGroup,
  makeDraftLeaf,
  makeDraftNode,
  subtreeHasErrors,
  toDraftNode,
  validateLeafNode,
  withDraftChildren,
  withDraftGroupType,
  withLeafType,
  withStructureType,
} from '../rule-draft';
import type { DraftRegexRule, DraftTermRule, DraftTermsRule, DraftWildcardRule } from '../rule-draft';

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

describe('withStructureType', () => {
  it('wraps a leaf in a new group when picking AND/OR/NOT', () => {
    const leaf = makeDraftLeaf(RuleType.TERM);
    const result = withStructureType(leaf, RuleType.AND);

    expect(isDraftGroup(result)).toBe(true);
    if (isDraftGroup(result)) {
      expect(result.type).toBe(RuleType.AND);
      expect(getDraftChildren(result)).toEqual([leaf]);
    }
  });

  it('leaves a leaf unchanged when picking SINGLE (already single)', () => {
    const leaf = makeDraftLeaf(RuleType.TERM);
    expect(withStructureType(leaf, StructureType.SINGLE)).toBe(leaf);
  });

  it('relabels an existing group in place when picking AND/OR/NOT, keeping children and id', () => {
    const leaf = makeDraftLeaf(RuleType.TERM);
    const group = withDraftChildren(makeDraftGroup(RuleType.AND), [leaf, leaf]);

    const result = withStructureType(group, RuleType.OR);

    expect(isDraftGroup(result)).toBe(true);
    if (isDraftGroup(result)) {
      expect(result.type).toBe(RuleType.OR);
      expect(result.id).toBe(group.id);
      expect(getDraftChildren(result)).toEqual(getDraftChildren(group));
    }
  });

  it('collapses a single-child group down to that child when picking SINGLE', () => {
    const leaf = makeDraftLeaf(RuleType.TERM);
    const group = withDraftChildren(makeDraftGroup(RuleType.AND), [leaf]);

    expect(withStructureType(group, StructureType.SINGLE)).toBe(leaf);
  });

  it('leaves a group with zero children unchanged when picking SINGLE', () => {
    const group = makeDraftGroup(RuleType.AND);
    expect(withStructureType(group, StructureType.SINGLE)).toBe(group);
  });

  it('leaves a group with 2+ children unchanged when picking SINGLE', () => {
    const leaf = makeDraftLeaf(RuleType.TERM);
    const group = withDraftChildren(makeDraftGroup(RuleType.AND), [leaf, leaf]);
    expect(withStructureType(group, StructureType.SINGLE)).toBe(group);
  });
});

describe('withLeafType', () => {
  it('returns the same node when picking the current type (no-op)', () => {
    const leaf: DraftTermRule = { id: 'x', type: RuleType.TERM, field: 'domain', value: 'youtube.com' };
    expect(withLeafType(leaf, RuleType.TERM)).toBe(leaf);
  });

  it('keeps id and field, carrying the single value into a one-item terms list', () => {
    const leaf: DraftTermRule = { id: 'x', type: RuleType.TERM, field: 'domain', value: 'youtube.com' };
    const result = withLeafType(leaf, RuleType.TERMS);

    expect(result).toEqual({ id: 'x', type: RuleType.TERMS, field: 'domain', values: ['youtube.com'] });
  });

  it('carries the first terms value back down to a single term', () => {
    const leaf: DraftTermsRule = { id: 'x', type: RuleType.TERMS, field: 'tags', values: ['tutorial', 'course'] };
    const result = withLeafType(leaf, RuleType.TERM);

    expect(result).toEqual({ id: 'x', type: RuleType.TERM, field: 'tags', value: 'tutorial' });
  });

  it('reinterprets the same pattern string switching between regex and wildcard', () => {
    const leaf: DraftRegexRule = { id: 'x', type: RuleType.REGEX, field: 'url', pattern: '.*watch.*' };
    const result = withLeafType(leaf, RuleType.WILDCARD);

    expect(result).toEqual({ id: 'x', type: RuleType.WILDCARD, field: 'url', pattern: '.*watch.*' });
  });

  it('carries a pattern into a term value and back', () => {
    const leaf: DraftWildcardRule = { id: 'x', type: RuleType.WILDCARD, field: 'title', pattern: '*tutorial*' };
    const asTerm = withLeafType(leaf, RuleType.TERM);
    expect(asTerm).toEqual({ id: 'x', type: RuleType.TERM, field: 'title', value: '*tutorial*' });
    expect(withLeafType(asTerm, RuleType.REGEX)).toEqual({ id: 'x', type: RuleType.REGEX, field: 'title', pattern: '*tutorial*' });
  });

  it('seeds an empty terms list entry when the source value is empty', () => {
    const leaf: DraftTermRule = { id: 'x', type: RuleType.TERM, field: 'domain', value: '' };
    expect(withLeafType(leaf, RuleType.TERMS)).toEqual({ id: 'x', type: RuleType.TERMS, field: 'domain', values: [''] });
  });
});

describe('makeDraftNode', () => {
  it('makes an empty leaf for a leaf type', () => {
    const result = makeDraftNode(RuleType.TERM);
    expect(isDraftLeaf(result)).toBe(true);
    if (isDraftLeaf(result)) {
      expect(result.type).toBe(RuleType.TERM);
    }
  });

  it('makes an empty group for AND/OR/NOT', () => {
    const result = makeDraftNode(RuleType.NOT);
    expect(isDraftGroup(result)).toBe(true);
    if (isDraftGroup(result)) {
      expect(result.type).toBe(RuleType.NOT);
      expect(getDraftChildren(result)).toEqual([]);
    }
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
