import { useEffect, useMemo, useRef, useState } from 'react';
import { IconFolder, IconArrowRight } from '@/components/icons';
import { debugLog } from '@/lib/debug-log';
import { useFolderTree } from '@/hooks/useFolderTree';
import { collectAncestorIds, resolveToolbarPath, withPendingPath } from '@/lib/folder-tree';
import { useTranslation } from '@/hooks/useTranslation';
import type { FolderNode } from '@/types/folder-node';
import clsx from 'clsx';
import styles from './FolderTree.module.css';

interface TreeNodeProps {
  node: FolderNode;
  selectedPath: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (path: string) => void;
}

function FolderTreeNode({ node, selectedPath, expandedIds, onToggle, onSelect }: TreeNodeProps) {
  const { translate: t } = useTranslation();
  const hasChildren = node.children.length > 0;
  const isSelected = selectedPath === node.path && node.path !== '';
  const expanded = expandedIds.has(node.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  return (
    <div className={styles.treeNode}>
      <div
        data-selected={isSelected || undefined}
        className={clsx(styles.nodeRow, {
          [styles.selected]: isSelected,
          [styles.pending]: node.pending,
        })}
        onClick={() => {
          debugLog('[quick-save-debug] popup: FolderTree node clicked', { id: node.id, title: node.title, path: node.path });
          onSelect(node.path);
        }}
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
        <span className={styles.label}>{node.title}</span>
        {node.pending && <span className={styles.pendingTag}>{t('common.folderWillBeCreated')}</span>}
      </div>

      {hasChildren && expanded && (
        <div className={styles.childrenContainer}>
          {node.children.map((child) => (
            <FolderTreeNode
              key={child.id}
              node={child}
              selectedPath={selectedPath}
              expandedIds={expandedIds}
              onToggle={onToggle}
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
  const tree = useFolderTree();
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  // `''` means "no folder chosen" (Bookmarks Toolbar, per IDefaultFolderSettingsRepository/
  // BookmarkRepository convention) — resolve it to the real Toolbar node's path so the
  // tree actually highlights something instead of looking like nothing is selected.
  const toolbarPath = useMemo(() => resolveToolbarPath(tree), [tree]);
  const effectiveSelectedPath = selectedPath || toolbarPath || '';

  // A rule's/default folder's target can point at a path that doesn't exist
  // yet — BookmarkRepository creates missing segments on save. Without this,
  // that path would just be invisible here, with nothing to highlight.
  const displayTree = useMemo(
    () => withPendingPath(tree, effectiveSelectedPath),
    [tree, effectiveSelectedPath],
  );

  // Root containers (Bookmarks Toolbar/Other/Mobile) start expanded regardless
  // of selection — collapsing straight to an empty tree on first render would
  // hide the very folders users pick from most often. Expanding whatever the
  // live tree's own top level is (rather than a hardcoded id list) is what
  // makes this work identically in Chrome (numeric ids) and Firefox (GUIDs).
  useEffect(() => {
    if (tree.length === 0) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const node of tree) {
        if (!next.has(node.id)) {
          next.add(node.id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [tree]);

  // Reveal the full path to whatever is selected/suggested — a folder buried
  // three levels deep is useless to confirm if the tree never opens far
  // enough to show it. Only ever adds ids: a user's manual collapse elsewhere
  // in the tree is left alone.
  useEffect(() => {
    const ancestorIds = collectAncestorIds(displayTree, effectiveSelectedPath);
    if (ancestorIds.size === 0) return;

    setExpandedIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const id of ancestorIds) {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [displayTree, effectiveSelectedPath]);

  // Runs after the expansion above has actually rendered, so the selected
  // node exists in the DOM to scroll to.
  useEffect(() => {
    containerRef.current?.querySelector('[data-selected]')?.scrollIntoView({ block: 'nearest' });
  }, [expandedIds, effectiveSelectedPath]);

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.treeContainer} ref={containerRef}>
      {displayTree.map((node) => (
        <FolderTreeNode
          key={node.id}
          node={node}
          selectedPath={effectiveSelectedPath}
          expandedIds={expandedIds}
          onToggle={toggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
