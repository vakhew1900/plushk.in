import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import { hasValidName } from '@/lib/validation/named-entity';
import type { BookmarkRule } from '@/types/rule';

const byPriorityDesc = (rules: BookmarkRule[]) => [...rules].sort((a, b) => b.priority - a.priority);

export function useBookmarkRules() {
  const { bookmarkRuleRepository } = useServices();
  return useCrudResource(
    bookmarkRuleRepository,
    (rule: BookmarkRule) => rule.id,
    [byPriorityDesc],
    (rule) => hasValidName(rule.name),
  );
}
