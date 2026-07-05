import { useTranslation } from '@/hooks/useTranslation';
import styles from './VariableBlock.module.css';

interface Field { k: string; v: string }
interface Props { name: string; fields: Field[] }

export function VariableBlock({ name, fields }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.variableBlock}>
      <div className={styles.variableHead}>
        <span className={styles.variableName}>{name}</span>
        <span className={styles.variableCount}>{t('variablesSection.fieldsCount', { count: fields.length })}</span>
      </div>
      {fields.map((f) => (
        <div key={f.k} className={styles.fieldRow}>
          <span className={styles.fieldKey}>{f.k}</span>
          <span className={styles.fieldArrow}>→</span>
          <span className={styles.fieldValue}>{f.v}</span>
        </div>
      ))}
    </div>
  );
}
