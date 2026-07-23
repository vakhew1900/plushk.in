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
import { FileService } from '@/services/FileService';
import { QuickSaveService } from '@/services/QuickSaveService';
import { SettingsExportImportService } from '@/services/SettingsExportImportService';
import type { IFileService } from '@/services/interfaces/IFileService';
import type { IQuickSaveService } from '@/services/interfaces/IQuickSaveService';
import type { ISettingsExportImportService } from '@/services/interfaces/ISettingsExportImportService';

export interface Services {
  bookmarkRepository: IBookmarkRepository;
  bookmarkRuleRepository: IBookmarkRuleRepository;
  domainAliasRepository: IDomainAliasRepository;
  modeSettingsRepository: IModeSettingsRepository;
  pageMatchGroupRepository: IPageMatchGroupRepository;
  pendingHintRepository: IPendingHintRepository;
  fileService: IFileService;
  quickSaveService: IQuickSaveService;
  settingsExportImportService: ISettingsExportImportService;
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

    return {
      bookmarkRepository: new BookmarkRepository(),
      bookmarkRuleRepository,
      domainAliasRepository,
      modeSettingsRepository: new ModeSettingsRepository(),
      pageMatchGroupRepository,
      pendingHintRepository: new PendingHintRepository(),
      fileService,
      quickSaveService: new QuickSaveService(),
      settingsExportImportService: new SettingsExportImportService(
        bookmarkRuleRepository,
        domainAliasRepository,
        pageMatchGroupRepository,
        fileService,
      ),
    };
  }, []);

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
