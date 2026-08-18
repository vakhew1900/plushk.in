import { describe, expect, it } from 'vitest';
import { hasValidName } from '../named-entity';

describe('hasValidName', () => {
  it('rejects an empty string', () => {
    expect(hasValidName('')).toBe(false);
  });

  it('rejects a whitespace-only string', () => {
    expect(hasValidName('   ')).toBe(false);
  });

  it('accepts a name with surrounding whitespace', () => {
    expect(hasValidName('  Tutorial  ')).toBe(true);
  });

  it('accepts a normal name', () => {
    expect(hasValidName('Tutorial')).toBe(true);
  });
});
