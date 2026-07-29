import { describe, expect, it } from 'vitest';
import { PageMetaFiller } from '../PageMetaFiller';

describe('PageMetaFiller', () => {
  it('derives url/domain/title from url/title input', async () => {
    const filler = new PageMetaFiller();

    const meta = await filler.fillPageMeta({
      title: 'React Tutorial for Beginners',
      url: 'https://youtube.com/watch?v=abc123',
    });

    expect(meta).toEqual({
      url: 'https://youtube.com/watch?v=abc123',
      domain: 'youtube.com',
      title: 'React Tutorial for Beginners',
    });
  });

  it('falls back to an empty url/domain when no url is given', async () => {
    const filler = new PageMetaFiller();

    const meta = await filler.fillPageMeta({ title: 'Videos' });

    expect(meta).toEqual({ url: '', domain: '', title: 'Videos' });
  });
});
