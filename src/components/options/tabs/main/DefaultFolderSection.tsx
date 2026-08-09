import { Input } from '@/components/ui/input';
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
      <h2 className={styles.h2}>{t('defaultFolderSection.title')}</h2>
      <p className={styles.sectionDesc}>{t('defaultFolderSection.desc')}</p>

      <div className={styles.folderRow}>
        <IconFolder size={14} className={styles.folderIcon} />
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
