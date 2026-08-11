import type { CSSProperties } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TagColor } from '@/types/tag';
import styles from './TagColorPicker.module.css';

const COLORS: TagColor[] = [
  TagColor.RED,
  TagColor.ORANGE,
  TagColor.YELLOW,
  TagColor.GREEN,
  TagColor.TEAL,
  TagColor.BLUE,
  TagColor.PURPLE,
  TagColor.PINK,
];

interface Props {
  value: TagColor;
  onChange: (color: TagColor) => void;
}

export function TagColorPicker({ value, onChange }: Props) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as TagColor)}
      className={styles.root}
    >
      {COLORS.map((color) => (
        <RadioGroupItem
          key={color}
          value={color}
          className={styles.swatch}
          style={{ '--swatch-color': `var(--tag-${color})` } as CSSProperties}
        />
      ))}
    </RadioGroup>
  );
}
