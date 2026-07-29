import { describe, expect, it, vi } from 'vitest';
import type { Browser } from 'wxt/browser';
import type { PageMeta } from '../../types/page-meta';
import type { BookmarkDecision, IBookmarkModeHandler } from '../handler/interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from '../handler/interfaces/IBookmarkModeHandler';
import type { IBookmarkRepository } from '../../repository/interfaces/IBookmarkRepository';
import type { IDefaultFolderSettingsRepository } from '../../repository/interfaces/IDefaultFolderSettingsRepository';
import type { IPageMetaFiller } from '../interfaces/IPageMetaFiller';
import { BookmarkService } from '../BookmarkService';

const bookmark: Browser.bookmarks.BookmarkTreeNode = {
  id: 'bm-1',
  title: 'React Tutorial for Beginners',
  url: 'https://youtube.com/watch?v=abc123',
  syncing: false,
};

const meta: PageMeta = {
  url: bookmark.url!,
  domain: 'youtube.com',
  title: bookmark.title,
};

class FakeModeHandler implements IBookmarkModeHandler {
  readonly status: BookmarkDecisionStatus;
  constructor(private readonly decision: BookmarkDecision) {
    this.status = decision.status;
  }
  async onBookmarkSelected(): Promise<BookmarkDecision> {
    return this.decision;
  }
}

function makeBookmarkRepository(): IBookmarkRepository & { move: ReturnType<typeof vi.fn> } {
  return {
    create: vi.fn(async (): Promise<Browser.bookmarks.BookmarkTreeNode> => ({ id: 'new-id', title: '', syncing: false })),
    move: vi.fn(async () => {}),
    getByTitle: vi.fn(async () => []),
    listAll: vi.fn(async () => []),
  };
}

function makePageMetaFiller(): IPageMetaFiller {
  return { fillPageMeta: vi.fn(async () => meta) };
}

function makeDefaultFolderSettingsRepository(
  defaultFolder = '',
): IDefaultFolderSettingsRepository & { get: ReturnType<typeof vi.fn> } {
  return {
    get: vi.fn(async () => defaultFolder),
    set: vi.fn(async () => {}),
  };
}

describe('BookmarkService.handleBookmarkCreated', () => {
  it('moves the bookmark into the decided folder when placed', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PLACED, targetFolder: 'Videos' }),
      repo,
      makePageMetaFiller(),
      makeDefaultFolderSettingsRepository(),
    );

    const decision = await service.handleBookmarkCreated(bookmark);

    expect(repo.move).toHaveBeenCalledWith('bm-1', 'Videos');
    expect(decision.targetFolder).toBe('Videos');
  });

  it('moves the bookmark into the configured default folder when placed without a matched folder', async () => {
    const repo = makeBookmarkRepository();
    const defaultFolderRepo = makeDefaultFolderSettingsRepository('Reading/Later');
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PLACED, targetFolder: undefined }),
      repo,
      makePageMetaFiller(),
      defaultFolderRepo,
    );

    await service.handleBookmarkCreated(bookmark);

    expect(defaultFolderRepo.get).toHaveBeenCalled();
    expect(repo.move).toHaveBeenCalledWith('bm-1', 'Reading/Later');
  });

  it('moves the bookmark with an empty folder (Bookmarks Toolbar) when placed without a matched folder and no default folder is configured', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PLACED, targetFolder: undefined }),
      repo,
      makePageMetaFiller(),
      makeDefaultFolderSettingsRepository(''),
    );

    await service.handleBookmarkCreated(bookmark);

    expect(repo.move).toHaveBeenCalledWith('bm-1', '');
  });

  it('does not move the bookmark when only pending confirmation', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PENDING_CONFIRMATION, targetFolder: 'Videos' }),
      repo,
      makePageMetaFiller(),
      makeDefaultFolderSettingsRepository(),
    );

    await service.handleBookmarkCreated(bookmark);

    expect(repo.move).not.toHaveBeenCalled();
  });

  it('does not move the bookmark when not handled', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.NOT_HANDLED }),
      repo,
      makePageMetaFiller(),
      makeDefaultFolderSettingsRepository(),
    );

    await service.handleBookmarkCreated(bookmark);

    expect(repo.move).not.toHaveBeenCalled();
  });

  it('fills PageMeta from the bookmark before asking the mode handler', async () => {
    const repo = makeBookmarkRepository();
    const filler = makePageMetaFiller();
    const modeHandler = new FakeModeHandler({ status: BookmarkDecisionStatus.NOT_HANDLED });
    const onBookmarkSelectedSpy = vi.spyOn(modeHandler, 'onBookmarkSelected');
    const service = new BookmarkService(modeHandler, repo, filler, makeDefaultFolderSettingsRepository());

    await service.handleBookmarkCreated(bookmark);

    expect(filler.fillPageMeta).toHaveBeenCalledWith(bookmark);
    expect(onBookmarkSelectedSpy).toHaveBeenCalledWith(meta);
  });
});
