export interface BookmarkSearchFilters {
  tagIds: string[];
  entityTypeId?: string;
  statusId?: string;
  /** A `FolderNode.path` (container-agnostic, e.g. `"Social/Reddit"`) — matches that folder and every subfolder recursively. */
  folderPath?: string;
}
