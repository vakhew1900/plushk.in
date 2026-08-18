// References by id, not by name — renaming a WorkflowStatus or EntityType
// must not break already-saved links.
export type BookmarkEntityLink = {
  bookmarkId: string;
  entityTypeId: string;
  statusId?: string;
};

export const BookmarkEntityLinkField = {
  BOOKMARK_ID: 'bookmarkId',
  ENTITY_TYPE_ID: 'entityTypeId',
  STATUS_ID: 'statusId',
} as const;
export type BookmarkEntityLinkField = (typeof BookmarkEntityLinkField)[keyof typeof BookmarkEntityLinkField];
