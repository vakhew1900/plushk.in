import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { PendingBookmarkHint } from '@/types/pending-hint';

export function usePendingHint() {
  const { pendingHintRepository, bookmarkRepository } = useServices();
  const [hint, setHint] = useState<PendingBookmarkHint | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    pendingHintRepository.get().then((value) => {
      if (!cancelled) setHint(value);
    });
    return () => {
      cancelled = true;
    };
  }, [pendingHintRepository]);

  const confirm = useCallback(
    async (targetFolder: string) => {
      if (!hint) return;
      await bookmarkRepository.move(hint.bookmarkId, targetFolder);
      await pendingHintRepository.clear();
      setHint(undefined);
    },
    [hint, bookmarkRepository, pendingHintRepository],
  );

  const cancel = useCallback(async () => {
    await pendingHintRepository.clear();
    setHint(undefined);
  }, [pendingHintRepository]);

  return { hint, confirm, cancel };
}
