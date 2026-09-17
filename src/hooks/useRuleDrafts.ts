import { useCallback, useRef } from 'react';
import type { BookmarkRule } from '@/types/rule';

export interface RuleDraft {
  name: string;
  desc: string;
  targetFolder: string;
  priority: number;
  entityTypeId: string | undefined;
  statusId: string | undefined;
  tagIds: string[];
  conditionText: string;
}

function draftFromRule(rule: BookmarkRule): RuleDraft {
  return {
    name: rule.name,
    desc: rule.desc ?? '',
    targetFolder: rule.targetFolder,
    priority: rule.priority,
    entityTypeId: rule.entityTypeId,
    statusId: rule.statusId,
    tagIds: rule.tagIds ?? [],
    conditionText: JSON.stringify(rule.condition, null, 2),
  };
}

// Keyed by rule id, kept in a ref (not state) since writes shouldn't trigger
// a re-render of `RulesTab` — only `RuleEditor`'s own local state drives its
// rendering. Living here rather than in `RuleEditor` means the drafts survive
// switching between rules (`RuleEditor` remounts per rule id, see
// `key={selected.id}` in `RulesTab`) but are dropped for free when the whole
// `RulesTab` unmounts, e.g. navigating to another tab in the options menu.
export function useRuleDrafts() {
  const store = useRef(new Map<string, RuleDraft>());

  const getDraft = useCallback((rule: BookmarkRule): RuleDraft => {
    const existing = store.current.get(rule.id);
    if (existing) return existing;
    const fresh = draftFromRule(rule);
    store.current.set(rule.id, fresh);
    return fresh;
  }, []);

  const setDraft = useCallback((ruleId: string, draft: RuleDraft) => {
    store.current.set(ruleId, draft);
  }, []);

  const clearDraft = useCallback((ruleId: string) => {
    store.current.delete(ruleId);
  }, []);

  return { getDraft, setDraft, clearDraft };
}
