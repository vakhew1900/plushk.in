import { createTheme } from '@uiw/codemirror-themes';
import { tags } from '@lezer/highlight';

export const obsidianDark = createTheme({
  theme: 'dark',
  settings: {
    background:      '#1a1a1d',
    foreground:      '#d8d8dc',
    caret:           '#7d6cf0',
    selection:       'rgba(125,108,240,0.22)',
    selectionMatch:  'rgba(125,108,240,0.12)',
    lineHighlight:   'rgba(125,108,240,0.06)',
    gutterBackground:'#1a1a1d',
    gutterForeground:'#56565f',
  },
  styles: [
    { tag: tags.propertyName,      color: '#5c9ee0' },
    { tag: tags.string,            color: '#5cba8f' },
    { tag: tags.number,            color: '#7d6cf0' },
    { tag: [tags.bool, tags.null], color: '#e0746e' },
    { tag: tags.punctuation,       color: '#8b8b94' },
    { tag: tags.bracket,           color: '#8b8b94' },
  ],
});
