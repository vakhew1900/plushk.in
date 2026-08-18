#!/usr/bin/env node
// Copies `name`/`description` frontmatter from .claude/skills/<name>/SKILL.md
// into the matching .agents/skills/<name>/SKILL.md stub, so the description
// only ever needs to be edited in one place. See .agents/AGENTS.md for why
// the stub can't just be a symlink (core.symlinks=false on this repo).

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const checkOnly = process.argv.includes('--check');

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const claudeSkillsDir = join(repoRoot, '.claude', 'skills');
const agentsSkillsDir = join(repoRoot, '.agents', 'skills');

function parseFrontmatter(text, filePath) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${filePath}: no frontmatter block found`);

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (fieldMatch) fields[fieldMatch[1]] = fieldMatch[2];
  }
  return fields;
}

function withFrontmatterField(text, field, value, filePath) {
  const re = new RegExp(`^(${field}:\\s*).*$`, 'm');
  if (!re.test(text)) throw new Error(`${filePath}: frontmatter has no "${field}" field to sync into`);
  return text.replace(re, `$1${value}`);
}

try {
  const changed = [];

  for (const entry of readdirSync(claudeSkillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const claudePath = join(claudeSkillsDir, entry.name, 'SKILL.md');
    const agentsPath = join(agentsSkillsDir, entry.name, 'SKILL.md');
    if (!existsSync(claudePath) || !existsSync(agentsPath)) continue;

    const claudeText = readFileSync(claudePath, 'utf8');
    const { name, description } = parseFrontmatter(claudeText, claudePath);
    if (!name || description === undefined) {
      throw new Error(`${claudePath}: missing "name" or "description" in frontmatter`);
    }

    const agentsText = readFileSync(agentsPath, 'utf8');
    let updated = withFrontmatterField(agentsText, 'name', name, agentsPath);
    updated = withFrontmatterField(updated, 'description', description, agentsPath);

    if (updated !== agentsText) {
      if (!checkOnly) writeFileSync(agentsPath, updated);
      changed.push(agentsPath);
    }
  }

  if (changed.length > 0) {
    console.log(checkOnly ? 'Out of sync — would update:' : 'Synced .agents skill frontmatter from .claude:');
    for (const file of changed) console.log(`  ${file}`);
    process.exitCode = 1;
  } else {
    console.log('.agents skill frontmatter already in sync.');
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 2;
}
