import { clsx } from 'clsx';
import { IconHome, IconNetwork, IconSearch, IconSliders, IconTag } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './OptionsSidebar.module.css';

export type Tab = 'main' | 'rules' | 'search' | 'aliases' | 'tags';

interface Props {
  tab: Tab;
  onTabChange: (t: Tab) => void;
}

function NavBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={clsx(styles.navBtn, active && styles.active)}>
      {children}
    </button>
  );
}

export function OptionsSidebar({ tab, onTabChange }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>{t('nav.section')}</div>

      <NavBtn active={tab === 'main'} onClick={() => onTabChange('main')}>
        <IconHome size="md" />
        {t('nav.main')}
      </NavBtn>

      <NavBtn active={tab === 'rules'} onClick={() => onTabChange('rules')}>
        <IconNetwork size="md" />
        {t('nav.rules')}
      </NavBtn>

      <NavBtn active={tab === 'search'} onClick={() => onTabChange('search')}>
        <IconSearch size="md" />
        {t('nav.search')}
      </NavBtn>

      <NavBtn active={tab === 'aliases'} onClick={() => onTabChange('aliases')}>
        <IconSliders size="md" />
        {t('nav.aliases')}
      </NavBtn>

      <NavBtn active={tab === 'tags'} onClick={() => onTabChange('tags')}>
        <IconTag size="md" />
        {t('nav.tags')}
      </NavBtn>
    </div>
  );
}
