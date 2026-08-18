import { clsx } from 'clsx';
import { Switch } from '@/components/ui/switch';
import { IconButton } from '@/components/ui/icon-button';
import { IconChevronDown, IconPlus, IconTrash } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { RuleTreeNode } from '@/types/rule-tree';
import styles from './RuleTreeRow.module.css';

interface Props {
  node: RuleTreeNode;
  selectedId: string | null;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelect: (id: string) => void;
  onToggleEnabled: (node: RuleTreeNode) => void;
  onAddChild: (parentId: string) => void;
  onRequestDelete: (node: RuleTreeNode) => void;
}

export function RuleTreeRow({
  node,
  selectedId,
  expandedIds,
  onToggleExpand,
  onSelect,
  onToggleEnabled,
  onAddChild,
  onRequestDelete,
}: Props) {
  const { translate: t } = useTranslation();
  const hasChildren = node.children.length > 0;
  const expanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div className={styles.treeNode}>
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? expanded : undefined}
        className={clsx(styles.nodeRow, isSelected && styles.selected)}
        onClick={() => onSelect(node.id)}
      >
        <span
          className={clsx(styles.caret, expanded && styles.caretExpanded, !hasChildren && styles.caretHidden)}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(node.id);
          }}
        >
          <IconChevronDown size="sm" />
        </span>

        <span className={styles.name} title={node.rule.name}>
          {node.rule.name}
        </span>

        <span onClick={(e) => e.stopPropagation()} className={styles.switchWrap}>
          <Switch checked={node.rule.enabled} onCheckedChange={() => onToggleEnabled(node)} />
        </span>

        <IconButton
          icon={IconPlus}
          className={styles.rowBtn}
          title={t('ruleTree.addChildRule')}
          onClick={(e) => {
            e.stopPropagation();
            onAddChild(node.id);
          }}
        />
        <IconButton
          icon={IconTrash}
          variant="danger"
          className={styles.rowBtn}
          title={t('ruleTree.deleteRule')}
          onClick={(e) => {
            e.stopPropagation();
            onRequestDelete(node);
          }}
        />
      </div>

      {hasChildren && expanded && (
        <div role="group" className={styles.childrenContainer}>
          {node.children.map((child) => (
            <RuleTreeRow
              key={child.id}
              node={child}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onToggleEnabled={onToggleEnabled}
              onAddChild={onAddChild}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
