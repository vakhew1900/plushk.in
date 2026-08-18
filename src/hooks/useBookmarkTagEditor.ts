import { useTags } from './useTags';
import { useBookmarkTagLink } from './useBookmarkTagLink';

export function useBookmarkTagEditor(bookmarkId: string) {
  const { items: tags } = useTags();
  const { tagIds, toggleTag } = useBookmarkTagLink(bookmarkId);

  return { tags, tagIds, toggleTag };
}
