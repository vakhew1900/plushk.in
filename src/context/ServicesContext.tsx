import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { DomainAliasRepository } from '@/repository/DomainAliasRepository';
import { PageMatchGroupRepository } from '@/repository/PageMatchGroupRepository';
import type { IBookmarkRuleRepository } from '@/repository/interfaces/IBookmarkRuleRepository';
import type { IDomainAliasRepository } from '@/repository/interfaces/IDomainAliasRepository';
import type { IPageMatchGroupRepository } from '@/repository/interfaces/IPageMatchGroupRepository';

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
