import { useCallback, useEffect, useRef, useState } from 'react';

// Structural shape only — hooks/ may not import repository/ (see
// eslint.config.js boundaries rule), but any ICrudRepository<T, K> from
// repository/interfaces/ satisfies this by matching shape.
interface CrudSource<T, K> {
  getAll(): Promise<T[]>;
  getById(id: K): Promise<T | undefined>;
  save(entity: T): Promise<void>;
  remove(id: K): Promise<void>;
}

type PostProcess<T> = (items: T[]) => T[];

export function useCrudResource<T, K = string>(
  repository: CrudSource<T, K>,
  getId: (item: T) => K,
  postProcess: PostProcess<T>[] = [],
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const postProcessRef = useRef(postProcess);
  useEffect(() => {
    postProcessRef.current = postProcess;
  });
  const applyPostProcess = useCallback((list: T[]) => postProcessRef.current.reduce((acc, fn) => fn(acc), list), []);

  useEffect(() => {
    let cancelled = false;
    void repository
      .getAll()
      .then((data) => {
        if (!cancelled) setItems(applyPostProcess(data));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [repository, applyPostProcess]);

  const save = useCallback(
    async (item: T) => {
      await repository.save(item);
      setItems((prev) => {
        const id = getId(item);
        const exists = prev.some((i) => getId(i) === id);
        const next = exists ? prev.map((i) => (getId(i) === id ? item : i)) : [...prev, item];
        return applyPostProcess(next);
      });
    },
    [repository, getId, applyPostProcess],
  );

  const remove = useCallback(
    async (id: K) => {
      await repository.remove(id);
      setItems((prev) => prev.filter((i) => getId(i) !== id));
    },
    [repository, getId],
  );

  return { items, loading, save, remove };
}
