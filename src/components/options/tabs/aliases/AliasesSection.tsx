import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { AliasRow } from './AliasRow';
import styles from './AliasesSection.module.css';

interface AliasDraft {
  id: string;
  name: string;
  domains: string[];
}

const INITIAL_ALIASES: AliasDraft[] = [
  { id: 'reddit',    name: 'reddit',    domains: ['reddit.com', 'old.reddit.com', 'reddit.kz'] },
  { id: 'facebook',  name: 'facebook',  domains: ['www.facebook.com', 'm.facebook.com'] },
  { id: 'habr',      name: 'habr',      domains: ['habr.com', 'habrahabr.ru'] },
  { id: 'pinterest', name: 'pinterest', domains: ['pinterest.com', 'ru.pinterest.com', 'pin.it'] },
];

export function AliasesSection() {
  const { translate: t } = useTranslation();
  const [aliases, setAliases] = useState<AliasDraft[]>(INITIAL_ALIASES);

  const addAlias = () =>
    setAliases((prev) => [...prev, { id: crypto.randomUUID(), name: '', domains: [] }]);

  const removeAlias = (id: string) =>
    setAliases((prev) => prev.filter((a) => a.id !== id));

  const renameAlias = (id: string, name: string) =>
    setAliases((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)));

  const addDomain = (id: string) =>
    setAliases((prev) => prev.map((a) => (a.id === id ? { ...a, domains: [...a.domains, ''] } : a)));

  const updateDomain = (id: string, index: number, domain: string) =>
    setAliases((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, domains: a.domains.map((d, i) => (i === index ? domain : d)) } : a,
      ),
    );

  const removeDomain = (id: string, index: number) =>
    setAliases((prev) =>
      prev.map((a) => (a.id === id ? { ...a, domains: a.domains.filter((_, i) => i !== index) } : a)),
    );

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.h2}>{t('aliasesSection.title')}</h2>
        <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }} onClick={addAlias}>
          <IconPlus size={12} />
          {t('aliasesSection.addAlias')}
        </Button>
      </div>
      <p className={styles.sectionDesc}>{t('aliasesSection.desc')}</p>
      <div className={styles.table}>
        {aliases.map((a) => (
          <AliasRow
            key={a.id}
            name={a.name}
            domains={a.domains}
            onNameChange={(name) => renameAlias(a.id, name)}
            onDomainChange={(index, domain) => updateDomain(a.id, index, domain)}
            onAddDomain={() => addDomain(a.id)}
            onRemoveDomain={(index) => removeDomain(a.id, index)}
            onRemove={() => removeAlias(a.id)}
          />
        ))}
      </div>
    </section>
  );
}
