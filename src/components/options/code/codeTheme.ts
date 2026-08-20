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

// Light companion to obsidianDark — used for CSS/XPath/Meta (code-input.tsx).
// Palette is the project's own [data-theme="light"] tokens (assets/globals.css),
// not invented colors. Approved via design review, see UI-14 in specs/changelog.md.
export const obsidianLight = createTheme({
  theme: 'light',
  settings: {
    background:      '#fbfaf7',
    foreground:      '#33312e',
    caret:           '#6a57d6',
    selection:       'rgba(106,87,214,0.12)',
    selectionMatch:  'rgba(106,87,214,0.07)',
    lineHighlight:   'rgba(106,87,214,0.05)',
    gutterBackground:'#fbfaf7',
    gutterForeground:'#a8a298',
  },
  styles: [
    // JSON
    { tag: tags.propertyName,      color: '#3f7fc4' },
    { tag: tags.string,            color: '#3f9d6f' },
    { tag: tags.number,            color: '#6a57d6' },
    { tag: [tags.bool, tags.null], color: '#cf5a52' },
    { tag: tags.punctuation,       color: '#76716a' },
    { tag: tags.bracket,           color: '#76716a' },
    // CSS / XPath selectors
    { tag: tags.tagName,               color: '#3f7fc4' },
    { tag: tags.className,             color: '#3f9d6f' },
    { tag: tags.labelName,             color: '#3f9d6f' },
    { tag: tags.constant(tags.className), color: '#4d3fa8' },
    { tag: tags.attributeName,         color: '#5c4bc2' },
    { tag: tags.function(tags.variableName), color: '#6a57d6' },
    { tag: tags.atom,                  color: '#6a57d6' },
    { tag: tags.logicOperator,         color: '#76716a' },
    { tag: tags.operator,              color: '#76716a' },
    { tag: tags.paren,                 color: '#76716a' },
    { tag: tags.squareBracket,         color: '#76716a' },
    { tag: tags.brace,                 color: '#76716a' },
    { tag: tags.separator,             color: '#76716a' },
  ],
});

// Light companion to dracula — used for the JSON condition view (CodeView.tsx).
// Deliberately its own warmer flavor, not a reuse of obsidianLight — see UI-14
// design review (specs/changelog.md): paired themes, not one shared light theme.
export const parchment = createTheme({
  theme: 'light',
  settings: {
    background:      '#f7f3ea',
    foreground:      '#3a352c',
    caret:           '#6a57d6',
    selection:       'rgba(106,87,214,0.16)',
    selectionMatch:  'rgba(106,87,214,0.09)',
    lineHighlight:   'rgba(106,87,214,0.05)',
    gutterBackground:'#f7f3ea',
    gutterForeground:'#a89f8c',
  },
  styles: [
    { tag: tags.propertyName,      color: '#3d6fa8' },
    { tag: tags.string,            color: '#6a7f4f' },
    { tag: tags.number,            color: '#6a57d6' },
    { tag: [tags.bool, tags.null], color: '#b5533f' },
    { tag: tags.punctuation,       color: '#8b8272' },
    { tag: tags.bracket,           color: '#8b8272' },
  ],
});
