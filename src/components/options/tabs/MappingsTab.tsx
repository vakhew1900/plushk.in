import { useTranslation } from '@/hooks/useTranslation';
import { TabHeader } from '@/components/options/TabHeader';
import { useDomainAliases } from '@/hooks/useDomainAliases';
import { usePageMatchGroups } from '@/hooks/usePageMatchGroups';
import { AliasesSection } from './aliases/AliasesSection';
import { VariablesSection } from './aliases/VariablesSection';
import styles from './MappingsTab.module.css';

export function MappingsTab() {
  const { translate: t } = useTranslation();
  const domainAliases = useDomainAliases();
  const pageMatchGroups = usePageMatchGroups();

  // Both sections read/write the same two resources, shared from here
  // instead of each calling its own useDomainAliases()/usePageMatchGroups()
  // — two independent hook instances would each keep their own stale local
  // copy (same root cause as ARCH-12), so e.g. renaming an alias in
  // AliasesSection wouldn't show up in VariablesSection's alias picker.
  const removeAlias = async (id: string) => {
    const linkedGroup = pageMatchGroups.items.find((g) => g.aliasId === id);
    await domainAliases.remove(id); // cascades the linked group in Dexie (RULE-12)
    if (linkedGroup) await pageMatchGroups.remove(linkedGroup.id); // sync local state to match
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
    </div>
  );
}
