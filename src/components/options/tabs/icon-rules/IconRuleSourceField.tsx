import { css } from '@codemirror/lang-css';
import type { Extension } from '@codemirror/state';
import { CodeInput } from '@/components/ui/code-input';
import { TypeSelect } from '@/components/ui/type-select';
import { useTranslation } from '@/hooks/useTranslation';
import { xpathLanguage } from '@/components/options/code/xpathLanguage';
import { IconSourceType, type IconSource } from '@/types/icon-rule';
import styles from './IconRuleSourceField.module.css';

const SOURCE_TYPE_OPTIONS: IconSourceType[] = [IconSourceType.STATIC, IconSourceType.CSS, IconSourceType.XPATH];

const SOURCE_EXTENSIONS: Record<IconSourceType, Extension[]> = {
  [IconSourceType.STATIC]: [],
  [IconSourceType.CSS]:    [css()],
  [IconSourceType.XPATH]:  [xpathLanguage],
};

// Switching type only ever changes how `value` is interpreted, never the text
// itself — a user toggling CSS↔XPath while comparing selectors shouldn't lose
// what they typed (same reasoning as VariableFieldRow, which already
// preserves `v` across `selectorType` changes).
function withSourceType(source: IconSource, type: IconSourceType): IconSource {
  switch (type) {
    case IconSourceType.STATIC: return { type, value: source.value };
    case IconSourceType.CSS:    return { type, value: source.value };
    case IconSourceType.XPATH:  return { type, value: source.value };
  }
}

interface Props {
  source: IconSource;
  onChange: (source: IconSource) => void;
}

export function IconRuleSourceField({ source, onChange }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <TypeSelect
        value={source.type}
        options={SOURCE_TYPE_OPTIONS}
        onChange={(type) => onChange(withSourceType(source, type))}
      />
      <CodeInput
        value={source.value}
        onChange={(value) => onChange({ ...source, value })}
        extensions={SOURCE_EXTENSIONS[source.type]}
        placeholder={
          source.type === IconSourceType.STATIC
            ? t('iconRulesSection.sourceValueStaticPlaceholder')
            : t('iconRulesSection.sourceValueSelectorPlaceholder')
        }
        className={styles.valueInput}
      />
    </div>
  );
}
