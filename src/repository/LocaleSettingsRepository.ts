import { storage } from 'wxt/utils/storage';
import { StorageKey } from '../lib/storage-keys';
import { Locale } from '../locale';
import { StorageItemRepository } from './StorageItemRepository';
import type { ILocaleSettingsRepository } from './interfaces/ILocaleSettingsRepository';

export class LocaleSettingsRepository extends StorageItemRepository<Locale> implements ILocaleSettingsRepository {
  constructor() {
    super(storage.defineItem<Locale>(StorageKey.LOCALE, { fallback: Locale.RU }));
  }
}
