import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { IconSearch } from '@/components/icons';
import { useFolderTree } from '@/hooks/useFolderTree';
import { filterFolderTree } from '@/lib/folder-tree';
import { useTranslation } from '@/hooks/useTranslation';
import { FolderTree } from './FolderTree';
import styles from './FolderTreeSearch.module.css';

interface Props {
  selectedPath: string;
  /** `undefined` when the user picks one of the top-level root containers — see the guard in the caller. */
  onSelect: (path: string | undefined) => void;
}

/**
 * `FolderTree` plus a name-only search box on top, filtering which nodes it
 * renders. Deliberately not built as a prop on `FolderTree` itself — this
 * owns the query state and the live tree fetch, then hands `FolderTree` an
 * already-filtered node list via its `tree` override prop.
 */
export function FolderTreeSearch({ selectedPath, onSelect }: Props) {
  const { translate: t } = useTranslation();
  const tree = useFolderTree();
  const [query, setQuery] = useState('');
  const filteredTree = filterFolderTree(tree, query);

  // The three fixed root containers (Bookmarks Toolbar/Other/Mobile) can't be
  // matched recursively — BookmarkSearchEntry.folderPath doesn't carry a
  // consistent enough signal to scope "everything under this container"
  // (see BookmarkSearchService.matchesFolder). Selecting one just clears the
  // filter instead of applying a filter that would silently match nothing.
  const handleSelect = (path: string) => {
    const isRootContainer = tree.some((node) => node.path === path);
    onSelect(isRootContainer ? undefined : path);
  };

  return (
    <div className={styles.column}>
      <div className={styles.searchRow}>
        <IconSearch size="sm" className={styles.searchIcon} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchTab.filters.folderSearchPlaceholder')}
          className={styles.searchInput}
        />
      </div>

      {filteredTree.length > 0 ? (
        <FolderTree
          tree={filteredTree}
          selectedPath={selectedPath}
          onSelect={handleSelect}
          forceExpandAll={query.trim().length > 0}
        />
      ) : (
        <div className={styles.empty}>{t('searchTab.filters.folderNoMatches')}</div>
      )}
    </div>
  );
}
