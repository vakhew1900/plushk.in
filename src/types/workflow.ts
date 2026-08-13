// 1:1 with EntityType — enforced by a unique index on entityTypeId (db/index.ts),
// not by embedding, per SHELF-1's normalized-storage revision.
export type Workflow = {
  id: string;
  entityTypeId: string;
};

export const WorkflowField = {
  ID: 'id',
  ENTITY_TYPE_ID: 'entityTypeId',
} as const;
export type WorkflowField = (typeof WorkflowField)[keyof typeof WorkflowField];
