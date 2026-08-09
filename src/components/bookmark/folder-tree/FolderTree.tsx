import { useState } from 'react';
import { IconFolder, IconArrowRight } from '@/components/icons';
import { debugLog } from '@/lib/debug-log';
import { useFolderTree } from '@/hooks/useFolderTree';
import type { FolderNode } from '@/types/folder-node';
import clsx from 'clsx';
import styles from './FolderTree.module.css';

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
  const tree = useFolderTree();

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
