import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ListDetailSection } from '@/components/options/list-detail/ListDetailSection';
import type { DomainAlias } from '@/types/domain-alias';
import { AliasDetailPanel } from './AliasDetailPanel';

interface Props {
  aliases: DomainAlias[];
  save: (alias: DomainAlias) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function AliasesSection({ aliases, save, remove }: Props) {
  const { translate: t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const selected = aliases.find((a) => a.id === selectedId) ?? aliases[0];

  const addAlias = () => {
    const alias: DomainAlias = { id: crypto.randomUUID(), name: '', domain_names: [] };
    void save(alias);
    setSelectedId(alias.id);
  };

  const renameAlias = (id: string, name: string) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) void save({ ...alias, name });
  };

  const addDomain = (id: string) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) void save({ ...alias, domain_names: [...alias.domain_names, ''] });
  };

  const updateDomain = (id: string, index: number, domain: string) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) {
      void save({ ...alias, domain_names: alias.domain_names.map((d, i) => (i === index ? domain : d)) });
    }
  };

  const removeDomain = (id: string, index: number) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) void save({ ...alias, domain_names: alias.domain_names.filter((_, i) => i !== index) });
  };

  const deleteAlias = (id: string) => {
    void remove(id);
    if (selected?.id === id) setSelectedId(undefined);
  };

  return (
    <ListDetailSection
      title={t('aliasesSection.title')}
      desc={t('aliasesSection.desc')}
      items={aliases}
      getId={(a) => a.id}
      getName={(a) => a.name || t('aliasesSection.namePlaceholder')}
      selectedId={selected?.id}
      onSelect={setSelectedId}
      onAdd={addAlias}
      addLabel={t('common.add')}
      searchPlaceholder={t('common.searchPlaceholder')}
      noResultsLabel={t('common.noSearchResults')}
      emptyLabel={t('aliasesSection.noAliases')}
    >
      {selected && (
        <AliasDetailPanel
          name={selected.name}
          domains={selected.domain_names}
          onNameChange={(name) => renameAlias(selected.id, name)}
          onDomainChange={(index, domain) => updateDomain(selected.id, index, domain)}
          onAddDomain={() => addDomain(selected.id)}
          onRemoveDomain={(index) => removeDomain(selected.id, index)}
          onRemove={() => deleteAlias(selected.id)}
        />
      )}
    </ListDetailSection>
  );
}
