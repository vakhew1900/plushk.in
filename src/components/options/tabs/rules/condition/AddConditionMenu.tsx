import type { ChangeEvent } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { LeafRuleType } from '@/lib/visitor/rule-draft';
import { LEAF_LABELS, LEAF_TYPES } from './leafLabels';
import styles from './AddConditionMenu.module.css';

interface Props {
  onAdd: (type: LeafRuleType) => void;
}

export function AddConditionMenu({ onAdd }: Props) {
  const { translate: t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as LeafRuleType;
    onAdd(type);
    e.target.value = '';
  };

  return (
    <select value="" onChange={handleChange} className={styles.select}>
      <option value="" disabled>{t('leafType.addMenuPlaceholder')}</option>
      {LEAF_TYPES.map((type) => (
        <option key={type} value={type}>{t(LEAF_LABELS[type].addLabelKey)}</option>
      ))}
    </select>
  );
}
