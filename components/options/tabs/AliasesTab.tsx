import { useTranslation } from '@/hooks/useTranslation';
import { AliasesSection } from './aliases/AliasesSection';
import { VariablesSection } from './aliases/VariablesSection';
import styles from './AliasesTab.module.css';

export function AliasesTab() {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>{t('nav.aliases')}</h1>
      <p className={styles.lead}>{t('aliasesTab.lead')}</p>

      <AliasesSection />
      <VariablesSection />
    </div>
  );
}
