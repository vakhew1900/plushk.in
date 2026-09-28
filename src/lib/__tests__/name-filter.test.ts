import { describe, expect, it } from 'vitest';
import { filterByName } from '../name-filter';

interface Named {
  name: string;
}

const getName = (item: Named) => item.name;

describe('filterByName', () => {
  const items: Named[] = [{ name: 'GitHub' }, { name: 'YouTube' }, { name: 'Reddit' }];

  it('matches by case-insensitive substring', () => {
    expect(filterByName(items, 'git', getName)).toEqual([{ name: 'GitHub' }]);
    expect(filterByName(items, 'HUB', getName)).toEqual([{ name: 'GitHub' }]);
  });

  it('returns the full list unchanged for an empty query', () => {
    expect(filterByName(items, '', getName)).toEqual(items);
  });

  it('returns the full list unchanged for a whitespace-only query', () => {
    expect(filterByName(items, '   ', getName)).toEqual(items);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterByName(items, 'zzz', getName)).toEqual([]);
  });

  it('does not mutate the input array', () => {
    const copy = [...items];
    filterByName(items, 'g', getName);
    expect(items).toEqual(copy);
  });
});
