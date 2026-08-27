export type IconBookmark = {
  bookmarkId: string;
  iconUrl: string;
};

export const IconBookmarkField = {
  BOOKMARK_ID: 'bookmarkId',
  ICON_URL:    'iconUrl',
} as const;
export type IconBookmarkField = typeof IconBookmarkField[keyof typeof IconBookmarkField];
