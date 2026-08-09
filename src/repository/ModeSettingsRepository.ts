import { storage } from 'wxt/utils/storage';
import { StorageKey } from '../lib/storage-keys';
import { Mode } from '../types/mode';
import { StorageItemRepository } from './StorageItemRepository';
import type { IModeSettingsRepository } from './interfaces/IModeSettingsRepository';

export class ModeSettingsRepository extends StorageItemRepository<Mode> implements IModeSettingsRepository {
  constructor() {
    super(storage.defineItem<Mode>(StorageKey.MODE, { fallback: Mode.ON }));
  }
}
