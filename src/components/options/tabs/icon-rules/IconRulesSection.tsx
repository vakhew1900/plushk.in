import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { IconRuleBindingType, IconSourceType, type IconRule } from '@/types/icon-rule';
import type { DomainAlias } from '@/types/domain-alias';
import { IconRuleRow } from './IconRuleRow';
import type { AliasOption } from './IconRuleRow';
import styles from './IconRulesSection.module.css';

interface Props {
  aliases: DomainAlias[];
  rules: IconRule[];
  save: (rule: IconRule) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function IconRulesSection({ aliases, rules, save, remove }: Props) {
  const { translate: t } = useTranslation();

  // At most one alias-bound rule per alias, same 1:1 constraint as
  // VariablesSection/PageMatchGroup (RULE-13) — an alias already claimed by
  // another rule isn't offered again.
  const usedAliasIds = new Set(
    rules.filter((r) => r.bindingType === IconRuleBindingType.ALIAS && r.aliasId).map((r) => r.aliasId),
  );

  const addRule = () => {
    const rule: IconRule = {
      id: crypto.randomUUID(),
      name: '',
      bindingType: IconRuleBindingType.URL,
      bindingValue: '',
      source: { type: IconSourceType.STATIC, value: '' },
      enabled: true,
    };
    void save(rule);
  };

  const aliasOptionsFor = (rule: IconRule): AliasOption[] =>
    aliases.filter((a) => a.id === rule.aliasId || !usedAliasIds.has(a.id));

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text as="h2" size="subheading">{t('iconRulesSection.title')}</Text>
        <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }} onClick={addRule}>
          <IconPlus size="sm" />
          {t('iconRulesSection.addRule')}
        </Button>
      </div>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{t('iconRulesSection.desc')}</Text>
      <div className={styles.ruleList}>
        {rules.map((rule) => (
          <IconRuleRow
            key={rule.id}
            rule={rule}
            aliasOptions={aliasOptionsFor(rule)}
            onChange={(next) => void save(next)}
            onRemove={() => void remove(rule.id)}
          />
        ))}
      </div>
    </section>
  );
}
