export const Theme = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];
