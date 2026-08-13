import type { PaletteColor } from './palette-color';

// order: lowest = display position AND the default starting status when an
// entity is first assigned to a bookmark.
export type WorkflowStatus = {
  id: string;
  workflowId: string;
  name: string;
  color: PaletteColor;
  order: number;
};

export const WorkflowStatusField = {
  ID: 'id',
  WORKFLOW_ID: 'workflowId',
  NAME: 'name',
  COLOR: 'color',
  ORDER: 'order',
} as const;
export type WorkflowStatusField = (typeof WorkflowStatusField)[keyof typeof WorkflowStatusField];
