import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import type { WorkflowStatus } from '@/types/workflow-status';

export function useWorkflowStatuses() {
  const { workflowStatusRepository } = useServices();
  return useCrudResource(workflowStatusRepository, (status: WorkflowStatus) => status.id);
}
