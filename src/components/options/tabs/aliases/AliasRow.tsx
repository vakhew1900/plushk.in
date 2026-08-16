import { Input } from '@/components/ui/input';
import { IconPlus } from '@/components/icons';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './AliasRow.module.css';

interface Props {
  name: string;
  domains: string[];
  onNameChange: (name: string) => void;
  onDomainChange: (index: number, domain: string) => void;
  onAddDomain: () => void;
  onRemoveDomain: (index: number) => void;
  onRemove: () => void;
}

export function AliasRow({
  name,
  domains,
  onNameChange,
  onDomainChange,
  onAddDomain,
  onRemoveDomain,
  onRemove,
}: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onBlur={() => { if (!name.trim()) onRemove(); }}
        placeholder={t('aliasesSection.namePlaceholder')}
        className={styles.nameInput}
      />
      <div className={styles.tags}>
        {domains.map((d, i) => (
          <div key={i} className={styles.domainChip}>
            <Input
              value={d}
              onChange={(e) => onDomainChange(i, e.target.value)}
              placeholder={t('aliasesSection.domainPlaceholder')}
              className={styles.domainInput}
            />
            <RemoveIconButton onClick={() => onRemoveDomain(i)} />
          </div>
        ))}
        <button onClick={onAddDomain} className={styles.addChip}><IconPlus size="sm" /></button>
      </div>
      <RemoveIconButton onClick={onRemove} className={styles.removeRow} />
    </div>
  );
}
