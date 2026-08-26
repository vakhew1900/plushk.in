import { resolveServiceToken, SERVICE_TOKEN_PREFIX } from '../lib/service-tokens';
import type { ServiceTokenContext } from '../lib/service-tokens';
import { applyTargetFolderTemplate, extractTemplateTokenNames } from '../lib/target-folder-template';
import { getMetaField, PageMetaField } from '../types/page-meta';
import type { PageMeta } from '../types/page-meta';
import type { ITargetFolderTemplateService } from './interfaces/ITargetFolderTemplateService';

// eslint-disable-next-line no-control-regex -- deliberate: strips control characters (not just `/`) from a resolved token value before it's spliced into a folder path
const UNSAFE_VALUE_CHARS = /[/\x00-\x1F]/g;

export class TargetFolderTemplateService implements ITargetFolderTemplateService {
  async resolve(targetFolder: string, meta: PageMeta): Promise<string> {
    // One shared instant for every token in this template — not a `new Date()`
    // per token — so e.g. `$$__year$$/$$__month$$/$$__day$$` can't disagree
    // with each other across a midnight rollover mid-resolution.
    const tokenContext: ServiceTokenContext = { now: new Date() };
    const values: Record<string, string> = {};

    for (const name of extractTemplateTokenNames(targetFolder)) {
      values[name] = this.resolveTokenValue(name, meta, tokenContext);
    }

    return applyTargetFolderTemplate(targetFolder, values);
  }

  private resolveTokenValue(name: string, meta: PageMeta, tokenContext: ServiceTokenContext): string {
    if (name.startsWith(SERVICE_TOKEN_PREFIX)) {
      const value = resolveServiceToken(name, tokenContext);
      return value === undefined ? '' : this.sanitize(value);
    }

    if (name === PageMetaField.ALIAS) {
      return this.sanitize(meta.alias ?? meta.domain);
    }

    const value = getMetaField(meta, name);
    return typeof value === 'string' ? this.sanitize(value) : '';
  }

  private sanitize(value: string): string {
    return value.replace(UNSAFE_VALUE_CHARS, '');
  }
}
