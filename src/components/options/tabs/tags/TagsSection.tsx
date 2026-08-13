import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useTags } from '@/hooks/useTags';
import { PaletteColor } from '@/types/palette-color';
import { TagRow } from './TagRow';
import styles from './TagsSection.module.css';

export function TagsSection() {
  const { translate: t } = useTranslation();
  const { items: tags, save, remove } = useTags();

  const addTag = () => void save({ id: crypto.randomUUID(), name: '', color: PaletteColor.RED });

  const renameTag = (id: string, name: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) void save({ ...tag, name });
  };

  const recolorTag = (id: string, color: PaletteColor) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) void save({ ...tag, color });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text as="h2" size="subheading">{t('tagsSection.title')}</Text>
        <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }} onClick={addTag}>
          <IconPlus size="sm" />
          {t('tagsSection.addTag')}
        </Button>
      </div>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{t('tagsSection.desc')}</Text>
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
