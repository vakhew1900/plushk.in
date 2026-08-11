import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useTags } from '@/hooks/useTags';
import { TagColor } from '@/types/tag';
import { TagRow } from './TagRow';
import styles from './TagsSection.module.css';

export function TagsSection() {
  const { translate: t } = useTranslation();
  const { items: tags, save, remove } = useTags();

  const addTag = () => void save({ id: crypto.randomUUID(), name: '', color: TagColor.RED });

  const renameTag = (id: string, name: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) void save({ ...tag, name });
  };

  const recolorTag = (id: string, color: TagColor) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) void save({ ...tag, color });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.h2}>{t('tagsSection.title')}</h2>
        <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }} onClick={addTag}>
          <IconPlus size={12} />
          {t('tagsSection.addTag')}
        </Button>
      </div>
      <p className={styles.sectionDesc}>{t('tagsSection.desc')}</p>
      <div className={styles.table}>
        {tags.map((tag) => (
          <TagRow
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onNameChange={(name) => renameTag(tag.id, name)}
            onColorChange={(color) => recolorTag(tag.id, color)}
            onRemove={() => void remove(tag.id)}
          />
        ))}
      </div>
    </section>
  );
}
