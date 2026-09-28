import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { IconPlus } from '@/components/icons';
import { filterByName } from '@/lib/name-filter';
import { ListDetailRow } from './ListDetailRow';
import styles from './ListDetailSection.module.css';

interface Props<T> {
  title: string;
  desc: string;
  items: T[];
  getId: (item: T) => string;
  getName: (item: T) => string;
  /** Rendered before the name — e.g. a `PaletteDot`/`PaletteIconDot` for items that carry a color. Omitted entirely for items with no color concept. */
  renderLeading?: (item: T) => ReactNode;
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onAdd: () => void;
  addLabel: string;
  addDisabled?: boolean;
  /** Tooltip shown on the add button while `addDisabled` — explains why adding is blocked right now. */
  addDisabledHint?: string;
  searchPlaceholder: string;
  /** Shown in the list when the search query matches nothing. */
  noResultsLabel: string;
  /** Shown in place of `children` when `items` is empty. */
  emptyLabel: string;
  children: ReactNode;
}

export function ListDetailSection<T>({
  title,
  desc,
  items,
  getId,
  getName,
  renderLeading,
  selectedId,
  onSelect,
  onAdd,
  addLabel,
  addDisabled = false,
  addDisabledHint,
  searchPlaceholder,
  noResultsLabel,
  emptyLabel,
  children,
}: Props<T>) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => filterByName(items, query, getName), [items, query, getName]);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text as="h2" size="subheading">{title}</Text>
      </div>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{desc}</Text>

      <div className={styles.layout}>
        <div className={styles.list}>
          <div className={styles.searchBar}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.rows}>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <ListDetailRow
                  key={getId(item)}
                  name={getName(item)}
                  selected={getId(item) === selectedId}
                  leading={renderLeading?.(item)}
                  onSelect={() => onSelect(getId(item))}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                <Text size="caption" tone="muted">{noResultsLabel}</Text>
              </div>
            )}
          </div>

          <div className={styles.addBar}>
            <Button
              variant="outline"
              size="sm"
              onClick={onAdd}
              disabled={addDisabled}
              title={addDisabled ? addDisabledHint : undefined}
            >
              <IconPlus size="sm" />
              {addLabel}
            </Button>
          </div>
        </div>

        {items.length > 0 ? (
          <div className={styles.detail}>{children}</div>
        ) : (
          <div className={styles.empty}>
            <Text size="body" tone="muted">{emptyLabel}</Text>
          </div>
        )}
      </div>
    </section>
  );
}
