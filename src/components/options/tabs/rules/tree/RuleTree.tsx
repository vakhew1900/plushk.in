import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { IconChevronDown, IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { buildRuleTree } from '@/lib/rule-tree';
import type { BookmarkRule } from '@/types/rule';
import type { RuleTreeNode } from '@/types/rule-tree';
import { RuleTreeRow } from './RuleTreeRow';
import { RuleDeleteDialog } from './RuleDeleteDialog';
import styles from './RuleTree.module.css';

interface Props {
  rules: BookmarkRule[];
  /** `null` means the virtual default-folder root is selected. */
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onToggleEnabled: (rule: BookmarkRule) => void;
  onAddRule: (parentId: string | undefined) => void;
  onRemove: (id: string) => void;
  onRemoveWithDescendants: (id: string) => void;
}

// Bookkeeping key for the root row's own expand/collapse state — never a
// real rule id (those come from `crypto.randomUUID()`), so it can't collide.
const ROOT_KEY = '__root__';

export function RuleTree({ rules, selectedId, onSelect, onToggleEnabled, onAddRule, onRemove, onRemoveWithDescendants }: Props) {
  const { translate: t } = useTranslation();
  const tree = useMemo(() => buildRuleTree(rules), [rules]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set([ROOT_KEY]));
  const [pendingDelete, setPendingDelete] = useState<RuleTreeNode | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // A rule with no children is removed immediately, same as before this
  // feature existed — the confirmation popup only guards a delete that would
  // actually cascade (see RULE-10).
  const requestDelete = (node: RuleTreeNode) => {
    if (node.children.length === 0) {
      onRemove(node.id);
      return;
    }
    setPendingDelete(node);
  };

  const handleAddChild = (parentId: string) => {
    setExpandedIds((prev) => (prev.has(parentId) ? prev : new Set(prev).add(parentId)));
    onAddRule(parentId);
  };

  const rootExpanded = expandedIds.has(ROOT_KEY);

  return (
    <div role="tree" className={styles.wrap}>
      <div
        role="treeitem"
        aria-selected={selectedId === null}
        aria-expanded={tree.length > 0 ? rootExpanded : undefined}
        className={clsx(styles.rootRow, selectedId === null && styles.rootSelected)}
        onClick={() => onSelect(null)}
      >
        <span
          className={clsx(styles.caret, rootExpanded && styles.caretExpanded, tree.length === 0 && styles.caretHidden)}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(ROOT_KEY);
          }}
        >
          <IconChevronDown size="sm" />
        </span>
        <span className={styles.rootName}>{t('ruleTree.defaultFolderNode')}</span>
      </div>

      {tree.length > 0 && rootExpanded && (
        <div role="group" className={styles.rootChildren}>
          {tree.map((node) => (
            <RuleTreeRow
              key={node.id}
              node={node}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onSelect={onSelect}
              onToggleEnabled={(n) => onToggleEnabled(n.rule)}
              onAddChild={handleAddChild}
              onRequestDelete={requestDelete}
            />
          ))}
        </div>
      )}

      <Button variant="dashed" className={styles.addRootBtn} onClick={() => onAddRule(undefined)}>
        <IconPlus size="md" />
        {t('rulesTab.addRule')}
      </Button>

      <RuleDeleteDialog
        node={pendingDelete}
        allRules={rules}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onConfirm={(id) => {
          onRemoveWithDescendants(id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
