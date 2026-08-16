import type { BookmarkRule } from './rule';

/**
 * A node in the rule hierarchy, built in memory from the flat `BookmarkRule`
 * list on read (see `src/lib/rule-tree.ts`). The virtual default-folder root
 * is *not* represented by this type — it has no `BookmarkRule` behind it and
 * is handled separately at the UI layer (see RULE-10).
 */
export interface RuleTreeNode {
  readonly id: string;
  readonly rule: BookmarkRule;
  readonly children: RuleTreeNode[];
}
