import { useTranslation } from '@/hooks/useTranslation';
import { TabHeader } from '@/components/options/TabHeader';
import { AliasesSection } from './aliases/AliasesSection';
import { VariablesSection } from './aliases/VariablesSection';
import styles from './AliasesTab.module.css';

export function AliasesTab() {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <TabHeader title={t('nav.aliases')} lead={t('aliasesTab.lead')} />

      <AliasesSection />
      <VariablesSection />
    </div>
  );
}
