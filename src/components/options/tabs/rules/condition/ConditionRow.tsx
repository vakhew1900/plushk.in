import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import { DraftRuleError, StructureType, validateLeafNode, withStructureType } from '@/lib/visitor/rule-draft';
import type { DraftLeafNode, DraftRuleNode } from '@/lib/visitor/rule-draft';
import type { TranslationKey } from '@/locale';
import { FieldPicker } from './FieldPicker';
import { LeafValueEditor } from './LeafValueEditor';
import { StructureSwitcher } from './StructureSwitcher';
import { LEAF_LABELS } from './leafLabels';
import styles from './ConditionRow.module.css';

const ERROR_LABEL_KEY: Record<DraftRuleError, TranslationKey> = {
  [DraftRuleError.FIELD_REQUIRED]: 'conditionRow.errorFieldRequired',
  [DraftRuleError.VALUE_REQUIRED]: 'conditionRow.errorValueRequired',
  [DraftRuleError.VALUES_REQUIRED]: 'conditionRow.errorValuesRequired',
  [DraftRuleError.PATTERN_REQUIRED]: 'conditionRow.errorPatternRequired',
};

interface Props {
  node: DraftLeafNode;
  // Wider than `DraftLeafNode` — picking AND/OR/NOT from `StructureSwitcher`
  // wraps this leaf into a new group, so the parent has to be ready to
  // receive a `DraftGroupNode` here too (see `ConditionGroup.updateChild`).
  onChange: (next: DraftRuleNode) => void;
  onRemove?: () => void;
}

export function ConditionRow({ node, onChange, onRemove }: Props) {
  const { translate: t } = useTranslation();
  const errors = validateLeafNode(node);

  const changeStructure = (type: StructureType) => onChange(withStructureType(node, type));

  return (
    <div className={styles.row}>
      <div className={styles.header}>
        <StructureSwitcher value={StructureType.SINGLE} onChange={changeStructure} />
      </div>
      <div className={styles.main}>
        <FieldPicker value={node.field} onChange={(field) => onChange({ ...node, field })} />
        <span className={styles.op}>{t(LEAF_LABELS[node.type].opLabelKey)}</span>
        <LeafValueEditor node={node} onChange={onChange} />
        {onRemove && (
          <RemoveIconButton onClick={onRemove} aria-label={t('conditionRow.removeCondition')} className={styles.removeBtn} />
        )}
      </div>
      {errors.length > 0 && <span className={styles.error}>{t(ERROR_LABEL_KEY[errors[0]])}</span>}
    </div>
  );
}
