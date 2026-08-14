// What actually gets written when the user hits "Сохранить" — the target
// folder plus whatever tags/category go with it. One entity: a rule's match
// result (`BookmarkRule.targetFolder`/`tagIds`/`entityTypeId`/`statusId`) and
// the popup's editable draft of it are the same shape end to end, not split
// into "the folder" and "the rest".
export interface QuickSaveSelection {
  targetFolder: string;
  tagIds: string[];
  entityTypeId: string | undefined;
  statusId: string | undefined;
}
