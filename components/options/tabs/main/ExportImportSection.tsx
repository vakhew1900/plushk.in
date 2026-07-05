import { Button } from '@/components/ui/button';
import { IconDownload, IconUpload } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './ExportImportSection.module.css';

export function ExportImportSection() {
  const { translate: t } = useTranslation();

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>{t('exportSection.title')}</h2>
      <p className={styles.sectionDesc}>{t('exportSection.desc')}</p>
      <div className={styles.exportRow}>
        <Button variant="outline">
          <IconDownload size={15} />
          {t('exportSection.exportButton')}
        </Button>
        <Button variant="outline">
          <IconUpload size={15} />
          {t('exportSection.importButton')}
        </Button>
      </div>
    </section>
  );
}
