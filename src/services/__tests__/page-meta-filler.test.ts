import { describe, expect, it } from 'vitest';
import type { IDomainAliasRepository } from '../../repository/interfaces/IDomainAliasRepository';
import type { DomainAlias } from '../../types/domain-alias';
import { PageMetaFiller } from '../PageMetaFiller';

function createDomainAliasRepositoryStub(aliases: DomainAlias[]): IDomainAliasRepository {
  return {
    getAll: async () => aliases,
    getById: async (id) => aliases.find((a) => a.id === id),
    save: async () => {},
    remove: async () => {},
  };
}

describe('PageMetaFiller', () => {
  it('derives url/domain/title from url/title input', async () => {
    const filler = new PageMetaFiller(createDomainAliasRepositoryStub([]));

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
    const filler = new PageMetaFiller(createDomainAliasRepositoryStub([]));

    const meta = await filler.fillPageMeta({ title: 'Videos' });

    expect(meta).toEqual({ url: '', domain: '', title: 'Videos' });
  });

  it('resolves alias from a DomainAlias whose domain_names includes the page domain', async () => {
    const filler = new PageMetaFiller(
      createDomainAliasRepositoryStub([
        { id: '1', name: 'Gmail', domain_names: ['gmail.com', 'mail.google.com'] },
      ]),
    );

    const meta = await filler.fillPageMeta({ title: 'Inbox', url: 'https://mail.google.com/mail/u/0' });

    expect(meta.alias).toBe('Gmail');
  });

  it('leaves alias undefined when no DomainAlias matches the domain', async () => {
    const filler = new PageMetaFiller(
      createDomainAliasRepositoryStub([{ id: '1', name: 'Gmail', domain_names: ['gmail.com'] }]),
    );

    const meta = await filler.fillPageMeta({ title: 'Docs', url: 'https://docs.google.com/document/1' });

    expect(meta.alias).toBeUndefined();
  });
});
