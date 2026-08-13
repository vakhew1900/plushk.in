import { useEntityTypes } from '@/hooks/useEntityTypes';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useWorkflowStatuses } from '@/hooks/useWorkflowStatuses';
import { useBookmarkEntityLink } from '@/hooks/useBookmarkEntityLink';
import type { WorkflowStatus } from '@/types/workflow-status';

export function useBookmarkEntityEditor(bookmarkId: string) {
  const { items: entityTypes } = useEntityTypes();
  const { items: workflows } = useWorkflows();
  const { items: allStatuses } = useWorkflowStatuses();
  const { link, setEntity, setStatus } = useBookmarkEntityLink(bookmarkId);

  const statusesFor = (entityTypeId: string | undefined): WorkflowStatus[] => {
    const workflow = workflows.find((w) => w.entityTypeId === entityTypeId);
    if (!workflow) return [];
    return allStatuses.filter((s) => s.workflowId === workflow.id).sort((a, b) => a.order - b.order);
  };

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
