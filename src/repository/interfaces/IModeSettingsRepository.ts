import type { Mode } from '../../types/mode';

export interface IModeSettingsRepository {
  get(): Promise<Mode>;
  set(mode: Mode): Promise<void>;
}
