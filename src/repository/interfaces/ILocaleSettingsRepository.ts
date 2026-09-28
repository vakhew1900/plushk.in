import type { Unwatch, WatchCallback } from 'wxt/utils/storage';
import type { Locale } from '../../locale';

export interface ILocaleSettingsRepository {
  get(): Promise<Locale>;
  set(locale: Locale): Promise<void>;
  /** Fires on any change to the persisted locale — e.g. a settings toggle in another tab. */
  watch(callback: WatchCallback<Locale>): Unwatch;
}
