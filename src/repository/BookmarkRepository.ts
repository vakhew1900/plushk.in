import { browser } from 'wxt/browser';
import type { Browser } from 'wxt/browser';
import { splitFolderPath } from '../lib/bookmark-folder-utils';
import { debugLog } from '../lib/debug-log';
import { isFixedContainerId, isToolbarId } from '../lib/browser-constants/bookmarkRoots';
import type { BookmarkSearchEntry } from '../types/bookmark-search-entry';
import type { FolderNode } from '../types/folder-node';
import type { IBookmarkRepository } from './interfaces/IBookmarkRepository';

type BookmarkTreeNode = Browser.bookmarks.BookmarkTreeNode;

function parseFolderTree(nodes: BookmarkTreeNode[], parentPath = ''): FolderNode[] {
  const folders: FolderNode[] = [];
  for (const node of nodes) {
    if (node.url !== undefined) continue; // Skip bookmark links

    const isSystemRoot = node.id === '0';
    const isFixedContainer = isFixedContainerId(node.id);

    // The container's own path is still its title (needed so selecting it
    // directly, or an empty `''` targetFolder resolved to the Toolbar, round-
    // trips through findRootFolder's exact-container-title match below) — but
    // its children's paths reset to the container-agnostic convention that
    // `BookmarkRule.targetFolder`/`resolveFolderPath` already use ("Social/Reddit",
    // never "Bookmarks bar/Social/Reddit"). Without this reset, a path picked by
    // clicking the tree and a path written into a rule meant the same folder in
    // two different, incompatible string formats.
    const currentPath = isSystemRoot
      ? parentPath
      : parentPath
        ? `${parentPath}/${node.title}`
        : node.title;
    const childPath = isFixedContainer ? '' : currentPath;

    const children = node.children ? parseFolderTree(node.children, childPath) : [];

    if (isSystemRoot) {
      return children;
    }

    folders.push({
      id: node.id,
      title: node.title,
      path: currentPath,
      children,
    });
  }
  return folders;
}

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

  async getFolderTree(): Promise<FolderNode[]> {
    const tree = await browser.bookmarks.getTree();
    return parseFolderTree(tree);
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

    // A brand-new root-level folder (first path segment, no existing match
    // found anywhere) has no natural parent to nest under — default it to
    // the Bookmarks Toolbar instead of an unparented create(), which Chrome
    // resolves to "Other Bookmarks", not the Toolbar, silently filing rule-
    // created folders somewhere the user never chose.
    const effectiveParentId = parentId ?? (await this.resolveToolbarId());
    debugLog('[quick-save-debug] repo.findOrCreateFolder: no existing match, creating', { title, parentId: effectiveParentId });
    const created = await browser.bookmarks.create({ title, parentId: effectiveParentId });
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

    const toolbar = containers.find((node) => isToolbarId(node.id));
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

    const matches = await browser.bookmarks.search({ title });
    const folderMatches = matches.filter((node) => node.url === undefined && node.parentId !== undefined);

    // If the same-named folder exists directly under more than one container
    // (e.g. a stray "Social" left over under Other Bookmarks from earlier
    // testing/browsing, alongside a fresh one under the Toolbar), prefer the
    // Toolbar's — that's where findOrCreateFolder now defaults brand-new
    // folders to, so this keeps an existing match consistent with that.
    const orderedContainers = [...containers].sort((a, b) => {
      if (isToolbarId(a.id) === isToolbarId(b.id)) return 0;
      return isToolbarId(a.id) ? -1 : 1;
    });

    for (const container of orderedContainers) {
      const match = folderMatches.find((node) => node.parentId === container.id);
      if (match) {
        debugLog('[quick-save-debug] repo.findRootFolder: search fallback matched under container', { title, containerId: container.id, resolved: match });
        return match;
      }
    }

    debugLog('[quick-save-debug] repo.findRootFolder: no exact container, no search match', { title, matches });
    return undefined;
  }
}
