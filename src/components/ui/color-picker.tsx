import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaletteColor } from '@/types/palette-color';
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
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as PaletteColor)}
      className={styles.root}
    >
      {COLORS.map((color) => (
        <RadioGroupItem key={color} value={color} className={styles.swatch} data-color={color} />
      ))}
    </RadioGroup>
  );
}
