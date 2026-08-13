import { useWorkflows } from '@/hooks/useWorkflows';
import { useWorkflowStatuses } from '@/hooks/useWorkflowStatuses';
import { pickDefaultStatusColor } from '@/lib/palette-color-assignment';
import type { PaletteColor } from '@/types/palette-color';

// Settings-side CRUD for one entity's workflow statuses. Creates the Workflow
// row lazily on the first status add (see SHELF-1: no explicit "create workflow" UI action).
export function useEntityWorkflow(entityTypeId: string | undefined) {
  const { items: workflows, save: saveWorkflow } = useWorkflows();
  const { items: allStatuses, save: saveStatus, remove: removeStatusById } = useWorkflowStatuses();

  const workflow = workflows.find((w) => w.entityTypeId === entityTypeId);
  const statuses = workflow
    ? allStatuses.filter((s) => s.workflowId === workflow.id).sort((a, b) => a.order - b.order)
    : [];

  const addStatus = async (name: string) => {
    if (!entityTypeId) return;
    let currentWorkflow = workflow;
    if (!currentWorkflow) {
      currentWorkflow = { id: crypto.randomUUID(), entityTypeId };
      await saveWorkflow(currentWorkflow);
    }
    const color = pickDefaultStatusColor(statuses.map((s) => s.color));
    await saveStatus({
      id: crypto.randomUUID(),
      workflowId: currentWorkflow.id,
      name,
      color,
      order: statuses.length,
    });
  };

  const renameStatus = async (statusId: string, name: string) => {
    const status = statuses.find((s) => s.id === statusId);
    if (status) await saveStatus({ ...status, name });
  };

  const recolorStatus = async (statusId: string, color: PaletteColor) => {
    const status = statuses.find((s) => s.id === statusId);
    if (status) await saveStatus({ ...status, color });
  };

  const removeStatus = async (statusId: string) => {
    await removeStatusById(statusId);
  };

  return { statuses, addStatus, renameStatus, recolorStatus, removeStatus };
}
