import { useState } from 'react';
import './style.css';
import { OptionsSidebar } from '@/components/options/OptionsSidebar';
import type { Tab } from '@/components/options/OptionsSidebar';
import { MainTab } from '@/components/options/tabs/MainTab';
import { RulesTab } from '@/components/options/tabs/RulesTab';
import { AliasesTab } from '@/components/options/tabs/AliasesTab';
import styles from './App.module.css';

export default function App() {
  const [tab, setTab] = useState<Tab>('main');

  return (
    <div data-theme="dark" className={styles.root}>
      <div className={styles.chrome}>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.chromeTitle}>Сортировщик — Страница настроек</div>
        <div style={{ width: 42 }} />
      </div>

      <div className={styles.body}>
        <OptionsSidebar tab={tab} onTabChange={setTab} ruleCount={3} />
        <div className={styles.content}>
          {tab === 'main'    && <MainTab />}
          {tab === 'rules'   && <RulesTab />}
          {tab === 'aliases' && <AliasesTab />}
        </div>
      </div>
    </div>
  );
}
