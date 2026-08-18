import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import { hasValidName } from '@/lib/validation/named-entity';
import type { Tag } from '@/types/tag';

export function useTags() {
  const { tagRepository } = useServices();
  return useCrudResource(tagRepository, (tag: Tag) => tag.id, [], (tag) => hasValidName(tag.name));
}
