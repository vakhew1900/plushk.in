import { useTranslation } from '@/hooks/useTranslation';
import { TabHeader } from '@/components/options/TabHeader';
import { TagsSection } from './tags/TagsSection';
import { EntitiesSection } from './tags/entities/EntitiesSection';
import styles from './CategoriesTab.module.css';

export function CategoriesTab() {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <TabHeader title={t('nav.categories')} lead={t('categoriesTab.lead')} />

      <TagsSection />
      <EntitiesSection />
    </div>
  );
}
