import type { PaletteColor } from './palette-color';

// icon?: IconName is reserved for UI-8 (icon picker) — not added yet since
// there's no icon registry to reference; the settings UI only shows a disabled slot for it.
export type EntityType = {
  id: string;
  name: string;
  color: PaletteColor;
};

export const EntityTypeField = {
  ID: 'id',
  NAME: 'name',
  COLOR: 'color',
} as const;
export type EntityTypeField = (typeof EntityTypeField)[keyof typeof EntityTypeField];
