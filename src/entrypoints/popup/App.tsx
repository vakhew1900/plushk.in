import './style.css';
import { useState } from 'react';
import { LocaleProvider } from '@/context/LocaleContext';
import { ServicesProvider } from '@/context/ServicesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useMode } from '@/hooks/useMode';
import { useTheme } from '@/hooks/useTheme';
import { PopupHeader } from '@/components/popup/shell/PopupHeader';
import { PopupFooter } from '@/components/popup/shell/PopupFooter';
import { PopupQuickSave } from '@/components/popup/PopupQuickSave';
import { PopupSearch } from '@/components/popup/PopupSearch';
import { PopupScreen } from '@/lib/popup-screen';
import styles from './App.module.css';

function AppShell() {
  const { mode, setMode } = useMode();
  const { resolvedTheme } = useTheme();
  const [screen, setScreen] = useState<PopupScreen>(PopupScreen.QUICK_SAVE);

  const toggleScreen = () => {
    setScreen(screen === PopupScreen.QUICK_SAVE ? PopupScreen.SEARCH : PopupScreen.QUICK_SAVE);
  };

  return (
    <div data-theme={resolvedTheme} className={styles.root}>
      <PopupHeader mode={mode} onModeChange={(value) => { void setMode(value); }} screen={screen} onToggleScreen={toggleScreen} />

      {screen === PopupScreen.QUICK_SAVE ? <PopupQuickSave mode={mode} /> : <PopupSearch />}

      <PopupFooter />
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
