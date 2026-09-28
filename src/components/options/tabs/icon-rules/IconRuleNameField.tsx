import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './IconRuleNameField.module.css';

interface Props {
  name: string;
  enabled: boolean;
  onNameChange: (name: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  onRemove: () => void;
}

export function IconRuleNameField({ name, enabled, onNameChange, onEnabledChange, onRemove }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onBlur={() => { if (!name.trim()) onRemove(); }}
        placeholder={t('iconRulesSection.namePlaceholder')}
        className={styles.nameInput}
      />
      <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      <RemoveIconButton onClick={onRemove} />
    </div>
  );
}
