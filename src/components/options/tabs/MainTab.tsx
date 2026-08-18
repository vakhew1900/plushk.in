import { useDefaultFolder } from '@/hooks/useDefaultFolder';
import { useMode } from '@/hooks/useMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Mode } from '@/types/mode';
import { TabHeader } from '@/components/options/TabHeader';
import { ModeCard } from './main/ModeCard';
import { DefaultFolderSection } from './main/DefaultFolderSection';
import { ThemeSection } from './main/ThemeSection';
import { LanguageSection } from './main/LanguageSection';
import { ExportImportSection } from './main/ExportImportSection';
import styles from './MainTab.module.css';

const MODES = [
  { key: Mode.ON, showFallback: true },
  { key: Mode.OFF },
] as const;

export function MainTab() {
  const { mode, setMode } = useMode();
  const { defaultFolder } = useDefaultFolder();
  const { translate: t } = useTranslation();
  return (
    <div>
      <TabHeader title={t('common.modeSectionTitle')} lead={t('mainTab.lead')} />

      <div className={styles.modeList}>
        {MODES.map(({ key, ...rest }) => (
          <ModeCard
            key={key}
            {...rest}
            label={t(`modes.${key}.label`)}
            tag={t(`modes.${key}.tag`)}
            desc={t(`modes.${key}.desc`)}
            selected={mode === key}
            onSelect={() => void setMode(key)}
            fallbackFolder={key === Mode.ON ? defaultFolder : undefined}
          />
        ))}
      </div> 
      <DefaultFolderSection />
      <ThemeSection />
      <LanguageSection />
      <ExportImportSection />
    </div>
  );
}
