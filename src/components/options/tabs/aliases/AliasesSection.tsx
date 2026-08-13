import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { DomainAlias } from '@/types/domain-alias';
import { AliasRow } from './AliasRow';
import styles from './AliasesSection.module.css';

interface Props {
  aliases: DomainAlias[];
  save: (alias: DomainAlias) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function AliasesSection({ aliases, save, remove }: Props) {
  const { translate: t } = useTranslation();

  const addAlias = () => void save({ id: crypto.randomUUID(), name: '', domain_names: [] });

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

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text as="h2" size="subheading">{t('aliasesSection.title')}</Text>
        <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }} onClick={addAlias}>
          <IconPlus size="sm" />
          {t('aliasesSection.addAlias')}
        </Button>
      </div>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{t('aliasesSection.desc')}</Text>
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
            onRemove={() => void remove(a.id)}
          />
        ))}
      </div>
    </section>
  );
}
