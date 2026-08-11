export const TagColor = {
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  GREEN: 'green',
  TEAL: 'teal',
  BLUE: 'blue',
  PURPLE: 'purple',
  PINK: 'pink',
} as const;
export type TagColor = (typeof TagColor)[keyof typeof TagColor];

export type Tag = {
  id: string;
  name: string;
  color: TagColor;
};

export const TagField = {
  ID: 'id',
  NAME: 'name',
  COLOR: 'color',
} as const;
export type TagField = (typeof TagField)[keyof typeof TagField];
