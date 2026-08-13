import { PaletteColor } from '../types/palette-color';

const ALL_COLORS: PaletteColor[] = Object.values(PaletteColor);

// Default color for a newly added workflow status: picks uniformly at random
// among colors not yet used by the workflow's existing statuses, so statuses
// added one at a time (across sessions) still avoid collisions until the 9th
// status. Falls back to a random pick from the full palette past that point.
export function pickDefaultStatusColor(usedColors: PaletteColor[]): PaletteColor {
  const available = ALL_COLORS.filter((color) => !usedColors.includes(color));
  const pool = available.length > 0 ? available : ALL_COLORS;
  return pool[Math.floor(Math.random() * pool.length)];
}
