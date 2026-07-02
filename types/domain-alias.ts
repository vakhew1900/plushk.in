export type DomainAlias = {
  id: string;
  name: string;
  domain_names: string[];
};

export const DomainAliasField = {
  ID:           'id',
  NAME:         'name',
  DOMAIN_NAMES: 'domain_names',
} as const;
export type DomainAliasField = typeof DomainAliasField[keyof typeof DomainAliasField];
