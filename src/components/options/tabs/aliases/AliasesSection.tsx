import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useDomainAliases } from '@/hooks/useDomainAliases';
import { AliasRow } from './AliasRow';
import styles from './AliasesSection.module.css';

export function AliasesSection() {
  const { translate: t } = useTranslation();
  const { items: aliases, save, remove } = useDomainAliases();

  const addAlias = () => save({ id: crypto.randomUUID(), name: '', domain_names: [] });

  const renameAlias = (id: string, name: string) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) save({ ...alias, name });
  };

  const addDomain = (id: string) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) save({ ...alias, domain_names: [...alias.domain_names, ''] });
  };

  const updateDomain = (id: string, index: number, domain: string) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) {
      save({ ...alias, domain_names: alias.domain_names.map((d, i) => (i === index ? domain : d)) });
    }
  };

  const removeDomain = (id: string, index: number) => {
    const alias = aliases.find((a) => a.id === id);
    if (alias) save({ ...alias, domain_names: alias.domain_names.filter((_, i) => i !== index) });
  };

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
            domains={a.domain_names}
            onNameChange={(name) => renameAlias(a.id, name)}
            onDomainChange={(index, domain) => updateDomain(a.id, index, domain)}
            onAddDomain={() => addDomain(a.id)}
            onRemoveDomain={(index) => removeDomain(a.id, index)}
            onRemove={() => remove(a.id)}
          />
        ))}
      </div>
    </section>
  );
}
