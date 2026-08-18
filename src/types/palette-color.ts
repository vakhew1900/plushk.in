// Shared 8-color palette — used by tags, entities, and workflow statuses alike.
// Deliberately not tied to any one domain's naming (see assets/globals.css'
// --palette-* tokens, kept separate from the semantic --red/--green/--blue tokens).
export const PaletteColor = {
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  GREEN: 'green',
  TEAL: 'teal',
  BLUE: 'blue',
  PURPLE: 'purple',
  PINK: 'pink',
} as const;
export type PaletteColor = (typeof PaletteColor)[keyof typeof PaletteColor];
