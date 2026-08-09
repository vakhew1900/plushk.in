import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { Mode } from '@/types/mode';

export function useMode() {
  const { modeSettingsRepository } = useServices();
  const [mode, setModeState] = useState<Mode>(Mode.ON);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    modeSettingsRepository
      .get()
      .then((value) => {
        if (!cancelled) setModeState(value);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [modeSettingsRepository]);

  const setMode = useCallback(
    async (value: Mode) => {
      setModeState(value);
      await modeSettingsRepository.set(value);
    },
    [modeSettingsRepository],
  );

  return { mode, loading, setMode };
}
