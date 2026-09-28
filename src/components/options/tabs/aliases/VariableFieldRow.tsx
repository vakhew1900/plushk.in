import { css } from '@codemirror/lang-css';
import type { Extension } from '@codemirror/state';
import { Input } from '@/components/ui/input';
import { CodeInput } from '@/components/ui/code-input';
import { TypeSelect } from '@/components/ui/type-select';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import type { VariableFieldDraft } from '@/lib/page-match-mapping';
import { PageSelectorType } from '@/types/page-match';
import { xpathLanguage } from '@/components/options/code/xpathLanguage';
import styles from './VariableFieldRow.module.css';

const SELECTOR_TYPE_OPTIONS: PageSelectorType[] = [PageSelectorType.CSS, PageSelectorType.META, PageSelectorType.XPATH];

const SELECTOR_EXTENSIONS: Record<PageSelectorType, Extension[]> = {
  [PageSelectorType.CSS]:   [css()],
  [PageSelectorType.XPATH]: [xpathLanguage],
  [PageSelectorType.META]:  [],
};

interface Props {
  field: VariableFieldDraft;
  onKeyChange: (key: string) => void;
  onValueChange: (value: string) => void;
  onSelectorTypeChange: (selectorType: PageSelectorType) => void;
  onRemove: () => void;
}

export function VariableFieldRow({ field, onKeyChange, onValueChange, onSelectorTypeChange, onRemove }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <TypeSelect value={field.selectorType} options={SELECTOR_TYPE_OPTIONS} onChange={onSelectorTypeChange} />
      <Input
        value={field.k}
        onChange={(e) => onKeyChange(e.target.value)}
        placeholder={t('variablesSection.fieldKeyPlaceholder')}
        className={styles.keyInput}
      />
      <span className={styles.arrow}>→</span>
      <CodeInput
        value={field.v}
        onChange={onValueChange}
        extensions={SELECTOR_EXTENSIONS[field.selectorType]}
        placeholder={t('variablesSection.fieldValuePlaceholder')}
        className={styles.valueInput}
      />
      <RemoveIconButton onClick={onRemove} />
    </div>
  );
}
