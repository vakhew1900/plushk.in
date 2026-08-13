import { db } from '../db/index';
import type { WorkflowStatus } from '../types/workflow-status';
import { DexieRepository } from './DexieRepository';
import type { IWorkflowStatusRepository } from './interfaces/IWorkflowStatusRepository';

export class WorkflowStatusRepository
  extends DexieRepository<WorkflowStatus, string>
  implements IWorkflowStatusRepository
{
  constructor() {
    super(db.workflowStatuses);
  }
}
