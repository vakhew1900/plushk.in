import { Button } from '@/components/ui/button';
import { DetailField } from '@/components/ui/detail-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { VariableFieldDraft } from '@/lib/page-match-mapping';
import { VariableFieldRow } from './VariableFieldRow';
import styles from './VariableDetailPanel.module.css';

export interface AliasOption {
  id: string;
  name: string;
}

interface Props {
  aliasId: string;
  aliasOptions: AliasOption[];
  fields: VariableFieldDraft[];
  onAliasChange: (aliasId: string) => void;
  onFieldKeyChange: (index: number, key: string) => void;
  onFieldValueChange: (index: number, value: string) => void;
  onFieldSelectorTypeChange: (index: number, selectorType: VariableFieldDraft['selectorType']) => void;
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onRemove: () => void;
}

export function VariableDetailPanel({
  aliasId,
  aliasOptions,
  fields,
  onAliasChange,
  onFieldKeyChange,
  onFieldValueChange,
  onFieldSelectorTypeChange,
  onAddField,
  onRemoveField,
  onRemove,
}: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.panel}>
      <DetailField label={t('variablesSection.aliasLabel')}>
        <div className={styles.aliasRow}>
          <Select value={aliasId} onValueChange={onAliasChange}>
            <SelectTrigger className={styles.aliasSelectTrigger}>
              <SelectValue placeholder={t('variablesSection.aliasPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {aliasOptions.map((alias) => (
                <SelectItem key={alias.id} value={alias.id}>
                  {alias.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className={styles.variableCount}>{t('variablesSection.fieldsCount', { count: fields.length })}</span>
          <RemoveIconButton onClick={onRemove} className={styles.removeBlock} />
        </div>
      </DetailField>

      <DetailField label={t('variablesSection.fieldsLabel')}>
        <div className={styles.fields}>
          {fields.map((f, i) => (
            <VariableFieldRow
              key={i}
              field={f}
              onKeyChange={(k) => onFieldKeyChange(i, k)}
              onValueChange={(v) => onFieldValueChange(i, v)}
              onSelectorTypeChange={(selectorType) => onFieldSelectorTypeChange(i, selectorType)}
              onRemove={() => onRemoveField(i)}
            />
          ))}
          <Button variant="dashed" size="sm" className={styles.addField} onClick={onAddField}>
            <IconPlus size="sm" />
            {t('variablesSection.addField')}
          </Button>
        </div>
      </DetailField>
    </div>
  );
}
