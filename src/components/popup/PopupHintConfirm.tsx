import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconCheck, IconX } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './PopupHintConfirm.module.css';

interface Props {
  targetFolder: string;
  onConfirm: (targetFolder: string) => void;
  onCancel: () => void;
}

export function PopupHintConfirm({ targetFolder, onConfirm, onCancel }: Props) {
  const { translate: t } = useTranslation();
  const [path, setPath] = useState(targetFolder);

  return (
    <div className={styles.wrap}>
      <Input
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder={t('popup.hintConfirm.pathPlaceholder')}
        className={styles.pathInput}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => onConfirm(path)}
        aria-label={t('popup.hintConfirm.confirm')}
      >
        <IconCheck size={14} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onCancel}
        aria-label={t('popup.hintConfirm.cancel')}
      >
        <IconX size={14} />
      </Button>
    </div>
  );
}
