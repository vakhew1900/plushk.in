import { css } from '@codemirror/lang-css';
import type { Extension } from '@codemirror/state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodeInput } from '@/components/ui/code-input';
import { Badge } from '@/components/ui/badge';
import type { BadgeVariant } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { VariableFieldDraft } from '@/lib/page-match-mapping';
import { PageSelectorType } from '@/types/page-match';
import { xpathLanguage } from '@/components/options/code/xpathLanguage';
import { SelectorTypeToggle } from './SelectorTypeToggle';
import styles from './VariableBlock.module.css';

const SELECTOR_EXTENSIONS: Record<PageSelectorType, Extension[]> = {
  [PageSelectorType.CSS]:   [css()],
  [PageSelectorType.XPATH]: [xpathLanguage],
  [PageSelectorType.META]:  [],
};

const SELECTOR_BADGE_VARIANT: Record<PageSelectorType, BadgeVariant> = {
  [PageSelectorType.CSS]:   'blue',
  [PageSelectorType.XPATH]: 'accent',
  [PageSelectorType.META]:  'green',
};

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

export function VariableBlock({
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
    <div className={styles.variableBlock}>
      <div className={styles.variableHead}>
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
            <Badge variant={SELECTOR_BADGE_VARIANT[f.selectorType]} className={styles.selectorBadge}>
              {f.selectorType}
            </Badge>
            <CodeInput
              value={f.v}
              onChange={(v) => onFieldValueChange(i, v)}
              extensions={SELECTOR_EXTENSIONS[f.selectorType]}
              placeholder={t('variablesSection.fieldValuePlaceholder')}
              className={styles.fieldValueInput}
            />
            <RemoveIconButton onClick={() => onRemoveField(i)} />
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
