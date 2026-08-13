import type { Theme } from '../../types/theme';

export interface IThemeSettingsRepository {
  get(): Promise<Theme>;
  set(theme: Theme): Promise<void>;
}
