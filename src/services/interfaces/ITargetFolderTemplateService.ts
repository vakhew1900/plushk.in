import type { PageMeta } from '../../types/page-meta';

/**
 * Resolves `$$name$$` tokens in a `BookmarkRule.targetFolder` template
 * against a `PageMeta` (regular fields/`extras`) plus the `__`-prefixed
 * service tokens in `src/lib/service-tokens.ts`. A template with no tokens
 * passes through unchanged. See RULE-8.
 */
export interface ITargetFolderTemplateService {
  resolve(targetFolder: string, meta: PageMeta): Promise<string>;
}
