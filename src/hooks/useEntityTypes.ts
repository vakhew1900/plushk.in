import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import { hasValidName } from '@/lib/validation/named-entity';
import type { EntityType } from '@/types/entity-type';

export function useEntityTypes() {
  const { entityTypeRepository } = useServices();
  return useCrudResource(
    entityTypeRepository,
    (entityType: EntityType) => entityType.id,
    [],
    (entityType) => hasValidName(entityType.name),
  );
}
