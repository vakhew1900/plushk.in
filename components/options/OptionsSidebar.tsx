import { clsx } from 'clsx';
import { IconHome, IconNetwork, IconSliders } from '@/components/icons';
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
        <IconHome size={16} />
        Главное
      </NavBtn>

      <NavBtn active={tab === 'rules'} onClick={() => onTabChange('rules')}>
        <IconNetwork size={16} />
        Правила
        <span className={styles.count}>{ruleCount}</span>
      </NavBtn>

      <NavBtn active={tab === 'aliases'} onClick={() => onTabChange('aliases')}>
        <IconSliders size={16} />
        Алиасы
      </NavBtn>
    </div>
  );
}
