import { useServices } from '@/hooks/useServices';

export function useBookmarkDelete(bookmarkId: string) {
  const { bookmarkRepository } = useServices();

  const remove = async () => {
    await bookmarkRepository.removeWithCascade(bookmarkId);
  };

  return { remove };
}
