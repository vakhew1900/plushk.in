import { clsx } from 'clsx';
import { IconHome, IconNetwork, IconSliders } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { translate: t } = useTranslation();
  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>{t('nav.section')}</div>

      <NavBtn active={tab === 'main'} onClick={() => onTabChange('main')}>
        <IconHome size={16} />
        {t('nav.main')}
      </NavBtn>

      <NavBtn active={tab === 'rules'} onClick={() => onTabChange('rules')}>
        <IconNetwork size={16} />
        {t('nav.rules')}
        <span className={styles.count}>{ruleCount}</span>
      </NavBtn>

      <NavBtn active={tab === 'aliases'} onClick={() => onTabChange('aliases')}>
        <IconSliders size={16} />
        {t('nav.aliases')}
      </NavBtn>
    </div>
  );
}
