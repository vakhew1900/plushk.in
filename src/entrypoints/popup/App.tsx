import './style.css';
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
import styles from './App.module.css';

function AppShell() {
  const { mode, setMode } = useMode();
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
        <ServicesProvider>
          <AppShell />
        </ServicesProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
