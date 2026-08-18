import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { IconFolder } from '@/components/icons';
import { FolderTree } from '@/components/bookmark/folder-tree/FolderTree';
import { useDefaultFolder } from '@/hooks/useDefaultFolder';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './DefaultFolderSection.module.css';

export function DefaultFolderSection() {
  const { translate: t } = useTranslation();
  const { defaultFolder, setDefaultFolder } = useDefaultFolder();

  return (
    <section className={styles.section}>
      <Text as="h2" size="subheading" className={styles.h2}>{t('defaultFolderSection.title')}</Text>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{t('defaultFolderSection.desc')}</Text>

      <div className={styles.folderRow}>
        <IconFolder size="md" className={styles.folderIcon} />
        <Input
          value={defaultFolder}
          onChange={(e) => void setDefaultFolder(e.target.value)}
          placeholder={t('defaultFolderSection.placeholder')}
          className={styles.pathInput}
        />
      </div>

      <FolderTree selectedPath={defaultFolder} onSelect={(path) => void setDefaultFolder(path)} />
    </section>
  );
}
