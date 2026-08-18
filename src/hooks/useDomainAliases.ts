import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import { hasValidName } from '@/lib/validation/named-entity';
import type { DomainAlias } from '@/types/domain-alias';

export function useDomainAliases() {
  const { domainAliasRepository } = useServices();
  return useCrudResource(
    domainAliasRepository,
    (alias: DomainAlias) => alias.id,
    [],
    (alias) => hasValidName(alias.name),
  );
}
