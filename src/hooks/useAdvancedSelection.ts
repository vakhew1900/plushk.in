import { useState } from 'react';
import type { RuleSuggestion } from './useQuickSave';
import type { WorkflowStatus } from '@/types/workflow-status';

export function useAdvancedSelection(
  suggestion: RuleSuggestion | undefined,
  statusesFor: (entityTypeId: string | undefined) => WorkflowStatus[],
) {
  const [entityTypeId, setEntityTypeId] = useState<string | undefined>(undefined);
  const [statusId, setStatusId] = useState<string | undefined>(undefined);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  // Adopts a newly-resolved suggestion into local state, unless the user has
  // already made a manual edit. Adjusted during render (React's documented
  // pattern for "remember a value from a previous render", same one
  // RuleEditor's `lastValidCondition` uses) rather than an effect — bails out
  // once `appliedSuggestion` matches, so it only fires when `suggestion`
  // actually changes reference, never loops.
  const [appliedSuggestion, setAppliedSuggestion] = useState<RuleSuggestion | undefined>(undefined);
  if (!touched && suggestion !== undefined && suggestion !== appliedSuggestion) {
    setAppliedSuggestion(suggestion);
    setEntityTypeId(suggestion.entityTypeId);
    setStatusId(suggestion.statusId);
    setTagIds(suggestion.tagIds);
  }

  const chooseEntity = (id: string | undefined) => {
    setTouched(true);
    setEntityTypeId(id);
    setStatusId(id === undefined ? undefined : statusesFor(id)[0]?.id);
  };

  const toggleTag = (tagId: string) => {
    setTouched(true);
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  return {
    entityTypeId,
    statusId,
    tagIds,
    chooseEntity,
    toggleTag,
    matchedRuleName: touched ? undefined : suggestion?.ruleName,
  };
}
