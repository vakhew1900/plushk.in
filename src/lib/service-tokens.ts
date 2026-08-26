/**
 * Registry of computed (non-`PageMeta`) target-folder tokens — `$$__year$$`
 * and friends. `__`-prefix namespaces these away from regular `PageMeta`
 * fields (see `TargetFolderTemplateService`, RULE-8): a token name starting
 * with this prefix is looked up here, never in `PageMeta`/`extras`.
 */
export const SERVICE_TOKEN_PREFIX = '__';

export const ServiceToken = {
  YEAR: `${SERVICE_TOKEN_PREFIX}year`,
  MONTH: `${SERVICE_TOKEN_PREFIX}month`,
  DAY: `${SERVICE_TOKEN_PREFIX}day`,
  DATE: `${SERVICE_TOKEN_PREFIX}date`,
} as const;

export type ServiceToken = (typeof ServiceToken)[keyof typeof ServiceToken];

/**
 * Shared inputs a service token resolver may draw on — a single bag, not a
 * positional parameter list, so a future resolver (e.g. `__uuid`, `__counter`)
 * can pick whatever field it needs off `tokenContext` without every existing
 * resolver's signature growing another parameter.
 */
export interface ServiceTokenContext {
  now: Date;
}

type ServiceTokenResolver = (tokenContext: ServiceTokenContext) => string;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Add a new computed token here — one entry, nothing else in this file changes. */
export const SERVICE_TOKEN_RESOLVERS: Record<ServiceToken, ServiceTokenResolver> = {
  [ServiceToken.YEAR]: ({ now }) => String(now.getFullYear()),
  [ServiceToken.MONTH]: ({ now }) => pad2(now.getMonth() + 1),
  [ServiceToken.DAY]: ({ now }) => pad2(now.getDate()),
  [ServiceToken.DATE]: ({ now }) => `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`,
};

function isServiceToken(name: string): name is ServiceToken {
  return name in SERVICE_TOKEN_RESOLVERS;
}

/** `undefined` when `name` isn't a registered service token (unknown `__`-prefixed name). */
export function resolveServiceToken(name: string, tokenContext: ServiceTokenContext): string | undefined {
  if (!isServiceToken(name)) return undefined;
  return SERVICE_TOKEN_RESOLVERS[name](tokenContext);
}
