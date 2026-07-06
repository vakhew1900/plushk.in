import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { usePageMatchGroups } from '@/hooks/usePageMatchGroups';
import { DEFAULT_SELECTOR_TYPE, fromPageMatchGroup, toPageMatchGroup } from '@/lib/page-match-mapping';
import type { VariableFieldDraft, VariableGroupDraft } from '@/lib/page-match-mapping';
import { VariableBlock } from './VariableBlock';
import styles from './VariablesSection.module.css';

export function VariablesSection() {
  const { translate: t } = useTranslation();
  const { items, save, remove } = usePageMatchGroups();
  const groups = items.map(fromPageMatchGroup);

  const saveDraft = (draft: VariableGroupDraft) => save(toPageMatchGroup(draft));

  const addGroup = () => saveDraft({ id: crypto.randomUUID(), name: '', fields: [] });

  const renameGroup = (id: string, name: string) => {
    const group = groups.find((g) => g.id === id);
    if (group) saveDraft({ ...group, name });
  };

  const addField = (id: string) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      const field: VariableFieldDraft = { k: '', v: '', selectorType: DEFAULT_SELECTOR_TYPE };
      saveDraft({ ...group, fields: [...group.fields, field] });
    }
  };

  const updateField = (id: string, index: number, patch: Partial<VariableFieldDraft>) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      saveDraft({ ...group, fields: group.fields.map((f, i) => (i === index ? { ...f, ...patch } : f)) });
    }
  };

  const removeField = (id: string, index: number) => {
    const group = groups.find((g) => g.id === id);
    if (group) saveDraft({ ...group, fields: group.fields.filter((_, i) => i !== index) });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.h2}>{t('variablesSection.title')}</h2>
        <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }} onClick={addGroup}>
          <IconPlus size={12} />
          {t('variablesSection.addGroup')}
        </Button>
      </div>
      <p className={styles.sectionDesc}>{t('variablesSection.desc')}</p>
      <div className={styles.variableList}>
        {groups.map((g) => (
          <VariableBlock
            key={g.id}
            name={g.name}
            fields={g.fields}
            onNameChange={(name) => renameGroup(g.id, name)}
            onFieldKeyChange={(index, k) => updateField(g.id, index, { k })}
            onFieldValueChange={(index, v) => updateField(g.id, index, { v })}
            onFieldSelectorTypeChange={(index, selectorType) => updateField(g.id, index, { selectorType })}
            onAddField={() => addField(g.id)}
            onRemoveField={(index) => removeField(g.id, index)}
            onRemove={() => remove(g.id)}
          />
        ))}
      </div>
    </section>
  );
}
