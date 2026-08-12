import { IconEdit } from '@/components/icons';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { useBookmarkTagEditor } from '@/hooks/useBookmarkTagEditor';
import { BookmarkTagChip } from './BookmarkTagChip';
import styles from './BookmarkTagEditor.module.css';

interface Props {
  bookmarkId: string;
}

export function BookmarkTagEditor({ bookmarkId }: Props) {
  const { tags, selectedTags, tagIds, toggleTag } = useBookmarkTagEditor(bookmarkId);

  return (
    <div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
      {selectedTags.map((tag) => (
        <BookmarkTagChip key={tag.id} tag={tag} />
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={styles.editButton} onClick={(e) => e.stopPropagation()}>
            <IconEdit size="sm" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
          {tags.length === 0 && <div className={styles.empty}>—</div>}
          {tags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag.id}
              checked={tagIds.includes(tag.id)}
              onCheckedChange={() => void toggleTag(tag.id)}
              onSelect={(e) => e.preventDefault()}
            >
              {tag.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
