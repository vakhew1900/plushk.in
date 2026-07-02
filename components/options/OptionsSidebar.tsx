import { clsx } from 'clsx';
import styles from './OptionsSidebar.module.css';

export type Tab = 'main' | 'rules' | 'aliases';

interface Props {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  ruleCount: number;
}

function NavBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={clsx(styles.navBtn, active && styles.active)}>
      {children}
    </button>
  );
}

export function OptionsSidebar({ tab, onTabChange, ruleCount }: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>Основное</div>

      <NavBtn active={tab === 'main'} onClick={() => onTabChange('main')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 11l8-7 8 7M6 10v9h12v-9" />
        </svg>
        Главное
      </NavBtn>

      <NavBtn active={tab === 'rules'} onClick={() => onTabChange('rules')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="6" r="2" fill="currentColor" />
          <circle cx="6" cy="18" r="2" fill="currentColor" />
          <circle cx="17" cy="12" r="2" fill="currentColor" />
          <path d="M8 6.5l7 4.5M8 17.5l7-4.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Правила
        <span className={styles.count}>{ruleCount}</span>
      </NavBtn>

      <NavBtn active={tab === 'aliases'} onClick={() => onTabChange('aliases')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h9M19 7h1M4 17h5M15 17h5" />
          <circle cx="16" cy="7" r="2.2" />
          <circle cx="11" cy="17" r="2.2" />
        </svg>
        Алиасы
      </NavBtn>
    </div>
  );
}
