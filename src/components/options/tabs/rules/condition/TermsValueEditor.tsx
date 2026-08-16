import { Input } from '@/components/ui/input';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { DraftTermsRule } from '@/lib/visitor/rule-draft';
import styles from './TermsValueEditor.module.css';

interface Props {
  node: DraftTermsRule;
  onChange: (next: DraftTermsRule) => void;
}

export function TermsValueEditor({ node, onChange }: Props) {
  const { translate: t } = useTranslation();

  const setValues = (values: string[]) => onChange({ ...node, values });

  return (
    <div className={styles.chips}>
      {node.values.map((v, i) => (
        <div key={i} className={styles.chip}>
          <Input
            value={v}
            onChange={(e) => setValues(node.values.map((x, j) => (j === i ? e.target.value : x)))}
            className={styles.chipInput}
          />
          <RemoveIconButton
            onClick={() => setValues(node.values.filter((_, j) => j !== i))}
            aria-label={t('conditionRow.removeValue')}
          />
        </div>
      ))}
      <button onClick={() => setValues([...node.values, ''])} className={styles.addChip}>
        <IconPlus size="sm" />
        {t('conditionRow.addValue')}
      </button>
    </div>
  );
}
