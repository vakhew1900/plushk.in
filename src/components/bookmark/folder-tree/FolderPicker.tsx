import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconCheck, IconFolder } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { FolderTree } from './FolderTree';
import styles from './FolderPicker.module.css';

interface Props {
  path: string;
  onPathChange: (path: string) => void;
  onSave: (path: string) => void;
}

export function FolderPicker({ path, onPathChange, onSave }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.column}>
      <div className={styles.pathRow}>
        <IconFolder size="md" className={styles.folderIcon} />
        <Input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          placeholder={t('popup.folderPicker.pathPlaceholder')}
          className={styles.pathInput}
        />
      </div>

      <FolderTree selectedPath={path} onSelect={onPathChange} />

      <Button className={styles.saveButton} onClick={() => onSave(path)}>
        <IconCheck size="md" className={styles.btnIcon} />
        {t('popup.folderPicker.save')}
      </Button>
    </div>
  );
}
