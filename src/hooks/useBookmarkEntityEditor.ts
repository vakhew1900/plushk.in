import { useEntityWorkflows } from '@/hooks/useEntityWorkflows';
import { useBookmarkEntityLink } from '@/hooks/useBookmarkEntityLink';

export function useBookmarkEntityEditor(bookmarkId: string) {
  const { entityTypes, statusesFor } = useEntityWorkflows();
  const { link, setEntity, setStatus } = useBookmarkEntityLink(bookmarkId);

  const selectedEntity = entityTypes.find((e) => e.id === link?.entityTypeId);
  const statuses = statusesFor(link?.entityTypeId);
  const selectedStatus = statuses.find((s) => s.id === link?.statusId);

  const chooseEntity = async (entityTypeId: string | undefined) => {
    if (!entityTypeId) {
      await setEntity(undefined);
      return;
    }
    const firstStatus = statusesFor(entityTypeId)[0];
    await setEntity(entityTypeId, firstStatus?.id);
  };

  const chooseStatus = async (statusId: string) => {
    await setStatus(statusId);
  };

  return { entityTypes, selectedEntity, statuses, selectedStatus, chooseEntity, chooseStatus };
}
