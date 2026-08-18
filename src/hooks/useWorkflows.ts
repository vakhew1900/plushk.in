import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import type { Workflow } from '@/types/workflow';

export function useWorkflows() {
  const { workflowRepository } = useServices();
  return useCrudResource(workflowRepository, (workflow: Workflow) => workflow.id);
}
