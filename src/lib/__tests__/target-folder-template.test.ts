import { describe, expect, it } from 'vitest';
import { applyTargetFolderTemplate, extractTemplateTokenNames } from '../target-folder-template';

describe('extractTemplateTokenNames', () => {
  it('returns every token name found, in order', () => {
    expect(extractTemplateTokenNames('$$__year$$/$$alias$$/test')).toEqual(['__year', 'alias']);
  });

  it('returns an empty array for a template with no tokens', () => {
    expect(extractTemplateTokenNames('Social/Reddit')).toEqual([]);
  });

  it('ignores a bare occurrence of a token name that is not wrapped in $$...$$', () => {
    // Only the wrapped `$$__year$$` counts — the literal segment "__year" before it must not be picked up.
    expect(extractTemplateTokenNames('__year/$$__year$$')).toEqual(['__year']);
  });

  it('splits two adjacent tokens with no separator between them', () => {
    expect(extractTemplateTokenNames('$$__year$$$$__month$$')).toEqual(['__year', '__month']);
  });
});

describe('applyTargetFolderTemplate', () => {
  it('substitutes every token with its resolved value', () => {
    expect(applyTargetFolderTemplate('$$__year$$/$$alias$$/test', { __year: '2026', alias: 'Gmail' })).toBe('2026/Gmail/test');
  });

  it('collapses a token missing from values to an empty string', () => {
    expect(applyTargetFolderTemplate('$$nope$$/fixed', {})).toBe('/fixed');
  });

  it('leaves a template with no tokens unchanged', () => {
    expect(applyTargetFolderTemplate('Social/Reddit', {})).toBe('Social/Reddit');
  });

  it('substitutes only the wrapped occurrence, leaving a bare same-named segment untouched', () => {
    expect(applyTargetFolderTemplate('__year/$$__year$$', { __year: '2026' })).toBe('__year/2026');
  });

  it('substitutes two adjacent tokens with no separator between them', () => {
    expect(applyTargetFolderTemplate('$$__year$$$$__month$$', { __year: '2026', __month: '07' })).toBe('202607');
  });
});
