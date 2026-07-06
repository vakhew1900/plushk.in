import { PageSelectorType } from '../types/page-match';
import type { PageMatch, PageMatchGroup, PageSelector } from '../types/page-match';

export interface VariableFieldDraft {
  k: string;
  v: string;
  selectorType: PageSelectorType;
}

export interface VariableGroupDraft {
  id: string;
  name: string;
  fields: VariableFieldDraft[];
}

export function toPageMatchGroup(draft: VariableGroupDraft): PageMatchGroup {
  const pageMatches = new Map<string, PageMatch>();
  draft.fields.forEach((f, i) => {
    const key = f.k || `__field_${i}`;
    const selector = { type: f.selectorType, value: f.v } as PageSelector;
    pageMatches.set(key, { name: f.k, selector });
  });
  return { id: draft.id, alias_name: draft.name, pageMatches };
}

export function fromPageMatchGroup(group: PageMatchGroup): VariableGroupDraft {
  return {
    id: group.id,
    name: group.alias_name,
    fields: Array.from(group.pageMatches.values()).map((m) => ({
      k: m.name,
      v: m.selector.value,
      selectorType: m.selector.type,
    })),
  };
}

export const DEFAULT_SELECTOR_TYPE: PageSelectorType = PageSelectorType.CSS;
