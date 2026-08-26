import { useTranslation } from '@/hooks/useTranslation';
import { TabHeader } from '@/components/options/TabHeader';
import { useDomainAliases } from '@/hooks/useDomainAliases';
import { usePageMatchGroups } from '@/hooks/usePageMatchGroups';
import { useIconRules } from '@/hooks/useIconRules';
import { AliasesSection } from './aliases/AliasesSection';
import { VariablesSection } from './aliases/VariablesSection';
import { IconRulesSection } from './icon-rules/IconRulesSection';
import styles from './MappingsTab.module.css';

// Both PageMatchGroup and IconRule carry an optional aliasId FK back to
// DomainAlias — a rule not bound via `bindingType: 'alias'` always has
// aliasId undefined (XOR invariant, see lib/validation/icon-rule.ts), so a
// plain equality check already excludes it without a bindingType check.
async function syncLocalRemoval<T extends { id: string; aliasId?: string }>(
  aliasId: string,
  items: T[],
  remove: (id: string) => Promise<void>,
): Promise<void> {
  const linked = items.find((item) => item.aliasId === aliasId);
  if (linked) await remove(linked.id);
}

export function MappingsTab() {
  const { translate: t } = useTranslation();
  const domainAliases = useDomainAliases();
  const pageMatchGroups = usePageMatchGroups();
  const iconRules = useIconRules();

  // All three sections read/write the same shared resources, sourced from
  // here instead of each calling its own hook instance — two independent
  // hook instances would each keep their own stale local copy (same root
  // cause as ARCH-12), so e.g. renaming an alias in AliasesSection wouldn't
  // show up in VariablesSection's/IconRulesSection's alias pickers.
  const removeAlias = async (id: string) => {
    await domainAliases.remove(id); // cascades the linked group and icon rule in Dexie (RULE-12/RULE-13)
    await syncLocalRemoval(id, pageMatchGroups.items, pageMatchGroups.remove); // sync local state to match
    await syncLocalRemoval(id, iconRules.items, iconRules.remove);
  };

  return (
    <div className={styles.wrap}>
      <TabHeader title={t('nav.mappings')} lead={t('mappingsTab.lead')} />

      <AliasesSection aliases={domainAliases.items} save={domainAliases.save} remove={removeAlias} />
      <VariablesSection
        aliases={domainAliases.items}
        groups={pageMatchGroups.items}
        saveGroup={pageMatchGroups.save}
        removeGroup={pageMatchGroups.remove}
      />
      <IconRulesSection
        aliases={domainAliases.items}
        rules={iconRules.items}
        save={iconRules.save}
        remove={iconRules.remove}
      />
    </div>
  );
}
