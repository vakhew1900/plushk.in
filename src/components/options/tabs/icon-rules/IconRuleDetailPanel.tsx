import { css } from '@codemirror/lang-css';
import type { Extension } from '@codemirror/state';
import { Input } from '@/components/ui/input';
import { CodeInput } from '@/components/ui/code-input';
import { TypeSelect } from '@/components/ui/type-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import { xpathLanguage } from '@/components/options/code/xpathLanguage';
import { IconRuleBindingType, IconSourceType, type IconRule, type IconSource } from '@/types/icon-rule';
import { IconBindingTypeToggle } from './IconBindingTypeToggle';
import styles from './IconRuleDetailPanel.module.css';

const SOURCE_TYPE_OPTIONS: IconSourceType[] = [IconSourceType.STATIC, IconSourceType.CSS, IconSourceType.XPATH];

const SOURCE_EXTENSIONS: Record<IconSourceType, Extension[]> = {
  [IconSourceType.STATIC]: [],
  [IconSourceType.CSS]:    [css()],
  [IconSourceType.XPATH]:  [xpathLanguage],
};

// Switching type only ever changes how `value` is interpreted, never the text
// itself — a user toggling CSS↔XPath while comparing selectors shouldn't lose
// what they typed (same reasoning as VariablesSection's field rows, which
// already preserve `v` across `selectorType` changes).
function withSourceType(source: IconSource, type: IconSourceType): IconSource {
  switch (type) {
    case IconSourceType.STATIC: return { type, value: source.value };
    case IconSourceType.CSS:    return { type, value: source.value };
    case IconSourceType.XPATH:  return { type, value: source.value };
  }
}

export interface AliasOption {
  id: string;
  name: string;
}

interface Props {
  rule: IconRule;
  aliasOptions: AliasOption[];
  onChange: (rule: IconRule) => void;
  onRemove: () => void;
}

export function IconRuleDetailPanel({ rule, aliasOptions, onChange, onRemove }: Props) {
  const { translate: t } = useTranslation();

  const changeBindingType = (bindingType: IconRuleBindingType) => {
    if (bindingType === IconRuleBindingType.ALIAS) {
      onChange({ ...rule, bindingType, bindingValue: undefined, aliasId: rule.aliasId ?? aliasOptions[0]?.id });
    } else {
      // URL/Domain both key off the same free-text `bindingValue` — switching
      // between them keeps whatever was typed instead of wiping it.
      onChange({ ...rule, bindingType, bindingValue: rule.bindingValue ?? '', aliasId: undefined });
    }
  };

  const changeSourceType = (type: IconSourceType) => onChange({ ...rule, source: withSourceType(rule.source, type) });
  const changeSourceValue = (value: string) => onChange({ ...rule, source: { ...rule.source, value } });

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <span className={styles.label}>{t('entityDetail.nameLabel')}</span>
        <div className={styles.nameRow}>
          <Input
            value={rule.name}
            onChange={(e) => onChange({ ...rule, name: e.target.value })}
            onBlur={() => { if (!rule.name.trim()) onRemove(); }}
            placeholder={t('iconRulesSection.namePlaceholder')}
            className={styles.nameInput}
          />
          <Switch checked={rule.enabled} onCheckedChange={(enabled) => onChange({ ...rule, enabled })} />
          <RemoveIconButton onClick={onRemove} />
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t('iconRulesSection.bindingLabel')}</span>
        <div className={styles.bindingRow}>
          <IconBindingTypeToggle value={rule.bindingType} onChange={changeBindingType} />

          {rule.bindingType === IconRuleBindingType.ALIAS ? (
            <Select value={rule.aliasId ?? ''} onValueChange={(aliasId) => onChange({ ...rule, aliasId })}>
              <SelectTrigger className={styles.bindingValueInput}>
                <SelectValue placeholder={t('iconRulesSection.aliasPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {aliasOptions.map((alias) => (
                  <SelectItem key={alias.id} value={alias.id}>
                    {alias.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={rule.bindingValue ?? ''}
              onChange={(e) => onChange({ ...rule, bindingValue: e.target.value })}
              placeholder={
                rule.bindingType === IconRuleBindingType.URL
                  ? t('iconRulesSection.bindingValueUrlPlaceholder')
                  : t('iconRulesSection.bindingValueDomainPlaceholder')
              }
              className={styles.bindingValueInput}
            />
          )}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t('iconRulesSection.sourceLabel')}</span>
        <div className={styles.sourceRow}>
          <TypeSelect value={rule.source.type} options={SOURCE_TYPE_OPTIONS} onChange={changeSourceType} />
          <CodeInput
            value={rule.source.value}
            onChange={changeSourceValue}
            extensions={SOURCE_EXTENSIONS[rule.source.type]}
            placeholder={
              rule.source.type === IconSourceType.STATIC
                ? t('iconRulesSection.sourceValueStaticPlaceholder')
                : t('iconRulesSection.sourceValueSelectorPlaceholder')
            }
            className={styles.sourceValueInput}
          />
        </div>
      </div>
    </div>
  );
}
