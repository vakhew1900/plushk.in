import type { QuickAddSaveResult } from '../../types/messages/quick-add-message';

export interface QuickAddParams {
  domain: string;
  name: string;
  selector: string;
}

export interface IQuickAddService {
  /** Creates/updates a `PageMatch` on the domain's `PageMatchGroup` — auto-creates the `DomainAlias`/group if neither exists yet (RULE-14). */
  saveVariable(params: QuickAddParams): Promise<QuickAddSaveResult>;
  /** Creates a domain-bound `IconRule` (`bindingType: 'domain'`, CSS source). */
  saveIcon(params: QuickAddParams): Promise<QuickAddSaveResult>;
}
