import { useState } from 'react';
import type { QuickSaveSuggestion } from './useQuickSave';
import type { WorkflowStatus } from '@/types/workflow-status';

export function useQuickSaveSelection(
  suggestion: QuickSaveSuggestion | undefined,
  statusesFor: (entityTypeId: string | undefined) => WorkflowStatus[],
) {
  const [targetFolder, setTargetFolderState] = useState('');
  const [entityTypeId, setEntityTypeId] = useState<string | undefined>(undefined);
  const [statusId, setStatusId] = useState<string | undefined>(undefined);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  // Adopts a newly-resolved suggestion (folder + tags + category, one draft)
  // into local state, unless the user has already made a manual edit to any
  // of the four fields. Adjusted during render (React's documented pattern
  // for "remember a value from a previous render", same one RuleEditor's
  // `lastValidCondition` uses) rather than an effect — bails out once
  // `appliedSuggestion` matches, so it only fires when `suggestion` actually
  // changes reference, never loops.
  const [appliedSuggestion, setAppliedSuggestion] = useState<QuickSaveSuggestion | undefined>(undefined);
  if (!touched && suggestion !== undefined && suggestion !== appliedSuggestion) {
    setAppliedSuggestion(suggestion);
    setTargetFolderState(suggestion.targetFolder);
    setEntityTypeId(suggestion.entityTypeId);
    setStatusId(suggestion.statusId);
    setTagIds(suggestion.tagIds);
  }

  const setTargetFolder = (value: string) => {
    setTouched(true);
    setTargetFolderState(value);
  };

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
    targetFolder,
    entityTypeId,
    statusId,
    tagIds,
    setTargetFolder,
    chooseEntity,
    toggleTag,
    matchedRuleName: touched ? undefined : suggestion?.ruleName,
  };
}
