import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import type { Tag } from '@/types/tag';

export function useTags() {
  const { tagRepository } = useServices();
  return useCrudResource(tagRepository, (tag: Tag) => tag.id);
}
