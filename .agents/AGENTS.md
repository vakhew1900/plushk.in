# Project Rules

Full project guidance — architecture, code rules, git conventions, testing, specs workflow — lives in [CLAUDE.md](../CLAUDE.md) at the repo root. Read that file; it is not duplicated here so the two can't drift out of sync.

## Skills

Skills under `.agents/skills/<name>/` are thin stubs: real frontmatter (`name`/`description`, needed for discovery) but a body that just points to `.claude/skills/<name>/SKILL.md`, where the actual rules and `reference/*.md` files live. Don't add a `README.md` or `reference/` under `.agents/skills/<name>/` — there's nothing there to duplicate. (Not a symlink: this repo has `core.symlinks=false`, so a symlink would check out as a broken plain-text file on a typical Windows clone.)
