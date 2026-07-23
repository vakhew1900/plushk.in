// The id of each fixed bookmark root container isn't the same across
// browsers. Grouped by browser here so a future divergent constant (bookmark
// or otherwise) has an obvious place to land next to these, instead of
// growing into more inline literals scattered through the repository layer.
export const BookmarkRootId = {
  CHROME: {
    TOOLBAR: '1',
    OTHER: '2',
    MOBILE: '3',
  },
  FIREFOX: {
    MENU: 'menu________',
    TOOLBAR: 'toolbar_____',
    OTHER: 'unfiled_____',
    MOBILE: 'mobile______',
  },
} as const;

type BrowserBookmarkRootIds = typeof BookmarkRootId[keyof typeof BookmarkRootId];
export type BookmarkRootId = BrowserBookmarkRootIds[keyof BrowserBookmarkRootIds];
