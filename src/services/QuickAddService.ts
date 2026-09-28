import { PageSelectorType } from '../types/page-match';
import { IconRuleBindingType, IconSourceType, type IconRule } from '../types/icon-rule';
import { QuickAddSaveErrorType, type QuickAddSaveResult } from '../types/messages/quick-add-message';
import type { IDomainAliasService } from './interfaces/IDomainAliasService';
import type { IPageMatchGroupService } from './interfaces/IPageMatchGroupService';
import type { IIconRuleRepository } from '../repository/interfaces/IIconRuleRepository';
import type { IQuickAddService, QuickAddParams } from './interfaces/IQuickAddService';

export class QuickAddService implements IQuickAddService {
  constructor(
    private readonly domainAliasService: IDomainAliasService,
    private readonly pageMatchGroupService: IPageMatchGroupService,
    private readonly iconRuleRepository: IIconRuleRepository,
  ) {}

  async saveVariable({ domain, name, selector }: QuickAddParams): Promise<QuickAddSaveResult> {
    const alias = await this.domainAliasService.findOrCreateForDomain(domain);
    const group = await this.pageMatchGroupService.findOrCreateForAlias(alias.id);

    if (group.pageMatches.has(name)) {
      return { ok: false, error: QuickAddSaveErrorType.DUPLICATE_NAME };
    }

    group.pageMatches.set(name, { name, selector: { type: PageSelectorType.CSS, value: selector } });
    await this.pageMatchGroupService.save(group);
    return { ok: true };
  }

  async saveIcon({ domain, name, selector }: QuickAddParams): Promise<QuickAddSaveResult> {
    const rules = await this.iconRuleRepository.getAll();
    const duplicate = rules.some(
      (r) => r.bindingType === IconRuleBindingType.DOMAIN && r.bindingValue === domain && r.name === name,
    );
    if (duplicate) {
      return { ok: false, error: QuickAddSaveErrorType.DUPLICATE_NAME };
    }

    const rule: IconRule = {
      id: crypto.randomUUID(),
      name,
      bindingType: IconRuleBindingType.DOMAIN,
      bindingValue: domain,
      source: { type: IconSourceType.CSS, value: selector },
      enabled: true,
    };
    await this.iconRuleRepository.save(rule);
    return { ok: true };
  }
}
