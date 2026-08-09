import { useTranslation } from '@/hooks/useTranslation';
import { DraftRuleError, validateLeafNode } from '@/lib/visitor/rule-draft';
import type { DraftLeafNode } from '@/lib/visitor/rule-draft';
import type { TranslationKey } from '@/locale';
import { FieldPicker } from './FieldPicker';
import { LeafValueEditor } from './LeafValueEditor';
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
  onChange: (next: DraftLeafNode) => void;
  onRemove?: () => void;
}

export function ConditionRow({ node, onChange, onRemove }: Props) {
  const { translate: t } = useTranslation();
  const errors = validateLeafNode(node);

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <FieldPicker value={node.field} onChange={(field) => onChange({ ...node, field })} />
        <span className={styles.op}>{t(LEAF_LABELS[node.type].opLabelKey)}</span>
        <LeafValueEditor node={node} onChange={onChange} />
        {onRemove && (
          <button onClick={onRemove} className={styles.removeBtn} aria-label={t('conditionRow.removeCondition')}>
            ×
          </button>
        )}
      </div>
      {errors.length > 0 && <span className={styles.error}>{t(ERROR_LABEL_KEY[errors[0]])}</span>}
    </div>
  );
}
