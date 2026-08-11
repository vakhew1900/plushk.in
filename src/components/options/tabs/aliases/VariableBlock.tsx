import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodeInput } from '@/components/ui/code-input';
import { IconPlus, IconX } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { VariableFieldDraft } from '@/lib/page-match-mapping';
import { SelectorTypeToggle } from './SelectorTypeToggle';
import styles from './VariableBlock.module.css';

interface Props {
  name: string;
  fields: VariableFieldDraft[];
  onNameChange: (name: string) => void;
  onFieldKeyChange: (index: number, key: string) => void;
  onFieldValueChange: (index: number, value: string) => void;
  onFieldSelectorTypeChange: (index: number, selectorType: VariableFieldDraft['selectorType']) => void;
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
  onFieldSelectorTypeChange,
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
        <button onClick={onRemove} className={styles.removeBlock}><IconX size="sm" /></button>
      </div>

      <div className={styles.fields}>
        {fields.map((f, i) => (
          <div key={i} className={styles.fieldRow}>
            <SelectorTypeToggle
              value={f.selectorType}
              onChange={(selectorType) => onFieldSelectorTypeChange(i, selectorType)}
            />
            <Input
              value={f.k}
              onChange={(e) => onFieldKeyChange(i, e.target.value)}
              placeholder={t('variablesSection.fieldKeyPlaceholder')}
              className={styles.fieldKeyInput}
            />
            <span className={styles.fieldArrow}>→</span>
            <CodeInput
              value={f.v}
              onChange={(v) => onFieldValueChange(i, v)}
              placeholder={t('variablesSection.fieldValuePlaceholder')}
              className={styles.fieldValueInput}
            />
            <button onClick={() => onRemoveField(i)} className={styles.removeField}><IconX size="sm" /></button>
          </div>
        ))}
        <Button variant="dashed" size="sm" style={{ alignSelf: 'flex-start' }} onClick={onAddField}>
          <IconPlus size="sm" />
          {t('variablesSection.addField')}
        </Button>
      </div>
    </div>
  );
}
