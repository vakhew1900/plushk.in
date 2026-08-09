import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { PageMatchGroup } from '@/types/page-match';

export function usePageMatchGroups() {
  const { pageMatchGroupRepository } = useServices();
  const [items, setItems] = useState<PageMatchGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void pageMatchGroupRepository
      .getAll()
      .then((groups) => {
        if (!cancelled) setItems(groups);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pageMatchGroupRepository]);

  const save = useCallback(
    async (group: PageMatchGroup) => {
      await pageMatchGroupRepository.save(group);
      setItems((prev) => {
        const exists = prev.some((g) => g.id === group.id);
        return exists ? prev.map((g) => (g.id === group.id ? group : g)) : [...prev, group];
      });
    },
    [pageMatchGroupRepository],
  );

  const remove = useCallback(
    async (id: string) => {
      await pageMatchGroupRepository.remove(id);
      setItems((prev) => prev.filter((g) => g.id !== id));
    },
    [pageMatchGroupRepository],
  );

  return { items, loading, save, remove };
}
