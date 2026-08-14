import { useEntityTypes } from './useEntityTypes';
import { useWorkflows } from './useWorkflows';
import { useWorkflowStatuses } from './useWorkflowStatuses';
import type { WorkflowStatus } from '@/types/workflow-status';

export function useEntityWorkflows() {
  const { items: entityTypes } = useEntityTypes();
  const { items: workflows } = useWorkflows();
  const { items: allStatuses } = useWorkflowStatuses();

  const statusesFor = (entityTypeId: string | undefined): WorkflowStatus[] => {
    const workflow = workflows.find((w) => w.entityTypeId === entityTypeId);
    if (!workflow) return [];
    return allStatuses.filter((s) => s.workflowId === workflow.id).sort((a, b) => a.order - b.order);
  };

  return { entityTypes, statusesFor };
}
