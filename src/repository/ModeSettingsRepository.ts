import { storage } from 'wxt/utils/storage';
import { StorageKey } from '../lib/storage-keys';
import { Mode } from '../types/mode';
import type { IModeSettingsRepository } from './interfaces/IModeSettingsRepository';

const modeItem = storage.defineItem<Mode>(StorageKey.MODE, { fallback: Mode.ON });

export class ModeSettingsRepository implements IModeSettingsRepository {
  get(): Promise<Mode> {
    return modeItem.getValue();
  }

  set(mode: Mode): Promise<void> {
    return modeItem.setValue(mode);
  }
}
