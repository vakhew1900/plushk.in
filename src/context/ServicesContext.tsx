import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { BookmarkRepository } from '@/repository/BookmarkRepository';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { DomainAliasRepository } from '@/repository/DomainAliasRepository';
import { ModeSettingsRepository } from '@/repository/ModeSettingsRepository';
import { PageMatchGroupRepository } from '@/repository/PageMatchGroupRepository';
import { PendingHintRepository } from '@/repository/PendingHintRepository';
import type { IBookmarkRepository } from '@/repository/interfaces/IBookmarkRepository';
import type { IBookmarkRuleRepository } from '@/repository/interfaces/IBookmarkRuleRepository';
import type { IDomainAliasRepository } from '@/repository/interfaces/IDomainAliasRepository';
import type { IModeSettingsRepository } from '@/repository/interfaces/IModeSettingsRepository';
import type { IPageMatchGroupRepository } from '@/repository/interfaces/IPageMatchGroupRepository';
import type { IPendingHintRepository } from '@/repository/interfaces/IPendingHintRepository';

export interface Services {
  bookmarkRepository: IBookmarkRepository;
  bookmarkRuleRepository: IBookmarkRuleRepository;
  domainAliasRepository: IDomainAliasRepository;
  modeSettingsRepository: IModeSettingsRepository;
  pageMatchGroupRepository: IPageMatchGroupRepository;
  pendingHintRepository: IPendingHintRepository;
}

export const ServicesContext = createContext<Services | null>(null);

interface Props {
  children: ReactNode;
}

export function ServicesProvider({ children }: Props) {
  const services = useMemo<Services>(
    () => ({
      bookmarkRepository: new BookmarkRepository(),
      bookmarkRuleRepository: new BookmarkRuleRepository(),
      domainAliasRepository: new DomainAliasRepository(),
      modeSettingsRepository: new ModeSettingsRepository(),
      pageMatchGroupRepository: new PageMatchGroupRepository(),
      pendingHintRepository: new PendingHintRepository(),
    }),
    [],
  );

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
