import { clsx } from 'clsx';
import { IconHome, IconNetwork, IconLibrary, IconSliders, IconTag } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './OptionsSidebar.module.css';

export const Tab = { MAIN: 'main', RULES: 'rules', LIBRARY: 'library', MAPPINGS: 'mappings', CATEGORIES: 'categories' } as const;
export type Tab = typeof Tab[keyof typeof Tab];

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

      <NavBtn active={tab === Tab.MAIN} onClick={() => onTabChange(Tab.MAIN)}>
        <IconHome size="md" />
        {t('nav.main')}
      </NavBtn>

      <NavBtn active={tab === Tab.RULES} onClick={() => onTabChange(Tab.RULES)}>
        <IconNetwork size="md" />
        {t('nav.rules')}
      </NavBtn>

      <NavBtn active={tab === Tab.LIBRARY} onClick={() => onTabChange(Tab.LIBRARY)}>
        <IconLibrary size="md" />
        {t('nav.library')}
      </NavBtn>

      <NavBtn active={tab === Tab.MAPPINGS} onClick={() => onTabChange(Tab.MAPPINGS)}>
        <IconSliders size="md" />
        {t('nav.mappings')}
      </NavBtn>

      <NavBtn active={tab === Tab.CATEGORIES} onClick={() => onTabChange(Tab.CATEGORIES)}>
        <IconTag size="md" />
        {t('nav.categories')}
      </NavBtn>
    </div>
  );
}
