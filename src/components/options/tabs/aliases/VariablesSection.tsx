import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ListDetailSection } from '@/components/options/list-detail/ListDetailSection';
import { DEFAULT_SELECTOR_TYPE, fromPageMatchGroup, toPageMatchGroup } from '@/lib/page-match-mapping';
import type { VariableFieldDraft, VariableGroupDraft } from '@/lib/page-match-mapping';
import type { DomainAlias } from '@/types/domain-alias';
import type { PageMatchGroup } from '@/types/page-match';
import { VariableDetailPanel } from './VariableDetailPanel';
import type { AliasOption } from './VariableDetailPanel';

interface Props {
  aliases: DomainAlias[];
  groups: PageMatchGroup[];
  saveGroup: (group: PageMatchGroup) => Promise<void>;
  removeGroup: (id: string) => Promise<void>;
}

export function VariablesSection({ aliases, groups: rawGroups, saveGroup, removeGroup }: Props) {
  const { translate: t } = useTranslation();
  const groups = rawGroups.map(fromPageMatchGroup);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const selected = groups.find((g) => g.id === selectedId) ?? groups[0];

  // At most one group per alias — an alias already claimed by another group
  // isn't offered again (RULE-12).
  const usedAliasIds = new Set(groups.map((g) => g.aliasId));
  const unclaimedAliases = aliases.filter((a) => !usedAliasIds.has(a.id));

  const saveDraft = (draft: VariableGroupDraft) => saveGroup(toPageMatchGroup(draft));

  const canAddGroup = unclaimedAliases.length > 0;
  const addGroup = () => {
    if (!canAddGroup) return;
    const draft: VariableGroupDraft = { id: crypto.randomUUID(), aliasId: unclaimedAliases[0].id, fields: [] };
    void saveDraft(draft);
    setSelectedId(draft.id);
  };

  const changeAlias = (id: string, aliasId: string) => {
    const group = groups.find((g) => g.id === id);
    if (group) void saveDraft({ ...group, aliasId });
  };

  const addField = (id: string) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      const field: VariableFieldDraft = { k: '', v: '', selectorType: DEFAULT_SELECTOR_TYPE };
      void saveDraft({ ...group, fields: [...group.fields, field] });
    }
  };

  const updateField = (id: string, index: number, patch: Partial<VariableFieldDraft>) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      void saveDraft({ ...group, fields: group.fields.map((f, i) => (i === index ? { ...f, ...patch } : f)) });
    }
  };

  const removeField = (id: string, index: number) => {
    const group = groups.find((g) => g.id === id);
    if (group) void saveDraft({ ...group, fields: group.fields.filter((_, i) => i !== index) });
  };

  const deleteGroup = (id: string) => {
    void removeGroup(id);
    if (selected?.id === id) setSelectedId(undefined);
  };

  // A group's own current alias stays selectable alongside every alias no
  // other group has claimed yet.
  const aliasOptionsFor = (group: VariableGroupDraft): AliasOption[] =>
    aliases.filter((a) => a.id === group.aliasId || !usedAliasIds.has(a.id));

  const getAliasName = (group: VariableGroupDraft) =>
    aliases.find((a) => a.id === group.aliasId)?.name || t('variablesSection.aliasPlaceholder');

  return (
    <ListDetailSection
      title={t('variablesSection.title')}
      desc={t('variablesSection.desc')}
      items={groups}
      getId={(g) => g.id}
      getName={getAliasName}
      selectedId={selected?.id}
      onSelect={setSelectedId}
      onAdd={addGroup}
      addLabel={t('common.add')}
      addDisabled={!canAddGroup}
      addDisabledHint={t('variablesSection.addGroupDisabledHint')}
      searchPlaceholder={t('common.searchPlaceholder')}
      noResultsLabel={t('common.noSearchResults')}
      emptyLabel={t('variablesSection.noGroups')}
    >
      {selected && (
        <VariableDetailPanel
          aliasId={selected.aliasId}
          aliasOptions={aliasOptionsFor(selected)}
          fields={selected.fields}
          onAliasChange={(aliasId) => changeAlias(selected.id, aliasId)}
          onFieldKeyChange={(index, k) => updateField(selected.id, index, { k })}
          onFieldValueChange={(index, v) => updateField(selected.id, index, { v })}
          onFieldSelectorTypeChange={(index, selectorType) => updateField(selected.id, index, { selectorType })}
          onAddField={() => addField(selected.id)}
          onRemoveField={(index) => removeField(selected.id, index)}
          onRemove={() => deleteGroup(selected.id)}
        />
      )}
    </ListDetailSection>
  );
}
