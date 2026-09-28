import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { IconSearch, IconStar } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { PopupScreen } from '@/lib/popup-screen';
import { Mode } from '@/types/mode';
import styles from './PopupHeader.module.css';

interface Props {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  screen: PopupScreen;
  onToggleScreen: () => void;
}

export function PopupHeader({ mode, onModeChange, screen, onToggleScreen }: Props) {
  const { translate: t } = useTranslation();
  const title = screen === PopupScreen.QUICK_SAVE ? t('popup.header.titleQuickSave') : t('popup.header.titleSearch');

  return (
    <div className={styles.header}>
      <img className={styles.logo} src="/icon/48.png" alt="" />

      <div className={styles.titles}>
        <Text size="caption" tone="muted">{t('popup.appName')}</Text>
        <Text size="subheading">{title}</Text>
      </div>

      <Switch
        checked={mode === Mode.ON}
        onCheckedChange={(checked) => onModeChange(checked ? Mode.ON : Mode.OFF)}
        aria-label={t('common.modeSectionTitle')}
      />

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleScreen}
        aria-label={screen === PopupScreen.QUICK_SAVE ? t('popup.header.openSearch') : t('popup.header.backToQuickSave')}
      >
        {screen === PopupScreen.QUICK_SAVE ? <IconSearch size="md" /> : <IconStar size="md" />}
      </Button>
    </div>
  );
}
