import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './BookmarkDeleteDialog.module.css';

interface Props {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** Shared confirmation for both delete entry points — the card rail's trash icon and the settings panel's delete button. See UI-16. */
export function BookmarkDeleteDialog({ open, title, onOpenChange, onConfirm }: Props) {
  const { translate: t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>{t('bookmarkSettings.deleteDialogTitle', { title })}</AlertDialogTitle>
        <AlertDialogDescription>{t('bookmarkSettings.deleteDialogBody')}</AlertDialogDescription>

        <div className={styles.actions}>
          <AlertDialogCancel asChild>
            <Button variant="outline" size="sm">{t('bookmarkSettings.deleteDialogCancel')}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" size="sm" onClick={onConfirm}>
              {t('bookmarkSettings.deleteDialogConfirm')}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
