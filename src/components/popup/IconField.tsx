import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { IconEdit, IconImage } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './IconField.module.css';

interface Props {
  iconUrl: string | undefined;
  iconRuleName: string | undefined;
  onIconUrlChange: (value: string | undefined) => void;
}

/** Icon preview + override field in the quick-save popup's "Дополнительно" section — see RULE-13. */
export function IconField({ iconUrl, iconRuleName, onIconUrlChange }: Props) {
  const { translate: t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(iconUrl ?? '');
  const [broken, setBroken] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(iconUrl ?? '');
    setEditing(next);
  };

  const confirm = () => {
    onIconUrlChange(draft.trim() || undefined);
    setEditing(false);
  };

  return (
    <div>
      <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
        {t('popup.quickSave.advanced.iconLabel')}
      </Text>
      <div className={styles.iconRow}>
        <div className={styles.iconSwatch}>
          {iconUrl && !broken ? (
            <img src={iconUrl} alt="" onError={() => setBroken(true)} />
          ) : (
            <IconImage size="sm" />
          )}
        </div>

        {iconRuleName !== undefined && (
          <Text size="caption" className={styles.iconRuleCaption}>
            {t('popup.quickSave.advanced.iconMatchedByRule', { name: iconRuleName })}
          </Text>
        )}

        <Popover open={editing} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <IconButton
              icon={IconEdit}
              className={styles.iconEditTrigger}
              title={t('popup.quickSave.advanced.iconEditTooltip')}
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className={styles.iconLinkPopover}>
              <Input
                autoFocus
                value={draft}
                placeholder={t('popup.quickSave.advanced.iconLinkPlaceholder')}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className={styles.iconLinkActions}>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  {t('popup.quickSave.advanced.iconLinkCancel')}
                </Button>
                <Button size="sm" onClick={confirm}>
                  {t('popup.quickSave.advanced.iconLinkDone')}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
