/**
 * Backs up/restores the auto-sorter's own configuration (rules, domain
 * aliases, page match groups) as a single JSON file — see SETTINGS-1.
 * Not related to EXPORT-1 (exporting a saved page's content to Markdown).
 */
export interface ISettingsExportImportService {
  /** Gathers the current rules/aliases/page-match-groups and downloads them as one JSON file. */
  exportSettings(): Promise<void>;

  /**
   * Upserts every entry from an imported file by id: rows already stored
   * under a matching id are overwritten, everything else already in the
   * database is left untouched.
   */
  importSettings(data: unknown): Promise<void>;
}
