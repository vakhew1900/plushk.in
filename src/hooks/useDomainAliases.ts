import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { DomainAlias } from '@/types/domain-alias';

export function useDomainAliases() {
  const { domainAliasRepository } = useServices();
  const [items, setItems] = useState<DomainAlias[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void domainAliasRepository
      .getAll()
      .then((aliases) => {
        if (!cancelled) setItems(aliases);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [domainAliasRepository]);

  const save = useCallback(
    async (alias: DomainAlias) => {
      await domainAliasRepository.save(alias);
      setItems((prev) => {
        const exists = prev.some((a) => a.id === alias.id);
        return exists ? prev.map((a) => (a.id === alias.id ? alias : a)) : [...prev, alias];
      });
    },
    [domainAliasRepository],
  );

  const remove = useCallback(
    async (id: string) => {
      await domainAliasRepository.remove(id);
      setItems((prev) => prev.filter((a) => a.id !== id));
    },
    [domainAliasRepository],
  );

  return { items, loading, save, remove };
}
