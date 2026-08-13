import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import { hasValidName } from '@/lib/validation/named-entity';
import type { WorkflowStatus } from '@/types/workflow-status';

export function useWorkflowStatuses() {
  const { workflowStatusRepository } = useServices();
  return useCrudResource(
    workflowStatusRepository,
    (status: WorkflowStatus) => status.id,
    [],
    (status) => hasValidName(status.name),
  );
}
