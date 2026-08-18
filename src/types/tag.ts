import type { PaletteColor } from './palette-color';

export type Tag = {
  id: string;
  name: string;
  color: PaletteColor;
};

export const TagField = {
  ID: 'id',
  NAME: 'name',
  COLOR: 'color',
} as const;
export type TagField = (typeof TagField)[keyof typeof TagField];
