import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { BookmarkRepository } from '@/repository/BookmarkRepository';
import { BookmarkRuleRepository } from '@/repository/BookmarkRuleRepository';
import { DefaultFolderSettingsRepository } from '@/repository/DefaultFolderSettingsRepository';
import { DomainAliasRepository } from '@/repository/DomainAliasRepository';
import { ModeSettingsRepository } from '@/repository/ModeSettingsRepository';
import { ThemeSettingsRepository } from '@/repository/ThemeSettingsRepository';
import { LocaleSettingsRepository } from '@/repository/LocaleSettingsRepository';
import { PageMatchGroupRepository } from '@/repository/PageMatchGroupRepository';
import { TagRepository } from '@/repository/TagRepository';
import { BookmarkTagLinkRepository } from '@/repository/BookmarkTagLinkRepository';
import { EntityTypeRepository } from '@/repository/EntityTypeRepository';
import { WorkflowRepository } from '@/repository/WorkflowRepository';
import { WorkflowStatusRepository } from '@/repository/WorkflowStatusRepository';
import { BookmarkEntityLinkRepository } from '@/repository/BookmarkEntityLinkRepository';
import { BookmarkQuickSaveLinksRepository } from '@/repository/BookmarkQuickSaveLinksRepository';
import { IconRuleRepository } from '@/repository/IconRuleRepository';
import { IconBookmarkRepository } from '@/repository/IconBookmarkRepository';
import type { IBookmarkRepository } from '@/repository/interfaces/IBookmarkRepository';
import type { IBookmarkTagLinkRepository } from '@/repository/interfaces/IBookmarkTagLinkRepository';
import type { IBookmarkRuleRepository } from '@/repository/interfaces/IBookmarkRuleRepository';
import type { IDefaultFolderSettingsRepository } from '@/repository/interfaces/IDefaultFolderSettingsRepository';
import type { IDomainAliasRepository } from '@/repository/interfaces/IDomainAliasRepository';
import type { IModeSettingsRepository } from '@/repository/interfaces/IModeSettingsRepository';
import type { IThemeSettingsRepository } from '@/repository/interfaces/IThemeSettingsRepository';
import type { ILocaleSettingsRepository } from '@/repository/interfaces/ILocaleSettingsRepository';
import type { IPageMatchGroupRepository } from '@/repository/interfaces/IPageMatchGroupRepository';
import type { ITagRepository } from '@/repository/interfaces/ITagRepository';
import type { IEntityTypeRepository } from '@/repository/interfaces/IEntityTypeRepository';
import type { IWorkflowRepository } from '@/repository/interfaces/IWorkflowRepository';
import type { IWorkflowStatusRepository } from '@/repository/interfaces/IWorkflowStatusRepository';
import type { IBookmarkEntityLinkRepository } from '@/repository/interfaces/IBookmarkEntityLinkRepository';
import type { IBookmarkQuickSaveLinksRepository } from '@/repository/interfaces/IBookmarkQuickSaveLinksRepository';
import type { IIconRuleRepository } from '@/repository/interfaces/IIconRuleRepository';
import type { IIconBookmarkRepository } from '@/repository/interfaces/IIconBookmarkRepository';
import { BookmarkSearchService } from '@/services/BookmarkSearchService';
import { BookmarkService } from '@/services/BookmarkService';
import { FileService } from '@/services/FileService';
import { PageExtrasService } from '@/services/PageExtrasService';
import { IconExtrasService } from '@/services/IconExtrasService';
import { IconLinkService } from '@/services/IconLinkService';
import { PageMetaFiller } from '@/services/PageMetaFiller';
import { QuickSaveFolderResolver } from '@/services/QuickSaveFolderResolver';
import { QuickSaveBookmarkCreator } from '@/services/QuickSaveBookmarkCreator';
import { SettingsExportImportService } from '@/services/SettingsExportImportService';
import type { IBookmarkSearchService } from '@/services/interfaces/IBookmarkSearchService';
import type { IBookmarkService } from '@/services/interfaces/IBookmarkService';
import type { IFileService } from '@/services/interfaces/IFileService';
import type { IPageExtrasService } from '@/services/interfaces/IPageExtrasService';
import type { IIconLinkService } from '@/services/interfaces/IIconLinkService';
import type { IPageMetaFiller } from '@/services/interfaces/IPageMetaFiller';
import type { IQuickSaveFolderResolver } from '@/services/interfaces/IQuickSaveFolderResolver';
import type { IQuickSaveBookmarkCreator } from '@/services/interfaces/IQuickSaveBookmarkCreator';
import type { ISettingsExportImportService } from '@/services/interfaces/ISettingsExportImportService';

export interface Services {
  bookmarkRepository: IBookmarkRepository;
  bookmarkRuleRepository: IBookmarkRuleRepository;
  defaultFolderSettingsRepository: IDefaultFolderSettingsRepository;
  domainAliasRepository: IDomainAliasRepository;
  modeSettingsRepository: IModeSettingsRepository;
  themeSettingsRepository: IThemeSettingsRepository;
  localeSettingsRepository: ILocaleSettingsRepository;
  pageMatchGroupRepository: IPageMatchGroupRepository;
  fileService: IFileService;
  pageMetaFiller: IPageMetaFiller;
  pageExtrasService: IPageExtrasService;
  quickSaveFolderResolver: IQuickSaveFolderResolver;
  quickSaveBookmarkCreator: IQuickSaveBookmarkCreator;
  settingsExportImportService: ISettingsExportImportService;
  bookmarkSearchService: IBookmarkSearchService;
  bookmarkService: IBookmarkService;
  tagRepository: ITagRepository;
  bookmarkTagLinkRepository: IBookmarkTagLinkRepository;
  entityTypeRepository: IEntityTypeRepository;
  workflowRepository: IWorkflowRepository;
  workflowStatusRepository: IWorkflowStatusRepository;
  bookmarkEntityLinkRepository: IBookmarkEntityLinkRepository;
  bookmarkQuickSaveLinksRepository: IBookmarkQuickSaveLinksRepository;
  iconRuleRepository: IIconRuleRepository;
  iconBookmarkRepository: IIconBookmarkRepository;
  iconLinkService: IIconLinkService;
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
    const tagRepository = new TagRepository();
    const entityTypeRepository = new EntityTypeRepository();
    const bookmarkQuickSaveLinksRepository = new BookmarkQuickSaveLinksRepository();
    const bookmarkTagLinkRepository = new BookmarkTagLinkRepository();
    const bookmarkEntityLinkRepository = new BookmarkEntityLinkRepository();
    const iconRuleRepository = new IconRuleRepository();
    const iconBookmarkRepository = new IconBookmarkRepository();

    return {
      bookmarkRepository,
      bookmarkRuleRepository,
      defaultFolderSettingsRepository,
      domainAliasRepository,
      modeSettingsRepository: new ModeSettingsRepository(),
      themeSettingsRepository: new ThemeSettingsRepository(),
      localeSettingsRepository: new LocaleSettingsRepository(),
      pageMatchGroupRepository,
      fileService,
      pageMetaFiller: new PageMetaFiller(domainAliasRepository),
      pageExtrasService: new PageExtrasService(),
      quickSaveFolderResolver: new QuickSaveFolderResolver(bookmarkRuleRepository, defaultFolderSettingsRepository),
      quickSaveBookmarkCreator: new QuickSaveBookmarkCreator(bookmarkRepository, bookmarkQuickSaveLinksRepository, iconBookmarkRepository),
      bookmarkQuickSaveLinksRepository,
      settingsExportImportService: new SettingsExportImportService(
        bookmarkRuleRepository,
        domainAliasRepository,
        pageMatchGroupRepository,
        tagRepository,
        entityTypeRepository,
        iconRuleRepository,
        fileService,
      ),
      bookmarkSearchService: new BookmarkSearchService(
        bookmarkRepository,
        bookmarkTagLinkRepository,
        bookmarkEntityLinkRepository,
      ),
      bookmarkService: new BookmarkService(bookmarkTagLinkRepository, bookmarkEntityLinkRepository, iconBookmarkRepository),
      tagRepository,
      bookmarkTagLinkRepository,
      entityTypeRepository,
      workflowRepository: new WorkflowRepository(),
      workflowStatusRepository: new WorkflowStatusRepository(),
      bookmarkEntityLinkRepository,
      iconRuleRepository,
      iconBookmarkRepository,
      iconLinkService: new IconLinkService(iconRuleRepository, iconBookmarkRepository, new IconExtrasService()),
    };
  }, []);

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
