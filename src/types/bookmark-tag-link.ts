export interface BookmarkTagLink {
  bookmarkId: string;
  tagIds: string[];
}

export const BookmarkTagLinkField = {
  BOOKMARK_ID: 'bookmarkId',
  TAG_IDS: 'tagIds',
} as const;
export type BookmarkTagLinkField = typeof BookmarkTagLinkField[keyof typeof BookmarkTagLinkField];
