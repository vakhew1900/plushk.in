import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { BookmarkRule } from '@/types/rule';

export function useBookmarkRules() {
  const { bookmarkRuleRepository } = useServices();
  const [items, setItems] = useState<BookmarkRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void bookmarkRuleRepository
      .getAll()
      .then((rules) => {
        if (!cancelled) setItems(rules);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookmarkRuleRepository]);

  const save = useCallback(
    async (rule: BookmarkRule) => {
      await bookmarkRuleRepository.save(rule);
      setItems((prev) => {
        const exists = prev.some((r) => r.id === rule.id);
        const next = exists ? prev.map((r) => (r.id === rule.id ? rule : r)) : [...prev, rule];
        return next.sort((a, b) => b.priority - a.priority);
      });
    },
    [bookmarkRuleRepository],
  );

  const remove = useCallback(
    async (id: string) => {
      await bookmarkRuleRepository.remove(id);
      setItems((prev) => prev.filter((r) => r.id !== id));
    },
    [bookmarkRuleRepository],
  );

  return { items, loading, save, remove };
}
