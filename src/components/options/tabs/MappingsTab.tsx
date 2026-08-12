import { useTranslation } from '@/hooks/useTranslation';
import { TabHeader } from '@/components/options/TabHeader';
import { AliasesSection } from './aliases/AliasesSection';
import { VariablesSection } from './aliases/VariablesSection';
import styles from './MappingsTab.module.css';

export function MappingsTab() {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <TabHeader title={t('nav.mappings')} lead={t('mappingsTab.lead')} />

      <AliasesSection />
      <VariablesSection />
    </div>
  );
}
