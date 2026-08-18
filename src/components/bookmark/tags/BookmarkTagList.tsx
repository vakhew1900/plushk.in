import { useBookmarkTagEditor } from '@/hooks/useBookmarkTagEditor';
import { TagPicker } from './TagPicker';

interface Props {
  bookmarkId: string;
}

export function BookmarkTagList({ bookmarkId }: Props) {
  const { tags, tagIds, toggleTag } = useBookmarkTagEditor(bookmarkId);

  return <TagPicker tags={tags} selectedTagIds={tagIds} onToggle={(tagId) => void toggleTag(tagId)} />;
}
