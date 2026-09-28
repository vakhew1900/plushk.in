import * as React from 'react';
import { Input } from './input';
import styles from './picker-search.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Needed inside a Radix `DropdownMenu`/`Menu`-based popover — stop the menu's own keyboard navigation (arrow keys, typeahead) from intercepting keystrokes meant for this field. */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

/** Sticky search field for the top of a `Popover`/`DropdownMenu` picker's scrollable content — stays pinned above the list instead of scrolling away with it. */
export const PickerSearch = React.forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, placeholder, onKeyDown }, ref) => (
    <div className={styles.bar}>
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  ),
);
PickerSearch.displayName = 'PickerSearch';
