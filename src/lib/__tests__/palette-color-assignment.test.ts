import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaletteColor } from '../../types/palette-color';
import { pickDefaultStatusColor } from '../palette-color-assignment';

describe('pickDefaultStatusColor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('never returns a color already used in the same workflow while unused colors remain', () => {
    const used: PaletteColor[] = [PaletteColor.RED, PaletteColor.BLUE, PaletteColor.GREEN];
    for (let i = 0; i < 50; i++) {
      const picked = pickDefaultStatusColor(used);
      expect(used).not.toContain(picked);
    }
  });

  it('picks the single remaining color when 7 of 8 are already used', () => {
    const used = Object.values(PaletteColor).filter((c) => c !== PaletteColor.PINK);
    expect(pickDefaultStatusColor(used)).toBe(PaletteColor.PINK);
  });

  it('falls back to the full palette once all 8 colors are already used', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const used = Object.values(PaletteColor);

    const picked = pickDefaultStatusColor(used);

    expect(Object.values(PaletteColor)).toContain(picked);
  });

  it('distributes across all 8 colors for a brand-new workflow (no used colors yet)', () => {
    const seen = new Set<PaletteColor>();
    for (let i = 0; i < 200; i++) {
      seen.add(pickDefaultStatusColor([]));
    }
    expect(seen.size).toBe(8);
  });
});
