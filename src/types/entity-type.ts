import type { PaletteColor } from './palette-color';
import type { IconName } from './icon-name';

export type EntityType = {
  id: string;
  name: string;
  color: PaletteColor;
  icon?: IconName;
};

export const EntityTypeField = {
  ID: 'id',
  NAME: 'name',
  COLOR: 'color',
  ICON: 'icon',
} as const;
export type EntityTypeField = (typeof EntityTypeField)[keyof typeof EntityTypeField];
