export interface Note {
  id: string;
  bookmarkId: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export const NoteField = {
  ID: 'id',
  BOOKMARK_ID: 'bookmarkId',
  TITLE: 'title',
  TEXT: 'text',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
export type NoteField = typeof NoteField[keyof typeof NoteField];
