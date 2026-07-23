import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconCheck, IconFolder, IconX } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { FolderTree } from './FolderTree';
import styles from './ConfirmFolderView.module.css';

interface Props {
  path: string;
  onPathChange: (path: string) => void;
  onCancel: () => void;
  onConfirm: (path: string) => void;
}

export function ConfirmFolderView({ path, onPathChange, onCancel, onConfirm }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.confirmColumn}>
      <div className={styles.hintRow}>
        <IconFolder size={14} className={styles.folderIcon} />
        <Input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          placeholder={t('popup.hintConfirm.pathPlaceholder')}
          className={styles.pathInput}
        />
      </div>

      <FolderTree selectedPath={path} onSelect={onPathChange} />

      <div className={styles.buttonRow}>
        <Button variant="outline" className={styles.actionBtn} onClick={onCancel}>
          <IconX size={14} className={styles.btnIcon} />
          {t('popup.hintConfirm.cancel')}
        </Button>
        <Button className={styles.actionBtn} onClick={() => onConfirm(path)}>
          <IconCheck size={14} className={styles.btnIcon} />
          {t('popup.hintConfirm.confirm')}
        </Button>
      </div>
    </div>
  );
}
