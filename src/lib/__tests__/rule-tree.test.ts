import { describe, expect, it } from 'vitest';
import type { BookmarkRule } from '../../types/rule';
import { RuleType } from '../../types/rule';
import { buildRuleTree, collectSubtreeIds, findMatchingTreeNode } from '../rule-tree';

function makeRule(overrides: Partial<BookmarkRule> & Pick<BookmarkRule, 'id'>): BookmarkRule {
  return {
    name: overrides.id,
    condition: { type: RuleType.OR, nodes: [] },
    targetFolder: 'Folder',
    priority: 0,
    enabled: true,
    ...overrides,
  };
}

describe('buildRuleTree', () => {
  it('returns a flat forest when no rule has a parentId', () => {
    const rules = [makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })];
    const tree = buildRuleTree(rules);

    expect(tree.map((n) => n.id)).toEqual(['a', 'b', 'c']);
    expect(tree.every((n) => n.children.length === 0)).toBe(true);
  });

  it('nests a child under its parent, preserving input order among siblings', () => {
    const rules = [
      makeRule({ id: 'parent' }),
      makeRule({ id: 'child-1', parentId: 'parent' }),
      makeRule({ id: 'child-2', parentId: 'parent' }),
      makeRule({ id: 'sibling' }),
    ];
    const tree = buildRuleTree(rules);

    expect(tree.map((n) => n.id)).toEqual(['parent', 'sibling']);
    const parentNode = tree.find((n) => n.id === 'parent');
    expect(parentNode?.children.map((n) => n.id)).toEqual(['child-1', 'child-2']);
  });

  it('builds a chain three levels deep', () => {
    const rules = [
      makeRule({ id: 'grandparent' }),
      makeRule({ id: 'parent', parentId: 'grandparent' }),
      makeRule({ id: 'child', parentId: 'parent' }),
    ];
    const tree = buildRuleTree(rules);

    expect(tree[0]?.children[0]?.children[0]?.id).toBe('child');
  });
});

describe('findMatchingTreeNode', () => {
  const matchesById = (ids: Set<string>) => (rule: BookmarkRule) => ids.has(rule.id);

  it('returns null for an empty tree', () => {
    expect(findMatchingTreeNode([], () => true)).toBeNull();
  });

  it('returns the first top-level sibling whose predicate matches, in list order', () => {
    const tree = buildRuleTree([makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })]);
    expect(findMatchingTreeNode(tree, matchesById(new Set(['b', 'c'])))?.id).toBe('b');
  });

  it('returns the parent when it matches but no child does', () => {
    const tree = buildRuleTree([
      makeRule({ id: 'parent' }),
      makeRule({ id: 'child', parentId: 'parent' }),
    ]);
    expect(findMatchingTreeNode(tree, matchesById(new Set(['parent'])))?.id).toBe('parent');
  });

  it('descends into the matching child when both parent and child match', () => {
    const tree = buildRuleTree([
      makeRule({ id: 'parent' }),
      makeRule({ id: 'child', parentId: 'parent' }),
    ]);
    expect(findMatchingTreeNode(tree, matchesById(new Set(['parent', 'child'])))?.id).toBe('child');
  });

  it('picks the deepest match across a three-level chain', () => {
    const tree = buildRuleTree([
      makeRule({ id: 'grandparent' }),
      makeRule({ id: 'parent', parentId: 'grandparent' }),
      makeRule({ id: 'child', parentId: 'parent' }),
    ]);
    const allMatch = matchesById(new Set(['grandparent', 'parent', 'child']));
    expect(findMatchingTreeNode(tree, allMatch)?.id).toBe('child');
  });

  it('never reaches a child whose parent did not match, even if the child would match', () => {
    const tree = buildRuleTree([
      makeRule({ id: 'parent' }),
      makeRule({ id: 'child', parentId: 'parent' }),
    ]);
    // Only 'child' matches — but the walk never gets past its non-matching parent.
    expect(findMatchingTreeNode(tree, matchesById(new Set(['child'])))).toBeNull();
  });

  it('moves to the next top-level sibling when the first one does not match', () => {
    const tree = buildRuleTree([makeRule({ id: 'a' }), makeRule({ id: 'b' })]);
    expect(findMatchingTreeNode(tree, matchesById(new Set(['b'])))?.id).toBe('b');
  });

  it('when two siblings both match, the first one in list order wins', () => {
    const tree = buildRuleTree([makeRule({ id: 'a' }), makeRule({ id: 'b' })]);
    expect(findMatchingTreeNode(tree, matchesById(new Set(['a', 'b'])))?.id).toBe('a');
  });
});

describe('collectSubtreeIds', () => {
  it('returns just the id itself for a leaf', () => {
    const rules = [makeRule({ id: 'a' }), makeRule({ id: 'b' })];
    expect(collectSubtreeIds(rules, 'a')).toEqual(['a']);
  });

  it('collects every descendant, including deeper grandchildren', () => {
    const rules = [
      makeRule({ id: 'root' }),
      makeRule({ id: 'child-1', parentId: 'root' }),
      makeRule({ id: 'child-2', parentId: 'root' }),
      makeRule({ id: 'grandchild', parentId: 'child-1' }),
      makeRule({ id: 'unrelated' }),
    ];
    const ids = collectSubtreeIds(rules, 'root');

    expect(new Set(ids)).toEqual(new Set(['root', 'child-1', 'child-2', 'grandchild']));
    expect(ids).not.toContain('unrelated');
  });
});
