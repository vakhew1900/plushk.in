import { fromExportPageMatchGroup, isSettingsExport, toExportPageMatchGroup } from '../lib/settings-export-mapping';
import { SETTINGS_EXPORT_VERSION } from '../types/settings-export';
import type { SettingsExport } from '../types/settings-export';
import type { IBookmarkRuleRepository } from '../repository/interfaces/IBookmarkRuleRepository';
import type { IDomainAliasRepository } from '../repository/interfaces/IDomainAliasRepository';
import type { IPageMatchGroupRepository } from '../repository/interfaces/IPageMatchGroupRepository';
import { MimeType } from './interfaces/IFileService';
import type { IFileService } from './interfaces/IFileService';
import type { ISettingsExportImportService } from './interfaces/ISettingsExportImportService';

export class SettingsExportImportService implements ISettingsExportImportService {
  constructor(
    private readonly bookmarkRuleRepository: IBookmarkRuleRepository,
    private readonly domainAliasRepository: IDomainAliasRepository,
    private readonly pageMatchGroupRepository: IPageMatchGroupRepository,
    private readonly fileService: IFileService,
  ) {}

  async exportSettings(): Promise<void> {
    const data = await this.buildExportData();
    await this.downloadExport(data);
  }

  private async buildExportData(): Promise<SettingsExport> {
    const [rules, domainAliases, pageMatchGroups] = await Promise.all([
      this.bookmarkRuleRepository.getAll(),
      this.domainAliasRepository.getAll(),
      this.pageMatchGroupRepository.getAll(),
    ]);

    return {
      version: SETTINGS_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      rules,
      domainAliases,
      pageMatchGroups: pageMatchGroups.map(toExportPageMatchGroup),
    };
  }

  private async downloadExport(data: SettingsExport): Promise<void> {
    const filename = `plushkin-settings-${data.exportedAt.slice(0, 10)}.json`;
    await this.fileService.save(filename, JSON.stringify(data, null, 2), MimeType.JSON);
  }

  async importSettings(data: unknown): Promise<void> {
    if (!isSettingsExport(data)) {
      throw new Error('Invalid settings export file');
    }

    await Promise.all([
      ...data.rules.map((rule) => this.bookmarkRuleRepository.save(rule)),
      ...data.domainAliases.map((alias) => this.domainAliasRepository.save(alias)),
      ...data.pageMatchGroups.map((group) =>
        this.pageMatchGroupRepository.save(fromExportPageMatchGroup(group)),
      ),
    ]);
  }
}
