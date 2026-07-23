import { SETTINGS_EXPORT_VERSION } from '../types/settings-export';
import type { ExportedPageMatchGroup, SettingsExport } from '../types/settings-export';
import type { PageMatch, PageMatchGroup } from '../types/page-match';

export function toExportPageMatchGroup(group: PageMatchGroup): ExportedPageMatchGroup {
  return {
    ...group,
    pageMatches: Object.fromEntries(group.pageMatches),
  };
}

export function fromExportPageMatchGroup(group: ExportedPageMatchGroup): PageMatchGroup {
  return {
    ...group,
    pageMatches: new Map<string, PageMatch>(Object.entries(group.pageMatches)),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Boundary check for a user-supplied import file: only verifies shape/version,
// not every field of every rule — malformed rows are the repositories'/DSL
// evaluator's problem, same as any other bookmark rule.
export function isSettingsExport(value: unknown): value is SettingsExport {
  if (!isRecord(value)) return false;

  return (
    value.version === SETTINGS_EXPORT_VERSION &&
    typeof value.exportedAt === 'string' &&
    Array.isArray(value.rules) &&
    Array.isArray(value.domainAliases) &&
    Array.isArray(value.pageMatchGroups)
  );
}
