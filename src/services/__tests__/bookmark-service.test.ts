import { describe, expect, it, vi } from 'vitest';
import type { Browser } from 'wxt/browser';
import type { PageMeta } from '../../types/page-meta';
import type { BookmarkDecision, IBookmarkModeHandler } from '../handler/interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from '../handler/interfaces/IBookmarkModeHandler';
import type { IBookmarkRepository } from '../../repository/interfaces/IBookmarkRepository';
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
  };
}

function makePageMetaFiller(): IPageMetaFiller {
  return { fillPageMeta: vi.fn(async () => meta) };
}

describe('BookmarkService.handleBookmarkCreated', () => {
  it('moves the bookmark into the decided folder when placed', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PLACED, targetFolder: 'Videos' }),
      repo,
      makePageMetaFiller(),
    );

    const decision = await service.handleBookmarkCreated(bookmark);

    expect(repo.move).toHaveBeenCalledWith('bm-1', 'Videos');
    expect(decision.targetFolder).toBe('Videos');
  });

  it('does not move the bookmark when placed without a target folder', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PLACED, targetFolder: undefined }),
      repo,
      makePageMetaFiller(),
    );

    await service.handleBookmarkCreated(bookmark);

    expect(repo.move).not.toHaveBeenCalled();
  });

  it('does not move the bookmark when only pending confirmation', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PENDING_CONFIRMATION, targetFolder: 'Videos' }),
      repo,
      makePageMetaFiller(),
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
    );

    await service.handleBookmarkCreated(bookmark);

    expect(repo.move).not.toHaveBeenCalled();
  });

  it('fills PageMeta from the bookmark before asking the mode handler', async () => {
    const repo = makeBookmarkRepository();
    const filler = makePageMetaFiller();
    const modeHandler = new FakeModeHandler({ status: BookmarkDecisionStatus.NOT_HANDLED });
    const onBookmarkSelectedSpy = vi.spyOn(modeHandler, 'onBookmarkSelected');
    const service = new BookmarkService(modeHandler, repo, filler);

    await service.handleBookmarkCreated(bookmark);

    expect(filler.fillPageMeta).toHaveBeenCalledWith(bookmark);
    expect(onBookmarkSelectedSpy).toHaveBeenCalledWith(meta);
  });
});
