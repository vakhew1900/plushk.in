import type { Locale } from '../../locale';

export interface ILocaleSettingsRepository {
  get(): Promise<Locale>;
  set(locale: Locale): Promise<void>;
}
