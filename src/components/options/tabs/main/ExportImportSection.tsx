import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { IconDownload, IconUpload } from '@/components/icons';
import { useSettingsExportImport } from '@/hooks/useSettingsExportImport';
import { useTranslation } from '@/hooks/useTranslation';
import { MimeType } from '@/services/interfaces/IFileService';
import styles from './ExportImportSection.module.css';

export function ExportImportSection() {
  const { translate: t } = useTranslation();
  const { exportSettings, importSettings } = useSettingsExportImport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void importSettings(file);
  }

  return (
    <section className={styles.section}>
      <Text as="h2" size="subheading" className={styles.h2}>{t('exportSection.title')}</Text>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{t('exportSection.desc')}</Text>
      <div className={styles.exportRow}>
        <Button variant="outline" onClick={() => void exportSettings()}>
          <IconDownload size="md" />
          {t('exportSection.exportButton')}
        </Button>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <IconUpload size="md" />
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
    </section>
  );
}
