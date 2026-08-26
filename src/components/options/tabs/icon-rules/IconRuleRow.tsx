import { css } from '@codemirror/lang-css';
import type { Extension } from '@codemirror/state';
import { Input } from '@/components/ui/input';
import { CodeInput } from '@/components/ui/code-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import { xpathLanguage } from '@/components/options/code/xpathLanguage';
import { IconRuleBindingType, IconSourceType, type IconRule, type IconSource } from '@/types/icon-rule';
import { IconBindingTypeToggle } from './IconBindingTypeToggle';
import { IconSourceTypeToggle } from './IconSourceTypeToggle';
import styles from './IconRuleRow.module.css';

const SOURCE_EXTENSIONS: Record<IconSourceType, Extension[]> = {
  [IconSourceType.STATIC]: [],
  [IconSourceType.CSS]:    [css()],
  [IconSourceType.XPATH]:  [xpathLanguage],
};

function emptySource(type: IconSourceType): IconSource {
  switch (type) {
    case IconSourceType.STATIC: return { type, value: '' };
    case IconSourceType.CSS:    return { type, value: '' };
    case IconSourceType.XPATH:  return { type, value: '' };
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

export function IconRuleRow({ rule, aliasOptions, onChange, onRemove }: Props) {
  const { translate: t } = useTranslation();

  const changeBindingType = (bindingType: IconRuleBindingType) => {
    if (bindingType === IconRuleBindingType.ALIAS) {
      onChange({ ...rule, bindingType, bindingValue: undefined, aliasId: aliasOptions[0]?.id });
    } else {
      onChange({ ...rule, bindingType, bindingValue: '', aliasId: undefined });
    }
  };

  const changeSourceType = (type: IconSourceType) => onChange({ ...rule, source: emptySource(type) });
  const changeSourceValue = (value: string) => onChange({ ...rule, source: { ...rule.source, value } });

  return (
    <div className={styles.row}>
      <div className={styles.head}>
        <Input
          value={rule.name}
          onChange={(e) => onChange({ ...rule, name: e.target.value })}
          placeholder={t('iconRulesSection.namePlaceholder')}
          className={styles.nameInput}
        />
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

        <Switch
          checked={rule.enabled}
          onCheckedChange={(enabled) => onChange({ ...rule, enabled })}
          className={styles.enabledSwitch}
        />
        <RemoveIconButton onClick={onRemove} />
      </div>

      <div className={styles.sourceRow}>
        <IconSourceTypeToggle value={rule.source.type} onChange={changeSourceType} />
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
  );
}
