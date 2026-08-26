import { useBookmarkEntityEditor } from '@/hooks/useBookmarkEntityEditor';
import { useBookmarkTagEditor } from '@/hooks/useBookmarkTagEditor';
import { PaletteIconDot } from '@/components/ui/palette-icon-dot';
import { BookmarkFavicon, BookmarkFaviconSize } from './BookmarkFavicon';
import { BookmarkTagChip } from './tags/BookmarkTagChip';
import styles from './CompactBookmarkCard.module.css';

interface Props {
  id: string;
  title: string;
  url: string;
  onClick: () => void;
}

/** Read-only category/tags — the popup search list doesn't offer inline editing, unlike `BookmarkCard`. */
export function CompactBookmarkCard({ id, title, url, onClick }: Props) {
  const domain = new URL(url).hostname;
  const { selectedEntity } = useBookmarkEntityEditor(id);
  const { tags, tagIds } = useBookmarkTagEditor(id);
  const selectedTags = tags.filter((tag) => tagIds.includes(tag.id));
  const hasMeta = Boolean(selectedEntity) || selectedTags.length > 0;

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.head}>
        <BookmarkFavicon seed={domain} url={url} bookmarkId={id} size={BookmarkFaviconSize.SM} />
        <div className={styles.meta}>
          <div className={styles.title} title={title}>{title}</div>
          <div className={styles.domain}>{domain}</div>
        </div>
      </div>

      {hasMeta && (
        <div className={styles.foot}>
          {selectedEntity && (
            <span className={styles.category} data-color={selectedEntity.color}>
              <PaletteIconDot color={selectedEntity.color} icon={selectedEntity.icon} size="sm" />
              {selectedEntity.name}
            </span>
          )}
          {selectedTags.map((tag) => (
            <BookmarkTagChip key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
