import { useCallback } from 'react';
import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import { hasValidName } from '@/lib/validation/named-entity';
import type { BookmarkRule } from '@/types/rule';

const byPriorityDesc = (rules: BookmarkRule[]) => [...rules].sort((a, b) => b.priority - a.priority);

export function useBookmarkRules() {
  const { bookmarkRuleRepository } = useServices();
  const { refetch, ...resource } = useCrudResource(
    bookmarkRuleRepository,
    (rule: BookmarkRule) => rule.id,
    [byPriorityDesc],
    (rule) => hasValidName(rule.name),
  );

  // Cascade delete (RULE-10) goes through a repository method outside the
  // generic `save`/`remove` shape `useCrudResource` knows about — persist via
  // it directly, then reconcile local state with `refetch`.
  const removeWithDescendants = useCallback(
    async (id: string) => {
      await bookmarkRuleRepository.removeWithDescendants(id);
      await refetch();
    },
    [bookmarkRuleRepository, refetch],
  );

  return { ...resource, refetch, removeWithDescendants };
}
