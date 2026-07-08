import { describe, expect, it, vi } from 'vitest';
import type { Browser } from 'wxt/browser';
import type { PageMeta } from '../../types/page-meta';
import type { BookmarkDecision, IBookmarkModeHandler } from '../interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from '../interfaces/IBookmarkModeHandler';
import type { IBookmarkRepository } from '../../repository/interfaces/IBookmarkRepository';
import { BookmarkService } from '../BookmarkService';

const meta: PageMeta = {
  url: 'https://youtube.com/watch?v=abc123',
  domain: 'youtube.com',
  title: 'React Tutorial for Beginners',
};

class FakeModeHandler implements IBookmarkModeHandler {
  constructor(private readonly decision: BookmarkDecision) {}
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

describe('BookmarkService.handleBookmarkCreated', () => {
  it('moves the bookmark into the decided folder when placed', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PLACED, targetFolder: 'Videos' }),
      repo,
    );

    const decision = await service.handleBookmarkCreated('bm-1', meta);

    expect(repo.move).toHaveBeenCalledWith('bm-1', 'Videos');
    expect(decision.targetFolder).toBe('Videos');
  });

  it('does not move the bookmark when placed without a target folder', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PLACED, targetFolder: undefined }),
      repo,
    );

    await service.handleBookmarkCreated('bm-1', meta);

    expect(repo.move).not.toHaveBeenCalled();
  });

  it('does not move the bookmark when only pending confirmation', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(
      new FakeModeHandler({ status: BookmarkDecisionStatus.PENDING_CONFIRMATION, targetFolder: 'Videos' }),
      repo,
    );

    await service.handleBookmarkCreated('bm-1', meta);

    expect(repo.move).not.toHaveBeenCalled();
  });

  it('does not move the bookmark when not handled', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(new FakeModeHandler({ status: BookmarkDecisionStatus.NOT_HANDLED }), repo);

    await service.handleBookmarkCreated('bm-1', meta);

    expect(repo.move).not.toHaveBeenCalled();
  });
});

describe('BookmarkService.confirmPlacement', () => {
  it('moves the bookmark into the given folder', async () => {
    const repo = makeBookmarkRepository();
    const service = new BookmarkService(new FakeModeHandler({ status: BookmarkDecisionStatus.NOT_HANDLED }), repo);

    await service.confirmPlacement('bm-1', 'Social/Reddit');

    expect(repo.move).toHaveBeenCalledWith('bm-1', 'Social/Reddit');
  });
});
