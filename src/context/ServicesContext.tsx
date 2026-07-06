import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { BookmarkRuleRepository } from '@/services/data/BookmarkRuleRepository';
import { DomainAliasRepository } from '@/services/data/DomainAliasRepository';
import { PageMatchGroupRepository } from '@/services/data/PageMatchGroupRepository';
import type { IBookmarkRuleRepository } from '@/services/interfaces/data/IBookmarkRuleRepository';
import type { IDomainAliasRepository } from '@/services/interfaces/data/IDomainAliasRepository';
import type { IPageMatchGroupRepository } from '@/services/interfaces/data/IPageMatchGroupRepository';

export interface Services {
  bookmarkRuleRepository: IBookmarkRuleRepository;
  domainAliasRepository: IDomainAliasRepository;
  pageMatchGroupRepository: IPageMatchGroupRepository;
}

export const ServicesContext = createContext<Services | null>(null);

interface Props {
  children: ReactNode;
}

export function ServicesProvider({ children }: Props) {
  const services = useMemo<Services>(
    () => ({
      bookmarkRuleRepository: new BookmarkRuleRepository(),
      domainAliasRepository: new DomainAliasRepository(),
      pageMatchGroupRepository: new PageMatchGroupRepository(),
    }),
    [],
  );

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
