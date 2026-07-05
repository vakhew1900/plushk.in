import { useState } from 'react';
import './style.css';
import { LocaleProvider } from '@/context/LocaleContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { PopupHeader } from '@/components/popup/PopupHeader';
import { PopupModeSelector } from '@/components/popup/PopupModeSelector';
import type { Mode } from '@/components/popup/PopupModeSelector';
import { PopupPageCard } from '@/components/popup/PopupPageCard';
import { PopupActions } from '@/components/popup/PopupActions';
import { PopupFooter } from '@/components/popup/PopupFooter';
import styles from './App.module.css';

function AppShell() {
  const [mode, setMode] = useState<Mode>('auto');
  const { resolvedTheme } = useTheme();

  return (
    <div data-theme={resolvedTheme} className={styles.root}>
      <PopupHeader mode={mode} />
      <PopupModeSelector mode={mode} onChange={setMode} />
      {/* <PopupPageCard /> */}
      <PopupActions mode={mode} />
      <PopupFooter />
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </LocaleProvider>
  );
}
