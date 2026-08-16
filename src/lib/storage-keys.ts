// WXT storage item keys (`area:key`, see wxt/utils/storage) for repository-layer
// settings. Grouped here so every `local:*` key lives in one place instead of
// scattered inline literals across repository files.
export const StorageKey = {
  MODE: 'local:mode',
  DEFAULT_FOLDER: 'local:defaultFolder',
  THEME: 'local:theme',
  LOCALE: 'local:locale',
} as const;
export type StorageKey = typeof StorageKey[keyof typeof StorageKey];
