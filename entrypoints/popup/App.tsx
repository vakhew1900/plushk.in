import { useState } from 'react';
import './style.css';
import { PopupHeader } from '@/components/popup/PopupHeader';
import { PopupModeSelector } from '@/components/popup/PopupModeSelector';
import type { Mode } from '@/components/popup/PopupModeSelector';
import { PopupPageCard } from '@/components/popup/PopupPageCard';
import { PopupActions } from '@/components/popup/PopupActions';
import { PopupFooter } from '@/components/popup/PopupFooter';
import styles from './App.module.css';

export default function App() {
  const [mode, setMode] = useState<Mode>('auto');

  return (
    <div data-theme="dark" className={styles.root}>
      <PopupHeader mode={mode} />
      <PopupModeSelector mode={mode} onChange={setMode} />
      <PopupPageCard />
      <PopupActions mode={mode} />
      <PopupFooter />
    </div>
  );
}
