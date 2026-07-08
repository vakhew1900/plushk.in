import { describe, expect, it } from 'vitest';
import { splitFolderPath } from '../bookmark-folder-utils';

describe('splitFolderPath', () => {
  it('splits a plain path into segments', () => {
    expect(splitFolderPath('Social/Reddit')).toEqual(['Social', 'Reddit']);
  });

  it('drops empty segments from leading/trailing slashes', () => {
    expect(splitFolderPath('/Social/Reddit/')).toEqual(['Social', 'Reddit']);
  });

  it('drops empty segments from doubled slashes', () => {
    expect(splitFolderPath('Social//Reddit')).toEqual(['Social', 'Reddit']);
  });

  it('returns an empty array for a blank or root-only path', () => {
    expect(splitFolderPath('')).toEqual([]);
    expect(splitFolderPath('/')).toEqual([]);
  });

  it('returns a single segment for a top-level folder', () => {
    expect(splitFolderPath('Videos')).toEqual(['Videos']);
  });
});
