import { StreamLanguage } from '@codemirror/language';
import type { StringStream } from '@codemirror/language';

const AXES = [
  'ancestor-or-self', 'ancestor', 'attribute', 'child', 'descendant-or-self', 'descendant',
  'following-sibling', 'following', 'namespace', 'parent', 'preceding-sibling', 'preceding', 'self',
];

const AXIS_RE = new RegExp(`^(${AXES.join('|')})(?=::)`);
const WORD_OPERATOR_RE = /^(and|or|mod|div)\b/;
const STRING_DOUBLE_RE = /^"(?:[^"\\]|\\.)*"?/;
const STRING_SINGLE_RE = /^'(?:[^'\\]|\\.)*'?/;
const ATTRIBUTE_RE = /^@[\w-]+/;
const NUMBER_RE = /^\d+(\.\d+)?/;
const FUNCTION_RE = /^[a-zA-Z_][\w-]*(?=\s*\()/;
const NODE_TEST_RE = /^(\*|[a-zA-Z_][\w-]*(:[a-zA-Z_][\w-]*)?)/;
const PATH_SEP_RE = /^[./]/;
const COMPARISON_RE = /^(!=|<=|>=|=|<|>|\|)/;

function token(stream: StringStream, _state: unknown): string | null {
  if (stream.eatSpace()) return null;

  if (stream.match(STRING_DOUBLE_RE) || stream.match(STRING_SINGLE_RE)) {
    return 'string';
  }

  if (stream.match(ATTRIBUTE_RE)) {
    return 'attributeName';
  }

  if (stream.match(NUMBER_RE)) {
    return 'number';
  }

  if (stream.match(AXIS_RE)) return 'keyword';

  if (stream.match('::')) return 'operator';

  if (stream.match(WORD_OPERATOR_RE)) return 'logicOperator';

  if (stream.match(FUNCTION_RE)) return 'variableName.function';

  if (stream.match(NODE_TEST_RE)) {
    return 'tagName';
  }

  if (stream.match('//') || stream.match('..') || stream.match(PATH_SEP_RE)) {
    return 'punctuation';
  }

  if (stream.match(COMPARISON_RE)) {
    return 'operator';
  }

  if (stream.match('[') || stream.match(']')) return 'squareBracket';
  if (stream.match('(') || stream.match(')')) return 'paren';

  stream.next();
  return null;
}

export const xpathLanguage = StreamLanguage.define({
  token,
});
