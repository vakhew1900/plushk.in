import { SETTINGS_EXPORT_VERSION } from '../../types/settings-export';
import type { SettingsExport } from '../../types/settings-export';
import type { EntityType } from '../../types/entity-type';
import type { Tag } from '../../types/tag';
import type { Workflow } from '../../types/workflow';
import type { WorkflowStatus } from '../../types/workflow-status';
import type { Locale } from '../../locale';
import { PRESET_ENTITIES, PRESET_TAGS } from './data';

const PRESET_EXPORTED_AT = '2026-09-11T00:00:00.000Z';

/**
 * Builds the first-launch default preset (SETTINGS-2) for one locale — the
 * only two supported locales (`ru`/`en`) get the same ids/colors/icons/order,
 * differing only in `name`, since `PRESET_ENTITIES`/`PRESET_TAGS` (`./data`)
 * are the single source of truth for both.
 */
export function getDefaultPresetForLocale(locale: Locale): SettingsExport {
  const entityTypes: EntityType[] = [];
  const workflows: Workflow[] = [];
  const workflowStatuses: WorkflowStatus[] = [];

  for (const entity of PRESET_ENTITIES) {
    const entityTypeId = `default-entity-${entity.key}`;
    entityTypes.push({ id: entityTypeId, name: entity.name[locale], color: entity.color, icon: entity.icon });

    if (!entity.statuses) continue;

    const workflowId = `default-workflow-${entity.key}`;
    workflows.push({ id: workflowId, entityTypeId });

    for (const status of entity.statuses) {
      workflowStatuses.push({
        id: `default-status-${entity.key}-${status.key}`,
        workflowId,
        name: status.name[locale],
        color: status.color,
        order: status.order,
      });
    }
  }

  const tags: Tag[] = PRESET_TAGS.map((tagDef) => ({
    id: `default-tag-${tagDef.key}`,
    name: tagDef.name[locale],
    color: tagDef.color,
  }));

  return {
    version: SETTINGS_EXPORT_VERSION,
    exportedAt: PRESET_EXPORTED_AT,
    rules: [],
    domainAliases: [],
    pageMatchGroups: [],
    tags,
    entityTypes,
    workflows,
    workflowStatuses,
  };
}
