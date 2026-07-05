import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { VariableBlock } from './VariableBlock';
import styles from './VariablesSection.module.css';

interface FieldDraft { k: string; v: string }
interface VariableGroupDraft { id: string; name: string; fields: FieldDraft[] }

const INITIAL_VARIABLES: VariableGroupDraft[] = [
  {
    id: 'reddit',
    name: 'reddit',
    fields: [
      { k: 'title', v: 'body h1.post-title' },
      { k: 'author', v: 'a.author-name' },
      { k: 'content', v: 'div.post-body' },
    ],
  },
  {
    id: 'habr',
    name: 'habr',
    fields: [
      { k: 'title', v: 'h1.tm-title' },
      { k: 'author', v: 'a.tm-user__nickname' },
    ],
  },
];

export function VariablesSection() {
  const { translate: t } = useTranslation();
  const [groups, setGroups] = useState<VariableGroupDraft[]>(INITIAL_VARIABLES);

  const addGroup = () =>
    setGroups((prev) => [...prev, { id: crypto.randomUUID(), name: '', fields: [] }]);

  const removeGroup = (id: string) =>
    setGroups((prev) => prev.filter((g) => g.id !== id));

  const renameGroup = (id: string, name: string) =>
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));

  const addField = (id: string) =>
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, fields: [...g.fields, { k: '', v: '' }] } : g)));

  const updateFieldKey = (id: string, index: number, k: string) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, fields: g.fields.map((f, i) => (i === index ? { ...f, k } : f)) } : g,
      ),
    );

  const updateFieldValue = (id: string, index: number, v: string) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, fields: g.fields.map((f, i) => (i === index ? { ...f, v } : f)) } : g,
      ),
    );

  const removeField = (id: string, index: number) =>
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, fields: g.fields.filter((_, i) => i !== index) } : g)),
    );

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
            onFieldKeyChange={(index, k) => updateFieldKey(g.id, index, k)}
            onFieldValueChange={(index, v) => updateFieldValue(g.id, index, v)}
            onAddField={() => addField(g.id)}
            onRemoveField={(index) => removeField(g.id, index)}
            onRemove={() => removeGroup(g.id)}
          />
        ))}
      </div>
    </section>
  );
}
