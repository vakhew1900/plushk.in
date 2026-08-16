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
    // JSON
    { tag: tags.propertyName,      color: '#5c9ee0' },
    { tag: tags.string,            color: '#5cba8f' },
    { tag: tags.number,            color: '#7d6cf0' },
    { tag: [tags.bool, tags.null], color: '#e0746e' },
    { tag: tags.punctuation,       color: '#8b8b94' },
    { tag: tags.bracket,           color: '#8b8b94' },
    // CSS / XPath selectors
    { tag: tags.tagName,               color: '#5c9ee0' },
    { tag: tags.className,             color: '#5cba8f' },
    { tag: tags.labelName,             color: '#5cba8f' },
    { tag: tags.constant(tags.className), color: '#b7acf7' },
    { tag: tags.attributeName,         color: '#9b8ff5' },
    { tag: tags.function(tags.variableName), color: '#7d6cf0' },
    { tag: tags.atom,                  color: '#7d6cf0' },
    { tag: tags.logicOperator,         color: '#8b8b94' },
    { tag: tags.operator,              color: '#8b8b94' },
    { tag: tags.paren,                 color: '#8b8b94' },
    { tag: tags.squareBracket,         color: '#8b8b94' },
    { tag: tags.brace,                 color: '#8b8b94' },
    { tag: tags.separator,             color: '#8b8b94' },
  ],
});

export const dracula = createTheme({
  theme: 'dark',
  settings: {
    background:      '#282a36',
    foreground:      '#f8f8f2',
    caret:           '#f8f8f2',
    selection:       'rgba(68,71,90,0.65)',
    selectionMatch:  'rgba(68,71,90,0.4)',
    lineHighlight:   'rgba(68,71,90,0.35)',
    gutterBackground:'#282a36',
    gutterForeground:'#6272a4',
  },
  styles: [
    { tag: tags.propertyName,      color: '#8be9fd' },
    { tag: tags.string,            color: '#f1fa8c' },
    { tag: tags.number,            color: '#bd93f9' },
    { tag: [tags.bool, tags.null], color: '#ff79c6' },
    { tag: tags.punctuation,       color: '#6272a4' },
    { tag: tags.bracket,           color: '#6272a4' },
  ],
});
