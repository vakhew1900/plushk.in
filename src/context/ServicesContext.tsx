import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { BookmarkRepository } from '@/repository/BookmarkRepository';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { DefaultFolderSettingsRepository } from '@/repository/DefaultFolderSettingsRepository';
import { DomainAliasRepository } from '@/repository/DomainAliasRepository';
import { ModeSettingsRepository } from '@/repository/ModeSettingsRepository';
import { PageMatchGroupRepository } from '@/repository/PageMatchGroupRepository';
import type { IBookmarkRepository } from '@/repository/interfaces/IBookmarkRepository';
import type { IBookmarkRuleRepository } from '@/repository/interfaces/IBookmarkRuleRepository';
import type { IDefaultFolderSettingsRepository } from '@/repository/interfaces/IDefaultFolderSettingsRepository';
import type { IDomainAliasRepository } from '@/repository/interfaces/IDomainAliasRepository';
import type { IModeSettingsRepository } from '@/repository/interfaces/IModeSettingsRepository';
import type { IPageMatchGroupRepository } from '@/repository/interfaces/IPageMatchGroupRepository';
import { BookmarkSearchService } from '@/services/BookmarkSearchService';
import { FileService } from '@/services/FileService';
import { PageExtrasService } from '@/services/PageExtrasService';
import { PageMetaFiller } from '@/services/PageMetaFiller';
import { QuickSaveFolderResolver } from '@/services/QuickSaveFolderResolver';
import { SettingsExportImportService } from '@/services/SettingsExportImportService';
import type { IBookmarkSearchService } from '@/services/interfaces/IBookmarkSearchService';
import type { IFileService } from '@/services/interfaces/IFileService';
import type { IPageExtrasService } from '@/services/interfaces/IPageExtrasService';
import type { IPageMetaFiller } from '@/services/interfaces/IPageMetaFiller';
import type { IQuickSaveFolderResolver } from '@/services/interfaces/IQuickSaveFolderResolver';
import type { ISettingsExportImportService } from '@/services/interfaces/ISettingsExportImportService';

export interface Services {
  bookmarkRepository: IBookmarkRepository;
  bookmarkRuleRepository: IBookmarkRuleRepository;
  defaultFolderSettingsRepository: IDefaultFolderSettingsRepository;
  domainAliasRepository: IDomainAliasRepository;
  modeSettingsRepository: IModeSettingsRepository;
  pageMatchGroupRepository: IPageMatchGroupRepository;
  fileService: IFileService;
  pageMetaFiller: IPageMetaFiller;
  pageExtrasService: IPageExtrasService;
  quickSaveFolderResolver: IQuickSaveFolderResolver;
  settingsExportImportService: ISettingsExportImportService;
  bookmarkSearchService: IBookmarkSearchService;
}

export const ServicesContext = createContext<Services | null>(null);

interface Props {
  children: ReactNode;
}

export function ServicesProvider({ children }: Props) {
  const services = useMemo<Services>(() => {
    const bookmarkRuleRepository = new BookmarkRuleRepository();
    const domainAliasRepository = new DomainAliasRepository();
    const pageMatchGroupRepository = new PageMatchGroupRepository();
    const fileService = new FileService();
    const bookmarkRepository = new BookmarkRepository();

    const defaultFolderSettingsRepository = new DefaultFolderSettingsRepository();

    return {
      bookmarkRepository,
      bookmarkRuleRepository,
      defaultFolderSettingsRepository,
      domainAliasRepository,
      modeSettingsRepository: new ModeSettingsRepository(),
      pageMatchGroupRepository,
      fileService,
      pageMetaFiller: new PageMetaFiller(domainAliasRepository),
      pageExtrasService: new PageExtrasService(),
      quickSaveFolderResolver: new QuickSaveFolderResolver(bookmarkRuleRepository, defaultFolderSettingsRepository),
      settingsExportImportService: new SettingsExportImportService(
        bookmarkRuleRepository,
        domainAliasRepository,
        pageMatchGroupRepository,
        fileService,
      ),
      bookmarkSearchService: new BookmarkSearchService(bookmarkRepository),
    };
  }, []);

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
