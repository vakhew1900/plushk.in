#!/usr/bin/env node
// Pulls one version's section out of CHANGELOG.md, used by the release workflow
// (.github/workflows/release.yml) to fill in a GitHub Release's body. Fails loudly
// if the section is missing/empty — a release shouldn't ship without changelog notes.
// Usage: node scripts/extract-changelog.mjs <version>

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/extract-changelog.mjs <version>');
  process.exitCode = 2;
  process.exit();
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const changelogPath = join(repoRoot, 'CHANGELOG.md');
const text = readFileSync(changelogPath, 'utf8');

const headingRe = new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\].*$`, 'm');
const match = headingRe.exec(text);
if (!match) {
  console.error(`CHANGELOG.md: no "## [${version}]" section found`);
  process.exitCode = 1;
  process.exit();
}

const rest = text.slice(match.index + match[0].length);
const nextHeadingOffset = rest.search(/^## \[/m);
const body = (nextHeadingOffset === -1 ? rest : rest.slice(0, nextHeadingOffset)).trim();

if (!body) {
  console.error(`CHANGELOG.md: "## [${version}]" section is empty`);
  process.exitCode = 1;
  process.exit();
}

console.log(body);
