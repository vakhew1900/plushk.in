import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { AliasRow } from './AliasRow';
import styles from './AliasesSection.module.css';

const ALIASES = [
  { name: 'reddit',    domains: ['reddit.com', 'old.reddit.com', 'reddit.kz'] },
  { name: 'facebook',  domains: ['www.facebook.com', 'm.facebook.com'] },
  { name: 'habr',      domains: ['habr.com', 'habrahabr.ru'] },
  { name: 'pinterest', domains: ['pinterest.com', 'ru.pinterest.com', 'pin.it'] },
];

export function AliasesSection() {
  const { translate: t } = useTranslation();

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.h2}>{t('aliasesSection.title')}</h2>
        <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }}>
          <IconPlus size={12} />
          {t('aliasesSection.addAlias')}
        </Button>
      </div>
      <p className={styles.sectionDesc}>{t('aliasesSection.desc')}</p>
      <div className={styles.table}>
        {ALIASES.map((a) => <AliasRow key={a.name} {...a} />)}
      </div>
    </section>
  );
}
