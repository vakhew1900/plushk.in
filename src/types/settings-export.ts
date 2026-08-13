import type { BookmarkRule } from './rule';
import type { DomainAlias } from './domain-alias';
import type { PageMatch } from './page-match';

// Bumped when the shape of SettingsExport changes in a way that breaks
// reading older files (e.g. a required field is added or renamed). Kept at
// 1 for now — no real users/exported files to stay compatible with yet, so
// past shape changes (e.g. RULE-12's alias_name -> aliasId) just rewrite
// this in place instead of bumping.
export const SETTINGS_EXPORT_VERSION = 1;

// Map<string, PageMatch> isn't JSON-serializable, so the export file stores
// pageMatches as a plain Record instead (mirrors StoredPageMatchGroup in
// db/index.ts, but kept separate — services don't depend on the db layer).
export type ExportedPageMatchGroup = {
  id: string;
  aliasId: string;
  pageMatches: Record<string, PageMatch>;
};

export interface SettingsExport {
  version: number;
  exportedAt: string;
  rules: BookmarkRule[];
  domainAliases: DomainAlias[];
  pageMatchGroups: ExportedPageMatchGroup[];
}
