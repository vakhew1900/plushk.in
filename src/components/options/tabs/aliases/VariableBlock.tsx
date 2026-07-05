import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './VariableBlock.module.css';

interface Field { k: string; v: string }
interface Props {
  name: string;
  fields: Field[];
  onNameChange: (name: string) => void;
  onFieldKeyChange: (index: number, key: string) => void;
  onFieldValueChange: (index: number, value: string) => void;
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onRemove: () => void;
}

export function VariableBlock({
  name,
  fields,
  onNameChange,
  onFieldKeyChange,
  onFieldValueChange,
  onAddField,
  onRemoveField,
  onRemove,
}: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.variableBlock}>
      <div className={styles.variableHead}>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('variablesSection.namePlaceholder')}
          className={styles.variableNameInput}
        />
        <span className={styles.variableCount}>{t('variablesSection.fieldsCount', { count: fields.length })}</span>
        <button onClick={onRemove} className={styles.removeBlock}>×</button>
      </div>

      <div className={styles.fields}>
        {fields.map((f, i) => (
          <div key={i} className={styles.fieldRow}>
            <Input
              value={f.k}
              onChange={(e) => onFieldKeyChange(i, e.target.value)}
              placeholder={t('variablesSection.fieldKeyPlaceholder')}
              className={styles.fieldKeyInput}
            />
            <span className={styles.fieldArrow}>→</span>
            <Input
              value={f.v}
              onChange={(e) => onFieldValueChange(i, e.target.value)}
              placeholder={t('variablesSection.fieldValuePlaceholder')}
              className={styles.fieldValueInput}
            />
            <button onClick={() => onRemoveField(i)} className={styles.removeField}>×</button>
          </div>
        ))}
        <Button variant="dashed" size="sm" style={{ alignSelf: 'flex-start' }} onClick={onAddField}>
          <IconPlus size={11} />
          {t('variablesSection.addField')}
        </Button>
      </div>
    </div>
  );
}
