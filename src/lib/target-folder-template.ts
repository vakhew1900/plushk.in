// Deliberately permissive on the captured name (anything but `$`) rather than
// restricted to identifier characters: a malformed/mistyped token (e.g.
// `$$extras.subreddit$$`, which isn't a valid field/extras name) still needs
// to be *recognized* as a token attempt so it resolves to '' and collapses
// out of the path — leaving it unmatched would embed the literal `$$...$$`
// text as a real folder name instead.
const TOKEN_PATTERN = /\$\$([^$]+)\$\$/g;

/** Every `$$name$$` token name found in `template`, in order of appearance (duplicates included). */
export function extractTemplateTokenNames(template: string): string[] {
  return [...template.matchAll(TOKEN_PATTERN)].map((match) => match[1]);
}

/**
 * Substitutes each `$$name$$` token with `values[name]`. A name missing from
 * `values` (an unresolved token) collapses to the empty string — the caller
 * (`TargetFolderTemplateService`) is responsible for resolving and
 * sanitizing values before calling this; this function knows nothing about
 * `PageMeta`/service tokens.
 */
export function applyTargetFolderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(TOKEN_PATTERN, (_match, name: string) => values[name] ?? '');
}
