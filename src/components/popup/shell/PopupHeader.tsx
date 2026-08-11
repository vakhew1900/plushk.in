import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { IconLogo, IconSearch, IconStar } from '@/components/icons';
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

  return (
    <div className={styles.header}>
      <div className={styles.icon}>
        <IconLogo size="lg" />
      </div>

      <div className={styles.meta}>
        <div className={styles.name}>{t('popup.appName')}</div>
        <div className={styles.sub}>{t('popup.appSub')}</div>
      </div>

      <label className={styles.modeToggle}>
        <span className={styles.modeLabel}>{t(`modes.${mode}.label`)}</span>
        <Switch
          checked={mode === Mode.ON}
          onCheckedChange={(checked) => onModeChange(checked ? Mode.ON : Mode.OFF)}
        />
      </label>

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
