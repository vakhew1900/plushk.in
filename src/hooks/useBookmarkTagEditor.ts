import { useTags } from './useTags';
import { useBookmarkTagLink } from './useBookmarkTagLink';

export function useBookmarkTagEditor(bookmarkId: string) {
  const { items: tags } = useTags();
  const { tagIds, toggleTag } = useBookmarkTagLink(bookmarkId);

  const selectedTags = tags.filter((tag) => tagIds.includes(tag.id));

  return { tags, selectedTags, tagIds, toggleTag };
}
