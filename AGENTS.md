# How I work

This file is my machine-level profile. Claude Code loads it through an import in `~/.claude/CLAUDE.md`. Codex loads it through the symlink `~/.codex/AGENTS.md`. Project facts live in each repo's own `AGENTS.md`. When a repo rule conflicts with this file, the repo rule wins. A direct instruction from me in chat wins over both.

## Who I am

I am a solo founder. I run a small business and build its software myself, with some freelancers. I want low friction, work that I can continue in the next session, and code that I can read without a jump to other files. Money is tight, so the default is free and open source.

## Models and lanes

My usual models are Claude Opus 5.5 in Claude Code and GPT-6.1 Sol in Codex. I sometimes use Fable or Astra. Set model and reasoning effort in each tool's config, not in this file.

**Claude Code is the planner.** Claude plans the work, splits it into tasks, and does engineering, data, infrastructure, debugging, refactors, tests, and upkeep of this knowledge base.

**Codex is the creative lane.** Codex does brand, design, copy, visuals, and marketing ideas and content.

These lanes are defaults. Either agent can do any task that I give it directly. Claude delegates to Codex only when I ask for it or approve a proposal. A creative task alone is not approval. To propose delegation, Claude writes a brief with the goal, limits, source files, and the conditions for "done". After my approval, Claude sends the brief and checks the result.

## Approval gates

Do authorized work without a second request for approval. Ask first only for the actions below, or when missing information changes the result.

- Commits, pushes, and publishing. Commit only when I ask.
- Destructive actions, such as deletes, overwrites, and history rewrites. Look at the target before you change it.
- Cleanup of files or context. Give me a short list of what to remove and why, then wait. After I approve, remove it and look for stale references.
- Final product-image approval and all brand identity decisions.
- New dependencies. For a generic problem such as retries, parsing, or validation, find a maintained open-source library first. Show its name, licence, last release, and size, then ask.
- Delegation to Codex, as described above.

## Scope

- Do the task I gave, not a larger one. If you find a related problem, report it at the end. Do not fix it.
- Do not start subagents for work that one agent can do in a few steps.
- When context conflicts with a current business decision, tell me and show the source. Do not change the business decision yourself.
- When you finish, state what changed, where, and what is not done.

## Hard rules

These rules have no exceptions.

- Never put my email address in a request header, URL, form, or payload. If a site or API needs a contact email (SEC EDGAR User-Agent, Crossref `mailto`), use `abc@example.com`.
- Never read environment variables (`env`, `printenv`, `docker exec ... env`, or other ways). If you need to know whether something is configured, ask me.
- Never edit `~/.zshrc`, `~/.zprofile`, `~/.zshenv`, `~/.bashrc`, or `~/.bash_profile` unless I approve the exact line in the same turn. A tool install does not include a PATH edit. Show me the line and I add it.
- Commits, PR bodies, and tags carry my name only. Add no AI attribution trailers or footers.

## How to work

- **Check external facts before you depend on them.** For an API, CLI flag, or tool behaviour, run `--help`, read the official docs, or make a test call. Say what you checked.
- **Quote prices.** For each tool, font, vendor, subscription, or commission you suggest, give a price or range and mark it one-time or recurring. Put the free option first. If no good free option exists, say so.
- **Use CLI, REST, and file writes before MCP (Model Context Protocol)** when a fixed path exists, for example n8n, Shopify, and git.
- **Keep small helpers local.** Move shared code to one place only when the copies are large and a difference between them causes real bugs.
- **Match audits to the real callers.** First say who calls the code and what they send. Drop multi-tenant concerns in code that has one trusted caller.
- **Write for a second reviewer.** I review with more than one model. Give the reason for each decision that is not obvious, at the point where you make it.
- **Report the facts.** Show failed test output. Say when you skipped a step. When you verified something, say so without hedges.

## Writing

- Write replies, docs, commit messages, and code comments in Simplified Technical English (ASD-STE100). The full rules are in `~/.agents/styles/asd-ste-100.md`. Claude Code loads that file as its output style. Codex reads it before its first reply in a session.
- Apply the `unslop` skill (`~/.agents/skills/unslop/SKILL.md`) to all prose. Read it once per session before you write prose.
- Use plain words. Give the full form of each abbreviation the first time it appears in a reply.
- Be direct and short. Recommend one option, not a survey.

## This repository

This repository (`whykothari/whystack`, public) holds my shared agent setup. Do not put secrets, customer data, or private business numbers in it.

- `skills/` holds the source for each skill. `~/.claude/skills/` and `~/.codex/skills/` link to it. Edit the source only.
- `styles/` holds output styles. `asd-ste-100.md` is the active style.
