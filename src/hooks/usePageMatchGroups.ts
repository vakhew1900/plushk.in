import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import type { PageMatchGroup } from '@/types/page-match';

export function usePageMatchGroups() {
  const { pageMatchGroupRepository } = useServices();
  return useCrudResource(pageMatchGroupRepository, (group: PageMatchGroup) => group.id);
}
