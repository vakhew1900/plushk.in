import type { BookmarkRule } from '../types/rule';
import type { RuleTreeNode } from '../types/rule-tree';

/**
 * Groups a flat rule list into a forest by `parentId` — top-level rules
 * (no `parentId`) are the roots. Sibling order is not re-sorted here: it
 * relies on the input already being priority-desc, the order
 * `BookmarkRuleRepository.queryAll()` returns — a stable group-by preserves
 * that order within each sibling group without doing it again.
 */
export function buildRuleTree(rules: BookmarkRule[]): RuleTreeNode[] {
  const childrenByParent = new Map<string | undefined, BookmarkRule[]>();
  for (const rule of rules) {
    const siblings = childrenByParent.get(rule.parentId);
    if (siblings) siblings.push(rule);
    else childrenByParent.set(rule.parentId, [rule]);
  }

  function build(parentId: string | undefined): RuleTreeNode[] {
    return (childrenByParent.get(parentId) ?? []).map((rule) => ({
      id: rule.id,
      rule,
      children: build(rule.id),
    }));
  }

  return build(undefined);
}

/**
 * Walks the tree depth-first: among each level's siblings (in list order —
 * see `buildRuleTree`), the first one whose `matches` predicate is true
 * wins. If it has children, the search continues among *them* for a more
 * specific match; if none of its children match (or it has none), the node
 * itself is the result. A sibling whose predicate is false is skipped
 * entirely — including a disabled rule, which by construction of `matches`
 * takes its whole subtree with it, since the walk never reaches children it
 * didn't get past their parent to see.
 */
export function findMatchingTreeNode(
  nodes: RuleTreeNode[],
  matches: (rule: BookmarkRule) => boolean,
): RuleTreeNode | null {
  for (const node of nodes) {
    if (!matches(node.rule)) continue;
    return findMatchingTreeNode(node.children, matches) ?? node;
  }
  return null;
}

/** Id of `rootId` and every descendant of it (inclusive) — for cascade delete. */
export function collectSubtreeIds(rules: BookmarkRule[], rootId: string): string[] {
  const childIdsByParent = new Map<string, string[]>();
  for (const rule of rules) {
    if (rule.parentId === undefined) continue;
    const siblings = childIdsByParent.get(rule.parentId);
    if (siblings) siblings.push(rule.id);
    else childIdsByParent.set(rule.parentId, [rule.id]);
  }

  const ids: string[] = [rootId];
  const stack: string[] = [rootId];
  while (stack.length > 0) {
    const id = stack.pop();
    if (id === undefined) break;
    for (const childId of childIdsByParent.get(id) ?? []) {
      ids.push(childId);
      stack.push(childId);
    }
  }
  return ids;
}
