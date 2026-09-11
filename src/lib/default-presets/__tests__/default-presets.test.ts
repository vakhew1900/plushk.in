import { describe, expect, it } from 'vitest';
import { Locale } from '../../../locale';
import { isSettingsExport } from '../../settings-export-mapping';
import { getDefaultPresetForLocale } from '../index';

describe('getDefaultPresetForLocale', () => {
  it('produces a valid SettingsExport for both supported locales', () => {
    expect(isSettingsExport(getDefaultPresetForLocale(Locale.RU))).toBe(true);
    expect(isSettingsExport(getDefaultPresetForLocale(Locale.EN))).toBe(true);
  });

  it('ships no rules/domainAliases/pageMatchGroups — presets are tags/entities/workflows only', () => {
    const ru = getDefaultPresetForLocale(Locale.RU);
    expect(ru.rules).toEqual([]);
    expect(ru.domainAliases).toEqual([]);
    expect(ru.pageMatchGroups).toEqual([]);
  });

  it('keeps ids, colors, icons, and workflow structure identical between ru and en — only names differ', () => {
    const ru = getDefaultPresetForLocale(Locale.RU);
    const en = getDefaultPresetForLocale(Locale.EN);

    expect(en.entityTypes!.map((e) => e.id)).toEqual(ru.entityTypes!.map((e) => e.id));
    expect(en.entityTypes!.map((e) => e.color)).toEqual(ru.entityTypes!.map((e) => e.color));
    expect(en.entityTypes!.map((e) => e.icon)).toEqual(ru.entityTypes!.map((e) => e.icon));
    expect(en.entityTypes!.map((e) => e.name)).not.toEqual(ru.entityTypes!.map((e) => e.name));

    expect(en.tags!.map((t) => t.id)).toEqual(ru.tags!.map((t) => t.id));
    expect(en.tags!.map((t) => t.color)).toEqual(ru.tags!.map((t) => t.color));

    expect(en.workflows).toEqual(ru.workflows);
    expect(en.workflowStatuses!.map((s) => ({ id: s.id, workflowId: s.workflowId, color: s.color, order: s.order }))).toEqual(
      ru.workflowStatuses!.map((s) => ({ id: s.id, workflowId: s.workflowId, color: s.color, order: s.order })),
    );
  });

  it('gives a workflow (with statuses) to books/movies/games/articles, and none to tools/images/sites', () => {
    const preset = getDefaultPresetForLocale(Locale.RU);
    const workflowEntityIds = new Set(preset.workflows!.map((w) => w.entityTypeId));

    expect(workflowEntityIds).toEqual(
      new Set(['default-entity-books', 'default-entity-movies', 'default-entity-games', 'default-entity-articles']),
    );
    expect(preset.entityTypes!.map((e) => e.id)).toEqual(
      expect.arrayContaining(['default-entity-tools', 'default-entity-images', 'default-entity-sites']),
    );
  });

  it('assigns every workflow a distinct, sequential 0-based status order with no gaps or duplicates', () => {
    const preset = getDefaultPresetForLocale(Locale.RU);

    for (const workflow of preset.workflows!) {
      const orders = preset.workflowStatuses!
        .filter((s) => s.workflowId === workflow.id)
        .map((s) => s.order)
        .sort((a, b) => a - b);
      expect(orders).toEqual(orders.map((_, i) => i));
    }
  });

  it('has 7 entity types and 12 tags, none sharing an id', () => {
    const preset = getDefaultPresetForLocale(Locale.RU);

    expect(preset.entityTypes).toHaveLength(7);
    expect(preset.tags).toHaveLength(12);
    expect(new Set(preset.entityTypes!.map((e) => e.id)).size).toBe(7);
    expect(new Set(preset.tags!.map((t) => t.id)).size).toBe(12);
  });
});
