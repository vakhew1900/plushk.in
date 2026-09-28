import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { IconCheck } from '@/components/icons';
import { PaletteColor } from '@/types/palette-color';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './color-picker.module.css';

const COLORS: PaletteColor[] = [
  PaletteColor.RED,
  PaletteColor.ORANGE,
  PaletteColor.YELLOW,
  PaletteColor.GREEN,
  PaletteColor.TEAL,
  PaletteColor.BLUE,
  PaletteColor.PURPLE,
  PaletteColor.PINK,
];

interface Props {
  value: PaletteColor;
  onChange: (color: PaletteColor) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  const { translate: t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={styles.trigger}
          data-color={value}
          aria-label={t('tagsSection.colorLabel')}
        />
      </PopoverTrigger>
      <PopoverContent className={styles.content}>
        <div className={styles.row}>
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={styles.swatch}
              data-color={color}
              data-selected={color === value || undefined}
              onClick={() => onChange(color)}
            >
              {color === value && <IconCheck size="sm" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
