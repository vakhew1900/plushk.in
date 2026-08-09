import { useCallback } from 'react';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';
import { ToastVariant } from '@/types/toast';

export function useSettingsExportImport() {
  const { settingsExportImportService } = useServices();
  const { show } = useToast();
  const { translate: t } = useTranslation();

  const exportSettings = useCallback(async () => {
    try {
      await settingsExportImportService.exportSettings();
      show({ variant: ToastVariant.SUCCESS, title: t('exportSection.exportSuccessTitle'), description: t('exportSection.exportSuccessDesc') });
    } catch {
      show({ variant: ToastVariant.ERROR, title: t('exportSection.exportErrorTitle'), description: t('exportSection.exportError') });
    }
  }, [settingsExportImportService, show, t]);

  const importSettings = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const data: unknown = JSON.parse(text);
        await settingsExportImportService.importSettings(data);
        show({ variant: ToastVariant.SUCCESS, title: t('exportSection.importSuccessTitle'), description: t('exportSection.importSuccessDesc') });
      } catch {
        show({ variant: ToastVariant.ERROR, title: t('exportSection.importErrorTitle'), description: t('exportSection.importError') });
      }
    },
    [settingsExportImportService, show, t],
  );

  return { exportSettings, importSettings };
}
