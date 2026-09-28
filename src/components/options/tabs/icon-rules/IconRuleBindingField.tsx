import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { IconRuleBindingType } from '@/types/icon-rule';
import { IconBindingTypeToggle } from './IconBindingTypeToggle';
import type { AliasOption } from './IconRuleDetailPanel';
import styles from './IconRuleBindingField.module.css';

interface BindingState {
  bindingType: IconRuleBindingType;
  bindingValue?: string;
  aliasId?: string;
}

interface Props {
  bindingType: IconRuleBindingType;
  bindingValue?: string;
  aliasId?: string;
  aliasOptions: AliasOption[];
  onChange: (binding: BindingState) => void;
}

export function IconRuleBindingField({ bindingType, bindingValue, aliasId, aliasOptions, onChange }: Props) {
  const { translate: t } = useTranslation();

  const changeBindingType = (type: IconRuleBindingType) => {
    if (type === IconRuleBindingType.ALIAS) {
      onChange({ bindingType: type, bindingValue: undefined, aliasId: aliasId ?? aliasOptions[0]?.id });
    } else {
      // URL/Domain both key off the same free-text `bindingValue` — switching
      // between them keeps whatever was typed instead of wiping it.
      onChange({ bindingType: type, bindingValue: bindingValue ?? '', aliasId: undefined });
    }
  };

  return (
    <div className={styles.row}>
      <IconBindingTypeToggle value={bindingType} onChange={changeBindingType} />

      {bindingType === IconRuleBindingType.ALIAS ? (
        <Select value={aliasId ?? ''} onValueChange={(id) => onChange({ bindingType, aliasId: id })}>
          <SelectTrigger className={styles.valueInput}>
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
          value={bindingValue ?? ''}
          onChange={(e) => onChange({ bindingType, bindingValue: e.target.value })}
          placeholder={
            bindingType === IconRuleBindingType.URL
              ? t('iconRulesSection.bindingValueUrlPlaceholder')
              : t('iconRulesSection.bindingValueDomainPlaceholder')
          }
          className={styles.valueInput}
        />
      )}
    </div>
  );
}
