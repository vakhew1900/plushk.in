import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Text } from '@/components/ui/text';
import { EntitySegment } from '@/components/bookmark/entity/EntitySegment';
import { TagPicker } from '@/components/bookmark/tags/TagPicker';
import { IconChevronDown } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import type { EntityType } from '@/types/entity-type';
import type { Tag } from '@/types/tag';
import { IconField } from './IconField';
import styles from './AdvancedSection.module.css';

interface Props {
  entityTypes: EntityType[];
  selectedEntity: EntityType | undefined;
  onChooseEntity: (entityTypeId: string | undefined) => void;
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  matchedRuleName: string | undefined;
  iconUrl: string | undefined;
  matchedIconRuleName: string | undefined;
  onIconUrlChange: (value: string | undefined) => void;
}

export function AdvancedSection({
  entityTypes,
  selectedEntity,
  onChooseEntity,
  tags,
  selectedTagIds,
  onToggleTag,
  matchedRuleName,
  iconUrl,
  matchedIconRuleName,
  onIconUrlChange,
}: Props) {
  const { translate: t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={styles.wrap}>
      <CollapsibleTrigger className={styles.trigger}>
        <IconChevronDown size="sm" className={cn(styles.chev, open && styles.chevOpen)} />
        <Text size="body" weight="bold">{t('popup.quickSave.advanced.title')}</Text>
      </CollapsibleTrigger>

      <CollapsibleContent className={styles.content}>
        <IconField iconUrl={iconUrl} iconRuleName={matchedIconRuleName} onIconUrlChange={onIconUrlChange} />

        {entityTypes.length > 0 && (
          <div>
            <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
              {t('popup.quickSave.advanced.categoryLabel')}
            </Text>
            <EntitySegment entityTypes={entityTypes} selectedEntity={selectedEntity} onChoose={onChooseEntity} />
          </div>
        )}

        <div>
          <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
            {t('popup.quickSave.advanced.tagsLabel')}
          </Text>
          <TagPicker tags={tags} selectedTagIds={selectedTagIds} onToggle={onToggleTag} />
        </div>

        {matchedRuleName !== undefined && (
          <Text size="caption" className={styles.attribution}>
            {t('popup.quickSave.advanced.matchedByRule', { name: matchedRuleName })}
          </Text>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
