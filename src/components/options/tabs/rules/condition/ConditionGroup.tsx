import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { DraftGroupNode, DraftRuleNode } from '@/lib/visitor/rule-draft';
import {
  getDraftChildren,
  isDraftGroup,
  makeDraftGroup,
  makeDraftLeaf,
  subtreeHasErrors,
  withDraftChildren,
  withDraftGroupType,
} from '@/lib/visitor/rule-draft';
import type { LeafRuleType } from '@/lib/visitor/rule-draft';
import { RuleType } from '@/types/rule';
import type { TranslationKey } from '@/locale';
import { GroupTypeSwitcher } from './GroupTypeSwitcher';
import { AddConditionMenu } from './AddConditionMenu';
import { ConditionRow } from './ConditionRow';
import styles from './ConditionGroup.module.css';

const DESC_KEY: Record<typeof RuleType.AND | typeof RuleType.OR | typeof RuleType.NOT, TranslationKey> = {
  [RuleType.AND]: 'conditionGroup.andDesc',
  [RuleType.OR]: 'conditionGroup.orDesc',
  [RuleType.NOT]: 'conditionGroup.notDesc',
};

const BORDER_CLASS: Record<typeof RuleType.AND | typeof RuleType.OR | typeof RuleType.NOT, string> = {
  [RuleType.AND]: styles.and,
  [RuleType.OR]: styles.or,
  [RuleType.NOT]: styles.not,
};

interface Props {
  node: DraftGroupNode;
  onChange: (next: DraftGroupNode) => void;
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
  const addGroup = () => {
    onChange(withDraftChildren(node, [...children, makeDraftGroup(RuleType.AND)]));
  };

  return (
    <div className={clsx(styles.group, BORDER_CLASS[node.type])}>
      <div className={styles.header}>
        <GroupTypeSwitcher value={node.type} onChange={(type) => onChange(withDraftGroupType(node, type))} />
        <span className={styles.headerText}>{t(DESC_KEY[node.type])}</span>
        {onRemove && (
          <button onClick={onRemove} className={styles.removeBtn}>
            ×
          </button>
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
          <Button variant="dashed" size="sm" onClick={addGroup}>
            <IconPlus size="sm" />
            {t('conditionGroup.addGroup')}
          </Button>
        </div>
      </div>
    </div>
  );
}
