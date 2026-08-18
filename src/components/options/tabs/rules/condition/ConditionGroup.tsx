import { clsx } from 'clsx';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import type { DraftGroupNode, DraftRuleNode, StructureType } from '@/lib/visitor/rule-draft';
import {
  getDraftChildren,
  isDraftGroup,
  makeDraftLeaf,
  subtreeHasErrors,
  withDraftChildren,
  withStructureType,
} from '@/lib/visitor/rule-draft';
import type { LeafRuleType } from '@/lib/visitor/rule-draft';
import { RuleType } from '@/types/rule';
import type { TranslationKey } from '@/locale';
import { StructureSwitcher } from './StructureSwitcher';
import { AddConditionMenu } from './AddConditionMenu';
import { ConditionRow } from './ConditionRow';
import styles from './ConditionGroup.module.css';

const DESC_KEY: Record<typeof RuleType.AND | typeof RuleType.OR | typeof RuleType.NOT, TranslationKey> = {
  [RuleType.AND]: 'conditionGroup.andDesc',
  [RuleType.OR]: 'conditionGroup.orDesc',
  [RuleType.NOT]: 'conditionGroup.notDesc',
};

interface Props {
  node: DraftGroupNode;
  // Wider than `DraftGroupNode` — switching the structure to "single" (see
  // `StructureSwitcher`) collapses this group down to its one child leaf,
  // so the parent has to be ready to receive a `DraftLeafNode` here too.
  onChange: (next: DraftRuleNode) => void;
  onRemove?: () => void;
}

export function ConditionGroup({ node, onChange, onRemove }: Props) {
  const { translate: t } = useTranslation();
  const children = getDraftChildren(node);

  const updateChild = (index: number, next: DraftRuleNode) => {
    onChange(withDraftChildren(node, children.map((c, i) => (i === index ? next : c))));
  };
  const removeChild = (index: number) => {
    onChange(withDraftChildren(node, children.filter((_, i) => i !== index)));
  };
  const addCondition = (type: LeafRuleType) => {
    onChange(withDraftChildren(node, [...children, makeDraftLeaf(type)]));
  };
  const changeStructure = (type: StructureType) => onChange(withStructureType(node, type));

  return (
    <div className={styles.group}>
      <div className={styles.header}>
        <StructureSwitcher value={node.type} onChange={changeStructure} singleDisabled={children.length !== 1} />
        <span className={styles.headerText}>{t(DESC_KEY[node.type])}</span>
        {onRemove && (
          <RemoveIconButton onClick={onRemove} aria-label={t('conditionRow.removeCondition')} className={styles.removeBtn} />
        )}
      </div>

      <div className={styles.rows}>
        {children.length === 0 && <div className={styles.empty}>{t('conditionGroup.emptyError')}</div>}

        {children.map((child, i) =>
          isDraftGroup(child) ? (
            <div key={child.id} className={clsx(styles.nested, subtreeHasErrors(child) && styles.invalid)}>
              <ConditionGroup
                node={child}
                onChange={(next) => updateChild(i, next)}
                onRemove={() => removeChild(i)}
              />
            </div>
          ) : (
            <ConditionRow
              key={child.id}
              node={child}
              onChange={(next) => updateChild(i, next)}
              onRemove={() => removeChild(i)}
            />
          ),
        )}

        <div className={styles.addRow}>
          <AddConditionMenu onAdd={addCondition} />
        </div>
      </div>
    </div>
  );
}
