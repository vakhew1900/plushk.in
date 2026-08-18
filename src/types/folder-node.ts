export interface FolderNode {
  id: string;
  title: string;
  path: string;
  children: FolderNode[];
  /** Doesn't exist in the real bookmark tree yet — a display-only placeholder inserted by `withPendingPath`. */
  pending?: boolean;
}
