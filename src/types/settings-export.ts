import type { BookmarkRule } from './rule';
import type { DomainAlias } from './domain-alias';
import type { PageMatch } from './page-match';
import type { Tag } from './tag';
import type { EntityType } from './entity-type';

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
  // Optional — added alongside SEARCH-6's BookmarkRule.tagIds/entityTypeId so
  // example/test configs (configs/*/settings.json) can ship the tags/category
  // a rule references. Older export files without them are still valid;
  // absent means "none". Workflow/WorkflowStatus aren't included — a rule's
  // statusId always resolves to a category's first status at match time, and
  // an EntityType with no workflow at all is already a valid state (SHELF-1).
  tags?: Tag[];
  entityTypes?: EntityType[];
}
