import { useCallback, useState } from 'react';
import { useServices } from '@/hooks/useServices';

export const SettingsExportImportError = {
  EXPORT: 'export',
  IMPORT: 'import',
} as const;
export type SettingsExportImportError = typeof SettingsExportImportError[keyof typeof SettingsExportImportError];

export function useSettingsExportImport() {
  const { settingsExportImportService } = useServices();
  const [error, setError] = useState<SettingsExportImportError | undefined>(undefined);

  const exportSettings = useCallback(async () => {
    setError(undefined);
    try {
      await settingsExportImportService.exportSettings();
    } catch {
      setError(SettingsExportImportError.EXPORT);
    }
  }, [settingsExportImportService]);

  const importSettings = useCallback(
    async (file: File) => {
      setError(undefined);
      try {
        const text = await file.text();
        const data: unknown = JSON.parse(text);
        await settingsExportImportService.importSettings(data);
      } catch {
        setError(SettingsExportImportError.IMPORT);
      }
    },
    [settingsExportImportService],
  );

  return { exportSettings, importSettings, error };
}
