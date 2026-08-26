import { useServices } from '@/hooks/useServices';

export function useBookmarkMove(bookmarkId: string) {
  const { bookmarkRepository } = useServices();

  const moveTo = async (targetFolder: string) => {
    await bookmarkRepository.move(bookmarkId, targetFolder);
  };

  return { moveTo };
}
