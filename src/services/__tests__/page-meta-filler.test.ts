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

    const result = await filler.fillPageMeta({
      title: 'React Tutorial for Beginners',
      url: 'https://youtube.com/watch?v=abc123',
    });

    expect(result.meta).toEqual({
      url: 'https://youtube.com/watch?v=abc123',
      domain: 'youtube.com',
      title: 'React Tutorial for Beginners',
    });
    expect(result.aliasId).toBeUndefined();
  });

  it('falls back to an empty url/domain when no url is given', async () => {
    const filler = new PageMetaFiller(createDomainAliasRepositoryStub([]));

    const result = await filler.fillPageMeta({ title: 'Videos' });

    expect(result.meta).toEqual({ url: '', domain: '', title: 'Videos' });
  });

  it('resolves alias from a DomainAlias whose domain_names includes the page domain', async () => {
    const filler = new PageMetaFiller(
      createDomainAliasRepositoryStub([
        { id: '1', name: 'Gmail', domain_names: ['gmail.com', 'mail.google.com'] },
      ]),
    );

    const result = await filler.fillPageMeta({ title: 'Inbox', url: 'https://mail.google.com/mail/u/0' });

    expect(result.meta.alias).toBe('Gmail');
    expect(result.aliasId).toBe('1');
  });

  it('leaves alias undefined when no DomainAlias matches the domain', async () => {
    const filler = new PageMetaFiller(
      createDomainAliasRepositoryStub([{ id: '1', name: 'Gmail', domain_names: ['gmail.com'] }]),
    );

    const result = await filler.fillPageMeta({ title: 'Docs', url: 'https://docs.google.com/document/1' });

    expect(result.meta.alias).toBeUndefined();
    expect(result.aliasId).toBeUndefined();
  });
});
