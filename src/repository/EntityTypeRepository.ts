import { db } from '../db/index';
import type { EntityType } from '../types/entity-type';
import { DexieRepository } from './DexieRepository';
import type { IEntityTypeRepository } from './interfaces/IEntityTypeRepository';

export class EntityTypeRepository extends DexieRepository<EntityType, string> implements IEntityTypeRepository {
  constructor() {
    super(db.entityTypes);
  }

  // Workflow/WorkflowStatus are normalized tables now (not embedded), so
  // deleting an EntityType needs an explicit two-hop cascade: its Workflow
  // (if any), that workflow's statuses, and any BookmarkEntityLink rows
  // pointing at this entity — all in one transaction, same explicit-cascade
  // style as TagRepository.remove().
  override async remove(id: string): Promise<void> {
    await db.transaction(
      'rw',
      this.table,
      db.workflows,
      db.workflowStatuses,
      db.bookmarkEntityLinks,
      async () => {
        const workflow = await db.workflows.where('entityTypeId').equals(id).first();
        if (workflow) {
          await db.workflowStatuses.where('workflowId').equals(workflow.id).delete();
          await db.workflows.delete(workflow.id);
        }
        await db.bookmarkEntityLinks.where('entityTypeId').equals(id).delete();
        await this.table.delete(id);
      },
    );
  }
}
