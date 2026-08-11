import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { Tag } from '@/types/tag';

export function useTags() {
  const { tagRepository } = useServices();
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void tagRepository
      .getAll()
      .then((tags) => {
        if (!cancelled) setItems(tags);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tagRepository]);

  const save = useCallback(
    async (tag: Tag) => {
      await tagRepository.save(tag);
      setItems((prev) => {
        const exists = prev.some((t) => t.id === tag.id);
        return exists ? prev.map((t) => (t.id === tag.id ? tag : t)) : [...prev, tag];
      });
    },
    [tagRepository],
  );

  const remove = useCallback(
    async (id: string) => {
      await tagRepository.remove(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
    },
    [tagRepository],
  );

  return { items, loading, save, remove };
}
