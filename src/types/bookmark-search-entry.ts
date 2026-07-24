export interface BookmarkSearchEntry {
  id: string;
  title: string;
  url: string;
  /** Ancestor folder titles, root-most first (e.g. `["Bookmarks Toolbar", "Social", "Reddit"]`). */
  folderPath: string[];
}
