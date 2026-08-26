import { describe, expect, it } from 'vitest';
import { resolveServiceToken, ServiceToken } from '../service-tokens';
import type { ServiceTokenContext } from '../service-tokens';

const tokenContext: ServiceTokenContext = { now: new Date(2026, 6, 4) }; // 2026-07-04

describe('resolveServiceToken', () => {
  it('resolves __year as YYYY', () => {
    expect(resolveServiceToken(ServiceToken.YEAR, tokenContext)).toBe('2026');
  });

  it('resolves __month as MM with a leading zero', () => {
    expect(resolveServiceToken(ServiceToken.MONTH, tokenContext)).toBe('07');
  });

  it('resolves __day as DD with a leading zero', () => {
    expect(resolveServiceToken(ServiceToken.DAY, tokenContext)).toBe('04');
  });

  it('resolves __date as YYYY-MM-DD', () => {
    expect(resolveServiceToken(ServiceToken.DATE, tokenContext)).toBe('2026-07-04');
  });

  it('returns undefined for an unregistered __-prefixed name', () => {
    expect(resolveServiceToken('__nope', tokenContext)).toBeUndefined();
  });

  it('returns undefined for a name without the __ prefix', () => {
    expect(resolveServiceToken('year', tokenContext)).toBeUndefined();
  });
});
