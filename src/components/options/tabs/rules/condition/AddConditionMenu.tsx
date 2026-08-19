import type { ChangeEvent } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { RuleType } from '@/types/rule';
import type { TranslationKey } from '@/locale';
import { LEAF_LABELS, LEAF_TYPES } from './leafLabels';
import styles from './AddConditionMenu.module.css';

const GROUP_TYPES = [RuleType.AND, RuleType.OR, RuleType.NOT] as const;

const GROUP_ADD_LABEL_KEY: Record<(typeof GROUP_TYPES)[number], TranslationKey> = {
  [RuleType.AND]: 'leafType.addAnd',
  [RuleType.OR]: 'leafType.addOr',
  [RuleType.NOT]: 'leafType.addNot',
};

interface Props {
  onAdd: (type: RuleType) => void;
}

export function AddConditionMenu({ onAdd }: Props) {
  const { translate: t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as RuleType;
    onAdd(type);
    e.target.value = '';
  };

  return (
    <select value="" onChange={handleChange} className={styles.select}>
      <option value="" disabled>{t('leafType.addMenuPlaceholder')}</option>
      <optgroup label={t('leafType.addMenuConditionGroup')}>
        {LEAF_TYPES.map((type) => (
          <option key={type} value={type}>{t(LEAF_LABELS[type].addLabelKey)}</option>
        ))}
      </optgroup>
      <optgroup label={t('leafType.addMenuStructureGroup')}>
        {GROUP_TYPES.map((type) => (
          <option key={type} value={type}>{t(GROUP_ADD_LABEL_KEY[type])}</option>
        ))}
      </optgroup>
    </select>
  );
}
