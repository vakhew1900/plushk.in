import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { IconDownload, IconUpload } from '@/components/icons';
import { useSettingsExportImport } from '@/hooks/useSettingsExportImport';
import { useTranslation } from '@/hooks/useTranslation';
import { MimeType } from '@/services/interfaces/IFileService';
import styles from './ExportImportSection.module.css';

export function ExportImportSection() {
  const { translate: t } = useTranslation();
  const { exportSettings, importSettings, error } = useSettingsExportImport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void importSettings(file);
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>{t('exportSection.title')}</h2>
      <p className={styles.sectionDesc}>{t('exportSection.desc')}</p>
      <div className={styles.exportRow}>
        <Button variant="outline" onClick={() => void exportSettings()}>
          <IconDownload size={15} />
          {t('exportSection.exportButton')}
        </Button>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <IconUpload size={15} />
          {t('exportSection.importButton')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={MimeType.JSON}
          hidden
          onChange={handleFileChange}
        />
      </div>
      {error && <p className={styles.error}>{t(`exportSection.${error}Error`)}</p>}
    </section>
  );
}
