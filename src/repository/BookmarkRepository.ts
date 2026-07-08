import { browser } from 'wxt/browser';
import type { Browser } from 'wxt/browser';
import { splitFolderPath } from '../lib/bookmark-folder-utils';
import type { IBookmarkRepository } from './interfaces/IBookmarkRepository';

type BookmarkTreeNode = Browser.bookmarks.BookmarkTreeNode;

/**
 * Gateway over `browser.bookmarks`. `chrome.bookmarks` only knows folders by
 * `parentId`, and can't create a nested path in one call — so a `/`-separated
 * `targetFolder` like "Social/Reddit" has to be walked and resolved (or
 * created) one segment at a time.
 */
export class BookmarkRepository implements IBookmarkRepository {
  async create(title: string, url: string, targetFolder?: string): Promise<BookmarkTreeNode> {
    if (!targetFolder) {
      return browser.bookmarks.create({ title, url });
    }

    const parentId = await this.resolveFolderPath(targetFolder);
    return browser.bookmarks.create({ title, url, parentId });
  }

  async move(id: string, targetFolder: string): Promise<void> {
    const parentId = await this.resolveFolderPath(targetFolder);
    await browser.bookmarks.move(id, { parentId });
  }

  async getByTitle(title: string): Promise<BookmarkTreeNode[]> {
    const results = await browser.bookmarks.search({ title });
    return results.filter((node) => node.title === title && node.url !== undefined);
  }

  private async resolveFolderPath(path: string): Promise<string> {
    const segments = splitFolderPath(path);
    let parentId: string | undefined;

    for (const segment of segments) {
      parentId = await this.findOrCreateFolder(segment, parentId);
    }

    if (!parentId) {
      throw new Error(`Invalid target folder path: "${path}"`);
    }

    return parentId;
  }

  private async findOrCreateFolder(title: string, parentId?: string): Promise<string> {
    const existing = parentId
      ? await this.findChildFolder(title, parentId)
      : await this.findRootFolder(title);

    if (existing) {
      return existing.id;
    }

    const created = await browser.bookmarks.create(parentId ? { title, parentId } : { title });
    return created.id;
  }

  private async findChildFolder(title: string, parentId: string): Promise<BookmarkTreeNode | undefined> {
    const children = await browser.bookmarks.getChildren(parentId);
    return children.find((node) => node.title === title && node.url === undefined);
  }

  // No fixed id/name identifies the root-level folder (e.g. "Other Bookmarks")
  // across browsers, so it's found the same way the browser would place an
  // unfoldered bookmark: search by exact title, then keep only folders that
  // sit directly under one of the tree's own top-level roots.
  private async findRootFolder(title: string): Promise<BookmarkTreeNode | undefined> {
    const [root] = await browser.bookmarks.getTree();
    const rootIds = new Set((root.children ?? []).map((node) => node.id));
    const matches = await browser.bookmarks.search({ title });

    return matches.find(
      (node) => node.url === undefined && node.parentId !== undefined && rootIds.has(node.parentId),
    );
  }
}
