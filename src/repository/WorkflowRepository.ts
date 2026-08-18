import { db } from '../db/index';
import type { Workflow } from '../types/workflow';
import { DexieRepository } from './DexieRepository';
import type { IWorkflowRepository } from './interfaces/IWorkflowRepository';

export class WorkflowRepository extends DexieRepository<Workflow, string> implements IWorkflowRepository {
  constructor() {
    super(db.workflows);
  }
}
