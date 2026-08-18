import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';

export function useDefaultFolder() {
  const { defaultFolderSettingsRepository } = useServices();
  const [defaultFolder, setDefaultFolderState] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void defaultFolderSettingsRepository
      .get()
      .then((value) => {
        if (!cancelled) setDefaultFolderState(value);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [defaultFolderSettingsRepository]);

  const setDefaultFolder = useCallback(
    async (value: string) => {
      setDefaultFolderState(value);
      await defaultFolderSettingsRepository.set(value);
    },
    [defaultFolderSettingsRepository],
  );

  return { defaultFolder, loading, setDefaultFolder };
}
