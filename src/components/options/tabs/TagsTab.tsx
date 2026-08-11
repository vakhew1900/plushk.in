import { useTranslation } from '@/hooks/useTranslation';
import { TabHeader } from '@/components/options/TabHeader';
import { TagsSection } from './tags/TagsSection';
import styles from './TagsTab.module.css';

export function TagsTab() {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <TabHeader title={t('nav.tags')} lead={t('tagsTab.lead')} />

      <TagsSection />
    </div>
  );
}
