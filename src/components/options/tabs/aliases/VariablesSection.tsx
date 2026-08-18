import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { DEFAULT_SELECTOR_TYPE, fromPageMatchGroup, toPageMatchGroup } from '@/lib/page-match-mapping';
import type { VariableFieldDraft, VariableGroupDraft } from '@/lib/page-match-mapping';
import type { DomainAlias } from '@/types/domain-alias';
import type { PageMatchGroup } from '@/types/page-match';
import { VariableBlock } from './VariableBlock';
import type { AliasOption } from './VariableBlock';
import styles from './VariablesSection.module.css';

interface Props {
  aliases: DomainAlias[];
  groups: PageMatchGroup[];
  saveGroup: (group: PageMatchGroup) => Promise<void>;
  removeGroup: (id: string) => Promise<void>;
}

export function VariablesSection({ aliases, groups: rawGroups, saveGroup, removeGroup }: Props) {
  const { translate: t } = useTranslation();
  const groups = rawGroups.map(fromPageMatchGroup);

  // At most one group per alias — an alias already claimed by another group
  // isn't offered again (RULE-12).
  const usedAliasIds = new Set(groups.map((g) => g.aliasId));
  const unclaimedAliases = aliases.filter((a) => !usedAliasIds.has(a.id));

  const saveDraft = (draft: VariableGroupDraft) => saveGroup(toPageMatchGroup(draft));

  const canAddGroup = unclaimedAliases.length > 0;
  const addGroup = () => {
    if (!canAddGroup) return;
    void saveDraft({ id: crypto.randomUUID(), aliasId: unclaimedAliases[0].id, fields: [] });
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

  // A group's own current alias stays selectable alongside every alias no
  // other group has claimed yet.
  const aliasOptionsFor = (group: VariableGroupDraft): AliasOption[] =>
    aliases.filter((a) => a.id === group.aliasId || !usedAliasIds.has(a.id));

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text as="h2" size="subheading">{t('variablesSection.title')}</Text>
        <Button
          variant="outline"
          size="sm"
          style={{ marginLeft: 'auto' }}
          onClick={addGroup}
          disabled={!canAddGroup}
          title={canAddGroup ? undefined : t('variablesSection.addGroupDisabledHint')}
        >
          <IconPlus size="sm" />
          {t('variablesSection.addGroup')}
        </Button>
      </div>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{t('variablesSection.desc')}</Text>
      <div className={styles.variableList}>
        {groups.map((g) => (
          <VariableBlock
            key={g.id}
            aliasId={g.aliasId}
            aliasOptions={aliasOptionsFor(g)}
            fields={g.fields}
            onAliasChange={(aliasId) => changeAlias(g.id, aliasId)}
            onFieldKeyChange={(index, k) => updateField(g.id, index, { k })}
            onFieldValueChange={(index, v) => updateField(g.id, index, { v })}
            onFieldSelectorTypeChange={(index, selectorType) => updateField(g.id, index, { selectorType })}
            onAddField={() => addField(g.id)}
            onRemoveField={(index) => removeField(g.id, index)}
            onRemove={() => void removeGroup(g.id)}
          />
        ))}
      </div>
    </section>
  );
}
