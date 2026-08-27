import { describe, expect, it, vi } from 'vitest';
import type { PageMeta } from '../../types/page-meta';
import { TargetFolderTemplateService } from '../TargetFolderTemplateService';

function makeMeta(overrides: Partial<PageMeta> = {}): PageMeta {
  return { url: 'https://mail.google.com', domain: 'mail.google.com', title: 'Inbox', ...overrides };
}

describe('TargetFolderTemplateService.resolve', () => {
  it('substitutes a service token with the current date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 24));

    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$__year$$/$$__month$$/$$__day$$', makeMeta())).toBe('2026/07/24');
    expect(await service.resolve('$$__date$$', makeMeta())).toBe('2026-07-24');

    vi.useRealTimers();
  });

  it('resolves alias to the DomainAlias name when meta.alias is set', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$alias$$/test', makeMeta({ alias: 'Gmail' }))).toBe('Gmail/test');
  });

  it('falls back to the domain when meta.alias is unset', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$alias$$/test', makeMeta())).toBe('mail.google.com/test');
  });

  it('resolves a regular PageMeta field by name', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$domain$$', makeMeta())).toBe('mail.google.com');
  });

  it('resolves an extras key by its bare name, without an extras. prefix', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$subreddit$$', makeMeta({ extras: { subreddit: 'programming' } }))).toBe('programming');
  });

  it('does not resolve the extras. prefixed form — collapses like any other unresolved token', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$extras.subreddit$$', makeMeta({ extras: { subreddit: 'programming' } }))).toBe('');
  });

  it('substitutes only the $$-wrapped token, leaving a bare occurrence of the same field name as literal text', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('subreddit/$$subreddit$$', makeMeta({ extras: { subreddit: 'programming' } }))).toBe('subreddit/programming');
  });

  it('collapses an unknown field name to an empty string', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$nope$$/fixed', makeMeta())).toBe('/fixed');
  });

  it('collapses an array-valued field to an empty string instead of joining it', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$tags$$/fixed', makeMeta({ tags: ['a', 'b'] }))).toBe('/fixed');
  });

  it('strips slashes and control characters from a resolved value before substitution', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$title$$', makeMeta({ title: 'A/B testing' }))).toBe('AB testing');
  });

  it('leaves a template with no tokens unchanged', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('Social/Reddit', makeMeta())).toBe('Social/Reddit');
  });

  it('lets a registered service token win over a same-named extras key', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1));

    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$__year$$', makeMeta({ extras: { __year: 'custom' } }))).toBe('2026');

    vi.useRealTimers();
  });

  it('does not fall back to extras for an unregistered __-prefixed name', async () => {
    const service = new TargetFolderTemplateService();
    expect(await service.resolve('$$__nope$$/fixed', makeMeta({ extras: { __nope: 'custom' } }))).toBe('/fixed');
  });
});
