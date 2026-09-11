# plushk.in

*Your shelf for forgotten things.*

🇷🇺 [Русская версия](README.ru.md)

**plushk.in** is a Manifest V3 browser extension that automatically sorts your bookmarks into folders using rules you define — instead of a flat, ever-growing "Favorites" list. It also extracts saved pages into Markdown and can push notes straight into [Obsidian](https://obsidian.md/) via its Local REST API plugin.

## Features

- **Rule-based sorting.** Save a page through the extension's popup and it lands directly in the right folder, resolved by matching conditions (domain, title, URL, regex, wildcards, custom fields...) against the page's metadata.
- **Elasticsearch-inspired rule DSL.** Rules are plain JSON trees combining `and` / `or` / `not` with leaf matchers (`term`, `terms`, `regex`, `wildcard`) — expressive enough for nested, prioritized rule hierarchies, simple enough to hand to an LLM (see below).
- **Domain aliases.** Group regional mirrors of the same site under one alias and reference it in a rule instead of listing every domain by hand.
- **Tags & shelf entities.** Attach tags and content-type categories (Book, Video, Article...) to bookmarks, optionally with a reading/watching-progress workflow (to-read → reading → done).
- **Markdown export + Obsidian integration.** Extracts article content with `@mozilla/readability` + `turndown` and can send the resulting note to Obsidian.
- **Local-first.** All rules, tags, and metadata live in IndexedDB on your machine — nothing is sent anywhere unless you explicitly wire up the Obsidian integration.
- **Import/export.** Back up or share your entire rule/tag/alias configuration as a single settings file.

## Tech stack

WXT · React · TypeScript · CSS Modules · Radix UI, with Dexie.js (IndexedDB) for storage.

## Getting started

```bash
npm run dev         # dev mode with hot reload (Chrome)
npm run dev:firefox # dev mode with hot reload (Firefox)
npm run build        # production build
npm run zip           # package the extension for store submission
```

Load the built extension as an unpacked/temporary add-on in your browser to try it out.

## Writing rules with an AI assistant

A rule's condition is a small JSON tree. It's compact and structured enough that you can describe what you want in plain language and have an LLM (Claude, ChatGPT, etc.) write the JSON for you — then paste it straight into the rule editor's **JSON** view (Options → Rules tab → open a rule → JSON toggle). The name, target folder, and priority are set separately in the form; only the *condition* is JSON.

### What a condition matches against

Each rule is evaluated against a page's metadata:

| Field | Type | Meaning |
|---|---|---|
| `url` | `string` | Full page URL |
| `domain` | `string` | Page's hostname |
| `title` | `string` | Page `<title>` |
| `description` | `string?` | `<meta name="description">` |
| `author` | `string?` | `<meta name="author">` / OpenGraph |
| `language` | `string?` | `<html lang>` |
| `ogType` | `string?` | `og:type` |
| `tags` | `string[]?` | `<meta name="keywords">` / OpenGraph tags |
| `publishedAt` | `string?` | Article publish date |
| `content` | `string?` | Full extracted article text |
| `extras.*` | `string \| string[]` | Any user-defined custom field |

### Rule grammar

**Compound nodes** combine sub-rules:

```json
{ "type": "and", "nodes": [ <rule>, <rule>, ... ] }
{ "type": "or",  "nodes": [ <rule>, <rule>, ... ] }
{ "type": "not", "nodes": [ <rule>, <rule>, ... ] }
```

**Leaf nodes** match one field:

```json
{ "type": "term",     "field": "domain", "value": "youtube.com" }
{ "type": "terms",    "field": "tags",   "values": ["tutorial", "lecture"] }
{ "type": "regex",    "field": "url",    "pattern": ".*\\/watch\\?v=.*" }
{ "type": "wildcard", "field": "domain", "pattern": "*.edu" }
```

`field` can be any key from the table above, including `extras.<yourCustomField>`.

**Example** — YouTube videos tagged or titled as tutorials:

```json
{
  "type": "and",
  "nodes": [
    { "type": "term", "field": "domain", "value": "youtube.com" },
    {
      "type": "or",
      "nodes": [
        { "type": "terms",    "field": "tags",  "values": ["tutorial", "course"] },
        { "type": "wildcard", "field": "title", "pattern": "*tutorial*" }
      ]
    }
  ]
}
```

### Prompt template

Copy this into your LLM of choice, filling in the description at the bottom:

```
You write rule conditions for a bookmark-sorting browser extension. A
condition is a JSON tree with two kinds of nodes:

Compound nodes combine sub-rules:
  { "type": "and", "nodes": [ ... ] }
  { "type": "or",  "nodes": [ ... ] }
  { "type": "not", "nodes": [ ... ] }

Leaf nodes match one field:
  { "type": "term",     "field": "<field>", "value": "<string>" }
  { "type": "terms",    "field": "<field>", "values": ["<string>", ...] }
  { "type": "regex",    "field": "<field>", "pattern": "<regex>" }
  { "type": "wildcard", "field": "<field>", "pattern": "<glob with * and ?>" }

Available fields: url, domain, title, description, author, language,
ogType, tags, publishedAt, content, and any extras.<name> custom field.

Output ONLY the JSON condition tree, no explanation, matching this request:

<describe what you want to match here, e.g. "GitHub repository pages
whose title mentions 'rust' or 'go', but not gists">
```

Paste the resulting JSON into the rule editor's JSON view, then set the rule's name, target folder, and priority in the form.

## License

MIT — see [LICENSE](LICENSE).
