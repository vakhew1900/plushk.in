import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import { isValidIconRule } from '@/lib/validation/icon-rule';
import type { IconRule } from '@/types/icon-rule';

export function useIconRules() {
  const { iconRuleRepository } = useServices();
  return useCrudResource(
    iconRuleRepository,
    (rule: IconRule) => rule.id,
    [],
    isValidIconRule,
  );
}
