import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { IconFolder, IconArrowRight } from '@/components/icons';
import clsx from 'clsx';
import styles from './FolderTree.module.css';

interface BookmarkTreeNode {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  children?: BookmarkTreeNode[];
}

export interface FolderNode {
  id: string;
  title: string;
  path: string;
  children: FolderNode[];
}

function parseBookmarkTree(nodes: BookmarkTreeNode[], parentPath = ''): FolderNode[] {
  const folders: FolderNode[] = [];
  for (const node of nodes) {
    if (node.url !== undefined) continue; // Skip bookmark links

    const isSystemRoot = node.id === '0';
    // '1' is typically Bookmarks Bar, '2' is Other Bookmarks, '3' is Mobile Bookmarks
    const isTopLevelContainer = node.parentId === '0' || node.id === '1' || node.id === '2' || node.id === '3';

    let currentPath = parentPath;
    if (!isSystemRoot && !isTopLevelContainer) {
      currentPath = parentPath ? `${parentPath}/${node.title}` : node.title;
    }

    const children = node.children ? parseBookmarkTree(node.children, currentPath) : [];

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

interface TreeNodeProps {
  node: FolderNode;
  selectedPath: string;
  onSelect: (path: string) => void;
}

function FolderTreeNode({ node, selectedPath, onSelect }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(node.id === '1' || node.id === '2' || node.id === '3');
  const hasChildren = node.children.length > 0;
  const isSelected = selectedPath === node.path && node.path !== '';

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className={styles.treeNode}>
      <div
        className={clsx(styles.nodeRow, {
          [styles.selected]: isSelected,
        })}
        onClick={() => onSelect(node.path)}
      >
        <span
          className={clsx(styles.caret, {
            [styles.caretExpanded]: expanded,
            [styles.caretHidden]: !hasChildren,
          })}
          onClick={handleToggle}
        >
          <IconArrowRight size={10} />
        </span>
        <IconFolder size={14} className={styles.folderIcon} />
        <span className={styles.label}>{node.title || 'Root'}</span>
      </div>

      {hasChildren && expanded && (
        <div className={styles.childrenContainer}>
          {node.children.map((child) => (
            <FolderTreeNode
              key={child.id}
              node={child}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  selectedPath: string;
  onSelect: (path: string) => void;
}

export function FolderTree({ selectedPath, onSelect }: FolderTreeProps) {
  const [tree, setTree] = useState<FolderNode[]>([]);

  useEffect(() => {
    browser.bookmarks.getTree().then((nodes) => {
      const folderTree = parseBookmarkTree(nodes);
      setTree(folderTree);
    });
  }, []);

  return (
    <div className={styles.treeContainer}>
      {tree.map((node) => (
        <FolderTreeNode
          key={node.id}
          node={node}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
