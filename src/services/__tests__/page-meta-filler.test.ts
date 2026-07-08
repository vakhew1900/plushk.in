import { describe, expect, it } from 'vitest';
import { PageMetaFiller } from '../PageMetaFiller';

describe('PageMetaFiller', () => {
  it('derives url/domain/title from a bookmark node', async () => {
    const filler = new PageMetaFiller();

    const meta = await filler.fillPageMeta({
      id: 'bm-1',
      title: 'React Tutorial for Beginners',
      url: 'https://youtube.com/watch?v=abc123',
      syncing: false,
    });

    expect(meta).toEqual({
      url: 'https://youtube.com/watch?v=abc123',
      domain: 'youtube.com',
      title: 'React Tutorial for Beginners',
    });
  });

  it('falls back to an empty url/domain when the node has no url', async () => {
    const filler = new PageMetaFiller();

    const meta = await filler.fillPageMeta({
      id: 'folder-1',
      title: 'Videos',
      syncing: false,
    });

    expect(meta).toEqual({ url: '', domain: '', title: 'Videos' });
  });
});
