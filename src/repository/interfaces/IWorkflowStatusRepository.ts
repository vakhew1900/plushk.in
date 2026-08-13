import type { WorkflowStatus } from '../../types/workflow-status';
import type { ICrudRepository } from './ICrudRepository';

export type IWorkflowStatusRepository = ICrudRepository<WorkflowStatus>;
