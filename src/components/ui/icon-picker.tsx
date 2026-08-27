import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IconX } from '@/components/icons';
import { ICON_REGISTRY } from '@/components/icons/icon-registry';
import { IconName } from '@/types/icon-name';
import type { PaletteColor } from '@/types/palette-color';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './icon-picker.module.css';

const ICON_NAMES = Object.values(IconName);
const NONE_VALUE = '__none__';

interface Props {
  value: IconName | undefined;
  color: PaletteColor;
  onChange: (icon: IconName | undefined) => void;
}

export function IconPicker({ value, color, onChange }: Props) {
  const { translate: t } = useTranslation();
  const SelectedIcon = value ? ICON_REGISTRY[value] : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={styles.trigger}
          data-color={color}
          title={value ? undefined : t('entityDetail.noIcon')}
        >
          {SelectedIcon && <SelectedIcon size="lg" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className={styles.content}>
        <RadioGroup
          value={value ?? NONE_VALUE}
          onValueChange={(v) => onChange(v === NONE_VALUE ? undefined : (v as IconName))}
          className={styles.grid}
        >
          <RadioGroupItem value={NONE_VALUE} className={styles.item} title={t('entityDetail.noIcon')}>
            <IconX size="lg" />
          </RadioGroupItem>
          {ICON_NAMES.map((name) => {
            const Icon = ICON_REGISTRY[name];
            return (
              <RadioGroupItem key={name} value={name} className={styles.item}>
                <Icon size="lg" />
              </RadioGroupItem>
            );
          })}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
