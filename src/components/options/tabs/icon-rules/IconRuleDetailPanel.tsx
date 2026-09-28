import { DetailField } from '@/components/ui/detail-field';
import { useTranslation } from '@/hooks/useTranslation';
import type { IconRule } from '@/types/icon-rule';
import { IconRuleNameField } from './IconRuleNameField';
import { IconRuleBindingField } from './IconRuleBindingField';
import { IconRuleSourceField } from './IconRuleSourceField';
import styles from './IconRuleDetailPanel.module.css';

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

  return (
    <div className={styles.panel}>
      <DetailField label={t('entityDetail.nameLabel')}>
        <IconRuleNameField
          name={rule.name}
          enabled={rule.enabled}
          onNameChange={(name) => onChange({ ...rule, name })}
          onEnabledChange={(enabled) => onChange({ ...rule, enabled })}
          onRemove={onRemove}
        />
      </DetailField>

      <DetailField label={t('iconRulesSection.bindingLabel')}>
        <IconRuleBindingField
          bindingType={rule.bindingType}
          bindingValue={rule.bindingValue}
          aliasId={rule.aliasId}
          aliasOptions={aliasOptions}
          onChange={(binding) => onChange({ ...rule, ...binding })}
        />
      </DetailField>

      <DetailField label={t('iconRulesSection.sourceLabel')}>
        <IconRuleSourceField source={rule.source} onChange={(source) => onChange({ ...rule, source })} />
      </DetailField>
    </div>
  );
}
