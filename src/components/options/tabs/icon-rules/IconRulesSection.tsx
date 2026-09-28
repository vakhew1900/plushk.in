import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ListDetailSection } from '@/components/options/list-detail/ListDetailSection';
import { IconRuleBindingType, IconSourceType, type IconRule } from '@/types/icon-rule';
import type { DomainAlias } from '@/types/domain-alias';
import { IconRuleDetailPanel } from './IconRuleDetailPanel';
import type { AliasOption } from './IconRuleDetailPanel';

interface Props {
  aliases: DomainAlias[];
  rules: IconRule[];
  save: (rule: IconRule) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function IconRulesSection({ aliases, rules, save, remove }: Props) {
  const { translate: t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const selected = rules.find((r) => r.id === selectedId) ?? rules[0];

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
    setSelectedId(rule.id);
  };

  const deleteRule = (id: string) => {
    void remove(id);
    if (selected?.id === id) setSelectedId(undefined);
  };

  const aliasOptionsFor = (rule: IconRule): AliasOption[] =>
    aliases.filter((a) => a.id === rule.aliasId || !usedAliasIds.has(a.id));

  return (
    <ListDetailSection
      title={t('iconRulesSection.title')}
      desc={t('iconRulesSection.desc')}
      items={rules}
      getId={(r) => r.id}
      getName={(r) => r.name || t('iconRulesSection.namePlaceholder')}
      selectedId={selected?.id}
      onSelect={setSelectedId}
      onAdd={addRule}
      addLabel={t('common.add')}
      searchPlaceholder={t('common.searchPlaceholder')}
      noResultsLabel={t('common.noSearchResults')}
      emptyLabel={t('iconRulesSection.noRules')}
    >
      {selected && (
        <IconRuleDetailPanel
          rule={selected}
          aliasOptions={aliasOptionsFor(selected)}
          onChange={(next) => void save(next)}
          onRemove={() => deleteRule(selected.id)}
        />
      )}
    </ListDetailSection>
  );
}
