import { storage } from 'wxt/utils/storage';
import { StorageKey } from '../lib/storage-keys';
import { Theme } from '../types/theme';
import { StorageItemRepository } from './StorageItemRepository';
import type { IThemeSettingsRepository } from './interfaces/IThemeSettingsRepository';

export class ThemeSettingsRepository extends StorageItemRepository<Theme> implements IThemeSettingsRepository {
  constructor() {
    super(storage.defineItem<Theme>(StorageKey.THEME, { fallback: Theme.DARK }));
  }
}
