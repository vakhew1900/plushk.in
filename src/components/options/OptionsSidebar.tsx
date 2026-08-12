import { clsx } from 'clsx';
import { IconHome, IconNetwork, IconLibrary, IconSliders, IconTag } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './OptionsSidebar.module.css';

export type Tab = 'main' | 'rules' | 'library' | 'mappings' | 'categories';

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

      <NavBtn active={tab === 'library'} onClick={() => onTabChange('library')}>
        <IconLibrary size="md" />
        {t('nav.library')}
      </NavBtn>

      <NavBtn active={tab === 'mappings'} onClick={() => onTabChange('mappings')}>
        <IconSliders size="md" />
        {t('nav.mappings')}
      </NavBtn>

      <NavBtn active={tab === 'categories'} onClick={() => onTabChange('categories')}>
        <IconTag size="md" />
        {t('nav.categories')}
      </NavBtn>
    </div>
  );
}
