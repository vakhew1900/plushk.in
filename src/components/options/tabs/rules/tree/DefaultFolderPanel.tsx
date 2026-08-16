import { Text } from '@/components/ui/text';
import { IconFolder } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useDefaultFolder } from '@/hooks/useDefaultFolder';
import styles from './DefaultFolderPanel.module.css';

export function DefaultFolderPanel() {
  const { translate: t } = useTranslation();
  const { defaultFolder } = useDefaultFolder();

  return (
    <div className={styles.wrap}>
      <Text size="subheading">{t('defaultFolderSection.title')}</Text>
      <Text size="body" tone="muted">{t('ruleTree.rootPanelDesc')}</Text>
      <div className={styles.folderRow}>
        <IconFolder size="md" />
        <span className={styles.folderPath}>{defaultFolder || t('common.bookmarksBar')}</span>
      </div>
    </div>
  );
}
