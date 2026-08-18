import { storage } from 'wxt/utils/storage';
import { StorageKey } from '../lib/storage-keys';
import { StorageItemRepository } from './StorageItemRepository';
import type { IDefaultFolderSettingsRepository } from './interfaces/IDefaultFolderSettingsRepository';

export class DefaultFolderSettingsRepository
  extends StorageItemRepository<string>
  implements IDefaultFolderSettingsRepository
{
  constructor() {
    super(storage.defineItem<string>(StorageKey.DEFAULT_FOLDER, { fallback: '' }));
  }
}
