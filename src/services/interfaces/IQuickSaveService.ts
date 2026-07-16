import type { Mode } from '../../types/mode';

export interface QuickSaveInput {
  title: string;
  url: string;
  mode: Mode;
  targetFolder?: string;
}

/**
 * Creates a bookmark from the popup's quick-save screen, bypassing the
 * native browser "bookmark added" popup. Routed through `background.ts`
 * (not `IBookmarkRepository` directly) so the same context that owns the
 * `bookmarks.onCreated` listener can suppress its own re-processing of the
 * bookmark it just created.
 */
export interface IQuickSaveService {
  create(input: QuickSaveInput): Promise<void>;
}
