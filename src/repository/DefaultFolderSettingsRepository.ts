import { storage } from 'wxt/utils/storage';
import { StorageKey } from '../lib/storage-keys';
import type { IDefaultFolderSettingsRepository } from './interfaces/IDefaultFolderSettingsRepository';

const defaultFolderItem = storage.defineItem<string>(StorageKey.DEFAULT_FOLDER, { fallback: '' });

export class DefaultFolderSettingsRepository implements IDefaultFolderSettingsRepository {
  get(): Promise<string> {
    return defaultFolderItem.getValue();
  }

  set(path: string): Promise<void> {
    return defaultFolderItem.setValue(path);
  }
}
