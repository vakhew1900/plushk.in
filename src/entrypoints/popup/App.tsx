import './style.css';
import { useState } from 'react';
import { LocaleProvider } from '@/context/LocaleContext';
import { ServicesProvider } from '@/context/ServicesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useMode } from '@/hooks/useMode';
import { useTheme } from '@/hooks/useTheme';
import { PopupHeader } from '@/components/popup/PopupHeader';
import { PopupModeSelector } from '@/components/popup/PopupModeSelector';
import { PopupPageCard } from '@/components/popup/PopupPageCard';
import { PopupActions } from '@/components/popup/PopupActions';
import { PopupFooter } from '@/components/popup/PopupFooter';
import { PopupQuickSave } from '@/components/popup/PopupQuickSave';
import type { Mode } from '@/types/mode';
import styles from './App.module.css';

const PopupView = { QUICK_SAVE: 'quickSave', SETTINGS: 'settings' } as const;
type PopupView = typeof PopupView[keyof typeof PopupView];

function QuickSaveView({ mode, onOpenSettings }: { mode: Mode; onOpenSettings: () => void }) {
  return <PopupQuickSave mode={mode} onOpenSettings={onOpenSettings} />;
}

function SettingsView({ mode, setMode, onBack }: {
  mode: Mode;
  setMode: (mode: Mode) => void;
  onBack: () => void;
}) {
  return (
    <>
      <PopupHeader mode={mode} onBack={onBack} />
      <PopupModeSelector mode={mode} onChange={setMode} />
      {/* <PopupPageCard /> */}
      <PopupActions mode={mode} />
      <PopupFooter />
    </>
  );
}

function AppBody({ view, mode, setMode, onOpenSettings, onBack }: {
  view: PopupView;
  mode: Mode;
  setMode: (mode: Mode) => void;
  onOpenSettings: () => void;
  onBack: () => void;
}) {
  switch (view) {
    case PopupView.QUICK_SAVE:
      return <QuickSaveView mode={mode} onOpenSettings={onOpenSettings} />;
    case PopupView.SETTINGS:
      return <SettingsView mode={mode} setMode={setMode} onBack={onBack} />;
  }
}

function AppShell() {
  const { mode, setMode } = useMode();
  const { resolvedTheme } = useTheme();
  const [view, setView] = useState<PopupView>(PopupView.QUICK_SAVE);

  return (
    <div data-theme={resolvedTheme} className={styles.root}>
      <AppBody
        view={view}
        mode={mode}
        setMode={setMode}
        onOpenSettings={() => setView(PopupView.SETTINGS)}
        onBack={() => setView(PopupView.QUICK_SAVE)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <ServicesProvider>
          <AppShell />
        </ServicesProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
