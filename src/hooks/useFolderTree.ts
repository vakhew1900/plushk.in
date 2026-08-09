import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { FolderNode } from '@/types/folder-node';

export function useFolderTree() {
  const { bookmarkRepository } = useServices();
  const [tree, setTree] = useState<FolderNode[]>([]);

  useEffect(() => {
    let cancelled = false;
    void bookmarkRepository.getFolderTree().then((result) => {
      if (!cancelled) setTree(result);
    });
    return () => {
      cancelled = true;
    };
  }, [bookmarkRepository]);

  return tree;
}
