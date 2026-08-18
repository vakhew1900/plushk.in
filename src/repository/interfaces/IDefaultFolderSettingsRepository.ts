export interface IDefaultFolderSettingsRepository {
  /** A `/`-separated folder path, or `''` meaning the Bookmarks Toolbar (the default). */
  get(): Promise<string>;
  set(path: string): Promise<void>;
}
