import { browser } from 'wxt/browser';
import type { Browser } from 'wxt/browser';
import { splitFolderPath } from '../lib/bookmark-folder-utils';
import { debugLog } from '../lib/debug-log';
import { BookmarkRootId } from '../lib/browser-constants/bookmarkRoots';
import type { BookmarkSearchEntry } from '../types/bookmark-search-entry';
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
    debugLog('[quick-save-debug] repo.create: called with', { title, url, targetFolder });

    // No folder chosen ("root") → Bookmarks Toolbar specifically, not
    // whatever the browser defaults an unparented bookmarks.create() call to
    // (Other Bookmarks in Firefox).
    const parentId = targetFolder ? await this.resolveFolderPath(targetFolder) : await this.resolveToolbarId();
    debugLog('[quick-save-debug] repo.create: resolved parentId', parentId, 'for targetFolder', targetFolder);
    return browser.bookmarks.create({ title, url, parentId });
  }

  async move(id: string, targetFolder?: string): Promise<void> {
    const parentId = targetFolder ? await this.resolveFolderPath(targetFolder) : await this.resolveToolbarId();
    await browser.bookmarks.move(id, { parentId });
  }

  async getByTitle(title: string): Promise<BookmarkTreeNode[]> {
    const results = await browser.bookmarks.search({ title });
    return results.filter((node) => node.title === title && node.url !== undefined);
  }

  async listAll(): Promise<BookmarkSearchEntry[]> {
    const [root] = await browser.bookmarks.getTree();
    return this.collectBookmarks(root.children ?? [], []);
  }

  private collectBookmarks(nodes: BookmarkTreeNode[], parentPath: string[]): BookmarkSearchEntry[] {
    const entries: BookmarkSearchEntry[] = [];

    for (const node of nodes) {
      if (node.url !== undefined) {
        entries.push({ id: node.id, title: node.title, url: node.url, folderPath: parentPath });
        continue;
      }
      entries.push(...this.collectBookmarks(node.children ?? [], [...parentPath, node.title]));
    }

    return entries;
  }

  private async resolveFolderPath(path: string): Promise<string> {
    const segments = splitFolderPath(path);
    debugLog('[quick-save-debug] repo.resolveFolderPath: segments', segments, 'from path', path);
    let parentId: string | undefined;

    for (const segment of segments) {
      parentId = await this.findOrCreateFolder(segment, parentId);
      debugLog('[quick-save-debug] repo.resolveFolderPath: resolved segment', segment, '-> id', parentId);
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
      debugLog('[quick-save-debug] repo.findOrCreateFolder: found existing', { title, parentId, existingId: existing.id, existingParentId: existing.parentId });
      return existing.id;
    }

    debugLog('[quick-save-debug] repo.findOrCreateFolder: no existing match, creating', { title, parentId });
    const created = await browser.bookmarks.create(parentId ? { title, parentId } : { title });
    debugLog('[quick-save-debug] repo.findOrCreateFolder: created', created);
    return created.id;
  }

  // The Bookmarks Toolbar's id isn't the same across browsers — match either
  // known one; if neither is present (unknown browser), fall back to the
  // first top-level container as a best effort.
  private async resolveToolbarId(): Promise<string> {
    const [root] = await browser.bookmarks.getTree();
    const containers = root.children ?? [];
    debugLog('[quick-save-debug] repo.resolveToolbarId: containers', containers.map((c) => ({ id: c.id, title: c.title })));

    const toolbar = containers.find(
      (node) => node.id === BookmarkRootId.CHROME.TOOLBAR || node.id === BookmarkRootId.FIREFOX.TOOLBAR,
    );
    const resolved = toolbar ?? containers[0];

    if (!resolved) {
      throw new Error('No top-level bookmark container found');
    }

    return resolved.id;
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
    const containers = root.children ?? [];

    // Bookmarks Toolbar / Other Bookmarks / Mobile Bookmarks are fixed
    // containers that can't be created — bookmarks.create() with no parentId
    // just lands wherever the browser defaults, not necessarily the container
    // FolderTree's caller picked. If the title names one of them exactly,
    // resolve it directly instead of falling through to search+create.
    const exactContainer = containers.find((node) => node.title === title);
    if (exactContainer) {
      debugLog('[quick-save-debug] repo.findRootFolder: exact container match', { title, id: exactContainer.id });
      return exactContainer;
    }

    const containerIds = new Set(containers.map((node) => node.id));
    const matches = await browser.bookmarks.search({ title });

    const match = matches.find(
      (node) => node.url === undefined && node.parentId !== undefined && containerIds.has(node.parentId),
    );
    debugLog('[quick-save-debug] repo.findRootFolder: no exact container, search fallback', { title, matches, resolved: match });
    return match;
  }
}
